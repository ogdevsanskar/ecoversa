#!/bin/bash

# EcoVerse Render Deployment Helper Script
# This script helps generate environment variables for Render deployment

set -e

echo "🚀 EcoVerse Render Deployment Helper"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print section headers
print_header() {
    echo -e "\n${CYAN}$1${NC}"
    echo "$(printf '=%.0s' {1..50})"
}

# Function to print variable
print_var() {
    local name="$1"
    local value="$2"
    echo -e "${BLUE}$name${NC} = ${GREEN}$value${NC}"
}

# Function to generate secret key
generate_secret() {
    if command -v openssl &> /dev/null; then
        openssl rand -hex 32
    else
        # Fallback if openssl not available
        date +%s | sha256sum | base64 | head -c 32
    fi
}

print_header "🔥 Firebase Configuration"
echo "Please enter your Firebase project details:"
echo

read -p "Firebase Project ID: " FIREBASE_PROJECT_ID
read -p "Firebase API Key: " FIREBASE_API_KEY
read -p "Firebase Auth Domain: " FIREBASE_AUTH_DOMAIN
read -p "Firebase Storage Bucket: " FIREBASE_STORAGE_BUCKET
read -p "Firebase Messaging Sender ID: " FIREBASE_MESSAGING_SENDER_ID
read -p "Firebase App ID: " FIREBASE_APP_ID

# Generate secret key
SECRET_KEY=$(generate_secret)

print_header "📋 Environment Variables for Render"

echo -e "\n${GREEN}Copy these variables to your Render services:${NC}"

print_header "🌐 Frontend Service: ecoversa-web-app"
echo "Service Type: Static Site"
echo "Build Command: ./build.sh"
echo "Publish Directory: web-app/dist"
echo
echo "Environment Variables:"
print_var "VITE_FIREBASE_API_KEY" "$FIREBASE_API_KEY"
print_var "VITE_FIREBASE_AUTH_DOMAIN" "$FIREBASE_AUTH_DOMAIN"
print_var "VITE_FIREBASE_PROJECT_ID" "$FIREBASE_PROJECT_ID"
print_var "VITE_FIREBASE_STORAGE_BUCKET" "$FIREBASE_STORAGE_BUCKET"
print_var "VITE_FIREBASE_MESSAGING_SENDER_ID" "$FIREBASE_MESSAGING_SENDER_ID"
print_var "VITE_FIREBASE_APP_ID" "$FIREBASE_APP_ID"
print_var "VITE_AI_API_URL" "https://ecoversa-ai-api.onrender.com"
print_var "VITE_IOT_API_URL" "https://ecoversa-iot-simulator.onrender.com"
print_var "VITE_APP_TITLE" "EcoVerse"
print_var "VITE_ENVIRONMENT" "production"

print_header "🤖 AI/ML API Service: ecoversa-ai-api"
echo "Service Type: Web Service"
echo "Runtime: Python 3"
echo "Build Command: pip install -r ai-analytics/requirements.txt"
echo "Start Command: cd ai-analytics && python simple_api_server.py"
echo
echo "Environment Variables:"
print_var "FLASK_ENV" "production"
print_var "FLASK_APP" "simple_api_server.py"
print_var "PORT" "5000"
print_var "FIREBASE_URL" "https://$FIREBASE_PROJECT_ID-default-rtdb.firebaseio.com"
print_var "FIREBASE_PROJECT_ID" "$FIREBASE_PROJECT_ID"
print_var "SECRET_KEY" "$SECRET_KEY"

print_header "🏢 IoT Simulator Service: ecoversa-iot-simulator"
echo "Service Type: Web Service"
echo "Runtime: Python 3"
echo "Build Command: pip install -r iot-simulation/requirements.txt"
echo "Start Command: cd iot-simulation && python campus_simulator.py"
echo
echo "Environment Variables:"
print_var "SIMULATION_MODE" "production"
print_var "PORT" "8000"
print_var "FIREBASE_URL" "https://$FIREBASE_PROJECT_ID-default-rtdb.firebaseio.com"
print_var "FIREBASE_PROJECT_ID" "$FIREBASE_PROJECT_ID"
print_var "SIMULATION_INTERVAL" "60"
print_var "CAMPUS_BUILDINGS" "7"

print_header "🔄 Deployment Order"
echo "Deploy services in this order:"
echo "1. 🌐 Frontend (Static Site) - ecoversa-web-app"
echo "2. 🤖 AI/ML API (Web Service) - ecoversa-ai-api"
echo "3. 🏢 IoT Simulator (Web Service) - ecoversa-iot-simulator"
echo "4. Update frontend environment variables with actual service URLs"
echo "5. Redeploy frontend"

print_header "🎯 Service URLs (After Deployment)"
echo "Frontend: https://ecoversa-web-app.onrender.com"
echo "AI/ML API: https://ecoversa-ai-api.onrender.com"
echo "IoT Simulator: https://ecoversa-iot-simulator.onrender.com"

print_header "✅ Testing Endpoints"
echo "Test these URLs after deployment:"
echo "• Frontend: https://ecoversa-web-app.onrender.com"
echo "• AI Health: https://ecoversa-ai-api.onrender.com/health"
echo "• IoT Status: https://ecoversa-iot-simulator.onrender.com/status"

print_header "📖 Documentation"
echo "For detailed instructions, see:"
echo "• STEP_BY_STEP_RENDER_DEPLOYMENT.md - Complete deployment guide"
echo "• ENV_QUICK_REFERENCE.md - Quick environment variables reference"
echo "• RENDER_ENVIRONMENT_GUIDE.md - Detailed environment setup"

echo -e "\n${GREEN}🎉 Ready to deploy to Render!${NC}"
echo -e "${YELLOW}💡 Tip: Save this output for reference during deployment${NC}"
