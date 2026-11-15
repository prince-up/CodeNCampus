import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Icon } from './Icon';

interface StateBannerProps {
  type?: 'error' | 'warning' | 'info' | 'success';
  message: string;
  onRetry?: () => void;
  style?: ViewStyle;
}

export const StateBanner: React.FC<StateBannerProps> = ({
  type = 'error',
  message,
  onRetry,
  style,
}) => {
  const theme = useTheme();

  const getStyle = () => {
    switch (type) {
      case 'success':
        return {
          bg: '#DCFCE7',
          border: '#86EFAC',
          text: '#15803D',
          icon: 'check-circle' as const,
        };
      case 'warning':
        return {
          bg: '#FEF3C7',
          border: '#FCD34D',
          text: '#B45309',
          icon: 'alert-circle' as const,
        };
      case 'info':
        return {
          bg: '#E0F2FE',
          border: '#7DD3FC',
          text: '#0369A1',
          icon: 'sparkles' as const,
        };
      case 'error':
      default:
        return {
          bg: '#FEE2E2',
          border: '#FCA5A5',
          text: '#B91C1C',
          icon: 'alert-circle' as const,
        };
    }
  };

  const config = getStyle();

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
        },
        style,
      ]}
    >
      <Icon name={config.icon} size={18} color={config.text} style={styles.icon} />
      <Text style={[styles.message, { color: config.text }]}>{message}</Text>
      {onRetry && (
        <TouchableOpacity onPress={onRetry} activeOpacity={0.7} style={styles.retryBtn}>
          <Text style={[styles.retryText, { color: config.text }]}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
  message: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  retryBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  retryText: {
    fontSize: 12,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});

