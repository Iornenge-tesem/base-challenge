import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark-blue': '#0a2540',
        'primary-light-blue': '#1a3a52',
        'primary-light-mode-blue': '#a5bfeb',        'primary-modal-light': '#7ba3d0',        'primary-white': '#ffffff',
        'accent-gray': '#6b7280',
        'accent-light-gray': '#f3f4f6',
        'accent-green': '#00d084',
        'accent-green-dark': '#00a86b',
      },
    },
  },
  plugins: [],
}
export default config
