import { FileText, Trash2, Download, X, Share2, MessageCircle, Mail } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Spinner from '../ui/Spinner'

// Mac Finder Folder Icon Component - Exact Match
const MacFinderFolder = ({ className = "w-16 h-16" }) => (
  <svg 
    className={className} 
    viewBox="0 0 64 64" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Folder Shadow */}
    <path
      d="M8 20C8 18.8954 8.89543 18 10 18H24L28 22H54C55.1046 22 56 22.8954 56 24V50C56 51.1046 55.1046 52 54 52H10C8.89543 52 8 51.1046 8 50V20Z"
      fill="#000000"
      opacity="0.1"
      transform="translate(2, 2)"
    />
    
    {/* Main Folder Body */}
    <path
      d="M8 20C8 18.8954 8.89543 18 10 18H24L28 22H54C55.1046 22 56 22.8954 56 24V50C56 51.1046 55.1046 52 54 52H10C8.89543 52 8 51.1046 8 50V20Z"
      fill="#4A9EFF"
    />
    
    {/* Folder Tab */}
    <path
      d="M8 20C8 18.8954 8.89543 18 10 18H24L28 22H54C55.1046 22 56 22.8954 56 24V22C56 20.8954 55.1046 20 54 20H28L24 16H10C8.89543 16 8 16.8954 8 18V20Z"
      fill="#6BB6FF"
    />
    
    {/* Top Highlight */}
    <path
      d="M8 20C8 18.8954 8.89543 18 10 18H24L28 22H54C55.1046 22 56 22.8954 56 24V25C56 23.8954 55.1046 23 54 23H28L24 19H10C8.89543 19 8 19.8954 8 21V20Z"
      fill="white"
      opacity="0.3"
    />
    
    {/* Side Highlight */}
    <path
      d="M9 21V49C9 50.1046 9.89543 51 11 51H53C54.1046 51 55 50.1046 55 49V25C55 23.8954 54.1046 23 53 23H29L25 19H11C9.89543 19 9 19.8954 9 21Z"
      fill="white"
      opacity="0.15"
    />
  </svg>
)

