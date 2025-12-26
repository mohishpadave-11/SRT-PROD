import { useState } from 'react'
import { ChevronDown, X, Plus } from 'lucide-react'

const CompanyDropdown = ({
  label,
  value,
  onChange,
  companies = [],
  isEdit = false,
  placeholder = "Select company...",
  onAddNew = null
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCompanyName, setNewCompanyName] = useState('')
  const [newCompanyAddress, setNewCompanyAddress] = useState('')

  const selectedCompany = companies.find(company => company.name === value)

  const handleSelect = (company) => {
    onChange(company.name)
    setIsOpen(false)
  }

  const handleAddNew = () => {
    if (newCompanyName.trim() && newCompanyAddress.trim() && onAddNew) {
      onAddNew(newCompanyName.trim(), newCompanyAddress.trim())
      onChange(newCompanyName.trim())
      setNewCompanyName('')
      setNewCompanyAddress('')
      setShowAddForm(false)
      setIsOpen(false)
    }
  }

  const handleCancel = () => {
    setNewCompanyName('')
    setNewCompanyAddress('')
    setShowAddForm(false)
  }

  return (
    <div className="space-y-2">
      <dt className="font-medium text-slate-700 text-sm">{label}</dt>
      <dd>
        {!isEdit ? (
          <div className="w-full p-3 border rounded-lg bg-gray-50 text-slate-900 min-h-[44px] flex items-center">
            {value || "—"}
          </div>
        ) : (
          <div className="relative">
            {/* Dropdown Button */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-3 text-left text-gray-900 font-medium shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer flex items-center justify-between"
            >
              <span className={value ? 'text-gray-900' : 'text-gray-500'}>
                {value || placeholder}
              </span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsOpen(false)}
                />

                {/* Dropdown Options */}
                <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto top-full mt-1">
                  <div className="py-1">
                    {/* Clear Selection */}
                    <button
                      type="button"
                      onClick={() => {
                        onChange('')
                        setIsOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      {placeholder}
                    </button>

                    {/* Company Options */}
                    {companies.map(company => (
                      <button
                        key={company.id}
                        type="button"
                        onClick={() => handleSelect(company)}
                        className={`w-full text-left px-4 py-2 transition-colors ${value === company.name
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-900 hover:bg-gray-50'
                          }`}
                      >
                        <div>
                          <div className="font-medium">{company.name}</div>
                          <div className="text-sm text-gray-500">{company.address}</div>
                        </div>
                      </button>
                    ))}

                    {/* Add New Option */}
                    {onAddNew && (
                      <button
                        type="button"
                        onClick={() => setShowAddForm(true)}
                        className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 transition-colors border-t border-gray-100 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add New Company
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Add New Company Form */}
            {showAddForm && (
              <>
                {/* Backdrop */}
                <div className="fixed inset-0 z-30 bg-black bg-opacity-50" />

                {/* Modal */}
                <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
                  <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Company</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input
                          type="text"
                          value={newCompanyName}
                          onChange={(e) => setNewCompanyName(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter company name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea
                          value={newCompanyAddress}
                          onChange={(e) => setNewCompanyAddress(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter company address"
                          rows="3"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-6">
                      <button
                        onClick={handleAddNew}
                        disabled={!newCompanyName.trim() || !newCompanyAddress.trim()}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add Company
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </dd>
    </div>
  )
}

export default CompanyDropdown