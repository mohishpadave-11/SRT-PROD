import toast from 'react-hot-toast';
import { downloadDocumentAPI, deleteDocumentAPI } from '../services/documentService';

const useDocumentActions = () => {
  
  // Delete confirmation toast with callback
  const handleDelete = (documentId, documentName, onSuccess) => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[250px]">
        <div className="font-medium text-gray-900">
          Delete Document <span className="font-bold text-gray-800">{documentName}</span>?
        </div>
        <p className="text-sm text-gray-500">
          Are you sure? This action cannot be undone.
        </p>
        <div className="flex gap-2 justify-end pt-2">
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deleteDocumentAPI(documentId);
                toast.success("Document deleted successfully");
                if (onSuccess) onSuccess();
              } catch (err) {
                toast.error("Failed to delete document.");
              }
            }}
            className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    ), { 
      duration: 5000, 
      position: 'top-center',
      style: {
        background: '#fff',
        color: '#333',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        borderRadius: '8px',
        padding: '16px',
        border: '1px solid #E5E7EB'
      },
      icon: null
    });
  };

  // Download document
  const handleDownload = async (documentId, documentName) => {
    try {
      const url = await downloadDocumentAPI(documentId, 'attachment');
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', documentName || 'download');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Document downloaded");
    } catch (err) {
      toast.error("Failed to download document.");
    }
  };

  // Preview document
  const handlePreview = async (documentId) => {
    try {
      const url = await downloadDocumentAPI(documentId, 'inline');
      window.open(url, '_blank');
    } catch (err) {
      toast.error("Failed to open document preview.");
    }
  };

  // Share document
  const handleShare = async (type, documentId, documentName) => {
    try {
      const url = await downloadDocumentAPI(documentId, 'inline');
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch file');
      
      const blob = await response.blob();
      
      if (type === 'whatsapp') {
        // Try native share first
        if (navigator.share && navigator.canShare) {
          try {
            const file = new File([blob], documentName, { type: 'application/pdf' });
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({ files: [file] });
              toast.success("Shared successfully");
              return;
            }
          } catch (shareErr) {
            console.log('Native share failed, using fallback');
          }
        }
      }
      
      // Fallback: Download file
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = documentName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      
      toast.success(type === 'whatsapp' ? "File downloaded for sharing" : "File downloaded for Gmail attachment");
    } catch (err) {
      console.error(err);
      toast.error("Failed to prepare file for sharing");
    }
  };

  return {
    handleDelete,
    handleDownload,
    handlePreview,
    handleShare
  };
};

export default useDocumentActions;