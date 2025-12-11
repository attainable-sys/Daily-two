import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F0F0F',
        surface: '#1A1A1A',
        border: '#2A2A2A',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0A0A0',
        accent: '#FF4500',
        success: '#1DB954',
        error: '#FF3B30',
      },
    },
  },
  plugins: [],
}

export default config
