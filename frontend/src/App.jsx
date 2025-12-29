import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import LoginPage from './pages/login/LoginPage'
import SignupPage from './pages/login/SignupPage'
import ForgotPasswordPage from './pages/login/ForgotPasswordPage'
import ResetPasswordPage from './pages/login/ResetPasswordPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import JobsDashboard from './pages/JobsDashboard/JobsDashboard'
import JobDetailsPage from "./pages/JobsDashboard/JobDetailsPage"
import NewJobPage from './pages/NewJobPage/NewJobPage'
import AdminProfilePage from './pages/admin/AdminProfilePage'
import CompanyManagement from './pages/admin/CompanyManagement'
import DocumentDashboard from './pages/DocumentDashboard/DocumentDashboard'
import { useAuth } from './store/AuthContext'
import { isTokenExpired } from './utils/tokenUtils'

// Protected Route Component with Token Validation
function ProtectedRoute({ children }) {
  const { token, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Validate token on route change
    if (token && isTokenExpired(token)) {
      console.info('Token expired on route change, logging out');
      logout();
    }
  }, [location.pathname, token, logout]);

  const isLoggedIn = !!token && !isTokenExpired(token);
  
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function App() {
  const { user, token, login, logout } = useAuth();
  const isLoggedIn = !!token && !isTokenExpired(token);

  const handleLogin = () => {
    // This function is called after successful login
    // The actual login state is managed by AuthContext
  };

  return (
    <ErrorBoundary fallbackMessage="The application encountered an error. Please refresh the page.">
      <Router>
        <Routes>
          {/* AUTH ROUTES */}
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* PROTECTED ROUTES */}
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} 
          />

          <Route 
            path="/jobs-dashboard" 
            element={<ProtectedRoute><JobsDashboard /></ProtectedRoute>} 
          />

          {/* NEW JOB ROUTE */}
          <Route 
            path="/jobs/new" 
            element={<ProtectedRoute><NewJobPage /></ProtectedRoute>} 
          />

          {/* JOB DETAILS ROUTE */}
          <Route 
            path="/jobs/:id" 
            element={<ProtectedRoute><JobDetailsPage /></ProtectedRoute>} 
          />
          
          {/* EDIT JOB ROUTE */}
          <Route 
            path="/jobs/:id/edit" 
            element={<ProtectedRoute><NewJobPage /></ProtectedRoute>} 
          />

          {/* ADMIN PROFILE ROUTE */}
          <Route 
            path="/admin/profile" 
            element={<ProtectedRoute><AdminProfilePage /></ProtectedRoute>} 
          />

          {/* COMPANY MANAGEMENT ROUTE */}
          <Route 
            path="/admin/companies" 
            element={<ProtectedRoute><CompanyManagement /></ProtectedRoute>} 
          />

          {/* DOCUMENT DASHBOARD ROUTE */}
          <Route 
            path="/document-dashboard" 
            element={<ProtectedRoute><DocumentDashboard /></ProtectedRoute>} 
          />

          {/* DEFAULT REDIRECT */}
          <Route 
            path="/" 
            element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} 
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
