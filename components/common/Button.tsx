import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS } from '@/config/constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}: ButtonProps) => {
  // Determine button styles based on variant and size
  const buttonStyles = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  // Determine text styles based on variant and size
  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator 
          color={variant === 'outline' || variant === 'text' ? COLORS.primary : '#fff'} 
          size="small" 
        />
      ) : (
        <>
          {leftIcon}
          <Text style={textStyles}>{title}</Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  // Variants
  primary: {
    backgroundColor: COLORS.primary,
  },
  primaryText: {
    color: '#fff',
  },
  secondary: {
    backgroundColor: COLORS.secondary,
  },
  secondaryText: {
    color: '#fff',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  outlineText: {
    color: COLORS.primary,
  },
  text: {
    backgroundColor: 'transparent',
  },
  textText: {
    color: COLORS.primary,
  },
  // Sizes
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  smallText: {
    fontSize: 14,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  mediumText: {
    fontSize: 16,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  largeText: {
    fontSize: 18,
  },
  // States
  disabled: {
    backgroundColor: COLORS.disabled,
    borderColor: COLORS.disabled,
  },
  disabledText: {
    color: COLORS.textLight,
  },
});

export default Button;