import React from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { COLORS } from '@/config/constants';
import { Contact } from '@/types';
import ContactItem from './ContactItem';

interface ContactListProps {
  contacts: Contact[];
  isLoading: boolean;
  onContactPress?: (contact: Contact) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

const ContactList = ({
  contacts,
  isLoading,
  onContactPress,
  onRefresh,
  refreshing = false,
}: ContactListProps) => {
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (contacts.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No contacts found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={contacts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ContactItem contact={item} onPress={onContactPress} />
      )}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});

export default ContactList;