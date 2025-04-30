export interface User {
  id: string;
  username: string;
  fullName: string;
  contactNumber: string;
  email: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  notes?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}