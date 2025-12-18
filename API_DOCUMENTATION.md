# SRT Shipping Management System - API Documentation

## Overview
This document outlines all the backend API routes required for the SRT Shipping Management System. The API follows RESTful conventions and uses JSON for data exchange.

**Base URL**: `http://localhost:3001/api`

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 1. Authentication Routes

### POST /auth/login
**Description**: Authenticate user and return JWT token  
**Access**: Public

**Request Body**:
```json
{
  "email": "admin@test.com",
  "password": "password"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@test.com",
    "role": "admin"
  }
}
```

### POST /auth/register
**Description**: Register new user  
**Access**: Public (or Admin only)

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

### POST /auth/forgot-password
**Description**: Send password reset email  
**Access**: Public

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

### POST /auth/reset-password
**Description**: Reset password with token  
**Access**: Public

**Request Body**:
```json
{
  "token": "reset_token",
  "newPassword": "newpassword123"
}
```

### POST /auth/logout
**Description**: Logout user (invalidate token)  
**Access**: Protected

---

## 2. Jobs Management Routes

### GET /jobs
**Description**: Get all jobs with pagination and filtering  
**Access**: Protected

**Query Parameters**:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search in job number, exporter, consignee
- `status` (string): Filter by status (pending, ongoing, completed)
- `dateFrom` (string): Filter from date (YYYY-MM-DD)
- `dateTo` (string): Filter to date (YYYY-MM-DD)
- `sortBy` (string): Sort field (date, jobNo, status)
- `sortOrder` (string): Sort order (asc, desc)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "jobNo": "1123",
      "date": "2025-11-22",
      "exporterName": "Cottson Clothing",
      "exporterAddress": "Wagle Estate, Thane, Mumbai",
      "consigneeName": "DataCircles",
      "consigneeAddress": "New York, USA",
      "notifyParty": "ABC Corp",
      "portOfLoading": "Mumbai Port",
      "portOfDischarge": "New York Port",
      "finalDestination": "New York",
      "invoiceNo": "INV-2025-001",
      "invoiceDate": "2025-11-20",
      "shipmentType": "LCL",
      "mode": "Air",
      "service": "Import",
      "containerNo": "11",
      "sobDate": "2025-11-22",
      "deliveredDate": "2025-11-25",
      "blNo": "1234",
      "shippingBillNo": "SB-2025-001",
      "shippingBillNoDate": "2025-11-21",
      "billOfEntryNo": "BOE-2025-001",
      "billOfEntryDate": "2025-11-22",
      "vesselType": "Vessel",
      "vesselNo": "VES-111",
      "flightNo": "",
      "eta": "10",
      "volume": "100",
      "blDate": "2025-11-25",
      "status": "ongoing",
      "createdAt": "2025-11-22T10:30:00Z",
      "updatedAt": "2025-11-22T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10
  }
}
```

### GET /jobs/:id
**Description**: Get specific job by ID  
**Access**: Protected

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "jobNo": "1123",
    // ... all job fields
  }
}
```

### POST /jobs
**Description**: Create new job  
**Access**: Protected

**Request Body**:
```json
{
  "jobNo": "1125",
  "exporterName": "Cottson Clothing",
  "exporterAddress": "Wagle Estate, Thane, Mumbai",
  "consigneeName": "DataCircles",
  "consigneeAddress": "New York, USA",
  "notifyParty": "ABC Corp",
  "portOfLoading": "Mumbai Port",
  "portOfDischarge": "New York Port",
  "finalDestination": "New York",
  "invoiceNo": "INV-2025-004",
  "invoiceDate": "2025-11-22",
  "shipmentType": "LCL",
  "mode": "Air",
  "service": "Import"
}
```

### PUT /jobs/:id
**Description**: Update existing job  
**Access**: Protected

**Request Body**: Same as POST /jobs

### DELETE /jobs/:id
**Description**: Delete job  
**Access**: Protected (Admin only)

### GET /jobs/stats
**Description**: Get job statistics for dashboard  
**Access**: Protected

