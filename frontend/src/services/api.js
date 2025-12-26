// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export const getDashboardData = async (year, month) => {
  // Direct fetch without mock fallback
  const response = await fetch(`${API_BASE_URL}/dashboard/data?year=${year}&month=${month}`)
  
  if (!response.ok) {
    // This error will now bubble up to the component
    throw new Error(`Failed to fetch dashboard data: ${response.statusText}`)
  }
  
  const data = await response.json()
  return data
}

export const getDocuments = async (filters = {}) => {
  // Construct query parameters
  const queryParams = new URLSearchParams(filters).toString()
  
  const response = await fetch(`${API_BASE_URL}/documents?${queryParams}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch documents: ${response.statusText}`)
  }
  
  const data = await response.json()
  return data
}

export const getDocumentById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/documents/${id}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch document: ${response.statusText}`)
  }
  
  const data = await response.json()
  return data
}