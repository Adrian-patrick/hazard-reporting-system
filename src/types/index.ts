export type UserRole = 'user' | 'authority' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  token?: string;  // ✅ Ensure token is included and optional (?)
  role: 'user' | 'authority';
}

export type HazardStatus = 'reported' | 'in-progress' | 'resolved' | 'dismissed';
export type HazardSeverity = 'low' | 'medium' | 'high' | 'critical';
export type HazardType = 
  | 'road-damage' 
  | 'flooding' 
  | 'fallen-tree' 
  | 'power-outage' 
  | 'gas-leak'
  | 'structural-damage'
  | 'fire-hazard'
  | 'other';

export interface HazardReport {
  _id: any;
  id: string;
  title: string;
  description: string;
  type: HazardType;
  severity: HazardSeverity;
  status: HazardStatus;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  images?: string[];
  reportedBy: string;
  reportedAt: string;
  updatedAt: string;
  assignedTo?: string;
  resolutionDetails?: string;
  resolutionDate?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}