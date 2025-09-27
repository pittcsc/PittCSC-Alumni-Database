import axios, { AxiosInstance, AxiosError } from 'axios';
import { UserUpdate, Interview, Employment, ConnectionRequest } from '../types';

// API base URL - should match your FastAPI backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for auth
});

// Token management
let accessToken: string | null = localStorage.getItem('access_token');

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('access_token');
      accessToken = null;
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth methods
export const authAPI = {
  async login(username: string, password: string) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await api.post('/login/access-token', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    
    accessToken = response.data.access_token;
    localStorage.setItem('access_token', accessToken);
    return response.data;
  },

  async register(email: string, password: string, fullName: string) {
    const response = await api.post('/users/signup', {
      email,
      password,
      full_name: fullName,
    });
    return response.data;
  },

  async logout() {
    localStorage.removeItem('access_token');
    accessToken = null;
  },

  async getCurrentUser() {
    const response = await api.get('/users/me');
    return response.data;
  },

  async updateProfile(data: UserUpdate) {
    const response = await api.patch('/users/me', data);
    return response.data;
  },

  async resetPassword(email: string) {
    const response = await api.post('/login/reset-password', { email });
    return response.data;
  },
};

// User/Alumni methods
export const userAPI = {
  async getUsers(skip = 0, limit = 20) {
    const response = await api.get('/users/', { params: { skip, limit } });
    return response.data;
  },

  async getUserById(userId: number) {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  async getUsersByCompany(companyName: string) {
    const response = await api.get(`/users/company/${companyName}`);
    return response.data;
  },

  async updateUser(userId: number, data: UserUpdate) {
    const response = await api.patch(`/users/${userId}`, data);
    return response.data;
  },

  async deleteUser(userId: number) {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
};

// Connection request methods
export const connectionAPI = {
  async createConnectionRequest(requesterId: number, requestedId: number, message: string) {
    const response = await api.post('/connections/', {
      requester_id: requesterId,
      requested_id: requestedId,
      message
    });
    return response.data;
  },

  async getAcceptedRequests(userId: number) {
    const response = await api.get(`/connections/${userId}/accepted_requests`);
    return response.data;
  },

  async getRequestsMade(userId: number) {
    const response = await api.get(`/connections/${userId}/accepted_requested`);
    return response.data;
  },

  async acceptConnectionRequest(requestId: number) {
    const response = await api.post(`/connections/accept/${requestId}`);
    return response.data;
  },

  async declineConnectionRequest(requestId: number) {
    const response = await api.post(`/connections/ignore/${requestId}`);
    return response.data;
  },

  async deleteConnectionRequest(connectionId: number) {
    const response = await api.delete(`/connections/${connectionId}`);
    return response.data;
  }
};

// Company methods
export const companyAPI = {
  async getCompanies() {
    const response = await api.get('/companies/');
    return response.data;
  },

  async getCompany(name: string) {
    const response = await api.get(`/companies/${name}`);
    return response.data;
  },

  async getEmployeeCounts() {
    const response = await api.get('/companies/employee_counts');
    return response.data;
  },

  async getCurrentEmployees(companyName: string) {
    const response = await api.get(`/companies/current_employees/${companyName}`);
    return response.data;
  },

  async getAllEmployees(companyName: string) {
    const response = await api.get(`/companies/all_employees/${companyName}`);
    return response.data;
  },

  async createCompany(name: string, imageUrl?: string) {
    const response = await api.post('/companies/', { name, image_url: imageUrl });
    return response.data;
  },
};

// Interview methods
export const interviewAPI = {
  async getInterviews() {
    const response = await api.get('/interviews/');
    return response.data;
  },

  async createInterview(data: Omit<Interview, 'id'>) {
    const response = await api.post('/interviews/', data);
    return response.data;
  },

  async createBulkInterviews(data: Omit<Interview, 'id'>[]) {
    const response = await api.post('/interviews/bulk', data);
    return response.data;
  },
};

// Employment methods
export const employmentAPI = {
  async getEmployment() {
    const response = await api.get('/employment/');
    return response.data;
  },

  async getEmploymentByCompany(companyName: string) {
    const response = await api.get(`/employment/company/${companyName}`);
    return response.data;
  },

  async createEmployment(data: Omit<Employment, 'id'>) {
    const response = await api.post('/employment/', data);
    return response.data;
  },
};

// Connection Request methods
export const requestAPI = {
  async getRequests() {
    const response = await api.get('/requests/');
    return response.data;
  },

  async getRequest(requestId: number) {
    const response = await api.get(`/requests/${requestId}`);
    return response.data;
  },

  async createRequest(data: Omit<ConnectionRequest, 'id' | 'created_at' | 'updated_at'>) {
    const response = await api.post('/requests/', data);
    return response.data;
  },

  async updateRequest(requestId: number, data: Partial<ConnectionRequest>) {
    const response = await api.patch(`/requests/${requestId}`, data);
    return response.data;
  },
};

// Email methods
export const emailAPI = {
  async getEmails() {
    const response = await api.get('/emails/');
    return response.data;
  },

  async addEmail(email: string) {
    const response = await api.post('/emails/', { email });
    return response.data;
  },

  async removeEmail(email: string) {
    const response = await api.delete(`/emails/${email}`);
    return response.data;
  },
};

export default api;