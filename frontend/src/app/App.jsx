import { Navigate, Route, Routes } from 'react-router-dom';
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

export const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/verify-email" element={<VerifyEmailPage />} />
    <Route path="/forgot-password" element={<ForgotPassPage />} />
    <Route path="/reset-password" element={<ResetPassPage />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="quizzes" element={<QuizListPage />} />
        <Route path="quizzes/new" element={<CreateQuizPage />} />
        <Route path="quizzes/:id/attempt" element={<QuizAttemptPage />} />
        <Route path="coding" element={<CodingPage />} />
        <Route path="coding/:id" element={<CodingWorkspacePage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
