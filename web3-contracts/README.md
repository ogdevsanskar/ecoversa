# EcoVerse Smart Contracts

## Overview
This directory contains the Web3 smart contracts for the EcoVerse platform, implementing blockchain-based rewards and achievements.

## Smart Contracts

### 1. GreenToken.sol
- **Purpose**: ERC-20 token for rewarding eco-friendly actions
- **Features**: 
  - Mintable tokens for achievements
  - Burnable for redemptions
  - Capped supply for sustainability
  - Role-based access control

### 2. EcoAchievements.sol
- **Purpose**: ERC-721 NFT achievements and badges
- **Features**:
  - Unique achievement NFTs
  - Metadata for achievement details
  - Soulbound tokens (non-transferable)
  - Achievement verification system

## Deployment

### Local Development
```bash
# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to local network
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

### Testnet Deployment
```bash
# Deploy to Polygon Mumbai testnet
npx hardhat run scripts/deploy.js --network mumbai

# Verify contracts
npx hardhat verify --network mumbai <contract_address>
```

## Token Economics

### Green Token (GRT)
- **Symbol**: GRT
- **Decimals**: 18
- **Total Supply**: 1,000,000,000 GRT
- **Distribution**:
  - 40% - User rewards and achievements
  - 20% - Campus sustainability initiatives
  - 20% - Development and operations
  - 10% - Community treasury
  - 10% - Team and advisors

### Reward System
- **Energy Saving**: 10-50 GRT per kWh saved
- **Water Conservation**: 5-25 GRT per liter saved
- **Waste Reduction**: 20-100 GRT per kg reduced
- **Participation**: 1-10 GRT per action
- **Achievements**: 100-1000 GRT per milestone

## Achievement Categories

### Energy Efficiency
- ⚡ **Power Saver**: Reduce electricity usage by 10%
- 🔋 **Energy Champion**: Reduce electricity usage by 25%
- ⭐ **Energy Master**: Reduce electricity usage by 50%

### Water Conservation
- 💧 **Water Saver**: Reduce water usage by 10%
- 🌊 **Water Champion**: Reduce water usage by 25%
- 🏆 **Water Master**: Reduce water usage by 50%

### Waste Reduction
- ♻️ **Waste Reducer**: Reduce waste by 10%
- 🗂️ **Waste Champion**: Reduce waste by 25%
- 🏅 **Waste Master**: Reduce waste by 50%

### Community Impact
- 👥 **Team Player**: Participate in 10 group challenges
- 📢 **Eco Advocate**: Refer 5 new users
- 🌱 **Campus Leader**: Top 10% on monthly leaderboard

## API Integration

### Frontend Integration
```javascript
import { ethers } from 'ethers';
import GreenTokenABI from './abis/GreenToken.json';
import EcoAchievementsABI from './abis/EcoAchievements.json';

// Connect to contract
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const greenToken = new ethers.Contract(contractAddress, GreenTokenABI, signer);

// Award tokens
await greenToken.mint(userAddress, ethers.utils.parseEther("50"));

// Check balance
const balance = await greenToken.balanceOf(userAddress);
```

### Backend Integration
The smart contracts integrate with the AI/ML analytics system to automatically reward users based on:
- Real-time usage data
- Achievement milestones
- Community participation
- Verified sustainability actions

## Security Features

### Access Control
- **Owner**: Can mint tokens and manage system
- **Minter**: Authorized addresses that can mint tokens
- **Verifier**: Can verify and award achievements

### Safety Mechanisms
- Rate limiting for token minting
- Maximum daily rewards per user
- Achievement verification requirements
- Emergency pause functionality

## Testing

### Unit Tests
- Token minting and burning
- Achievement creation and verification
- Access control mechanisms
- Edge cases and error conditions

### Integration Tests
- Frontend wallet connection
- Backend automated rewards
- Cross-contract interactions
- Gas optimization validation

## Gas Optimization

### Efficient Patterns
- Batch operations for multiple users
- Efficient data structures
- Minimal storage updates
- Event-based tracking

### Estimated Gas Costs
- Token mint: ~45,000 gas
- Achievement award: ~65,000 gas
- Batch operations: ~30,000 gas per item

## Monitoring and Analytics

### On-chain Events
- `TokensMinted(address user, uint256 amount, string reason)`
- `AchievementEarned(address user, uint256 tokenId, string category)`
- `RewardClaimed(address user, uint256 amount, string type)`

### Analytics Dashboard
Track key metrics:
- Total tokens minted
- Active users earning rewards
- Achievement distribution
- Sustainability impact metrics
