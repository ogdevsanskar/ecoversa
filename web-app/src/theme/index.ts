import { createSystem, defaultConfig } from '@chakra-ui/react'

export const theme = createSystem({
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
        green: {
          50: { value: '#f0fff4' },
          100: { value: '#c6f6d5' },
          200: { value: '#9ae6b4' },
          300: { value: '#68d391' },
          400: { value: '#48bb78' },
          500: { value: '#38a169' },
          600: { value: '#2f855a' },
          700: { value: '#276749' },
          800: { value: '#22543d' },
          900: { value: '#1a365d' },
        }
      },
      fonts: {
        heading: { value: `'Inter', sans-serif` },
        body: { value: `'Inter', sans-serif` },
      },
    },
  },
})
