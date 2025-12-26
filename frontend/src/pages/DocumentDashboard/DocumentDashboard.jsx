import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { getJobsAPI } from '../../services/jobService' 
import { uploadDocumentAPI, getJobDocumentsAPI } from '../../services/documentService' 
import DashboardLayout from '../../components/layout/DashboardLayout'
import DocumentExplorer from '../../components/dashboard/DocumentExplorer'
import useDocumentActions from '../../hooks/useDocumentActions'

const DocumentDashboard = () => {
  const [items, setItems] = useState([]) 
  const [currentFolder, setCurrentFolder] = useState(null) 
  const [isLoading, setIsLoading] = useState(true)

  // Use document actions hook
  const { handleDelete, handleDownload, handlePreview, handleShare } = useDocumentActions();
  
  // 1. Initial Load: Fetch All Jobs and show as Folders
  useEffect(() => {
    loadRootFolders()
  }, [])

  const loadRootFolders = async () => {
    setIsLoading(true)
    setCurrentFolder(null)
    try {
      const jobs = await getJobsAPI()
      const folders = jobs.map(job => ({
        id: job.id,
        name: `Job ${job.job_number}`,
        jobNo: job.job_number,
        type: 'folder',
        size: '-',
        dateModified: new Date(job.updatedAt).toLocaleDateString()
      }))
      setItems(folders)
    } catch (error) {
      console.error('Failed to load jobs:', error)
      toast.error('Failed to load jobs')
    } finally {
      setIsLoading(false)
    }
  }

  // 2. Load Documents for a specific Job
  const openJobFolder = async (folder) => {
    setIsLoading(true)
    setCurrentFolder(folder)
    try {
        const docs = await getJobDocumentsAPI(folder.id)
        const files = docs.map(doc => ({
            id: doc.id,
            name: doc.original_name,
            type: 'document',
            size: (doc.size / 1024).toFixed(1) + ' KB',
            dateModified: new Date(doc.updatedAt).toLocaleDateString(),
            r2Key: doc.r2_key
        }))
        setItems(files)
    } catch (error) {
        toast.error("Failed to open folder")
    } finally {
        setIsLoading(false)
    }
  }

  // --- Handlers ---

  // Document handlers using the hook
  const handlePreviewDocument = (item) => handlePreview(item.id);
  const handleDownloadDocument = (e, name, id) => {
    if(e) e.stopPropagation();
    const docId = id || items.find(i => i.name === name)?.id;
    if (!docId) return;
    handleDownload(docId, name);
  };
  const handleShareDocument = (type, documentId, documentName) => handleShare(type, documentId, documentName);
  const handleDeleteDocument = (e, id, name) => {
    if (e) e.stopPropagation();
    handleDelete(id, name, () => openJobFolder(currentFolder));
  };

  // 3. MAIN CLICK HANDLER
  const handleItemClick = (item) => {
    if (item.type === 'folder') {
      openJobFolder(item)
    } else {
      handlePreviewDocument(item)
    }
  }

  const handleBreadcrumbClick = () => {
    loadRootFolders() 
  }

  const handleFileUpload = async (files, documentType) => {
    if (!currentFolder) return
    try {
        for (let i = 0; i < files.length; i++) {
            await uploadDocumentAPI(currentFolder.id, documentType, files[i])
        }
        toast.success(`Successfully uploaded ${files.length} document(s)`)
        openJobFolder(currentFolder) 
    } catch (e) { toast.error("Upload failed") }
  }

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <DocumentExplorer
        documents={items}
        currentFolder={currentFolder}
        isLoading={isLoading}
        onDocumentClick={handleItemClick}
        onUpload={handleFileUpload}
        onDelete={handleDeleteDocument}
        onDownload={handleDownloadDocument}
        onShare={handleShareDocument}
        allowUpload={!!currentFolder} 
        title={currentFolder ? currentFolder.name : "Job Folders"}
        subtitle={currentFolder ? "Manage documents" : "Select a job to view documents"}
        showStats={!currentFolder}
        showBreadcrumb={!!currentFolder}
        onBreadcrumbClick={handleBreadcrumbClick}
        documentTypes={['Commercial Invoice', 'Bill of Lading', 'Packing List', 'Certificate of Origin', 'Other']}
      />
    </DashboardLayout>
  )
}

export default DocumentDashboard