import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.errMessage || error.message || 'Something went wrong';
    
    if (error.response?.status === 401) {
      Cookies.remove('token');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  logout: () => api.post('/users/logout'),
  getProfile: () => api.get('/users/profile'),
};

// Quiz API calls
export const quizAPI = {
  create: (quizData) => api.post('/quiz', quizData),
  getById: (quizId) => api.get(`/quiz/${quizId}`),
  getUserQuizzes: () => api.get('/quiz'),
  delete: (quizId) => api.delete(`/quiz/${quizId}`),
  getHint: (quizId, questionId) => api.post(`/quiz/${quizId}/hint`, { questionId }),
};

// Submission API calls
export const submissionAPI = {
  submit: (quizId, answers) => api.post(`/submission/${quizId}/submit`, { answers }),
  retry: (quizId, answers) => api.post(`/submission/${quizId}/retry`, { answers }),
  getHistory: (filters = {}) => api.get('/submission/history', { params: filters }),
};

// Leaderboard API calls
export const leaderboardAPI = {
  get: (filters = {}) => api.get('/leaderboard', { params: filters }),
};

export default api;