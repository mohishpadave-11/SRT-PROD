import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import MobileBottomNav from './MobileBottomNav'

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 w-full flex flex-col">
      <Header />

      {/* ---------- MAIN LAYOUT CONTAINER ---------- */}
      <div className="flex flex-1 w-full items-stretch overflow-hidden">
        <Sidebar />

        {/* ---------- MAIN CONTENT AREA ---------- */}
        <main className="flex-1 overflow-auto md:ml-0 flex flex-col min-h-[calc(100vh-5rem)] hide-scrollbar">
          
          {/* CONTENT WRAPPER */}
          <div className="flex-1 p-2 sm:p-4 lg:p-6">
            {children}
          </div>

          <Footer />
        </main>
      </div>

      <MobileBottomNav />
    </div>
  )
}

export default DashboardLayout