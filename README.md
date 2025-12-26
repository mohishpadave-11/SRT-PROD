# SRT CRM

A comprehensive CRM system for SRT Shipping Pvt. Ltd. with advanced document management and sharing capabilities.

## Project Structure

```
SRT/
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── assets/            # Static assets (logo, images)
│   │   │   └── srtship-logo.png
│   │   ├── components/        # Reusable UI components
│   │   │   ├── dashboard/     # Dashboard-specific components
│   │   │   ├── documentdashboardcomponents/  # Document management components
│   │   │   │   ├── DocumentExplorer.jsx
│   │   │   │   ├── DocumentGrid.jsx
│   │   │   │   ├── DocumentList.jsx
│   │   │   │   ├── DocumentStats.jsx
│   │   │   │   └── DocumentUpload.jsx
│   │   │   ├── form/          # Form components
│   │   │   ├── layout/        # Layout components
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   └── MainLayout.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── dashboardcomponents/  # Legacy dashboard components
│   │   │   └── components/
│   │   │       ├── JobMapping.jsx
│   │   │       ├── JobsCreated.jsx
│   │   │       ├── JobsOvertime.jsx
│   │   │       ├── StatsCard.jsx
│   │   │       ├── Top5Parties.jsx
│   │   │       └── WorldJobMap.jsx
│   │   ├── form/              # Form utilities
│   │   │   └── CompanyDropdown.jsx
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useErrorHandler.js
│   │   │   └── useFolderSystem.js
│   │   ├── lib/               # Utility libraries
│   │   │   └── jobsStorage.js
│   │   ├── pages/             # Page components
│   │   │   ├── admin/         # Admin pages
│   │   │   ├── dashboard/     # Main dashboard page
│   │   │   │   └── DashboardPage.jsx
│   │   │   ├── DocumentDashboard/  # Document management dashboard
│   │   │   │   └── DocumentDashboard.jsx
│   │   │   ├── JobsDashboard/ # Jobs dashboard pages
│   │   │   │   ├── JobsDashboard.jsx
│   │   │   │   └── JobDetailsPage.jsx
│   │   │   ├── login/         # Authentication pages
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   └── ForgotPasswordPage.jsx
│   │   │   └── NewJobPage/    # Job creation page
│   │   ├── services/          # API services
│   │   │   ├── api.js         # Base API configuration
│   │   │   ├── authService.js # Authentication API
│   │   │   ├── companyService.js  # Company management API
│   │   │   ├── documentService.js # Document management API
│   │   │   └── jobService.js  # Job management API
│   │   ├── store/             # State management
│   │   │   └── AuthContext.jsx
│   │   ├── utils/             # Utility functions
│   │   │   ├── dashboardStats.js
│   │   │   └── errorHandler.js
│   │   ├── App.jsx            # Main app component with routing
│   │   ├── App.css            # App styles
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── public/                # Public assets
│   │   └── favicon.svg
│   ├── .env.example           # Environment variables template
│   ├── index.html             # HTML template
│   ├── package.json           # Dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   ├── postcss.config.js      # PostCSS configuration
│   ├── eslint.config.js       # ESLint configuration
│   └── vercel.json            # Vercel deployment configuration
│
├── backend/                   # Express backend API
│   ├── config/                # Configuration files
│   │   ├── database.js        # Database configuration
│   │   └── r2.js              # Cloudflare R2 storage configuration
│   ├── controllers/           # API controllers
│   │   ├── authController.js  # Authentication logic
│   │   ├── companyController.js  # Company management
│   │   ├── documentController.js # Document management & sharing
│   │   └── jobController.js   # Job management
│   ├── middleware/            # Express middleware
│   │   ├── authMiddleware.js  # JWT authentication
│   │   ├── errorHandler.js    # Global error handling
│   │   └── rateLimiting.js    # API rate limiting
│   ├── models/                # Database models (Sequelize)
│   │   ├── Company.js         # Company model
│   │   ├── Document.js        # Document model
│   │   ├── Job.js             # Job model
│   │   ├── User.js            # User model
│   │   └── index.js           # Model associations
│   ├── routes/                # API routes
│   │   ├── authRoutes.js      # Authentication endpoints
│   │   ├── companyRoutes.js   # Company endpoints
│   │   ├── documentRoutes.js  # Document endpoints
│   │   └── jobRoutes.js       # Job endpoints
│   ├── utils/                 # Utility functions
│   │   ├── customErrors.js    # Custom error classes
│   │   └── fileSanitization.js # File security utilities
│   ├── .env                   # Environment variables
│   ├── server.js              # Express server
│   ├── seed.js                # Database seeding
│   ├── package.json           # Dependencies
│   └── README.md              # Backend documentation
│
├── .gitignore                 # Git ignore rules
├── API_DOCUMENTATION.md       # API documentation
├── PDF_DOWNLOAD_LOGIC.md      # Document download implementation
├── SECURITY_IMPLEMENTATION.md # Security features documentation
└── README.md                  # This file
```

## Frontend

### Tech Stack
- React 19
- Vite
- TailwindCSS
- Recharts (for charts)
- react-simple-maps (for world map)
- Lucide React (for icons)
- React Hot Toast (for notifications)
- Axios (for API calls)

### Getting Started

