const { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { Document, Job } = require('../models');
const r2Client = require('../config/r2');
const { sanitizeTextInput } = require('../utils/fileSanitization');
const { NotFoundError, ValidationError } = require('../utils/customErrors');
const { sendSuccess, sendError } = require('../utils/responseHelper');

// Helper: Clean filename for R2 (e.g. "Commercial Invoice" -> "commercial_invoice")
const sanitizeDocType = (type) => {
  return type.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
};

// @desc    Upload Document (Upsert: Replaces if exists)
// @route   POST /api/documents/upload
exports.uploadDocument = async (req, res, next) => {
  try {
    const { job_id, doc_type } = req.body;
    const file = req.file; // From Multer
    const fileValidation = req.fileValidation; // From validation middleware

    if (!file || !job_id || !doc_type) {
      throw new ValidationError('Missing file, job_id, or doc_type');
    }

    // Sanitize text inputs
    const sanitizedDocType = sanitizeTextInput(doc_type);
    
    // 1. Verify Job Exists
    const job = await Job.findByPk(job_id);
    if (!job) {
      throw new NotFoundError('Job not found');
    }

    // 2. Generate secure filename and R2 key
    const secureFilename = fileValidation.secureFilename;
    const safeType = sanitizeDocType(sanitizedDocType);
    const r2Key = `jobs/${job_id}/${safeType}/${secureFilename}`;

    // 3. Upload to Cloudflare R2 with enhanced security headers
    const uploadParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: r2Key,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        'original-name': fileValidation.sanitizedName,
        'upload-timestamp': Date.now().toString(),
        'job-id': job_id.toString()
      },
      // Security headers
      ServerSideEncryption: 'AES256',
      ContentDisposition: 'attachment' // Force download, don't execute
    };

    await r2Client.send(new PutObjectCommand(uploadParams));

    // 4. Update Database Record (Upsert)
    let doc = await Document.findOne({ where: { job_id, doc_type: sanitizedDocType } });

    if (doc) {
      // UPDATE existing record with new file info
      doc.original_name = fileValidation.sanitizedName;
      doc.r2_key = r2Key;
      doc.mime_type = file.mimetype;
      doc.size = file.size;
      doc.uploaded_by = req.user.id;
      await doc.save();
    } else {
      // CREATE new record
      doc = await Document.create({
        job_id,
        doc_type: sanitizedDocType,
        original_name: fileValidation.sanitizedName,
        r2_key: r2Key,
        mime_type: file.mimetype,
        size: file.size,
        uploaded_by: req.user.id
      });
    }

    return sendSuccess(res, 'Document uploaded successfully', doc);

  } catch (error) {
    next(error);
  }
};

// @desc    Get All Documents for a Job
// @route   GET /api/documents/:jobId
exports.getJobDocuments = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    
    // Validate jobId is numeric
    if (!jobId || isNaN(jobId)) {
      throw new ValidationError('Invalid job ID');
    }
    
    const docs = await Document.findAll({ 
      where: { job_id: jobId },
      order: [['createdAt', 'DESC']]
    });
    
    return sendSuccess(res, 'Documents fetched successfully', docs);
  } catch (error) {
    next(error);
  }
};

// @desc    Generate Secure View/Download Link
// @route   GET /api/documents/download/:id
exports.downloadDocument = async (req, res, next) => {
  try {
    const doc = await Document.findByPk(req.params.id);
    if (!doc) {
      return sendError(res, 'Document not found', 404);
    }

    // Security: Verify user has access to this document's job
    // This prevents users from accessing documents from jobs they don't own
    const job = await Job.findByPk(doc.job_id);
    if (!job) {
      return sendError(res, 'Associated job not found', 404);
    }

    // Validate disposition parameter (whitelist approach for security)
    const dispositionType = req.query.disposition === 'attachment' ? 'attachment' : 'inline';

    // Sanitize filename to prevent header injection attacks
    const sanitizedFilename = doc.original_name
      .replace(/[^\w\s.-]/g, '') // Remove special chars except word chars, spaces, dots, hyphens
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .substring(0, 255); // Limit filename length

    // Construct Content-Disposition header
    // - 'attachment' forces browser to download the file
    // - 'inline' allows browser to display the file (for PDFs, images, etc.)
    const dispositionHeader = dispositionType === 'attachment'
      ? `attachment; filename="${sanitizedFilename}"` 
      : 'inline';

    // Generate presigned URL with proper headers
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: doc.r2_key,
      ResponseContentDisposition: dispositionHeader, 
      ResponseContentType: doc.mime_type || 'application/octet-stream',
      // Add cache control for better performance
      ResponseCacheControl: 'private, max-age=3600'
    });

    // Generate URL valid for 1 hour (3600 seconds)
    const url = await getSignedUrl(r2Client, command, { expiresIn: 3600 });

    // Log successful download request for audit purposes
    console.log(`Document access: User ${req.user.id} requested ${dispositionType} for document ${doc.id} (${doc.original_name})`);

    return sendSuccess(res, 'Download link generated successfully', { downloadUrl: url });

  } catch (error) {
    console.error("Download Error:", error);
    return sendError(res, 'Could not generate document link', 500);
  }
};

// @desc    Delete Document
// @route   DELETE /api/documents/:id
exports.deleteDocument = async (req, res, next) => {
  try {
    const doc = await Document.findByPk(req.params.id);
    if (!doc) {
      return sendError(res, 'Document not found', 404);
    }

    // 1. Delete from R2
    await r2Client.send(new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: doc.r2_key
    }));

    // 2. Delete from DB
    await doc.destroy();

    return sendSuccess(res, 'Document deleted successfully', null);

  } catch (error) {
    console.error("Delete Error:", error);
    return sendError(res, 'Could not delete document', 500);
  }
};