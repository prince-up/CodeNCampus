import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '@codencampus/types';
import { Icon, IconName } from '../ui/Icon';
import { Badge } from '../ui/Badge';

interface RoleSwitcherModalProps {
  visible: boolean;
  onClose: () => void;
}

const ROLE_METADATA: Record<UserRole, { label: string; icon: IconName; desc: string }> = {
  STUDENT: {
    label: 'Student',
    icon: 'book',
    desc: 'Timetable, attendance & assignments',
  },
  PARENT: {
    label: 'Parent',
    icon: 'home',
    desc: 'Multi-child tracker, fees & notices',
  },
  TEACHER: {
    label: 'Teacher',
    icon: 'briefcase',
    desc: 'Attendance marking & assessments',
  },
  SCHOOL_ADMIN: {
    label: 'School Admin',
    icon: 'shield',
    desc: 'Institutional control & student rosters',
  },
  PRINCIPAL: {
    label: 'Principal',
    icon: 'award',
    desc: 'Academic oversight & institutional reports',
  },
  STAFF: {
    label: 'Staff Member',
    icon: 'user',
    desc: 'Campus operations & maintenance',
  },
  SUPER_ADMIN: {
    label: 'System Admin',
    icon: 'settings',
    desc: 'Multi-tenant infrastructure access',
  },
};

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  visible,
  onClose,
}) => {
  const theme = useTheme();
  const session = useAuthStore((s) => s.session);
  const switchRole = useAuthStore((s) => s.switchRole);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (!session) return null;

  const activeRole = session.activeRole;
  const availableRoles = session.availableRoles || [activeRole];

  const handleSelectRole = async (role: UserRole) => {
    if (role === activeRole) {
      onClose();
      return;
    }
    const success = await switchRole(role);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <View style={styles.header}>
                <View>
                  <Text style={[styles.title, { color: theme.colors.text }]}>
                    Switch Active Persona
                  </Text>
                  <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
                    You hold multiple verified credentials on campus
                  </Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Icon name="close" size={18} color={theme.colors.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={styles.rolesList}>
                {availableRoles.map((role) => {
                  const meta = ROLE_METADATA[role] || {
                    label: role,
                    icon: 'user',
                    desc: 'Campus Portal Role',
                  };
                  const isCurrent = role === activeRole;

                  return (
                    <TouchableOpacity
                      key={role}
                      onPress={() => handleSelectRole(role)}
                      disabled={isLoading}
                      style={[
                        styles.roleCard,
                        {
                          borderColor: isCurrent
                            ? theme.colors.primary
                            : theme.colors.border,
                          backgroundColor: isCurrent
                            ? theme.colors.accent
                            : theme.colors.card,
                        },
                      ]}
                      activeOpacity={0.8}
                    >
                      <View
                        style={[
                          styles.iconWrapper,
                          {
                            backgroundColor: isCurrent
                              ? theme.colors.primary
                              : '#F1F5F9',
                          },
                        ]}
                      >
                        <Icon
                          name={meta.icon}
                          size={18}
                          color={isCurrent ? '#FFFFFF' : '#475569'}
                        />
                      </View>

                      <View style={styles.roleInfo}>
                        <View style={styles.nameRow}>
                          <Text
                            style={[
                              styles.roleLabel,
                              {
                                color: isCurrent
                                  ? theme.colors.primary
                                  : theme.colors.text,
                              },
                            ]}
                          >
                            {meta.label}
                          </Text>
                          {isCurrent && <Badge label="Active" variant="primary" size="sm" />}
                        </View>
                        <Text
                          style={[
                            styles.roleDesc,
                            { color: theme.colors.textMuted },
                          ]}
                        >
                          {meta.desc}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  rolesList: {
    gap: 12,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  roleInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  roleLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  roleDesc: {
    fontSize: 12,
  },
});

