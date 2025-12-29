import axiosClient from '../api/axiosClient.js';

export const getCompaniesAPI = async () => {
  try {
    // 🚀 SIMPLIFIED: No query params needed. Just get ALL companies.
    const response = await axiosClient.get('/companies');

    // Response is now standardized, axiosClient returns data directly
    if (Array.isArray(response)) {
      return response;
    }
    return [];
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
};

export const createCompanyAPI = async (companyData) => {
  const response = await axiosClient.post('/companies', companyData);
  return response;
};

// ... update and delete functions remain the same
export const updateCompanyAPI = async (id, data) => {
  const response = await axiosClient.put(`/companies/${id}`, data);
  return response;
};

export const deleteCompanyAPI = async (id) => {
  const response = await axiosClient.delete(`/companies/${id}`);
  return response;
};