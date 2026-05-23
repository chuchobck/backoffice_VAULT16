/** @type {import('tailwindcss').Config} */
const colors = {
  asphalt: {
    950: '#0E1114', 900: '#181C1F', 800: '#1E2428', 700: '#252A2E',
    600: '#2E353B', 500: '#353C42', 400: '#4A535A', 300: '#6B757D',
    200: '#9AA3AB', 100: '#C8CDD1', 50: '#F0F2F4',
  },
  electric: {
    950: '#0A1628', 900: '#0E1F3D', 800: '#1D3A6B', 700: '#1D4ED8',
    600: '#2563EB', 500: '#3B82F6', 400: '#60A5FA', 300: '#93C5FD',
    200: '#BFDBFE', 100: '#DBEAFE', 50: '#EFF6FF',
  },
  success: { dark: '#4ADE80', light: '#16A34A', bgDark: '#052E16', bgLight: '#DCFCE7' },
  warning: { dark: '#FACC15', light: '#D97706', bgDark: '#1C1400', bgLight: '#FEF9C3' },
  danger:  { dark: '#F87171', light: '#DC2626', bgDark: '#1F0505', bgLight: '#FEE2E2' },
}

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        asphalt: colors.asphalt,
        electric: colors.electric,
        accent: {
          DEFAULT: colors.electric[500],
          hover: colors.electric[600],
          active: colors.electric[700],
          muted: colors.electric[100],
          text: colors.electric[700],
        },
        'status-success': colors.success.light,
        'status-success-bg': colors.success.bgLight,
        'status-success-dark': colors.success.dark,
        'status-success-bg-dark': colors.success.bgDark,
        'status-warning': colors.warning.light,
        'status-warning-bg': colors.warning.bgLight,
        'status-warning-dark': colors.warning.dark,
        'status-warning-bg-dark': colors.warning.bgDark,
        'status-danger': colors.danger.light,
        'status-danger-bg': colors.danger.bgLight,
        'status-danger-dark': colors.danger.dark,
        'status-danger-bg-dark': colors.danger.bgDark,
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      transitionTimingFunction: { smooth: 'cubic-bezier(0.4, 0, 0.2, 1)' },
      transitionDuration: { fast: '150ms', normal: '200ms' },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
}
