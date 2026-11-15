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
import { useTheme } from '../../src/theme/ThemeProvider';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Header } from '../../src/components/common/Header';
import { RoleSwitcherModal } from '../../src/components/common/RoleSwitcherModal';
import { MetricCard } from '../../src/components/ui/MetricCard';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Button } from '../../src/components/ui/Button';
import { Icon } from '../../src/components/ui/Icon';
import { typography } from '../../src/theme/typography';

interface LeaveRequest {
  id: string;
  studentName: string;
  classSection: string;
  reason: string;
  dates: string;
  parentName: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function TeacherDashboard() {
  const theme = useTheme();
  const session = useAuthStore((s) => s.session);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'schedule' | 'attendance' | 'homework' | 'leaves'>('all');

  const teacherName = session?.user?.fullName || 'Educator';
  const readableId = session?.readableId || 'STF-042';

  // Section Attendance Status
  const [attendanceState, setAttendanceState] = useState<Record<string, { marked: boolean; present: number; total: number }>>({
    '10-A': { marked: true, present: 39, total: 42 },
    '10-B': { marked: false, present: 0, total: 38 },
    '11-A': { marked: false, present: 0, total: 38 },
  });

  // Parent Leave Requests
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: 'leave-1',
      studentName: 'Rohan Mehra',
      classSection: '10-A',
      reason: 'Viral Fever & Doctor Advised Rest',
      dates: 'Nov 14 - Nov 16 (3 Days)',
      parentName: 'Sunil Mehra (Father)',
      status: 'pending',
    },
    {
      id: 'leave-2',
      studentName: 'Priya Chawla',
      classSection: '10-A',
      reason: 'Attending Cousin Sister Marriage',
      dates: 'Nov 18 (1 Day)',
      parentName: 'Anita Chawla (Mother)',
      status: 'pending',
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const markQuickAttendance = (sec: string) => {
    setAttendanceState((prev) => ({
      ...prev,
      [sec]: {
        marked: true,
        present: prev[sec].total - 2, // e.g. 2 absent
        total: prev[sec].total,
      },
    }));
    Alert.alert(
      'Attendance Submitted',
      `Class ${sec} Roll Call saved! 2 students marked absent and SMS alerts sent to their parents.`,
      [{ text: 'OK' }]
    );
  };

  const handleLeaveAction = (id: string, action: 'approved' | 'rejected') => {
    setLeaveRequests((prev) =>
      prev.map((lr) => (lr.id === id ? { ...lr, status: action } : lr))
    );
    Alert.alert(
      action === 'approved' ? 'Leave Approved' : 'Leave Rejected',
      `Parent has been notified of the decision via SMS/Push.`
    );
  };

  const teachingSchedule = [
    {
      time: '08:30 - 09:15 AM',
      period: 'Period 1',
      classSection: 'Class 10-A',
      subject: 'Mathematics (Algebra)',
      topic: 'Quadratic Equations & Roots Formula',
      room: 'Room 302',
      status: 'completed',
    },
    {
      time: '10:20 - 11:05 AM',
      period: 'Period 3',
      classSection: 'Class 10-B',
      subject: 'Mathematics (Geometry)',
      topic: 'Circles & Tangents Theorem Proofs',
      room: 'Room 304',
      status: 'active',
    },
    {
      time: '12:30 - 01:15 PM',
      period: 'Period 5',
      classSection: 'Class 11-A',
      subject: 'Advanced Calculus',
      topic: 'Integration by Substitution Techniques',
      room: 'Lecture Hall 1',
      status: 'upcoming',
    },
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
            FACULTY & TEACHER CONSOLE
          </Text>
          <Text style={[styles.teacherName, { color: theme.colors.text }]}>
            {teacherName} 📚
          </Text>
          <View style={styles.badgeRow}>
            <View style={[styles.pillBadge, { backgroundColor: theme.colors.accent }]}>
              <Text style={[styles.pillBadgeText, { color: theme.colors.primary }]}>
                Mathematics Dept • Staff #{readableId}
              </Text>
            </View>
            <View style={[styles.pillBadge, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1 }]}>
              <Text style={[styles.pillBadgeText, { color: theme.colors.textMuted }]}>
                Class Teacher: 10-A
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Filter Navigation Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {[
            { id: 'all', label: 'Overview' },
            { id: 'schedule', label: "Today's Periods" },
            { id: 'attendance', label: 'Roll Call' },
            { id: 'homework', label: 'Homework Submissions' },
            { id: 'leaves', label: `Leave Slips (${leaveRequests.filter((l) => l.status === 'pending').length})` },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id as any)}
                activeOpacity={0.7}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                    borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    { color: isSelected ? '#FFFFFF' : theme.colors.text },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Teacher KPIs */}
        <View style={styles.metricsGrid}>
          <MetricCard
            label="Total Students"
            value="118"
            subtitle="Across 3 Assigned Batches"
            icon="users"
            trend="Active Cohort"
            trendType="neutral"
          />
          <MetricCard
            label="Attendance Done"
            value="1 / 3"
            subtitle="2 Sections Pending Today"
            icon="clock"
            trend="Action Required"
            trendType="negative"
          />
        </View>

