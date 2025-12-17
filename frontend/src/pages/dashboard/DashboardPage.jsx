// DashboardPage.jsx
import { useState, useEffect } from 'react'
import { MoreVertical } from 'lucide-react'
import StatsCard from '../../dashboardcomponents/components/StatsCard'
import JobsOvertime from '../../dashboardcomponents/components/JobsOvertime'
import JobMapping from '../../dashboardcomponents/components/JobMapping'
import JobsCreated from '../../dashboardcomponents/components/JobsCreated'
import Top5Parties from '../../dashboardcomponents/components/Top5Parties'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getDashboardData } from '../../services/api'
import DashboardLayout from '../../components/layout/DashboardLayout'

const DashboardPage = () => {
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
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
            
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
    </DashboardLayout>
  )
}

export default DashboardPage