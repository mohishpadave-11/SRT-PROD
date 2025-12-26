import { Home, FileText, Folder, User, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import LogoutConfirmModal from './LogoutConfirmModal'

const MobileBottomNav = () => {
  const navigate = useNavigate()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
    setShowLogoutModal(false)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden flex justify-between items-center px-4 py-2 z-50">
      <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center text-gray-600">
        <Home className="w-5 h-5" />
        <span className="text-xs">Home</span>
      </button>
      <button onClick={() => navigate('/jobs-dashboard')} className="flex flex-col items-center text-gray-600">
        <FileText className="w-5 h-5" />
        <span className="text-xs">Jobs</span>
      </button>
      <button onClick={() => navigate('/document-dashboard')} className="flex flex-col items-center text-gray-600">
        <Folder className="w-5 h-5" />
        <span className="text-xs">Documents</span>
      </button>
      <button onClick={() => navigate('/admin/profile')} className="flex flex-col items-center text-gray-600">
        <User className="w-5 h-5" />
        <span className="text-xs">Profile</span>
      </button>
      <button onClick={handleLogout} className="flex flex-col items-center text-gray-600">
        <LogOut className="w-5 h-5" />
        <span className="text-xs">Logout</span>
      </button>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </nav>
  )
}

export default MobileBottomNav