import { FileText, X, Download } from 'lucide-react'

const PdfViewerModal = ({ isOpen, fileName, onClose, onDownload }) => {
  if (!isOpen || !fileName) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden m-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {fileName}
            </h3>
          </div>
          <div className="flex items-center">
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer Content */}
        <div className="flex-1 h-full bg-gray-100 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-12 h-12 text-red-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">PDF Preview</h4>
            <p className="text-gray-600 mb-4">
              {fileName}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              In a real application, this would show the PDF content using a PDF viewer library like react-pdf or pdf.js
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => onDownload({ stopPropagation: () => {} }, fileName)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PdfViewerModal