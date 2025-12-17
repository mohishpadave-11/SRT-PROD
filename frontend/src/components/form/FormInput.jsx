// components/form/FormInput.jsx
const FormInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = "text", 
  className = "",
  rows = 2
}) => {
  // Define the standard look for all inputs
  const baseClasses = "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 text-sm";
  
  // Combine base classes with any custom classes passed in
  // Using template literal allows you to add specific width/margin overrides without losing the base style
  const computedClasses = `${baseClasses} ${className}`;

  return (
    <div>
      {label && (
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </span>
      )}
      
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={onChange}
          className={computedClasses}
          placeholder={placeholder}
          rows={rows}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={computedClasses}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default FormInput;