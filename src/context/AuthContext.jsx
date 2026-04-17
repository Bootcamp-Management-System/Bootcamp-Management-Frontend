import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(undefined);
const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';
const OTP_SESSION_KEY = 'auth_otp_session';
const FORCE_PASSWORD_SESSION_KEY = 'auth_force_password_session';
const APPROVAL_SESSION_KEY = 'auth_approval_session';

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    const storedOtpSession = localStorage.getItem(OTP_SESSION_KEY);
    const storedForcePasswordSession = localStorage.getItem(FORCE_PASSWORD_SESSION_KEY);
    const storedApprovalSession = localStorage.getItem(APPROVAL_SESSION_KEY);

    return {
      user: null,
      token: null,
      otpSession: storedOtpSession ? JSON.parse(storedOtpSession) : null,
      forcePasswordSession: storedForcePasswordSession ? JSON.parse(storedForcePasswordSession) : null,
      approvalSession: storedApprovalSession ? JSON.parse(storedApprovalSession) : null,
      isAuthenticated: false,
      isLoading: false,
    };
  });

  const updateState = (patch) => {
    setState((prev) => ({ ...prev, ...patch }));
  };

  useEffect(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  }, []);

  useEffect(() => {
    if (state.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, state.token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }

    if (state.user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(state.user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }

    if (state.otpSession) {
      localStorage.setItem(OTP_SESSION_KEY, JSON.stringify(state.otpSession));
    } else {
      localStorage.removeItem(OTP_SESSION_KEY);
    }

    if (state.forcePasswordSession) {
      localStorage.setItem(FORCE_PASSWORD_SESSION_KEY, JSON.stringify(state.forcePasswordSession));
    } else {
      localStorage.removeItem(FORCE_PASSWORD_SESSION_KEY);
    }

    if (state.approvalSession) {
      localStorage.setItem(APPROVAL_SESSION_KEY, JSON.stringify(state.approvalSession));
    } else {
      localStorage.removeItem(APPROVAL_SESSION_KEY);
    }
  }, [state.token, state.user, state.otpSession, state.forcePasswordSession, state.approvalSession]);

  const login = async (email, password) => {
    updateState({ isLoading: true });

    try {
      const response = await authService.login({ email, password });
      const { user, token } = response;

      if (user.approvalStatus !== 'approved') {
        updateState({
          user,
          token: null,
          isAuthenticated: false,
          approvalSession: { email: user.email },
          isLoading: false,
        });

        return { requiresApproval: true, user };
      }

      if (response.requiresPasswordChange || user.requiresPasswordChange) {
        updateState({
          user,
          token: null,
          isAuthenticated: false,
          forcePasswordSession: { email: user.email, purpose: 'force-change-password' },
          isLoading: false,
        });

        return { requiresPasswordChange: true, user };
      }

      updateState({
        user,
        token,
        isAuthenticated: true,
        otpSession: null,
        forcePasswordSession: null,
        approvalSession: null,
        isLoading: false,
      });

      return { requiresPasswordChange: false, user };
    } catch (error) {
      updateState({ isLoading: false });
      throw error;
    }
  };

  const googleLogin = async () => {
    updateState({ isLoading: true });

    try {
      const response = await authService.googleLogin();
      updateState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        otpSession: null,
        forcePasswordSession: null,
        approvalSession: null,
        isLoading: false,
      });

      return response;
    } catch (error) {
      updateState({ isLoading: false });
      throw error;
    }
  };

  const signup = async (payload) => {
    const response = await authService.signup(payload);
    updateState({
      otpSession: { email: response.user.email, purpose: 'register' },
      approvalSession: null,
      forcePasswordSession: null,
    });
    return response;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(OTP_SESSION_KEY);
    localStorage.removeItem(FORCE_PASSWORD_SESSION_KEY);
    localStorage.removeItem(APPROVAL_SESSION_KEY);
    updateState({
      user: null,
      token: null,
      otpSession: null,
      forcePasswordSession: null,
      approvalSession: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const forgotPassword = async (email) => {
    const response = await authService.forgotPassword({ email });

    updateState({ otpSession: { email: response.email, purpose: 'forgot-password' } });

    return response;
  };

  const resendOTP = async (email, purpose) => {
    const targetEmail = email || state.otpSession?.email || state.user?.email;
    const targetPurpose = purpose || state.otpSession?.purpose || 'forgot-password';

    if (!targetEmail) {
      throw new Error('No email available for OTP resend');
    }

    return authService.resendOtp({ email: targetEmail, purpose: targetPurpose });
  };

  const verifyOTP = async (otp, email, purpose) => {
    const targetEmail = email || state.otpSession?.email || state.user?.email;
    const targetPurpose = purpose || state.otpSession?.purpose;

    if (!targetEmail) {
      throw new Error('No email available for OTP verification');
    }

    if (!targetPurpose) {
      throw new Error('No OTP purpose available for verification');
    }

    const response = await authService.verifyOtp({ email: targetEmail, otp, purpose: targetPurpose });

    if (targetPurpose === 'register') {
      updateState({
        otpSession: null,
        approvalSession: { email: targetEmail },
      });
    }

    return response;
  };

  const checkApproval = async (email) => {
    const targetEmail = email || state.approvalSession?.email;

    if (!targetEmail) {
      throw new Error('No email available for approval check');
    }

    const response = await authService.checkApproval({ email: targetEmail });

    if (response.isApproved) {
      updateState({ approvalSession: null });
    }

    return response;
  };

  const mockApproveUser = async (email) => {
    const targetEmail = email || state.approvalSession?.email;

    if (!targetEmail) {
      throw new Error('No email available for approval action');
    }

    const response = await authService.mockApproveUser({ email: targetEmail });
    updateState({ approvalSession: null });
    return response;
  };

  const changePassword = async (password, email) => {
    const targetEmail = email || state.forcePasswordSession?.email || state.user?.email;

    if (!targetEmail) {
      throw new Error('No email available for password change');
    }

    const response = await authService.changePassword({ email: targetEmail, password });

    updateState({
      user: response.user,
      token: response.token,
      otpSession: null,
      forcePasswordSession: null,
      approvalSession: null,
      isAuthenticated: true,
      isLoading: false,
    });

    return response;
  };

  const resetPassword = async (newPassword, email) => {
    const targetEmail = email || state.otpSession?.email;

    if (!targetEmail) {
      throw new Error('No email available for password reset');
    }

    const response = await authService.resetPassword({ email: targetEmail, password: newPassword });
    updateState({ otpSession: null });
    return response;
  };

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      login, 
      signup,
      googleLogin, 
      logout, 
      verifyOTP, 
      checkApproval,
      mockApproveUser,
      changePassword, 
      forgotPassword, 
      resendOTP,
      resetPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
