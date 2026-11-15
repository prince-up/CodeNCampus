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

interface HomeworkItem {
  id: string;
  title: string;
  subject: string;
  due: string;
  teacher: string;
  completed: boolean;
  urgent: boolean;
}

export default function StudentDashboard() {
  const theme = useTheme();
  const session = useAuthStore((s) => s.session);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'schedule' | 'homework' | 'exams'>('all');

  const studentName = session?.user?.fullName || 'Student';
  const readableId = session?.readableId || 'STU-00104';

  const [homeworkList, setHomeworkList] = useState<HomeworkItem[]>([
    {
      id: 'hw-1',
      title: 'Calculus Assignment: Limits & Derivatives',
      subject: 'Mathematics',
      due: 'Tomorrow, 5:00 PM',
      teacher: 'Dr. R. Verma',
      completed: false,
      urgent: true,
    },
    {
      id: 'hw-2',
      title: 'Ray Optics Lab Observation Write-up',
      subject: 'Physics',
      due: 'Nov 18, 2026',
      teacher: 'Mrs. S. Gupta',
      completed: false,
      urgent: false,
    },
    {
      id: 'hw-3',
      title: 'Binary Search Tree Code Implementation',
      subject: 'Computer Science',
      due: 'Nov 22, 2026',
      teacher: 'Mr. A. Mehta',
      completed: true,
      urgent: false,
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const toggleHomework = (id: string) => {
    setHomeworkList((prev) =>
      prev.map((hw) => (hw.id === id ? { ...hw, completed: !hw.completed } : hw))
    );
  };

  const scheduleToday = [
    {
      period: 'Period 1',
      time: '08:30 - 09:15 AM',
      subject: 'Mathematics',
      topic: 'Definite Integrals & Area under Curves',
      teacher: 'Dr. R. Verma',
      room: 'Room 302',
      status: 'completed',
    },
    {
      period: 'Period 2',
      time: '09:25 - 10:10 AM',
      subject: 'Physics',
      topic: 'Electromagnetic Induction & Faraday Laws',
      teacher: 'Mrs. S. Gupta',
      room: 'Physics Lab 1',
      status: 'active',
    },
    {
      period: 'Period 3',
      time: '10:20 - 11:05 AM',
      subject: 'Computer Science',
      topic: 'Relational Database Schema & SQL Joins',
      teacher: 'Mr. A. Mehta',
      room: 'Tech Lab 2',
      status: 'upcoming',
    },
    {
      period: 'Period 4',
      time: '11:45 - 12:30 PM',
      subject: 'English Core',
      topic: 'The Last Lesson - Analysis & Character Sketch',
      teacher: 'Ms. P. Sen',
      room: 'Room 302',
      status: 'upcoming',
    },
  ];

  const upcomingExams = [
    {
      subject: 'Mathematics',
      examName: 'Mid-Term Unit Evaluation',
      date: 'Monday, Nov 24, 2026',
      time: '09:00 AM - 12:00 PM',
      syllabus: 'Calculus, Vectors, Matrices (Ch 1 - 6)',
      maxMarks: 80,
    },
    {
      subject: 'Physics',
      examName: 'Mid-Term Unit Evaluation',
      date: 'Wednesday, Nov 26, 2026',
      time: '09:00 AM - 12:00 PM',
      syllabus: 'Electrostatics, Magnetism, Optics (Ch 1 - 5)',
      maxMarks: 70,
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
        {/* Welcome Greeting Section with Clean Typography */}
        <View style={styles.greetingSection}>
          <Text style={[styles.greetingSubtitle, { color: theme.colors.textMuted }]}>
            STUDENT PORTAL
          </Text>
          <Text style={[styles.studentName, { color: theme.colors.text }]}>
            {studentName} 🎓
          </Text>
          <View style={styles.badgeRow}>
            <View style={[styles.pillBadge, { backgroundColor: theme.colors.accent }]}>
              <Text style={[styles.pillBadgeText, { color: theme.colors.primary }]}>
                Class 10-A • Roll #14
              </Text>
            </View>
            <View style={[styles.pillBadge, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1 }]}>
              <Text style={[styles.pillBadgeText, { color: theme.colors.textMuted }]}>
                Adm ID: {readableId}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Filter Navigation Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {[
            { id: 'all', label: 'Overview' },
            { id: 'schedule', label: "Today's Classes" },
            { id: 'homework', label: 'Homework & Tasks' },
            { id: 'exams', label: 'Exams & Syllabus' },
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

        {/* Academic KPI Cards */}
        <View style={styles.metricsGrid}>
          <MetricCard
            label="Attendance"
            value="94.6%"
            subtitle="88 / 93 Days (Min 75% Req.)"
            icon="check-circle"
            trend="+1.2% this month"
            trendType="positive"
          />
          <MetricCard
            label="Current Rank"
            value="#3"
            subtitle="Grade A+ • Top 5% in 10-A"
            icon="award"
            trend="Academic Honor Roll"
            trendType="positive"
          />
        </View>

        {/* Attendance Safety Progress Bar */}
        <View style={[styles.attendanceBarCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={styles.attendanceBarHeader}>
            <Text style={[styles.attendanceBarTitle, { color: theme.colors.text }]}>
              Board Attendance Criteria
            </Text>
            <Text style={[styles.attendanceBarPercent, { color: theme.colors.success }]}>
              94.6% Safe
            </Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: theme.colors.border }]}>
            <View style={[styles.progressBar, { width: '94.6%', backgroundColor: theme.colors.success }]} />
          </View>
          <Text style={[styles.attendanceBarFootnote, { color: theme.colors.textMuted }]}>
            ✓ You need at least 75% attendance to be eligible for Final Board Examinations.
          </Text>
        </View>

        {/* Today's Timetable Section */}
        {(activeTab === 'all' || activeTab === 'schedule') && (
          <Card>
            <Card.Header
              title="Today's Timetable"
              subtitle="Thursday • 4 periods scheduled"
              action={<Badge label="Term 2 Active" variant="info" size="sm" />}
            />
            <Card.Body>
              {scheduleToday.map((item, index) => {
                const isActive = item.status === 'active';
                const isCompleted = item.status === 'completed';

                return (
                  <View
                    key={index}
                    style={[
                      styles.scheduleItem,
                      { borderBottomColor: theme.colors.border },
                      isActive && { backgroundColor: theme.colors.accent + '25', borderRadius: 12, paddingHorizontal: 8 },
                      index === scheduleToday.length - 1 && { borderBottomWidth: 0 },
                    ]}
                  >
                    <View
                      style={[
                        styles.periodBadge,
                        {
                          backgroundColor: isActive
                            ? theme.colors.primary
                            : isCompleted
                            ? theme.colors.surface
                            : theme.colors.accent,
                          borderColor: theme.colors.border,
                          borderWidth: isCompleted ? 1 : 0,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.periodText,
                          { color: isActive ? '#FFFFFF' : theme.colors.primary },
                        ]}
                      >
                        {item.period}
                      </Text>
                      <Text
                        style={[
                          styles.timeText,
                          { color: isActive ? '#FFFFFF' : theme.colors.textMuted },
                        ]}
                      >
                        {item.time.split(' - ')[0]}
                      </Text>
                    </View>

                    <View style={styles.scheduleDetails}>
                      <View style={styles.subjectRow}>
                        <Text style={[styles.subjectName, { color: theme.colors.text }]}>
                          {item.subject}
                        </Text>
                        {isActive && <Badge label="Active Now" variant="success" size="sm" />}
                        {isCompleted && <Badge label="Done" variant="neutral" size="sm" />}
                      </View>
                      <Text style={[styles.topicText, { color: theme.colors.textMuted }]} numberOfLines={1}>
                        📖 {item.topic}
                      </Text>
                      <Text style={[styles.teacherName, { color: theme.colors.textMuted }]}>
                        {item.teacher} • {item.room}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </Card.Body>
          </Card>
        )}

        {/* Homework & Tasks Section with Interactive Checkboxes */}
        {(activeTab === 'all' || activeTab === 'homework') && (
          <Card>
            <Card.Header
              title="Homework & Assignments"
              subtitle={`${homeworkList.filter((h) => !h.completed).length} pending submissions`}
            />
            <Card.Body>
              {homeworkList.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  onPress={() => toggleHomework(task.id)}
                  activeOpacity={0.8}
                  style={[
                    styles.taskItem,
                    { borderBottomColor: theme.colors.border },
                    task.completed && { opacity: 0.6 },
                  ]}
                >
                  <View style={styles.taskLeft}>
                    <TouchableOpacity
                      onPress={() => toggleHomework(task.id)}
                      style={[
                        styles.checkbox,
                        {
                          borderColor: task.completed ? theme.colors.success : theme.colors.border,
                          backgroundColor: task.completed ? theme.colors.success : 'transparent',
                        },
                      ]}
                    >
                      {task.completed && <Icon name="check-circle" size={14} color="#FFFFFF" />}
                    </TouchableOpacity>

                    <View style={styles.taskInfo}>
                      <Text
                        style={[
                          styles.taskTitle,
                          {
                            color: theme.colors.text,
                            textDecorationLine: task.completed ? 'line-through' : 'none',
                          },
                        ]}
                      >
                        {task.title}
                      </Text>
                      <Text style={[styles.taskSubject, { color: theme.colors.textMuted }]}>
                        {task.subject} • {task.teacher}
                      </Text>
                      <Text
                        style={[
                          styles.taskDue,
                          { color: task.urgent && !task.completed ? theme.colors.danger : theme.colors.textMuted },
                        ]}
                      >
                        ⏰ Due: {task.due}
                      </Text>
                    </View>
                  </View>

                  {task.urgent && !task.completed && (
                    <Badge label="Urgent" variant="danger" size="sm" />
                  )}
                  {task.completed && (
                    <Badge label="Submitted" variant="success" size="sm" />
                  )}
                </TouchableOpacity>
              ))}
            </Card.Body>
          </Card>
        )}

        {/* Upcoming Examinations Card */}
        {(activeTab === 'all' || activeTab === 'exams') && (
          <Card>
            <Card.Header
              title="Upcoming Examinations"
              subtitle="Term 2 Board Mock Assessments"
              action={<Badge label="Schedule Out" variant="warning" size="sm" />}
            />
            <Card.Body>
              {upcomingExams.map((exam, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.examCard,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                    idx < upcomingExams.length - 1 && { marginBottom: 12 },
                  ]}
                >
                  <View style={styles.examHeader}>
                    <Text style={[styles.examSubject, { color: theme.colors.primary }]}>
                      {exam.subject}
                    </Text>
                    <Badge label={`Max ${exam.maxMarks} Marks`} variant="neutral" size="sm" />
                  </View>
                  <Text style={[styles.examName, { color: theme.colors.text }]}>
                    {exam.examName}
                  </Text>
                  <Text style={[styles.examDateTime, { color: theme.colors.textMuted }]}>
                    📅 {exam.date} • 🕒 {exam.time}
                  </Text>
                  <View style={[styles.syllabusBox, { backgroundColor: theme.colors.accent + '20' }]}>
                    <Text style={[styles.syllabusLabel, { color: theme.colors.textMuted }]}>
                      Syllabus:
                    </Text>
                    <Text style={[styles.syllabusText, { color: theme.colors.text }]}>
                      {exam.syllabus}
                    </Text>
                  </View>
                </View>
              ))}
            </Card.Body>
          </Card>
        )}

        {/* School Fee Clearance Status */}
        <Card>
          <Card.Header
            title="School Fee Clearance"
            subtitle="Academic Session 2026-2027"
          />
          <Card.Body>
            <View style={[styles.feeStatusCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <View style={styles.feeStatusLeft}>
                <View style={[styles.feeStatusIcon, { backgroundColor: theme.colors.success + '20' }]}>
                  <Icon name="check-circle" size={20} color={theme.colors.success} />
                </View>
                <View>
                  <Text style={[styles.feeStatusTitle, { color: theme.colors.text }]}>
                    Term 2 Fee: Cleared
                  </Text>
                  <Text style={[styles.feeStatusSubtitle, { color: theme.colors.textMuted }]}>
                    Paid ₹32,500 • Receipt #DPS-REC-4821
                  </Text>
                </View>
              </View>
              <Button
                title="Receipt"
                variant="outline"
                size="sm"
                onPress={() => Alert.alert('Fee Receipt', 'Receipt #DPS-REC-4821 downloaded to your device.')}
              />
            </View>
          </Card.Body>
        </Card>

        {/* Official Campus Notices */}
        <Card>
          <Card.Header
            title="Campus Notice Board"
            subtitle="Official circulars from administration"
          />
          <Card.Body>
            <View style={styles.noticeItem}>
              <View style={[styles.noticeDot, { backgroundColor: theme.colors.primary }]} />
              <View style={styles.noticeContent}>
                <View style={styles.noticeTitleRow}>
                  <Text style={[styles.noticeTitle, { color: theme.colors.text }]}>
                    Inter-School Robotics Championship 2026
                  </Text>
                  <Badge label="New" variant="primary" size="sm" />
                </View>
                <Text style={[styles.noticeText, { color: theme.colors.textMuted }]}>
                  Registrations are now open for Senior secondary students (Class 9-12). Visit the Tech Lab by Friday to register your team.
                </Text>
              </View>
            </View>
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
  studentName: {
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
  attendanceBarCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
  },
  attendanceBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  attendanceBarTitle: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
  },
  attendanceBarPercent: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.heavy,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  attendanceBarFootnote: {
    fontSize: typography.sizes.footnote,
    lineHeight: typography.lineHeights.footnote,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  periodBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 84,
    marginRight: 12,
  },
  periodText: {
    fontSize: typography.sizes.footnote,
    fontWeight: typography.weights.bold,
  },
  timeText: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.medium,
    marginTop: 2,
  },
  scheduleDetails: {
    flex: 1,
  },
  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  subjectName: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
  },
  topicText: {
    fontSize: typography.sizes.subhead,
    marginBottom: 2,
  },
  teacherName: {
    fontSize: typography.sizes.footnote,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.body,
  },
  taskSubject: {
    fontSize: typography.sizes.footnote,
    marginTop: 2,
  },
  taskDue: {
    fontSize: typography.sizes.footnote,
    fontWeight: typography.weights.medium,
    marginTop: 2,
  },
  examCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  examSubject: {
    fontSize: typography.sizes.subhead,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
  },
  examName: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    marginBottom: 4,
  },
  examDateTime: {
    fontSize: typography.sizes.footnote,
    marginBottom: 8,
  },
  syllabusBox: {
    padding: 8,
    borderRadius: 8,
  },
  syllabusLabel: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
  },
  syllabusText: {
    fontSize: typography.sizes.footnote,
    marginTop: 2,
  },
  feeStatusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  feeStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  feeStatusIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  feeStatusTitle: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
  },
  feeStatusSubtitle: {
    fontSize: typography.sizes.footnote,
    marginTop: 2,
  },
  noticeItem: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  noticeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 12,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  noticeTitle: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    flex: 1,
    marginRight: 8,
  },
  noticeText: {
    fontSize: typography.sizes.footnote,
    lineHeight: 18,
  },
});
