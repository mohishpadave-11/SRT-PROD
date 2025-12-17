import PropTypes from "prop-types";

const StatsCard = ({ title, value, change, positive, bgColor }) => {
  // Select icon based on title keywords
  const getIcon = () => {
    const t = title.toLowerCase();

    // TOTAL JOBS
    if (t.includes("job")) {
      return (
        <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.8"
             viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 7h18M3 7l2 12h14l2-12M9 7V5a3 3 0 0 1 6 0v2" />
        </svg>
      );
    }

    // TOTAL PARTIES
    if (t.includes("parties") || t.includes("party")) {
      return (
        <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.8"
             viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
                d="M17 20v-2a4 4 0 00-3-3.87M7 20v-2a4 4 0 013-3.87m3-5a3 3 0 11-6 0 3 3 0 016 0zm8 3a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    }

    // TOTAL INVOICES
    if (t.includes("invoice") && !t.includes("pending")) {
      return (
        <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.8"
             viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12h6M9 16h4m-4-8h8m2 12H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v12a2 2 0 01-2 2z" />
        </svg>
      );
    }

    // TOTAL INVOICES PENDING
    if (t.includes("pending")) {
      return (
        <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.8"
             viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }

    // FALLBACK ICON (Graph)
    return (
      <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.8"
           viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
              d="M4 19V5m0 14l6-6 4 4 6-10" />
      </svg>
    );
  };

  return (
    <div className={`${bgColor} rounded-lg p-6`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div>{getIcon()}</div>
      </div>

      <div className="text-3xl font-bold text-gray-800 mb-2">{value}</div>

      <div className={`text-sm ${positive ? "text-green-600" : "text-red-600"}`}>
        {positive ? "▲ " : "▼ "}
        {change}
      </div>
    </div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  change: PropTypes.string.isRequired,
  positive: PropTypes.bool.isRequired,
  bgColor: PropTypes.string.isRequired,
};

export default StatsCard;