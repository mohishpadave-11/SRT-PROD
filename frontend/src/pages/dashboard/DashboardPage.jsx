// DashboardPage.jsx
import { useState, useEffect } from 'react'
import { MoreVertical, Home, FileText, LogOut, Search, User } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import StatsCard from '../../dashboardcomponents/components/StatsCard'
import JobsOvertime from '../../dashboardcomponents/components/JobsOvertime'
import JobMapping from '../../dashboardcomponents/components/JobMapping'
import JobsCreated from '../../dashboardcomponents/components/JobsCreated'
import Top5Parties from '../../dashboardcomponents/components/Top5Parties'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getDashboardData } from '../../services/api'
import logo from '../../assets/srtship-logo.png'

const DashboardPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedMonth, setSelectedMonth] = useState('Jan')
  const [selectedDecade, setSelectedDecade] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedMapMonth, setSelectedMapMonth] = useState('')
  const [availableYears, setAvailableYears] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [dashboardData, setDashboardData] = useState({
    totalJobs: 456,
    totalParties: 249,
    jobsByCountry: {
      '840': 125, // United States
      '156': 89,  // China
      '276': 67,  // Germany
      '826': 54,  // United Kingdom
      '392': 43,  // Japan
      '356': 78,  // India
      '036': 32,  // Australia
      '076': 28,  // Brazil
      '484': 21,  // Mexico
      '682': 19   // Saudi Arabia
    },
    jobsCreatedData: { 
      lastMonth: 100, 
      thisMonth: 250, 
      chartData: [
        { name: 'Week 1', lastMonth: 85, thisMonth: 75 },
        { name: 'Week 2', lastMonth: 80, thisMonth: 70 },
        { name: 'Week 3', lastMonth: 90, thisMonth: 85 },
        { name: 'Week 4', lastMonth: 85, thisMonth: 80 },
        { name: 'Week 5', lastMonth: 95, thisMonth: 90 },
        { name: 'Week 6', lastMonth: 88, thisMonth: 85 },
        { name: 'Week 7', lastMonth: 92, thisMonth: 95 },
        { name: 'Week 8', lastMonth: 90, thisMonth: 100 }
      ]
    },
    topParties: [
      { name: 'DataCircles Tech', jobs: 45, percentage: 18.2 },
      { name: 'Cottson Clothing', jobs: 38, percentage: 15.4 },
      { name: 'Global Shipping Co', jobs: 32, percentage: 13.0 },
      { name: 'Ocean Freight Ltd', jobs: 28, percentage: 11.3 },
      { name: 'Maritime Solutions', jobs: 24, percentage: 9.7 }
    ]
  })

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const goToDashboard = () => {
    navigate('/dashboard')
  }

  const handleDecadeChange = (decade) => {
    setSelectedDecade(decade)
    setSelectedYear('')
    
    if (decade) {
      const [start, end] = decade.split('-').map(Number)
      const years = []
      for (let year = start; year <= Math.min(end, 2026); year++) {
        years.push(year)
      }
      setAvailableYears(years)
    } else {
      setAvailableYears([])
    }
  }

  useEffect(() => {
    // Load initial dashboard data on component mount
    setIsLoading(true)
    getDashboardData(2025, 12) // Default to current year and month
      .then(response => {
        if (response.success) {
          setDashboardData(response.data)
        }
      })
      .catch(error => {
        console.error('Failed to fetch dashboard data:', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    // Update data when year/month selection changes
    if (selectedYear && selectedMapMonth) {
      setIsLoading(true)
      getDashboardData(selectedYear, selectedMapMonth)
        .then(response => {
          if (response.success) {
            setDashboardData(response.data)
          }
        })
        .catch(error => {
          console.error('Failed to fetch dashboard data:', error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [selectedYear, selectedMapMonth])

  if (isLoading) {
    return (
      <div className="h-screen bg-gray-50 w-full flex flex-col overflow-hidden">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full flex flex-col">
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
                <span>New Job</span>
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
      <div className="flex flex-1 w-full items-stretch overflow-hidden">
        
        {/* ---------- DESKTOP SIDEBAR ---------- */}
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
        </aside>

        {/* ---------- MAIN CONTENT AREA ---------- */}
        {/* Added 'flex flex-col' so content and footer stack correctly within the scroll area */}
        <main className="flex-1 overflow-auto md:ml-0 flex flex-col min-h-[calc(100vh-5rem)]">
          
          {/* CONTENT WRAPPER - Padding applied here ONLY */}
          <div className="flex-1 p-2 sm:p-4 lg:p-6">
            
            {/* Greeting */}
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Good Evening, SRT Shipping! Still going Strong?</h1>
              <p className="text-sm text-gray-500 mt-1">Let's See what's on your plate today.</p>
              <p className="text-xs text-gray-400">Wednesday, December 10, 2025</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard title="Total Jobs Created" value={dashboardData.totalJobs.toString()} change="+10% from last month" positive={true} bgColor="bg-blue-50" />
              <StatsCard title="Total Parties" value={dashboardData.totalParties.toString()} change="+10% from last month" positive={false} bgColor="bg-red-50" />
              <StatsCard title="Total Invoices" value="879" change="+3% from last month" positive={true} bgColor="bg-teal-50" />
              <StatsCard title="Total Invoice Pending" value="12" change="+10% from last month" positive={true} bgColor="bg-blue-50" />
            </div>

            {/* Jobs Created Overtime */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Jobs Created Overtime</h2>
                  <p className="text-sm text-gray-500 hidden sm:block">Monitor how many jobs are being created over a period of time (Current Year: 2025)</p>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="border border-gray-300 rounded-lg px-2 sm:px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 sm:flex-none"
                  >
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                  <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer hidden sm:block" />
                </div>
              </div>
              <div className="h-64 sm:h-80">
                <JobsOvertime selectedMonth={selectedMonth} />
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
              <div className="xl:col-span-2 bg-white rounded-lg shadow-sm p-4 sm:p-6 h-fit">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
                  <h2 className="text-lg font-semibold text-gray-800">Job Mapping by Country</h2>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <select value={selectedDecade} onChange={(e) => handleDecadeChange(e.target.value)} className="border border-gray-300 rounded-lg px-2 sm:px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto">
                      <option value="">Select Decade</option>
                      <option value="2000-2009">2000-2009</option>
                      <option value="2010-2019">2010-2019</option>
                      <option value="2020-2029">2020-2029</option>
                    </select>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} disabled={!selectedDecade} className="border border-gray-300 rounded-lg px-2 sm:px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed w-full sm:w-auto">
                      <option value="">Select Year</option>
                      {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                    <select value={selectedMapMonth} onChange={(e) => setSelectedMapMonth(e.target.value)} className="border border-gray-300 rounded-lg px-2 sm:px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto">
                      <option value="">Select Month</option>
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => <option key={m} value={m}>{new Date(0, m-1).toLocaleString('default', { month: 'long' })}</option>)}
                    </select>
                  </div>
                </div>
                <div className="h-80 sm:h-96 lg:h-[32rem] overflow-hidden rounded-lg">
                  <JobMapping jobsByCountry={dashboardData.jobsByCountry} />
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex-1">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Jobs Created</h2>
                  <div className="h-40 sm:h-48">
                    <JobsCreated data={dashboardData.jobsCreatedData?.chartData} lastMonth={dashboardData.jobsCreatedData?.lastMonth} thisMonth={dashboardData.jobsCreatedData?.thisMonth} />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex-1">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Parties</h2>
                  <div className="h-40 sm:h-48">
                    <Top5Parties data={dashboardData.topParties} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - OUTSIDE the padded container, touching the edges */}
          <footer className="bg-blue-900 text-white text-center py-4 mt-auto w-full">
            <p className="text-xs sm:text-sm">
              © Copyrights 2025. All rights reserved | Software Designed & Hosted by DataCircles Technologies for SRT Shipping Pvt. Ltd.
            </p>
          </footer>
        </main>
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

export default DashboardPage