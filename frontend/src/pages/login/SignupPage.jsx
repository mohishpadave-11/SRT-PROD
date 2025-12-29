import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, User, Mail, Lock, UserCheck } from 'lucide-react'
import logo from '../../assets/srtship-logo.png'
import { registerAPI } from '../../services/authService'
import { useAuth } from '../../store/AuthContext'
import { validatePassword, getPasswordValidationError } from '../../utils/passwordValidation'
import { validateEmail } from '../../utils/emailValidation'

const SignupPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin'
  })
  const [errors, setErrors] = useState({})
  const [signupError, setSignupError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    const passwordError = getPasswordValidationError(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSignupError('')

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      const response = await registerAPI({
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        role: formData.role
      })

      // Auto-login after successful registration
      const loginSuccess = login(response.user, response.token)
      
      if (loginSuccess) {
        navigate('/dashboard')
      } else {
        setSignupError('Registration successful but login failed. Please try logging in manually.')
      }
    } catch (error) {
      setSignupError(error.message || error || 'Registration failed')
      console.error('Signup error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden p-4 bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="w-full relative max-w-5xl overflow-hidden flex flex-col md:flex-row shadow-2xl rounded-3xl bg-white">
        {/* Decorative Elements */}
        <div className="w-full h-full absolute bg-gradient-to-t from-transparent to-black/5 rounded-3xl pointer-events-none"></div>
        
        {/* Left Side - Branding */}
        <div className="bg-gradient-to-br from-green-600 to-green-800 text-white p-8 md:p-12 md:w-1/2 relative rounded-l-3xl overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
          </div>
          
          <div className="relative z-10">
            <div className="mb-8">
              <img src={logo} alt="SRT Shipping" className="h-16 mb-4" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
              Join SRT Shipping CRM
            </h1>
            <p className="text-green-100 text-lg mb-6">
              Create your account to start managing shipping operations and streamline your logistics workflow.
            </p>
            <div className="space-y-3 text-green-100">
              <div className="flex items-center">
                <UserCheck className="w-5 h-5 mr-3" />
                <span>Manage jobs and track shipments</span>
              </div>
              <div className="flex items-center">
                <User className="w-5 h-5 mr-3" />
                <span>Role-based access control</span>
              </div>
              <div className="flex items-center">
                <Lock className="w-5 h-5 mr-3" />
                <span>Secure document management</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="p-8 md:p-12 md:w-1/2 flex flex-col bg-white rounded-r-3xl relative z-10">
          <div className="flex flex-col items-left mb-6">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Create Account</h2>
            <p className="text-gray-600">Fill in your details to get started</p>
          </div>

          {signupError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {signupError}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  className={`text-sm w-full py-3 pl-12 pr-4 border rounded-lg focus:outline-none focus:ring-2 bg-white text-black focus:ring-green-500 transition-all ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your.email@example.com"
                  className={`text-sm w-full py-3 pl-12 pr-4 border rounded-lg focus:outline-none focus:ring-2 bg-white text-black focus:ring-green-500 transition-all ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Role Field */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                id="role"
                name="role"
                className="text-sm w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 bg-white text-black focus:ring-green-500 transition-all"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Create a strong password"
                  className={`text-sm w-full py-3 pl-12 pr-12 border rounded-lg focus:outline-none focus:ring-2 bg-white text-black focus:ring-green-500 transition-all ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  className={`text-sm w-full py-3 pl-12 pr-12 border rounded-lg focus:outline-none focus:ring-2 bg-white text-black focus:ring-green-500 transition-all ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
