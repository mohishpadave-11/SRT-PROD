import { useState, useEffect } from 'react'
import { getDocuments } from '../../services/api'
import DashboardLayout from '../../components/layout/DashboardLayout'
import DocumentExplorer from '../../components/dashboard/DocumentExplorer'
import PdfViewerModal from '../../components/documentdashboardcomponents/PdfViewerModal'
import useFolderSystem from '../../hooks/useFolderSystem'

const DocumentDashboard = () => {
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Use folder system hook
  const { currentFolder, folderDocuments, openFolder, closeFolder, addDocuments, removeDocument } = useFolderSystem()
  
  // PDF Viewer state
  const [showPdfViewer, setShowPdfViewer] = useState(false)
  const [currentPdf, setCurrentPdf] = useState(null)





  // Load documents on component mount
  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    setIsLoading(true)
    try {
      const response = await getDocuments({})
      if (response.success) {
        setDocuments(response.data)
      }
    } catch (error) {
      console.error('Failed to load documents:', error)
    } finally {
      setIsLoading(false)
    }
  }



  const handleDocumentClick = (document) => {
    if (document.type === 'folder') {
      // Open folder using the hook
      openFolder(document)
    } else {
      // Handle document click - open PDF viewer for PDFs
      if (document.name && document.name.toLowerCase().endsWith('.pdf')) {
        setCurrentPdf(document)
        setShowPdfViewer(true)
      } else {
        // For non-PDF documents, show a message or handle differently
        alert(`Opening document: ${document.name || document.customerName}`)
      }
    }
  }

  const handleBreadcrumbClick = (breadcrumb) => {
    if (breadcrumb.path === 'root') {
      // Go back to main folder view using the hook
      closeFolder()
    }
  }

  // Upload handler
  const handleFileUpload = (files, documentType) => {
    const success = addDocuments(files, documentType)
    
    if (!success) {
      alert('Please select a folder to upload documents to.')
      return
    }

    alert(`Successfully uploaded ${files.length} document(s) as ${documentType}`)
  }

  // Delete document handler
  const handleDeleteDocument = (e, documentId, documentName) => {
    e.stopPropagation() // Prevent triggering the document click
    
    if (confirm(`Are you sure you want to delete "${documentName}"?`)) {
      removeDocument(documentId)
      alert(`"${documentName}" has been deleted successfully.`)
    }
  }

  // Download document handler
  const handleDownloadDocument = (e, documentName) => {
    e.stopPropagation() // Prevent triggering the document click
    
    // Simulate download functionality
    alert(`Downloading "${documentName}"...`)
    // In a real application, you would trigger the actual download here
    // For example: window.open(downloadUrl) or fetch and create blob
  }

  return (
    <DashboardLayout>
      <DocumentExplorer
        documents={currentFolder ? folderDocuments : documents}
        currentFolder={currentFolder}
        isLoading={isLoading}
        onDocumentClick={handleDocumentClick}
        onUpload={handleFileUpload}
        onDelete={handleDeleteDocument}
        onDownload={handleDownloadDocument}
        allowUpload={!!currentFolder}
        title="Document Dashboard"
        subtitle="Organize and manage your job documents with ease"
        showStats={true}
        showBreadcrumb={true}
        onBreadcrumbClick={handleBreadcrumbClick}
      />

      {/* PDF Viewer Modal */}
      <PdfViewerModal 
        isOpen={showPdfViewer}
        fileName={currentPdf?.name}
        onClose={() => setShowPdfViewer(false)}
        onDownload={handleDownloadDocument}
      />
    </DashboardLayout>
  )
}

export default DocumentDashboard