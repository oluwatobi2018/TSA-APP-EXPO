import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '@/config/constants';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  leftIcon,
  rightIcon,
}: InputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const renderPasswordToggle = () => {
    if (!secureTextEntry) return null;
    
    return (
      <TouchableOpacity
        onPress={togglePasswordVisibility}
        style={styles.iconRight}
      >
        {isPasswordVisible ? (
          <EyeOff size={20} color={COLORS.textSecondary} />
        ) : (
          <Eye size={20} color={COLORS.textSecondary} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        error ? styles.inputError : null,
        multiline && styles.multilineContainer
      ]}>
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : null,
            (rightIcon || secureTextEntry) ? styles.inputWithRightIcon : null,
            multiline && styles.multilineInput,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
        />
        
        {renderPasswordToggle() || (rightIcon && <View style={styles.iconRight}>{rightIcon}</View>)}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.card,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  iconLeft: {
    paddingLeft: 12,
  },
  iconRight: {
    paddingRight: 12,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
  },
  multilineContainer: {
    minHeight: 100,
  },
  multilineInput: {
    textAlignVertical: 'top',
    minHeight: 100,
  },
});

export default Input;