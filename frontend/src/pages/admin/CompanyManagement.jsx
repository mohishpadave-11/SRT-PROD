import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
// Import Real API
import { getCompaniesAPI, createCompanyAPI, updateCompanyAPI, deleteCompanyAPI } from '../../services/companyService'
import Spinner from '../components/Spinner';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(false)

  // Edit State
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editAddress, setEditAddress] = useState('')

  // Add State
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newAddress, setNewAddress] = useState('')

  // 1. Fetch All Companies
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getCompaniesAPI(); // No type filter - get all companies
      setCompanies(data);
    } catch (err) {
      console.error("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  // 2. Add Company
  const handleAdd = async () => {
    if (newName.trim() && newAddress.trim()) {
      try {
        await createCompanyAPI({
          name: newName,
          address: newAddress,
          type: 'Both' // Default to Both since we have one list
        });

        // Refresh list
        fetchData();

        // Reset Form
        setNewName('')
        setNewAddress('')
        setShowAddForm(false)
      } catch (err) {
        alert("Failed to add company. Name might exist.");
      }
    }
  }

  // 3. Delete Company
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this company?')) {
      try {
        await deleteCompanyAPI(id);
        setCompanies(companies.filter(c => c.id !== id));
      } catch (err) {
        alert("Failed to delete company.");
      }
    }
  }

  // 4. Update Company
  const handleEdit = (company) => {
    setEditingId(company.id)
    setEditName(company.name)
    setEditAddress(company.address)
  }

  const handleSaveEdit = async () => {
    try {
      const updated = await updateCompanyAPI(editingId, {
        name: editName,
        address: editAddress
      });

      // Update local list
      setCompanies(companies.map(c => c.id === editingId ? updated : c));

      setEditingId(null)
    } catch (err) {
      alert("Failed to update company.");
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditAddress('')
  }

  const handleCancelAdd = () => {
    setNewName('')
    setNewAddress('')
    setShowAddForm(false)
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Company Management</h1>
          <p className="text-gray-600">Manage exporters and importers for job creation</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            {/* Add Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Companies List
              </h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Company
              </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100 animate-in fade-in slide-in-from-top-2">
                <h3 className="text-md font-medium text-blue-900 mb-4">
                  Add New Company
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter company address"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={handleAdd}
                    disabled={!newName.trim() || !newAddress.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Company
                  </button>
                  <button
                    onClick={handleCancelAdd}
                    className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center py-12">
                <Spinner size="md" />
              </div>
            )}

            {/* Companies List */}
            {!loading && (
              <div className="space-y-3">
                {companies.map((company) => (
                  <div key={company.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors group">
                    {editingId === company.id ? (
                      // Edit Mode
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                          <input
                            type="text"
                            value={editAddress}
                            onChange={(e) => setEditAddress(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="md:col-span-2 flex items-center gap-2 mt-2">
                          <button
                            onClick={handleSaveEdit}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                          >
                            <Check className="w-4 h-4" />
                            Save Changes
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            {company.name}
                            {company.type === 'Both' && (
                              <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full uppercase">Both</span>
                            )}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">{company.address}</p>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(company)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(company.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {companies.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">No companies found.</p>
                    <button onClick={() => setShowAddForm(true)} className="text-blue-600 font-medium mt-2 hover:underline">
                      Add the first one
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CompanyManagement
