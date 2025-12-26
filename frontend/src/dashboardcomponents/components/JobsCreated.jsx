import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import PropTypes from 'prop-types'

const JobsCreated = ({ data: propData, lastMonth = 100, thisMonth = 250 }) => {
  const defaultData = [
    { name: 'Week 1', lastMonth: 85, thisMonth: 75 },
    { name: 'Week 2', lastMonth: 80, thisMonth: 70 },
    { name: 'Week 3', lastMonth: 90, thisMonth: 85 },
    { name: 'Week 4', lastMonth: 85, thisMonth: 80 },
    { name: 'Week 5', lastMonth: 95, thisMonth: 90 },
    { name: 'Week 6', lastMonth: 88, thisMonth: 85 },
    { name: 'Week 7', lastMonth: 92, thisMonth: 95 },
    { name: 'Week 8', lastMonth: 90, thisMonth: 100 },
  ]
  
  const data = (propData && propData.length > 0) ? propData : defaultData

  return (
    <div>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart 
          data={data} 
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorLastMonth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorThisMonth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" hide />
          <YAxis hide domain={[60, 110]} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '11px'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="lastMonth" 
            stroke="#60a5fa" 
            strokeWidth={2}
            fill="url(#colorLastMonth)" 
            dot={{ fill: '#60a5fa', r: 2 }}
          />
          <Area 
            type="monotone" 
            dataKey="thisMonth" 
            stroke="#34d399" 
            strokeWidth={2}
            fill="url(#colorThisMonth)" 
            dot={{ fill: '#34d399', r: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 mt-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-400"></div>
          <span className="text-xs text-gray-600">Last Month</span>
          <span className="text-xs sm:text-sm font-semibold text-gray-800">{lastMonth}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-400"></div>
          <span className="text-xs text-gray-600">This Month</span>
          <span className="text-xs sm:text-sm font-semibold text-gray-800">{thisMonth}</span>
        </div>
      </div>
    </div>
  )
}

JobsCreated.propTypes = {
  data: PropTypes.array,
  lastMonth: PropTypes.number,
  thisMonth: PropTypes.number
}

export default JobsCreated
