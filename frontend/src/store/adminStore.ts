import { create } from 'zustand';
import { userAPI } from '../services/api';
import { User, PaginatedResponse } from '../types';

interface AdminAnalytics {
  totalUsers: number;
  totalAlumni: number;
  visibleProfiles: number;
}

interface AdminState {
  users: User[];
  analytics: AdminAnalytics;
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
  updateUser: (userId: number, data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  users: [],
  analytics: {
    totalUsers: 0,
    totalAlumni: 0,
    visibleProfiles: 0,
  },
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    try {
      set({ isLoading: true, error: null });

      const response: PaginatedResponse<User> = await userAPI.getUsers(0, 200);
      const users = response.data || [];

      set({
        users,
        analytics: {
          totalUsers: response.count ?? users.length,
          totalAlumni: users.filter((u) => u.is_alumni).length,
          visibleProfiles: users.filter((u) => u.profile_visible).length,
        },
      });
    } catch (error: any) {
      set({ error: error.response?.data?.detail || error.message || 'Failed to fetch users' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteUser: async (userId: number) => {
    try {
      set({ isLoading: true, error: null });

      await userAPI.deleteUser(userId);

      // Refresh users list after deletion
      await get().fetchUsers();
    } catch (error: any) {
      set({ error: error.response?.data?.detail || error.message || 'Failed to delete user' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateUser: async (userId: number, data: Partial<User>) => {
    try {
      set({ isLoading: true, error: null });

      await userAPI.updateUser(userId, data);

      // Refresh users list after update
      await get().fetchUsers();
    } catch (error: any) {
      set({ error: error.response?.data?.detail || error.message || 'Failed to update user' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
