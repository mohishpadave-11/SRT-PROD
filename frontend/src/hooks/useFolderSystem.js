import { useState } from 'react'

const useFolderSystem = () => {
  // Folder navigation state
  const [currentFolder, setCurrentFolder] = useState(null)
  const [folderDocuments, setFolderDocuments] = useState([])

  // Generate mock documents for a folder
  const generateFolderDocuments = (folderId) => {
    const docs = []
    
    // Realistic shipping document names from job details page
    const documentTypes = [
      'Invoice.pdf',
      'PackingList.pdf', 
      'BL.pdf',
      'Insurance.pdf',
      'COO.pdf',
      'ShippingBill.pdf',
      'BillOfEntry.pdf',
      'CustomsDeclaration.pdf',
      'DeliveryOrder.pdf',
      'CargoManifest.pdf',
      'ExportLicense.pdf',
      'OriginCertificate.pdf',
      'WeightCertificate.pdf',
      'QualityCertificate.pdf',
      'HealthCertificate.pdf'
    ]
    
    const docCount = Math.floor(Math.random() * 10) + 5 // 5-15 documents per folder
    
    for (let i = 0; i < docCount; i++) {
      // Use realistic document names, cycling through the list
      const docName = documentTypes[i % documentTypes.length]
      
      docs.push({
        id: `${folderId}-doc-${i + 1}`,
        name: docName,
        jobNo: `DOC${String(i + 1).padStart(3, '0')}`,
        type: 'document',
        size: `${Math.floor(Math.random() * 500) + 100}KB`,
        dateModified: new Date(2021 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
        createdAt: new Date().toISOString()
      })
    }
    return docs
  }

  // Open folder and generate its contents
  const openFolder = (folder) => {
    const folderDocs = generateFolderDocuments(folder.id)
    setCurrentFolder(folder)
    setFolderDocuments(folderDocs)
  }

  // Close folder and reset to main view
  const closeFolder = () => {
    setCurrentFolder(null)
    setFolderDocuments([])
  }

  // Add documents to the current folder
  const addDocuments = (files, documentType) => {
    if (!currentFolder) {
      return false // Indicate failure - no folder selected
    }

    const newDocuments = Array.from(files).map(file => ({
      id: `${currentFolder.id}-doc-${Date.now()}-${Math.random()}`,
      name: `${documentType}.${file.name.split('.').pop()}`,
      jobNo: `DOC${String(folderDocuments.length + 1).padStart(3, '0')}`,
      type: 'document',
      size: `${Math.round(file.size / 1024)}KB`,
      dateModified: new Date().toLocaleDateString(),
      createdAt: new Date().toISOString()
    }))

    setFolderDocuments(prev => [...prev, ...newDocuments])
    return true // Indicate success
  }

  // Remove document from the current folder
  const removeDocument = (documentId) => {
    setFolderDocuments(prev => prev.filter(doc => doc.id !== documentId))
  }

  return {
    // State
    currentFolder,
    folderDocuments,
    
    // Actions
    openFolder,
    closeFolder,
    addDocuments,
    removeDocument
  }
}

export default useFolderSystem