**Response**:
```json
{
  "success": true,
  "data": {
    "totalJobs": 5890,
    "ongoingJobs": 2900,
    "pendingJobs": 2500,
    "completedJobs": 490,
    "monthlyGrowth": 12.5,
    "recentJobs": [
      // ... recent jobs array
    ]
  }
}
```

---

## 3. Companies Management Routes

### GET /companies/exporters
**Description**: Get all exporters  
**Access**: Protected

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Cottson Clothing",
      "address": "Wagle Estate, Thane, Mumbai",
      "createdAt": "2025-11-22T10:30:00Z"
    }
  ]
}
```

### GET /companies/importers
**Description**: Get all importers  
**Access**: Protected

### POST /companies/exporters
**Description**: Add new exporter  
**Access**: Protected (Admin only)

**Request Body**:
```json
{
  "name": "New Exporter Ltd",
  "address": "Business District, Mumbai"
}
```

### POST /companies/importers
**Description**: Add new importer  
**Access**: Protected (Admin only)

### PUT /companies/exporters/:id
**Description**: Update exporter  
**Access**: Protected (Admin only)

### PUT /companies/importers/:id
**Description**: Update importer  
**Access**: Protected (Admin only)

### DELETE /companies/exporters/:id
**Description**: Delete exporter  
**Access**: Protected (Admin only)

### DELETE /companies/importers/:id
**Description**: Delete importer  
**Access**: Protected (Admin only)

---

## 4. Documents Management Routes

### GET /documents
**Description**: Get all documents with pagination and filtering  
**Access**: Protected

**Query Parameters**:
- `page` (number): Page number
- `limit` (number): Items per page
- `search` (string): Search in document name, customer name
- `type` (string): Filter by document type
- `jobId` (number): Filter by job ID
- `dateFrom` (string): Filter from date
- `dateTo` (string): Filter to date
- `sortBy` (string): Sort field

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Invoice.pdf",
      "originalName": "invoice_001.pdf",
      "type": "document",
      "size": "102KB",
      "sizeBytes": 104448,
      "mimeType": "application/pdf",
      "jobId": 1,
      "jobNo": "1123",
      "customerName": "Cottson Clothing",
      "uploadedBy": 1,
      "uploadedByName": "Admin User",
      "filePath": "/uploads/documents/1/invoice_001.pdf",
      "url": "http://localhost:3001/uploads/documents/1/invoice_001.pdf",
      "createdAt": "2025-11-22T10:30:00Z",
      "updatedAt": "2025-11-22T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

### GET /documents/:id
**Description**: Get specific document by ID  
**Access**: Protected

### POST /documents/upload
**Description**: Upload new document(s)  
**Access**: Protected

**Request**: Multipart form data
- `files`: File(s) to upload
- `jobId`: Associated job ID
- `type`: Document type (document, image, etc.)
- `description`: Optional description

**Response**:
```json
{
  "success": true,
  "message": "Files uploaded successfully",
  "data": [
    {
      "id": 1,
      "name": "Invoice.pdf",
      "size": "102KB",
      "url": "http://localhost:3001/uploads/documents/1/invoice_001.pdf"
    }
  ]
}
```

### DELETE /documents/:id
**Description**: Delete document  
**Access**: Protected

### GET /documents/:id/download
**Description**: Download document file  
**Access**: Protected

**Response**: File stream with appropriate headers

### GET /jobs/:jobId/documents
**Description**: Get all documents for a specific job  
**Access**: Protected

---

## 5. User Management Routes

### GET /users/profile
**Description**: Get current user profile  
**Access**: Protected

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@test.com",
    "role": "admin",
    "employeeId": "EMP001",
    "department": "Logistics",
    "phone": "+91 9876543210",
    "address": "Mumbai, India",
    "createdAt": "2025-11-22T10:30:00Z"
  }
}
```

### PUT /users/profile
**Description**: Update user profile  
**Access**: Protected

**Request Body**:
```json
{
  "name": "Updated Name",
  "phone": "+91 9876543210",
  "address": "Updated Address"
}
```

### PUT /users/change-password
**Description**: Change user password  
**Access**: Protected

**Request Body**:
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### GET /users (Admin only)
**Description**: Get all users  
**Access**: Protected (Admin only)

### PUT /users/:id (Admin only)
**Description**: Update user by admin  
**Access**: Protected (Admin only)

### DELETE /users/:id (Admin only)
**Description**: Delete user  
**Access**: Protected (Admin only)

---

## 6. Dashboard & Analytics Routes

### GET /dashboard/stats
**Description**: Get dashboard statistics  
**Access**: Protected

**Response**:
```json
{
  "success": true,
  "data": {
    "totalJobs": 5890,
    "ongoingJobs": 2900,
    "pendingJobs": 2500,
    "completedJobs": 490,
    "totalDocuments": 15420,
    "monthlyGrowth": 12.5,
    "recentActivity": [
      {
        "id": 1,
        "type": "job_created",
        "message": "New job #1125 created",
        "timestamp": "2025-11-22T10:30:00Z"
      }
    ]
  }
}
```

### GET /dashboard/recent-jobs
**Description**: Get recent jobs for dashboard  
**Access**: Protected

### GET /dashboard/notifications
**Description**: Get user notifications  
**Access**: Protected

### GET /dashboard/jobs-by-country
**Description**: Get job distribution by country for map visualization  
**Access**: Protected

**Query Parameters**:
- `dateFrom` (string): Filter from date (YYYY-MM-DD)
- `dateTo` (string): Filter to date (YYYY-MM-DD)
- `status` (string): Filter by job status

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "country": "United States",
      "countryCode": "US",
      "coordinates": {
        "lat": 39.8283,
        "lng": -98.5795
      },
      "jobCount": 145,
      "totalVolume": "2500 CBM",
      "ports": [
        {
          "name": "New York Port",
          "jobCount": 89,
          "coordinates": {
            "lat": 40.7128,
            "lng": -74.0060
          }
        },
        {
          "name": "Los Angeles Port",
          "jobCount": 56,
          "coordinates": {
            "lat": 34.0522,
            "lng": -118.2437
          }
        }
      ],
      "recentJobs": [
        {
          "id": 1,
          "jobNo": "1123",
          "exporterName": "Cottson Clothing",
          "consigneeName": "DataCircles",
          "status": "ongoing"
        }
      ]
    },
    {
      "country": "United Kingdom",
      "countryCode": "GB",
      "coordinates": {
        "lat": 55.3781,
        "lng": -3.4360
      },
      "jobCount": 78,
      "totalVolume": "1200 CBM",
      "ports": [
        {
          "name": "London Port",
          "jobCount": 78,
          "coordinates": {
            "lat": 51.5074,
            "lng": -0.1278
          }
        }
      ],
      "recentJobs": []
    }
  ],
  "summary": {
    "totalCountries": 15,
    "totalJobs": 2900,
    "totalVolume": "45000 CBM",
    "topCountries": [
      {
        "country": "United States",
        "jobCount": 145,
        "percentage": 25.2
      },
      {
        "country": "Germany",
        "jobCount": 98,
        "percentage": 17.1
      }
    ]
  }
}
```

### GET /dashboard/jobs-by-port
**Description**: Get job distribution by ports for detailed map view  
**Access**: Protected

**Query Parameters**:
- `country` (string): Filter by specific country
- `dateFrom` (string): Filter from date
- `dateTo` (string): Filter to date

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "portName": "New York Port",
      "country": "United States",
      "coordinates": {
        "lat": 40.7128,
        "lng": -74.0060
      },
      "jobCount": 89,
      "importJobs": 45,
      "exportJobs": 44,
      "totalVolume": "1500 CBM",
      "avgDeliveryTime": "12 days",
      "status": {
        "pending": 12,
        "ongoing": 65,
        "completed": 12
      }
    }
  ]
}
```

### GET /dashboard/shipping-routes
**Description**: Get active shipping routes for route visualization on map  
**Access**: Protected

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "routeName": "Mumbai to New York",
      "origin": {
        "port": "Mumbai Port",
        "country": "India",
        "coordinates": {
          "lat": 19.0760,
          "lng": 72.8777
        }
      },
      "destination": {
        "port": "New York Port",
        "country": "United States",
        "coordinates": {
          "lat": 40.7128,
          "lng": -74.0060
        }
      },
      "activeJobs": 25,
      "avgTransitTime": "18 days",
      "mode": "Sea",
      "frequency": "Weekly",
      "totalVolume": "850 CBM"
    }
  ]
}
```

### GET /dashboard/top-countries
**Description**: Get top 5 countries by job volume for map visualization  
**Access**: Protected

**Query Parameters**:
- `limit` (number): Number of top countries (default: 5)
- `period` (string): Time period (current_month, last_month, 3months, 6months, 1year)
- `metric` (string): Ranking metric (job_count, volume, revenue)

**Response**:
```json
{
  "success": true,
  "data": {
    "topCountries": [
      {
        "rank": 1,
        "country": "United States",
        "countryCode": "US",
        "coordinates": {
          "lat": 39.8283,
          "lng": -98.5795
        },
        "jobCount": 245,
        "totalVolume": "4200 CBM",
        "percentage": 28.5,
        "growth": "+15.2%",
        "mainPorts": [
          {
            "name": "New York Port",
            "jobCount": 145,
            "coordinates": {
              "lat": 40.7128,
              "lng": -74.0060
            }
          },
          {
            "name": "Los Angeles Port", 
            "jobCount": 100,
            "coordinates": {
              "lat": 34.0522,
              "lng": -118.2437
            }
          }
        ],
        "monthlyTrend": [
          { "month": "Oct", "jobs": 220 },
          { "month": "Nov", "jobs": 245 },
          { "month": "Dec", "jobs": 280 }
        ]
      },
      {
        "rank": 2,
        "country": "Germany",
        "countryCode": "DE",
        "coordinates": {
          "lat": 51.1657,
          "lng": 10.4515
        },
        "jobCount": 189,
        "totalVolume": "3100 CBM",
        "percentage": 22.1,
        "growth": "+8.7%",
        "mainPorts": [
          {
            "name": "Hamburg Port",
            "jobCount": 189,
            "coordinates": {
              "lat": 53.5511,
              "lng": 9.9937
            }
          }
        ],
        "monthlyTrend": [
          { "month": "Oct", "jobs": 175 },
          { "month": "Nov", "jobs": 189 },
          { "month": "Dec", "jobs": 195 }
        ]
      },
      {
        "rank": 3,
        "country": "United Kingdom",
        "countryCode": "GB",
        "coordinates": {
          "lat": 55.3781,
          "lng": -3.4360
        },
        "jobCount": 156,
        "totalVolume": "2400 CBM",
        "percentage": 18.2,
        "growth": "+12.4%",
        "mainPorts": [
          {
            "name": "London Port",
            "jobCount": 156,
            "coordinates": {
              "lat": 51.5074,
              "lng": -0.1278
            }
          }
        ],
        "monthlyTrend": [
          { "month": "Oct", "jobs": 139 },
          { "month": "Nov", "jobs": 156 },
          { "month": "Dec", "jobs": 168 }
        ]
      },
      {
        "rank": 4,
        "country": "Singapore",
        "countryCode": "SG",
        "coordinates": {
          "lat": 1.3521,
          "lng": 103.8198
        },
        "jobCount": 134,
        "totalVolume": "2100 CBM",
        "percentage": 15.6,
        "growth": "+5.3%",
        "mainPorts": [
          {
            "name": "Singapore Port",
            "jobCount": 134,
            "coordinates": {
              "lat": 1.3521,
              "lng": 103.8198
            }
          }
        ],
        "monthlyTrend": [
          { "month": "Oct", "jobs": 127 },
          { "month": "Nov", "jobs": 134 },
          { "month": "Dec", "jobs": 140 }
        ]
      },
      {
        "rank": 5,
        "country": "Japan",
        "countryCode": "JP",
        "coordinates": {
          "lat": 36.2048,
          "lng": 138.2529
        },
        "jobCount": 98,
        "totalVolume": "1650 CBM",
        "percentage": 11.4,
        "growth": "-2.1%",
        "mainPorts": [
          {
            "name": "Tokyo Port",
            "jobCount": 98,
            "coordinates": {
              "lat": 35.6762,
              "lng": 139.6503
            }
          }
        ],
        "monthlyTrend": [
          { "month": "Oct", "jobs": 100 },
          { "month": "Nov", "jobs": 98 },
          { "month": "Dec", "jobs": 95 }
        ]
      }
    ],
    "summary": {
      "totalJobsInTop5": 822,
      "totalVolumeInTop5": "13450 CBM",
      "percentageOfTotal": 85.2,
      "averageGrowth": "+7.9%"
    }
  }
}
```

### GET /dashboard/monthly-comparison
**Description**: Get job comparison between current month and last month  
**Access**: Protected

**Query Parameters**:
- `currentMonth` (string): Current month (YYYY-MM, default: current month)
- `compareWith` (string): Comparison period (last_month, same_month_last_year)
- `breakdown` (string): Breakdown type (country, port, status, mode)

**Response**:
```json
{
  "success": true,
  "data": {
    "currentMonth": {
      "period": "2025-11",
      "totalJobs": 285,
      "totalVolume": "4850 CBM",
      "completedJobs": 198,
      "ongoingJobs": 65,
      "pendingJobs": 22,
      "averageDeliveryTime": "14.2 days",
      "topCountries": [
        {
          "country": "United States",
          "jobs": 89,
          "volume": "1520 CBM"
        },
        {
          "country": "Germany", 
          "jobs": 67,
          "volume": "1180 CBM"
        }
      ]
    },
    "lastMonth": {
      "period": "2025-10",
      "totalJobs": 248,
      "totalVolume": "4200 CBM",
      "completedJobs": 165,
      "ongoingJobs": 58,
      "pendingJobs": 25,
      "averageDeliveryTime": "15.1 days",
      "topCountries": [
        {
          "country": "United States",
          "jobs": 78,
          "volume": "1320 CBM"
        },
        {
          "country": "Germany",
          "jobs": 62,
          "volume": "1050 CBM"
        }
      ]
    },
    "comparison": {
      "jobsChange": {
        "absolute": 37,
        "percentage": "+14.9%",
        "trend": "up"
      },
      "volumeChange": {
        "absolute": "650 CBM",
        "percentage": "+15.5%",
        "trend": "up"
      },
      "deliveryTimeChange": {
        "absolute": "-0.9 days",
        "percentage": "-6.0%",
        "trend": "improved"
      },
      "statusComparison": {
        "completed": {
          "current": 198,
          "last": 165,
          "change": "+20.0%"
        },
        "ongoing": {
          "current": 65,
          "last": 58,
          "change": "+12.1%"
        },
        "pending": {
          "current": 22,
          "last": 25,
          "change": "-12.0%"
        }
      },
      "countryComparison": [
        {
          "country": "United States",
          "currentJobs": 89,
          "lastJobs": 78,
          "change": "+14.1%",
          "trend": "up"
        },
        {
          "country": "Germany",
          "currentJobs": 67,
          "lastJobs": 62,
          "change": "+8.1%",
          "trend": "up"
        }
      ]
    },
    "insights": [
      {
        "type": "positive",
        "message": "Job volume increased by 14.9% compared to last month"
      },
      {
        "type": "positive", 
        "message": "Average delivery time improved by 6.0%"
      },
      {
        "type": "info",
        "message": "United States remains the top destination with 31.2% of total jobs"
      }
    ]
  }
}
```

### GET /dashboard/map-analytics
**Description**: Get comprehensive analytics for map dashboard  
**Access**: Protected

**Query Parameters**:
- `period` (string): Time period (7d, 30d, 90d, 1y)
- `view` (string): View type (country, port, route)

**Response**:
```json
{
  "success": true,
  "data": {
    "globalStats": {
      "totalJobs": 2900,
      "activeRoutes": 45,
      "countriesServed": 25,
      "portsActive": 78,
      "totalVolume": "45000 CBM"
    },
    "heatmapData": [
      {
        "lat": 40.7128,
        "lng": -74.0060,
        "intensity": 0.8,
        "jobCount": 89
      }
    ],
    "trends": {
      "growthRate": 12.5,
      "topGrowingCountries": [
        {
          "country": "Germany",
          "growth": 25.3
        }
      ],
      "seasonalPatterns": {
        "Q1": 850,
        "Q2": 920,
        "Q3": 780,
        "Q4": 1100
      }
    }
  }
}
```

---

## 7. System Routes

### GET /health
**Description**: Health check endpoint  
**Access**: Public

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2025-11-22T10:30:00Z",
  "version": "1.0.0"
}
```

