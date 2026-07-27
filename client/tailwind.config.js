/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  screens: {
    'xs': '320px',
    'sm': '480px',
    'md': '768px',
    'lg': '1024px',
    'xl': '1280px',
    '2xl': '1536px',
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["Outfit", "system-ui", "sans-serif"],
        display: ["Sora", "system-ui", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
      fontSize: {
        // Professional Typography Scale with responsive variants
        'hero': ['clamp(2rem, 5vw, 3rem)', { lineHeight: '1.1', fontWeight: '900' }],
        'h1': ['clamp(1.5rem, 4vw, 2rem)', { lineHeight: '1.2', fontWeight: '800' }],
        'h2': ['clamp(1.25rem, 3vw, 1.5rem)', { lineHeight: '1.3', fontWeight: '700' }],
        'h3': ['clamp(1rem, 2.5vw, 1.25rem)', { lineHeight: '1.4', fontWeight: '600' }],
        'h4': ['clamp(0.9rem, 2vw, 1.125rem)', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['clamp(0.875rem, 1.5vw, 0.9375rem)', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['clamp(0.75rem, 1.2vw, 0.875rem)', { lineHeight: '1.5', fontWeight: '400' }],
        'xs': ['clamp(0.625rem, 1vw, 0.75rem)', { lineHeight: '1.5', fontWeight: '500' }],
      },
      colors: {
        // Premium Layered Color System - Light Mode
        surface: {
          base: '#F4F7FB',        // Main background
          elevated: '#FFFFFF',     // Cards
          secondary: '#F8FAFC',    // Secondary surfaces
          accent: '#EFF6FF',       // Accent surfaces
        },
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',  // Main primary
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
        },
        secondary: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',  // Main secondary
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',  // Main accent
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        emerald: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
        },
        purple: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
        },
        pink: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          400: '#F472B6',
          500: '#EC4899',
          600: '#DB2777',
        },
        indigo: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        success: {
          500: '#10B981',
          600: '#059669',
        },
        warning: {
          500: '#F59E0B',
          600: '#D97706',
        },
        error: {
          500: '#EF4444',
          600: '#DC2626',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #EEF6FF 0%, #F8FAFC 100%)',
        'mesh-gradient': 'radial-gradient(at 40% 20%, rgba(37, 99, 235, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(14, 165, 164, 0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(245, 158, 11, 0.1) 0px, transparent 50%)',
        'grid-pattern': 'linear-gradient(rgba(37, 99, 235, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(37, 99, 235, 0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '40px 40px',
        '200': '200%',
      },
      backgroundPosition: {
        'pos-0': '0% 0%',
        'pos-100': '100% 0%',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.02)',
        'soft-lg': '0 8px 16px rgba(15, 23, 42, 0.06), 0 2px 4px rgba(15, 23, 42, 0.03)',
        'soft-xl': '0 20px 40px rgba(15, 23, 42, 0.08), 0 4px 8px rgba(15, 23, 42, 0.04)',
        'glow-primary': '0 0 20px rgba(37, 99, 235, 0.4)',
        'glow-secondary': '0 0 20px rgba(14, 165, 164, 0.4)',
        'glow-accent': '0 0 20px rgba(245, 158, 11, 0.4)',
        'elevation-1': '0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.06)',
        'elevation-2': '0 4px 6px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.06)',
        'elevation-3': '0 10px 15px rgba(15, 23, 42, 0.1), 0 4px 6px rgba(15, 23, 42, 0.08)',
        'elevation-4': '0 20px 25px rgba(15, 23, 42, 0.12), 0 8px 10px rgba(15, 23, 42, 0.1)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
}
