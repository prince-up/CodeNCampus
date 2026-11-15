import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme, useMobileThemeStore } from '../src/theme/ThemeProvider';
import { PRESET_SCHOOLS } from '../src/theme/branding';
import { useAuthStore } from '../src/store/useAuthStore';
import { Input } from '../src/components/ui/Input';
import { Button } from '../src/components/ui/Button';
import { StateBanner } from '../src/components/ui/StateBanner';
import { Icon } from '../src/components/ui/Icon';

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const setSchoolCode = useMobileThemeStore((s) => s.setSchoolCode);
  const currentSchoolCode = useMobileThemeStore((s) => s.currentSchoolCode);

  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const authError = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string }>({});

  const validate = (): boolean => {
    const errors: { identifier?: string; password?: string } = {};
    if (!identifier.trim()) {
      errors.identifier = 'Email, phone number, or School ID is required';
    } else if (identifier.trim().length < 3) {
      errors.identifier = 'Must be at least 3 characters';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    clearError();
    if (!validate()) return;

    const success = await login(identifier.trim(), password);
    if (success) {
      const session = useAuthStore.getState().session;
      const role = session?.activeRole;

      if (role === 'TEACHER') {
        router.replace('/(dashboard)/teacher' as any);
      } else if (role === 'PARENT') {
        router.replace('/(dashboard)/parent' as any);
      } else if (role === 'SCHOOL_ADMIN' || role === 'PRINCIPAL') {
        router.replace('/(dashboard)/admin' as any);
      } else {
        router.replace('/(dashboard)/student' as any);
      }
    }
  };

  const schoolPresets = Object.keys(PRESET_SCHOOLS);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View
            style={[
              styles.logoCircle,
              {
                backgroundColor: theme.colors.primary,
                shadowColor: theme.colors.primary,
              },
            ]}
          >
            <Icon name="school" size={32} color="#FFFFFF" />
          </View>
          <Text style={[styles.title, { color: theme.colors.text }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
            Sign in to access your verified {theme.shortName} credentials
          </Text>
        </View>

        {/* School Branding Switcher Selector */}
        <View style={styles.schoolSelectorSection}>
          <Text style={[styles.selectorLabel, { color: theme.colors.textMuted }]}>
            Campus Institution:
          </Text>
          <View style={styles.presetsRow}>
            {schoolPresets.map((code) => {
              const preset = PRESET_SCHOOLS[code];
              const isSelected = currentSchoolCode === code;
              return (
                <TouchableOpacity
                  key={code}
                  onPress={() => setSchoolCode(code)}
                  style={[
                    styles.presetBadge,
                    {
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                      backgroundColor: isSelected ? theme.colors.accent : theme.colors.surface,
                    },
                  ]}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.presetText,
                      {
                        color: isSelected ? theme.colors.primary : theme.colors.textMuted,
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}
                  >
                    {preset.shortName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Quick Role Fill Pills for 1-Tap Testing */}
        <View style={styles.demoSection}>
          <Text style={[styles.selectorLabel, { color: theme.colors.textMuted }]}>
            1-Tap Quick Fill Persona:
          </Text>
          <View style={styles.demoChipsRow}>
            {[
              { label: 'Admin', id: 'admin@school.edu', pass: 'Admin@2026', icon: 'shield' as const },
              { label: 'Teacher', id: 'teacher@school.edu', pass: 'Teacher@2026', icon: 'briefcase' as const },
              { label: 'Parent', id: 'parent@school.edu', pass: 'Parent@2026', icon: 'home' as const },
              { label: 'Student', id: 'student@school.edu', pass: 'Student@2026', icon: 'book' as const },
            ].map((persona) => (
              <TouchableOpacity
                key={persona.label}
                onPress={() => {
                  setIdentifier(persona.id);
                  setPassword(persona.pass);
                  setFieldErrors({});
                }}
                style={[
                  styles.demoChip,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
                activeOpacity={0.75}
              >
                <Icon name={persona.icon} size={14} color={theme.colors.primary} />
                <Text style={[styles.demoChipText, { color: theme.colors.text }]}>
                  {persona.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Global Error Banner */}
        {authError && (
          <StateBanner
            type="error"
            message={authError}
            onRetry={handleLogin}
            style={styles.errorBanner}
          />
        )}

        {/* Login Form */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Input
            label="Email / Mobile / School ID"
            placeholder="e.g. DPS-STU-00042 or user@school.edu"
            leftIcon="user"
            autoCapitalize="none"
            autoCorrect={false}
            value={identifier}
            onChangeText={(val) => {
              setIdentifier(val);
              if (fieldErrors.identifier) setFieldErrors((prev) => ({ ...prev, identifier: undefined }));
            }}
            error={fieldErrors.identifier}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            leftIcon="lock"
            isPassword
            value={password}
            onChangeText={(val) => {
              setPassword(val);
              if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
            }}
            error={fieldErrors.password}
          />

          <View style={styles.forgotPasswordRow}>
            <TouchableOpacity
              onPress={() => router.push('/forgot-password' as any)}
              activeOpacity={0.7}
            >
              <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            size="lg"
            icon="arrow-right"
            iconPosition="right"
            style={styles.submitButton}
          />
        </View>

        {/* Security Assurance */}
        <View style={styles.securityFooter}>
          <Icon name="shield" size={16} color={theme.colors.textMuted} />
          <Text style={[styles.securityText, { color: theme.colors.textMuted }]}>
            Powered by Codazk Technologies Private Limited
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 290,
    lineHeight: 18,
  },
  schoolSelectorSection: {
    marginBottom: 16,
  },
  demoSection: {
    marginBottom: 16,
  },
  demoChipsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  demoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  demoChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  selectorLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  presetText: {
    fontSize: 12,
  },
  errorBanner: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  forgotPasswordRow: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 4,
  },
  securityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  securityText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

