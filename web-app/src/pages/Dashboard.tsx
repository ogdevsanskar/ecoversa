import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  Badge,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import {
  FaLightbulb,
  FaWater,
  FaRecycle,
  FaLeaf,
  FaFire,
  FaBolt,
  FaCloudSun,
  FaTrophy,
} from 'react-icons/fa'

const MotionBox = motion(Box)

const StatCard = ({ 
  icon: IconComponent, 
  title, 
  value, 
  unit, 
  change, 
  isPositive, 
  color,
  delay = 0 
}: {
  icon: React.ComponentType
  title: string
  value: string
  unit: string
  change: string
  isPositive: boolean
  color: string
  delay?: number
}) => (
  <MotionBox
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -5, scale: 1.02 }}
  >
    <Box
      bg="rgba(255, 255, 255, 0.1)"
      backdropFilter="blur(20px)"
      border="1px solid rgba(255, 255, 255, 0.2)"
      borderRadius="20px"
      p={6}
      height="100%"
      _hover={{
        bg: "rgba(255, 255, 255, 0.15)",
        borderColor: color,
        boxShadow: `0 20px 40px ${color}33`,
      }}
      transition="all 0.3s ease"
    >
      <HStack justify="space-between" mb={4}>
        <Box p={3} bg={`${color}22`} borderRadius="12px">
          <Icon as={IconComponent} boxSize={6} color={color} />
        </Box>
        <Badge
          colorScheme={isPositive ? 'green' : 'red'}
          variant="subtle"
          fontSize="xs"
        >
          {isPositive ? '+' : ''}{change}
        </Badge>
      </HStack>
      <VStack align="start" gap={1}>
        <Text color="rgba(255, 255, 255, 0.8)" fontSize="sm" fontWeight="500">
          {title}
        </Text>
        <HStack align="baseline">
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="white"
            lineHeight="1"
          >
            {value}
          </Text>
          <Text color="rgba(255, 255, 255, 0.6)" fontSize="sm">
            {unit}
          </Text>
        </HStack>
      </VStack>
    </Box>
  </MotionBox>
)

const ProgressCard = ({ 
  title, 
  value, 
  max, 
  percentage, 
  color, 
  icon: IconComponent,
  delay = 0 
}: {
  title: string
  value: number
  max: number
  percentage: number
  color: string
  icon: React.ComponentType
  delay?: number
}) => (
  <MotionBox
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ scale: 1.02 }}
  >
    <Box
      bg="rgba(255, 255, 255, 0.1)"
      backdropFilter="blur(20px)"
      border="1px solid rgba(255, 255, 255, 0.2)"
      borderRadius="20px"
      p={6}
      textAlign="center"
      _hover={{
        bg: "rgba(255, 255, 255, 0.15)",
        borderColor: color,
      }}
      transition="all 0.3s ease"
    >
      <VStack gap={4}>
        <HStack justify="center" gap={3}>
          <Icon as={IconComponent} boxSize={5} color={color} />
          <Text color="white" fontWeight="600" fontSize="lg">
            {title}
          </Text>
        </HStack>
        
        <Box width="100%">
          <VStack gap={2}>
            <Text color="white" fontSize="xl" fontWeight="bold">
              {percentage}%
            </Text>
            <Box width="100%" position="relative">
              <Box
                height="8px"
                bg="rgba(255, 255, 255, 0.1)"
                borderRadius="full"
                overflow="hidden"
              >
                <Box
                  height="100%"
                  width={`${percentage}%`}
                  background={`linear-gradient(90deg, ${color} 0%, ${color}AA 100%)`}
                  borderRadius="full"
                  transition="width 0.6s ease"
                />
              </Box>
            </Box>
            <Text color="rgba(255, 255, 255, 0.6)" fontSize="xs">
              {value}/{max}
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  </MotionBox>
)

