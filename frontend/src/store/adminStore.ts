import { create } from 'zustand';
import { userAPI } from '../services/api';

interface AdminState {
  users: any[];
  pendingAlumni: any[];
  analytics: {
    totalUsers: number;
    totalAlumni: number;
    totalConnections: number;
    acceptanceRate: number;
  };
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  fetchPendingAlumni: () => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  approveAlumni: (userId: number) => Promise<void>;
  rejectAlumni: (userId: number) => Promise<void>;
  updateUserRole: (userId: number, isAdmin: boolean) => Promise<void>;
  clearError: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  users: [],
  pendingAlumni: [],
  analytics: {
    totalUsers: 0,
    totalAlumni: 0,
    totalConnections: 0,
    acceptanceRate: 0,
  },
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await userAPI.getUsers();
      set({ users: response.data || [] });
    } catch (error: any) {
      set({ error: error.response?.data?.detail || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPendingAlumni: async () => {
    try {
      set({ isLoading: true, error: null });

      // Fetch users who have requested alumni status but haven't been approved
      const response = await userAPI.getUsers();
      const pendingAlumni = response.data?.filter(
        (user: any) => !user.is_alumni && user.profile_completed
      ) || [];

      set({ pendingAlumni });
    } catch (error: any) {
      set({ error: error.response?.data?.detail || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAnalytics: async () => {
    try {
      set({ isLoading: true, error: null });

      // Get all users
      const usersResponse = await userAPI.getUsers();
      const users = usersResponse.data || [];

      // Calculate analytics
      const totalUsers = users.length;
      const totalAlumni = users.filter((u: any) => u.is_alumni).length;

      // Note: Connection counts would need proper API endpoints
      // For now, setting to 0 as a placeholder
      const totalConnections = 0;
      const acceptanceRate = 0;

      set({
        analytics: {
          totalUsers,
          totalAlumni,
          totalConnections,
          acceptanceRate,
        },
      });
    } catch (error: any) {
      set({ error: error.response?.data?.detail || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  approveAlumni: async (userId: number) => {
    try {
      set({ isLoading: true, error: null });

      await userAPI.updateUser(userId, { is_alumni: true });

      // Refresh pending alumni list
      await get().fetchPendingAlumni();
    } catch (error: any) {
      set({ error: error.response?.data?.detail || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  rejectAlumni: async (userId: number) => {
    try {
      set({ isLoading: true, error: null });

      // We don't delete the user, just keep them as a non-alumni
      // This could be enhanced with a "rejected" status if needed

      // Refresh pending alumni list
      await get().fetchPendingAlumni();
    } catch (error: any) {
      set({ error: error.response?.data?.detail || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateUserRole: async (userId: number, isAdmin: boolean) => {
    try {
      set({ isLoading: true, error: null });

      await userAPI.updateUser(userId, { is_superuser: isAdmin });

      // Refresh users list
      await get().fetchUsers();
    } catch (error: any) {
      set({ error: error.response?.data?.detail || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
