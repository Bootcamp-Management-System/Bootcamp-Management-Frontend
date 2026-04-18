import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      setState({
        token: storedToken,
        user: JSON.parse(storedUser),
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email, _password) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    const isFirstLogin = email.includes('first');
    const role = email.includes('admin') ? 'admin' : email.includes('instructor') ? 'instructor' : 'member';
    
    const mockUser = {
      id: '1',
      idNo: 'CSEC/ASTU/' + Math.floor(1000 + Math.random() * 9000),
      email,
      role,
      isFirstLogin,
      name: email.split('@')[0].split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      bio: "CSEC Member since 2024. Passionate about building impactful software.",
      status: "Active Member",
      attendance: "92%",
      division: role === 'member' ? "Web Development" : "CORE Team"
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
    } else {
      setState({
        user: mockUser,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const googleLogin = async () => {
    await login('google_user@example.com', '');
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const verifyOTP = async (_otp) => {
    if (state.user) {
      // Logic for OTP verification
    }
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
