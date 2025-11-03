import { create } from 'zustand';
import { authAPI } from '../services/api';

interface ProfileState {
  currentStep: number;
  isLoading: boolean;
  error: string | null;
  updateProfile: (userId: number, data: any) => Promise<void>;
  setCurrentStep: (step: number) => void;
  clearError: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  currentStep: 1,
  isLoading: false,
  error: null,

  updateProfile: async (userId: number, data: any) => {
    try {
      set({ isLoading: true, error: null });

      await authAPI.updateProfile(data);
    } catch (error: any) {
      set({ error: error.response?.data?.detail || error.message || 'Failed to update profile' });
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentStep: (step: number) => set({ currentStep: step }),

  clearError: () => set({ error: null }),
}));
