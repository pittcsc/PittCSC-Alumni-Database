import { create } from 'zustand';
import { authAPI } from '../services/api';
import { User, AuthResponse } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (username: string, password: string) => Promise<void>;
  requestOtp: (email: string) => Promise<{ message: string; dev_code?: string | null }>;
  loginWithOtp: (email: string, code: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: localStorage.getItem('access_token'),
  isLoading: false,
  error: null,
  isAuthenticated: false,
  
  login: async (username: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const response: AuthResponse = await authAPI.login(username, password);
      set({ accessToken: response.access_token });
      
      // Fetch user details after login
      await get().fetchCurrentUser();
      
      set({ isAuthenticated: true });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Login failed',
        isAuthenticated: false 
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  requestOtp: async (email: string) => {
    try {
      set({ isLoading: true, error: null });
      return await authAPI.requestOtp(email);
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Could not send login code' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  loginWithOtp: async (email: string, code: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authAPI.verifyOtp(email, code);
      set({ accessToken: response.access_token });
      await get().fetchCurrentUser();
      set({ isAuthenticated: true });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Invalid or expired code',
        isAuthenticated: false,
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email: string, password: string, fullName: string) => {
    try {
      set({ isLoading: true, error: null });
      
      await authAPI.register(email, password, fullName);
      
      // Auto-login after registration
      await get().login(email, password);
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Registration failed' 
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      
      await authAPI.logout();
      
      set({ 
        user: null, 
        accessToken: null,
        isAuthenticated: false 
      });
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Logout failed' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchCurrentUser: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const user = await authAPI.getCurrentUser();
      set({ user, isAuthenticated: true });
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Token invalid or expired
        set({ 
          user: null, 
          accessToken: null,
          isAuthenticated: false 
        });
        localStorage.removeItem('access_token');
      } else {
        set({ error: error.response?.data?.detail || 'Failed to fetch user' });
      }
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateProfile: async (data: Partial<User>) => {
    try {
      set({ isLoading: true, error: null });
      
      const updatedUser = await authAPI.updateProfile(data);
      set({ user: updatedUser });
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Failed to update profile' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  clearError: () => {
    set({ error: null });
  },
  
  checkAuth: async () => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }
    
    try {
      await get().fetchCurrentUser();
    } catch {
      set({ isAuthenticated: false, user: null });
    }
  },
}));