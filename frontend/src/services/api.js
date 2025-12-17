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

// Generate mock document data
const generateMockDocuments = () => {
  const documents = []
  
  // Generate customer folders (100 items to test pagination)
  for (let i = 1; i <= 100; i++) {
    documents.push({
      id: i,
      customerName: `customer #${i}`,
      jobNo: `JOB${String(i).padStart(3, '0')}`,
      date: '09/28/2021, 10:44 am',
      type: 'folder',
      createdAt: new Date(2021, 8, 28, 10, 44).toISOString(),
      updatedAt: new Date(2021, 8, 28, 10, 44).toISOString()
    })
  }
  
  return documents
}

export const getDocuments = async (filters = {}) => {
  try {
    // For deployment, always use mock data since we don't have a backend deployed
    if (import.meta.env.PROD) {
      throw new Error('Using mock data for production')
    }
    
    // Try to fetch from backend first (only in development)
    const queryParams = new URLSearchParams(filters).toString()
    const response = await fetch(`${API_BASE_URL}/documents?${queryParams}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch documents')
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.log('Using mock document data')
    
    let documents = generateMockDocuments()
    
    // Apply filters to mock data
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      documents = documents.filter(doc => 
        doc.customerName.toLowerCase().includes(searchTerm) ||
        doc.jobNo.toLowerCase().includes(searchTerm)
      )
    }
    
    if (filters.type) {
      documents = documents.filter(doc => doc.type === filters.type)
    }
    
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom)
      documents = documents.filter(doc => new Date(doc.createdAt) >= fromDate)
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo)
      documents = documents.filter(doc => new Date(doc.createdAt) <= toDate)
    }
    
    // Sort by date (newest first)
    if (filters.sortBy === 'newest') {
      documents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (filters.sortBy === 'oldest') {
      documents.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    }
    
    return {
      success: true,
      data: documents,
      total: documents.length
    }
  }
}

export const getDocumentById = async (id) => {
  try {
    // For deployment, always use mock data since we don't have a backend deployed
    if (import.meta.env.PROD) {
      throw new Error('Using mock data for production')
    }
    
    // Try to fetch from backend first (only in development)
    const response = await fetch(`${API_BASE_URL}/documents/${id}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch document')
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.log(`Using mock data for document ${id}`)
    
    const documents = generateMockDocuments()
    const document = documents.find(doc => doc.id === parseInt(id))
    
    if (!document) {
      return {
        success: false,
        error: 'Document not found'
      }
    }
    
    return {
      success: true,
      data: document
    }
  }
}
