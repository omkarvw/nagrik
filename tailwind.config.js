/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Saffron/Brown
        'primary': '#8f4e00',
        'on-primary': '#ffffff',
        'primary-container': '#ff9933',
        'on-primary-container': '#693800',
        'primary-fixed': '#ffdcc2',
        'primary-fixed-dim': '#ffb77a',
        'on-primary-fixed': '#2e1500',
        'on-primary-fixed-variant': '#6d3a00',
        'inverse-primary': '#ffb77a',

        // Secondary - Green
        'secondary': '#056e00',
        'on-secondary': '#ffffff',
        'secondary-container': '#8dfc75',
        'on-secondary-container': '#067500',
        'secondary-fixed': '#8dfc75',
        'secondary-fixed-dim': '#72de5c',
        'on-secondary-fixed': '#012200',
        'on-secondary-fixed-variant': '#035300',

        // Tertiary - Blue
        'tertiary': '#4b53bc',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#a5abff',
        'on-tertiary-container': '#3036a0',
        'tertiary-fixed': '#e0e0ff',
        'tertiary-fixed-dim': '#bfc2ff',
        'on-tertiary-fixed': '#00006e',
        'on-tertiary-fixed-variant': '#3239a3',

        // Surface - Cream/Warm
        'background': '#fff8f5',
        'on-background': '#231a13',
        'surface': '#fff8f5',
        'on-surface': '#231a13',
        'surface-variant': '#f1dfd3',
        'on-surface-variant': '#554336',
        'surface-dim': '#e8d7cb',
        'surface-bright': '#fff8f5',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#fff1e8',
        'surface-container': '#fdebdf',
        'surface-container-high': '#f7e5d9',
        'surface-container-highest': '#f1dfd3',
        'inverse-surface': '#392e27',
        'inverse-on-surface': '#ffeee2',
        'surface-tint': '#8f4e00',

        // Outline
        'outline': '#887364',
        'outline-variant': '#dbc2b0',

        // Error
        'error': '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
      },
      fontFamily: {
        'sans': ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        'display': ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['60px', { lineHeight: '72px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-lg': ['14px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '600' }],
        'label-sm': ['12px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '500' }],
      },
      borderRadius: {
        'sm': '0.25rem',
        'DEFAULT': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        '2xl': '2rem',
        'full': '9999px',
      },
      boxShadow: {
        'elevation-1': '0 4px 20px -4px rgba(0,0,0,0.05)',
        'elevation-2': '0 8px 30px rgba(0,0,0,0.08)',
        'elevation-3': '0 12px 40px -12px rgba(0,0,0,0.15)',
        'card': '0 2px 12px rgba(0,0,0,0.03)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.08)',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
  plugins: [],
}
