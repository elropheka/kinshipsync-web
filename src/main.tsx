import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import './index.css';
import App from './App.tsx';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import PasswordResetEmailSent from './pages/PasswordResetEmailSent';
import { EventSiteDetailPage } from './pages/detail/EventSiteDetailPage';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { registerGlobalErrorHandlers } from './lib/globalErrorHandlers';

registerGlobalErrorHandlers();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <ThemeProvider>
          <ErrorBoundary>
            <Router>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                <Route path="/auth/password-reset-sent" element={<PasswordResetEmailSent />} />
                <Route path="/events/site/:slug" element={<EventSiteDetailPage />} />
                <Route path="/dashboard/*" element={<App />} />
              </Routes>
            </Router>
          </ErrorBoundary>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>,
);
