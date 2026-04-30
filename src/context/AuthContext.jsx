import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(undefined);

const normalizeUser = (user) => {
  if (!user) return null;
  const id = user.id || user._id;
  return {
    ...user,
    id,
    _id: id,
    role:
      user.role === 'super-admin' || user.role === 'super admin'
        ? 'super_admin'
        : user.role === 'student'
          ? 'member'
          : user.role,
  };
};

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [selectedDivision, setSelectedDivision] = useState(() => {
    const saved = localStorage.getItem('global_division');
    return saved || 'All';
  });

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      try {
        let parsedUser = normalizeUser(JSON.parse(storedUser));

      if (parsedUser.role === 'member' && (!parsedUser.divisions || parsedUser.divisions.length < 4)) {
        parsedUser.divisions = ["Development", "Cyber Security", "Data Science", "CP (Competitive Programming)"];
        localStorage.setItem('auth_user', JSON.stringify(parsedUser));
      }

        if (!storedToken.startsWith('demo_token_')) {
          const verifiedUser = await authService.getCurrentUser();
          parsedUser = normalizeUser({ ...parsedUser, ...verifiedUser });
          localStorage.setItem('auth_user', JSON.stringify(parsedUser));
        }

        if (cancelled) return;

      setState({
        token: storedToken,
        user: parsedUser,
        isAuthenticated: true,
        isLoading: false,
      });

      if (parsedUser.role === 'super_admin') {
        const savedDivision = localStorage.getItem('global_division') || 'All';
        setSelectedDivision(savedDivision);
      } else if (parsedUser.division) {
        setSelectedDivision(parsedUser.division);
      }
      } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        if (!cancelled) {
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }

    };

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const setSession = ({ user, token }) => {
    const normalizedUser = normalizeUser(user);
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
    if (normalizedUser) {
      localStorage.setItem('auth_user', JSON.stringify(normalizedUser));
    } else {
      localStorage.removeItem('auth_user');
    }

    setState({
      user: normalizedUser || null,
      token: token || null,
      isAuthenticated: Boolean(normalizedUser) && Boolean(token),
      isLoading: false,
    });
  };

  const demoLogin = (role) => {
    const normalizedRole = role === 'super-admin' || role === 'super admin' ? 'super_admin' : role;

    const demoUser = {
      id: `demo_${normalizedRole}`,
      idNo: 'UGR/90001/26',
      campusId: 'UGR/90001/26',
      email:
        normalizedRole === 'super_admin'
          ? 'admin.demo@astu.edu.et'
          : normalizedRole === 'admin'
            ? 'admin.demo@astu.edu.et'
            : normalizedRole === 'instructor'
              ? 'instructor.demo@astu.edu.et'
              : 'member.demo@astu.edu.et',
      role: normalizedRole,
      name:
        normalizedRole === 'super_admin'
          ? 'Super Admin Demo'
          : normalizedRole === 'admin'
            ? 'Admin Demo'
            : normalizedRole === 'instructor'
              ? 'Instructor Demo'
              : 'Student Demo',
      status: 'Demo Session',
      firstLogin: false,
      division: normalizedRole === 'member' ? 'Development' : 'All',
      divisions:
        normalizedRole === 'member'
          ? ['Development', 'Cyber Security', 'Data Science', 'CP (Competitive Programming)']
          : ['All'],
    };

    const demoToken = `demo_token_${normalizedRole}_${Math.random().toString(36).slice(2)}`;
    setSession({ user: demoUser, token: demoToken });

    if (normalizedRole === 'super_admin') {
      setSelectedDivision(localStorage.getItem('global_division') || 'All');
    } else if (demoUser.division) {
      setSelectedDivision(demoUser.division);
    }

    return { user: demoUser, token: demoToken };
  };

  const login = async (identifier, password) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const result = await authService.login({ email: identifier, password });
      const { token, requiresPasswordChange, requiresApproval, requiresOtp } = result || {};
      const user = normalizeUser(result?.user);

      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }

      if (user) {
        localStorage.setItem('auth_user', JSON.stringify(user));
      }

      if (requiresOtp && user?.email) {
        localStorage.setItem('pending_otp_email', user.email);
      }

      setState({
        user: user || null,
        token: token || null,
        isAuthenticated: Boolean(token) && !requiresPasswordChange && !requiresApproval,
        isLoading: false,
      });

      if (user?.role === 'super_admin') {
        const savedDivision = localStorage.getItem('global_division') || 'All';
        setSelectedDivision(savedDivision);
      } else if (user?.division) {
        setSelectedDivision(user.division);
      }

      return result;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signup = async (userData) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const result = await authService.signup(userData);
      // Store OTP for development
      if (result.otpCode) {
        localStorage.setItem('dev_otp', result.otpCode);
      }
      setState(prev => ({ ...prev, isLoading: false }));
      return result;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const googleLogin = async () => {
    await login('google_user@example.com', '');
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('global_division');
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    setSelectedDivision('All');
  };

  const setGlobalDivision = (division) => {
    setSelectedDivision(division);
    localStorage.setItem('global_division', division);
  };

  const verifyOTP = async ({ email, otp, newPassword }) => {
    const targetEmail = email || state.user?.email || localStorage.getItem('pending_otp_email');
    if (!targetEmail) {
      throw new Error('Email is required for OTP verification.');
    }

    const response = await authService.verifyOtpBackend({
      email: targetEmail,
      otp,
      newPassword,
    });

    if (response?.token && response?.user) {
      setSession({ user: response.user, token: response.token });
    }

    localStorage.removeItem('pending_otp_email');
    return response;
  };

  const resendOtp = async ({ email }) => {
    const targetEmail = email || state.user?.email || localStorage.getItem('pending_otp_email');
    if (!targetEmail) {
      throw new Error('Email is required for OTP resend.');
    }

    const response = await authService.resendOtp({ email: targetEmail });

    // Store OTP for development
    if (response.otpCode) {
      localStorage.setItem('dev_otp', response.otpCode);
    }

    return response;
  };

  const changePassword = async (_password) => {
    if (state.user) {
      const updatedUser = { ...state.user, firstLogin: false };
      const mockToken = 'mock_jwt_token_after_first_login';

      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));

      setState({
        user: updatedUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });
    }
  };

  const forgotPassword = async (email) => {
    return await authService.forgotPassword({ email });
  };

  const resetPassword = async (_otp, _newPassword) => {
    // Simulate password reset
  };

  const updateProfile = async (updates) => {
    if (state.user) {
      // Strictly prevent updating verified/identity fields from the user side
      const {
        id,
        idNo,
        email,
        role,
        attendance,
        division,
        status,
        firstLogin,
        ...allowedUpdates
      } = updates;

      const updatedUser = { ...state.user, ...allowedUpdates };
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      setState(prev => ({ ...prev, user: updatedUser }));
    }
  };

  const completeOnboarding = async (onboardingData) => {
    try {
      const result = await authService.completeOnboarding(onboardingData);
      const updatedUser = { ...state.user, ...onboardingData, firstLogin: false };
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      setState(prev => ({ ...prev, user: updatedUser }));
      return result;
    } catch (error) {
      console.error('Onboarding failed:', error);
      throw error;
    }
  };

  const switchRole = () => {
    if (state.user) {
      const originalRole = state.user.originalRole || state.user.role;
      if (originalRole === 'instructor') {
        const newRole = state.user.role === 'instructor' ? 'student' : 'instructor';
        const updatedUser = { 
          ...state.user, 
          role: newRole,
          originalRole: originalRole
        };
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        setState(prev => ({ ...prev, user: updatedUser }));
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      selectedDivision,
      setGlobalDivision,
      demoLogin,
      login,
      signup,
      googleLogin,
      logout,
      verifyOTP,
      resendOtp,
      changePassword,
      forgotPassword,
      resetPassword,
      updateProfile,
      completeOnboarding,
      switchRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
