import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact, ApiResponse } from '@/types';
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

export const getContacts = async () => {
  try {
    const response = await api.get<ApiResponse<Contact[]>>('/contacts');

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch contacts');
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch contacts');
    }
    
    // For development/testing purposes
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using mock contacts in development');
      return mockContacts;
    }
    
    throw new Error('Network error. Please try again later.');
  }
};

export const searchContacts = async (query: string) => {
  try {
    const response = await api.get<ApiResponse<Contact[]>>(`/contacts/search?q=${query}`);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Search failed');
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Search failed');
    }
    
    // For development/testing purposes
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using mock search in development');
      return mockContacts.filter(
        contact => 
          contact.name.toLowerCase().includes(query.toLowerCase()) || 
          contact.email.toLowerCase().includes(query.toLowerCase()) ||
          contact.phone.includes(query)
      );
    }
    
    throw new Error('Network error. Please try again later.');
  }
};

export const addContact = async (contact: Omit<Contact, 'id' | 'createdAt'>) => {
  try {
    const response = await api.post<ApiResponse<Contact>>('/contacts', contact);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to add contact');
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to add contact');
    }
    
    // For development/testing purposes
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using mock add contact in development');
      const newContact: Contact = {
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
        ...contact,
      };
      return newContact;
    }
    
    throw new Error('Network error. Please try again later.');
  }
};

// Mock data for development/testing
const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '123-456-7890',
    email: 'john@example.com',
    address: '123 Main St, Anytown',
    notes: 'Work colleague',
    createdAt: '2023-01-15T12:00:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    phone: '987-654-3210',
    email: 'jane@example.com',
    address: '456 Elm St, Somewhere',
    createdAt: '2023-02-10T10:30:00Z',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    phone: '555-123-4567',
    email: 'bob@example.com',
    notes: 'Met at conference',
    createdAt: '2023-03-05T15:45:00Z',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    phone: '444-888-9999',
    email: 'sarah@example.com',
    address: '789 Oak Dr, Elsewhere',
    createdAt: '2023-04-20T09:15:00Z',
  },
  {
    id: '5',
    name: 'Michael Brown',
    phone: '222-333-4444',
    email: 'michael@example.com',
    notes: 'Client from ABC Corp',
    createdAt: '2023-05-12T14:20:00Z',
  },
];