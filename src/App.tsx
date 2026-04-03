import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';
import ProfilePage from './pages/ProfilePage.js';
import NotFoundPage from './pages/NotFoundPage.js';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('accessToken');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/profile" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
