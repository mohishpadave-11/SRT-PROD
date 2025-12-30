import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react'
import logo from '../../assets/srtship-logo.png'
import { validatePassword, PASSWORD_ERROR_MESSAGE } from '../../utils/passwordValidation'
import Spinner from '../../components/Spinner'

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const navigate = useNavigate()
  const { token } = useParams()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setPasswordError('')
    setConfirmPasswordError('')

    // Validate password
    if (!validatePassword(password)) {
      setPasswordError(PASSWORD_ERROR_MESSAGE)
      return
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.')
      return
    }

    setIsLoading(true)
    try {
      // Call reset password API
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (data.success) {
        setIsSuccess(true)
        // Store token if provided (auto-login)
        if (data.data?.token) {
          localStorage.setItem('token', data.data.token)
        }
      } else {
        setErrorMessage(data.message || 'Password reset failed')
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.')
      console.error('Reset password error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    navigate('/')
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center overflow-hidden p-4 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Password Reset Successful</h2>
          <p className="text-gray-600 mb-6">Your password has been successfully updated.</p>
          <button 
            onClick={handleBackToLogin} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2"
          >
            <span>Continue to Login</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden p-4 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="w-full relative max-w-5xl overflow-hidden flex flex-col md:flex-row shadow-2xl rounded-3xl bg-white">
        {/* Left side - Branding */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 md:p-12 md:w-1/2 relative rounded-l-3xl overflow-hidden">
          <div className="relative z-10">
            <div className="mb-8">
              <img src={logo} alt="SRT Shipping" className="h-16 mb-4" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">Set New Password</h1>
            <p className="text-blue-100 text-lg">Create a strong password to secure your account.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-12 md:w-1/2 flex flex-col bg-white rounded-r-3xl relative z-10">
          <button 
            onClick={handleBackToLogin} 
            className="flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Back to Login</span>
          </button>
          
          <div className="flex flex-col items-left mb-8">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Reset Password</h2>
            <p className="text-gray-600">Enter your new password below.</p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}
          
          <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  id="password" 
                  className={`text-sm w-full py-3 px-4 pr-12 border rounded-lg focus:outline-none focus:ring-2 bg-white text-black focus:ring-blue-500 transition-all ${passwordError ? 'border-red-500' : 'border-gray-300'}`}
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  id="confirmPassword" 
                  className={`text-sm w-full py-3 px-4 pr-12 border rounded-lg focus:outline-none focus:ring-2 bg-white text-black focus:ring-blue-500 transition-all ${confirmPasswordError ? 'border-red-500' : 'border-gray-300'}`}
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {confirmPasswordError && <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Spinner size="sm" />}
              {isLoading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
