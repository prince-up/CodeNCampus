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
import { LinkedStudentDTO } from '@codencampus/types';

export default function ParentDashboard() {
  const theme = useTheme();
  const session = useAuthStore((s) => s.session);
  const selectedChildId = useAuthStore((s) => s.selectedChildId);
  const setSelectedChildId = useAuthStore((s) => s.setSelectedChildId);

  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [feePaid, setFeePaid] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'attendance' | 'fees' | 'bus' | 'grades'>('all');

  const fallbackChildren: LinkedStudentDTO[] = [
    {
      studentProfileId: 'stu-1',
      studentUserId: 'user-stu-1',
      studentName: 'Aarav Sharma',
      readableId: 'DPS-STU-00104',
      admissionNumber: 'ADM/2022/104',
      relationType: 'FATHER',
      isPrimaryContact: true,
      canPickup: true,
      schoolId: session?.activeSchoolId || 'sch-1',
    },
    {
      studentProfileId: 'stu-2',
      studentUserId: 'user-stu-2',
      studentName: 'Ananya Sharma',
      readableId: 'DPS-STU-00218',
      admissionNumber: 'ADM/2024/218',
      relationType: 'FATHER',
      isPrimaryContact: true,
      canPickup: true,
      schoolId: session?.activeSchoolId || 'sch-1',
    },
  ];

  const linkedChildren = session?.linkedStudents?.length
    ? session.linkedStudents
    : fallbackChildren;

  const activeChild =
    linkedChildren.find((c) => c.studentProfileId === selectedChildId) ||
    linkedChildren[0];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const handlePayFee = () => {
    Alert.alert(
      'Online Payment Gateway',
      'Pay ₹32,500 via UPI / NetBanking / Debit Card?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay via UPI',
          onPress: () => {
            setFeePaid(true);
            Alert.alert('Payment Successful! 🎉', 'Transaction ID: TXN_8923019. Fee receipt has been saved and sent to your email.');
          },
        },
      ]
    );
  };

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
            PARENT & GUARDIAN PORTAL
          </Text>
          <Text style={[styles.parentName, { color: theme.colors.text }]}>
            {session?.user?.fullName || 'Mr. Rajesh Sharma'} 🏡
          </Text>
          <Text style={[styles.metaText, { color: theme.colors.textMuted }]}>
            Guardian ID: {session?.readableId || 'PAR-0089'} • Verified Primary Contact
          </Text>
        </View>

        {/* Multi-Child Switcher Tabs */}
        <View style={styles.childrenSection}>
          <Text style={[styles.sectionHeading, { color: theme.colors.textMuted }]}>
            SELECT STUDENT:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.childrenList}>
            {linkedChildren.map((child) => {
              const isSelected = child.studentProfileId === activeChild.studentProfileId;
              const isFirst = child.studentProfileId === 'stu-1';
              return (
                <TouchableOpacity
                  key={child.studentProfileId}
                  onPress={() => setSelectedChildId(child.studentProfileId)}
                  activeOpacity={0.8}
                  style={[
                    styles.childCard,
                    {
                      backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                    },
                  ]}
                >
                  <View style={[styles.childAvatar, { backgroundColor: isSelected ? '#FFFFFF' : theme.colors.accent }]}>
                    <Text style={[styles.childAvatarText, { color: theme.colors.primary }]}>
                      {child.studentName.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.childInfo}>
                    <Text
                      style={[
                        styles.childName,
                        { color: isSelected ? '#FFFFFF' : theme.colors.text },
                      ]}
                      numberOfLines={1}
                    >
                      {child.studentName}
                    </Text>
                    <Text
                      style={[
                        styles.childClass,
                        { color: isSelected ? 'rgba(255,255,255,0.85)' : theme.colors.textMuted },
                      ]}
                    >
                      {isFirst ? 'Class 10-A • Roll #14' : 'Class 6-B • Roll #08'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Quick Filter Navigation Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {[
            { id: 'all', label: 'All Updates' },
            { id: 'attendance', label: 'Daily Attendance' },
            { id: 'bus', label: 'School Bus GPS' },
            { id: 'fees', label: 'School Fees' },
            { id: 'grades', label: 'Report Card' },
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

        {/* Child Academic & Attendance Status KPIs */}
        <View style={styles.metricsGrid}>
          <MetricCard
            label="Attendance"
            value="94.6%"
            subtitle="88 / 93 Days Present"
            icon="check-circle"
            trend="Regular & Punctual"
            trendType="positive"
          />
          <MetricCard
            label="Term 1 Result"
            value="91.4%"
            subtitle="Grade A1 • Rank #3"
            icon="award"
            trend="Exemplary"
            trendType="positive"
          />
        </View>

        {/* Today's Live Attendance Card */}
        {(activeTab === 'all' || activeTab === 'attendance') && (
          <Card>
            <Card.Header
              title="Today's Attendance Status"
              subtitle={`Live record for ${activeChild.studentName}`}
            />
            <Card.Body>
              <View style={[styles.statusBox, { backgroundColor: theme.colors.success + '15', borderColor: theme.colors.success }]}>
                <View style={[styles.statusIconBox, { backgroundColor: theme.colors.success }]}>
                  <Icon name="check-circle" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.statusTextBox}>
                  <Text style={[styles.statusMain, { color: theme.colors.text }]}>
                    Marked PRESENT Today
                  </Text>
                  <Text style={[styles.statusSub, { color: theme.colors.textMuted }]}>
                    Clocked in at 08:14 AM via Biometric Entry (Main Gate 1)
                  </Text>
                </View>
              </View>
            </Card.Body>
          </Card>
        )}

        {/* School Bus GPS Tracking */}
        {(activeTab === 'all' || activeTab === 'bus') && (
          <Card>
            <Card.Header
              title="School Bus Live GPS"
              subtitle="Route #14 • Morning & Evening Pickup"
              action={<Badge label="Live GPS" variant="success" size="sm" />}
            />
            <Card.Body>
              <View style={[styles.busCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <View style={styles.busHeaderRow}>
                  <View style={styles.busLeft}>
                    <Text style={[styles.busRoute, { color: theme.colors.text }]}>
                      Bus No. DL-01-AB-4892 (Route 14)
                    </Text>
                    <Text style={[styles.busDriver, { color: theme.colors.textMuted }]}>
                      Driver: Rajeshwar Singh (+91 98765 43210)
                    </Text>
                  </View>
                  <Badge label="En Route" variant="info" size="sm" />
                </View>

                <View style={[styles.busStatusBanner, { backgroundColor: theme.colors.accent + '30' }]}>
                  <Icon name="bus" size={16} color={theme.colors.primary} />
                  <Text style={[styles.busStatusText, { color: theme.colors.primary }]}>
                    Current Location: Sector 18 Crossing • 12 mins from Home Stop
                  </Text>
                </View>

                <View style={styles.busActionsRow}>
                  <Button
                    title="Call Driver"
                    size="sm"
                    variant="outline"
                    onPress={() => Alert.alert('Call Driver', 'Connecting to Bus Driver: +91 98765 43210')}
                    style={{ flex: 1, marginRight: 8 }}
                  />
                  <Button
                    title="View Route Map"
                    size="sm"
                    variant="primary"
                    onPress={() => Alert.alert('Live Map', 'GPS coordinates: 28.5355° N, 77.3910° E. Bus is moving at 32 km/h.')}
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            </Card.Body>
          </Card>
        )}

        {/* School Fees Ledger & Online Payment */}
        {(activeTab === 'all' || activeTab === 'fees') && (
          <Card>
            <Card.Header
              title="Fee Desk & Dues"
              subtitle="Session 2026-2027 • Term 2 Invoice"
            />
            <Card.Body>
              <View
                style={[
                  styles.feeCard,
                  {
                    backgroundColor: feePaid ? theme.colors.success + '10' : theme.colors.surface,
                    borderColor: feePaid ? theme.colors.success : theme.colors.border,
                  },
                ]}
              >
                <View style={styles.feeTopRow}>
                  <View>
                    <Text style={[styles.feeTitle, { color: theme.colors.text }]}>
                      Term 2 Tuition, Lab & Transport
                    </Text>
                    <Text style={[styles.feeDue, { color: theme.colors.textMuted }]}>
                      Due Date: Nov 25, 2026
                    </Text>
                  </View>
                  <Text style={[styles.feeAmount, { color: theme.colors.text }]}>
                    ₹32,500
                  </Text>
                </View>

                <View style={styles.feeDivider} />

                {feePaid ? (
                  <View style={styles.feeSuccessRow}>
                    <Badge label="PAID ONLINE ✓" variant="success" size="md" />
                    <Button
                      title="Download Receipt"
                      variant="outline"
                      size="sm"
                      onPress={() => Alert.alert('Receipt', 'PDF receipt saved to downloads.')}
                    />
                  </View>
                ) : (
                  <View style={styles.feeActionRow}>
                    <View>
                      <Text style={[styles.feeBreakdown, { color: theme.colors.textMuted }]}>
                        Tuition: ₹24,000 | Transport: ₹8,500
                      </Text>
                    </View>
                    <Button
                      title="Pay Now (₹32,500)"
                      variant="primary"
                      size="sm"
                      onPress={handlePayFee}
                    />
                  </View>
                )}
              </View>
            </Card.Body>
          </Card>
        )}

        {/* Academic Performance Report */}
        {(activeTab === 'all' || activeTab === 'grades') && (
          <Card>
            <Card.Header
              title="Term 1 Examination Grades"
              subtitle="Official Marksheet & Teacher Remarks"
              action={<Badge label="Grade A1" variant="success" size="sm" />}
            />
            <Card.Body>
              {[
                { subject: 'Mathematics', marks: '96 / 100', grade: 'A1' },
                { subject: 'Physics', marks: '88 / 100', grade: 'A2' },
                { subject: 'Computer Science', marks: '98 / 100', grade: 'A1' },
                { subject: 'English Core', marks: '84 / 100', grade: 'A2' },
              ].map((sub, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.gradeRow,
                    { borderBottomColor: theme.colors.border },
                    idx === 3 && { borderBottomWidth: 0 },
                  ]}
                >
                  <Text style={[styles.gradeSubject, { color: theme.colors.text }]}>
                    {sub.subject}
                  </Text>
                  <View style={styles.gradeRight}>
                    <Text style={[styles.gradeMarks, { color: theme.colors.text }]}>
                      {sub.marks}
                    </Text>
                    <Badge label={sub.grade} variant="primary" size="sm" />
                  </View>
                </View>
              ))}

              <View style={[styles.teacherRemarkBox, { backgroundColor: theme.colors.accent + '20' }]}>
                <Text style={[styles.teacherRemarkTitle, { color: theme.colors.primary }]}>
                  Class Teacher Remark:
                </Text>
                <Text style={[styles.teacherRemarkText, { color: theme.colors.text }]}>
                  "Aarav shows exceptional aptitude in analytical problem solving and maintains exemplary classroom discipline." — Dr. R. Verma
                </Text>
              </View>
            </Card.Body>
          </Card>
        )}

        {/* Direct Contact with Class Teacher */}
        <Card>
          <Card.Header
            title="Class Teacher Communication"
            subtitle="Reach out for academic assistance"
          />
          <Card.Body>
            <View style={styles.teacherContactRow}>
              <View style={[styles.teacherAvatar, { backgroundColor: theme.colors.accent }]}>
                <Text style={[styles.teacherAvatarText, { color: theme.colors.primary }]}>
                  RV
                </Text>
              </View>
              <View style={styles.teacherInfo}>
                <Text style={[styles.teacherName, { color: theme.colors.text }]}>
                  Dr. R. Verma
                </Text>
                <Text style={[styles.teacherSub, { color: theme.colors.textMuted }]}>
                  Class Teacher 10-A • Available 02:00 PM - 04:00 PM
                </Text>
              </View>
              <Button
                title="Message"
                size="sm"
                variant="outline"
                onPress={() => Alert.alert('Teacher Communication', 'Message sent to Dr. R. Verma. Expected response time: 2 hours.')}
              />
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
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  greetingSubtitle: {
    fontSize: typography.sizes.footnote,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  parentName: {
    fontSize: typography.sizes.title1,
    lineHeight: typography.lineHeights.title1,
    fontWeight: typography.weights.heavy,
    marginBottom: 4,
  },
  metaText: {
    fontSize: typography.sizes.footnote,
  },
  childrenSection: {
    marginBottom: 14,
  },
  sectionHeading: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  childrenList: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 2,
  },
  childCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    minWidth: 180,
  },
  childAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  childAvatarText: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.heavy,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
  },
  childClass: {
    fontSize: typography.sizes.caption,
    marginTop: 2,
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
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statusTextBox: {
    flex: 1,
  },
  statusMain: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
  },
  statusSub: {
    fontSize: typography.sizes.footnote,
    marginTop: 2,
  },
  busCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  busHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  busLeft: {
    flex: 1,
    marginRight: 8,
  },
  busRoute: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
  },
  busDriver: {
    fontSize: typography.sizes.footnote,
    marginTop: 2,
  },
  busStatusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    gap: 8,
  },
  busStatusText: {
    fontSize: typography.sizes.footnote,
    fontWeight: typography.weights.medium,
    flex: 1,
  },
  busActionsRow: {
    flexDirection: 'row',
  },
  feeCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  feeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  feeTitle: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
  },
  feeDue: {
    fontSize: typography.sizes.footnote,
    marginTop: 2,
  },
  feeAmount: {
    fontSize: typography.sizes.title2,
    fontWeight: typography.weights.heavy,
  },
  feeDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  feeSuccessRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feeActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feeBreakdown: {
    fontSize: typography.sizes.footnote,
  },
  gradeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  gradeSubject: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
  },
  gradeRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gradeMarks: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
  },
  teacherRemarkBox: {
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  teacherRemarkTitle: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
  },
  teacherRemarkText: {
    fontSize: typography.sizes.footnote,
    fontStyle: 'italic',
    marginTop: 4,
    lineHeight: 18,
  },
  teacherContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teacherAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  teacherAvatarText: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.heavy,
  },
  teacherInfo: {
    flex: 1,
    marginRight: 8,
  },
  teacherName: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
  },
  teacherSub: {
    fontSize: typography.sizes.footnote,
    marginTop: 1,
  },
});
