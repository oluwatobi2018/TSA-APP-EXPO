import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState } from '@/types';
import { loginUser, updateUserProfile, logoutUser } from '@/services/authService';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
  
  const router = useRouter();
  const segments = useSegments();

  // Check for stored user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        const tokenExists = await AsyncStorage.getItem('token');
        
        if (userJson && tokenExists) {
          const user = JSON.parse(userJson);
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState({ ...state, isLoading: false });
        }
      } catch (error) {
        setState({ ...state, isLoading: false, error: 'Failed to load user data' });
      }
    };
    
    loadUser();
  }, []);

  // Handle routing based on auth state
  useEffect(() => {
    if (state.isLoading) return;
    
    const inAuthGroup = segments[0] === '(auth)';
    
    if (!state.isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (state.isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)/');
    }
  }, [state.isAuthenticated, state.isLoading, segments]);

  const login = async (username: string, password: string) => {
    setState({ ...state, isLoading: true, error: null });
    
    try {
      const { user, token } = await loginUser(username, password);
      
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('token', token);
      
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return true;
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: (error as Error).message || 'Login failed',
      });
      return false;
    }
  };

  const logout = async () => {
    setState({ ...state, isLoading: true });
    
    try {
      await logoutUser();
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: (error as Error).message || 'Logout failed',
      });
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    setState({ ...state, isLoading: true, error: null });
    
    try {
      if (!state.user) throw new Error('User not found');
      
      const updatedUser = await updateUserProfile(userData);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      
      setState({
        ...state,
        user: updatedUser,
        isLoading: false,
      });
      
      return true;
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: (error as Error).message || 'Profile update failed',
      });
      return false;
    }
  };

  const clearError = () => {
    setState({ ...state, error: null });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        updateProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};