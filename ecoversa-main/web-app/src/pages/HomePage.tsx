import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  FaLeaf,
  FaLightbulb,
  FaTrophy,
  FaCoins,
  FaChartLine,
  FaUsers,
  FaRecycle,
  FaWater,
} from 'react-icons/fa'

const MotionBox = motion(Box)
const MotionFlex = motion(Flex)

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: {
  icon: React.ComponentType<{ size?: string; color?: string }>
  title: string
  description: string
  delay?: number
}) => (
  <MotionBox
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -10, scale: 1.02 }}
  >
    <Box
      bg="rgba(255, 255, 255, 0.1)"
      backdropFilter="blur(20px)"
      border="1px solid rgba(255, 255, 255, 0.2)"
      borderRadius="20px"
      p={8}
      textAlign="center"
      height="100%"
      _hover={{
        bg: "rgba(255, 255, 255, 0.15)",
        borderColor: "#00E676",
        boxShadow: "0 20px 40px rgba(0, 230, 118, 0.2)",
      }}
      transition="all 0.3s ease"
    >
      <MotionBox
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
        mb={4}
      >
        <Icon size="48px" color="#00E676" />
      </MotionBox>
      <Heading size="lg" color="white" mb={3} fontFamily="Poppins">
        {title}
      </Heading>
      <Text color="rgba(255, 255, 255, 0.8)" lineHeight="1.6">
        {description}
      </Text>
    </Box>
  </MotionBox>
)

