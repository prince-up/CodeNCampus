import React, { createContext, useContext, useMemo } from 'react';
import { create } from 'zustand';
import { SchoolBrandingConfig, PRESET_SCHOOLS } from './branding';

export interface MobileThemeState {
  currentSchoolCode: string;
  branding: SchoolBrandingConfig;
  setSchoolCode: (code: string) => void;
  setCustomColors: (primary: string, secondary: string, accent?: string) => void;
}

export const useMobileThemeStore = create<MobileThemeState>((set) => ({
  currentSchoolCode: 'DEFAULT',
  branding: PRESET_SCHOOLS.DEFAULT,
  setSchoolCode: (code: string) => {
    const uppercaseCode = (code || '').toUpperCase().trim();
    const found = PRESET_SCHOOLS[uppercaseCode] || PRESET_SCHOOLS.DEFAULT;
    set({
      currentSchoolCode: uppercaseCode,
      branding: found,
    });
  },
  setCustomColors: (primary: string, secondary: string, accent?: string) =>
    set((state) => ({
      branding: {
        ...state.branding,
        colors: {
          ...state.branding.colors,
          primary,
          secondary,
          accent: accent || state.branding.colors.accent,
        },
      },
    })),
}));

const ThemeContext = createContext<SchoolBrandingConfig>(PRESET_SCHOOLS.DEFAULT);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const branding = useMobileThemeStore((state) => state.branding);
  const value = useMemo(() => branding, [branding]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
