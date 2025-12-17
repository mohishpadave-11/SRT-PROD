// Mock data for exporters and importers
export const MOCK_EXPORTERS = [
  { id: 1, name: 'Cottson Clothing', address: 'Wagle Estate, Thane, Mumbai' },
  { id: 2, name: 'Global Textiles Ltd', address: 'Andheri East, Mumbai' },
  { id: 3, name: 'Fashion Forward Inc', address: 'Gurgaon, Haryana' },
  { id: 4, name: 'Textile Masters', address: 'Tirupur, Tamil Nadu' }
]

export const MOCK_IMPORTERS = [
  { id: 1, name: 'DataCircles', address: 'New York, USA' },
  { id: 2, name: 'American Retail Corp', address: 'Los Angeles, USA' },
  { id: 3, name: 'European Fashion Hub', address: 'London, UK' },
  { id: 4, name: 'Asia Pacific Trading', address: 'Singapore' }
]

// Export/Import management functions
export const addExporter = (name, address) => {
  const newExporter = {
    id: Math.max(...MOCK_EXPORTERS.map(e => e.id)) + 1,
    name,
    address
  }
  MOCK_EXPORTERS.push(newExporter)
  return newExporter
}

export const deleteExporter = (id) => {
  const index = MOCK_EXPORTERS.findIndex(e => e.id === id)
  if (index > -1) {
    MOCK_EXPORTERS.splice(index, 1)
    return true
  }
  return false
}

export const addImporter = (name, address) => {
  const newImporter = {
    id: Math.max(...MOCK_IMPORTERS.map(i => i.id)) + 1,
    name,
    address
  }
  MOCK_IMPORTERS.push(newImporter)
  return newImporter
}

export const deleteImporter = (id) => {
  const index = MOCK_IMPORTERS.findIndex(i => i.id === id)
  if (index > -1) {
    MOCK_IMPORTERS.splice(index, 1)
    return true
  }
  return false
}