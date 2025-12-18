// mockJobs.js - Static mock data generation
const generateMockJobs = () => {
  const jobs = [
    {
      id: 1,
      jobNo: '1123',
      date: '22-11-2025',
      exporterName: 'Cottson Clothing',
      exporterAddress: 'Wagle Estate, Thane, Mumbai',
      consigneeName: 'DataCircles',
      consigneeAddress: 'New York, USA',
      notifyParty: 'ABC Corp',
      portOfLoading: 'Mumbai Port',
      portOfDischarge: 'New York Port',
      finalDestination: 'New York',
      invoiceNo: 'INV-2025-001',
      invoiceDate: '20-11-2025'
    },
    {
      id: 2,
      jobNo: '1133',
      date: '22-11-2025',
      exporterName: 'Cottson Clothing',
      exporterAddress: 'Wagle Estate, Thane, Mumbai',
      consigneeName: 'DataCircles',
      consigneeAddress: 'New York, USA',
      notifyParty: 'XYZ Ltd',
      portOfLoading: 'Mumbai Port',
      portOfDischarge: 'Los Angeles Port',
      finalDestination: 'California',
      invoiceNo: 'INV-2025-002',
      invoiceDate: '20-11-2025'
    },
    {
      id: 3,
      jobNo: '1144',
      date: '22-11-2025',
      exporterName: 'Cottson Clothing',
      exporterAddress: 'Wagle Estate, Thane, Mumbai',
      consigneeName: 'DataCircles',
      consigneeAddress: 'New York, USA',
      notifyParty: 'Global Trade',
      portOfLoading: 'Mumbai Port',
      portOfDischarge: 'Singapore Port',
      finalDestination: 'Singapore',
      invoiceNo: 'INV-2025-003',
      invoiceDate: '21-11-2025'
    }
  ]

  // Generate additional fake jobs
  for (let i = 4; i <= 20; i++) {
    jobs.push({
      id: i,
      jobNo: `1${150 + i}`,
      date: '22-11-2025',
      exporterName: 'Cottson Clothing',
      exporterAddress: 'Wagle Estate, Thane, Mumbai',
      consigneeName: 'DataCircles',
      consigneeAddress: 'New York, USA',
      notifyParty: `Party ${i}`,
      portOfLoading: 'Mumbai Port',
      portOfDischarge: 'Various Ports',
      finalDestination: 'Various',
      invoiceNo: `INV-2025-${String(i).padStart(3, '0')}`,
      invoiceDate: '22-11-2025'
    })
  }

  return jobs
}

// Generate the data once and export as constants
export const MOCK_JOBS_DATA = generateMockJobs()

// Export stats constants
export const totalJobs = 5890
export const ongoingJobs = 2900
export const pendingJobs = 2500