        {/* Daily Attendance Roll Call System */}
        {(activeTab === 'all' || activeTab === 'attendance') && (
          <Card>
            <Card.Header
              title="Daily Attendance Roll Call"
              subtitle="Record morning presence for your assigned classes"
            />
            <Card.Body>
              {['10-A', '10-B', '11-A'].map((sec) => {
                const info = attendanceState[sec];
                return (
                  <View
                    key={sec}
                    style={[
                      styles.sectionItem,
                      { borderBottomColor: theme.colors.border },
                    ]}
                  >
                    <View style={styles.sectionLeft}>
                      <View
                        style={[
                          styles.classAvatar,
                          {
                            backgroundColor: info.marked
                              ? theme.colors.success + '20'
                              : theme.colors.warning + '20',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.classAvatarText,
                            {
                              color: info.marked ? theme.colors.success : theme.colors.warning,
                            },
                          ]}
                        >
                          {sec}
                        </Text>
                      </View>
                      <View>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                          Class {sec}
                        </Text>
                        <Text style={[styles.sectionSubtitle, { color: theme.colors.textMuted }]}>
                          {info.marked
                            ? `${info.present} of ${info.total} Students Present (${Math.round((info.present / info.total) * 100)}%)`
                            : `${info.total} Students awaiting attendance`}
                        </Text>
                      </View>
                    </View>

                    {info.marked ? (
                      <Badge label="Marked ✓" variant="success" size="sm" />
                    ) : (
                      <Button
                        title="Take Roll Call"
                        size="sm"
                        variant="primary"
                        onPress={() => markQuickAttendance(sec)}
                      />
                    )}
                  </View>
                );
              })}
            </Card.Body>
          </Card>
        )}

        {/* Teaching Schedule */}
        {(activeTab === 'all' || activeTab === 'schedule') && (
          <Card>
            <Card.Header
              title="Today's Teaching Schedule"
              subtitle="Thursday • 3 Lecture sessions"
            />
            <Card.Body>
              {teachingSchedule.map((slot, index) => {
                const isActive = slot.status === 'active';
                const isDone = slot.status === 'completed';

                return (
                  <View
                    key={index}
                    style={[
                      styles.slotItem,
                      { borderBottomColor: theme.colors.border },
                      isActive && { backgroundColor: theme.colors.accent + '25', borderRadius: 12, paddingHorizontal: 8 },
                      index === teachingSchedule.length - 1 && { borderBottomWidth: 0 },
                    ]}
                  >
                    <View
                      style={[
                        styles.timeBox,
                        {
                          backgroundColor: isActive ? theme.colors.primary : theme.colors.accent,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.slotPeriodText,
                          { color: isActive ? '#FFFFFF' : theme.colors.primary },
                        ]}
                      >
                        {slot.period}
                      </Text>
                      <Text
                        style={[
                          styles.slotTimeText,
                          { color: isActive ? '#FFFFFF' : theme.colors.textMuted },
                        ]}
                      >
                        {slot.time.split(' - ')[0]}
                      </Text>
                    </View>

                    <View style={styles.slotInfo}>
                      <View style={styles.slotTitleRow}>
                        <Text style={[styles.slotClass, { color: theme.colors.text }]}>
                          {slot.classSection} • {slot.subject}
                        </Text>
                        {isActive && <Badge label="In Progress" variant="success" size="sm" />}
                        {isDone && <Badge label="Finished" variant="neutral" size="sm" />}
                      </View>
                      <Text style={[styles.slotTopic, { color: theme.colors.textMuted }]}>
                        📖 {slot.topic}
                      </Text>
                      <Text style={[styles.slotRoom, { color: theme.colors.textMuted }]}>
                        📍 {slot.room}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </Card.Body>
          </Card>
        )}

        {/* Homework Submissions Manager */}
        {(activeTab === 'all' || activeTab === 'homework') && (
          <Card>
            <Card.Header
              title="Assigned Homework & Review"
              subtitle="Track student submission rates"
            />
            <Card.Body>
              {[
                {
                  title: 'Limits & Derivatives Problem Set',
                  classSection: 'Class 10-A',
                  submitted: 38,
                  total: 42,
                  due: 'Tomorrow, 5 PM',
                },
                {
                  title: 'Circle Theorems Worksheet #3',
                  classSection: 'Class 10-B',
                  submitted: 22,
                  total: 38,
                  due: 'Nov 18, 2026',
                },
              ].map((hw, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.hwReviewItem,
                    { borderBottomColor: theme.colors.border },
                    idx === 1 && { borderBottomWidth: 0 },
                  ]}
                >
                  <View style={styles.hwReviewHeader}>
                    <View>
                      <Text style={[styles.hwReviewTitle, { color: theme.colors.text }]}>
                        {hw.title}
                      </Text>
                      <Text style={[styles.hwReviewSub, { color: theme.colors.textMuted }]}>
                        {hw.classSection} • Due: {hw.due}
                      </Text>
                    </View>
                    <Badge
                      label={`${hw.submitted}/${hw.total} Submitted`}
                      variant={hw.submitted === hw.total ? 'success' : 'info'}
                      size="sm"
                    />
                  </View>
                  <View style={[styles.progressTrack, { backgroundColor: theme.colors.border, marginTop: 8 }]}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${Math.round((hw.submitted / hw.total) * 100)}%`,
                          backgroundColor: theme.colors.primary,
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </Card.Body>
          </Card>
        )}

        {/* Student Leave Slips from Parents */}
        {(activeTab === 'all' || activeTab === 'leaves') && (
          <Card>
            <Card.Header
              title="Parent Leave Slips"
              subtitle="Medical and personal leave requests"
              action={
                <Badge
                  label={`${leaveRequests.filter((l) => l.status === 'pending').length} Action`}
                  variant="warning"
                  size="sm"
                />
              }
            />
            <Card.Body>
              {leaveRequests.map((leave) => (
                <View
                  key={leave.id}
                  style={[
                    styles.leaveCard,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <View style={styles.leaveHeaderRow}>
                    <View>
                      <Text style={[styles.leaveStudent, { color: theme.colors.text }]}>
                        {leave.studentName} ({leave.classSection})
                      </Text>
                      <Text style={[styles.leaveParent, { color: theme.colors.textMuted }]}>
                        From: {leave.parentName}
                      </Text>
                    </View>
                    <Badge
                      label={leave.status.toUpperCase()}
                      variant={
                        leave.status === 'approved'
                          ? 'success'
                          : leave.status === 'rejected'
                          ? 'danger'
                          : 'warning'
                      }
                      size="sm"
                    />
                  </View>

                  <Text style={[styles.leaveReason, { color: theme.colors.text }]}>
                    Reason: {leave.reason}
                  </Text>
                  <Text style={[styles.leaveDates, { color: theme.colors.textMuted }]}>
                    📅 Duration: {leave.dates}
                  </Text>

                  {leave.status === 'pending' && (
                    <View style={styles.leaveActionsRow}>
                      <Button
                        title="Approve"
                        size="sm"
                        variant="primary"
                        onPress={() => handleLeaveAction(leave.id, 'approved')}
                        style={{ flex: 1, marginRight: 8 }}
                      />
                      <Button
                        title="Decline"
                        size="sm"
                        variant="outline"
                        onPress={() => handleLeaveAction(leave.id, 'rejected')}
                        style={{ flex: 1 }}
                      />
                    </View>
                  )}
                </View>
              ))}
            </Card.Body>
          </Card>
        )}
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
  teacherName: {
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
  chipsScroll: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    paddingVertical: 2,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: typography.sizes.subhead,
    fontWeight: typography.weights.semibold,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  sectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  classAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  classAvatarText: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.heavy,
  },
  sectionTitle: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
  },
  sectionSubtitle: {
    fontSize: typography.sizes.footnote,
    marginTop: 2,
  },
  slotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  timeBox: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 84,
    marginRight: 12,
  },
  slotPeriodText: {
    fontSize: typography.sizes.footnote,
    fontWeight: typography.weights.bold,
  },
  slotTimeText: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.medium,
    marginTop: 2,
  },
  slotInfo: {
    flex: 1,
  },
  slotTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  slotClass: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
  },
  slotTopic: {
    fontSize: typography.sizes.subhead,
    marginBottom: 2,
  },
  slotRoom: {
    fontSize: typography.sizes.footnote,
  },
  hwReviewItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  hwReviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hwReviewTitle: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
  },
  hwReviewSub: {
    fontSize: typography.sizes.footnote,
    marginTop: 2,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  leaveCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  leaveHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  leaveStudent: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
  },
  leaveParent: {
    fontSize: typography.sizes.footnote,
    marginTop: 1,
  },
  leaveReason: {
    fontSize: typography.sizes.footnote,
    lineHeight: 18,
    marginBottom: 4,
  },
  leaveDates: {
    fontSize: typography.sizes.caption,
    marginBottom: 8,
  },
  leaveActionsRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
});
