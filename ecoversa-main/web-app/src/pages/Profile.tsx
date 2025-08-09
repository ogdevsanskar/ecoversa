import React from 'react'
import { Box, Text } from '@chakra-ui/react'

const Profile: React.FC = () => {
  return (
    <Box p="8" color="white">
      <Text fontSize="2xl" fontWeight="bold" mb="4">
        Profile
      </Text>
      <Text opacity="0.8">
        User profile will be implemented here.
      </Text>
    </Box>
  )
}

export default Profile
