import React from 'react';
import { Stack } from 'expo-router';

export default function DashboardLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="student" />
      <Stack.Screen name="teacher" />
      <Stack.Screen name="parent" />
      <Stack.Screen name="admin" />
      <Stack.Screen name="students" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="classes" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="profile" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}

