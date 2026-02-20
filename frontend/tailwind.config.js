/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        // Lifeline Pulse Theme - Emergency Medical Inspired
        background: '#020617', // Deep slate
        surface: '#0f172a',    // Slate 900

        // Primary - Emergency Red (Heartbeat)
        primary: {
          50: '#fff1f0',
          100: '#ffe0de',
          200: '#ffc7c2',
          300: '#ffa099',
          400: '#ff5249',  // Active pulse
          500: '#ef4444',  // Main emergency red
          600: '#dc2626',  // Darker red
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },

        // Secondary - Medical Cyan (Vital monitors)
        secondary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',  // Cyan pulse
          500: '#06b6d4',  // Main cyan
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },

        // Accent - Rescue Orange
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',  // Alert orange
          500: '#f97316',  // Main orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },

        // Success - Life Green (Oximeter/Heart rate good)
        success: {
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },

        // Warning - Yellow alert
        warning: {
          400: '#facc15',
          500: '#eab308',
        },

        // Danger - Critical red
        danger: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-emergency': "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)",
      },

      animation: {
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
        'ecg-scroll': 'ecgScroll 3s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },

      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.15)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.08)' },
          '56%': { transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        ecgScroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        glowPulse: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.4), 0 0 40px rgba(239, 68, 68, 0.2)'
          },
          '50%': {
            boxShadow: '0 0 40px rgba(239, 68, 68, 0.6), 0 0 80px rgba(239, 68, 68, 0.3)'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },

      boxShadow: {
        'glow-sm': '0 0 10px rgba(239, 68, 68, 0.3)',
        'glow-md': '0 0 20px rgba(239, 68, 68, 0.4)',
        'glow-lg': '0 0 40px rgba(239, 68, 68, 0.5)',
        'cyan-glow': '0 0 20px rgba(34, 211, 238, 0.4)',
        'success-glow': '0 0 20px rgba(34, 197, 94, 0.4)',
      },
    },
  },
  plugins: [],
}
