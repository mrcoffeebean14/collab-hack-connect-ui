const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
  PROJECTS: {
    CREATE: `${API_BASE_URL}/projects`,
    ALL: `${API_BASE_URL}/projects`,
    MY_PROJECTS: `${API_BASE_URL}/projects/my-projects`,
    GET: (id: string) => `${API_BASE_URL}/projects/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/projects/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/projects/${id}`,
    COLLABORATE: (id: string) => `${API_BASE_URL}/projects/${id}/collaborate`,
    HANDLE_REQUEST: (requestId: string) => `${API_BASE_URL}/projects/collaboration-requests/${requestId}`,
  },
  HACKATHONS: {
    CREATE: `${API_BASE_URL}/hackathons`,
    ALL: `${API_BASE_URL}/hackathons`,
    FEATURED: `${API_BASE_URL}/hackathons/featured`,
    GET: (id: string) => `${API_BASE_URL}/hackathons/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/hackathons/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/hackathons/${id}`,
    REGISTER: (id: string) => `${API_BASE_URL}/hackathons/${id}/register`,
    MY_HACKATHONS: `${API_BASE_URL}/hackathons/my-hackathons`,
  },
}; 