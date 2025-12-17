# SRT Shipping Dashboard

A React dashboard application built with Tailwind CSS and Recharts, replicating the SRT Shipping dashboard design.

## Features

- 📊 Interactive charts (Jobs Overtime, Jobs Created, Target vs Reality)
- 🗺️ Job mapping by country visualization
- 📈 Real-time statistics cards
- 🎨 Clean and modern UI with Tailwind CSS
- 📱 Responsive design

## Tech Stack

- React 18
- Tailwind CSS
- Recharts (for data visualization)
- Lucide React (for icons)
- Vite (build tool)

## Installation

```bash
cd dashboard-app
npm install
```

## Running the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx       # Main dashboard layout
│   ├── StatsCard.jsx       # Statistics card component
│   ├── JobsOvertime.jsx    # Jobs overtime chart
│   ├── JobMapping.jsx      # World map visualization
│   ├── JobsCreated.jsx     # Jobs created area chart
│   └── TargetVsReality.jsx # Target vs reality bar chart
├── App.jsx                 # Root component
├── main.jsx               # Entry point
└── index.css              # Global styles with Tailwind
```

## Components

### Dashboard
Main container with sidebar navigation, header, and all dashboard sections.

### StatsCard
Displays key metrics with percentage changes.

### JobsOvertime
Combined bar and line chart showing job creation trends over time.

### JobMapping
SVG-based world map showing job distribution by country.

### JobsCreated
Area chart comparing last month vs this month job creation.

### TargetVsReality
Bar chart comparing target vs actual performance with income metrics.

## Customization

You can customize colors, data, and styling by modifying:
- Tailwind config in `tailwind.config.js`
- Component data in respective component files
- Global styles in `src/index.css`
