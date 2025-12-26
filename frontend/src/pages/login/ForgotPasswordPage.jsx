import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Ship, ArrowLeft, Mail, CheckCircle } from 'lucide-react'
import logo from '../../assets/srtship-logo.png'
import { forgotPasswordAPI } from '../../services/authService' // IMPORT THIS

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.')
      return
    } else {
      setEmailError('')
    }

    setIsLoading(true)
    try {
      // --- REAL API CALL ---
      await forgotPasswordAPI(email)
      setIsSuccess(true)
      // ---------------------
    } catch (error) {
      setErrorMessage(error)
      console.error('Forgot password error:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // ... Keep the rest of your render code exactly as it is ...
  // (The rest of the file stays the same as what you provided)
  const handleBackToLogin = () => {
    window.location.href = '/'
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Check Your Email</h2>
          <p className="text-gray-600 mb-6">We've sent a password reset link to <strong>{email}</strong></p>
          <button onClick={handleBackToLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2">
            <ArrowLeft className="w-4 h-4" /><span>Back to Login</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden p-4 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        {/* ... Keep your existing JSX layout for the form ... */}
        <div className="w-full relative max-w-5xl overflow-hidden flex flex-col md:flex-row shadow-2xl rounded-3xl bg-white">
            {/* Left side remains same */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 md:p-12 md:w-1/2 relative rounded-l-3xl overflow-hidden">
                {/* ... existing branding code ... */}
                <div className="relative z-10">
                    <div className="mb-8"><img src={logo} alt="SRT Shipping" className="h-16 mb-4" /></div>
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">Reset Your Password</h1>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-8 md:p-12 md:w-1/2 flex flex-col bg-white rounded-r-3xl relative z-10">
                <button onClick={handleBackToLogin} className="flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /><span className="text-sm font-medium">Back to Login</span>
                </button>
                <div className="flex flex-col items-left mb-8">
                    <h2 className="text-3xl font-bold mb-2 text-gray-800">Forgot Password?</h2>
                    <p className="text-gray-600">No worries, we'll send you reset instructions.</p>
                </div>
                {errorMessage && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{errorMessage}</div>}
                
                <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input type="email" id="email" className={`text-sm w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 bg-white text-black focus:ring-blue-500 transition-all ${emailError ? 'border-red-500' : 'border-gray-300'}`} value={email} onChange={(e) => setEmail(e.target.value)} />
                        {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                    <div className="text-center text-gray-500 text-sm mt-4">
                        Remember your password? <button type="button" onClick={handleBackToLogin} className="text-blue-600 hover:text-blue-700 font-medium">Sign in</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default ForgotPasswordPage