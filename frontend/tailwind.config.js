/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Pitt CSC brand blue (#1d2758 = printer-gamut version, used on the logo,
        // slides and pittcs.wiki). We standardize on this single blue and retire
        // the screen-only #00205b / Pitt-official #003594.
        pittNavy: '#1d2758',
        pittDeepNavy: '#1d2758',
        pittDarkNavy: '#141a3d', // slightly darker shade for hovers/depth
        pittGold: '#FFB81C',
        pittLightGold: '#FFCC4D',
        pittDarkGold: '#E6A519',

        // CSC blue alias (preferred name going forward; same value as pittNavy)
        cscBlue: '#1d2758',
        cscBlueDark: '#141a3d',

        // Secondary / neutral surfaces — cool light neutrals to match pittcs.wiki
        pittBeige: '#eef1f6',
        pittLight: '#f6f7f9',
        pittGray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        
        // Semantic Colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Lexend', 'Inter', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '120': '30rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-up': 'scaleUp 0.2s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'large': '0 8px 32px rgba(0, 0, 0, 0.16)',
        'glow-gold': '0 0 20px rgba(255, 184, 28, 0.3)',
        'glow-navy': '0 0 20px rgba(29, 39, 88, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-pitt': 'linear-gradient(135deg, #1d2758 0%, #2a3670 100%)',
        'gradient-gold': 'linear-gradient(135deg, #FFB81C 0%, #E6A519 100%)',
      },
    },
  },
  plugins: [],
};