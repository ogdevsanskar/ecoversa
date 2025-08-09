import { Box } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import Navigation from './Navigation'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box minHeight="100vh">
      <Navigation />
      <Box as="main">
        {children}
      </Box>
    </Box>
  )
}