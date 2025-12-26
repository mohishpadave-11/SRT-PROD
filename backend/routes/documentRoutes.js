const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { fileUploadRateLimit } = require('../middleware/rateLimiting');
const { validateFile } = require('../utils/fileSanitization');
const { 
  uploadDocument, 
  getJobDocuments, 
  downloadDocument, 
  deleteDocument 
} = require('../controllers/documentController');

// File validation middleware
const fileValidationMiddleware = (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file provided' 
      });
    }

    // Validate file using our sanitization utility
    const validation = validateFile(req.file);
    
    // Add validation results to request for use in controller
    req.fileValidation = validation;
    
    next();
  } catch (error) {
    return res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Configure Multer with enhanced security
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 50 * 1024 * 1024, // 50MB max (will be validated per type in middleware)
    files: 1, // Only allow 1 file per request
    fieldSize: 1024 * 1024, // 1MB max field size
    fieldNameSize: 100, // Limit field name length
    headerPairs: 2000 // Limit number of header pairs
  },
  fileFilter: (req, file, cb) => {
    // Basic file filter - detailed validation in middleware
    if (!file.originalname) {
      return cb(new Error('File must have a name'), false);
    }
    
    // Check for null bytes in filename (security)
    if (file.originalname.includes('\0')) {
      return cb(new Error('Invalid filename'), false);
    }
    
    cb(null, true);
  }
});

// Routes with enhanced security
router.post('/upload', 
  protect, 
  fileUploadRateLimit, 
  upload.single('file'), 
  fileValidationMiddleware, 
  uploadDocument
);

router.get('/:jobId', protect, getJobDocuments);

// Add validation middleware for download route
const validateDownloadParams = (req, res, next) => {
  // Validate document ID is numeric
  const docId = req.params.id;
  if (!docId || isNaN(docId)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid document ID' 
    });
  }

  // Validate disposition parameter if provided
  const disposition = req.query.disposition;
  if (disposition && !['attachment', 'inline'].includes(disposition)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid disposition parameter' 
    });
  }

  next();
};

router.get('/download/:id', protect, validateDownloadParams, downloadDocument);
router.delete('/:id', protect, deleteDocument);

module.exports = router;