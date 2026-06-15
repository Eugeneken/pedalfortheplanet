import axios from 'axios';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const base44 = {
  entities: {
    Registration: {
      create: async (data) => {
        const response = await apiClient.post('/registrations', data);
        return response.data;
      },
      update: async (id, data) => {
        const response = await apiClient.put(`/registrations/${id}`, data);
        return response.data;
      },
      get: async (id) => {
        const response = await apiClient.get(`/registrations/${id}`);
        return response.data;
      },
      list: async (sort = '-created_date', limit = 200) => {
        const response = await apiClient.get('/registrations', {
          params: { sort, limit }
        });
        return Array.isArray(response.data) ? response.data : [];
      },
      filter: async (filters) => {
        const response = await apiClient.get('/registrations', {
          params: filters
        });
        return Array.isArray(response.data) ? response.data : [];
      }
    },
    SosAlert: {
      create: async (data) => {
        const response = await apiClient.post('/sos-alerts', data);
        return response.data;
      },
      update: async (id, data) => {
        const response = await apiClient.put(`/sos-alerts/${id}`, data);
        return response.data;
      },
      get: async (id) => {
        const response = await apiClient.get(`/sos-alerts/${id}`);
        return response.data;
      },
      list: async (sort = '-created_date', limit = 50) => {
        const response = await apiClient.get('/sos-alerts', {
          params: { sort, limit }
        });
        return Array.isArray(response.data) ? response.data : [];
      }
    },
    User: {
      create: async (data) => {
        const response = await apiClient.post('/users/register', data);
        return response.data;
      },
      get: async (id) => {
        const response = await apiClient.get(`/users/${id}`);
        return response.data;
      },
      getCurrent: async () => {
        const response = await apiClient.get('/users/me');
        return response.data;
      }
    }
  },
  auth: {
    me: async () => {
      try {
        const response = await apiClient.get('/users/me');
        return response.data;
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
        }
        throw error;
      }
    },
    redirectToLogin: (returnTo = '/') => {
      localStorage.removeItem('authToken');
      window.location.href = `/?redirect=${encodeURIComponent(returnTo)}`;
    },
    logout: (returnTo = '/') => {
      localStorage.removeItem('authToken');
      if (returnTo) {
        window.location.href = returnTo;
      }
    }
  },
  functions: {
    invoke: async (functionName, data) => {
      if (functionName === 'mpesaPayment') {
        const response = await apiClient.post('/payments/mpesa', data);
        return { data: response.data };
      }
      throw new Error(`Function ${functionName} not implemented`);
    }
  }
};

export default apiClient;
