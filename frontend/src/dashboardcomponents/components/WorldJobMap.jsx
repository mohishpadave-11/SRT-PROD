import { useState, useEffect } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import PropTypes from 'prop-types'

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// Color palette for dynamic coloring
const colorPalette = [
  '#F4A261', '#E76F51', '#9B5DE5', '#2EC4B6', '#5B8CFF', '#60a5fa',
  '#F59E0B', '#10B981', '#EC4899', '#8B5CF6', '#14B8A6', '#F97316'
]

// ✅ FIX: Added comprehensive mapping of ISO Numeric Codes to Names
const countryNames = {
  // North America
  '840': 'United States', '124': 'Canada', '484': 'Mexico',
  
  // South America
  '076': 'Brazil', '032': 'Argentina', '152': 'Chile', 
  '170': 'Colombia', '604': 'Peru', '862': 'Venezuela',

  // Europe
  '276': 'Germany', '826': 'United Kingdom', '250': 'France', 
  '380': 'Italy', '724': 'Spain', '528': 'Netherlands', 
  '056': 'Belgium', '756': 'Switzerland', '616': 'Poland', 
  '752': 'Sweden', '578': 'Norway', '208': 'Denmark', 
  '246': 'Finland', '372': 'Ireland', '643': 'Russia', 
  '300': 'Greece', '620': 'Portugal', '792': 'Turkey',

  // Asia
  '156': 'China', '356': 'India', '392': 'Japan', 
  '410': 'South Korea', '360': 'Indonesia', '704': 'Vietnam', 
  '764': 'Thailand', '458': 'Malaysia', '702': 'Singapore', 
  '608': 'Philippines', '158': 'Taiwan', '344': 'Hong Kong',
  '050': 'Bangladesh', '586': 'Pakistan', '144': 'Sri Lanka',

  // Middle East
  '682': 'Saudi Arabia', '784': 'UAE', '376': 'Israel', 
  '818': 'Egypt', '634': 'Qatar', '414': 'Kuwait', '512': 'Oman',

  // Africa
  '710': 'South Africa', '566': 'Nigeria', '404': 'Kenya', 
  '504': 'Morocco', '180': 'DR Congo',

  // Oceania
  '036': 'Australia', '554': 'New Zealand'
}

const WorldJobMap = ({ onCountryClick, jobsByCountry = {} }) => {
  const [hoveredCountry, setHoveredCountry] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Dynamically create highlighted countries from API data
  const highlightedCountries = Object.keys(jobsByCountry).reduce((acc, code, index) => {
    const jobs = jobsByCountry[code] || 0
    acc[code] = {
      color: colorPalette[index % colorPalette.length],
      // Fallback if name is missing in our list
      name: countryNames[code] || 'Unknown Country', 
      jobs
    }
    return acc
  }, {})

  // Find max jobs for color scaling
  const maxJobs = Math.max(...Object.values(highlightedCountries).map(c => c.jobs), 1)

  // Helper function to adjust color intensity based on job count
  const getColorWithIntensity = (baseColor, jobs) => {
    if (jobs === 0) return '#E9EEF5' // Default gray for no jobs
    
    const intensity = 0.3 + (jobs / maxJobs) * 0.7
    
    const r = parseInt(baseColor.slice(1, 3), 16)
    const g = parseInt(baseColor.slice(3, 5), 16)
    const b = parseInt(baseColor.slice(5, 7), 16)
    
    const newR = Math.round(r * intensity + 255 * (1 - intensity))
    const newG = Math.round(g * intensity + 255 * (1 - intensity))
    const newB = Math.round(b * intensity + 255 * (1 - intensity))
    
    return `rgb(${newR}, ${newG}, ${newB})`
  }

  useEffect(() => {
    const loadMapData = async () => {
      try {
        const response = await fetch(geoUrl)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        await response.json()
        setIsLoading(false)
      } catch (err) {
        console.error('Error loading map data:', err)
        setError(err.message)
        setIsLoading(false)
      }
    }

    loadMapData()
  }, [])

  const handleCountryClick = (geo) => {
    const isoCode = geo.id
    const countryName = geo.properties.name // Use map's internal name if available
    
    if (onCountryClick) {
      onCountryClick({ isoCode, countryName })
    }
  }

  const getCountryFill = (geo) => {
    const isoCode = geo.id
    if (highlightedCountries[isoCode]) {
      const country = highlightedCountries[isoCode]
      return getColorWithIntensity(country.color, country.jobs)
    }
    return '#E9EEF5'
  }

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltipPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading map...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <p className="text-red-500">Map failed to load.</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full overflow-hidden" onMouseMove={handleMouseMove}>
      <div className="w-full h-full flex items-center justify-center">
        <ComposableMap
          projection="geoNaturalEarth1"
          projectionConfig={{
            scale: 160,
            center: [20, 0]
          }}
          width={800}
          height={400}
          style={{ width: '100%', height: '100%' }}
        >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const baseFill = getCountryFill(geo)
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={baseFill}
                  stroke="#FFFFFF"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none', cursor: 'pointer', fill: baseFill, opacity: 0.8 },
                    pressed: { outline: 'none' }
                  }}
                  onMouseEnter={() => setHoveredCountry(geo.id)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  onClick={() => handleCountryClick(geo)}
                />
              )
            })
          }
        </Geographies>
        </ComposableMap>
      </div>
      
      {/* Tooltip */}
      {hoveredCountry && highlightedCountries[hoveredCountry] && (
        <div 
          className="absolute bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200 pointer-events-none z-10"
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y - 40}px`,
          }}
        >
          <p className="text-sm font-semibold text-gray-800 whitespace-nowrap">
            {highlightedCountries[hoveredCountry].name}
          </p>
          <p className="text-xs text-gray-600">
            {highlightedCountries[hoveredCountry].jobs} jobs
          </p>
        </div>
      )}
    </div>
  )
}

WorldJobMap.propTypes = {
  onCountryClick: PropTypes.func,
  jobsByCountry: PropTypes.object
}

export default WorldJobMap