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
import { useTheme } from '../src/theme/ThemeProvider';
import { Input } from '../src/components/ui/Input';
import { Button } from '../src/components/ui/Button';
import { StateBanner } from '../src/components/ui/StateBanner';
import { Icon } from '../src/components/ui/Icon';
import {
  requestPasswordResetApi,
  confirmPasswordResetApi,
} from '../src/services/auth';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const theme = useTheme();

  const [step, setStep] = useState<'request' | 'confirm'>('request');
  const [identifier, setIdentifier] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRequestReset = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!identifier.trim()) {
      setError('Please provide your registered email, mobile, or School ID');
      return;
    }

    setIsLoading(true);
    try {
      const res = await requestPasswordResetApi({ identifier: identifier.trim() });
      setSuccessMessage(res.message || 'If an account exists, a reset code has been dispatched.');
      setStep('confirm');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not process reset request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmReset = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!token.trim()) {
      setError('Please enter the reset token received');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const res = await confirmPasswordResetApi({
        token: token.trim(),
        newPassword,
      });
      setSuccessMessage(res.message || 'Password successfully updated! You can now log in.');
      setTimeout(() => {
        router.replace('/login' as any);
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Icon name="arrow-right" size={18} color={theme.colors.text} style={{ transform: [{ rotate: '180deg' }] }} />
          <Text style={[styles.backText, { color: theme.colors.text }]}>Back to Sign In</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.accent }]}>
            <Icon name="lock" size={32} color={theme.colors.primary} />
          </View>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {step === 'request' ? 'Reset Password' : 'Set New Password'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
            {step === 'request'
              ? 'Enter your campus identifier to receive a secure recovery verification'
              : 'Enter the verification token and choose a strong new password'}
          </Text>
        </View>

        {error && <StateBanner type="error" message={error} style={styles.banner} />}
        {successMessage && <StateBanner type="success" message={successMessage} style={styles.banner} />}

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          {step === 'request' ? (
            <>
              <Input
                label="Registered Identifier"
                placeholder="Email, Mobile, or School ID"
                leftIcon="user"
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
              />
              <Button
                title="Send Reset Instructions"
                onPress={handleRequestReset}
                loading={isLoading}
                size="lg"
                style={styles.actionBtn}
              />
            </>
          ) : (
            <>
              <Input
                label="Reset Verification Token"
                placeholder="Enter token from email/SMS"
                leftIcon="shield"
                value={token}
                onChangeText={setToken}
                autoCapitalize="none"
              />

              <Input
                label="New Password"
                placeholder="At least 6 characters"
                leftIcon="lock"
                isPassword
                value={newPassword}
                onChangeText={setNewPassword}
              />

              <Input
                label="Confirm New Password"
                placeholder="Re-enter new password"
                leftIcon="lock"
                isPassword
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <Button
                title="Update Password"
                onPress={handleConfirmReset}
                loading={isLoading}
                size="lg"
                style={styles.actionBtn}
              />

              <TouchableOpacity
                onPress={() => setStep('request')}
                activeOpacity={0.7}
                style={styles.resendBtn}
              >
                <Text style={[styles.resendText, { color: theme.colors.primary }]}>
                  Request a new token
                </Text>
              </TouchableOpacity>
            </>
          )}
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
    paddingTop: 36,
    paddingBottom: 32,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 290,
    lineHeight: 18,
  },
  banner: {
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
  },
  actionBtn: {
    marginTop: 8,
  },
  resendBtn: {
    alignItems: 'center',
    marginTop: 16,
    padding: 6,
  },
  resendText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

