import axiosClient from '../api/axiosClient.js';

// 1. Upload Document
export const uploadDocumentAPI = async (jobId, docType, file) => {
  const formData = new FormData();
  formData.append('job_id', jobId);
  formData.append('doc_type', docType);
  formData.append('file', file);

  try {
    const response = await axiosClient.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error("Upload Error:", error);
    throw error.response?.data?.message || 'Upload failed';
  }
};

// 2. Get Documents for a specific Job
export const getJobDocumentsAPI = async (jobId) => {
  try {
    const response = await axiosClient.get(`/documents/${jobId}`);
    return response;
  } catch (error) {
    console.error("Fetch Docs Error:", error);
    throw error;
  }
};

// 3. Get Download Link (Updated to handle Disposition)
export const downloadDocumentAPI = async (docId, disposition = 'attachment') => {
  try {
    if (!docId) throw new Error('Document ID is required');
    if (!['attachment', 'inline'].includes(disposition)) {
      throw new Error('Invalid disposition parameter');
    }

    const response = await axiosClient.get(
      `/documents/download/${docId}?disposition=${disposition}`
    );

    if (!response || !response.downloadUrl) {
      throw new Error('Invalid response from server');
    }

    return response.downloadUrl;
  } catch (error) {
    console.error("Download Error:", error);
    throw error;
  }
};

// 4. Delete Document
export const deleteDocumentAPI = async (docId) => {
  try {
    const response = await axiosClient.delete(`/documents/${docId}`);
    return response;
  } catch (error) {
    console.error("Delete Error:", error);
    throw error;
  }
};

// 5. Get Share Options (NEW Feature)
// Returns ready-to-use links for WhatsApp and Gmail that are cross-platform compatible
export const getShareOptionsAPI = async (docId, fileName) => {
  try {
    // 1. Get the actual accessible URL (using 'inline' for better viewing experience)
    const fileUrl = await downloadDocumentAPI(docId, 'inline');
    
    // 2. Encode text for URLs to ensure special characters don't break the links
    const text = `Please check this document: ${fileName}`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(fileUrl);
    const combinedBody = `${encodedText}%0A%0A${encodedUrl}`; // %0A is a line break

    return [
      {
        id: 'whatsapp',
        label: 'WhatsApp',
        // 'wa.me' is the universal link that works on Mac/Windows Desktop App & Web
        url: `https://wa.me/?text=${combinedBody}`, 
        icon: 'message-circle' 
      },
      {
        id: 'gmail',
        label: 'Gmail',
        // Opens Gmail compose window specifically
        url: `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent('Shared Document: ' + fileName)}&body=${combinedBody}`,
        icon: 'mail'
      },
      {
        id: 'email',
        label: 'Default Mail App',
        // Opens the system default (Outlook on Windows, Mail on Mac)
        url: `mailto:?subject=${encodeURIComponent('Shared Document: ' + fileName)}&body=${combinedBody}`,
        icon: 'send'
      }
    ];
  } catch (error) {
    console.error("Share Error:", error);
    throw error;
  }
};