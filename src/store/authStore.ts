import { create } from 'zustand';
import axios from 'axios';
import { AuthState, User } from '../types';

const useAuthStore = create<AuthState & {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'user' | 'authority') => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      const user: User = response.data; // Assuming the response contains user data
      set({ user, isAuthenticated: true, isLoading: false });
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      set({ error: 'Invalid credentials', isLoading: false });
    }
  },

  register: async (name, email, password, role) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('http://localhost:5000/api/users', { name, email, password, role });
      const user: User = response.data; // Assuming the response contains user data
      set({ user, isAuthenticated: true, isLoading: false });
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      set({ error: 'Registration failed', isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => {
    set({ user, isAuthenticated: true });
  },
}));

export default useAuthStore;
