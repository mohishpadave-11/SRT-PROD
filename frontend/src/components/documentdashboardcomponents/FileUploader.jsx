import { useState } from 'react'
import { FileText, ChevronDown, X, CloudUpload } from 'lucide-react'

const FileUploader = ({ onUpload, documentTypes }) => {
  const [selectedDocumentType, setSelectedDocumentType] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState('bottom')

  // Calculate dropdown position based on available space
  const calculateDropdownPosition = (buttonElement) => {
    if (!buttonElement) return 'bottom'
    
    const rect = buttonElement.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const dropdownHeight = 240 // max-h-60 = 240px
    const spaceBelow = viewportHeight - rect.bottom
    const spaceAbove = rect.top
    
    // If there's not enough space below but enough above, show above
    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      return 'top'
    }
    
    return 'bottom'
  }

  const handleDropdownToggle = (e) => {
    const newIsOpen = !isDropdownOpen
    setIsDropdownOpen(newIsOpen)
    
    if (newIsOpen) {
      const position = calculateDropdownPosition(e.currentTarget)
      setDropdownPosition(position)
    }
  }

  const handleFileUpload = (files) => {
    if (!selectedDocumentType) {
      alert('Please select a document type before uploading.')
      return
    }

    onUpload(files, selectedDocumentType)
    setSelectedDocumentType('')
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    handleFileUpload(files)
  }

  const handleFileInputChange = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files)
    }
  }

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <label className="block text-sm font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Select Document Type
          </label>
          <div className="relative w-full sm:max-w-sm">
            {/* Custom Dropdown Button */}
            <button
              type="button"
              onClick={handleDropdownToggle}
              className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 text-left text-gray-900 font-medium shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer"
            >
              {selectedDocumentType || "Choose document type..."}
            </button>
            
            {/* Custom dropdown arrow */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Custom Dropdown Menu */}
            {isDropdownOpen && (
              <>
                {/* Backdrop to close dropdown */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                
                {/* Dropdown Options - Position based on available space */}
                <div className={`absolute z-20 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto ${
                  dropdownPosition === 'top' 
                    ? 'bottom-full mb-1' 
                    : 'top-full mt-1'
                }`}>
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDocumentType('')
                        setIsDropdownOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      Choose document type...
                    </button>
                    {documentTypes.map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setSelectedDocumentType(type)
                          setIsDropdownOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2 transition-colors ${
                          selectedDocumentType === type 
                            ? 'bg-blue-50 text-blue-700 font-medium' 
                            : 'text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Selected document type display */}
          {selectedDocumentType && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                <FileText className="w-3 h-3" />
                <span className="font-medium">Selected: {selectedDocumentType}</span>
                <button
                  onClick={() => setSelectedDocumentType('')}
                  className="ml-1 hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            isDragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          } ${!selectedDocumentType ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => {
            if (selectedDocumentType) {
              document.getElementById('file-upload').click()
            }
          }}
        >
          <input
            id="file-upload"
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={!selectedDocumentType}
          />
          
          <div className="flex flex-col items-center">
            <CloudUpload className={`w-12 h-12 mb-4 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isDragOver ? 'Drop your documents here' : 'Drop your documents here, or'}
            </h3>
            <p className="text-blue-600 underline font-medium">
              click to browse
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supports PDF, DOC, DOCX, JPG, PNG files
            </p>
            {!selectedDocumentType && (
              <p className="text-sm text-red-500 mt-2">
                Please select a document type first
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileUploader