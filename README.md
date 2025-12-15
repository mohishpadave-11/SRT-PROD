# SRT CRM

A comprehensive CRM system for SRT Shipping Pvt. Ltd.

## Project Structure

```
SRT/
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── assets/            # Static assets (logo, images)
│   │   │   └── srtship-logo.png
│   │   ├── components/        # Reusable UI components
│   │   │   └── LoadingSpinner.jsx
│   │   ├── dashboardcomponents/  # Dashboard-specific components
│   │   │   └── components/
│   │   │       ├── JobMapping.jsx
│   │   │       ├── JobsCreated.jsx
│   │   │       ├── JobsOvertime.jsx
│   │   │       ├── StatsCard.jsx
│   │   │       ├── Top5Parties.jsx
│   │   │       └── WorldJobMap.jsx
│   │   ├── layouts/           # Layout components
│   │   │   └── MainLayout.jsx  # Main layout with sidebar and header
│   │   ├── pages/             # Page components
│   │   │   ├── dashboard/     # Main dashboard page
│   │   │   │   └── DashboardPage.jsx
│   │   │   ├── JobsDashboard/ # Jobs dashboard page
│   │   │   │   └── JobsDashboard.jsx
│   │   │   └── login/         # Login pages
│   │   │       ├── LoginPage.jsx
│   │   │       └── ForgotPasswordPage.jsx
│   │   ├── services/          # API services
│   │   │   └── api.js         # API calls and endpoints
│   │   ├── App.jsx            # Main app component with routing
│   │   ├── App.css            # App styles
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── public/                # Public assets
│   │   └── favicon.svg
│   ├── index.html             # HTML template
│   ├── package.json           # Dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   ├── postcss.config.js      # PostCSS configuration
│   └── eslint.config.js       # ESLint configuration
│
└── backend/                   # Express backend API
    ├── server.js              # Express server
    ├── package.json           # Dependencies
    └── README.md              # Backend documentation
```

## Frontend

### Tech Stack
- React 19
- Vite
- TailwindCSS
- Recharts (for charts)
- react-simple-maps (for world map)
- Lucide React (for icons)

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

### Components Structure

#### Layout Components
- **MainLayout**: Main wrapper with sidebar navigation and header
  - Sticky header with search and user menu
  - Fixed sidebar with navigation icons
  - Footer with copyright information

#### Dashboard Components
- **StatsCard**: Reusable metric card with value and change indicator
- **JobsOvertime**: Bar chart showing jobs created over time
- **JobMapping**: Interactive world map with job distribution
- **JobsCreated**: Donut chart comparing monthly job creation
- **Top5Parties**: List of top performing parties
- **WorldJobMap**: Geographical visualization using react-simple-maps

#### Shared Components
- **LoadingSpinner**: Loading state indicator

### Routing
- `/login` - Login page
- `/forgot-password` - Password recovery
- `/dashboard` - Main analytics dashboard
- `/jobs-dashboard` - Jobs management table

## Backend

Express.js backend with CORS enabled for API communication.

### Available Endpoints
- `GET /api/dashboard` - Fetch dashboard data (year, month parameters)

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

### Authentication Flow
The app uses React Router for navigation with protected routes. Login state is managed through localStorage token storage.

## License

© 2025 SRT Shipping Pvt. Ltd. All rights reserved. 
