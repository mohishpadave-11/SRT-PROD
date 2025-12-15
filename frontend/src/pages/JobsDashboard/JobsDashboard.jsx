// JobsDashboard.jsx
import { useState } from 'react'
import { Eye, Edit, Trash2, Download, Filter, ChevronDown, ChevronUp, Home, FileText, LogOut, Search, User } from 'lucide-react'
import { useNavigate, useLocation } from "react-router-dom"
import logo from '../../assets/srtship-logo.png'

const JobsDashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
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

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const goToDashboard = () => {
    navigate('/dashboard')
  }

  // --- DATA GENERATION ---
  const jobs = [
    {
      id: 1,
      jobNo: '1123',
      date: '22-11-2025',
      exporterName: 'Cottson Clothing',
      exporterAddress: 'Wagle Estate, Thane, Mumbai',
      consigneeName: 'DataCircles',
      consigneeAddress: 'New York, USA',
      notifyParty: 'ABC Corp',
      portOfLoading: 'Mumbai Port',
      portOfDischarge: 'New York Port',
      finalDestination: 'New York',
      invoiceNo: 'INV-2025-001',
      invoiceDate: '20-11-2025'
    },
    {
      id: 2,
      jobNo: '1133',
      date: '22-11-2025',
      exporterName: 'Cottson Clothing',
      exporterAddress: 'Wagle Estate, Thane, Mumbai',
      consigneeName: 'DataCircles',
      consigneeAddress: 'New York, USA',
      notifyParty: 'XYZ Ltd',
      portOfLoading: 'Mumbai Port',
      portOfDischarge: 'Los Angeles Port',
      finalDestination: 'California',
      invoiceNo: 'INV-2025-002',
      invoiceDate: '20-11-2025'
    },
    {
      id: 3,
      jobNo: '1144',
      date: '22-11-2025',
      exporterName: 'Cottson Clothing',
      exporterAddress: 'Wagle Estate, Thane, Mumbai',
      consigneeName: 'DataCircles',
      consigneeAddress: 'New York, USA',
      notifyParty: 'Global Trade',
      portOfLoading: 'Mumbai Port',
      portOfDischarge: 'Singapore Port',
      finalDestination: 'Singapore',
      invoiceNo: 'INV-2025-003',
      invoiceDate: '21-11-2025'
    }
  ]

  // Fake additional jobs
  for (let i = 4; i <= 20; i++) {
    jobs.push({
      id: i,
      jobNo: `1${150 + i}`,
      date: '22-11-2025',
      exporterName: 'Cottson Clothing',
      exporterAddress: 'Wagle Estate, Thane, Mumbai',
      consigneeName: 'DataCircles',
      consigneeAddress: 'New York, USA',
      notifyParty: `Party ${i}`,
      portOfLoading: 'Mumbai Port',
      portOfDischarge: 'Various Ports',
      finalDestination: 'Various',
      invoiceNo: `INV-2025-${String(i).padStart(3, '0')}`,
      invoiceDate: '22-11-2025'
    })
  }

  const totalJobs = 5890
  const ongoingJobs = 2900
  const pendingJobs = 2500

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
      {/* Used items-stretch to ensure sidebar height matches content */}
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

          {/* Logout Button */}
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
        {/* flex-col ensures footer is pushed to bottom */}
        <main className="flex-1 overflow-auto md:ml-0 flex flex-col min-h-[calc(100vh-5rem)]">
          
          {/* CONTENT WRAPPER - Padding applied here ONLY */}
          <div className="flex-1 p-2 sm:p-4 lg:p-6 w-full max-w-[100vw]">
            
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
              <div className="bg-white rounded-lg shadow-sm">
                <div className="overflow-hidden rounded-t-lg">
                  {/* TABLE WRAPPER - Horizontal scrolling for mobile */}
                  <div className="overflow-x-auto w-full">
                    <table className="w-full min-w-[1400px]">
                      {/* ===== TABLE HEADER ===== */}
                      <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                          {/* HEADER CHECKBOX */}
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap sticky left-0 top-0 bg-gray-100 z-20 border-r border-gray-200 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                            <input
                              type="checkbox"
                              onChange={handleSelectAll}
                              checked={selectedJobs.length === jobs.length}
                              onClick={(e) => e.stopPropagation()}
                              className="rounded border-gray-300"
                            />
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Job No</th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Date</th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Exporter Name</th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Exporter Address</th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Consignee Name</th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Consignee Address</th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Notify Party</th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Port of Loading</th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Port of Discharge</th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Final Destination</th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Invoice No</th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Date</th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Action</th>
                        </tr>
                      </thead>

                      {/* ===== TABLE BODY ===== */}
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {jobs.map((job) => (
                          <tr
                            key={job.id}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => navigate(`/jobs/${job.id}`)}
                          >
                            {/* CHECKBOX (Sticky Left) */}
                            <td className="px-4 py-3 sticky left-0 bg-white z-10 border-r border-gray-100 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                              <input
                                type="checkbox"
                                checked={selectedJobs.includes(job.id)}
                                onChange={() => handleSelectJob(job.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="rounded border-gray-300"
                              />
                            </td>

                            <td className="px-4 py-3 text-sm text-gray-700">{job.jobNo}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{job.date}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{job.exporterName}</td>
                            <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-[200px]" title={job.exporterAddress}>{job.exporterAddress}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{job.consigneeName}</td>
                            <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-[200px]" title={job.consigneeAddress}>{job.consigneeAddress}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{job.notifyParty}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{job.portOfLoading}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{job.portOfDischarge}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{job.finalDestination}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{job.invoiceNo}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{job.invoiceDate}</td>

                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={(e) => { e.stopPropagation(); navigate(`/jobs/${job.id}`) }}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                  title="View"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); navigate(`/jobs/${job.id}`, { state: { edit: true } }) }}
                                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); if (confirm(`Delete job ${job.jobNo}?`)) alert('Deleted (mock)') }}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
                  <span className="text-sm text-gray-500">Showing 1 to 20 of 37 results</span>
                  <div className="flex gap-2">
                     <button className="px-3 py-1 border rounded text-xs hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                     <button className="px-3 py-1 border rounded text-xs hover:bg-gray-50">Next</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - OUTSIDE the padded container */}
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

export default JobsDashboard