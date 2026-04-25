import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(undefined);

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
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Migration: Normalize backend roles and ensure divisions exist for old sessions
      if (parsedUser.role === 'super-admin' || parsedUser.role === 'super admin') {
        parsedUser.role = 'super_admin';
      }

      if (parsedUser.role === 'member' && (!parsedUser.divisions || parsedUser.divisions.length < 4)) {
        parsedUser.divisions = ["Development", "Cyber Security", "Data Science", "CP (Competitive Programming)"];
        localStorage.setItem('auth_user', JSON.stringify(parsedUser));
      }
      
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
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (identifier, password) => {
    setState(prev => ({ ...prev, isLoading: true }));

    const mockUser = {
      id: '1',
      idNo: 'CSEC/ASTU/' + Math.floor(1000 + Math.random() * 9000),
      email,
      role,
      isFirstLogin,
      name: email.split('@')[0].split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      bio: role === 'admin' ? "System Administrator" : "CSEC Member since 2024. Passionate about building impactful software.",
      status: "Active Member",
      attendance: "92%",
      division: role === 'member' ? "Development" : userDivision,
      divisions: role === 'member' ? ["Development", "Cyber Security", "Data Science", "CP (Competitive Programming)"] : [userDivision]
    };

    const mockToken = 'mock_jwt_token_' + Math.random().toString(36).substring(7);

    if (!isFirstLogin) {
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      setState({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });
      return {
        user: mockUser,
        token: mockToken,
        requiresApproval: false,
        requiresPasswordChange: false,
      };
    } else {
    try {
      const result = await authService.login({ email: identifier, password });
      const { user, token, requiresPasswordChange, requiresApproval, requiresOtp } = result || {};

      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }

      if (user) {
        // Normalize role for frontend
        if (user.role === 'super-admin' || user.role === 'super admin') {
          user.role = 'super_admin';
        }
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
      return {
        user: mockUser,
        token: null,
        requiresApproval: false,
        requiresPasswordChange: true,
      };

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

    localStorage.removeItem('pending_otp_email');
    return response;
  };

  const changePassword = async (_password) => {
    if (state.user) {
      const updatedUser = { ...state.user, isFirstLogin: false };
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

  const forgotPassword = async (_email) => {
    // Simulate sending OTP
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
        isFirstLogin,
        ...allowedUpdates 
      } = updates;
      
      const updatedUser = { ...state.user, ...allowedUpdates };
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      setState(prev => ({ ...prev, user: updatedUser }));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      selectedDivision,
      setGlobalDivision,
      login, 
      googleLogin, 
      logout, 
      verifyOTP, 
      changePassword, 
      forgotPassword, 
      resetPassword,
      updateProfile
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