### GET /version
**Description**: Get API version  
**Access**: Public

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    // Additional error details if applicable
  }
}
```

### Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

---

## File Upload Specifications

### Supported File Types:
- **Documents**: PDF, DOC, DOCX, XLS, XLSX
- **Images**: JPG, JPEG, PNG, GIF
- **Archives**: ZIP, RAR

### File Size Limits:
- **Single file**: 10MB
- **Total upload**: 50MB

### Upload Directory Structure:
```
uploads/
├── documents/
│   ├── {jobId}/
│   │   ├── invoice_001.pdf
│   │   └── packing_list.pdf
└── temp/
    └── {uploadId}/
```

---

## Database Schema Requirements

### Users Table:
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  employee_id VARCHAR(50),
  department VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Jobs Table:
```sql
CREATE TABLE jobs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  job_no VARCHAR(50) UNIQUE NOT NULL,
  exporter_name VARCHAR(255),
  exporter_address TEXT,
  consignee_name VARCHAR(255),
  consignee_address TEXT,
  notify_party VARCHAR(255),
  port_of_loading VARCHAR(255),
  port_of_discharge VARCHAR(255),
  final_destination VARCHAR(255),
  invoice_no VARCHAR(100),
  invoice_date DATE,
  shipment_type VARCHAR(50),
  mode ENUM('Sea', 'Air'),
  service ENUM('Import', 'Export'),
  container_no VARCHAR(50),
  sob_date DATE,
  delivered_date DATE,
  bl_no VARCHAR(100),
  shipping_bill_no VARCHAR(100),
  shipping_bill_no_date DATE,
  bill_of_entry_no VARCHAR(100),
  bill_of_entry_date DATE,
  vessel_type ENUM('Vessel', 'Flight'),
  vessel_no VARCHAR(100),
  flight_no VARCHAR(100),
  eta VARCHAR(50),
  volume VARCHAR(50),
  bl_date DATE,
  status ENUM('pending', 'ongoing', 'completed') DEFAULT 'pending',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### Companies Tables:
```sql
CREATE TABLE exporters (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE importers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Documents Table:
```sql
CREATE TABLE documents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  type VARCHAR(50),
  size_bytes BIGINT,
  mime_type VARCHAR(100),
  job_id INT,
  file_path VARCHAR(500),
  uploaded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);
```

---

## Implementation Notes

1. **Authentication**: Use JWT tokens with 24-hour expiration
2. **File Storage**: Store files in local filesystem or cloud storage (AWS S3)
3. **Validation**: Implement proper input validation for all endpoints
4. **Logging**: Log all API requests and errors
5. **Rate Limiting**: Implement rate limiting for API endpoints
6. **CORS**: Configure CORS for frontend domain
7. **Environment Variables**: Use environment variables for configuration
8. **Database**: Use connection pooling for database connections
9. **Error Handling**: Implement global error handling middleware
10. **Security**: Sanitize inputs to prevent SQL injection and XSS attacks

---

## Environment Variables Required

```env
# Server Configuration
PORT=3001
NODE_ENV=production

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=srt_shipping
DB_USER=root
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
MAX_TOTAL_SIZE=52428800

# Email Configuration (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

This comprehensive API documentation covers all the endpoints needed for the SRT Shipping Management System based on the frontend implementation.