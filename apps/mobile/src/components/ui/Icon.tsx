import React from 'react';
import { View, Text, StyleSheet, TextStyle, ViewStyle } from 'react-native';

export type IconName =
  | 'book'
  | 'calendar'
  | 'check'
  | 'clock'
  | 'user'
  | 'users'
  | 'bell'
  | 'shield'
  | 'arrow-right'
  | 'logout'
  | 'settings'
  | 'award'
  | 'alert-circle'
  | 'eye'
  | 'eye-off'
  | 'bus'
  | 'dollar'
  | 'briefcase'
  | 'chevron-right'
  | 'menu'
  | 'close'
  | 'refresh'
  | 'file-text'
  | 'school'
  | 'home'
  | 'phone'
  | 'mail'
  | 'lock'
  | 'search'
  | 'check-circle'
  | 'x-circle'
  | 'sparkles';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

// Clean Unicode vector glyph mappings with consistent styling
const GLYPH_MAP: Record<IconName, string> = {
  book: '📖',
  calendar: '📅',
  check: '✓',
  clock: '⏱️',
  user: '👤',
  users: '👥',
  bell: '🔔',
  shield: '🛡️',
  'arrow-right': '➔',
  logout: '⏻',
  settings: '⚙️',
  award: '🏆',
  'alert-circle': '⚠️',
  eye: '👁️',
  'eye-off': '🙈',
  bus: '🚌',
  dollar: '💳',
  briefcase: '💼',
  'chevron-right': '›',
  menu: '☰',
  close: '✕',
  refresh: '⟳',
  'file-text': '📄',
  school: '🏫',
  home: '🏠',
  phone: '📞',
  mail: '✉️',
  lock: '🔒',
  search: '🔍',
  'check-circle': '✅',
  'x-circle': '❌',
  sparkles: '✨',
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  color,
  style,
}) => {
  const glyph = GLYPH_MAP[name] || '•';

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Text
        style={[
          styles.glyph,
          {
            fontSize: size * 0.85,
            lineHeight: size,
            color: color || '#0F172A',
          },
        ]}
      >
        {glyph}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    textAlign: 'center',
    includeFontPadding: false,
  },
});

