import axiosClient from '../api/axiosClient.js';
import { handleError } from '../utils/errorHandler';

// 1. Create a Job
export const createJobAPI = async (jobData) => {
  try {
    const response = await axiosClient.post('/api/jobs', jobData);
    return response;
  } catch (error) {
    // Use centralized error handling
    const parsedError = handleError(error, { showToast: false });
    throw parsedError;
  }
};

// 2. Get All Jobs (We will use this later for the Dashboard)
export const getJobsAPI = async () => {
  try {
    const response = await axiosClient.get('/api/jobs');
    return response; 
  } catch (error) {
    const parsedError = handleError(error, { showToast: false });
    throw parsedError;
  }
};

// 2.1. Get Single Job by ID
export const getJobByIdAPI = async (jobId) => {
  try {
    const response = await axiosClient.get(`/api/jobs/${jobId}`);
    return response;
  } catch (error) {
    const parsedError = handleError(error, { showToast: false });
    throw parsedError;
  }
};

// 3. Update a Job
export const updateJobAPI = async (jobId, jobData) => {
  try {
    const response = await axiosClient.put(`/api/jobs/${jobId}`, jobData);
    return response;
  } catch (error) {
    const parsedError = handleError(error, { showToast: false });
    throw parsedError;
  }
};

// 4. Delete a Job
export const deleteJobAPI = async (jobId) => {
  try {
    const response = await axiosClient.delete(`/api/jobs/${jobId}`);
    return response;
  } catch (error) {
    const parsedError = handleError(error, { showToast: false });
    throw parsedError;
  }
};
