const API_BASE_URL = 'http://localhost:3001/api'

export const getDashboardData = async (year, month) => {
  try {
    // Try to fetch from backend first
    const response = await fetch(`${API_BASE_URL}/dashboard/data?year=${year}&month=${month}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data')
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching dashboard data, using mock data:', error)
    
    // Return mock data when backend is not available
    return {
      success: true,
      data: {
        totalJobs: 456,
        totalParties: 249,
        jobsByCountry: {
          'United States': 45,
          'India': 32,
          'China': 28,
          'Germany': 15,
          'Japan': 12
        },
        jobsCreatedData: {
          lastMonth: 100,
          thisMonth: 250,
          chartData: [
            { name: 'Week 1', value: 45 },
            { name: 'Week 2', value: 52 },
            { name: 'Week 3', value: 48 },
            { name: 'Week 4', value: 61 }
          ]
        },
        topParties: [
          { name: 'DataCircles Tech', jobs: 45 },
          { name: 'Global Shipping Co', jobs: 38 },
          { name: 'Ocean Freight Ltd', jobs: 32 },
          { name: 'Maritime Solutions', jobs: 28 },
          { name: 'Cargo Express Inc', jobs: 25 }
        ]
      }
    }
  }
}
