import toast from 'react-hot-toast';
import { deleteJobAPI } from '../services/jobService';

const useJobActions = () => {
  
  // Delete job confirmation toast with callback
  const handleDeleteJob = (jobId, jobName, onSuccess) => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[250px]">
        <div className="font-medium text-gray-900">
          Delete Job <span className="font-bold text-gray-800">{jobName}</span>?
        </div>
        <p className="text-sm text-gray-500">
          Are you sure? This action cannot be undone.
        </p>
        <div className="flex gap-2 justify-end pt-2">
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deleteJobAPI(jobId);
                toast.success("Job deleted successfully");
                if (onSuccess) onSuccess();
              } catch (err) {
                toast.error("Failed to delete job");
              }
            }}
            className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    ), { 
      duration: 5000, 
      position: 'top-center',
      style: {
        background: '#fff',
        color: '#333',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        borderRadius: '8px',
        padding: '16px',
        border: '1px solid #E5E7EB'
      },
      icon: null
    });
  };

  return {
    handleDeleteJob
  };
};

export default useJobActions;