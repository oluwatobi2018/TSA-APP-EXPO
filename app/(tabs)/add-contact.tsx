import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, VALIDATION } from '@/config/constants';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { addContact } from '@/services/contactService';
import { Mail, Phone, Chrome as Home, FileText } from 'lucide-react-native';

export default function AddContactScreen() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });

  const validate = () => {
    const newErrors = {
      name: '',
      phone: '',
      email: '',
      address: '',
      notes: '',
    };
    let isValid = true;

    // Validate name
    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (
      name.length < VALIDATION.NAME_MIN_LENGTH ||
      name.length > VALIDATION.NAME_MAX_LENGTH
    ) {
      newErrors.name = `Name must be between ${VALIDATION.NAME_MIN_LENGTH} and ${VALIDATION.NAME_MAX_LENGTH} characters`;
      isValid = false;
    }

    // Validate phone
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!VALIDATION.PHONE_REGEX.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
      isValid = false;
    }

    // Validate email
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!VALIDATION.EMAIL_REGEX.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddContact = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);
      await addContact({
        name,
        phone,
        email,
        address,
        notes,
      });

      Alert.alert('Success', 'Contact added successfully', [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setName('');
            setPhone('');
            setEmail('');
            setAddress('');
            setNotes('');
            
            // Navigate back to contacts list
            router.push('/(tabs)/');
          },
        },
      ]);
    } catch (err) {
      Alert.alert('Error', `Failed to add contact: ${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.description}>
          Add a new contact to your contact list
        </Text>

        <View style={styles.form}>
          <Input
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter full name"
            error={errors.name}
          />

          <Input
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            error={errors.phone}
            leftIcon={<Phone size={20} color={COLORS.textSecondary} />}
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email address"
            keyboardType="email-address"
            error={errors.email}
            leftIcon={<Mail size={20} color={COLORS.textSecondary} />}
          />

          <Input
            label="Address (Optional)"
            value={address}
            onChangeText={setAddress}
            placeholder="Enter address"
            multiline
            numberOfLines={3}
            error={errors.address}
            leftIcon={<Home size={20} color={COLORS.textSecondary} />}
          />

          <Input
            label="Notes (Optional)"
            value={notes}
            onChangeText={setNotes}
            placeholder="Enter any additional notes"
            multiline
            numberOfLines={3}
            error={errors.notes}
            leftIcon={<FileText size={20} color={COLORS.textSecondary} />}
          />

          <View style={styles.buttonContainer}>
            <Button
              title="Add Contact"
              onPress={handleAddContact}
              isLoading={isLoading}
              size="large"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    padding: 16,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  buttonContainer: {
    marginVertical: 24,
  },
});