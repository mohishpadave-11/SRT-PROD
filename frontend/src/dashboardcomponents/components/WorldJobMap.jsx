import { useState, useEffect } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

import PropTypes from 'prop-types'

// Color palette for countries (will be assigned dynamically)
const colorPalette = [
  '#F4A261', // Orange
  '#E76F51', // Red-Orange
  '#9B5DE5', // Purple
  '#2EC4B6', // Teal
  '#5B8CFF', // Blue
  '#60a5fa', // Light Blue
  '#F59E0B', // Amber
  '#10B981', // Green
  '#EC4899', // Pink
  '#8B5CF6', // Violet
  '#14B8A6', // Cyan
  '#F97316'  // Orange-Red
]

// Country names mapping (using numeric ISO codes from world-atlas)
const countryNames = {
  '840': 'United States',
  '076': 'Brazil',
  '156': 'China',
  '360': 'Indonesia',
  '682': 'Saudi Arabia',
  '180': 'DR Congo',
  '356': 'India',
  '276': 'Germany',
  '826': 'United Kingdom',
  '392': 'Japan',
  '036': 'Australia',
  '484': 'Mexico'
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
    
    // Calculate intensity (0.3 to 1.0 based on job count)
    const intensity = 0.3 + (jobs / maxJobs) * 0.7
    
    // Convert hex to RGB
    const r = parseInt(baseColor.slice(1, 3), 16)
    const g = parseInt(baseColor.slice(3, 5), 16)
    const b = parseInt(baseColor.slice(5, 7), 16)
    
    // Apply intensity
    const newR = Math.round(r * intensity + 255 * (1 - intensity))
    const newG = Math.round(g * intensity + 255 * (1 - intensity))
    const newB = Math.round(b * intensity + 255 * (1 - intensity))
    
    return `rgb(${newR}, ${newG}, ${newB})`
  }

  useEffect(() => {
    // Test if we can load the geography data
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
    const countryName = geo.properties.name
    
    if (onCountryClick) {
      onCountryClick({ isoCode, countryName })
    }
    
    console.log(`Clicked: ${countryName} (${isoCode})`)
  }

  const getCountryFill = (geo) => {
    const isoCode = geo.id
    
    if (highlightedCountries[isoCode]) {
      const country = highlightedCountries[isoCode]
      return getColorWithIntensity(country.color, country.jobs)
    }
    
    return '#E9EEF5'
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
        <div className="text-center">
          <p className="text-gray-600 mb-4">Jobs by Country</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(highlightedCountries).map(([code, country]) => (
              <div key={code} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-700">{country.name}</span>
                <span className="font-semibold text-blue-600">{country.jobs}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltipPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    })
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
          style={{
            width: '100%',
            height: '100%',
            maxWidth: 'none',
            maxHeight: 'none'
          }}
          preserveAspectRatio="none"
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
      
      {/* Tooltip on hover - follows cursor */}
      {hoveredCountry && highlightedCountries[hoveredCountry] && (
        <div 
          className="absolute bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200 pointer-events-none z-10"
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y - 40}px`,
            transform: 'translate(0, 0)'
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
