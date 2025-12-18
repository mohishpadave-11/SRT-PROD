import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit, Save, X, Settings } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'

const AdminProfilePage = () => {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  
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



  return (
    <DashboardLayout>
        <div className="max-w-4xl mx-auto">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Admin Profile</h1>
                  <p className="text-gray-600">Manage your account settings and personal information</p>
                </div>
                
                {!isEditing ? (
                  <div className="mt-4 sm:mt-0 flex gap-2">
                    <button
                      onClick={() => navigate('/admin/companies')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <button
                      onClick={handleEdit}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </button>
                  </div>
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
    </DashboardLayout>
  )
}

export default AdminProfilePage