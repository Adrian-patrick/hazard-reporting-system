import { create } from 'zustand';
import axios, { AxiosError } from 'axios';
import { HazardReport, HazardStatus, HazardType, HazardSeverity } from '../types';

// ✅ Use environment variable for API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/hazards';

interface HazardState {
  hazards: HazardReport[];
  isLoading: boolean;
  error: string | null;
}

const getToken = (): string | null => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user?.token || null;
  } catch (error) {
    console.error("🚨 Error reading token from localStorage:", error);
    return null;
  }
};

const useHazardStore = create<HazardState & {
  fetchHazards: () => Promise<void>;
  addHazard: (hazard: Omit<HazardReport, 'id' | 'reportedAt' | 'updatedAt'>) => Promise<void>;
  updateHazardStatus: (id: string, status: HazardStatus, details?: string) => Promise<void>;
  getHazardById: (id: string) => HazardReport | undefined;
  getHazardsByUser: (userId: string) => HazardReport[];
  getHazardsByStatus: (status: HazardStatus) => HazardReport[];
  getHazardsByType: (type: HazardType) => HazardReport[];
  getHazardsBySeverity: (severity: HazardSeverity) => HazardReport[];
}>((set, get) => ({
  hazards: [],
  isLoading: false,
  error: null,

  // ✅ Fetch Hazards with Axios
  fetchHazards: async () => {
    set({ isLoading: true, error: null });

    try {
      const token = getToken();
      if (!token) throw new Error("🚨 No token found. User might be logged out.");

      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ hazards: response.data, isLoading: false });
    } catch (error: unknown) {
      console.error("❌ Fetch Hazards Error:", error);
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || '⚠️ Failed to fetch hazards'
          : '⚠️ An unknown error occurred';
      set({ error: errorMessage, isLoading: false });
    }
  },

  // ✅ Add Hazard with Axios
  addHazard: async (hazard) => {
    set({ isLoading: true, error: null });

    try {
      const token = getToken();
      if (!token) throw new Error("🚨 No token found. User might be logged out.");

      const response = await axios.post(API_URL, hazard, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set(state => ({ hazards: [...state.hazards, response.data], isLoading: false }));
    } catch (error: unknown) {
      console.error("❌ Add Hazard Error:", error);
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || '⚠️ Failed to add hazard'
          : '⚠️ An unknown error occurred';
      set({ error: errorMessage, isLoading: false });
    }
  },

  // ✅ Update Hazard Status with Axios
  updateHazardStatus: async (id, status, details) => {
    set({ isLoading: true, error: null });

    try {
      const token = getToken();
      if (!token) throw new Error("🚨 No token found. User might be logged out.");

      const response = await axios.patch(`${API_URL}/${id}`, { status, resolutionDetails: details }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set(state => ({
        hazards: state.hazards.map(hazard => (hazard.id === id ? response.data : hazard)),
        isLoading: false,
      }));
    } catch (error: unknown) {
      console.error("❌ Update Hazard Error:", error);
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || '⚠️ Failed to update hazard'
          : '⚠️ An unknown error occurred';
      set({ error: errorMessage, isLoading: false });
    }
  },

  // ✅ Getter Functions
  getHazardById: (id) => get().hazards.find(hazard => hazard.id === id),
  getHazardsByUser: (userId) => get().hazards.filter(hazard => hazard.reportedBy === userId),
  getHazardsByStatus: (status) => get().hazards.filter(hazard => hazard.status === status),
  getHazardsByType: (type) => get().hazards.filter(hazard => hazard.type === type),
  getHazardsBySeverity: (severity) => get().hazards.filter(hazard => hazard.severity === severity),
}));

export default useHazardStore;
