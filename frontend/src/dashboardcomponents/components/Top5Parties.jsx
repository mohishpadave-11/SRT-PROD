import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import PropTypes from 'prop-types'

const Top5Parties = ({ data: propData }) => {
  const defaultData = [
    { name: 'DataCircles Tech', jobs: 45 },
    { name: 'Cottson Clothing', jobs: 38 },
    { name: 'Global Shipping Co', jobs: 32 },
    { name: 'Ocean Freight Ltd', jobs: 28 },
    { name: 'Maritime Solutions', jobs: 24 }
  ]
  
  const data = (propData && propData.length > 0) ? propData : defaultData

  const colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe']

  return (
    <div className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          layout="vertical" 
          margin={{ top: 5, right: 10, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis 
            type="number"
            tick={{ fontSize: 9 }}
            stroke="#999"
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            type="category"
            dataKey="name"
            tick={{ fontSize: 9 }}
            stroke="#999"
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '11px'
            }}
          />
          <Bar 
            dataKey="jobs" 
            radius={[0, 3, 3, 0]}
            barSize={16}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

Top5Parties.propTypes = {
  data: PropTypes.array
}

export default Top5Parties
