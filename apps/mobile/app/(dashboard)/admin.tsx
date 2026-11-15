import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Header } from '../../src/components/common/Header';
import { RoleSwitcherModal } from '../../src/components/common/RoleSwitcherModal';
import { MetricCard } from '../../src/components/ui/MetricCard';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Button } from '../../src/components/ui/Button';
import { Icon, IconName } from '../../src/components/ui/Icon';
import { typography } from '../../src/theme/typography';

export default function AdminDashboard() {
  const router = useRouter();
  const theme = useTheme();
  const session = useAuthStore((s) => s.session);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [remindersSent, setRemindersSent] = useState(false);

  const adminName = session?.user?.fullName || 'Administrator';
  const activeRole = session?.activeRole || 'SCHOOL_ADMIN';

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleAction = (label: string) => {
    if (label === 'Directory') {
      router.push('/(dashboard)/students' as any);
    } else if (label === 'Class Roster') {
      router.push('/(dashboard)/classes' as any);
    } else if (label === 'Fee Desk') {
      Alert.alert(
        'Fee Ledger Desk',
        'Fee Collection: ₹1,62,45,000 (87.5%)\nOutstanding: ₹23,15,000 across 48 students.',
        [
          { text: 'Close' },
          {
            text: 'Send SMS Reminders',
            onPress: () => {
              setRemindersSent(true);
              Alert.alert('Reminders Sent', 'Automated fee reminder SMS and push notifications delivered to 48 parents.');
            },
          },
        ]
      );
    } else {
      Alert.alert(
        'Campus Emergency Circular',
        'Send an instant notification & SMS to all parents, teachers, and staff members?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Send Broadcast',
            onPress: () => Alert.alert('Broadcast Sent', 'Circular #CIR-2026-89 dispatched to 2,450 guardians and 148 staff.'),
          },
        ]
      );
    }
  };

  const quickActions: Array<{ label: string; icon: IconName; desc: string }> = [
    { label: 'Directory', icon: 'users', desc: 'Student Admissions' },
    { label: 'Class Roster', icon: 'school', desc: 'Classes & Sections' },
    { label: 'Fee Desk', icon: 'dollar', desc: 'Collection & Audit' },
    { label: 'Broadcast', icon: 'bell', desc: 'SMS & Circulars' },
  ];

  const auditEvents = [
    { title: 'Class 10-A Attendance Finalized (39/42 Present)', time: '8 mins ago', user: 'Dr. R. Verma' },
    { title: 'Online Fee Payment Confirmed (₹32,500)', time: '18 mins ago', user: 'Mr. Rajesh Sharma (PAR-0089)' },
    { title: 'New Student Admission Enrolled (DPS-STU-00341)', time: '42 mins ago', user: 'Admissions Office' },
    { title: 'Bus Route 14 Departure Confirmed', time: '1 hr ago', user: 'Transport Desk' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface }]}>
      <Header onOpenRoleModal={() => setRoleModalVisible(true)} />

      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Welcome Section */}
        <View style={styles.greetingSection}>
          <Text style={[styles.greetingSubtitle, { color: theme.colors.textMuted }]}>
            ADMINISTRATION & MANAGEMENT CONSOLE
          </Text>
          <Text style={[styles.adminName, { color: theme.colors.text }]}>
            {adminName} 🏛️
          </Text>
          <View style={styles.badgeRow}>
            <View style={[styles.pillBadge, { backgroundColor: theme.colors.accent }]}>
              <Text style={[styles.pillBadgeText, { color: theme.colors.primary }]}>
                Executive Principal Desk
              </Text>
            </View>
            <View style={[styles.pillBadge, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1 }]}>
              <Text style={[styles.pillBadgeText, { color: theme.colors.textMuted }]}>
                {theme.shortName}
              </Text>
            </View>
          </View>
        </View>

        {/* School-Wide KPIs */}
        <View style={styles.metricsGrid}>
          <MetricCard
            label="Total Enrolled"
            value="2,450"
            subtitle="Nursery to Grade 12"
            icon="users"
            trend="+38 this term"
            trendType="positive"
          />
          <MetricCard
            label="Today's Attendance"
            value="95.4%"
            subtitle="2,337 / 2,450 Present"
            icon="check-circle"
            trend="High Attendance"
            trendType="positive"
          />
        </View>

        <View style={styles.metricsGrid}>
          <MetricCard
            label="Faculty on Duty"
            value="142 / 148"
            subtitle="6 on Approved Leave"
            icon="briefcase"
            trend="Active Today"
            trendType="neutral"
          />
          <MetricCard
            label="Fee Recovery"
            value="87.5%"
            subtitle="₹1.62 Cr / ₹1.85 Cr"
            icon="dollar"
            trend="₹23L Due"
            trendType={remindersSent ? 'positive' : 'negative'}
          />
        </View>

        {/* Quick Management Navigation Grid */}
        <Card>
          <Card.Header
            title="Core Academic Workflows"
            subtitle="Instant access to operational modules"
          />
          <Card.Body>
            <View style={styles.actionsGrid}>
              {quickActions.map((action, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleAction(action.label)}
                  activeOpacity={0.7}
                  style={[
                    styles.actionCard,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <View style={[styles.actionIconBox, { backgroundColor: theme.colors.accent }]}>
                    <Icon name={action.icon} size={22} color={theme.colors.primary} />
                  </View>
                  <Text style={[styles.actionTitle, { color: theme.colors.text }]}>
                    {action.label}
                  </Text>
                  <Text style={[styles.actionDesc, { color: theme.colors.textMuted }]}>
                    {action.desc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card.Body>
        </Card>

        {/* School Fee Collection Progress Tracker */}
        <Card>
          <Card.Header
            title="Term 2 Fee Collection Desk"
            subtitle="Academic Financial Year 2026-2027"
            action={<Badge label="Target: ₹1.85 Cr" variant="neutral" size="sm" />}
          />
          <Card.Body>
            <View style={styles.feeProgressInfo}>
              <View>
                <Text style={[styles.feeCollectedAmount, { color: theme.colors.text }]}>
                  ₹1,62,45,000
                </Text>
                <Text style={[styles.feeCollectedSub, { color: theme.colors.success }]}>
                  ✓ Collected (87.5% of total billed)
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.feeDueAmount, { color: theme.colors.danger }]}>
                  ₹23,15,000
                </Text>
                <Text style={[styles.feeCollectedSub, { color: theme.colors.textMuted }]}>
                  Outstanding (48 Students)
                </Text>
              </View>
            </View>

            <View style={[styles.feeTrack, { backgroundColor: theme.colors.border }]}>
              <View style={[styles.feeBar, { width: '87.5%', backgroundColor: theme.colors.primary }]} />
            </View>

            <View style={styles.feeReminderActionRow}>
              <Button
                title={remindersSent ? 'Reminders Sent ✓' : 'Send Due Reminders (SMS)'}
                variant={remindersSent ? 'outline' : 'primary'}
                size="sm"
                onPress={() => {
                  setRemindersSent(true);
                  Alert.alert('Fee Reminders Dispatched', 'SMS reminders sent to 48 parent phone numbers.');
                }}
              />
            </View>
          </Card.Body>
        </Card>

        {/* Real-Time Institution Activity Log */}
        <Card>
          <Card.Header
            title="Real-Time Campus Audit Log"
            subtitle="Live feed of academic & operational activities"
          />
          <Card.Body>
            {auditEvents.map((event, idx) => (
              <View
                key={idx}
                style={[
                  styles.auditItem,
                  { borderBottomColor: theme.colors.border },
                  idx === auditEvents.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={[styles.auditDot, { backgroundColor: theme.colors.primary }]} />
                <View style={styles.auditContent}>
                  <Text style={[styles.auditTitle, { color: theme.colors.text }]}>
                    {event.title}
                  </Text>
                  <Text style={[styles.auditMeta, { color: theme.colors.textMuted }]}>
                    {event.time} • By: {event.user}
                  </Text>
                </View>
              </View>
            ))}
          </Card.Body>
        </Card>
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
  greetingSection: {
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  greetingSubtitle: {
    fontSize: typography.sizes.footnote,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  adminName: {
    fontSize: typography.sizes.title1,
    lineHeight: typography.lineHeights.title1,
    fontWeight: typography.weights.heavy,
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pillBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  pillBadgeText: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    textAlign: 'center',
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
  },
  actionDesc: {
    fontSize: typography.sizes.caption,
    textAlign: 'center',
    marginTop: 2,
  },
  feeProgressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  feeCollectedAmount: {
    fontSize: typography.sizes.title2,
    fontWeight: typography.weights.heavy,
  },
  feeDueAmount: {
    fontSize: typography.sizes.title2,
    fontWeight: typography.weights.heavy,
  },
  feeCollectedSub: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.semibold,
    marginTop: 2,
  },
  feeTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  feeBar: {
    height: '100%',
    borderRadius: 4,
  },
  feeReminderActionRow: {
    alignItems: 'flex-end',
  },
  auditItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  auditDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  auditContent: {
    flex: 1,
  },
  auditTitle: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
  },
  auditMeta: {
    fontSize: typography.sizes.footnote,
    marginTop: 2,
  },
});
