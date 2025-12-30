import { useState, useEffect, useMemo } from 'react'
import { RefreshCw } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import Spinner from '../../components/ui/Spinner'

// --- Components ---
import StatsCard from '../../dashboardcomponents/components/StatsCard'
import JobsOvertime from '../../dashboardcomponents/components/JobsOvertime'
import JobMapping from '../../dashboardcomponents/components/JobMapping'
import JobsCreated from '../../dashboardcomponents/components/JobsCreated'
import Top5Parties from '../../dashboardcomponents/components/Top5Parties'
import DashboardLayout from '../../components/layout/DashboardLayout'

// --- Services & Utils ---
import { getJobsAPI } from '../../services/jobService'
import {
  calculateTop5Parties,
  calculateMapData,
  calculateJobsCreated,
  calculateDailyJobs,
  calculateTotalCounts
} from '../../utils/dashboardStats'

const DashboardPage = () => {
  const location = useLocation()
  
  // --- State ---
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  // Filter States
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'short' }))

  // Map Filter States
  const [selectedDecade, setSelectedDecade] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedMapMonth, setSelectedMapMonth] = useState('')
  const [availableYears, setAvailableYears] = useState([])

  // --- 1. Fetch Data on Mount ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await getJobsAPI()
        // Handle different API response structures (array vs object with data property)
        const jobArray = Array.isArray(response) ? response : (response.data || [])
        setJobs(jobArray)
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // --- 1.1. Listen for focus events to refresh data when user returns to dashboard ---
  useEffect(() => {
    const handleFocus = () => {
      // Refetch data when user returns to the dashboard tab/window
      const fetchData = async () => {
        try {
          const response = await getJobsAPI()
          const jobArray = Array.isArray(response) ? response : (response.data || [])
          setJobs(jobArray)
        } catch (err) {
          console.error('Failed to refresh dashboard data:', err)
        }
      }
      fetchData()
    }

    // Add event listener for when user returns to the tab
    window.addEventListener('focus', handleFocus)
    
    // Also listen for visibility change (when switching tabs)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handleFocus()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup
    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // --- 2. Manual Refresh Function ---
  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      const response = await getJobsAPI()
      const jobArray = Array.isArray(response) ? response : (response.data || [])
      setJobs(jobArray)
    } catch (err) {
      console.error('Failed to refresh dashboard data:', err)
      setError('Failed to refresh data')
    } finally {
      setRefreshing(false)
    }
  }

  // --- 1.2. Handle navigation state (when redirected from job creation) ---
  useEffect(() => {
    if (location.state?.refresh) {
      handleRefresh()
      // Clear the state to prevent unnecessary refreshes
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  // --- 3. Handle Filter Logic ---

  const handleDecadeChange = (decade) => {
    setSelectedDecade(decade)
    setSelectedYear('') // Reset year when decade changes

    if (decade) {
      const [start, end] = decade.split('-').map(Number)
      const years = []
      // Generate years for the selected decade
      for (let year = start; year <= end; year++) {
        years.push(year)
      }
      setAvailableYears(years)
    } else {
      setAvailableYears([])
    }
  }

  // --- 3. Memoized Calculations (Real-Time Stats) ---

  // A. Filter Jobs for the Map based on Dropdowns
  const filteredMapJobs = useMemo(() => {
    if (!selectedYear) return jobs; // Return all jobs if no specific year selected

    return jobs.filter(job => {
      const date = new Date(job.job_date || job.createdAt);
      const jobYear = date.getFullYear();
      const jobMonth = date.getMonth() + 1; // 1-12

      const yearMatch = jobYear === parseInt(selectedYear);
      const monthMatch = selectedMapMonth ? jobMonth === parseInt(selectedMapMonth) : true;

      return yearMatch && monthMatch;
    });
  }, [jobs, selectedYear, selectedMapMonth]);

  // B. Calculate Statistics using Utils
  const stats = useMemo(() => {
    return {
      topParties: calculateTop5Parties(jobs),
      mapData: calculateMapData(filteredMapJobs), // Use filtered jobs for map
      jobsCreated: calculateJobsCreated(jobs),
      dailyJobs: calculateDailyJobs(jobs, selectedMonth),
      totalCounts: calculateTotalCounts(jobs),
      uniqueParties: new Set(jobs.map(j => j.notify_party)).size
    }
  }, [jobs, filteredMapJobs, selectedMonth])

  // --- Render ---

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>

      {/* Greeting */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Good Evening, SRT Shipping! Still going Strong?</h1>
            <p className="text-sm text-gray-500 mt-1">Let's See what's on your plate today.</p>
            <p className="text-xs text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Jobs Created"
          value={jobs.length.toString()}
          change={stats.totalCounts.thisMonth > stats.totalCounts.lastMonth ? "+10% from last month" : "-2% from last month"} // Dynamic label logic could be added here
          positive={stats.totalCounts.thisMonth >= stats.totalCounts.lastMonth}
          bgColor="bg-blue-50"
        />
        <StatsCard
          title="Total Parties"
          value={stats.uniqueParties.toString()}
          change="Active Clients"
          positive={true}
          bgColor="bg-red-50"
        />
        <StatsCard
          title="Total Invoices"
          value={jobs.filter(j => j.invoice_no).length.toString()}
          change="Invoices Generated"
          positive={true}
          bgColor="bg-teal-50"
        />
        <StatsCard
          title="Jobs This Month"
          value={stats.totalCounts.thisMonth.toString()}
          change="Current Activity"
          positive={true}
          bgColor="bg-blue-50"
        />
      </div>

      {/* Jobs Created Overtime */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Jobs Created Overtime</h2>
            <p className="text-sm text-gray-500 hidden sm:block">Monitor how many jobs are being created over a period of time (Current Year: {new Date().getFullYear()})</p>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 sm:px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 sm:flex-none"
            >
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer hidden sm:block" />
          </div>
        </div>
        <div className="h-64 sm:h-80">
          {/* We pass the CALCULATED daily data here instead of random data */}
          <JobsOvertime selectedMonth={selectedMonth} customData={stats.dailyJobs} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

        {/* Job Mapping (World Map) */}
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
                <option value="">All Months</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'long' })}</option>)}
              </select>
            </div>
          </div>
          <div className="h-80 sm:h-96 lg:h-[32rem] overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
            {/* Pass the CALCULATED map data */}
            <JobMapping jobsByCountry={stats.mapData} />
          </div>
        </div>

        {/* Side Stats (Jobs Created & Top 5) */}
        <div className="flex flex-col gap-6">

          {/* Jobs Created (Area Chart) */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex-1">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Jobs Created</h2>
            <div className="h-40 sm:h-48">
              <JobsCreated
                data={stats.jobsCreated.chartData}
                lastMonth={stats.jobsCreated.totals.lastMonth}
                thisMonth={stats.jobsCreated.totals.thisMonth}
              />
            </div>
          </div>

          {/* Top 5 Parties (Bar Chart) */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex-1">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Parties</h2>
            <div className="h-40 sm:h-48">
              {stats.topParties.length > 0 ? (
                <Top5Parties data={stats.topParties} />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                  No party data available
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
