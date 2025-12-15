// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Generate dynamic mock data based on year and month
const generateMockData = (year, month) => {
  // Use year and month as seed for consistent but different data
  const seed = (year * 12 + month) * 0.1
  const random = (index) => Math.sin(seed + index) * 0.5 + 0.5 // Returns 0-1
  
  // Generate jobs by country with variation
  const baseCountries = {
    '840': 125, // United States
    '156': 89,  // China
    '276': 67,  // Germany
    '826': 54,  // United Kingdom
    '392': 43,  // Japan
    '356': 78,  // India
    '036': 32,  // Australia
    '076': 28,  // Brazil
    '484': 21,  // Mexico
    '682': 19   // Saudi Arabia
  }
  
  const jobsByCountry = {}
  Object.entries(baseCountries).forEach(([code, baseJobs], index) => {
    const variation = random(index) * 50 - 25 // ±25 jobs variation
    jobsByCountry[code] = Math.max(5, Math.round(baseJobs + variation))
  })
  
  // Generate chart data with variation
  const chartData = []
  for (let i = 0; i < 8; i++) {
    const lastMonthBase = 85
    const thisMonthBase = 80
    const lastMonthVariation = random(i * 2) * 20 - 10
    const thisMonthVariation = random(i * 2 + 1) * 20 - 10
    
    chartData.push({
      name: `Week ${i + 1}`,
      lastMonth: Math.round(lastMonthBase + lastMonthVariation),
      thisMonth: Math.round(thisMonthBase + thisMonthVariation)
    })
  }
  
  // Generate top parties with variation
  const baseParties = [
    { name: 'DataCircles Tech', baseJobs: 45 },
    { name: 'Cottson Clothing', baseJobs: 38 },
    { name: 'Global Shipping Co', baseJobs: 32 },
    { name: 'Ocean Freight Ltd', baseJobs: 28 },
    { name: 'Maritime Solutions', baseJobs: 24 }
  ]
  
  const topParties = baseParties.map((party, index) => {
    const variation = random(index + 10) * 20 - 10
    const jobs = Math.max(5, Math.round(party.baseJobs + variation))
    return {
      name: party.name,
      jobs,
      percentage: Math.round((jobs / 200) * 100 * 10) / 10
    }
  })
  
  // Calculate totals with variation
  const totalJobsVariation = random(20) * 100 - 50
  const totalPartiesVariation = random(21) * 50 - 25
  
  return {
    totalJobs: Math.round(456 + totalJobsVariation),
    totalParties: Math.round(249 + totalPartiesVariation),
    jobsByCountry,
    jobsCreatedData: {
      lastMonth: Math.round(100 + random(22) * 40 - 20),
      thisMonth: Math.round(250 + random(23) * 60 - 30),
      chartData
    },
    topParties
  }
}

export const getDashboardData = async (year, month) => {
  try {
    // For deployment, always use mock data since we don't have a backend deployed
    if (import.meta.env.PROD) {
      throw new Error('Using mock data for production')
    }
    
    // Try to fetch from backend first (only in development)
    const response = await fetch(`${API_BASE_URL}/dashboard/data?year=${year}&month=${month}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data')
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.log(`Using mock dashboard data for ${year}-${month}`)
    
    // Return dynamic mock data based on year and month
    return {
      success: true,
      data: generateMockData(year, month)
    }
  }
}
