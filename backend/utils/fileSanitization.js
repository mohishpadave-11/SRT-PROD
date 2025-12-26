// File Upload Sanitization and Security

const path = require('path');
const crypto = require('crypto');

// Allowed file types with their MIME types and extensions
const ALLOWED_FILE_TYPES = {
  // Documents
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'text/plain': ['.txt'],
  'text/csv': ['.csv'],
  
  // Images
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  
  // Archives (if needed)
  'application/zip': ['.zip'],
  'application/x-rar-compressed': ['.rar']
};

// Dangerous file extensions to always reject
const DANGEROUS_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar',
  '.app', '.deb', '.pkg', '.dmg', '.rpm', '.sh', '.bash', '.ps1', '.msi',
  '.php', '.asp', '.aspx', '.jsp', '.py', '.rb', '.pl', '.cgi'
];

// Maximum file sizes by type (in bytes)
const MAX_FILE_SIZES = {
  'application/pdf': 10 * 1024 * 1024, // 10MB for PDFs
  'image/jpeg': 5 * 1024 * 1024, // 5MB for images
  'image/png': 5 * 1024 * 1024,
  'image/gif': 5 * 1024 * 1024,
  'image/webp': 5 * 1024 * 1024,
  'application/msword': 10 * 1024 * 1024, // 10MB for documents
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 10 * 1024 * 1024,
  'application/vnd.ms-excel': 10 * 1024 * 1024,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 10 * 1024 * 1024,
  'text/plain': 1 * 1024 * 1024, // 1MB for text files
  'text/csv': 5 * 1024 * 1024, // 5MB for CSV
  'application/zip': 50 * 1024 * 1024, // 50MB for archives
  'application/x-rar-compressed': 50 * 1024 * 1024
};

// Sanitize filename - remove dangerous characters and limit length
const sanitizeFilename = (filename) => {
  if (!filename) return 'unnamed_file';
  
  // Remove path separators and dangerous characters
  let sanitized = filename.replace(/[<>:"/\\|?*\x00-\x1f]/g, '');
  
  // Remove leading/trailing dots and spaces
  sanitized = sanitized.replace(/^[.\s]+|[.\s]+$/g, '');
  
  // Limit length to 255 characters (filesystem limit)
  if (sanitized.length > 255) {
    const ext = path.extname(sanitized);
    const name = path.basename(sanitized, ext);
    sanitized = name.substring(0, 255 - ext.length) + ext;
  }
  
  // If filename becomes empty after sanitization, generate a random name
  if (!sanitized || sanitized.length === 0) {
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex');
    sanitized = `file_${timestamp}_${random}`;
  }
  
  return sanitized;
};

// Generate secure random filename while preserving extension
const generateSecureFilename = (originalFilename) => {
  const ext = path.extname(originalFilename).toLowerCase();
  const timestamp = Date.now();
  const random = crypto.randomBytes(16).toString('hex');
  return `${timestamp}_${random}${ext}`;
};

// Validate file type and extension
const validateFileType = (file) => {
  const { mimetype, originalname } = file;
  const ext = path.extname(originalname).toLowerCase();
  
  // Check if extension is dangerous
  if (DANGEROUS_EXTENSIONS.includes(ext)) {
    throw new Error(`File type ${ext} is not allowed for security reasons`);
  }
  
  // Check if MIME type is allowed
  if (!ALLOWED_FILE_TYPES[mimetype]) {
    throw new Error(`File type ${mimetype} is not allowed`);
  }
  
  // Check if extension matches MIME type
  const allowedExtensions = ALLOWED_FILE_TYPES[mimetype];
  if (!allowedExtensions.includes(ext)) {
    throw new Error(`File extension ${ext} does not match MIME type ${mimetype}`);
  }
  
  return true;
};

// Validate file size
const validateFileSize = (file) => {
  const { mimetype, size } = file;
  const maxSize = MAX_FILE_SIZES[mimetype] || 5 * 1024 * 1024; // Default 5MB
  
  if (size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    throw new Error(`File size exceeds maximum allowed size of ${maxSizeMB}MB`);
  }
  
  return true;
};

// Main file validation function
const validateFile = (file) => {
  if (!file) {
    throw new Error('No file provided');
  }
  
  // Validate file type and extension
  validateFileType(file);
  
  // Validate file size
  validateFileSize(file);
  
  // Sanitize filename
  const sanitizedName = sanitizeFilename(file.originalname);
  
  // Generate secure filename for storage
  const secureFilename = generateSecureFilename(file.originalname);
  
  return {
    isValid: true,
    sanitizedName,
    secureFilename,
    mimetype: file.mimetype,
    size: file.size
  };
};

// Sanitize text input to prevent XSS
const sanitizeTextInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove HTML tags and dangerous characters
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

module.exports = {
  validateFile,
  sanitizeFilename,
  generateSecureFilename,
  sanitizeTextInput,
  ALLOWED_FILE_TYPES,
  DANGEROUS_EXTENSIONS,
  MAX_FILE_SIZES
};