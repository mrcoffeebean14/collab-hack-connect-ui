export const API_CONFIG = {
  BASE_URL: 'http://localhost:5001/api',
  TIMEOUT: 10000, // 10 seconds timeout
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  HACKATHONS: '/hackathons',
  PROFILE: '/profile',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  PROJECTS: {
    MY_PROJECTS: '/projects/my-projects',
    COLLABORATED: '/projects/collaborated',
    CREATE: '/projects',
    UPDATE: (id: string) => `/projects/${id}`,
    DELETE: (id: string) => `/projects/${id}`,
  },
  HACKATHONS: {
    ALL: '/hackathons',
    REGISTER: (id: string) => `/hackathons/${id}/register`,
    CREATE: '/hackathons',
    UPDATE: (id: string) => `/hackathons/${id}`,
    DELETE: (id: string) => `/hackathons/${id}`,
  },
  PROFILE: '/profile',
  NOTIFICATIONS: '/notifications',
}; 