import { ChevronLeft, ChevronRight } from 'lucide-react'

const PaginationControls = ({ 
  currentPage, 
  totalPages, 
  startIndex, 
  endIndex, 
  totalItems, 
  onPageChange 
}) => {
  
  // Handlers for Prev/Next buttons
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  // Don't show pagination if there's only 1 page (or 0 items)
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-white">
      
      {/* 1. Results Counter Text */}
      <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
        {/* Desktop Text */}
        <span className="hidden sm:inline">
          Showing <span className="font-medium text-gray-900">{startIndex + 1}</span> to{' '}
          <span className="font-medium text-gray-900">{Math.min(endIndex, totalItems)}</span> of{' '}
          <span className="font-medium text-gray-900">{totalItems}</span> results
        </span>
        {/* Mobile Text (Compact) */}
        <span className="sm:hidden">
          {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} results
        </span>
      </div>

      {/* 2. Page Navigation Buttons */}
      <div className="flex items-center justify-center gap-1 sm:gap-2">
        
        {/* Previous Button */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Previous</span>
          <span className="xs:hidden">Prev</span>
        </button>
        
        {/* Page Numbers Logic */}
        <div className="flex items-center gap-1">
          {/* Show First Page + Ellipsis if we are deep in the list */}
          {currentPage > 3 && totalPages > 5 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                1
              </button>
              {currentPage > 4 && <span className="px-1 sm:px-2 text-gray-500 text-xs sm:text-sm">...</span>}
            </>
          )}

          {/* Smart Range: Show 5 pages around the current page */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              // If total pages are small, show all (1,2,3,4,5)
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              // If near the start, show (1,2,3,4,5)
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              // If near the end, show (Total-4 to Total)
              pageNum = totalPages - 4 + i;
            } else {
              // If in the middle, show (Current-2 to Current+2)
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={`page-${pageNum}`}
                onClick={() => onPageChange(pageNum)}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors font-medium ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white border border-blue-600'
                    : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Show Last Page + Ellipsis if we are far from the end */}
          {currentPage < totalPages - 2 && totalPages > 5 && (
            <>
              {currentPage < totalPages - 3 && <span className="px-1 sm:px-2 text-gray-500 text-xs sm:text-sm">...</span>}
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="hidden xs:inline">Next</span>
          <span className="xs:hidden">Next</span>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  )
}

export default PaginationControls