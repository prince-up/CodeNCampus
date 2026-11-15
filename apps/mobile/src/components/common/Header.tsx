import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuthStore } from '../../store/useAuthStore';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Icon } from '../ui/Icon';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onOpenRoleModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onOpenRoleModal,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const session = useAuthStore((s) => s.session);

  const activeRole = session?.activeRole || 'STUDENT';
  const schoolName = session?.activeSchoolName || theme.shortName;
  const userName = session?.user?.fullName || 'Campus User';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.leftSection}>
          {showBack ? (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Icon name="arrow-right" size={18} color={theme.colors.text} style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
          ) : (
            <View style={[styles.schoolIcon, { backgroundColor: theme.colors.accent }]}>
              <Icon name="school" size={18} color={theme.colors.primary} />
            </View>
          )}

          <View style={styles.schoolInfo}>
            <Text style={[styles.schoolName, { color: theme.colors.text }]} numberOfLines={1}>
              {title || schoolName}
            </Text>
            <Text style={[styles.schoolCode, { color: theme.colors.textMuted }]}>
              {subtitle || (session?.readableId ? `ID: ${session.readableId}` : theme.schoolCode)}
            </Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          {onOpenRoleModal && session?.availableRoles && session.availableRoles.length > 1 && (
            <TouchableOpacity onPress={onOpenRoleModal} activeOpacity={0.8} style={styles.roleButton}>
              <Badge label={activeRole} variant="primary" size="sm" />
              <Icon name="chevron-right" size={14} color={theme.colors.primary} style={{ transform: [{ rotate: '90deg' }] }} />
            </TouchableOpacity>
          )}

          {(!onOpenRoleModal || session?.availableRoles?.length === 1) && (
            <Badge label={activeRole} variant="primary" size="sm" style={{ marginRight: 8 }} />
          )}

          <TouchableOpacity
            onPress={() => router.push('/(dashboard)/profile' as any)}
            activeOpacity={0.8}
            style={styles.avatarWrapper}
          >
            <Avatar name={userName} size={36} roleBadge={activeRole} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 6,
  },
  schoolIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  schoolInfo: {
    flex: 1,
  },
  schoolName: {
    fontSize: 16,
    fontWeight: '700',
  },
  schoolCode: {
    fontSize: 11,
    fontWeight: '500',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  avatarWrapper: {
    marginLeft: 4,
  },
});