```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

### Features

#### Authentication
- **Login Page**: User authentication interface with email/password
- **Forgot Password**: Password recovery flow
- **JWT Token Management**: Secure authentication with automatic token refresh

#### Main Dashboard
- Stats cards showing key metrics (Total Jobs, Total Parties, Total Invoices, Invoice Pending)
- Jobs created overtime chart with monthly data
- Interactive world map showing job distribution by country
- Jobs created breakdown (Last Month vs This Month)
- Top 5 Parties list

#### Jobs Dashboard
- Comprehensive jobs table with horizontal scroll
- Stats cards (Total Jobs, Ongoing, Pending)
- Filterable and searchable job listings
- Job actions (View, Edit, Delete)
- Pagination controls
- Fixed layout with scrollable table content
- **Job Details Page**: Detailed job information with document management

#### Document Management Dashboard
- **File Explorer Interface**: Mac Finder-style document browser
- **Job-based Organization**: Documents organized by job folders
- **Document Upload**: Multi-file upload with document type categorization
- **Document Actions**: Preview, download, share, and delete documents
- **Advanced Sharing**: 
  - **Share Links**: Generate shareable URLs for WhatsApp, Gmail, and email
  - **Share PDF Files**: Direct PDF sharing with native device sharing API
  - **Cross-platform Support**: Works on mobile, desktop, and web browsers
- **Grid/List View**: Toggle between grid and list view modes
- **Document Stats**: Real-time statistics and folder information

### Document Sharing Features

#### Share Options
1. **Send Link**: Share document URLs via:
   - WhatsApp (opens WhatsApp with pre-filled message)
   - Gmail (opens Gmail compose with document link)
   - Default Email App (opens system email client)

2. **Send a Copy**: Share actual PDF files:
   - Native sharing API for mobile devices
   - Direct file download for desktop browsers
   - Automatic fallback for unsupported platforms

#### Security Features
- **Secure File Storage**: Documents stored in Cloudflare R2 with encryption
- **Presigned URLs**: Time-limited access links (1-hour expiration)
- **File Sanitization**: Automatic filename sanitization and validation
- **Access Control**: User-based document access restrictions

### Components Structure

#### Layout Components
- **DashboardLayout**: Modern dashboard wrapper with sidebar and header
- **MainLayout**: Legacy main wrapper with sidebar navigation and header

#### Document Components
- **DocumentExplorer**: Main document management interface
- **DocumentGrid**: Grid/list view for documents with actions
- **DocumentUpload**: Drag-and-drop file upload component
- **DocumentStats**: Statistics and metrics display

#### Dashboard Components
- **StatsCard**: Reusable metric card with value and change indicator
- **JobsOvertime**: Bar chart showing jobs created over time
- **JobMapping**: Interactive world map with job distribution
- **JobsCreated**: Donut chart comparing monthly job creation
- **Top5Parties**: List of top performing parties
- **WorldJobMap**: Geographical visualization using react-simple-maps

#### Shared Components
- **LoadingSpinner**: Loading state indicator
- **ErrorBoundary**: Error handling wrapper

### Routing
- `/login` - Login page
- `/forgot-password` - Password recovery
- `/dashboard` - Main analytics dashboard
- `/jobs-dashboard` - Jobs management table
- `/jobs/:id` - Job details with document management
- `/documents` - Document management dashboard
- `/admin` - Admin panel (role-based access)

## Backend

### Tech Stack
- Node.js with Express.js
- PostgreSQL with Sequelize ORM
- Cloudflare R2 for file storage
- JWT for authentication
- Multer for file uploads
- AWS SDK for S3-compatible operations

### Database Models
- **User**: Authentication and user management
- **Company**: Company/client information
- **Job**: Shipping job details
- **Document**: File metadata and storage references

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Password recovery

#### Jobs
- `GET /api/jobs` - List all jobs
- `POST /api/jobs` - Create new job
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

#### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/:jobId` - Get job documents
- `GET /api/documents/download/:id` - Download/preview document
- `DELETE /api/documents/:id` - Delete document

#### Companies
- `GET /api/companies` - List companies
- `POST /api/companies` - Create company
- `PUT /api/companies/:id` - Update company
- `DELETE /api/companies/:id` - Delete company

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: API request throttling
- **File Validation**: Comprehensive file type and size validation
- **SQL Injection Protection**: Parameterized queries with Sequelize
- **CORS Configuration**: Cross-origin request handling
- **Helmet Security**: HTTP security headers
- **Input Sanitization**: XSS and injection prevention

## Development

### Running the Application

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Backend:
```bash
cd backend
npm install
npm start
```

### Environment Variables

Frontend (.env):
```
VITE_API_URL=http://localhost:3001
```

Backend (.env):
```
DATABASE_URL=postgresql://username:password@localhost:5432/srt_crm
JWT_SECRET=your_jwt_secret
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=your_bucket_name
```

### Authentication Flow
The app uses React Router for navigation with protected routes. Authentication state is managed through AuthContext with JWT tokens stored in localStorage.

### File Upload Flow
1. Client uploads file via DocumentUpload component
2. Multer middleware processes multipart form data
3. File validation and sanitization
4. Upload to Cloudflare R2 storage
5. Database record creation with metadata
6. Success response with document information

### Document Sharing Flow
1. User clicks share button on document
2. Modal displays sharing options (Link vs Copy)
3. For links: Generate presigned URLs for WhatsApp/Gmail
4. For files: Download blob and use native sharing API
5. Fallback to manual download if sharing unavailable

## Recent Updates

### Document Sharing Enhancement
- Added comprehensive document sharing functionality
- Integrated WhatsApp and Gmail sharing options
- Implemented PDF file sharing with native device APIs
- Added cross-platform compatibility with fallback options
- Enhanced security with time-limited presigned URLs

### UI/UX Improvements
- Modern modal dialogs for sharing options
- Improved document grid with action buttons
- Enhanced loading states and error handling
- Responsive design for mobile and desktop

## License

© 2025 SRT Shipping Pvt. Ltd. All rights reserved.