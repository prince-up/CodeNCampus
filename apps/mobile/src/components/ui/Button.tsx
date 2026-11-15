import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Icon, IconName } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  fullWidth = true,
}) => {
  const theme = useTheme();

  const getContainerStyle = (): ViewStyle => {
    let bg = theme.colors.primary;
    let border = 'transparent';
    let borderWidth = 0;

    switch (variant) {
      case 'primary':
        bg = theme.colors.primary;
        break;
      case 'secondary':
        bg = theme.colors.secondary;
        break;
      case 'outline':
        bg = 'transparent';
        border = theme.colors.primary;
        borderWidth = 1.5;
        break;
      case 'danger':
        bg = theme.colors.danger;
        break;
      case 'ghost':
        bg = 'transparent';
        break;
    }

    let paddingVertical = 14;
    let paddingHorizontal = 20;
    let borderRadius = 12;

    if (size === 'sm') {
      paddingVertical = 8;
      paddingHorizontal = 14;
      borderRadius = 8;
    } else if (size === 'lg') {
      paddingVertical = 16;
      paddingHorizontal = 24;
      borderRadius = 14;
    }

    return {
      backgroundColor: bg,
      borderColor: border,
      borderWidth,
      paddingVertical,
      paddingHorizontal,
      borderRadius,
      opacity: disabled || loading ? 0.6 : 1,
      width: fullWidth ? '100%' : 'auto',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    };
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return theme.colors.primary;
      case 'primary':
      case 'secondary':
      case 'danger':
      default:
        return '#FFFFFF';
    }
  };

  const textColor = getTextColor();
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled || loading}
      style={[getContainerStyle(), style]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && (
            <Icon name={icon} size={iconSize} color={textColor} style={styles.iconLeft} />
          )}
          <Text
            style={[
              styles.text,
              {
                color: textColor,
                fontSize: size === 'sm' ? 13 : size === 'lg' ? 17 : 15,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Icon name={icon} size={iconSize} color={textColor} style={styles.iconRight} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

