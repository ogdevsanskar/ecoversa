import { createSystem, defaultConfig } from '@chakra-ui/react'

const customConfig = {
  ...defaultConfig,
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#E6FFFA' },
          100: { value: '#B2F5EA' },
          200: { value: '#81E6D9' },
          300: { value: '#4FD1C7' },
          400: { value: '#38B2AC' },
          500: { value: '#319795' },
          600: { value: '#2C7A7B' },
          700: { value: '#285E61' },
          800: { value: '#234E52' },
          900: { value: '#1D4044' },
        },
        eco: {
          green: { value: '#00E676' },
          darkGreen: { value: '#00C853' },
          lightGreen: { value: '#69F0AE' },
          blue: { value: '#00B8D4' },
          darkBlue: { value: '#0091EA' },
          purple: { value: '#7C4DFF' },
          orange: { value: '#FF6D00' },
          red: { value: '#FF1744' },
        },
      },
      fonts: {
        heading: { value: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif" },
        body: { value: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
      },
    },
  },
}

export const theme = createSystem(customConfig)
