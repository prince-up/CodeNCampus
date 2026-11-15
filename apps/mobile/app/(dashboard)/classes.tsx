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
} from 'react-native';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Header } from '../../src/components/common/Header';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { Icon } from '../../src/components/ui/Icon';
import { ClassDTO } from '@codencampus/types';
import { fetchClassesApi, createClassApi, createSectionApi } from '../../src/services/students';

export default function ClassesScreen() {
  const theme = useTheme();
  const session = useAuthStore((s) => s.session);
  const token = useAuthStore((s) => s.token);
  const schoolId = session?.activeSchoolId || 'sch-default';

  const [classes, setClasses] = useState<ClassDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Create Class Modal
  const [classModalVisible, setClassModalVisible] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newNumericOrder, setNewNumericOrder] = useState('10');
  const [newStage, setNewStage] = useState<'PRIMARY' | 'MIDDLE' | 'SECONDARY' | 'SENIOR_SECONDARY'>('SECONDARY');

  // Create Section Modal
  const [sectionModalVisible, setSectionModalVisible] = useState(false);
  const [targetClassId, setTargetClassId] = useState<string | null>(null);
  const [newSectionName, setNewSectionName] = useState('B');
  const [newRoomNumber, setNewRoomNumber] = useState('Room 304');

  const fallbackClasses: ClassDTO[] = [
    {
      id: 'cls-1',
      schoolId,
      name: 'Class 10',
      numericOrder: 10,
      stage: 'SECONDARY',
      sections: [
        { id: 'sec-1', schoolId, classId: 'cls-1', className: 'Class 10', name: 'A', roomNumber: 'Room 302', capacity: 45, studentCount: 38 },
        { id: 'sec-2', schoolId, classId: 'cls-1', className: 'Class 10', name: 'B', roomNumber: 'Room 304', capacity: 45, studentCount: 40 },
      ],
    },
    {
      id: 'cls-2',
      schoolId,
      name: 'Class 11',
      numericOrder: 11,
      stage: 'SENIOR_SECONDARY',
      sections: [
        { id: 'sec-3', schoolId, classId: 'cls-2', className: 'Class 11', name: 'A (Science)', roomNumber: 'Room 401', capacity: 40, studentCount: 35 },
        { id: 'sec-4', schoolId, classId: 'cls-2', className: 'Class 11', name: 'B (Commerce)', roomNumber: 'Room 402', capacity: 40, studentCount: 32 },
      ],
    },
    {
      id: 'cls-3',
      schoolId,
      name: 'Class 9',
      numericOrder: 9,
      stage: 'SECONDARY',
      sections: [
        { id: 'sec-5', schoolId, classId: 'cls-3', className: 'Class 9', name: 'A', roomNumber: 'Room 201', capacity: 45, studentCount: 42 },
      ],
    },
  ];

  const loadClasses = async () => {
    if (!token) {
      setClasses(fallbackClasses);
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchClassesApi(token, schoolId);
      setClasses(data.length ? data : fallbackClasses);
    } catch {
      setClasses(fallbackClasses);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleCreateClass = async () => {
    if (!newClassName.trim()) {
      Alert.alert('Required', 'Class name is required (e.g. Class 12)');
      return;
    }

    try {
      if (token) {
        await createClassApi(token, schoolId, {
          name: newClassName.trim(),
          numericOrder: parseInt(newNumericOrder, 10) || 1,
          stage: newStage,
          sectionNames: ['A'],
        });
      } else {
        const newCls: ClassDTO = {
          id: `cls-local-${Date.now()}`,
          schoolId,
          name: newClassName.trim(),
          numericOrder: parseInt(newNumericOrder, 10) || 1,
          stage: newStage,
          sections: [
            {
              id: `sec-local-${Date.now()}`,
              schoolId,
              classId: `cls-local-${Date.now()}`,
              className: newClassName.trim(),
              name: 'A',
              roomNumber: 'Room 101',
              capacity: 45,
              studentCount: 0,
            },
          ],
        };
        setClasses((prev) => [...prev, newCls]);
      }

      setClassModalVisible(false);
      setNewClassName('');
      loadClasses();
      Alert.alert('Success', 'Academic class and Section A created!');
    } catch (err: unknown) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to create class');
    }
  };

  const handleCreateSection = async () => {
    if (!targetClassId || !newSectionName.trim()) {
      Alert.alert('Required', 'Section letter is required (e.g. C)');
      return;
    }

    try {
      if (token) {
        await createSectionApi(token, schoolId, targetClassId, {
          name: newSectionName.trim().toUpperCase(),
          roomNumber: newRoomNumber,
          capacity: 45,
        });
      } else {
        setClasses((prev) =>
          prev.map((c) =>
            c.id === targetClassId
              ? {
                  ...c,
                  sections: [
                    ...c.sections,
                    {
                      id: `sec-local-${Date.now()}`,
                      schoolId,
                      classId: c.id,
                      className: c.name,
                      name: newSectionName.trim().toUpperCase(),
                      roomNumber: newRoomNumber,
                      capacity: 45,
                      studentCount: 0,
                    },
                  ],
                }
              : c
          )
        );
      }

      setSectionModalVisible(false);
      setNewSectionName('');
      loadClasses();
      Alert.alert('Success', 'Section added to class roster!');
    } catch (err: unknown) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to add section');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface }]}>
      <Header title="Class & Section Roster" subtitle="Academic Hierarchy & Capacity" showBack />

      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.topActions, { backgroundColor: theme.colors.surface }]}>
          <Button
            title="Create New Class"
            onPress={() => setClassModalVisible(true)}
            size="md"
            icon="school"
          />
        </View>

        {isLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.textMuted }]}>
              Loading academic structure...
            </Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.listContent}>
            {classes.map((cls) => (
              <Card key={cls.id} style={styles.classCard}>
                <View style={styles.classHeader}>
                  <View>
                    <Text style={[styles.className, { color: theme.colors.text }]}>
                      {cls.name}
                    </Text>
                    <Text style={[styles.stageText, { color: theme.colors.textMuted }]}>
                      Stage: {cls.stage} • Order: #{cls.numericOrder}
                    </Text>
                  </View>
                  <Button
                    title="+ Section"
                    onPress={() => {
                      setTargetClassId(cls.id);
                      setSectionModalVisible(true);
                    }}
                    variant="outline"
                    size="sm"
                    fullWidth={false}
                  />
                </View>

                <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

                <Text style={[styles.sectionsHeading, { color: theme.colors.textMuted }]}>
                  Sections ({cls.sections.length}):
                </Text>

                <View style={styles.sectionsGrid}>
                  {cls.sections.map((sec) => (
                    <View
                      key={sec.id}
                      style={[
                        styles.sectionBox,
                        {
                          borderColor: theme.colors.border,
                          backgroundColor: theme.colors.background,
                        },
                      ]}
                    >
                      <View style={styles.secTop}>
                        <Text style={[styles.secName, { color: theme.colors.primary }]}>
                          Section {sec.name}
                        </Text>
                        <Badge
                          label={`${sec.studentCount || 0} Students`}
                          variant="primary"
                          size="sm"
                        />
                      </View>
                      <Text style={[styles.secRoom, { color: theme.colors.textMuted }]}>
                        {sec.roomNumber || 'Room unassigned'}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>
            ))}
          </ScrollView>
        )}

        {/* Modal: Create Class */}
        <Modal visible={classModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                  Create Academic Class
                </Text>
                <TouchableOpacity onPress={() => setClassModalVisible(false)}>
                  <Icon name="close" size={20} color={theme.colors.textMuted} />
                </TouchableOpacity>
              </View>

              <Input
                label="Class Name *"
                placeholder="e.g. Class 12 or Grade 8"
                value={newClassName}
                onChangeText={setNewClassName}
                leftIcon="school"
              />

              <Input
                label="Numeric Grade Order *"
                placeholder="e.g. 12"
                keyboardType="numeric"
                value={newNumericOrder}
                onChangeText={setNewNumericOrder}
                leftIcon="file-text"
              />

              <Button
                title="Create Class"
                onPress={handleCreateClass}
                size="lg"
                style={{ marginTop: 12 }}
              />
            </View>
          </View>
        </Modal>

        {/* Modal: Add Section */}
        <Modal visible={sectionModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                  Add Section to Class
                </Text>
                <TouchableOpacity onPress={() => setSectionModalVisible(false)}>
                  <Icon name="close" size={20} color={theme.colors.textMuted} />
                </TouchableOpacity>
              </View>

              <Input
                label="Section Letter / Name *"
                placeholder="e.g. C or Science-A"
                value={newSectionName}
                onChangeText={setNewSectionName}
                leftIcon="book"
              />

              <Input
                label="Room Number"
                placeholder="e.g. Room 305"
                value={newRoomNumber}
                onChangeText={setNewRoomNumber}
                leftIcon="home"
              />

              <Button
                title="Add Section"
                onPress={handleCreateSection}
                size="lg"
                style={{ marginTop: 12 }}
              />
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
  topActions: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  classCard: {
    padding: 16,
    marginBottom: 14,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  className: {
    fontSize: 18,
    fontWeight: '800',
  },
  stageText: {
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  sectionsHeading: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  sectionsGrid: {
    gap: 8,
  },
  sectionBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  secTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  secName: {
    fontSize: 14,
    fontWeight: '700',
  },
  secRoom: {
    fontSize: 12,
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
    padding: 20,
    paddingBottom: 36,
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
});

