const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// Dummy user database
const users = [
  {
    email: 'mohish.client@datacircles.in',
    password: 'mohish123',
    name: 'Mohish Padave',
    role: 'Admin'
  }
]

// Country pool - you can add or remove countries here
const availableCountries = [
  { code: '840', name: 'United States', baseJobs: 100 },
  { code: '076', name: 'Brazil', baseJobs: 60 },
  { code: '156', name: 'China', baseJobs: 150 },
  { code: '360', name: 'Indonesia', baseJobs: 50 },
  { code: '682', name: 'Saudi Arabia', baseJobs: 30 },
  { code: '180', name: 'DR Congo', baseJobs: 20 },
  { code: '356', name: 'India', baseJobs: 120 },
  { code: '276', name: 'Germany', baseJobs: 80 },
  { code: '826', name: 'United Kingdom', baseJobs: 70 },
  { code: '392', name: 'Japan', baseJobs: 90 },
  { code: '036', name: 'Australia', baseJobs: 55 },
  { code: '484', name: 'Mexico', baseJobs: 45 }
]

// Dummy data generator
const generateDummyData = (year, month) => {
  const seed = year * 100 + (month || 0)
  
  // Generate Jobs Created chart data (8 data points)
  const jobsCreatedData = []
  for (let i = 0; i < 8; i++) {
    const lastMonthBase = 80 + Math.sin((seed + i) * 0.5) * 10
    const thisMonthBase = 85 + Math.sin((seed + i) * 0.6) * 15
    jobsCreatedData.push({
      name: '',
      lastMonth: Math.floor(lastMonthBase),
      thisMonth: Math.floor(thisMonthBase)
    })
  }
  
  // Generate Top 5 Parties data
  const parties = ['ABC Logistics', 'XYZ Shipping', 'Global Trade Co', 'Ocean Freight Ltd', 'Express Cargo']
  const topParties = parties.map((name, index) => ({
    name,
    jobs: Math.floor(150 - (index * 15) + (seed % 30))
  }))
  
  // Dynamically select 6-8 countries based on seed (changes with year/month)
  const numCountries = 6 + (seed % 3) // 6, 7, or 8 countries
  const selectedCountries = availableCountries
    .sort(() => Math.sin(seed) - 0.5) // Pseudo-random sort based on seed
    .slice(0, numCountries)
  
  // Generate jobs by country
  const jobsByCountry = {}
  selectedCountries.forEach((country, index) => {
    const variation = Math.floor((seed * (index + 1)) % 80)
    jobsByCountry[country.code] = Math.floor(country.baseJobs + variation)
  })
  
  return {
    totalJobs: 400 + Math.floor((seed % 100) * 2),
    totalParties: 200 + Math.floor((seed % 50) * 1.5),
    jobsByCountry,
    jobsCreatedData: {
      lastMonth: Math.floor(90 + (seed % 20)),
      thisMonth: Math.floor(200 + (seed % 100)),
      chartData: jobsCreatedData
    },
    topParties
  }
}

// Authentication endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'Email and password are required' 
    })
  }

  const user = users.find(u => u.email === email && u.password === password)

  if (user) {
    // Generate a simple token (in production, use JWT)
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')
    
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    })
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    })
  }
})

// Forgot password endpoint
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ 
      success: false,
      message: 'Email is required' 
    })
  }

  const user = users.find(u => u.email === email)

  if (user) {
    // In production, send actual email with reset link
    console.log(`Password reset link would be sent to: ${email}`)
    console.log(`Reset token: ${Buffer.from(`${email}:${Date.now()}`).toString('base64')}`)
    
    res.json({
      success: true,
      message: 'Password reset link sent to your email'
    })
  } else {
    // For security, don't reveal if email exists or not
    res.json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link'
    })
  }
})

// API endpoint to get dashboard data
app.get('/api/dashboard/data', (req, res) => {
  const { year, month } = req.query
  
  if (!year || !month) {
    return res.status(400).json({ error: 'Year and month are required' })
  }
  
  const data = generateDummyData(parseInt(year), parseInt(month))
  
  res.json({
    success: true,
    year: parseInt(year),
    month: parseInt(month),
    data
  })
})

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Server started successfully at ${new Date().toISOString()}`)
})

server.on('error', (error) => {
  console.error('Server error:', error)
  process.exit(1)
})

console.log('Attempting to start server...')
