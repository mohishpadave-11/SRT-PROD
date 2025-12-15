import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Ship, Eye, EyeOff } from 'lucide-react'
import logo from '../../assets/srtship-logo.png'

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  const validatePassword = (value) => {
    return value.length >= 6
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoginError('')
    let valid = true

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.')
      valid = false
    } else {
      setEmailError('')
    }

    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 6 characters.')
      valid = false
    } else {
      setPasswordError('')
    }

    if (valid) {
      setIsLoading(true)
      try {
        // For development - bypass backend and use mock login
        if (email === 'admin@test.com' && password === 'password') {
          const mockUser = { id: 1, name: 'Admin User', email: 'admin@test.com' }
          const mockToken = 'mock-jwt-token-' + Date.now()
          
          localStorage.setItem('user', JSON.stringify(mockUser))
          localStorage.setItem('token', mockToken)
          if (onLogin) {
            onLogin()
          }
          navigate('/dashboard')
          return
        }

        const response = await fetch('http://localhost:3001/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        if (response.ok) {
          localStorage.setItem('user', JSON.stringify(data.user))
          localStorage.setItem('token', data.token)
          if (onLogin) {
            onLogin()
          }
          navigate('/dashboard')
        } else {
          setLoginError(data.message || 'Invalid credentials')
        }
      } catch (error) {
        setLoginError('Unable to connect to server. Use admin@test.com / password for demo.')
        console.error('Login error:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden p-4 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="w-full relative max-w-5xl overflow-hidden flex flex-col md:flex-row shadow-2xl rounded-3xl bg-white">
        {/* Decorative Elements */}
        <div className="w-full h-full absolute bg-gradient-to-t from-transparent to-black/5 rounded-3xl pointer-events-none"></div>
        
        {/* Left Side - Branding */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 md:p-12 md:w-1/2 relative rounded-l-3xl overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
          </div>
          
          <div className="relative z-10">
            <div className="mb-8">
              <img src={logo} alt="SRT Shipping" className="h-16 mb-4" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
              Welcome to SRT Shipping CRM
            </h1>
            <p className="text-blue-100 text-lg">
              Manage your shipping operations, track jobs, and streamline your logistics workflow.
            </p>
            
            <div className="mt-12 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Ship className="w-5 h-5" />
                </div>
                <span className="text-blue-50">Track shipments in real-time</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Ship className="w-5 h-5" />
                </div>
                <span className="text-blue-50">Manage parties and invoices</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Ship className="w-5 h-5" />
                </div>
                <span className="text-blue-50">Analytics and reporting</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 md:p-12 md:w-1/2 flex flex-col bg-white rounded-r-3xl relative z-10">
          <div className="flex flex-col items-left mb-8">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Sign In</h2>
            <p className="text-gray-600">Enter your credentials to access your account</p>
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 font-medium">Demo Credentials:</p>
              <p className="text-sm text-blue-600">Email: admin@test.com</p>
              <p className="text-sm text-blue-600">Password: password</p>
            </div>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {loginError}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="your.email@example.com"
                className={`text-sm w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 bg-white text-black focus:ring-blue-500 transition-all ${
                  emailError ? 'border-red-500' : 'border-gray-300'
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!emailError}
                aria-describedby="email-error"
              />
              {emailError && (
                <p id="email-error" className="text-red-500 text-xs mt-1">
                  {emailError}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  className={`text-sm w-full py-3 px-4 pr-12 border rounded-lg focus:outline-none focus:ring-2 bg-white text-black focus:ring-blue-500 transition-all ${
                    passwordError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!passwordError}
                  aria-describedby="password-error"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && (
                <p id="password-error" className="text-red-500 text-xs mt-1">
                  {passwordError}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 rounded" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => window.location.href = '/forgot-password'}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="text-center text-gray-500 text-sm mt-4">
              © 2025 SRT Shipping Pvt. Ltd. All rights reserved.
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

LoginPage.propTypes = {
  onLogin: PropTypes.func
}

export default LoginPage