const DocumentGrid = ({ 
  documents, 
  viewMode, 
  isLoading, 
  currentFolder, 
  onDocumentClick, 
  onDelete, 
  onDownload,
  onShare = () => {}
}) => {
  const [activeSharePopup, setActiveSharePopup] = useState(null)
  const popupRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setActiveSharePopup(null)
      }
    }

    if (activeSharePopup) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [activeSharePopup])

  // ✅ FIXED: Uses Spinner instead of undefined 'Loading' component
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner />
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12 sm:py-20 px-4">
        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          {currentFolder ? 'No documents in this folder' : 'No documents found'}
        </h3>
        <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
          {currentFolder 
            ? 'This folder appears to be empty' 
            : 'Try adjusting your search criteria or create your first document'
          }
        </p>
        {!currentFolder && (
          <button className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base">
            Create Document
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6">
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3 sm:gap-4 lg:gap-6 p-2 sm:p-4">
          {documents.map((document) => (
            <div
              key={document.id}
              onClick={() => onDocumentClick(document)}
              className="flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105"
            >
              {/* Mac Finder Style Folder */}
              <div className="mb-1 sm:mb-2">
                {document.type === 'folder' ? (
                  <MacFinderFolder className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16" />
                ) : (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white border border-gray-300 rounded-lg flex items-center justify-center shadow-sm">
                    <FileText className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-600" />
                  </div>
                )}
              </div>

              {/* Document Name */}
              <div className="text-center w-full px-1">
                <p className="text-xs sm:text-xs text-gray-800 hover:text-blue-700 transition-colors font-medium leading-tight break-words">
                  {currentFolder ? document.name : document.jobNo}
                </p>
                {currentFolder && document.size && (
                  <p className="text-xs text-gray-500 mt-0.5 sm:mt-1 truncate">{document.size}</p>
                )}
                
                {/* Action Icons - Only show for documents inside folders */}
                {currentFolder && document.type === 'document' && (
                  <div className="flex items-center justify-center gap-1 mt-1 sm:mt-2">
                    <button
                      onClick={(e) => onDownload(e, document.name)}
                      className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-all duration-200"
                      title={`Download ${document.name}`}
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveSharePopup(activeSharePopup === document.id ? null : document.id)
                        }}
                        className="p-1 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded transition-all duration-200"
                        title={`Share ${document.name}`}
                      >
                        <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      
                      {/* Click Popup */}
                      {activeSharePopup === document.id && (
                        <div 
                          ref={popupRef}
                          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50"
                        >
                          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 min-w-[140px]">
                            <button 
                              onClick={async (e) => {
                                e.stopPropagation();
                                onShare('whatsapp', document.id, document.name);
                                window.open('https://web.whatsapp.com/', '_blank');
                                setActiveSharePopup(null);
                              }}
                              className="flex items-center gap-2 w-full p-2 rounded hover:bg-green-50 transition-colors text-left"
                            >
                              <MessageCircle className="w-3 h-3 text-green-600" />
                              <span className="text-xs font-medium">WhatsApp</span>
                            </button>
                            
                            <button 
                              onClick={async (e) => {
                                e.stopPropagation();
                                onShare('gmail', document.id, document.name);
                                window.open('https://mail.google.com/', '_blank');
                                setActiveSharePopup(null);
                              }}
                              className="flex items-center gap-2 w-full p-2 rounded hover:bg-red-50 transition-colors text-left"
                            >
                              <Mail className="w-3 h-3 text-red-600" />
                              <span className="text-xs font-medium">Gmail</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => onDelete(e, document.id, document.name)}
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all duration-200"
                      title={`Delete ${document.name}`}
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3 p-2 sm:p-4">
          {documents.map((document) => (
            <div
              key={document.id}
              onClick={() => onDocumentClick(document)}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/50 cursor-pointer transition-all duration-200"
            >
              {/* Use the same Mac Finder folder design */}
              <div className="flex-shrink-0">
                {document.type === 'folder' ? (
                  <MacFinderFolder className="w-12 h-12" />
                ) : (
                  <div className="w-12 h-12 bg-white border border-gray-300 rounded-lg flex items-center justify-center shadow-sm">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 hover:text-blue-700 transition-colors truncate">
                  {currentFolder ? document.name : document.jobNo}
                </p>
                <p className="text-sm text-gray-500">
                  {currentFolder 
                    ? `${document.size} • Modified ${document.dateModified}`
                    : (document.type === 'folder' ? 'Folder' : 'Document')
                  }
                </p>
              </div>
              
              {currentFolder && (
                <div className="flex-shrink-0 flex items-center gap-1">
                  <button
                    onClick={(e) => onDownload(e, document.name)}
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    title={`Download ${document.name}`}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveSharePopup(activeSharePopup === document.id ? null : document.id)
                      }}
                      className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-all duration-200"
                      title={`Share ${document.name}`}
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    
                    {/* Click Popup */}
                    {activeSharePopup === document.id && (
                      <div 
                        ref={popupRef}
                        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50"
                      >
                        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 min-w-[140px]">
                          <button 
                            onClick={async (e) => {
                              e.stopPropagation();
                              onShare('whatsapp', document.id, document.name);
                              window.open('https://web.whatsapp.com/', '_blank');
                              setActiveSharePopup(null);
                            }}
                            className="flex items-center gap-2 w-full p-2 rounded hover:bg-green-50 transition-colors text-left"
                          >
                            <MessageCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">WhatsApp</span>
                          </button>
                          
                          <button 
                            onClick={async (e) => {
                              e.stopPropagation();
                              onShare('gmail', document.id, document.name);
                              window.open('https://mail.google.com/', '_blank');
                              setActiveSharePopup(null);
                            }}
                            className="flex items-center gap-2 w-full p-2 rounded hover:bg-red-50 transition-colors text-left"
                          >
                            <Mail className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium">Gmail</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => onDelete(e, document.id, document.name)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title={`Delete ${document.name}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DocumentGrid
