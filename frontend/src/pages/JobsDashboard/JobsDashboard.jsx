// JobsDashboard.jsx
import { useState } from 'react'
import { Download, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import DashboardLayout from '../../components/layout/DashboardLayout'
import JobsTable from '../../components/documentdashboardcomponents/JobsTable'
import { MOCK_JOBS_DATA, totalJobs, ongoingJobs, pendingJobs } from '../../data/mockJobs'

const JobsDashboard = () => {
  const navigate = useNavigate()
  const [selectedJobs, setSelectedJobs] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    parties: '',
    country: '',
    dateFrom: '',
    dateTo: '',
    portOfLoading: '',
    portOfDischarge: ''
  })

  // Use static mock data (no re-render performance issues)
  const jobs = MOCK_JOBS_DATA

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedJobs(jobs.map(job => job.id))
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

  const handleExport = () => {
    alert('Export functionality will be implemented')
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
  }

  const handleApplyFilters = () => {
    console.log('Applying filters:', filters)
  }

  return (
    <DashboardLayout>
            
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
                jobs={jobs}
                selectedIds={selectedJobs}
                onSelectAll={handleSelectAll}
                onSelectRow={handleSelectJob}
                onNavigate={handleNavigate}
              />
            </div>
    </DashboardLayout>
  )
}

export default JobsDashboard