#!/bin/bash

# EcoVerse Environment Setup Script
# This script helps you set up environment variables for development and production

set -e

echo "🌿 EcoVerse Environment Setup"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to prompt for input
prompt_input() {
    local prompt="$1"
    local default="$2"
    local var_name="$3"
    
    if [ -n "$default" ]; then
        echo -e "${BLUE}$prompt (default: $default):${NC}"
    else
        echo -e "${BLUE}$prompt:${NC}"
    fi
    
    read -r input
    if [ -z "$input" ] && [ -n "$default" ]; then
        input="$default"
    fi
    
    eval "$var_name='$input'"
}

echo -e "${GREEN}Setting up environment variables for EcoVerse platform${NC}"
echo

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${YELLOW}Warning: Firebase CLI not found. Install it with: npm install -g firebase-tools${NC}"
fi

# Setup Frontend Environment
echo -e "${GREEN}1. Frontend Environment Setup${NC}"
echo "================================"

prompt_input "Firebase API Key" "" FIREBASE_API_KEY
prompt_input "Firebase Auth Domain" "your-project.firebaseapp.com" FIREBASE_AUTH_DOMAIN
prompt_input "Firebase Project ID" "" FIREBASE_PROJECT_ID
prompt_input "Firebase Storage Bucket" "$FIREBASE_PROJECT_ID.appspot.com" FIREBASE_STORAGE_BUCKET
prompt_input "Firebase Messaging Sender ID" "" FIREBASE_MESSAGING_SENDER_ID
prompt_input "Firebase App ID" "" FIREBASE_APP_ID

# Create frontend .env.local
cat > web-app/.env.local << EOF
# EcoVerse Frontend Environment Variables
# Generated on $(date)

# Firebase Configuration
VITE_FIREBASE_API_KEY=$FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=$FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=$FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=$FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=$FIREBASE_APP_ID

# Backend API URLs (Update for production)
VITE_AI_API_URL=http://localhost:5000
VITE_IOT_API_URL=http://localhost:8000

# App Configuration
VITE_APP_TITLE=EcoVerse
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_CHAT=true
VITE_ENABLE_BLOCKCHAIN=true
VITE_ENABLE_AI_FEATURES=true
EOF

echo -e "${GREEN}✅ Frontend environment file created: web-app/.env.local${NC}"

# Setup Backend Environment
echo
echo -e "${GREEN}2. AI/ML Backend Environment Setup${NC}"
echo "==================================="

prompt_input "Flask Secret Key" "$(openssl rand -hex 32)" FLASK_SECRET_KEY
prompt_input "Database URL (optional)" "" DATABASE_URL

cat > ai-analytics/.env << EOF
# EcoVerse AI/ML Analytics Environment Variables
# Generated on $(date)

# Flask Configuration
FLASK_ENV=development
FLASK_APP=simple_api_server.py
FLASK_DEBUG=true
PORT=5000
SECRET_KEY=$FLASK_SECRET_KEY

# Firebase Configuration
FIREBASE_URL=https://$FIREBASE_PROJECT_ID-default-rtdb.firebaseio.com
FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID

# Database Configuration
DATABASE_URL=$DATABASE_URL

# AI/ML Configuration
ML_MODEL_PATH=./models/
PREDICTION_CONFIDENCE_THRESHOLD=0.8
ANOMALY_DETECTION_SENSITIVITY=0.9

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/ai_analytics.log
EOF

echo -e "${GREEN}✅ AI/ML backend environment file created: ai-analytics/.env${NC}"

# Setup IoT Simulation Environment
echo
echo -e "${GREEN}3. IoT Simulation Environment Setup${NC}"
echo "===================================="

prompt_input "OpenWeather API Key (optional)" "" OPENWEATHER_API_KEY
prompt_input "Number of campus buildings" "7" CAMPUS_BUILDINGS

cat > iot-simulation/.env << EOF
# EcoVerse IoT Simulation Environment Variables
# Generated on $(date)

# Simulation Configuration
SIMULATION_MODE=development
SIMULATION_INTERVAL=60
CAMPUS_BUILDINGS=$CAMPUS_BUILDINGS
DATA_RETENTION_DAYS=30

# Firebase Configuration
FIREBASE_URL=https://$FIREBASE_PROJECT_ID-default-rtdb.firebaseio.com
FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID

# External APIs
OPENWEATHER_API_KEY=$OPENWEATHER_API_KEY
OPENAQ_API_KEY=

# Server Configuration
PORT=8000
HOST=localhost
DEBUG=true

# Data Generation Settings
MIN_ELECTRICITY_USAGE=200
MAX_ELECTRICITY_USAGE=1500
MIN_WATER_USAGE=500
MAX_WATER_USAGE=3000
MIN_WASTE_GENERATION=10
MAX_WASTE_GENERATION=200

# IoT Device Configuration
DEVICE_COUNT=150
SENSOR_ACCURACY=0.95
TRANSMISSION_RELIABILITY=0.98

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/iot_simulation.log
EOF

echo -e "${GREEN}✅ IoT simulation environment file created: iot-simulation/.env${NC}"

# Create production environment templates
echo
echo -e "${GREEN}4. Creating Production Templates${NC}"
echo "=================================="

# Production frontend template
cat > web-app/.env.production << EOF
# EcoVerse Frontend Production Environment Variables
# Update these values for your Render deployment

# Firebase Configuration (Use production Firebase project)
VITE_FIREBASE_API_KEY=your_production_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-production-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-production-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-production-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_production_sender_id
VITE_FIREBASE_APP_ID=your_production_app_id

# Backend API URLs (Your Render service URLs)
VITE_AI_API_URL=https://ecoversa-ai-api.onrender.com
VITE_IOT_API_URL=https://ecoversa-iot-simulator.onrender.com

# App Configuration
VITE_APP_TITLE=EcoVerse
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production

# Feature Flags
VITE_ENABLE_CHAT=true
VITE_ENABLE_BLOCKCHAIN=true
VITE_ENABLE_AI_FEATURES=true
EOF

echo -e "${GREEN}✅ Production templates created${NC}"

# Create logs directories
echo
echo -e "${GREEN}5. Creating Log Directories${NC}"
echo "============================"

mkdir -p ai-analytics/logs
mkdir -p iot-simulation/logs
echo -e "${GREEN}✅ Log directories created${NC}"

# Final instructions
echo
echo -e "${GREEN}🎉 Environment Setup Complete!${NC}"
echo "=============================="
echo
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Review and update the generated .env files"
echo "2. For production deployment, use the values in .env.production"
echo "3. Add environment variables in Render dashboard for production"
echo "4. Never commit .env files to git (they're already in .gitignore)"
echo
echo -e "${BLUE}Files created:${NC}"
echo "• web-app/.env.local (frontend development)"
echo "• ai-analytics/.env (backend development)"
echo "• iot-simulation/.env (IoT simulation development)"
echo "• web-app/.env.production (production template)"
echo
echo -e "${BLUE}To start development:${NC}"
echo "• Frontend: cd web-app && npm run dev"
echo "• AI/ML API: cd ai-analytics && python simple_api_server.py"
echo "• IoT Simulator: cd iot-simulation && python campus_simulator.py"
echo
echo -e "${YELLOW}Remember to:${NC}"
echo "• Set up Firebase project and get your configuration"
echo "• Update production environment variables in Render"
echo "• Keep your API keys secure and rotate them regularly"
echo
echo -e "${GREEN}Happy coding! 🌿${NC}"
