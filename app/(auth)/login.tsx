import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { COLORS, VALIDATION } from '@/config/constants';
import { User, Lock } from 'lucide-react-native';

export default function LoginScreen() {
  const { login, error, isLoading, clearError } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    username: '',
    password: '',
  });

  // Clear error when inputs change
  const handleUsernameChange = (text: string) => {
    setUsername(text);
    setValidationErrors(prev => ({ ...prev, username: '' }));
    if (error) clearError();
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setValidationErrors(prev => ({ ...prev, password: '' }));
    if (error) clearError();
  };

  const validate = () => {
    const errors = {
      username: '',
      password: '',
    };
    let isValid = true;

    if (!username.trim()) {
      errors.username = 'Username is required';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      errors.password = `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`;
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    
    const success = await login(username, password);
    
    if (!success && !error) {
      Alert.alert('Login Failed', 'Invalid username or password');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Input
            label="Username"
            value={username}
            onChangeText={handleUsernameChange}
            placeholder="Enter your username"
            leftIcon={<User size={20} color={COLORS.textSecondary} />}
            error={validationErrors.username}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={handlePasswordChange}
            placeholder="Enter your password"
            secureTextEntry
            leftIcon={<Lock size={20} color={COLORS.textSecondary} />}
            error={validationErrors.password}
          />

          <Button
            title="Sign In"
            onPress={handleLogin}
            isLoading={isLoading}
            style={styles.loginButton}
          />
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
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  errorContainer: {
    backgroundColor: '#FEECEC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FADCDC',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.error,
  },
  loginButton: {
    marginTop: 16,
  },
});