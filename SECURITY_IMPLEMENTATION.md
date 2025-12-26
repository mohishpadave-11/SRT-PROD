# Security Implementation Documentation
## SRT CRM System - Comprehensive Security Guide

### Table of Contents
1. [Overview](#overview)
2. [Rate Limiting](#rate-limiting)
3. [CORS Security](#cors-security)
4. [File Upload Security](#file-upload-security)
5. [Input Sanitization](#input-sanitization)
6. [Authentication Security](#authentication-security)
7. [Security Headers](#security-headers)
8. [Error Handling Security](#error-handling-security)
9. [Configuration](#configuration)
10. [Monitoring & Logging](#monitoring--logging)
11. [Security Checklist](#security-checklist)
12. [Incident Response](#incident-response)

---

## Overview

This document outlines the comprehensive security implementation for the SRT CRM system. The security architecture follows defense-in-depth principles with multiple layers of protection against common web application vulnerabilities.

### Security Principles Applied
- **Defense in Depth**: Multiple security layers
- **Least Privilege**: Minimal access rights
- **Input Validation**: All user inputs validated and sanitized
- **Secure by Default**: Security-first configuration
- **Fail Securely**: Graceful failure handling

---

## Rate Limiting

### Implementation
Rate limiting is implemented using `express-rate-limit` middleware to prevent abuse and brute force attacks.

#### Configuration Files
- `backend/middleware/rateLimiting.js` - Rate limiting configurations
- Applied in `backend/server.js` and route files

#### Rate Limits by Endpoint Type

| Endpoint Type | Limit | Window | Purpose |
|---------------|-------|---------|---------|
| General API | 100 requests | 15 minutes | Prevent API abuse |
| Authentication | 5 attempts | 15 minutes | Prevent brute force |
| Registration | 3 attempts | 1 hour | Prevent spam accounts |
| File Upload | 10 uploads | 1 hour | Prevent storage abuse |
| Password Reset | 3 attempts | 1 hour | Prevent email spam |

#### Implementation Example
```javascript
// General API rate limiting
const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    statusCode: 429
  }
});
```

#### Response Format
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later.",
  "statusCode": 429
}
```

### Monitoring
- Rate limit headers included in responses
- Failed attempts logged for security monitoring
- IP-based tracking for abuse detection

---

## CORS Security

### Implementation
CORS (Cross-Origin Resource Sharing) is configured to restrict access to authorized domains only.

#### Configuration
```javascript
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL] // Production: Only your domain
  : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173']; // Development

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow mobile apps
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

#### Environment Configuration
```bash
# Production
FRONTEND_URL=https://your-production-domain.com

# Development - automatically allows localhost variants
```

### Security Benefits
- Prevents unauthorized cross-origin requests
- Blocks malicious websites from accessing your API
- Allows legitimate mobile app requests
- Environment-specific configuration

---

## File Upload Security

### Implementation
Comprehensive file upload security implemented in multiple layers.

#### Files Involved
- `backend/utils/fileSanitization.js` - Core security utilities
- `backend/routes/documentRoutes.js` - Upload route security
- `backend/controllers/documentController.js` - Upload processing

### Security Layers

#### 1. File Type Validation
```javascript
const ALLOWED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  // ... more types
};

const DANGEROUS_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar',
  '.php', '.asp', '.aspx', '.jsp', '.py', '.rb', '.pl', '.cgi'
];
```

#### 2. File Size Limits
```javascript
const MAX_FILE_SIZES = {
  'application/pdf': 10 * 1024 * 1024, // 10MB for PDFs
  'image/jpeg': 5 * 1024 * 1024, // 5MB for images
  'text/plain': 1 * 1024 * 1024, // 1MB for text files
  // ... per-type limits
};
```

#### 3. Filename Sanitization
```javascript
const sanitizeFilename = (filename) => {
  // Remove dangerous characters: < > : " / \ | ? * and control chars
  let sanitized = filename.replace(/[<>:"/\\|?*\x00-\x1f]/g, '');
  
  // Remove leading/trailing dots and spaces
  sanitized = sanitized.replace(/^[.\s]+|[.\s]+$/g, '');
  
  // Limit to 255 characters (filesystem limit)
  if (sanitized.length > 255) {
    const ext = path.extname(sanitized);
    const name = path.basename(sanitized, ext);
    sanitized = name.substring(0, 255 - ext.length) + ext;
  }
  
  return sanitized;
};
```

#### 4. Secure Storage
```javascript
// Generate cryptographically secure random filename
const generateSecureFilename = (originalFilename) => {
  const ext = path.extname(originalFilename).toLowerCase();
  const timestamp = Date.now();
  const random = crypto.randomBytes(16).toString('hex');
  return `${timestamp}_${random}${ext}`;
};

// R2 upload with security headers
const uploadParams = {
  Bucket: process.env.R2_BUCKET_NAME,
  Key: r2Key,
  Body: file.buffer,
  ContentType: file.mimetype,
  ServerSideEncryption: 'AES256',
  ContentDisposition: 'attachment' // Force download, prevent execution
};
```

### Upload Process Flow
1. **Multer Validation**: Basic file filter and size check
2. **File Type Validation**: MIME type and extension verification
3. **Size Validation**: Per-type size limits
4. **Filename Sanitization**: Remove dangerous characters
5. **Secure Storage**: Generate random filename, encrypt storage
6. **Database Record**: Store metadata with sanitized information

### Blocked File Types
- Executable files: `.exe`, `.bat`, `.cmd`, `.com`, `.pif`, `.scr`
- Script files: `.vbs`, `.js`, `.php`, `.asp`, `.jsp`, `.py`, `.rb`, `.pl`
- System files: `.msi`, `.deb`, `.pkg`, `.dmg`, `.rpm`
- Shell scripts: `.sh`, `.bash`, `.ps1`

---

## Input Sanitization

### Implementation
All user inputs are sanitized to prevent XSS and injection attacks.

#### Text Input Sanitization
```javascript
const sanitizeTextInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};
```

#### Applied To
- Job creation and update forms
- Company information
- Document metadata
- User profile data
- Search queries

#### Example Usage
```javascript
// In job controller
const sanitizedData = {
  job_number: sanitizeTextInput(job_number),
  exporter_name: sanitizeTextInput(exporter_name),
  exporter_address: sanitizeTextInput(exporter_address),
  // ... all text fields
};
```

### Protection Against
- **XSS (Cross-Site Scripting)**: Removes malicious scripts
- **HTML Injection**: Strips HTML tags
- **Event Handler Injection**: Removes onclick, onload, etc.
- **Protocol Injection**: Blocks javascript: URLs

---

## Authentication Security

### JWT Security
- **Secret Key**: Strong, environment-specific JWT secret
- **Expiration**: 24-hour token expiration
- **Secure Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)

#### Token Validation
```javascript
const protect = (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return next(new UnauthorizedError('Not authorized, token failed'));
    }
  }
  
  if (!token) {
    return next(new UnauthorizedError('Not authorized, no token'));
  }
};
```

### Password Security
- **Hashing**: bcryptjs with salt rounds (10)
- **Validation**: Strong password requirements (implement in frontend)
- **Rate Limiting**: Login attempt restrictions

#### Password Hashing
```javascript
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
```

### Session Management
- **Token Expiration**: Automatic logout after 24 hours
- **Refresh Strategy**: Implement token refresh for better UX
- **Logout**: Proper token cleanup

---

## Security Headers

### Helmet Configuration
```javascript
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Disabled for file uploads
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

### Headers Applied
- **Content Security Policy (CSP)**: Prevents XSS attacks
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Restricts browser features

---

## Error Handling Security

### Secure Error Responses
- **Production**: Generic error messages, no stack traces
- **Development**: Detailed errors for debugging
- **Consistent Format**: Standardized error response structure

#### Error Response Format
```json
{
  "success": false,
  "message": "User-friendly error message",
  "statusCode": 400
}
```

#### Custom Error Classes
```javascript
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}
```

### Information Disclosure Prevention
- No database error details in responses
- No file system paths in error messages
- No internal system information exposed
- Sanitized error logging

---

## Configuration

### Environment Variables
```bash
# Security Configuration
NODE_ENV=production
JWT_SECRET=your_super_secure_random_string_here
JWT_EXPIRES_IN=24h
FRONTEND_URL=https://your-production-domain.com

# Database (use connection pooling in production)
DATABASE_URL=postgresql://user:pass@host:port/db

# File Storage
R2_BUCKET_NAME=your-bucket-name
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_ENDPOINT=your-r2-endpoint
```

### Security Best Practices
1. **Environment Separation**: Different configs for dev/staging/prod
2. **Secret Rotation**: Regular JWT secret rotation
3. **Access Keys**: Rotate R2 access keys periodically
4. **Database**: Use read-only users where possible
5. **Monitoring**: Log security events and failed attempts

---

## Monitoring & Logging

### Security Events to Log
- Failed login attempts
- Rate limit violations
- File upload rejections
- Invalid token usage
- CORS violations
- Suspicious file uploads

### Recommended Logging Implementation
```javascript
// Security event logging
const logSecurityEvent = (event, details, req) => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    event: event,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    details: details
  }));
};
```

### Monitoring Tools (Recommended)
- **Application**: Sentry for error tracking
- **Infrastructure**: CloudWatch/DataDog for system metrics
- **Security**: Fail2ban for IP blocking
- **Logs**: ELK stack or similar for log analysis

---

## Security Checklist

### Pre-Production Checklist
- [ ] Rate limiting configured and tested
- [ ] CORS restricted to production domains
- [ ] File upload security validated
- [ ] Input sanitization implemented
- [ ] Security headers configured
- [ ] JWT secrets rotated
- [ ] Database access restricted
- [ ] Error handling secured
- [ ] Logging implemented
- [ ] SSL/TLS certificates configured

### Regular Security Tasks
- [ ] Review and rotate JWT secrets (monthly)
- [ ] Update dependencies (weekly)
- [ ] Review security logs (daily)
- [ ] Test rate limiting (monthly)
- [ ] Validate file upload restrictions (monthly)
- [ ] Check for new vulnerabilities (weekly)

### Security Testing
- [ ] Penetration testing
- [ ] Vulnerability scanning
- [ ] Rate limit testing
- [ ] File upload security testing
- [ ] XSS testing
- [ ] SQL injection testing
- [ ] Authentication bypass testing

---

## Incident Response

### Security Incident Types
1. **Brute Force Attack**: Multiple failed login attempts
2. **File Upload Attack**: Malicious file upload attempts
3. **Rate Limit Abuse**: Excessive API requests
4. **XSS Attempt**: Malicious script injection
5. **Unauthorized Access**: Invalid token usage

### Response Procedures

#### Immediate Response (0-1 hour)
1. **Identify**: Confirm security incident
2. **Contain**: Block malicious IPs if necessary
3. **Assess**: Determine scope and impact
4. **Document**: Log incident details

#### Short-term Response (1-24 hours)
1. **Investigate**: Analyze logs and attack vectors
2. **Patch**: Fix any discovered vulnerabilities
3. **Monitor**: Increase monitoring for similar attacks
4. **Communicate**: Notify stakeholders if needed

#### Long-term Response (1-7 days)
1. **Review**: Conduct post-incident review
2. **Improve**: Update security measures
3. **Test**: Validate security improvements
4. **Document**: Update security procedures

### Emergency Contacts
- **System Administrator**: [Contact Info]
- **Security Team**: [Contact Info]
- **Management**: [Contact Info]
- **Legal/Compliance**: [Contact Info]

---

## Additional Security Recommendations

### Future Enhancements
1. **Two-Factor Authentication (2FA)**: Add TOTP support
2. **API Key Management**: Implement API keys for service accounts
3. **Audit Logging**: Comprehensive audit trail
4. **Data Encryption**: Encrypt sensitive data at rest
5. **Backup Security**: Secure backup procedures
6. **Compliance**: GDPR/SOC2 compliance measures

### Security Tools Integration
1. **SAST**: Static Application Security Testing
2. **DAST**: Dynamic Application Security Testing
3. **Dependency Scanning**: Automated vulnerability scanning
4. **Container Security**: If using Docker/containers
5. **Infrastructure Security**: Cloud security posture management

---

## Conclusion

This security implementation provides comprehensive protection against common web application vulnerabilities. Regular review and updates of these security measures are essential to maintain protection against evolving threats.

For questions or security concerns, contact the development team or security administrator.

**Last Updated**: December 2024  
**Next Review**: March 2025  
**Version**: 1.0