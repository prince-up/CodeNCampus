import React, { createContext, useContext, useMemo } from "react";
import { create } from "zustand";

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  card: string;
  text: string;
  mutedText: string;
}

const defaultTheme: ThemeColors = {
  primary: "#1E40AF",
  secondary: "#3B82F6",
  accent: "#DBEAFE",
  background: "#F8FAFC",
  card: "#FFFFFF",
  text: "#0F172A",
  mutedText: "#64748B",
};

interface MobileThemeStore {
  colors: ThemeColors;
  setBrandColors: (primary: string, secondary: string, accent?: string) => void;
}

export const useMobileThemeStore = create<MobileThemeStore>((set) => ({
  colors: defaultTheme,
  setBrandColors: (primary, secondary, accent) =>
    set((state) => ({
      colors: {
        ...state.colors,
        primary,
        secondary,
        accent: accent || "#DBEAFE",
      },
    })),
}));

const ThemeContext = createContext<ThemeColors>(defaultTheme);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const colors = useMobileThemeStore((state) => state.colors);
  const value = useMemo(() => colors, [colors]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
