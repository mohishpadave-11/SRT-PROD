# SRT Backend API

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

### GET /api/dashboard/data

Get dashboard data for a specific year and month.

**Query Parameters:**
- `year` (required): Year (2000-2026)
- `month` (required): Month (1-12)

**Response:**
```json
{
  "success": true,
  "year": 2024,
  "month": 6,
  "data": {
    "totalJobs": 456,
    "totalParties": 249,
    "jobsByCountry": {
      "840": 156,
      "076": 89,
      "156": 234,
      "360": 67,
      "682": 45,
      "180": 23
    }
  }
}
```

## Country Codes

- 840: United States
- 076: Brazil
- 156: China
- 360: Indonesia
- 682: Saudi Arabia
- 180: DR Congo
