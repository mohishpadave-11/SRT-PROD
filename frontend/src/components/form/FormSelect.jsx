const FormSelect = ({ 
  label, 
  value, 
  onChange, 
  options, 
  className = "",
  icon
}) => {
  const baseSelectClasses = "w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1";
  const selectClasses = className || baseSelectClasses;

  return (
    <div>
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
      <div className="flex items-center gap-1 mt-1">
        {icon && icon}
        <select
          value={value}
          onChange={onChange}
          className={selectClasses}
        >
          {options.map((option, index) => {
            // Handle both string arrays and object arrays
            const optionValue = typeof option === 'string' ? option : option.value;
            const optionLabel = typeof option === 'string' ? option : option.label;
            
            return (
              <option key={index} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};

export default FormSelect;