import React from 'react'
import { Box, Text } from '@chakra-ui/react'

const Challenges: React.FC = () => {
  return (
    <Box p="8" color="white" minH="calc(100vh - 160px)">
      <Text fontSize="3xl" fontWeight="bold" mb="6" fontFamily="Poppins">
        🌿 Eco Challenges
      </Text>
      <Box 
        p="6" 
        className="glass-card"
        borderRadius="20px"
      >
        <Text fontSize="lg" opacity="0.9" mb="4">
          Join sustainability challenges and make a positive impact on our planet!
        </Text>
        <Text opacity="0.7">
          🚀 Coming Soon: Interactive sustainability challenges, leaderboards, and rewards
        </Text>
      </Box>
    </Box>
  )
}

export default Challenges
