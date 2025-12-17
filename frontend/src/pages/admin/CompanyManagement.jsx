import { useState } from 'react'
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { MOCK_EXPORTERS, MOCK_IMPORTERS, addExporter, addImporter, deleteExporter, deleteImporter } from '../../data/mockCompanies'

const CompanyManagement = () => {
  const [activeTab, setActiveTab] = useState('exporters')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editAddress, setEditAddress] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newAddress, setNewAddress] = useState('')

  const handleEdit = (company) => {
    setEditingId(company.id)
    setEditName(company.name)
    setEditAddress(company.address)
  }

  const handleSaveEdit = () => {
    if (activeTab === 'exporters') {
      const company = MOCK_EXPORTERS.find(e => e.id === editingId)
      if (company) {
        company.name = editName
        company.address = editAddress
      }
    } else {
      const company = MOCK_IMPORTERS.find(i => i.id === editingId)
      if (company) {
        company.name = editName
        company.address = editAddress
      }
    }
    setEditingId(null)
    setEditName('')
    setEditAddress('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditAddress('')
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this company?')) {
      if (activeTab === 'exporters') {
        deleteExporter(id)
      } else {
        deleteImporter(id)
      }
    }
  }

  const handleAdd = () => {
    if (newName.trim() && newAddress.trim()) {
      if (activeTab === 'exporters') {
        addExporter(newName.trim(), newAddress.trim())
      } else {
        addImporter(newName.trim(), newAddress.trim())
      }
      setNewName('')
      setNewAddress('')
      setShowAddForm(false)
    }
  }

  const handleCancelAdd = () => {
    setNewName('')
    setNewAddress('')
    setShowAddForm(false)
  }

  const companies = activeTab === 'exporters' ? MOCK_EXPORTERS : MOCK_IMPORTERS

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Company Management</h1>
          <p className="text-gray-600">Manage exporters and importers for job creation</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-lg shadow-sm border border-gray-200 border-b-0">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('exporters')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'exporters'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Exporters ({MOCK_EXPORTERS.length})
            </button>
            <button
              onClick={() => setActiveTab('importers')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'importers'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Importers ({MOCK_IMPORTERS.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-b-lg shadow-sm border border-gray-200 border-t-0">
          <div className="p-6">
            {/* Add Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {activeTab === 'exporters' ? 'Exporters' : 'Importers'}
              </h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add {activeTab === 'exporters' ? 'Exporter' : 'Importer'}
              </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                <h3 className="text-md font-medium text-gray-900 mb-4">
                  Add New {activeTab === 'exporters' ? 'Exporter' : 'Importer'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    Add Company
                  </button>
                  <button
                    onClick={handleCancelAdd}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Companies List */}
            <div className="space-y-3">
              {companies.map((company) => (
                <div key={company.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  {editingId === company.id ? (
                    // Edit Mode
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          type="text"
                          value={editAddress}
                          onChange={(e) => setEditAddress(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2 flex items-center gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
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
                        <h3 className="font-semibold text-gray-900">{company.name}</h3>
                        <p className="text-gray-600 text-sm">{company.address}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(company)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit company"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(company.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete company"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {companies.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No {activeTab} found. Add one to get started.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CompanyManagement