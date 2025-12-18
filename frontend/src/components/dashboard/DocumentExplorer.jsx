import { useState, useMemo } from 'react'
import { Search, Filter, Grid3X3, List, ChevronDown, X, Folder, ChevronRight, Home, FileText } from 'lucide-react'
import DocumentGrid from '../documentdashboardcomponents/DocumentGrid'
import FileUploader from '../documentdashboardcomponents/FileUploader'
import PaginationControls from '../documentdashboardcomponents/PaginationControls'

const DocumentExplorer = ({
  documents = [],
  currentFolder = null,
  isLoading = false,
  onDocumentClick = () => {},
  onUpload = () => {},
  onDelete = () => {},
  onDownload = () => {},
  allowUpload = true,
  title = "Documents",
  subtitle = "Manage your documents",
  showStats = false,
  showBreadcrumb = false,
  onBreadcrumbClick = () => {}
}) => {
  // Internal state for UI controls
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('')

  // Document types for uploader
  const documentTypes = [
    'Invoice',
    'PackingList', 
    'BL',
    'Insurance',
    'COO',
    'ShippingBill',
    'BillOfEntry',
    'CustomsDeclaration',
    'DeliveryOrder',
    'CargoManifest',
    'ExportLicense',
    'OriginCertificate',
    'WeightCertificate',
    'QualityCertificate',
    'HealthCertificate'
  ]

  // Pagination constants
  const ITEMS_PER_PAGE = 40

  // Internal filtering logic
  const filteredDocuments = useMemo(() => {
    let filtered = [...documents]

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(doc => 
        (doc.name && doc.name.toLowerCase().includes(searchLower)) ||
        (doc.jobNo && doc.jobNo.toLowerCase().includes(searchLower)) ||
        (doc.customerName && doc.customerName.toLowerCase().includes(searchLower))
      )
    }

    // Apply date sorting if specified
    if (sortBy) {
      filtered = filtered.filter(doc => {
        if (doc.dateModified) {
          // Convert DD-MM-YYYY to YYYY-MM-DD for comparison
          const docDate = doc.dateModified.split('-').reverse().join('-')
          return docDate === sortBy
        }
        return false
      })
    }

    return filtered
  }, [documents, searchTerm, sortBy])

  // Internal pagination logic
  const totalItems = filteredDocuments.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentDocuments = filteredDocuments.slice(startIndex, endIndex)

  // Reset pagination when search changes
  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleSortChange = (value) => {
    setSortBy(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleApplyFilters = () => {
    // Filters are applied automatically via useMemo
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setSortBy('')
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-base sm:text-lg">{subtitle}</p>
          
          {/* Breadcrumb Navigation */}
          {showBreadcrumb && currentFolder && (
            <div className="flex items-center gap-2 mt-2 sm:mt-3 text-sm">
              <button
                onClick={() => onBreadcrumbClick({ path: 'root' })}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="hidden xs:inline">Documents</span>
                <span className="xs:hidden">Docs</span>
              </button>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700 font-medium">{currentFolder.jobNo}</span>
              <span className="text-gray-500 hidden xs:inline">({documents.length} items)</span>
              <span className="text-gray-500 xs:hidden">({documents.length})</span>
            </div>
          )}
        </div>
        
        {/* Stats Cards */}
        {showStats && (
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 w-full lg:w-auto lg:min-w-[400px]">
            {currentFolder ? (
              // Inside folder view - show folder-specific stats
              <>
                <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-600 flex-1 pr-2 sm:pr-3">Total Documents</h3>
                    <div className="flex-shrink-0">
                      <FileText className="w-5 h-5 sm:w-7 sm:h-7 text-gray-600" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">{documents.length}</div>
                  <div className="text-xs sm:text-sm text-green-600">
                    <span className="hidden xs:inline">In {currentFolder.jobNo}</span>
                    <span className="xs:hidden">{currentFolder.jobNo}</span>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-600 flex-1 pr-2 sm:pr-3">Folder Size</h3>
                    <div className="flex-shrink-0">
                      <Folder className="w-5 h-5 sm:w-7 sm:h-7 text-gray-600" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
                    {Math.floor(documents.reduce((acc, doc) => acc + parseInt(doc.size || '0'), 0) / 1024)}MB
                  </div>
                  <div className="text-xs sm:text-sm text-blue-600">
                    <span className="hidden xs:inline">Total size</span>
                    <span className="xs:hidden">Size</span>
                  </div>
                </div>
              </>
            ) : (
              // Main folder view - show original stats
              <>
                <div className="bg-green-50 rounded-lg p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-600 flex-1 pr-2 sm:pr-3">Folders</h3>
                    <div className="flex-shrink-0">
                      <Folder className="w-5 h-5 sm:w-7 sm:h-7 text-gray-600" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">{documents.filter(d => d.type === 'folder').length}</div>
                  <div className="text-xs sm:text-sm text-green-600">
                    <span className="hidden xs:inline">▲ +5% from last month</span>
                    <span className="xs:hidden">▲ +5%</span>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-600 flex-1 pr-2 sm:pr-3">Documents</h3>
                    <div className="flex-shrink-0">
                      <FileText className="w-5 h-5 sm:w-7 sm:h-7 text-gray-600" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">{documents.filter(d => d.type !== 'folder').length}</div>
                  <div className="text-xs sm:text-sm text-red-600">
                    <span className="hidden xs:inline">▼ -2% from last month</span>
                    <span className="xs:hidden">▼ -2%</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Search and Filter Bar */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
            {/* Search Section */}
            <div className="flex-1 w-full sm:max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents, jobs..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-10 sm:pr-4 py-2.5 sm:py-3 bg-gray-50 border-0 rounded-lg sm:rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                />
                {searchTerm && (
                  <button
                    onClick={() => handleSearchChange('')}
                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Controls Section */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  showFilters 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Enhanced Collapsible Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort by Date</label>
                  <input
                    type="date"
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border-0 rounded-lg text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>

                <div className="flex items-end gap-2">
                  <button
                    onClick={handleApplyFilters}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium"
                  >
                    Apply
                  </button>
                  <button
                    onClick={handleClearFilters}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Section */}
      {allowUpload && (
        <FileUploader 
          onUpload={onUpload}
          documentTypes={documentTypes}
        />
      )}

      {/* Mac Finder Style Documents Display */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden" style={{ backgroundColor: '#f7f7f7' }}>
        <DocumentGrid 
          documents={currentDocuments}
          viewMode={viewMode}
          isLoading={isLoading}
          currentFolder={currentFolder}
          onDocumentClick={onDocumentClick}
          onDelete={onDelete}
          onDownload={onDownload}
        />

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <PaginationControls 
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={totalItems}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  )
}

export default DocumentExplorer