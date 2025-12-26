import { useState, useEffect, useRef } from 'react';
import { Plus, Search, MapPin, Building2, Check, Loader } from 'lucide-react';
// Make sure this path matches where you created the service!
import { getCompaniesAPI, createCompanyAPI } from '../../services/companyService';

const CompanyDropdown = ({ 
  label, 
  value, 
  onChange, 
  placeholder = "Select company...",
  typeFilter = null 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState([]); 
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newCompany, setNewCompany] = useState({ name: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const dropdownRef = useRef(null);

  // 1. Fetch Companies
  useEffect(() => {
    fetchCompanies();
  }, [typeFilter]); 

  const fetchCompanies = async () => {
    setFetching(true);
    try {
      console.log(`🔹 FRONTEND: Fetching companies for filter: ${typeFilter}`); // <--- BROWSER LOG 1

      const data = await getCompaniesAPI(typeFilter);
      
      console.log("🔹 FRONTEND: Received Data:", data); // <--- BROWSER LOG 2
      
      // Safety check: Ensure data is an array
      if (Array.isArray(data)) {
        setCompanies(data);
      } else {
        console.error("🔹 FRONTEND ERROR: Data is not an array!", data);
        setCompanies([]);
      }

    } catch (err) {
      console.error("🔹 FRONTEND ERROR: Failed to load", err);
      setCompanies([]);
    } finally {
      setFetching(false);
    }
  };

  const handleAddNew = async () => {
    if (!newCompany.name) return;
    setLoading(true);
    try {
      const addedCompany = await createCompanyAPI({
        name: newCompany.name,
        address: newCompany.address,
        type: typeFilter || 'Both' 
      });
      
      setCompanies(prev => [...prev, addedCompany]);
      onChange(addedCompany.name, addedCompany.address); 
      
      setShowAddForm(false);
      setNewCompany({ name: '', address: '' });
      setIsOpen(false); 
      
    } catch (err) {
      alert("Failed to add company. Name might already exist.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {label && <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</label>}
      
      {/* Trigger Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-300 rounded px-3 py-2 bg-white flex items-center justify-between cursor-pointer hover:border-blue-400 focus:ring-2 focus:ring-blue-500 transition-all"
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value || placeholder}
        </span>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 flex flex-col animate-in fade-in zoom-in-95 duration-100">
          
          {/* Search Bar */}
          <div className="p-2 border-b border-gray-100 sticky top-0 bg-white rounded-t-lg">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* List or Add Form */}
          <div className="overflow-y-auto flex-1 p-1">
            {showAddForm ? (
              // --- ADD NEW FORM ---
              <div className="p-3 bg-blue-50 rounded m-1 border border-blue-100">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">Add New Company</h4>
                <input 
                  className="w-full mb-2 p-2 border border-blue-200 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none" 
                  placeholder="Company Name"
                  value={newCompany.name}
                  onChange={e => setNewCompany({...newCompany, name: e.target.value})}
                />
                <textarea 
                  className="w-full mb-2 p-2 border border-blue-200 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none" 
                  placeholder="Address"
                  rows={2}
                  value={newCompany.address}
                  onChange={e => setNewCompany({...newCompany, address: e.target.value})}
                />
                <div className="flex gap-2">
                  <button 
                    onClick={handleAddNew} 
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700 flex justify-center items-center"
                  >
                    {loading ? <Loader className="w-3 h-3 animate-spin" /> : 'Save Company'}
                  </button>
                  <button 
                    onClick={() => setShowAddForm(false)} 
                    className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-200 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* --- ADD NEW BUTTON --- */}
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="w-full text-left flex items-center gap-2 p-2 text-blue-600 hover:bg-blue-50 rounded text-sm font-medium transition-colors mb-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Company</span>
                </button>

                {/* --- LOADING STATE --- */}
                {fetching && (
                   <div className="text-center py-4 text-gray-400 text-xs">Loading list...</div>
                )}

                {/* --- EMPTY STATE --- */}
                {!fetching && filteredCompanies.length === 0 && (
                  <div className="text-center py-4 text-gray-400 text-xs">No companies found</div>
                )}

                {/* --- COMPANY LIST --- */}
                {filteredCompanies.map((company) => (
                  <div
                    key={company.id}
                    onClick={() => {
                      // Safety Check: Ensure onChange exists
                      if (onChange) onChange(company.name, company.address); 
                      setIsOpen(false);
                    }}
                    className="p-2 hover:bg-gray-50 cursor-pointer rounded group border-b border-transparent hover:border-gray-100 last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                        <span className="text-sm text-gray-700 font-medium">{company.name}</span>
                      </div>
                      {value === company.name && <Check className="w-4 h-4 text-green-500" />}
                    </div>
                    {company.address && (
                      <div className="flex items-start gap-2 mt-1 ml-6">
                        <MapPin className="w-3 h-3 text-gray-300 mt-0.5" />
                        <span className="text-xs text-gray-500 line-clamp-1">{company.address}</span>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDropdown;