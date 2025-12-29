import axiosClient from '../api/axiosClient.js';

export const getDashboardData = async (year, month) => {
  try {
    const response = await axiosClient.get(`/dashboard/data?year=${year}&month=${month}`);
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch dashboard data: ${error.message}`);
  }
};

export const getDocuments = async (filters = {}) => {
  try {
    // Construct query parameters
    const queryParams = new URLSearchParams(filters).toString();
    const response = await axiosClient.get(`/documents?${queryParams}`);
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch documents: ${error.message}`);
  }
};

export const getDocumentById = async (id) => {
  try {
    const response = await axiosClient.get(`/documents/${id}`);
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch document: ${error.message}`);
  }
};
