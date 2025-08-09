# EcoVerse – Virtual Smart Campus Sustainability System

A comprehensive smart sustainability platform that tracks, analyzes, and optimizes campus sustainability metrics while engaging the community through rewards and gamification.

## 🎯 Features

- **IoT Simulation**: Real-time environmental data simulation (electricity, water, waste, air quality)
- **AI/ML Engine**: Predictive analytics, anomaly detection, and personalized eco-tips
- **Web3 Rewards**: Token and NFT-based incentive system
- **Data Visualization**: Interactive dashboards and analytics
- **Mobile & Web Apps**: Cross-platform user interfaces with stunning animations
- **Admin Portal**: Comprehensive management dashboard

## 🏗️ Architecture

```
EcoVerse/
├── iot-simulation/         # Python IoT data simulation
├── ai-ml-engine/           # ML models & Flask API
├── web3-contracts/         # Solidity smart contracts
├── backend/                # Firebase backend services
├── web-app/                # React frontend with animations
├── mobile-app/             # Flutter mobile application
├── dashboard/              # Data science dashboard
├── admin-portal/           # Admin management interface
└── assets/                 # Images, icons, animations
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Flutter SDK
- Firebase CLI
- MetaMask wallet

### Setup Instructions

1. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd EcoVerse
   ```

2. **IoT Simulation**
   ```bash
   cd iot-simulation
   pip install -r requirements.txt
   python sensor_simulator.py
   ```

3. **AI/ML Engine**
   ```bash
   cd ai-ml-engine
   pip install -r requirements.txt
   python app.py
   ```

4. **Web Application**
   ```bash
   cd web-app
   npm install
   npm run dev
   ```

5. **Web3 Contracts**
   ```bash
   cd web3-contracts
   npm install
   npx hardhat deploy --network mumbai
   ```

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Framer Motion, Lottie
- **Mobile**: Flutter, Provider
- **Backend**: Firebase, Node.js, Flask
- **AI/ML**: Python, Scikit-learn, TensorFlow
- **Web3**: Solidity, Hardhat, Polygon Mumbai
- **Database**: Firestore, IPFS
- **Visualization**: D3.js, Plotly, Chart.js

## 📊 Module Details

### IoT Simulation
Generates realistic environmental data using patterns and external APIs:
- Electricity consumption (50-1000 kWh)
- Water usage (100-5000L)
- Air Quality Index (50-300)
- Waste production (1-100kg)

### AI/ML Engine
- Resource usage forecasting
- Anomaly detection
- Personalized eco-recommendations
- Smart optimization suggestions

### Web3 Rewards
- **GreenToken (GTN)**: ERC-20 utility token
- **EcoAchievements**: ERC-721 NFT collection
- Automated reward distribution
- IPFS metadata storage

## 🎮 Gamification Features

- **EcoPoints**: Earned through sustainable actions
- **Leaderboards**: Campus-wide competitions
- **Challenges**: AI-generated eco-tasks
- **NFT Gallery**: Collectible achievement badges
- **Token Rewards**: Tradeable utility tokens

## 🎨 UI/UX Highlights

- Modern, responsive design
- Smooth animations with Framer Motion
- Interactive data visualizations
- Gamified user experience
- Accessibility-focused development

## 🔧 Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run test`: Run test suite
- `npm run lint`: Code linting

### Environment Variables

Create `.env` files in respective modules:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id

# AI/ML API
REACT_APP_ML_API_URL=http://localhost:5000

# Web3 Configuration
REACT_APP_CONTRACT_ADDRESS=deployed_contract_address
REACT_APP_NETWORK_ID=80001
```

## 📝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, email support@ecoverse.com or join our Discord community.

---

Built with ❤️ for a sustainable future 🌱
