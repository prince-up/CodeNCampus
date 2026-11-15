export interface SchoolBrandingConfig {
  schoolCode: string;
  name: string;
  shortName: string;
  tagline: string;
  logoUrl?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    card: string;
    text: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
  };
}

export const PRESET_SCHOOLS: Record<string, SchoolBrandingConfig> = {
  DEFAULT: {
    schoolCode: 'CNC',
    name: 'CodeNCampus Academy',
    shortName: 'CodeNCampus',
    tagline: 'Modern School Management, Simplified',
    colors: {
      primary: '#1E40AF', // Deep Royal Blue
      secondary: '#3B82F6',
      accent: '#DBEAFE',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      card: '#FFFFFF',
      text: '#0F172A',
      textMuted: '#64748B',
      border: '#E2E8F0',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      info: '#0284C7',
    },
  },
  DPSRKP: {
    schoolCode: 'DPSRKP',
    name: 'Delhi Public School, R.K. Puram',
    shortName: 'DPS RKP',
    tagline: 'Service Before Self',
    colors: {
      primary: '#0F5132', // Deep Forest Green
      secondary: '#198754',
      accent: '#D1E7DD',
      background: '#F7FDF9',
      surface: '#FFFFFF',
      card: '#FFFFFF',
      text: '#0A291A',
      textMuted: '#52796F',
      border: '#D8E2DC',
      success: '#198754',
      warning: '#FFC107',
      danger: '#DC3545',
      info: '#0D6EFD',
    },
  },
  MODERN: {
    schoolCode: 'MODERN',
    name: 'Modern Senior Secondary School',
    shortName: 'Modern School',
    tagline: 'Perseverance & Honor',
    colors: {
      primary: '#7C2D12', // Crimson Maroon
      secondary: '#B91C1C',
      accent: '#FEE2E2',
      background: '#FFFBFB',
      surface: '#FFFFFF',
      card: '#FFFFFF',
      text: '#1C1917',
      textMuted: '#78716C',
      border: '#E7E5E4',
      success: '#15803D',
      warning: '#D97706',
      danger: '#B91C1C',
      info: '#2563EB',
    },
  },
};

