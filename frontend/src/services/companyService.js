import axios from 'axios';

// Ensure this matches your backend port
const API_URL = 'http://localhost:3001/api/companies';

const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getCompaniesAPI = async () => {
  try {
    // 🚀 SIMPLIFIED: No query params needed. Just get ALL companies.
    const response = await axios.get(API_URL, getAuthConfig());

    // Robust check for different backend response structures
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
};

export const createCompanyAPI = async (companyData) => {
  const response = await axios.post(API_URL, companyData, getAuthConfig());
  return response.data.data || response.data;
};

// ... update and delete functions remain the same
export const updateCompanyAPI = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, getAuthConfig());
  return response.data.data || response.data;
};

export const deleteCompanyAPI = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
  return response.data;
};