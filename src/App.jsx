import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/Layout';
import { DivisionProvider } from './context/DivisionContext';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { OTPPage } from './pages/auth/OTPPage';
import { ChangePasswordPage } from './pages/auth/ChangePasswordPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Dashboard Pages
import { MemberDashboard } from './pages/auth/dashboard/MemberDashboard';
import { InstructorPanel } from './pages/auth/dashboard/InstructorPanel';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminMembersPage } from './pages/admin/AdminMembersPage';
import { AdminInstructorsPage } from './pages/admin/AdminInstructorsPage';
import { AdminSessionsPage } from './pages/admin/AdminSessionsPage';
import { AdminGroupsPage } from './pages/admin/AdminGroupsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { ProfilePage } from './pages/ProfilePage';
import { MemberTaskPage } from './pages/Task/MemberTaskPage';
import { MemberSessionPage } from './pages/Session/MemberSessionPage';

export default function App() {
  return (
    <AuthProvider>
      <DivisionProvider>
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
            path="/my-tasks" 
            element={
              <ProtectedRoute allowedRoles={['member']}>
                <Layout>
                  <MemberTaskPage />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/sessions" 
            element={
              <ProtectedRoute allowedRoles={['member', 'instructor']}>
                <Layout>
                  <MemberSessionPage />
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
            element={<Navigate to="/admin/dashboard" replace />} 
          />

          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/members" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <AdminMembersPage />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/instructors" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <AdminInstructorsPage />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/sessions" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'instructor']}>
                <Layout>
                  <AdminSessionsPage />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/groups" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <AdminGroupsPage />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/reports" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <AdminReportsPage />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      </DivisionProvider>
    </AuthProvider>
  );
}
