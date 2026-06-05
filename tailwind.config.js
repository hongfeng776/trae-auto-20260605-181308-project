/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,vue}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        bg: '#0f172a',
        surface: '#1e293b',
        'surface-light': '#334155',
        border: '#475569',
        'text-primary': '#f1f5f9',
        'text-muted': '#94a3b8',
        danger: '#ef4444',
        warning: '#f59e0b',
        success: '#10b981',
        info: '#3b82f6',
      },
      fontFamily: {
        display: ['DM Sans', 'Source Sans 3', 'sans-serif'],
        body: ['Source Sans 3', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
