import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeProvider';
import { useAuthStore } from '../src/store/useAuthStore';
import { Icon } from '../src/components/ui/Icon';

export default function IndexSplashScreen() {
  const router = useRouter();
  const theme = useTheme();
  const session = useAuthStore((s) => s.session);

  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.92));

  useEffect(() => {
    // Smooth splash entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto navigate after splash display
    const timer = setTimeout(() => {
      if (session) {
        // Direct to appropriate role dashboard
        const role = session.activeRole;
        if (role === 'TEACHER') {
          router.replace('/(dashboard)/teacher' as any);
        } else if (role === 'PARENT') {
          router.replace('/(dashboard)/parent' as any);
        } else if (role === 'SCHOOL_ADMIN' || role === 'PRINCIPAL') {
          router.replace('/(dashboard)/admin' as any);
        } else {
          router.replace('/(dashboard)/student' as any);
        }
      } else {
        // First-time landing screen -> onboarding
        router.replace('/onboarding' as any);
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [session]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View
          style={[
            styles.logoContainer,
            {
              backgroundColor: theme.colors.primary,
              shadowColor: theme.colors.primary,
            },
          ]}
        >
          <Icon name="school" size={48} color="#FFFFFF" />
        </View>

        <Text style={[styles.title, { color: theme.colors.text }]}>
          {theme.shortName}
        </Text>
        <Text style={[styles.tagline, { color: theme.colors.textMuted }]}>
          {theme.tagline}
        </Text>

        <View style={styles.badgeWrapper}>
          <Text
            style={[
              styles.schoolBadge,
              {
                backgroundColor: theme.colors.accent,
                color: theme.colors.primary,
              },
            ]}
          >
            {theme.name}
          </Text>
        </View>

        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textMuted }]}>
            Securing campus session...
          </Text>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.colors.textMuted }]}>
          Powered by Codazk Technologies Private Limited
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
    maxWidth: 280,
  },
  badgeWrapper: {
    marginBottom: 36,
  },
  schoolBadge: {
    fontSize: 12,
    fontWeight: '700',
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 999,
    overflow: 'hidden',
  },
  loaderContainer: {
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 24,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
