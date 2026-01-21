// Theme colors for the e-commerce app
// Supports both light and dark mode

export const Colors = {
  light: {
    primary: '#6366F1',
    primaryDark: '#4F46E5',
    primaryLight: '#A5B4FC',
    secondary: '#EC4899',
    secondaryDark: '#DB2777',
    secondaryLight: '#F9A8D4',
    
    background: '#FFFFFF',
    backgroundSecondary: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceSecondary: '#F1F5F9',
    
    text: '#0F172A',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    textInverse: '#FFFFFF',
    
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    divider: '#E2E8F0',
    
    success: '#22C55E',
    successLight: '#DCFCE7',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    info: '#3B82F6',
    infoLight: '#DBEAFE',
    
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    
    rating: '#FBBF24',
    discount: '#EF4444',
    badge: '#6366F1',
  },
  dark: {
    primary: '#818CF8',
    primaryDark: '#6366F1',
    primaryLight: '#4F46E5',
    secondary: '#F472B6',
    secondaryDark: '#EC4899',
    secondaryLight: '#DB2777',
    
    background: '#0F172A',
    backgroundSecondary: '#1E293B',
    surface: '#1E293B',
    surfaceSecondary: '#334155',
    
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    textInverse: '#0F172A',
    
    border: '#334155',
    borderLight: '#475569',
    divider: '#334155',
    
    success: '#4ADE80',
    successLight: '#166534',
    warning: '#FBBF24',
    warningLight: '#92400E',
    error: '#F87171',
    errorLight: '#991B1B',
    info: '#60A5FA',
    infoLight: '#1E40AF',
    
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    
    rating: '#FBBF24',
    discount: '#F87171',
    badge: '#818CF8',
  },
};

export type ColorScheme = typeof Colors.light;
export type ThemeType = 'light' | 'dark';