export default function Dashboard() {
  return (
    <Container maxW="container.xl" py={8}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        mb={8}
      >
        <VStack align="start" gap={2}>
          <Heading
            fontSize={{ base: '2xl', md: '4xl' }}
            fontWeight="bold"
            color="white"
            fontFamily="Poppins"
          >
            Welcome back, Eco Warrior! 🌱
          </Heading>
          <Text color="rgba(255, 255, 255, 0.8)" fontSize="lg">
            Here's your sustainability impact overview
          </Text>
        </VStack>
      </MotionBox>

      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} mb={8}>
        <StatCard
          icon={FaLightbulb}
          title="Energy Saved"
          value="2,847"
          unit="kWh"
          change="12.5%"
          isPositive={true}
          color="#FFD700"
          delay={0.1}
        />
        <StatCard
          icon={FaWater}
          title="Water Conserved"
          value="15,329"
          unit="Liters"
          change="8.3%"
          isPositive={true}
          color="#00B8D4"
          delay={0.2}
        />
        <StatCard
          icon={FaRecycle}
          title="Waste Recycled"
          value="892"
          unit="kg"
          change="15.7%"
          isPositive={true}
          color="#00E676"
          delay={0.3}
        />
        <StatCard
          icon={FaLeaf}
          title="Carbon Offset"
          value="5.2"
          unit="tons CO₂"
          change="3.1%"
          isPositive={false}
          color="#7C4DFF"
          delay={0.4}
        />
      </SimpleGrid>

      {/* Progress Section */}
      <MotionBox
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        mb={8}
      >
        <Heading
          fontSize={{ base: 'xl', md: '2xl' }}
          fontWeight="bold"
          color="white"
          mb={6}
          fontFamily="Poppins"
        >
          Monthly Goals Progress
        </Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
          <ProgressCard
            title="Energy Goal"
            value={2847}
            max={4000}
            percentage={71}
            color="#FFD700"
            icon={FaBolt}
            delay={0.1}
          />
          <ProgressCard
            title="Water Goal"
            value={15329}
            max={20000}
            percentage={77}
            color="#00B8D4"
            icon={FaWater}
            delay={0.2}
          />
          <ProgressCard
            title="Recycling Goal"
            value={892}
            max={1000}
            percentage={89}
            color="#00E676"
            icon={FaRecycle}
            delay={0.3}
          />
          <ProgressCard
            title="Carbon Goal"
            value={5}
            max={8}
            percentage={63}
            color="#FF6B6B"
            icon={FaFire}
            delay={0.4}
          />
        </SimpleGrid>
      </MotionBox>

      {/* Recent Achievements */}
      <MotionBox
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Heading
          fontSize={{ base: 'xl', md: '2xl' }}
          fontWeight="bold"
          color="white"
          mb={6}
          fontFamily="Poppins"
        >
          Recent Achievements 🏆
        </Heading>
        
        <Box
          bg="rgba(255, 255, 255, 0.1)"
          backdropFilter="blur(20px)"
          border="1px solid rgba(255, 255, 255, 0.2)"
          borderRadius="20px"
          p={6}
        >
          <VStack gap={4} align="stretch">
            <HStack>
              <Box p={2} bg="rgba(0, 230, 118, 0.2)" borderRadius="8px">
                <Icon as={FaTrophy} boxSize={4} color="#00E676" />
              </Box>
              <VStack align="start" gap={0}>
                <Text color="white" fontWeight="600">
                  Energy Saver Badge
                </Text>
                <Text color="rgba(255, 255, 255, 0.6)" fontSize="sm">
                  Saved 1000+ kWh this month
                </Text>
              </VStack>
            </HStack>
            
            <HStack>
              <Box p={2} bg="rgba(0, 184, 212, 0.2)" borderRadius="8px">
                <Icon as={FaCloudSun} boxSize={4} color="#00B8D4" />
              </Box>
              <VStack align="start" gap={0}>
                <Text color="white" fontWeight="600">
                  Sustainability Streak
                </Text>
                <Text color="rgba(255, 255, 255, 0.6)" fontSize="sm">
                  15 days of eco-friendly actions
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </Box>
      </MotionBox>
    </Container>
  )
}
