import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Icon, IconName } from './Icon';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: IconName;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  style?: ViewStyle;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtitle,
  icon,
  trend,
  trendType = 'neutral',
  style,
}) => {
  const theme = useTheme();

  const getTrendColor = () => {
    if (trendType === 'positive') return theme.colors.success;
    if (trendType === 'negative') return theme.colors.danger;
    return theme.colors.textMuted;
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
        style,
      ]}
    >
      <View style={styles.topRow}>
        <Text style={[styles.label, { color: theme.colors.textMuted }]}>
          {label}
        </Text>
        {icon && (
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: theme.colors.accent },
            ]}
          >
            <Icon name={icon} size={16} color={theme.colors.primary} />
          </View>
        )}
      </View>

      <Text style={[styles.value, { color: theme.colors.text }]}>{value}</Text>

      {(subtitle || trend) && (
        <View style={styles.bottomRow}>
          {trend && (
            <Text style={[styles.trend, { color: getTrendColor() }]}>
              {trend}
            </Text>
          )}
          {subtitle && (
            <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
              {subtitle}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  iconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  trend: {
    fontSize: 11,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 11,
  },
});

