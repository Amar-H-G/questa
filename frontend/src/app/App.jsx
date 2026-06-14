import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppLayout } from './layouts/AppLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { LoginPage } from '../modules/auth/pages/LoginPage';
import { RegisterPage } from '../modules/auth/pages/RegisterPage';
import { VerifyEmailPage } from '../modules/auth/pages/VerifyEmailPage';
import { ForgotPassPage } from '../modules/auth/pages/ForgotPassPage';
import { ResetPassPage } from '../modules/auth/pages/ResetPassPage';
import { AnalyticsPage } from '../modules/analytics/pages/AnalyticsPage';
import { CodingPage } from '../modules/coding/pages/CodingPage';
import { CodingWorkspacePage } from '../modules/coding/pages/CodingWorkspacePage';
import { DashboardPage } from '../modules/dashboard/pages/DashboardPage';
import { LeaderboardPage } from '../modules/leaderboard/pages/LeaderboardPage';
import { ProfilePage } from '../modules/profile/pages/ProfilePage';
import { CreateQuizPage } from '../modules/quiz/pages/CreateQuizPage';
import { QuizListPage } from '../modules/quiz/pages/QuizListPage';
import { QuizAttemptPage } from '../modules/quiz/pages/QuizAttemptPage';
import { UsersAdminPage } from '../modules/admin/pages/UsersAdminPage';
import { LandingPage } from '../modules/dashboard/pages/LandingPage';

export const App = () => (
  <>
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 5000,
        style: {
          background: '#ffffff',
          color: '#0f172a',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          fontSize: '14px',
          fontWeight: '500',
          maxWidth: '450px',
        },
      }}
    />
    <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/verify-email" element={<VerifyEmailPage />} />
    <Route path="/forgot-password" element={<ForgotPassPage />} />
    <Route path="/reset-password" element={<ResetPassPage />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="quizzes" element={<QuizListPage />} />
        <Route path="quizzes/new" element={<CreateQuizPage />} />
        <Route path="quizzes/:id/attempt" element={<QuizAttemptPage />} />
        <Route path="coding" element={<CodingPage />} />
        <Route path="coding/:id" element={<CodingWorkspacePage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="admin/users" element={<UsersAdminPage />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
  </>
);
