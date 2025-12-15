import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit, Save, X, Home, FileText, LogOut, Search } from 'lucide-react'
import logo from '../../assets/srtship-logo.png'

const AdminProfilePage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isEditing, setIsEditing] = useState(false)

  const goToDashboard = () => {
    navigate('/dashboard')
  }
  
  // Get user data from localStorage (set during login)
  const userData = JSON.parse(localStorage.getItem('user') || '{}')
  
  const [profileData, setProfileData] = useState({
    name: userData.name || 'Admin User',
    email: userData.email || 'admin@test.com',
    phone: '+91 98765 43210',
    address: 'Mumbai, Maharashtra, India',
    role: userData.role || 'System Administrator',
    department: 'IT Operations',
    joinDate: '2023-01-15',
    employeeId: 'EMP001',
    lastLogin: new Date().toLocaleString(),
    permissions: [
      'User Management',
      'System Configuration',
      'Data Export',
      'Report Generation',
      'Audit Logs',
      'Backup Management'
    ]
  })

  const [editData, setEditData] = useState({ ...profileData })

  const handleEdit = () => {
    setIsEditing(true)
    setEditData({ ...profileData })
  }

  const handleSave = () => {
    setProfileData({ ...editData })
    setIsEditing(false)
    console.log('Profile updated:', editData)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({ ...profileData })
  }

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="h-screen bg-gray-50 w-full flex flex-col overflow-hidden">
      {/* ---------- DESKTOP HEADER ---------- */}
      <header className="flex-shrink-0 z-50 w-full hidden md:block">
        <div className="bg-white shadow-lg h-20 w-full border-b-2 border-gray-100">
          <div className="flex items-center justify-between h-full px-4 max-w-none">
            <div
              onClick={goToDashboard}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') goToDashboard() }}
              className="flex items-center cursor-pointer"
            >
              <img src={logo} alt="SRT Shipping" className="h-8 sm:h-12" />
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Companies, Jobs, Parties"
                  className="pl-12 pr-6 py-3 border border-gray-300 rounded-lg w-96 focus:ring-2 focus:ring-blue-500 text-base"
                />
              </div>

              <button
                onClick={() => navigate('/jobs/new')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm font-semibold shadow-md"
              >
                <span className="text-lg">+</span>
                <span>NEW JOB</span>
              </button>

              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <button
                  onClick={() => navigate('/admin/profile')}
                  className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400"
                >
                  <User className="w-7 h-7 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ---------- MOBILE HEADER ---------- */}
      <header className="md:hidden flex-shrink-0 z-50 bg-white shadow-sm h-16 w-full border-b border-gray-100">
        <div className="flex items-center justify-between h-full px-4">
          <div onClick={goToDashboard} className="cursor-pointer flex items-center">
            <img src={logo} className="h-8" alt="SRT Shipping" />
          </div>

          <div className="flex-1 px-3">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg w-full text-sm"
              />
            </div>
          </div>

          <button
            onClick={() => navigate('/jobs/new')}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold"
          >
            + New
          </button>
        </div>
      </header>

      {/* ---------- MAIN LAYOUT CONTAINER ---------- */}
      <div className="flex flex-1 overflow-hidden">
        {/* ---------- DESKTOP SIDEBAR (extends full height) ---------- */}
        <aside className="hidden md:flex w-20 bg-white shadow-lg flex-col border-r-2 border-gray-100 flex-shrink-0 absolute left-0 top-20 bottom-0 z-30">
          <nav className="py-6 flex-1">
            <button
              onClick={() => navigate('/dashboard')}
              className={`w-full flex flex-col items-center py-5 ${
                location.pathname === '/dashboard'
                  ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
              }`}
              aria-label="Dashboard"
            >
              <Home className="w-7 h-7" />
            </button>

            <button
              onClick={() => navigate('/jobs-dashboard')}
              className={`w-full flex flex-col items-center py-5 ${
                location.pathname === '/jobs-dashboard'
                  ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
              }`}
              aria-label="Jobs"
            >
              <FileText className="w-7 h-7" />
            </button>
          </nav>

          {/* Logout button at bottom of sidebar */}
          <div className="border-t border-gray-200 bg-white">
            <button
              onClick={handleLogout}
              className="w-full flex flex-col items-center py-4 text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors"
              aria-label="Logout"
            >
              <LogOut className="w-6 h-6" />
              <span className="text-xs mt-1">Logout</span>
            </button>
          </div>
        </aside>

        {/* ---------- MAIN CONTENT AREA ---------- */}
        <div className="flex-1 overflow-auto bg-gray-50 md:pb-0 pb-16 md:ml-20">
          <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Admin Profile</h1>
                  <p className="text-gray-600">Manage your account settings and personal information</p>
                </div>
                
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="mt-4 sm:mt-0 flex gap-2">
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Profile Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{profileData.name}</h2>
                      <p className="text-gray-600">{profileData.role}</p>
                      <p className="text-sm text-gray-500">Employee ID: {profileData.employeeId}</p>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                      
                      {/* Name Field */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          <User className="w-4 h-4 inline mr-2" />
                          Full Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your full name"
                          />
                        ) : (
                          <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                            {profileData.name}
                          </div>
                        )}
                      </div>

                      {/* Email Field */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          <Mail className="w-4 h-4 inline mr-2" />
                          Email Address
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={editData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your email address"
                          />
                        ) : (
                          <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                            {profileData.email}
                          </div>
                        )}
                      </div>

                      {/* Phone Field */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          <Phone className="w-4 h-4 inline mr-2" />
                          Phone Number
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your phone number"
                          />
                        ) : (
                          <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                            {profileData.phone}
                          </div>
                        )}
                      </div>

                      {/* Address Field */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          <MapPin className="w-4 h-4 inline mr-2" />
                          Address
                        </label>
                        {isEditing ? (
                          <textarea
                            value={editData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your address"
                          />
                        ) : (
                          <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                            {profileData.address}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Work Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Work Information</h3>
                      
                      {/* Role Field */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          <Shield className="w-4 h-4 inline mr-2" />
                          Role
                        </label>
                        <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                          {profileData.role}
                        </div>
                      </div>

                      {/* Department Field */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Department
                        </label>
                        <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                          {profileData.department}
                        </div>
                      </div>

                      {/* Join Date Field */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          Join Date
                        </label>
                        <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                          {new Date(profileData.joinDate).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Last Login Field */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Last Login
                        </label>
                        <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                          {profileData.lastLogin}
                        </div>
                      </div>

                      {/* Permissions */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Permissions
                        </label>
                        <div className="space-y-2">
                          {profileData.permissions.map((permission, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">{permission}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- MOBILE BOTTOM NAV ---------- */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden flex justify-between items-center px-4 py-2 z-50">
        <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center text-gray-600">
          <Home className="w-5 h-5" />
          <span className="text-xs">Home</span>
        </button>

        <button onClick={() => navigate('/jobs-dashboard')} className="flex flex-col items-center text-gray-600">
          <FileText className="w-5 h-5" />
          <span className="text-xs">Jobs</span>
        </button>

        <button onClick={() => navigate('/admin/profile')} className="flex flex-col items-center text-gray-600">
          <User className="w-5 h-5" />
          <span className="text-xs">Profile</span>
        </button>

        <button onClick={handleLogout} className="flex flex-col items-center text-gray-600">
          <LogOut className="w-5 h-5" />
          <span className="text-xs">Logout</span>
        </button>
      </nav>
    </div>
  )
}

export default AdminProfilePage