import React, { useState } from 'react'
import {
  Box,
  Flex,
  Text,
  Button,
  Container,
  Link,
  Stack,
} from '@chakra-ui/react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { FaLeaf, FaBars, FaTimes } from 'react-icons/fa'

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Challenges', path: '/challenges' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Rewards', path: '/rewards' },
    { name: 'Profile', path: '/profile' },
  ]

  const NavLink = ({ children, to, ...props }: any) => {
    const isActive = location.pathname === to
    return (
      <Link
        as={RouterLink}
        to={to}
        px={3}
        py={2}
        rounded="md"
        color={isActive ? 'green.500' : 'gray.700'}
        fontWeight={isActive ? 'semibold' : 'normal'}
        _hover={{
          textDecoration: 'none',
          color: 'green.500',
          bg: 'green.50'
        }}
        {...props}
      >
        {children}
      </Link>
    )
  }

  return (
    <>
      <Box bg="white" px={4} shadow="md" borderBottom="1px" borderColor="gray.200">
        <Container maxW="7xl">
          <Flex h={16} alignItems="center" justifyContent="space-between">
            {/* Logo */}
            <Flex alignItems="center" gap={3}>
              <Box color="green.500">
                <FaLeaf size="28" />
              </Box>
              <Text fontWeight="bold" fontSize="2xl" color="green.600">
                EcoVerse
              </Text>
            </Flex>

            {/* Desktop Navigation */}
            <Stack 
              as="nav" 
              direction="row" 
              gap={1} 
              display={{ base: 'none', md: 'flex' }}
            >
              {navItems.map((item) => (
                <NavLink key={item.path} to={item.path}>
                  {item.name}
                </NavLink>
              ))}
            </Stack>

            {/* Desktop CTA */}
            <Stack 
              direction="row" 
              gap={4} 
              display={{ base: 'none', md: 'flex' }}
            >
              <Button colorScheme="green" size="sm" rounded="full">
                Connect Wallet
              </Button>
            </Stack>

            {/* Mobile menu button */}
            <Button
              display={{ md: 'none' }}
              onClick={() => setIsOpen(!isOpen)}
              variant="ghost"
              p={2}
            >
              {isOpen ? <FaTimes size="20" /> : <FaBars size="20" />}
            </Button>
          </Flex>
        </Container>

        {/* Mobile Navigation */}
        {isOpen && (
          <Box
            display={{ base: 'block', md: 'none' }}
            pb={4}
            px={4}
            bg="white"
            borderTop="1px"
            borderColor="gray.200"
          >
            <Stack gap={2} mt={4}>
              {navItems.map((item) => (
                <NavLink 
                  key={item.path} 
                  to={item.path} 
                  onClick={() => setIsOpen(false)}
                  w="full"
                  display="block"
                >
                  {item.name}
                </NavLink>
              ))}
              <Button 
                colorScheme="green" 
                size="sm" 
                mt={4} 
                rounded="full"
                w="full"
              >
                Connect Wallet
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
    </>
  )
}

export default Navigation
