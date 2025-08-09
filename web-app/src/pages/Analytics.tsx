import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import {
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaLightbulb,
  FaWater,
  FaRecycle,
  FaLeaf,
} from 'react-icons/fa'

const MotionBox = motion(Box)

const TrendCard = ({ 
  icon: IconComponent, 
  title, 
  value, 
  trend, 
  trendValue, 
  isPositive, 
  color,
  delay = 0 
}: {
  icon: React.ComponentType
  title: string
  value: string
  trend: string
  trendValue: string
  isPositive: boolean
  color: string
  delay?: number
}) => (
  <MotionBox
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -5 }}
  >
    <Box
      bg="rgba(255, 255, 255, 0.1)"
      backdropFilter="blur(20px)"
      border="1px solid rgba(255, 255, 255, 0.2)"
      borderRadius="20px"
      p={6}
      _hover={{
        bg: "rgba(255, 255, 255, 0.15)",
        borderColor: color,
        boxShadow: `0 20px 40px ${color}33`,
      }}
      transition="all 0.3s ease"
    >
      <HStack justify="space-between" mb={4}>
        <HStack>
          <Box p={3} bg={`${color}22`} borderRadius="12px">
            <Icon as={IconComponent} boxSize={6} color={color} />
          </Box>
          <VStack align="start" gap={0}>
            <Text color="rgba(255, 255, 255, 0.8)" fontSize="sm">
              {title}
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="white">
              {value}
            </Text>
          </VStack>
        </HStack>
        <VStack align="end" gap={0}>
          <HStack>
            <Icon 
              as={isPositive ? FaArrowUp : FaArrowDown} 
              boxSize={4} 
              color={isPositive ? "#00E676" : "#FF6B6B"} 
            />
            <Text
              fontSize="sm"
              fontWeight="600"
              color={isPositive ? "#00E676" : "#FF6B6B"}
            >
              {trendValue}
            </Text>
          </HStack>
          <Text color="rgba(255, 255, 255, 0.6)" fontSize="xs">
            {trend}
          </Text>
        </VStack>
      </HStack>
    </Box>
  </MotionBox>
)

export default function Analytics() {
  return (
    <Container maxW="container.xl" py={8}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        mb={8}
      >
        <VStack align="start" gap={2}>
          <HStack>
            <Icon as={FaChartLine} boxSize={8} color="#00E676" />
            <Heading
              fontSize={{ base: '2xl', md: '4xl' }}
              fontWeight="bold"
              color="white"
              fontFamily="Poppins"
            >
              Analytics Dashboard
            </Heading>
          </HStack>
          <Text color="rgba(255, 255, 255, 0.8)" fontSize="lg">
            Deep insights into your sustainability journey
          </Text>
        </VStack>
      </MotionBox>

      {/* Trend Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} mb={8}>
        <TrendCard
          icon={FaLightbulb}
          title="Energy Usage"
          value="2,847 kWh"
          trend="vs last month"
          trendValue="+12.5%"
          isPositive={true}
          color="#FFD700"
          delay={0.1}
        />
        <TrendCard
          icon={FaWater}
          title="Water Conservation"
          value="15,329 L"
          trend="vs last month"
          trendValue="+8.3%"
          isPositive={true}
          color="#00B8D4"
          delay={0.2}
        />
        <TrendCard
          icon={FaRecycle}
          title="Waste Recycled"
          value="892 kg"
          trend="vs last month"
          trendValue="+15.7%"
          isPositive={true}
          color="#00E676"
          delay={0.3}
        />
        <TrendCard
          icon={FaLeaf}
          title="Carbon Footprint"
          value="5.2 tons"
          trend="vs last month"
          trendValue="-3.1%"
          isPositive={true}
          color="#7C4DFF"
          delay={0.4}
        />
      </SimpleGrid>

      {/* Chart Placeholder */}
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
          Detailed Analytics
        </Heading>
        
        <Box
          bg="rgba(255, 255, 255, 0.1)"
          backdropFilter="blur(20px)"
          border="1px solid rgba(255, 255, 255, 0.2)"
          borderRadius="20px"
          p={8}
          minHeight="300px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <VStack gap={4}>
            <Icon as={FaChartLine} boxSize={12} color="#00E676" />
            <Text color="white" fontSize="lg" fontWeight="600">
              Advanced Charts Coming Soon
            </Text>
            <Text color="rgba(255, 255, 255, 0.6)" textAlign="center">
              Interactive charts and detailed analytics will be available in the next update.
            </Text>
          </VStack>
        </Box>
      </MotionBox>
    </Container>
  )
}
