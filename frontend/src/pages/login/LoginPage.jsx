import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Eye, EyeOff } from 'lucide-react'
import logo from '../../assets/srtship-logo.png'
import { loginAPI } from '../../services/authService' // IMPORT THIS
import { useAuth } from '../../store/AuthContext';
import { validateEmail } from '../../utils/emailValidation'

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate()
  const { login } = useAuth() // Use AuthContext login function
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validatePassword = (value) => {
    // Backend likely handles complex validation, frontend just checks presence
    return value.length >= 1 
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
      setPasswordError('Please enter your password.')
      valid = false
    } else {
      setPasswordError('')
    }

    if (valid) {
      setIsLoading(true)
      try {
        // --- REAL BACKEND CALL ---
        const response = await loginAPI(email.toLowerCase().trim(), password)
        
        // Use AuthContext login function with token validation
        const loginSuccess = login(response.user, response.token);
        
        if (loginSuccess) {
          // If successful login and token is valid
          if (onLogin) {
            onLogin()
          }
          navigate('/dashboard')
        } else {
          console.error('Token validation failed after successful backend login');
          setLoginError('Login failed: Invalid token received')
        }
        // -------------------------

      } catch (error) {
        setLoginError(error) // Display the error message from backend
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
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 md:p-12 md:w-1/2 flex flex-col bg-white rounded-r-3xl relative z-10">
          <div className="flex flex-col items-left mb-8">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Sign In</h2>
            <p className="text-gray-600">Enter your credentials to access your account</p>
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
              />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
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
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

LoginPage.propTypes = {
  onLogin: PropTypes.func
}

export default LoginPage
