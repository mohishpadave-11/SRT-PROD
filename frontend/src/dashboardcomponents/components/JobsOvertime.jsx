import { useMemo } from 'react'
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import PropTypes from 'prop-types'

const JobsOvertime = ({ selectedMonth = 'Jan' }) => {
  // Generate data for the selected month only with stable random values
  const data = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthIndex = months.indexOf(selectedMonth)
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][monthIndex]
    const result = []
    
    // Use month and day as seed for consistent random values
    for (let day = 1; day <= daysInMonth; day++) {
      const baseJobs = 80 + Math.sin(day / 5) * 30
      // Use a deterministic "random" value based on month and day
      const seed = (monthIndex * 31 + day) * 0.1
      const pseudoRandom = Math.sin(seed) * 20 + 20
      
      result.push({
        name: day.toString(),
        day: day,
        jobs: Math.round(Math.max(20, baseJobs + pseudoRandom))
      })
    }
    
    return result
  }, [selectedMonth])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart 
        data={data} 
        margin={{ 
          top: 10, 
          right: 10, 
          left: 0, 
          bottom: 20 
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 10 }}
          stroke="#999"
          interval="preserveStartEnd"
          angle={0}
          height={40}
        />
        <YAxis 
          tick={{ fontSize: 10 }}
          stroke="#999"
          width={40}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '12px'
          }}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '10px' }}
          iconType="circle"
          fontSize={12}
        />
        <Bar 
          dataKey="jobs" 
          fill="#93c5fd" 
          name="Jobs"
          radius={[4, 4, 0, 0]}
          barSize={8}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

JobsOvertime.propTypes = {
  selectedMonth: PropTypes.string
}

export default JobsOvertime
