import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Mail, Phone } from 'lucide-react-native';
import { COLORS } from '@/config/constants';
import { Contact } from '@/types';

interface ContactItemProps {
  contact: Contact;
  onPress?: (contact: Contact) => void;
}

const ContactItem = ({ contact, onPress }: ContactItemProps) => {
  const initials = contact.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const handlePress = () => {
    if (onPress) onPress(contact);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.avatar}>
        <Text style={styles.initials}>{initials}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name}>{contact.name}</Text>
        
        <View style={styles.contactInfo}>
          <View style={styles.infoItem}>
            <Phone size={16} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>{contact.phone}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Mail size={16} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>{contact.email}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  initials: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLORS.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  contactInfo: {
    gap: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default ContactItem;