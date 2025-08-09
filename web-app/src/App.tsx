import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from './theme'
// Ensure the Layout component exists at the specified path.
// If the file is named differently or located elsewhere, update the import path accordingly.
import Layout from './components/layout/Layout';
import {
  HomePage,
  Dashboard,
  Analytics,
  Challenges,
  Leaderboard,
  Rewards,
  Profile,
} from './pages'

function App() {
  return (
    <ChakraProvider value={theme}>
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
    </ChakraProvider>
  )
}

export default App
