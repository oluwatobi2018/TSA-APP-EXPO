import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Search as SearchIcon, RefreshCw } from 'lucide-react-native';
import { COLORS } from '@/config/constants';
import { getContacts, searchContacts } from '@/services/contactService';
import ContactList from '@/components/contacts/ContactList';
import { Contact } from '@/types';

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getContacts();
      setContacts(data);
      setFilteredContacts(data);
    } catch (err) {
      setError(`Failed to load contacts: ${(err as Error).message}`);
      Alert.alert('Error', `Failed to load contacts: ${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load contacts when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadContacts();
    }, [loadContacts])
  );

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      const data = await getContacts();
      setContacts(data);
      
      // If search is active, filter the new contacts
      if (searchQuery) {
        handleSearch(searchQuery);
      } else {
        setFilteredContacts(data);
      }
    } catch (err) {
      setError(`Failed to refresh contacts: ${(err as Error).message}`);
      Alert.alert('Error', `Failed to refresh contacts: ${(err as Error).message}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredContacts(contacts);
      return;
    }

    try {
      setIsLoading(true);
      const results = await searchContacts(query);
      setFilteredContacts(results);
    } catch (err) {
      setError(`Search failed: ${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactPress = (contact: Contact) => {
    // Future enhancement: navigate to contact details
    Alert.alert('Contact Selected', `${contact.name}\n${contact.phone}\n${contact.email}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <SearchIcon size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw 
            size={20} 
            color={COLORS.primary} 
            style={isRefreshing ? styles.refreshing : undefined} 
          />
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <ContactList
        contacts={filteredContacts}
        isLoading={isLoading && !isRefreshing}
        onContactPress={handleContactPress}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 8,
  },
  refreshButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  refreshing: {
    opacity: 0.5,
  },
  errorContainer: {
    margin: 16,
    padding: 12,
    backgroundColor: '#FEECEC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FADCDC',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.error,
  },
});