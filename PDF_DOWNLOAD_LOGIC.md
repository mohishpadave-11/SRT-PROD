# PDF Download Logic Documentation

## Overview
This document explains how PDF and document downloading works in the application, from frontend user interaction to backend file retrieval from Cloudflare R2 storage.

## Architecture Flow

```
User Click → Frontend Handler → API Call → Backend Controller → R2 Storage → Signed URL → Download
```

## Detailed Flow

### 1. Frontend User Interaction
**Location:** `frontend/src/pages/JobsDashboard/JobDetailsPage.jsx`

When a user clicks the download button on a document:

```javascript
const handleDownloadDocument = async (e, documentName, documentId) => {
    if (e) e.stopPropagation();
    const docId = documentId || documents.find(d => d.name === documentName)?.id;
    if (!docId) { 
        notify.error("Document ID missing");
        return; 
    }

    try {
        // Call API to get download URL
        const url = await downloadDocumentAPI(docId, 'attachment');
        
        // Create temporary link and trigger download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', documentName || 'download'); 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        notify.success("Download started");
    } catch (err) {
        notify.error("Failed to download document.");
    }
};
```

### 2. Frontend API Service
**Location:** `frontend/src/services/documentService.js`

The frontend calls the document service:

```javascript
export const downloadDocumentAPI = async (docId, disposition = 'attachment') => {
  try {
    if (!docId) throw new Error('Document ID is required');
    if (!['attachment', 'inline'].includes(disposition)) {
      throw new Error('Invalid disposition parameter');
    }

    // Make API call to backend
    const response = await axios.get(
      `${API_URL}/download/${docId}?disposition=${disposition}`, 
      getAuthConfig()
    );

    if (!response.data || !response.data.downloadUrl) {
      throw new Error('Invalid response from server');
    }

    return response.data.downloadUrl; // Returns signed URL
  } catch (error) {
    // Error handling...
  }
};
```

### 3. Backend Route Handler
**Location:** `backend/routes/documentRoutes.js`

The API request hits the backend route:

```javascript
router.get('/download/:id', protect, validateDownloadParams, downloadDocument);
```

**Middleware Chain:**
1. `protect` - Validates JWT token and user authentication
2. `validateDownloadParams` - Validates document ID and disposition parameter
3. `downloadDocument` - Main controller function

### 4. Backend Controller Logic
**Location:** `backend/controllers/documentController.js`

The main download logic:

```javascript
exports.downloadDocument = async (req, res) => {
  try {
    // 1. Find document in database
    const doc = await Document.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    // 2. Security check - verify user has access to this document's job
    const job = await Job.findByPk(doc.job_id);
    if (!job) {
      return res.status(404).json({ message: 'Associated job not found' });
    }

    // 3. Determine download behavior
    const dispositionType = req.query.disposition === 'attachment' ? 'attachment' : 'inline';

    // 4. Sanitize filename for security
    const sanitizedFilename = doc.original_name
      .replace(/[^\w\s.-]/g, '') // Remove special chars
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .substring(0, 255); // Limit filename length

    // 5. Create S3/R2 command with proper headers
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: doc.r2_key, // File path in R2 storage
      ResponseContentDisposition: dispositionType === 'attachment'
        ? `attachment; filename="${sanitizedFilename}"` 
        : 'inline',
      ResponseContentType: doc.mime_type || 'application/octet-stream',
      ResponseCacheControl: 'private, max-age=3600'
    });

    // 6. Generate presigned URL (valid for 1 hour)
    const url = await getSignedUrl(r2Client, command, { expiresIn: 3600 });

    // 7. Return signed URL to frontend
    res.status(200).json({ success: true, downloadUrl: url });

  } catch (error) {
    console.error("Download Error:", error);
    res.status(500).json({ message: 'Could not generate document link' });
  }
};
```

## Storage Architecture

### File Storage Location
- **Storage Provider:** Cloudflare R2 (S3-compatible)
- **File Path Structure:** `jobs/{job_id}/{doc_type}/{secure_filename}`
- **Example:** `jobs/123/commercial_invoice/doc_456_20241224_invoice.pdf`

### Database Record
Each document has a database record with:
- `id` - Primary key
- `job_id` - Associated job
- `doc_type` - Document type (e.g., "Commercial Invoice")
- `original_name` - Original filename
- `r2_key` - Path in R2 storage
- `mime_type` - File MIME type
- `size` - File size in bytes

## Security Features

### 1. Authentication & Authorization
- JWT token required for all document operations
- User can only access documents from their own jobs
- Document ID validation prevents unauthorized access

### 2. Filename Sanitization
```javascript
const sanitizedFilename = doc.original_name
  .replace(/[^\w\s.-]/g, '') // Remove special characters
  .replace(/\s+/g, '_') // Replace spaces with underscores
  .substring(0, 255); // Limit length
```

### 3. Presigned URLs
- URLs are temporary (1 hour expiration)
- Generated on-demand, not stored
- Include proper Content-Disposition headers

### 4. Content-Type Security
- MIME type validation during upload
- Proper Content-Type headers in download response
- Content-Disposition prevents code execution

## Download vs Preview

### Download Mode (`disposition=attachment`)
- Forces browser to download file
- Sets `Content-Disposition: attachment; filename="..."`
- File is saved to user's download folder

### Preview Mode (`disposition=inline`)
- Allows browser to display file inline
- Sets `Content-Disposition: inline`
- PDFs open in browser, images display directly

## Error Handling

### Common Error Scenarios
1. **Document not found** - 404 error
2. **R2 credentials missing** - 500 error (current issue)
3. **Invalid document ID** - 400 error
4. **Authentication failure** - 401 error
5. **Access denied** - 403 error

### Current Issue
The application is experiencing 500 errors because R2 credentials are not configured in `backend/.env`:

```env
# Missing R2 configuration
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=your-bucket-name
```

## Configuration Requirements

### Backend Environment Variables
```env
# Cloudflare R2 Configuration
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=your-bucket-name
```

### Frontend Configuration
```javascript
// API endpoint in documentService.js
const API_URL = 'http://localhost:3001/api/documents';
```

## Share Functionality

The share feature works similarly but generates URLs for different platforms:

1. **WhatsApp:** `https://wa.me/?text=...`
2. **Gmail:** `https://mail.google.com/mail/?view=cm&...`
3. **Default Email:** `mailto:?subject=...&body=...`

Each share option includes the presigned download URL in the message body.

## Performance Considerations

- **Presigned URLs:** Reduce server load by allowing direct R2 access
- **Caching:** 1-hour cache control headers
- **File Size Limits:** 50MB maximum upload size
- **Rate Limiting:** Applied to prevent abuse

## Troubleshooting

### 500 Internal Server Error
- Check R2 credentials in backend/.env
- Verify R2 bucket exists and is accessible
- Check server logs for specific error details

### Download Not Starting
- Verify document exists in database
- Check user permissions for the associated job
- Ensure frontend receives valid downloadUrl

### File Not Found in R2
- Check if file was uploaded successfully
- Verify r2_key path in database matches actual file location
- Check R2 bucket permissions