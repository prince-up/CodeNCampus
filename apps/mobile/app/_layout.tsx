import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../src/theme/ThemeProvider';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#FFFFFF' },
            headerShadowVisible: false,
            headerTitleStyle: { fontWeight: '700' },
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: 'CodeNCampus',
            }}
          />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
