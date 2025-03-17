import { create } from 'zustand';
import { HazardReport, HazardStatus, HazardType, HazardSeverity } from '../types';

interface HazardState {
  hazards: HazardReport[];
  isLoading: boolean;
  error: string | null;
}

// Mock data for hazard reports
const mockHazards: HazardReport[] = [
  {
    id: '1',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing traffic hazard',
    type: 'road-damage',
    severity: 'medium',
    status: 'reported',
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: '123 Main St, New York, NY'
    },
    reportedBy: '1',
    reportedAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'Fallen Tree Blocking Road',
    description: 'Large tree has fallen across Oak Avenue after the storm',
    type: 'fallen-tree',
    severity: 'high',
    status: 'in-progress',
    location: {
      latitude: 40.7200,
      longitude: -74.0100,
      address: '456 Oak Ave, New York, NY'
    },
    reportedBy: '2',
    reportedAt: '2023-05-14T08:15:00Z',
    updatedAt: '2023-05-14T15:20:00Z',
    assignedTo: '3'
  },
  {
    id: '3',
    title: 'Street Flooding',
    description: 'Heavy rain has caused significant flooding on Elm Street',
    type: 'flooding',
    severity: 'critical',
    status: 'in-progress',
    location: {
      latitude: 40.7300,
      longitude: -74.0200,
      address: '789 Elm St, New York, NY'
    },
    reportedBy: '1',
    reportedAt: '2023-05-13T19:45:00Z',
    updatedAt: '2023-05-14T09:10:00Z',
    assignedTo: '4'
  },
  {
    id: '4',
    title: 'Gas Leak Reported',
    description: 'Strong smell of gas in the area of Pine Street',
    type: 'gas-leak',
    severity: 'critical',
    status: 'resolved',
    location: {
      latitude: 40.7150,
      longitude: -74.0080,
      address: '101 Pine St, New York, NY'
    },
    reportedBy: '2',
    reportedAt: '2023-05-12T14:20:00Z',
    updatedAt: '2023-05-12T16:45:00Z',
    assignedTo: '3',
    resolutionDetails: 'Gas company repaired the leak',
    resolutionDate: '2023-05-12T16:45:00Z'
  }
];

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

  fetchHazards: async () => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ hazards: mockHazards, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch hazards', isLoading: false });
    }
  },

  addHazard: async (hazard) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newHazard: HazardReport = {
        ...hazard,
        id: Math.random().toString(36).substring(2, 9),
        reportedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      set(state => ({ 
        hazards: [...state.hazards, newHazard], 
        isLoading: false 
      }));
    } catch (error) {
      set({ error: 'Failed to add hazard', isLoading: false });
    }
  },

  updateHazardStatus: async (id, status, details) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => ({
        hazards: state.hazards.map(hazard => 
          hazard.id === id 
            ? { 
                ...hazard, 
                status, 
                updatedAt: new Date().toISOString(),
                ...(status === 'resolved' && { 
                  resolutionDetails: details,
                  resolutionDate: new Date().toISOString()
                })
              } 
            : hazard
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update hazard status', isLoading: false });
    }
  },

  getHazardById: (id) => {
    return get().hazards.find(hazard => hazard.id === id);
  },

  getHazardsByUser: (userId) => {
    return get().hazards.filter(hazard => hazard.reportedBy === userId);
  },

  getHazardsByStatus: (status) => {
    return get().hazards.filter(hazard => hazard.status === status);
  },

  getHazardsByType: (type) => {
    return get().hazards.filter(hazard => hazard.type === type);
  },

  getHazardsBySeverity: (severity) => {
    return get().hazards.filter(hazard => hazard.severity === severity);
  }
}));

export default useHazardStore;