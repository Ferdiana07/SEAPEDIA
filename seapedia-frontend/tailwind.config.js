/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Ocean Blue — deep navy utama
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#0C2340',  // deep ocean navy
          950: '#071629',
        },
        // Cobalt accent — lebih cerah
        cobalt: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#1A56DB',  // cobalt blue
          600: '#1d4ed8',
          700: '#1e40af',
        },
        // Status
        success: { 50: '#f0fdf4', 100: '#dcfce7', 500: '#22c55e', 600: '#16a34a', 700: '#15803d' },
        warning: { 50: '#fffbeb', 100: '#fef3c7', 500: '#f59e0b', 600: '#d97706' },
        danger:  { 50: '#fff1f2', 100: '#ffe4e6', 500: '#ef4444', 600: '#dc2626' },
        // Semantic tokens — ocean blue palette
        ink:    '#0C2340',   // deep ocean navy — teks utama
        muted:  '#64748b',   // slate-500 — teks sekunder
        canvas: '#ffffff',   // pure white
        surface:'#f8fafc',   // slate-50 — background halus
        border: '#e2e8f0',   // slate-200
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        sm:   '0.375rem',
        DEFAULT: '0.5rem',
        md:   '0.75rem',
        lg:   '1rem',
        xl:   '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        // Blue-tinted — ocean palette
        card:    '0 1px 3px rgb(12 35 64 / 0.04), 0 6px 20px rgb(12 35 64 / 0.07)',
        'card-up':'0 8px 32px rgb(12 35 64 / 0.12)',
        'card-sm':'0 1px 3px rgb(12 35 64 / 0.06)',
        focus:   '0 0 0 3px rgb(59 130 246 / 0.30)',
        nav:     '0 1px 0 rgb(12 35 64 / 0.06)',
        blue:    '0 4px 14px rgb(26 86 219 / 0.25)',
      },
      backgroundImage: {
        'ocean-gradient': 'linear-gradient(135deg, #0C2340 0%, #1e3a8a 50%, #1A56DB 100%)',
        'ocean-soft': 'linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)',
        'navy-card': 'linear-gradient(135deg, #0C2340 0%, #1e3a8a 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-down': {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up':    'fade-up 450ms cubic-bezier(0.16,1,0.3,1) both',
        'fade-in':    'fade-in 300ms ease-out both',
        'scale-in':   'scale-in 200ms ease-out both',
        'slide-down': 'slide-down 250ms cubic-bezier(0.16,1,0.3,1) both',
      },
    },
  },
  plugins: [],
}
