import { Eye, Edit, Trash2 } from 'lucide-react'

const JobsTable = ({ 
  jobs, 
  selectedIds, 
  onSelectAll, 
  onSelectRow, 
  onNavigate 
}) => {
  const handleRowClick = (jobId) => {
    onNavigate(`/jobs/${jobId}`)
  }

  const handleViewClick = (e, jobId) => {
    e.stopPropagation()
    onNavigate(`/jobs/${jobId}`)
  }

  const handleEditClick = (e, jobId) => {
    e.stopPropagation()
    onNavigate(`/jobs/${jobId}`, { state: { edit: true } })
  }

  const handleDeleteClick = (e, job) => {
    e.stopPropagation()
    if (confirm(`Delete job ${job.jobNo}?`)) {
      alert('Deleted (mock)')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="overflow-hidden rounded-t-lg">
        {/* TABLE WRAPPER - Horizontal scrolling for mobile */}
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[1400px]">
            {/* ===== TABLE HEADER ===== */}
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                {/* HEADER CHECKBOX */}
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap sticky left-0 top-0 bg-gray-100 z-20 border-r border-gray-200 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                  <input
                    type="checkbox"
                    onChange={onSelectAll}
                    checked={selectedIds.length === jobs.length}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Job No</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Date</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Exporter Name</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Exporter Address</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Consignee Name</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Consignee Address</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Notify Party</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Port of Loading</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Port of Discharge</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Final Destination</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Invoice No</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Date</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Action</th>
              </tr>
            </thead>

            {/* ===== TABLE BODY ===== */}
            <tbody className="divide-y divide-gray-200 bg-white">
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(job.id)}
                >
                  {/* CHECKBOX (Sticky Left) */}
                  <td className="px-4 py-3 sticky left-0 bg-white z-10 border-r border-gray-100 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(job.id)}
                      onChange={() => onSelectRow(job.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded border-gray-300"
                    />
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-700">{job.jobNo}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{job.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{job.exporterName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-[200px]" title={job.exporterAddress}>{job.exporterAddress}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{job.consigneeName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-[200px]" title={job.consigneeAddress}>{job.consigneeAddress}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{job.notifyParty}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{job.portOfLoading}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{job.portOfDischarge}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{job.finalDestination}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{job.invoiceNo}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{job.invoiceDate}</td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => handleViewClick(e, job.id)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleEditClick(e, job.id)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(e, job)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
        <span className="text-sm text-gray-500">Showing 1 to 20 of 37 results</span>
        <div className="flex gap-2">
           <button className="px-3 py-1 border rounded text-xs hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
           <button className="px-3 py-1 border rounded text-xs hover:bg-gray-50">Next</button>
        </div>
      </div>
    </div>
  )
}

export default JobsTable