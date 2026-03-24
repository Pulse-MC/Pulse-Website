import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content:['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        syne:['Syne', 'sans-serif'],
        minecraft: ['Minecraft', 'sans-serif'],
        jet: ['JetBrains Mono', 'monospace'],
        emoji: ['Noto Color Emoji', 'sans-serif']
      },
      colors: {
        mc: {
          // Основные цвета (&0 - &f)
          '0': '#000000', // Black
          '1': '#0000AA', // Dark Blue
          '2': '#00AA00', // Dark Green
          '3': '#00AAAA', // Dark Aqua
          '4': '#AA0000', // Dark Red
          '5': '#AA00AA', // Dark Purple
          '6': '#FFAA00', // Gold
          '7': '#AAAAAA', // Gray
          '8': '#555555', // Dark Gray
          '9': '#5555FF', // Blue
          'a': '#55FF55', // Green
          'b': '#55FFFF', // Aqua
          'c': '#FF5555', // Red
          'd': '#FF55FF', // Light Purple
          'e': '#FFFF55', // Yellow
          'f': '#FFFFFF', // White

          // Цвета ТЕНЕЙ (те же цвета, деленные на 4)
          'shadow-0': '#000000',
          'shadow-1': '#00002A',
          'shadow-2': '#002A00',
          'shadow-3': '#002A2A',
          'shadow-4': '#2A0000',
          'shadow-5': '#2A002A',
          'shadow-6': '#3F2A00',
          'shadow-7': '#2A2A2A',
          'shadow-8': '#151515',
          'shadow-9': '#15153F',
          'shadow-a': '#153F15',
          'shadow-b': '#153F3F',
          'shadow-c': '#3F1515',
          'shadow-d': '#3F153F',
          'shadow-e': '#3F3F15',
          'shadow-f': '#3F3F3F',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      }
    }
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;