import {
  Box,
  Container,
  Flex,
  HStack,
  Text,
  Button,
  VStack,
  useBreakpointValue,
} from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FaLeaf,
  FaHome,
  FaChartPie,
  FaChartLine,
  FaTrophy,
  FaGift,
  FaUser,
  FaCoins,
} from 'react-icons/fa'

const MotionBox = motion(Box)

interface NavLinkProps {
  to: string
  icon: React.ComponentType<{ size?: string }>
  children: string
  isActive?: boolean
  isMobile?: boolean
  onClick?: () => void
}

const NavLink = ({ to, icon: Icon, children, isActive, isMobile, onClick }: NavLinkProps) => (
  <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Link to={to} style={{ textDecoration: 'none' }}>
      <Button
        variant="ghost"
        color={isActive ? '#00E676' : 'rgba(255, 255, 255, 0.8)'}
        bg={isActive ? 'rgba(0, 230, 118, 0.1)' : 'transparent'}
        border={isActive ? '1px solid rgba(0, 230, 118, 0.3)' : '1px solid transparent'}
        _hover={{
          color: '#00E676',
          bg: 'rgba(0, 230, 118, 0.1)',
          borderColor: 'rgba(0, 230, 118, 0.3)',
          transform: 'translateY(-2px)',
        }}
        borderRadius="12px"
        fontWeight="500"
        transition="all 0.3s ease"
        size={isMobile ? 'lg' : 'md'}
        justifyContent={isMobile ? 'flex-start' : 'center'}
        width={isMobile ? '100%' : 'auto'}
        onClick={onClick}
      >
        <Icon size="18px" />
        <Text ml={2}>{children}</Text>
      </Button>
    </Link>
  </MotionBox>
)

export default function Navigation() {
  const location = useLocation()
  const isMobile = useBreakpointValue({ base: true, md: false })

  const navItems = [
    { to: '/', icon: FaHome, label: 'Home' },
    { to: '/dashboard', icon: FaChartPie, label: 'Dashboard' },
    { to: '/analytics', icon: FaChartLine, label: 'Analytics' },
    { to: '/challenges', icon: FaTrophy, label: 'Challenges' },
    { to: '/leaderboard', icon: FaCoins, label: 'Leaderboard' },
    { to: '/rewards', icon: FaGift, label: 'Rewards' },
    { to: '/profile', icon: FaUser, label: 'Profile' },
  ]

  return (
    <Box
      position="sticky"
      top={0}
      zIndex={1000}
      bg="rgba(13, 20, 33, 0.95)"
      backdropFilter="blur(20px)"
      borderBottom="1px solid rgba(255, 255, 255, 0.1)"
    >
      <Container maxW="container.xl">
        <Flex align="center" justify="space-between" py={4}>
          {/* Logo */}
          <MotionBox whileHover={{ scale: 1.05 }}>
            <Flex align="center" gap={3}>
              <MotionBox
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <FaLeaf size="32px" color="#00E676" />
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
          </MotionBox>

          {/* Desktop Navigation */}
          {!isMobile && (
            <HStack gap={2}>
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  isActive={location.pathname === item.to}
                >
                  {item.label}
                </NavLink>
              ))}
            </HStack>
          )}

          {/* Mobile Navigation - Simplified */}
          {isMobile && (
            <Text color="white" fontSize="sm">
              Menu
            </Text>
          )}
        </Flex>

        {/* Mobile Navigation Links */}
        {isMobile && (
          <VStack gap={2} pb={4} align="stretch">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                icon={item.icon}
                isActive={location.pathname === item.to}
                isMobile
              >
                {item.label}
              </NavLink>
            ))}
          </VStack>
        )}
      </Container>
    </Box>
  )
}