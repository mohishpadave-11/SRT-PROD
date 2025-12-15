import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/login/LoginPage'
import ForgotPasswordPage from './pages/login/ForgotPasswordPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import JobsDashboard from './pages/JobsDashboard/JobsDashboard'
import JobDetailsPage from "./pages/JobsDashboard/JobDetailsPage"
import NewJobPage from './pages/NewJobPage/NewJobPage'
import AdminProfilePage from './pages/admin/AdminProfilePage'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('token')
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  return (
    <Router>
      <Routes>
        {/* AUTH ROUTES */}
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* PROTECTED ROUTES */}
        <Route 
          path="/dashboard" 
          element={isLoggedIn ? <DashboardPage /> : <Navigate to="/login" />} 
        />

        <Route 
          path="/jobs-dashboard" 
          element={isLoggedIn ? <JobsDashboard /> : <Navigate to="/login" />} 
        />

        {/* JOB DETAILS ROUTE */}
        <Route 
          path="/jobs/:id" 
          element={isLoggedIn ? <JobDetailsPage /> : <Navigate to="/login" />} 
        />

        {/* NEW JOB ROUTE */}
        <Route 
          path="/jobs/new" 
          element={isLoggedIn ? <NewJobPage /> : <Navigate to="/login" />} 
        />

        {/* ADMIN PROFILE ROUTE */}
        <Route 
          path="/admin/profile" 
          element={isLoggedIn ? <AdminProfilePage /> : <Navigate to="/login" />} 
        />

        {/* DEFAULT REDIRECT */}
        <Route 
          path="/" 
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} 
        />
      </Routes>
    </Router>
  )
}

export default App