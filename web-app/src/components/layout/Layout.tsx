import { Box, Flex, VStack } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import Navigation from './Navigation'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box minH="100vh" bg="radial-gradient(ellipse at top, #1a365d, #0a1929)" position="relative">
      <Flex direction="column" minH="100vh">
        <Navigation />
        <VStack flex={1} as="main" width="100%">
          {children}
        </VStack>
      </Flex>
    </Box>
  )
}
