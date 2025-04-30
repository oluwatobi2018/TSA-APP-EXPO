import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { COLORS, VALIDATION } from '@/config/constants';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useAuth } from '@/context/AuthContext';
import { Mail, Phone, User, LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, updateProfile, logout, isLoading, error } = useAuth();
  
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [contactNumber, setContactNumber] = useState(user?.contactNumber || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  
  const [errors, setErrors] = useState({
    fullName: '',
    contactNumber: '',
    email: '',
  });

  const validate = () => {
    const newErrors = {
      fullName: '',
      contactNumber: '',
      email: '',
    };
    let isValid = true;

    // Validate fullName
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    } else if (
      fullName.length < VALIDATION.NAME_MIN_LENGTH ||
      fullName.length > VALIDATION.NAME_MAX_LENGTH
    ) {
      newErrors.fullName = `Name must be between ${VALIDATION.NAME_MIN_LENGTH} and ${VALIDATION.NAME_MAX_LENGTH} characters`;
      isValid = false;
    }

    // Validate contactNumber
    if (!contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
      isValid = false;
    } else if (!VALIDATION.PHONE_REGEX.test(contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid phone number';
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

  const handleSaveProfile = async () => {
    if (!validate()) return;

    try {
      const success = await updateProfile({
        fullName,
        contactNumber,
        email,
      });

      if (success) {
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (err) {
      Alert.alert('Error', `Failed to update profile: ${(err as Error).message}`);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logout(),
        },
      ],
      { cancelable: true }
    );
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
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.fullName
                ?.split(' ')
                .map(name => name[0])
                .join('')
                .toUpperCase()
                .substring(0, 2) || 'U'}
            </Text>
          </View>
          <Text style={styles.username}>@{user?.username}</Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Input
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            error={errors.fullName}
            leftIcon={<User size={20} color={COLORS.textSecondary} />}
            editable={isEditing}
          />

          <Input
            label="Contact Number"
            value={contactNumber}
            onChangeText={setContactNumber}
            placeholder="Enter your contact number"
            keyboardType="phone-pad"
            error={errors.contactNumber}
            leftIcon={<Phone size={20} color={COLORS.textSecondary} />}
            editable={isEditing}
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email address"
            keyboardType="email-address"
            error={errors.email}
            leftIcon={<Mail size={20} color={COLORS.textSecondary} />}
            editable={isEditing}
          />

          <View style={styles.buttonContainer}>
            {isEditing ? (
              <>
                <Button
                  title="Save Changes"
                  onPress={handleSaveProfile}
                  isLoading={isLoading}
                  style={styles.button}
                />
                <Button
                  title="Cancel"
                  onPress={() => {
                    setIsEditing(false);
                    // Reset to original values
                    setFullName(user?.fullName || '');
                    setContactNumber(user?.contactNumber || '');
                    setEmail(user?.email || '');
                  }}
                  variant="outline"
                  style={styles.button}
                />
              </>
            ) : (
              <Button
                title="Edit Profile"
                onPress={() => setIsEditing(true)}
                style={styles.button}
              />
            )}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <LogOut size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: 'white',
  },
  username: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  form: {
    width: '100%',
  },
  buttonContainer: {
    marginTop: 24,
  },
  button: {
    marginBottom: 12,
  },
  errorContainer: {
    backgroundColor: '#FEECEC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FADCDC',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.error,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  logoutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.error,
    marginLeft: 8,
  },
});