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
      const parsedUser = JSON.parse(storedUser);
      // Migration: Ensure divisions exist for old sessions
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
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email, _password) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    const isFirstLogin = email.includes('first');
    const role = email.includes('admin') ? 'admin' : email.includes('instructor') ? 'instructor' : 'member';
    
    let userDivision = "Development";
    if (role === 'admin') {
      if (email.includes('cyber')) userDivision = "Cyber Security";
      else if (email.includes('data')) userDivision = "Data Science";
      else if (email.includes('cp')) userDivision = "CP (Competitive Programming)";
      else userDivision = "Development";
    }

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
      setState({
        user: mockUser,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return {
        user: mockUser,
        token: null,
        requiresApproval: false,
        requiresPasswordChange: true,
      };
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
