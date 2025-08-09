import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Challenges from './pages/Challenges'
import Leaderboard from './pages/Leaderboard'
import Rewards from './pages/Rewards'
import Profile from './pages/Profile'

function App() {
  return (
    <Box
      minHeight="100vh"
      bgGradient="linear(135deg, #0D1421 0%, #1A2332 25%, #2D3A4B 50%, #1A2332 75%, #0D1421 100%)"
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(0, 230, 118, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(0, 184, 212, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(124, 77, 255, 0.1) 0%, transparent 50%)
        `,
        zIndex: -1,
      }}
    >
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </Router>
    </Box>
  )
}

export default App