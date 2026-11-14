import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../src/theme/ThemeProvider";

export default function IndexScreen() {
  const theme = useTheme();

  const personas = [
    { role: "Student", desc: "Timetable, attendance & homework tracker" },
    { role: "Parent", desc: "Multi-child switcher, fees & real-time notices" },
    { role: "Teacher", desc: "Attendance marking & assessment records" },
    { role: "School Admin", desc: "Institution configuration & operations" },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.badge,
            { backgroundColor: theme.accent, color: theme.primary },
          ]}
        >
          Multi-Tenant Mobile App
        </Text>
        <Text style={[styles.title, { color: theme.text }]}>CodeNCampus</Text>
        <Text style={[styles.subtitle, { color: theme.mutedText }]}>
          Dynamic White-Label Experience for Nursery to Class 12
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        {personas.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.card,
              { backgroundColor: theme.card, borderColor: "#E2E8F0" },
            ]}
            activeOpacity={0.7}
          >
            <View
              style={[styles.roleIndicator, { backgroundColor: theme.primary }]}
            />
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                {item.role}
              </Text>
              <Text style={[styles.cardDesc, { color: theme.mutedText }]}>
                {item.desc}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.mutedText }]}>
          Codazk Technologies Private Limited
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: "center",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 12,
    overflow: "hidden",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 20,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  roleIndicator: {
    width: 6,
    height: 36,
    borderRadius: 3,
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 13,
  },
  footer: {
    padding: 32,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
  },
});
