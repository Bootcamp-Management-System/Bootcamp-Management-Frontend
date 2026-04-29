import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Layout } from "./components/Layout";
import { DivisionProvider } from "./context/DivisionContext";
import { ThemeProvider } from "./context/ThemeContext";

// Auth Pages
import { LoginPage } from "./pages/auth/LoginPage";
import { OTPPage } from "./pages/auth/OTPPage";
import { ChangePasswordPage } from "./pages/auth/ChangePasswordPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { LandingPage } from "./pages/LandingPage";
import { ApplyPage } from "./pages/ApplyPage";
import { SignupPage } from "./pages/auth/SignupPage";
import { RecruitmentSubmissionPage } from "./pages/RecruitmentSubmissionPage";

// Dashboard Pages
import { StudentDashboard } from "./pages/auth/dashboard/StudentDashboard";
import { InstructorPanel } from "./pages/auth/dashboard/InstructorPanel";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminMembersPage } from "./pages/admin/AdminMembersPage";
import { AdminInstructorsPage } from "./pages/admin/AdminInstructorsPage";
import { AdminSessionsPage } from "./pages/admin/AdminSessionsPage";
import { AdminGroupsPage } from "./pages/admin/AdminGroupsPage";
import { AdminReportsPage } from "./pages/admin/AdminReportsPage";
import { AdminAdminsPage } from "./pages/admin/AdminAdminsPage";
import { AdminRecruitmentPage } from "./pages/admin/AdminRecruitmentPage";
import { InstructorAttendancePage } from "./pages/auth/dashboard/InstructorAttendancePage";
import { ProfilePage } from "./pages/ProfilePage";
import { SuperAdminRoot } from "./pages/super-admin/SuperAdminRoot";
import { Dashboard as SuperAdminDashboard } from "./pages/super-admin/app/pages/Dashboard";
import { Divisions as SuperAdminDivisions } from "./pages/super-admin/app/pages/Divisions";
import { DivisionDetails as SuperAdminDivisionDetails } from "./pages/super-admin/app/pages/DivisionDetails";
import { Users as SuperAdminUsers } from "./pages/super-admin/app/pages/Users";
import { UserDetails as SuperAdminUserDetails } from "./pages/super-admin/app/pages/UserDetails";
import { Students as SuperAdminStudents } from "./pages/super-admin/app/pages/Students";
import { Applications as SuperAdminApplications } from "./pages/super-admin/app/pages/Applications";
import { Announcements as SuperAdminAnnouncements } from "./pages/super-admin/app/pages/Announcements";
import { Notifications as SuperAdminNotifications } from "./pages/super-admin/app/pages/Notifications";
import { Attendance as SuperAdminAttendance } from "./pages/super-admin/app/pages/Attendance";
import { Resources as SuperAdminResources } from "./pages/super-admin/app/pages/Resources";
import { Groups as SuperAdminGroups } from "./pages/super-admin/app/pages/Groups";
import { Progress as SuperAdminProgress } from "./pages/super-admin/app/pages/Progress";
import { Reports as SuperAdminReports } from "./pages/super-admin/app/pages/Reports";
import { Settings as SuperAdminSettings } from "./pages/super-admin/app/pages/Settings";
import { NotFound as SuperAdminNotFound } from "./pages/super-admin/app/pages/NotFound";
import { StudentTaskPage } from "./pages/Task/StudentTaskPage";
import { InstructorTasksPage } from "./pages/Task/InstructorTasksPage";
import { WeeklyProgressPage } from "./pages/WeeklyProgressPage";
import { StudentBootcampsPage } from "./pages/bootcamp/StudentBootcampsPage";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DivisionProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/apply/:bootcampId" element={<ApplyPage />} />
              <Route
                path="/recruitment/submit/:applicationId"
                element={<RecruitmentSubmissionPage />}
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/otp" element={<OTPPage />} />
              <Route path="/change-password" element={<ChangePasswordPage />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["student", "member"]}>
                    <Layout>
                      <StudentDashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      "student",
                      "member",
                      "instructor",
                      "admin",
                      "super_admin",
                      "super-admin",
                    ]}
                  >
                    <Layout>
                      <ProfilePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-tasks"
                element={
                  <ProtectedRoute allowedRoles={["student", "member"]}>
                    <Layout>
                      <StudentTaskPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/progress"
                element={
                  <ProtectedRoute allowedRoles={["student", "member"]}>
                    <Layout>
                      <WeeklyProgressPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/bootcamps"
                element={
                  <ProtectedRoute allowedRoles={["student", "member"]}>
                    <Layout>
                      <StudentBootcampsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/instructor"
                element={
                  <ProtectedRoute allowedRoles={["instructor"]}>
                    <Layout>
                      <InstructorPanel />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/instructor/tasks"
                element={
                  <ProtectedRoute
                    allowedRoles={["instructor", "admin", "super_admin", "super-admin"]}
                  >
                    <Layout>
                      <InstructorTasksPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/instructor/attendance"
                element={
                  <ProtectedRoute allowedRoles={["instructor"]}>
                    <Layout>
                      <InstructorAttendancePage />
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
                  <ProtectedRoute
                    allowedRoles={["admin", "super_admin", "super-admin"]}
                  >
                    <Layout>
                      <AdminDashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/members"
                element={
                  <ProtectedRoute
                    allowedRoles={["admin", "super_admin", "super-admin"]}
                  >
                    <Layout>
                      <AdminMembersPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/instructors"
                element={
                  <ProtectedRoute
                    allowedRoles={["admin", "super_admin", "super-admin"]}
                  >
                    <Layout>
                      <AdminInstructorsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/sessions"
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      "admin",
                      "instructor",
                      "super_admin",
                      "super-admin",
                    ]}
                  >
                    <Layout>
                      <AdminSessionsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/groups"
                element={
                  <ProtectedRoute
                    allowedRoles={["admin", "super_admin", "super-admin"]}
                  >
                    <Layout>
                      <AdminGroupsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/recruitment"
                element={
                  <ProtectedRoute
                    allowedRoles={["admin", "super_admin", "super-admin"]}
                  >
                    <Layout>
                      <AdminRecruitmentPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute
                    allowedRoles={["admin", "super_admin", "super-admin"]}
                  >
                    <Layout>
                      <AdminReportsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/admins"
                element={
                  <ProtectedRoute allowedRoles={["super_admin", "super-admin"]}>
                    <Layout>
                      <AdminAdminsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/super-admin"
                element={
                  <ProtectedRoute allowedRoles={["super_admin", "super-admin"]}>
                    <SuperAdminRoot />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<SuperAdminDashboard />} />
                <Route path="divisions" element={<SuperAdminDivisions />} />
                <Route
                  path="divisions/:id"
                  element={<SuperAdminDivisionDetails />}
                />
                <Route path="users" element={<SuperAdminUsers />} />
                <Route path="users/:id" element={<SuperAdminUserDetails />} />
                <Route path="students" element={<SuperAdminStudents />} />
                <Route
                  path="applications"
                  element={<SuperAdminApplications />}
                />
                <Route
                  path="announcements"
                  element={<SuperAdminAnnouncements />}
                />
                <Route
                  path="notifications"
                  element={<SuperAdminNotifications />}
                />
                <Route path="attendance" element={<SuperAdminAttendance />} />
                <Route path="resources" element={<SuperAdminResources />} />
                <Route path="groups" element={<SuperAdminGroups />} />
                <Route path="progress" element={<SuperAdminProgress />} />
                <Route path="reports" element={<SuperAdminReports />} />
                <Route path="settings" element={<SuperAdminSettings />} />
                <Route path="*" element={<SuperAdminNotFound />} />
              </Route>

              {/* Default Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </DivisionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
