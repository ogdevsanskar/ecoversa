import { Box, Container, Heading, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

export default function Leaderboard() {
  return (
    <Container maxW="container.xl" py={8}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Heading color="white" mb={4}>
          Leaderboard
        </Heading>
        <Text color="rgba(255, 255, 255, 0.8)">
          Community leaderboard will be implemented here.
        </Text>
      </MotionBox>
    </Container>
  )
}
