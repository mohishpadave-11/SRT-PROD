import { useState, useMemo } from 'react'
import { Search, Filter, Grid3X3, List, ChevronDown, X, Folder, ChevronRight, Home, FileText } from 'lucide-react'
import DocumentGrid from '../documentdashboardcomponents/DocumentGrid'
import FileUploader from '../documentdashboardcomponents/FileUploader'
import PaginationControls from '../documentdashboardcomponents/PaginationControls'

const DEFAULT_DOC_TYPES = [
  'Invoice', 'PackingList', 'BL', 'Insurance', 'COO', 
  'ShippingBill', 'BillOfEntry', 'CustomsDeclaration', 
  'DeliveryOrder', 'CargoManifest', 'ExportLicense', 
  'OriginCertificate', 'WeightCertificate', 
  'QualityCertificate', 'HealthCertificate', 'Other'
];

const DocumentExplorer = ({
  documents = [],
  currentFolder = null,
  isLoading = false,
  onDocumentClick = () => {},
  onUpload = () => {},
  onDelete = () => {},
  onDownload = () => {},
  onShare = () => {},
  allowUpload = true,
  title = "Documents",
  subtitle = "Manage your documents",
  showStats = false,
  showBreadcrumb = false,
  onBreadcrumbClick = () => {},
  // Allow parent to override types (e.g. JobDetails passes only 5)
  documentTypes = DEFAULT_DOC_TYPES 
}) => {
  // --- UI State ---
  const [viewMode, setViewMode] = useState('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [dateFilter, setDateFilter] = useState('') // YYYY-MM-DD from input

  // --- Pagination Config ---
  const ITEMS_PER_PAGE = 24 // Adjusted for better grid layout (4x6 or 3x8)

  // --- Filtering Logic ---
  const filteredDocuments = useMemo(() => {
    if (!documents) return [];
    
    let filtered = [...documents]

    // 1. Search Filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(doc => 
        (doc.name && doc.name.toLowerCase().includes(searchLower)) ||
        (doc.jobNo && doc.jobNo.toLowerCase().includes(searchLower)) ||
        (doc.customerName && doc.customerName.toLowerCase().includes(searchLower))
      )
    }

    // 2. Date Filter
    if (dateFilter) {
      filtered = filtered.filter(doc => {
        if (!doc.dateModified) return false;
        // Backend/Mock data is DD-MM-YYYY (e.g., "22-11-2025")
        // Input is YYYY-MM-DD (e.g., "2025-11-22")
        try {
          // Standardize both to timestamps for comparison or just string match
          const parts = doc.dateModified.split('-'); // ["22", "11", "2025"]
          if(parts.length === 3) {
             const docDateISO = `${parts[2]}-${parts[1]}-${parts[0]}`; // "2025-11-22"
             return docDateISO === dateFilter;
          }
          return false;
        } catch (e) { return false; }
      })
    }

    return filtered
  }, [documents, searchTerm, dateFilter])

  // --- Pagination Logic ---
  const totalItems = filteredDocuments.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentDocuments = filteredDocuments.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // --- Handlers ---
  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset to page 1 on search
  }

  const handleDateFilterChange = (value) => {
    setDateFilter(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      document.getElementById('explorer-top')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setDateFilter('')
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6 sm:space-y-8" id="explorer-top">
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-base sm:text-lg">{subtitle}</p>
          
          {/* Breadcrumbs */}
          {showBreadcrumb && currentFolder && (
            <div className="flex items-center gap-2 mt-2 sm:mt-3 text-sm">
              <button
                onClick={() => onBreadcrumbClick({ path: 'root' })}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="hidden xs:inline">All Jobs</span>
                <span className="xs:hidden">Jobs</span>
              </button>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700 font-medium">Job {currentFolder.jobNo}</span>
              <span className="text-gray-400 text-xs ml-2">({documents.length} items)</span>
            </div>
          )}
        </div>
        
        {/* Stats Cards */}
        {showStats && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full lg:w-auto lg:min-w-[400px]">
            {currentFolder ? (
              <>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">Total Files</span>
                    <FileText className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{documents.length}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                   <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">Folder Size</span>
                    <Folder className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {/* Calculate approximate size if string (e.g. "100KB") or number */}
                    {Math.floor(documents.reduce((acc, doc) => acc + (parseInt(doc.size) || 0), 0) / 1024)} MB
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">Active Jobs</span>
                    <Folder className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{documents.filter(d => d.type === 'folder').length}</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                   <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">Total Docs</span>
                    <FileText className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{documents.filter(d => d.type !== 'folder').length}</div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* 2. Controls Bar (Search & Filter) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, job number..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {searchTerm && (
                <button onClick={() => handleSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-2">
              {/* View Toggle */}
              <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border font-medium transition-all ${
                  showFilters || dateFilter 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                {(dateFilter) && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Collapsible Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 animate-in slide-in-from-top-2">
              <div className="flex flex-wrap items-end gap-4">
                <div className="w-full sm:w-auto">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Filter by Date</label>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => handleDateFilterChange(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                
                {dateFilter && (
                   <button
                    onClick={handleClearFilters}
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Upload Section */}
      {allowUpload && (
        <div className="animate-in fade-in duration-300">
            <FileUploader 
                onUpload={onUpload}
                documentTypes={documentTypes} // Passed from props
            />
        </div>
      )}

      {/* 4. Document Grid / List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px] flex flex-col">
        <div className="flex-1 bg-gray-50/50">
            <DocumentGrid 
                documents={currentDocuments}
                viewMode={viewMode}
                isLoading={isLoading}
                currentFolder={currentFolder}
                onDocumentClick={onDocumentClick}
                onDelete={onDelete}
                onDownload={onDownload}
                onShare={onShare}
            />
        </div>

        {/* 5. Pagination */}
        {totalItems > 0 && (
          <div className="border-t border-gray-200 bg-white p-4">
            <PaginationControls 
                currentPage={currentPage}
                totalPages={totalPages}
                startIndex={startIndex}
                endIndex={Math.min(startIndex + ITEMS_PER_PAGE, totalItems)}
                totalItems={totalItems}
                onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default DocumentExplorer