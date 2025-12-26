import { useState, useEffect, useRef } from 'react'
import { Download, Filter, ChevronDown, ChevronUp, Loader } from 'lucide-react'
import { useNavigate, useLocation } from "react-router-dom"
import * as XLSX from 'xlsx'; 
import toast, { Toaster } from 'react-hot-toast'; 

import DashboardLayout from '../../components/layout/DashboardLayout'
import JobsTable from '../../components/documentdashboardcomponents/JobsTable'
// Import the API function
import { getJobsAPI, deleteJobAPI } from '../../services/jobService' 

const JobsDashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const notificationShown = useRef(false)
  
  // Handle notification from navigation state
  useEffect(() => {
    if (location.state?.message && !notificationShown.current) {
      toast.success(location.state.message, { style: { fontWeight: '500' } })
      notificationShown.current = true
      // Clear the message from state to prevent showing it again on refresh
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state?.message])
  
  // State for data
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // State for selection and UI
  const [selectedJobs, setSelectedJobs] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  
  // Input State for Filters
  const [filters, setFilters] = useState({
    parties: '',
    country: '',
    dateFrom: '',
    dateTo: '',
    portOfLoading: '',
    portOfDischarge: ''
  })

  // Applied State (This actually filters the list)
  const [activeFilters, setActiveFilters] = useState(null)

  // Fetch Jobs on Mount and when component becomes visible
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        console.log('🔍 Fetching jobs...')
        const data = await getJobsAPI()
        
        // Safety Check: Ensure data is an array before setting state
        if (Array.isArray(data)) {
           console.log('📊 Jobs data received:', data.length)
           setJobs(data)
        } else {
           console.warn('⚠️ API returned non-array data:', data)
           setJobs([]) 
        }
        setError(null)
      } catch (err) {
        console.error("Failed to fetch jobs:", err)
        setError("Failed to load jobs. Check your connection or login again.")
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
    
    // Also fetch when page becomes visible (user navigates back)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchJobs()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // --- FILTERING LOGIC ---
  const getFilteredJobs = () => {
    if (!activeFilters) return jobs;

    return jobs.filter(job => {
      // 1. Parties (Search Exporter, Consignee, Notify)
      if (activeFilters.parties) {
        const term = activeFilters.parties.toLowerCase();
        const matchesParty = 
          job.exporter_name?.toLowerCase().includes(term) ||
          job.consignee_name?.toLowerCase().includes(term) ||
          job.notify_party?.toLowerCase().includes(term);
        if (!matchesParty) return false;
      }

      // 2. Country (Search Final Destination or Addresses)
      if (activeFilters.country) {
        const term = activeFilters.country.toLowerCase();
        const matchesCountry = 
          job.final_destination?.toLowerCase().includes(term) ||
          job.exporter_address?.toLowerCase().includes(term) ||
          job.consignee_address?.toLowerCase().includes(term);
        if (!matchesCountry) return false;
      }

      // 3. Port of Loading
      if (activeFilters.portOfLoading) {
        if (!job.port_of_loading?.toLowerCase().includes(activeFilters.portOfLoading.toLowerCase())) return false;
      }

      // 4. Port of Discharge
      if (activeFilters.portOfDischarge) {
        if (!job.port_of_discharge?.toLowerCase().includes(activeFilters.portOfDischarge.toLowerCase())) return false;
      }

      // 5. Date Range
      if (activeFilters.dateFrom) {
        if (new Date(job.job_date) < new Date(activeFilters.dateFrom)) return false;
      }
      if (activeFilters.dateTo) {
        if (new Date(job.job_date) > new Date(activeFilters.dateTo)) return false;
      }

      return true;
    });
  };

  const displayedJobs = getFilteredJobs();

  // Calculate Stats dynamically based on fetched jobs
  const totalJobs = jobs.length
  const ongoingJobs = jobs.filter(job => job.status === 'In Progress' || job.status === 'Ongoing').length
  const pendingJobs = jobs.filter(job => job.status === 'Pending').length

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedJobs(displayedJobs.map(job => job.id))
    } else {
      setSelectedJobs([])
    }
  }

  const handleSelectJob = (jobId) => {
    if (selectedJobs.includes(jobId)) {
      setSelectedJobs(selectedJobs.filter(id => id !== jobId))
    } else {
      setSelectedJobs([...selectedJobs, jobId])
    }
  }

  const handleNavigate = (path, options = {}) => {
    navigate(path, options)
  }

  const handleDeleteJob = async (jobId) => {
    try {
      await deleteJobAPI(jobId)
      // Remove job from local state
      setJobs(jobs.filter(job => job.id !== jobId))
      // Also remove from selected jobs if it was selected
      setSelectedJobs(selectedJobs.filter(id => id !== jobId))
    } catch (err) {
      console.error("Failed to delete job:", err)
      alert("Failed to delete job. Please try again.")
    }
  }

  const handleExport = () => {
    // Export the FILTERED list, not the full list
    if (displayedJobs.length === 0) {
      alert("No jobs to export!");
      return;
    }

    const dataToExport = displayedJobs.map(job => ({
      "Job No": job.job_number,
      "Date": job.job_date,
      "Status": job.status,
      "Exporter": job.exporter_name,
      "Consignee": job.consignee_name,
      "Loading Port": job.port_of_loading,
      "Discharge Port": job.port_of_discharge,
      "Transport Mode": job.transport_mode,
      "Shipment Type": job.shipment_type,
      "Container No": job.container_no,
      "Volume": job.volume,
      "Invoice No": job.invoice_no,
      "BL No": job.bl_no
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jobs List");
    XLSX.writeFile(workbook, "Jobs_Report.xlsx");
  }

  const handleFilter = () => {
    setShowFilters(!showFilters)
  }

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleResetFilters = () => {
    setFilters({
      parties: '',
      country: '',
      dateFrom: '',
      dateTo: '',
      portOfLoading: '',
      portOfDischarge: ''
    })
    setActiveFilters(null) // Clear applied filters
  }

  const handleApplyFilters = () => {
    console.log('Applying filters:', filters)
    setActiveFilters(filters) // Apply the filters to the list
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 text-blue-600 hover:underline"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
            
            {/* Header / Stats Section */}
            <div className="flex flex-col mb-4">
              <div className="flex-shrink-0 pt-2 pb-1">
                <h1 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-2 sm:mb-3">Job Dashboard</h1>

                {/* STAT CARDS */}
                <div className="mb-2">
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    <div className="bg-orange-50 rounded p-2 sm:p-6">
                      <h3 className="text-[10px] sm:text-sm font-medium text-gray-600 mb-0 sm:mb-1 leading-tight">Total Jobs</h3>
                      <div className="text-sm sm:text-3xl font-bold leading-tight">{totalJobs}</div>
                      <div className="text-[9px] sm:text-sm text-blue-600 leading-tight">+10%</div>
                    </div>

                    <div className="bg-green-50 rounded p-2 sm:p-6">
                      <h3 className="text-[10px] sm:text-sm font-medium text-gray-600 mb-0 sm:mb-1 leading-tight">Ongoing</h3>
                      <div className="text-sm sm:text-3xl font-bold leading-tight">{ongoingJobs}</div>
                      <div className="text-[9px] sm:text-sm text-green-600 leading-tight">+10%</div>
                    </div>

                    <div className="bg-red-50 rounded p-2 sm:p-6">
                      <h3 className="text-[10px] sm:text-sm font-medium text-gray-600 mb-0 sm:mb-1 leading-tight">Pending</h3>
                      <div className="text-sm sm:text-3xl font-bold leading-tight">{pendingJobs}</div>
                      <div className="text-[9px] sm:text-sm text-red-600 leading-tight">-20%</div>
                    </div>
                  </div>
                </div>

                {/* Export and Filter Buttons */}
                <div className="flex items-center justify-end gap-3 mt-4">
                  <button
                    onClick={handleFilter}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                    {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Section */}
            {showFilters && (
              <div className="mb-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {/* Parties */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Parties</label>
                      <input
                        type="text"
                        value={filters.parties}
                        onChange={(e) => handleFilterChange('parties', e.target.value)}
                        placeholder="Enter party name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    {/* Country */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <input
                        type="text"
                        value={filters.country}
                        onChange={(e) => handleFilterChange('country', e.target.value)}
                        placeholder="Enter country"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    {/* Date From */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                      <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    {/* Date To */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                      <input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    {/* Port of Loading */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Port of Loading</label>
                      <input
                        type="text"
                        value={filters.portOfLoading}
                        onChange={(e) => handleFilterChange('portOfLoading', e.target.value)}
                        placeholder="Loading port"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    {/* Port of Discharge */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Port of Discharge</label>
                      <input
                        type="text"
                        value={filters.portOfDischarge}
                        onChange={(e) => handleFilterChange('portOfDischarge', e.target.value)}
                        placeholder="Discharge port"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Filter Action Buttons */}
                  <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleApplyFilters}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Table Section */}
            <div className="mb-4">
              <JobsTable 
                jobs={displayedJobs} // 👈 PASS FILTERED JOBS HERE
                selectedIds={selectedJobs}
                onSelectAll={handleSelectAll}
                onSelectRow={handleSelectJob}
                onNavigate={handleNavigate}
                onDelete={handleDeleteJob}
              />
            </div>
    </DashboardLayout>
  )
}

export default JobsDashboard