import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, ApiResponse } from '@/types';
import { API_URL } from '@/config/constants';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', {
      username,
      password,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Login failed');
    }

    return {
      user: response.data.data.user,
      token: response.data.data.token,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    }
    // For development/testing purposes, mock a successful login
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using mock login in development');
      return {
        user: {
          id: '1',
          username: username,
          fullName: 'Test User',
          contactNumber: '1234567890',
          email: 'test@example.com',
        },
        token: 'mock-token-for-development',
      };
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const updateUserProfile = async (userData: Partial<User>) => {
  try {
    const response = await api.put<ApiResponse<User>>('/auth/profile', userData);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Profile update failed');
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Profile update failed');
    }
    
    // For development/testing purposes
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using mock profile update in development');
      const currentUser = await AsyncStorage.getItem('user');
      if (!currentUser) throw new Error('User not found');
      
      const user = JSON.parse(currentUser) as User;
      const updatedUser = { ...user, ...userData };
      return updatedUser;
    }
    
    throw new Error('Network error. Please try again later.');
  }
};

export const logoutUser = async () => {
  try {
    await api.post<ApiResponse<null>>('/auth/logout');
    return true;
  } catch (error) {
    console.warn('Logout error:', error);
    // We still want to clear local storage even if the server request fails
    return true;
  }
};