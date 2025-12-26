const JobFormSection = ({ title, icon: Icon, children, className = "" }) => {
  const cardClasses = className || "bg-white border border-gray-200 rounded-lg p-8 h-full";

  return (
    <div className={cardClasses}>
      <div className="flex items-center gap-2 mb-6">
        {Icon && <Icon className="w-5 h-5 text-blue-600" />}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
};

export default JobFormSection;