const StatCard = ({ icon: Icon, number, label, delay = 0 }: {
  icon: React.ComponentType<{ size?: string; color?: string }>
  number: string
  label: string
  delay?: number
}) => (
  <MotionBox
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.05 }}
  >
    <Box
      bg="rgba(255, 255, 255, 0.1)"
      backdropFilter="blur(10px)"
      border="1px solid rgba(255, 255, 255, 0.2)"
      borderRadius="16px"
      p={6}
      textAlign="center"
    >
      <Flex justify="center" mb={2}>
        <Icon size="24px" color="#00E676" />
      </Flex>
      <Text
        fontSize="2xl"
        fontWeight="bold"
        color="white"
        bgGradient="linear(to-r, #00E676, #00B8D4)"
        bgClip="text"
        mb={1}
      >
        {number}
      </Text>
      <Text color="rgba(255, 255, 255, 0.8)" fontSize="sm">
        {label}
      </Text>
    </Box>
  </MotionBox>
)

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <Box>
      {/* Hero Section */}
      <Container maxW="container.xl" py={{ base: 16, md: 24 }}>
        <MotionFlex
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          direction="column"
          align="center"
          textAlign="center"
          mb={16}
        >
          <MotionBox
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            mb={6}
          >
            <FaLeaf size="80px" color="#00E676" />
          </MotionBox>
          
          <Heading
            fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
            fontWeight="bold"
            bgGradient="linear(to-r, #00E676, #00B8D4, #7C4DFF)"
            bgClip="text"
            mb={6}
            fontFamily="Poppins"
            lineHeight="1.2"
          >
            Welcome to EcoVerse
          </Heading>
          
          <Text
            fontSize={{ base: 'lg', md: 'xl' }}
            color="rgba(255, 255, 255, 0.8)"
            maxW="600px"
            mb={8}
            lineHeight="1.6"
          >
            Transform your campus into a sustainable smart environment. Monitor resources, 
            earn rewards, and compete in eco-friendly challenges powered by AI and blockchain technology.
          </Text>
          
          <HStack gap={4} flexWrap="wrap" justify="center">
            <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate("/dashboard")}
                size="lg"
                px={8}
                bg="linear-gradient(135deg, #00E676 0%, #00C853 100%)"
                color="white"
                _hover={{
                  bg: "linear-gradient(135deg, #00C853 0%, #00A843 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 20px 40px rgba(0, 230, 118, 0.4)",
                }}
                transition="all 0.3s ease"
                fontWeight="600"
                borderRadius="12px"
              >
                Start Your Eco Journey
              </Button>
            </MotionBox>
            
            <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate("/analytics")}
                size="lg"
                px={8}
                bg="rgba(255, 255, 255, 0.1)"
                color="white"
                border="2px solid rgba(255, 255, 255, 0.3)"
                backdropFilter="blur(10px)"
                _hover={{
                  bg: "rgba(255, 255, 255, 0.2)",
                  borderColor: "#00E676",
                  transform: "translateY(-2px)",
                }}
                transition="all 0.3s ease"
                fontWeight="600"
                borderRadius="12px"
              >
                View Analytics
              </Button>
            </MotionBox>
          </HStack>
        </MotionFlex>

        {/* Stats Section */}
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={6} mb={20}>
          <StatCard
            icon={FaLightbulb}
            number="2,847"
            label="kWh Saved"
            delay={0.1}
          />
          <StatCard
            icon={FaWater}
            number="15,329"
            label="Liters Conserved"
            delay={0.2}
          />
          <StatCard
            icon={FaRecycle}
            number="892"
            label="kg Recycled"
            delay={0.3}
          />
          <StatCard
            icon={FaUsers}
            number="1,247"
            label="Active Users"
            delay={0.4}
          />
        </SimpleGrid>

        {/* Features Section */}
        <VStack gap={12} mb={20}>
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            textAlign="center"
          >
            <Heading
              fontSize={{ base: '3xl', md: '4xl' }}
              fontWeight="bold"
              color="white"
              mb={4}
              fontFamily="Poppins"
            >
              Smart Sustainability Features
            </Heading>
            <Text
              fontSize="lg"
              color="rgba(255, 255, 255, 0.7)"
              maxW="600px"
              mx="auto"
            >
              Discover how EcoVerse combines IoT simulation, AI predictions, 
              and blockchain rewards to create the ultimate sustainability platform.
            </Text>
          </MotionBox>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8} width="100%">
            <FeatureCard
              icon={FaChartLine}
              title="AI-Powered Analytics"
              description="Get intelligent insights and predictions about resource usage patterns with our advanced machine learning algorithms."
              delay={0.1}
            />
            <FeatureCard
              icon={FaCoins}
              title="Blockchain Rewards"
              description="Earn GreenTokens (GTN) and collect unique NFT achievements for your sustainable actions and milestones."
              delay={0.2}
            />
            <FeatureCard
              icon={FaTrophy}
              title="Gamified Challenges"
              description="Participate in eco-friendly challenges and compete on leaderboards to boost your sustainability impact."
              delay={0.3}
            />
          </SimpleGrid>
        </VStack>

        {/* Call to Action */}
        <MotionBox
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          textAlign="center"
          bg="rgba(0, 230, 118, 0.1)"
          border="1px solid rgba(0, 230, 118, 0.3)"
          borderRadius="24px"
          p={{ base: 8, md: 12 }}
          backdropFilter="blur(20px)"
        >
          <Heading
            fontSize={{ base: '2xl', md: '3xl' }}
            fontWeight="bold"
            color="white"
            mb={4}
            fontFamily="Poppins"
          >
            Ready to Make a Difference?
          </Heading>
          <Text
            fontSize="lg"
            color="rgba(255, 255, 255, 0.8)"
            mb={6}
            maxW="500px"
            mx="auto"
          >
            Join thousands of eco-warriors building a sustainable future. 
            Start tracking your impact today!
          </Text>
          <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => navigate("/challenges")}
              size="lg"
              px={8}
              bg="linear-gradient(135deg, #00E676 0%, #00C853 100%)"
              color="white"
              _hover={{
                bg: "linear-gradient(135deg, #00C853 0%, #00A843 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 20px 40px rgba(0, 230, 118, 0.4)",
              }}
              transition="all 0.3s ease"
              fontWeight="600"
              borderRadius="12px"
            >
              Explore Challenges
            </Button>
          </MotionBox>
        </MotionBox>
      </Container>
    </Box>
  )
}
