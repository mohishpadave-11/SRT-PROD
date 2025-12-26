import { Home, FileText, Folder, LogOut } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import LogoutConfirmModal from './LogoutConfirmModal'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
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
    <aside className="hidden md:flex w-20 bg-white shadow-lg flex-col border-r-2 border-gray-100 flex-shrink-0 z-10">
      <nav className="py-6 flex flex-col flex-1">
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

        <button
          onClick={() => navigate('/document-dashboard')}
          className={`w-full flex flex-col items-center py-5 ${
            location.pathname === '/document-dashboard'
              ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
              : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
          }`}
          aria-label="Documents"
        >
          <Folder className="w-7 h-7" />
        </button>
      </nav>

      {/* LOGOUT BUTTON */}
      <div className="w-full pb-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex flex-col items-center py-4 text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors"
          aria-label="Logout"
        >
          <LogOut className="w-6 h-6" />
          <span className="text-xs mt-1">Logout</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </aside>
  )
}

export default Sidebar