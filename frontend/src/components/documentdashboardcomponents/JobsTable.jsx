import { Eye, Edit, Trash2 } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast' // ✅ Import Toast
import useDocumentActions from '../../hooks/useDocumentActions';

const JobsTable = ({ 
  jobs, 
  selectedIds, 
  onSelectAll, 
  onSelectRow, 
  onNavigate,
  onDelete 
}) => {
  // Use document actions hook for delete confirmation
  const { handleDelete } = useDocumentActions();

  const handleRowClick = (jobId) => {
    onNavigate(`/jobs/${jobId}`)
  }

  const handleViewClick = (e, jobId) => {
    e.stopPropagation()
    onNavigate(`/jobs/${jobId}`)
  }

  const handleEditClick = (e, jobId) => {
    e.stopPropagation()
    onNavigate(`/jobs/${jobId}/edit`)
  }

  const handleDeleteClick = (e, job) => {
    e.stopPropagation();
    handleDelete(job.id, `Job ${job.job_number}`, () => {
      onDelete(job.id);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* ✅ Add Toaster to render the popups */}
      <Toaster position="top-right" />

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
                    checked={jobs.length > 0 && selectedIds.length === jobs.length}
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

                  {/* Data Columns */}
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">{job.job_number}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{job.job_date}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{job.exporter_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-[200px]" title={job.exporter_address}>{job.exporter_address}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{job.consignee_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-[200px]" title={job.consignee_address}>{job.consignee_address}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{job.notify_party}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{job.port_of_loading}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{job.port_of_discharge}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{job.final_destination}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{job.invoice_no}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{job.invoice_date}</td>

                  {/* Action Buttons (Inline UI Preserved) */}
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
        <span className="text-sm text-gray-500">Showing {jobs.length} results</span>
        <div className="flex gap-2">
           <button className="px-3 py-1 border rounded text-xs hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
           <button className="px-3 py-1 border rounded text-xs hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
        </div>
      </div>
    </div>
  )
}

export default JobsTable