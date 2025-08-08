import { Box, Container, Flex, HStack, Text, Button, VStack } from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaLeaf, FaBars } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useState } from 'react'

const MotionBox = motion(Box)

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Analytics', path: '/analytics' },
  { name: 'Challenges', path: '/challenges' },
  { name: 'Leaderboard', path: '/leaderboard' },
  { name: 'Rewards', path: '/rewards' },
  { name: 'Profile', path: '/profile' },
]

export default function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Box
      as="nav"
      bg="rgba(255, 255, 255, 0.1)"
      backdropFilter="blur(20px)"
      borderBottom="1px solid rgba(255, 255, 255, 0.1)"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Container maxW="container.xl">
        <Flex align="center" justify="space-between" py={4}>
          {/* Logo */}
          <Flex align="center" gap={2} cursor="pointer" onClick={() => navigate('/')}>
            <MotionBox
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <FaLeaf color="#00E676" size="28px" />
            </MotionBox>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              bgGradient="linear(to-r, #00E676, #00B8D4)"
              bgClip="text"
              fontFamily="Poppins"
            >
              EcoVerse
            </Text>
          </Flex>

          {/* Desktop Navigation */}
          <HStack gap={8} display={{ base: 'none', md: 'flex' }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                color={location.pathname === item.path ? '#00E676' : 'rgba(255, 255, 255, 0.8)'}
                fontWeight={location.pathname === item.path ? 'bold' : 'normal'}
                _hover={{
                  color: '#00E676',
                  bg: 'rgba(0, 230, 118, 0.1)',
                }}
                onClick={() => navigate(item.path)}
                transition="all 0.2s"
              >
                {item.name}
              </Button>
            ))}
          </HStack>

          {/* Mobile Menu Toggle */}
          <Button
            display={{ base: 'flex', md: 'none' }}
            variant="ghost"
            color="white"
            onClick={() => setIsOpen(!isOpen)}
            p={0}
            minW="auto"
          >
            <FaBars />
          </Button>
        </Flex>

        {/* Mobile Navigation */}
        {isOpen && (
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            display={{ base: 'block', md: 'none' }}
            pb={4}
          >
            <VStack gap={4} align="start">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  color={location.pathname === item.path ? '#00E676' : 'rgba(255, 255, 255, 0.8)'}
                  fontWeight={location.pathname === item.path ? 'bold' : 'normal'}
                  _hover={{
                    color: '#00E676',
                    bg: 'rgba(0, 230, 118, 0.1)',
                  }}
                  onClick={() => {
                    navigate(item.path)
                    setIsOpen(false)
                  }}
                  justifyContent="flex-start"
                  w="100%"
                >
                  {item.name}
                </Button>
              ))}
            </VStack>
          </MotionBox>
        )}
      </Container>
    </Box>
  )
}
