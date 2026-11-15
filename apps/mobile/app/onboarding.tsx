import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeProvider';
import { Button } from '../src/components/ui/Button';
import { Icon, IconName } from '../src/components/ui/Icon';

const { width } = Dimensions.get('window');

interface Slide {
  id: string;
  icon: IconName;
  badge: string;
  title: string;
  description: string;
}

const SLIDES: Slide[] = [
  {
    id: 'academics',
    icon: 'book',
    badge: 'STUDENT & TEACHER SUITE',
    title: 'Academic Excellence at Your Fingertips',
    description:
      'Live timetables, instant attendance marking, syllabus milestones, and digital assessment submissions in one unified portal.',
  },
  {
    id: 'parents',
    icon: 'home',
    badge: 'PARENT COLLABORATION',
    title: 'Real-Time Multi-Child Monitoring',
    description:
      'Switch between children with a single tap. Track bus routes, fee invoices, digital report cards, and communicate directly with educators.',
  },
  {
    id: 'governance',
    icon: 'shield',
    badge: 'CAMPUS ADMINISTRATION',
    title: 'Secure Institution-Grade Operations',
    description:
      'White-label institutional branding, role-based authorization, automated fee reconciliations, and instantaneous emergency broadcasts.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLast = currentIndex === SLIDES.length - 1;
  const currentSlide = SLIDES[currentIndex];

  const handleNext = () => {
    if (isLast) {
      router.replace('/login' as any);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    router.replace('/login' as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <Icon name="school" size={20} color={theme.colors.primary} />
          <Text style={[styles.brandText, { color: theme.colors.text }]}>
            {theme.shortName}
          </Text>
        </View>
        <TouchableOpacity onPress={handleSkip} activeOpacity={0.7} style={styles.skipButton}>
          <Text style={[styles.skipText, { color: theme.colors.textMuted }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View
          style={[
            styles.iconCard,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: theme.colors.accent },
            ]}
          >
            <Icon name={currentSlide.icon} size={48} color={theme.colors.primary} />
          </View>
        </View>

        <Text
          style={[
            styles.badge,
            {
              backgroundColor: theme.colors.accent,
              color: theme.colors.primary,
            },
          ]}
        >
          {currentSlide.badge}
        </Text>

        <Text style={[styles.title, { color: theme.colors.text }]}>
          {currentSlide.title}
        </Text>

        <Text style={[styles.description, { color: theme.colors.textMuted }]}>
          {currentSlide.description}
        </Text>

        <View style={styles.pagination}>
          {SLIDES.map((_, index) => {
            const isActive = index === currentIndex;
            return (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor: isActive
                      ? theme.colors.primary
                      : theme.colors.border,
                    width: isActive ? 24 : 8,
                  },
                ]}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title={isLast ? 'Get Started' : 'Continue'}
          onPress={handleNext}
          icon={isLast ? 'check' : 'arrow-right'}
          iconPosition="right"
          size="lg"
        />
        <Text style={[styles.legalText, { color: theme.colors.textMuted }]}>
          A Product of Codazk Technologies Private Limited
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    fontSize: 16,
    fontWeight: '800',
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  iconCard: {
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginBottom: 12,
    overflow: 'hidden',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
    marginBottom: 28,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  legalText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 14,
    letterSpacing: 0.3,
  },
});

