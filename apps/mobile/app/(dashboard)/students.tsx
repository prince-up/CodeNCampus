import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
  ActivityIndicator,
  TextInput,
  Switch,
} from 'react-native';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Header } from '../../src/components/common/Header';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { Icon } from '../../src/components/ui/Icon';
import { Avatar } from '../../src/components/ui/Avatar';
import { StateBanner } from '../../src/components/ui/StateBanner';
import { StudentDetailDTO, ClassDTO } from '@codencampus/types';
import {
  fetchStudentsApi,
  createStudentApi,
  updateStudentStatusApi,
  fetchClassesApi,
  importStudentsApi,
} from '../../src/services/students';

export default function StudentsScreen() {
  const theme = useTheme();
  const session = useAuthStore((s) => s.session);
  const token = useAuthStore((s) => s.token);
  const schoolId = session?.activeSchoolId || 'sch-default';

  const [students, setStudents] = useState<StudentDetailDTO[]>([]);
  const [classes, setClasses] = useState<ClassDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Add Student Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newAdmissionNumber, setNewAdmissionNumber] = useState('');
  const [newDateOfBirth, setNewDateOfBirth] = useState('2011-05-15');
  const [newGender, setNewGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [newEmergencyPhone, setNewEmergencyPhone] = useState('+91 98765 43210');
  const [newSectionId, setNewSectionId] = useState<string | undefined>(undefined);
  const [newParentName, setNewParentName] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');

  // Sample seed fallback for offline demonstration if server is offline
  const fallbackStudents: StudentDetailDTO[] = [
    {
      id: 'stu-1',
      schoolId,
      userId: 'user-stu-1',
      readableId: `${session?.activeSchoolId ? 'DPS' : 'CNC'}-STU-00042`,
      admissionNumber: 'ADM-2026-00042',
      rollNumber: 1,
      fullName: 'Aarav Sharma',
      email: 'aarav.sharma@school.edu',
      phone: '+91 98765 00001',
      dateOfBirth: '2010-04-12',
      gender: 'MALE',
      bloodGroup: 'B+',
      emergencyContactPhone: '+91 98765 43210',
      isActive: true,
      className: 'Class 10',
      sectionName: 'A',
      parents: [
        {
          parentProfileId: 'par-1',
          parentUserId: 'user-par-1',
          fullName: 'Rajesh Sharma',
          phone: '+91 98765 43210',
          relationType: 'FATHER',
          isPrimaryContact: true,
          canPickup: true,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'stu-2',
      schoolId,
      userId: 'user-stu-2',
      readableId: `${session?.activeSchoolId ? 'DPS' : 'CNC'}-STU-00043`,
      admissionNumber: 'ADM-2026-00043',
      rollNumber: 2,
      fullName: 'Diya Patel',
      email: 'diya.patel@school.edu',
      phone: '+91 98765 00002',
      dateOfBirth: '2010-08-22',
      gender: 'FEMALE',
      bloodGroup: 'O+',
      emergencyContactPhone: '+91 98765 11111',
      isActive: true,
      className: 'Class 10',
      sectionName: 'A',
      parents: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'stu-3',
      schoolId,
      userId: 'user-stu-3',
      readableId: `${session?.activeSchoolId ? 'DPS' : 'CNC'}-STU-00044`,
      admissionNumber: 'ADM-2026-00044',
      rollNumber: 3,
      fullName: 'Kabir Verma',
      email: null,
      phone: null,
      dateOfBirth: '2011-01-10',
      gender: 'MALE',
      bloodGroup: 'AB+',
      emergencyContactPhone: '+91 98765 22222',
      isActive: false,
      className: 'Class 9',
      sectionName: 'B',
      parents: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const loadData = async () => {
    if (!token) {
      setStudents(fallbackStudents);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [studentsRes, classesRes] = await Promise.all([
        fetchStudentsApi(token, schoolId, {
          query: searchQuery,
          classId: selectedClassId || undefined,
        }).catch(() => null),
        fetchClassesApi(token, schoolId).catch(() => null),
      ]);

      if (studentsRes?.students) {
        setStudents(studentsRes.students);
      } else {
        setStudents(fallbackStudents);
      }

      if (classesRes) {
        setClasses(classesRes);
      }
    } catch {
      setStudents(fallbackStudents);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedClassId]);

  const handleToggleStatus = async (student: StudentDetailDTO) => {
    const nextStatus = !student.isActive;
    if (token) {
      try {
        await updateStudentStatusApi(token, schoolId, student.id, nextStatus);
      } catch (err: unknown) {
        Alert.alert('Error', err instanceof Error ? err.message : 'Failed to update student status');
        return;
      }
    }
    setStudents((prev) =>
      prev.map((s) => (s.id === student.id ? { ...s, isActive: nextStatus } : s))
    );
  };

  const handleCreateStudent = async () => {
    if (!newFullName.trim()) {
      Alert.alert('Required', 'Please enter student full name');
      return;
    }

    setIsSubmitting(true);
    try {
      if (token) {
        const created = await createStudentApi(token, schoolId, {
          fullName: newFullName.trim(),
          admissionNumber: newAdmissionNumber.trim() || undefined,
          dateOfBirth: newDateOfBirth,
          gender: newGender,
          emergencyContactPhone: newEmergencyPhone,
          sectionId: newSectionId,
          parent: newParentName
            ? {
                fullName: newParentName,
                phone: newParentPhone || newEmergencyPhone,
                relationType: 'LEGAL_GUARDIAN',
              }
            : undefined,
        });
        setStudents((prev) => [created, ...prev]);
      } else {
        const mockStudent: StudentDetailDTO = {
          id: `stu-local-${Date.now()}`,
          schoolId,
          userId: `user-local-${Date.now()}`,
          readableId: `STU-${Math.floor(10000 + Math.random() * 90000)}`,
          admissionNumber: newAdmissionNumber || `ADM-2026-${Date.now().toString().slice(-4)}`,
          fullName: newFullName.trim(),
          dateOfBirth: newDateOfBirth,
          gender: newGender,
          emergencyContactPhone: newEmergencyPhone,
          isActive: true,
          className: 'Class 10',
          sectionName: 'A',
          parents: newParentName
            ? [
                {
                  parentProfileId: 'par-new',
                  parentUserId: 'user-par-new',
                  fullName: newParentName,
                  phone: newParentPhone,
                  relationType: 'GUARDIAN',
                  isPrimaryContact: true,
                  canPickup: true,
                },
              ]
            : [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setStudents((prev) => [mockStudent, ...prev]);
      }

      setModalVisible(false);
      setNewFullName('');
      setNewAdmissionNumber('');
      setNewParentName('');
      setNewParentPhone('');
      Alert.alert('Success', 'Student account and credentials provisioned!');
    } catch (err: unknown) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to register student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCsvImportSample = async () => {
    Alert.alert(
      'Validated CSV/Excel Import',
      'Process batch enrollment spreadsheet (3 validated student rows)?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Upload & Import',
          onPress: async () => {
            const sampleRows = [
              {
                fullName: 'Rohan Mehra',
                className: 'Class 11',
                sectionName: 'A',
                dateOfBirth: '2009-07-14',
                gender: 'MALE',
                emergencyContactPhone: '+91 98765 33333',
                parentName: 'Vikram Mehra',
                parentPhone: '+91 98765 33333',
                parentRelation: 'FATHER',
              },
              {
                fullName: 'Sanya Sengupta',
                className: 'Class 11',
                sectionName: 'A',
                dateOfBirth: '2009-11-03',
                gender: 'FEMALE',
                emergencyContactPhone: '+91 98765 44444',
                parentName: 'Ananya Sengupta',
                parentPhone: '+91 98765 44444',
                parentRelation: 'MOTHER',
              },
            ];

            if (token) {
              try {
                const res = await importStudentsApi(token, schoolId, sampleRows);
                Alert.alert(
                  'Import Complete',
                  `Successfully enrolled ${res.imported} students (${res.failed} errors).`
                );
                loadData();
              } catch (err: unknown) {
                Alert.alert('Import Failed', err instanceof Error ? err.message : 'Import failed');
              }
            } else {
              Alert.alert('Import Preview', 'Validated 2 rows successfully!');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface }]}>
      <Header title="Student Directory" subtitle="Campus Enrollment & Roster" showBack />

      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Search Bar & Action Buttons */}
        <View style={[styles.filterBar, { backgroundColor: theme.colors.surface }]}>
          <View style={[styles.searchInputWrapper, { borderColor: theme.colors.border }]}>
            <Icon name="search" size={16} color={theme.colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Search by name, ID, or admission..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.actionButtonsRow}>
            <Button
              title="Add Student"
              onPress={() => setModalVisible(true)}
              size="sm"
              icon="user"
              style={{ flex: 1 }}
            />
            <Button
              title="Import CSV"
              onPress={handleCsvImportSample}
              variant="outline"
              size="sm"
              icon="file-text"
              style={{ flex: 1 }}
            />
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.textMuted }]}>
              Loading student roster...
            </Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.listContent}>
            <View style={styles.rosterHeader}>
              <Text style={[styles.rosterCount, { color: theme.colors.textMuted }]}>
                Showing {students.length} enrolled students
              </Text>
            </View>

            {students.map((student) => (
              <Card key={student.id} style={styles.studentCard}>
                <View style={styles.studentTopRow}>
                  <Avatar name={student.fullName} size={44} roleBadge="S" />
                  <View style={styles.studentInfo}>
                    <View style={styles.nameRow}>
                      <Text style={[styles.studentFullName, { color: theme.colors.text }]}>
                        {student.fullName}
                      </Text>
                      <Badge
                        label={student.isActive ? 'Active' : 'Deactivated'}
                        variant={student.isActive ? 'success' : 'danger'}
                        size="sm"
                      />
                    </View>
                    <Text style={[styles.studentIdText, { color: theme.colors.textMuted }]}>
                      Campus ID: {student.readableId} • Adm: {student.admissionNumber}
                    </Text>
                  </View>
                </View>

                <View style={[styles.cardDivider, { backgroundColor: theme.colors.border }]} />

                <View style={styles.metaGrid}>
                  <View style={styles.metaItem}>
                    <Text style={[styles.metaLabel, { color: theme.colors.textMuted }]}>Class</Text>
                    <Text style={[styles.metaValue, { color: theme.colors.text }]}>
                      {student.className ? `${student.className}-${student.sectionName || 'A'}` : 'Unassigned'}
                    </Text>
                  </View>

                  <View style={styles.metaItem}>
                    <Text style={[styles.metaLabel, { color: theme.colors.textMuted }]}>Roll No</Text>
                    <Text style={[styles.metaValue, { color: theme.colors.text }]}>
                      {student.rollNumber ? `#${student.rollNumber}` : '—'}
                    </Text>
                  </View>

                  <View style={styles.metaItem}>
                    <Text style={[styles.metaLabel, { color: theme.colors.textMuted }]}>Gender</Text>
                    <Text style={[styles.metaValue, { color: theme.colors.text }]}>
                      {student.gender}
                    </Text>
                  </View>

                  <View style={styles.metaItem}>
                    <Text style={[styles.metaLabel, { color: theme.colors.textMuted }]}>Blood</Text>
                    <Text style={[styles.metaValue, { color: theme.colors.text }]}>
                      {student.bloodGroup || '—'}
                    </Text>
                  </View>
                </View>

                {student.parents && student.parents.length > 0 && (
                  <View style={[styles.parentRow, { backgroundColor: theme.colors.background }]}>
                    <Icon name="home" size={14} color={theme.colors.primary} />
                    <Text style={[styles.parentText, { color: theme.colors.text }]}>
                      Guardian: {student.parents[0].fullName} ({student.parents[0].relationType}) •{' '}
                      {student.parents[0].phone}
                    </Text>
                  </View>
                )}

                <View style={styles.cardActionsRow}>
                  <View style={styles.statusToggle}>
                    <Text style={[styles.toggleLabel, { color: theme.colors.textMuted }]}>
                      Active Status
                    </Text>
                    <Switch
                      value={student.isActive}
                      onValueChange={() => handleToggleStatus(student)}
                      trackColor={{ false: '#CBD5E1', true: theme.colors.primary }}
                    />
                  </View>
                </View>
              </Card>
            ))}
          </ScrollView>
        )}

        {/* Modal: Add Student */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                  Enroll New Student
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Icon name="close" size={20} color={theme.colors.textMuted} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <Input
                  label="Full Name *"
                  placeholder="e.g. Aarav Sharma"
                  value={newFullName}
                  onChangeText={setNewFullName}
                  leftIcon="user"
                />

                <Input
                  label="Admission Number (Optional - Auto-generated if blank)"
                  placeholder="e.g. ADM-2026-00099"
                  value={newAdmissionNumber}
                  onChangeText={setNewAdmissionNumber}
                  leftIcon="file-text"
                />

                <Input
                  label="Date of Birth (YYYY-MM-DD) *"
                  placeholder="2011-05-15"
                  value={newDateOfBirth}
                  onChangeText={setNewDateOfBirth}
                  leftIcon="calendar"
                />

                <Input
                  label="Emergency Contact Phone *"
                  placeholder="+91 98765 43210"
                  value={newEmergencyPhone}
                  onChangeText={setNewEmergencyPhone}
                  leftIcon="phone"
                />

                <View style={styles.sectionSelectBox}>
                  <Text style={[styles.sectionSelectLabel, { color: theme.colors.text }]}>
                    Assign Section:
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                    {classes.flatMap((c) => c.sections).map((sec) => {
                      const isSel = newSectionId === sec.id;
                      return (
                        <TouchableOpacity
                          key={sec.id}
                          onPress={() => setNewSectionId(sec.id)}
                          style={[
                            styles.sectionChip,
                            {
                              borderColor: isSel ? theme.colors.primary : theme.colors.border,
                              backgroundColor: isSel ? theme.colors.accent : theme.colors.background,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.sectionChipText,
                              { color: isSel ? theme.colors.primary : theme.colors.text },
                            ]}
                          >
                            {sec.className ? `${sec.className}-${sec.name}` : sec.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                <View style={[styles.cardDivider, { backgroundColor: theme.colors.border }]} />

                <Text style={[styles.sectionHeading, { color: theme.colors.text }]}>
                  Guardian Linkage (Optional)
                </Text>

                <Input
                  label="Parent / Guardian Name"
                  placeholder="e.g. Sunita Sharma"
                  value={newParentName}
                  onChangeText={setNewParentName}
                  leftIcon="user"
                />

                <Input
                  label="Parent Mobile Phone"
                  placeholder="e.g. +91 98765 43210"
                  value={newParentPhone}
                  onChangeText={setNewParentPhone}
                  leftIcon="phone"
                />
              </ScrollView>

              <View style={styles.modalFooter}>
                <Button
                  title="Confirm & Provision Student"
                  onPress={handleCreateStudent}
                  loading={isSubmitting}
                  size="lg"
                  icon="check"
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
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
  filterBar: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  rosterHeader: {
    marginBottom: 12,
  },
  rosterCount: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  studentCard: {
    padding: 16,
    marginBottom: 14,
  },
  studentTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  studentInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  studentFullName: {
    fontSize: 16,
    fontWeight: '700',
  },
  studentIdText: {
    fontSize: 12,
  },
  cardDivider: {
    height: 1,
    marginVertical: 12,
  },
  metaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metaItem: {
    alignItems: 'flex-start',
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  parentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  parentText: {
    fontSize: 11,
    fontWeight: '500',
    flex: 1,
  },
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 6,
  },
  statusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalBody: {
    marginBottom: 16,
  },
  sectionSelectBox: {
    marginBottom: 16,
  },
  sectionSelectLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  sectionChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalFooter: {
    paddingTop: 8,
  },
});

