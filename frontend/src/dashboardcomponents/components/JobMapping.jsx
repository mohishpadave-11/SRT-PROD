import PropTypes from 'prop-types'
import WorldJobMap from './WorldJobMap'

const JobMapping = ({ jobsByCountry = {} }) => {
  const handleCountryClick = (country) => {
    console.log('Country clicked:', country)
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <WorldJobMap onCountryClick={handleCountryClick} jobsByCountry={jobsByCountry} />
    </div>
  )
}

JobMapping.propTypes = {
  jobsByCountry: PropTypes.object
}

export default JobMapping
