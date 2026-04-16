import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(undefined);
const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';
const OTP_SESSION_KEY = 'auth_otp_session';

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUser = localStorage.getItem(AUTH_USER_KEY);
    const storedOtpSession = localStorage.getItem(OTP_SESSION_KEY);

    return {
      user: storedUser ? JSON.parse(storedUser) : null,
      token: storedToken || null,
      otpSession: storedOtpSession ? JSON.parse(storedOtpSession) : null,
      isAuthenticated: Boolean(storedToken && storedUser),
      isLoading: false,
    };
  });

  const updateState = (patch) => {
    setState((prev) => ({ ...prev, ...patch }));
  };

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
  }, [state.token, state.user, state.otpSession]);

  const login = async (email, password) => {
    updateState({ isLoading: true });

    try {
      const response = await authService.login({ email, password });
      const { user, token } = response;

      if (user.isFirstLogin) {
        updateState({
          user,
          token: null,
          isAuthenticated: false,
          otpSession: { email: user.email, purpose: 'first-login' },
          isLoading: false,
        });

        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        localStorage.setItem(OTP_SESSION_KEY, JSON.stringify({ email: user.email, purpose: 'first-login' }));

        return { requiresOtp: true, user };
      }

      updateState({
        user,
        token,
        isAuthenticated: true,
        otpSession: null,
        isLoading: false,
      });

      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      localStorage.removeItem(OTP_SESSION_KEY);

      return { requiresOtp: false, user };
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
        isLoading: false,
      });

      localStorage.setItem(AUTH_TOKEN_KEY, response.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));
      localStorage.removeItem(OTP_SESSION_KEY);

      return response;
    } catch (error) {
      updateState({ isLoading: false });
      throw error;
    }
  };

  const signup = async (payload) => {
    return authService.signup(payload);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(OTP_SESSION_KEY);
    updateState({
      user: null,
      token: null,
      otpSession: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const forgotPassword = async (email) => {
    const response = await authService.forgotPassword({ email });

    updateState({ otpSession: { email: response.email, purpose: 'forgot-password' } });
    localStorage.setItem(OTP_SESSION_KEY, JSON.stringify({ email: response.email, purpose: 'forgot-password' }));

    return response;
  };

  const resendOTP = async (email) => {
    const targetEmail = email || state.otpSession?.email || state.user?.email;
    if (!targetEmail) {
      throw new Error('No email available for OTP resend');
    }

    return authService.resendOtp({ email: targetEmail });
  };

  const verifyOTP = async (otp, email) => {
    const targetEmail = email || state.otpSession?.email || state.user?.email;
    if (!targetEmail) {
      throw new Error('No email available for OTP verification');
    }

    return authService.verifyOtp({ email: targetEmail, otp });
  };

  const changePassword = async (password, email) => {
    const targetEmail = email || state.otpSession?.email || state.user?.email;
    if (!targetEmail) {
      throw new Error('No email available for password change');
    }

    const response = await authService.changePassword({ email: targetEmail, password });

    updateState({
      user: response.user,
      token: response.token,
      otpSession: null,
      isAuthenticated: true,
      isLoading: false,
    });

    localStorage.setItem(AUTH_TOKEN_KEY, response.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));
    localStorage.removeItem(OTP_SESSION_KEY);

    return response;
  };

  const resetPassword = async (otp, newPassword, email) => {
    await verifyOTP(otp, email);
    return changePassword(newPassword, email);
  };

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      login, 
      signup,
      googleLogin, 
      logout, 
      verifyOTP, 
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
