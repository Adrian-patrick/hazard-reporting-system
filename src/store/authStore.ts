import { create } from 'zustand';
import axios, { AxiosError } from 'axios';
import { AuthState, User } from '../types';

const API_URL = 'http://localhost:5000/api/users';

const useAuthStore = create<AuthState & {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'user' | 'authority') => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('user'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });

      const { id, name, email: userEmail, token, role } = response.data;

      if (!token) throw new Error("Token missing from response");

      const user: User = { id, name, email: userEmail, token, role };

      // ✅ Store token globally in Axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      set({ user, isAuthenticated: true, isLoading: false });
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error: unknown) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || 'Login failed'
          : 'An unexpected error occurred';

      set({ error: errorMessage, isLoading: false });
    }
  },

  register: async (name, email, password, role) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/register`, { name, email, password, role });

      const { id, name: fullName, email: userEmail, token } = response.data;

      if (!token) throw new Error("Token missing from response");

      const user: User = { id, name: fullName, email: userEmail, token, role };

      // ✅ Store token globally in Axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      set({ user, isAuthenticated: true, isLoading: false });
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error: unknown) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || 'Registration failed'
          : 'An unexpected error occurred';

      set({ error: errorMessage, isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    axios.defaults.headers.common['Authorization'] = ''; // ✅ Remove token globally
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => {
    set({ user, isAuthenticated: true });
    localStorage.setItem('user', JSON.stringify(user));
  },
}));

export default useAuthStore;
