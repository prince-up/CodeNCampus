import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "../src/theme/ThemeProvider";

// Work around React types version mismatch between React Native 0.76 (React 18)
// and @react-navigation/native 7.x resolving @types/react@19 from monorepo root.
const TypedStack = Stack as unknown as React.ComponentType<{
  screenOptions?: Record<string, unknown>;
  children?: React.ReactNode;
}>;

const TypedScreen = Stack.Screen as unknown as React.ComponentType<{
  name: string;
  options?: Record<string, unknown>;
}>;

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar style="auto" />
        <TypedStack
          screenOptions={{
            headerStyle: { backgroundColor: "#FFFFFF" },
            headerShadowVisible: false,
            headerTitleStyle: { fontWeight: "700" },
          }}
        >
          <TypedScreen
            name="index"
            options={{
              title: "CodeNCampus",
            }}
          />
        </TypedStack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
