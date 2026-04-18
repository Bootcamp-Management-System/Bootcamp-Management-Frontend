import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/Layout';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { OTPPage } from './pages/auth/OTPPage';
import { ChangePasswordPage } from './pages/auth/ChangePasswordPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Dashboard Pages
import { MemberDashboard } from './pages/dashboard/MemberDashboard';
import { InstructorPanel } from './pages/dashboard/InstructorPanel';
import { AdminPanel } from './pages/dashboard/AdminPanel';
import { ProfilePage } from './pages/dashboard/ProfilePage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/otp" element={<OTPPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['member']}>
                <Layout>
                  <MemberDashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute allowedRoles={['member', 'instructor', 'admin']}>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/instructor" 
            element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <Layout>
                  <InstructorPanel />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <AdminPanel />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
