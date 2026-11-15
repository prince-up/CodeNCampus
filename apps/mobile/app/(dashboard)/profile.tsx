import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme, useMobileThemeStore } from '../../src/theme/ThemeProvider';
import { PRESET_SCHOOLS } from '../../src/theme/branding';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Header } from '../../src/components/common/Header';
import { RoleSwitcherModal } from '../../src/components/common/RoleSwitcherModal';
import { Card } from '../../src/components/ui/Card';
import { Avatar } from '../../src/components/ui/Avatar';
import { Badge } from '../../src/components/ui/Badge';
import { Button } from '../../src/components/ui/Button';
import { Icon } from '../../src/components/ui/Icon';

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const setSchoolCode = useMobileThemeStore((s) => s.setSchoolCode);
  const currentSchoolCode = useMobileThemeStore((s) => s.currentSchoolCode);

  const session = useAuthStore((s) => s.session);
  const logout = useAuthStore((s) => s.logout);
  const [roleModalVisible, setRoleModalVisible] = useState(false);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [attendanceAlerts, setAttendanceAlerts] = useState(true);

  const user = session?.user;
  const activeRole = session?.activeRole || 'STUDENT';
  const availableRoles = session?.availableRoles || [activeRole];
  const readableId = session?.readableId || 'DPS-STU-00042';

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to end your current campus session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login' as any);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface }]}>
      <Header title="Profile & Preferences" subtitle="Verified Campus Identity" showBack />

      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.content}
      >
        {/* User Identity Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar name={user?.fullName || 'Campus Member'} size={68} roleBadge={activeRole} />
            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: theme.colors.text }]}>
                {user?.fullName || 'Campus Member'}
              </Text>
              <Text style={[styles.userId, { color: theme.colors.textMuted }]}>
                Campus ID: {readableId}
              </Text>
              <View style={styles.badgesRow}>
                <Badge label={activeRole} variant="primary" size="sm" />
                <Badge label="Active" variant="success" size="sm" />
              </View>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          <View style={styles.contactDetails}>
            <View style={styles.contactItem}>
              <Icon name="mail" size={16} color={theme.colors.textMuted} />
              <Text style={[styles.contactText, { color: theme.colors.text }]}>
                {user?.email || 'student@codencampus.edu'}
              </Text>
            </View>
            <View style={styles.contactItem}>
              <Icon name="phone" size={16} color={theme.colors.textMuted} />
              <Text style={[styles.contactText, { color: theme.colors.text }]}>
                {user?.phone || '+91 98765 43210'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Multi-Role Switcher Section */}
        <Card>
          <Card.Header
            title="Assigned Campus Personas"
            subtitle={`${availableRoles.length} active credentials assigned to you`}
            action={
              availableRoles.length > 1 ? (
                <TouchableOpacity onPress={() => setRoleModalVisible(true)}>
                  <Text style={[styles.switchLink, { color: theme.colors.primary }]}>
                    Switch
                  </Text>
                </TouchableOpacity>
              ) : undefined
            }
          />
          <Card.Body>
            <View style={styles.rolesRow}>
              {availableRoles.map((role) => {
                const isCurrent = role === activeRole;
                return (
                  <View
                    key={role}
                    style={[
                      styles.roleChip,
                      {
                        backgroundColor: isCurrent ? theme.colors.accent : '#F1F5F9',
                        borderColor: isCurrent ? theme.colors.primary : 'transparent',
                      },
                    ]}
                  >
                    <Icon
                      name="user"
                      size={14}
                      color={isCurrent ? theme.colors.primary : '#475569'}
                    />
                    <Text
                      style={[
                        styles.roleChipText,
                        { color: isCurrent ? theme.colors.primary : '#334155' },
                      ]}
                    >
                      {role}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Card.Body>
        </Card>

        {/* Institution & White-Label Details */}
        <Card>
          <Card.Header
            title="School Affiliation"
            subtitle="Tenant authorization & accreditation"
          />
          <Card.Body>
            <View style={styles.schoolRow}>
              <View style={[styles.schoolIcon, { backgroundColor: theme.colors.accent }]}>
                <Icon name="school" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.schoolDetails}>
                <Text style={[styles.schoolTitle, { color: theme.colors.text }]}>
                  {theme.name}
                </Text>
                <Text style={[styles.schoolMeta, { color: theme.colors.textMuted }]}>
                  Code: {theme.schoolCode} • Affiliation: CBSE (New Delhi)
                </Text>
              </View>
            </View>

            {/* Quick School Preset Demonstration */}
            <View style={styles.themeSwitcher}>
              <Text style={[styles.themeLabel, { color: theme.colors.textMuted }]}>
                Preview School Branding Theme:
              </Text>
              <View style={styles.themeChips}>
                {Object.keys(PRESET_SCHOOLS).map((code) => {
                  const isCur = currentSchoolCode === code;
                  return (
                    <TouchableOpacity
                      key={code}
                      onPress={() => setSchoolCode(code)}
                      style={[
                        styles.themeChip,
                        {
                          borderColor: isCur ? theme.colors.primary : theme.colors.border,
                          backgroundColor: isCur ? theme.colors.accent : theme.colors.surface,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.themeChipText,
                          { color: isCur ? theme.colors.primary : theme.colors.textMuted },
                        ]}
                      >
                        {PRESET_SCHOOLS[code].shortName}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </Card.Body>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <Card.Header title="App Preferences" subtitle="Push alerts and privacy settings" />
          <Card.Body>
            <View style={styles.settingRow}>
              <View>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                  Emergency Circulars
                </Text>
                <Text style={[styles.settingSub, { color: theme.colors.textMuted }]}>
                  Instant push for critical campus announcements
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#CBD5E1', true: theme.colors.primary }}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

            <View style={styles.settingRow}>
              <View>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                  Attendance SMS Alerts
                </Text>
                <Text style={[styles.settingSub, { color: theme.colors.textMuted }]}>
                  Instant notification when roll call is finalized
                </Text>
              </View>
              <Switch
                value={attendanceAlerts}
                onValueChange={setAttendanceAlerts}
                trackColor={{ false: '#CBD5E1', true: theme.colors.primary }}
              />
            </View>
          </Card.Body>
        </Card>

        {/* Log Out Button */}
        <Button
          title="Sign Out of Campus"
          onPress={handleLogout}
          variant="danger"
          size="lg"
          icon="logout"
          style={styles.logoutButton}
        />

        {/* Company Attribution & Version Footer */}
        <View style={styles.brandingFooter}>
          <Text style={[styles.brandingTitle, { color: theme.colors.text }]}>
            CodeNCampus Unified OS
          </Text>
          <Text style={[styles.brandingCompany, { color: theme.colors.textMuted }]}>
            Developed by Codazk Technologies Private Limited
          </Text>
          <Text style={[styles.brandingCopy, { color: theme.colors.textMuted }]}>
            Version 1.0.0 • All rights reserved
          </Text>
        </View>
      </ScrollView>

      <RoleSwitcherModal
        visible={roleModalVisible}
        onClose={() => setRoleModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    padding: 20,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  userId: {
    fontSize: 12,
    marginBottom: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  contactDetails: {
    gap: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contactText: {
    fontSize: 13,
  },
  switchLink: {
    fontSize: 13,
    fontWeight: '700',
  },
  rolesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  roleChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  schoolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  schoolIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  schoolDetails: {
    flex: 1,
  },
  schoolTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  schoolMeta: {
    fontSize: 12,
  },
  themeSwitcher: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  themeLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  themeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  themeChip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  themeChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  settingSub: {
    fontSize: 12,
    maxWidth: 240,
  },
  logoutButton: {
    marginTop: 8,
  },
  brandingFooter: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
    paddingVertical: 12,
  },
  brandingTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  brandingCompany: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
  brandingCopy: {
    fontSize: 10,
    marginTop: 2,
  },
});

