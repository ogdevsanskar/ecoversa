#!/bin/bash
# Firebase Setup and Deployment Script for EcoVerse Platform
# This script automates the complete Firebase backend setup

set -e  # Exit on any error

echo "🔥 EcoVerse Firebase Setup Script 🔥"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Firebase CLI is installed
check_firebase_cli() {
    print_status "Checking Firebase CLI installation..."
    if ! command -v firebase &> /dev/null; then
        print_warning "Firebase CLI not found. Installing..."
        npm install -g firebase-tools
        print_success "Firebase CLI installed successfully"
    else
        print_success "Firebase CLI is already installed"
    fi
}

# Check if user is logged in to Firebase
check_firebase_auth() {
    print_status "Checking Firebase authentication..."
    if ! firebase projects:list &> /dev/null; then
        print_warning "Not logged in to Firebase. Please login..."
        firebase login
        print_success "Firebase login successful"
    else
        print_success "Already logged in to Firebase"
    fi
}

# Setup Firebase project
setup_firebase_project() {
    print_status "Setting up Firebase project..."
    
    # Check if firebase directory exists
    if [ ! -d "firebase" ]; then
        print_error "Firebase directory not found. Please run this script from the project root."
        exit 1
    fi
    
    cd firebase
    
    # Check if .firebaserc exists
    if [ ! -f ".firebaserc" ]; then
        print_warning ".firebaserc not found. Please set your Firebase project ID:"
        read -p "Enter your Firebase Project ID: " PROJECT_ID
        
        # Create .firebaserc file
        cat > .firebaserc << EOF
{
  "projects": {
    "default": "$PROJECT_ID",
    "development": "$PROJECT_ID-dev",
    "staging": "$PROJECT_ID-staging",
    "production": "$PROJECT_ID"
  },
  "targets": {},
  "etags": {}
}
EOF
        print_success ".firebaserc created with project ID: $PROJECT_ID"
    else
        print_success ".firebaserc already exists"
    fi
}

# Install Function dependencies
install_function_dependencies() {
    print_status "Installing Cloud Functions dependencies..."
    
    if [ -d "functions" ]; then
        cd functions
        if [ -f "package.json" ]; then
            npm install
            print_success "Cloud Functions dependencies installed"
        else
            print_error "package.json not found in functions directory"
            exit 1
        fi
        cd ..
    else
        print_error "Functions directory not found"
        exit 1
    fi
}

# Set environment variables
set_environment_variables() {
    print_status "Setting up environment variables..."
    
    echo "Please provide the following environment variables:"
    
    # ML API URL
    read -p "Enter ML API URL (e.g., https://your-ml-api.onrender.com): " ML_API_URL
    
    # Web3 Contract Address
    read -p "Enter Web3 Contract Address: " WEB3_CONTRACT_ADDRESS
    
    # Web3 Network
    read -p "Enter Web3 Network (e.g., polygon, ethereum): " WEB3_NETWORK
    
    # Set the configuration
    firebase functions:config:set \
        app.name="EcoVerse Platform" \
        app.env="production" \
        ml.api_url="$ML_API_URL" \
        web3.contract_address="$WEB3_CONTRACT_ADDRESS" \
        web3.network="$WEB3_NETWORK"
    
    print_success "Environment variables configured"
}

# Deploy security rules
deploy_security_rules() {
    print_status "Deploying security rules..."
    
    # Deploy Firestore rules
    if [ -f "firestore.rules" ]; then
        firebase deploy --only firestore:rules
        print_success "Firestore rules deployed"
    else
        print_warning "firestore.rules not found"
    fi
    
    # Deploy Database rules
    if [ -f "database.rules.json" ]; then
        firebase deploy --only database:rules
        print_success "Realtime Database rules deployed"
    else
        print_warning "database.rules.json not found"
    fi
    
    # Deploy Storage rules
    if [ -f "storage.rules" ]; then
        firebase deploy --only storage:rules
        print_success "Storage rules deployed"
    else
        print_warning "storage.rules not found"
    fi
}

# Deploy Firestore indexes
deploy_firestore_indexes() {
    print_status "Deploying Firestore indexes..."
    
    if [ -f "firestore.indexes.json" ]; then
        firebase deploy --only firestore:indexes
        print_success "Firestore indexes deployed"
    else
        print_warning "firestore.indexes.json not found"
    fi
}

# Deploy Cloud Functions
deploy_functions() {
    print_status "Deploying Cloud Functions..."
    
    if [ -d "functions" ]; then
        firebase deploy --only functions
        print_success "Cloud Functions deployed"
    else
        print_warning "Functions directory not found"
    fi
}

# Deploy Firebase Hosting
deploy_hosting() {
    print_status "Setting up Firebase Hosting..."
    
    # Create public directory if it doesn't exist
    if [ ! -d "public" ]; then
        mkdir public
        
        # Create a simple index.html
        cat > public/index.html << EOF
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>EcoVerse Platform - Firebase Backend</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .container { max-width: 600px; margin: 0 auto; }
        .success { color: #4CAF50; }
        .info { color: #2196F3; }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="success">🔥 EcoVerse Firebase Backend</h1>
        <h2 class="info">Backend services are running successfully!</h2>
        <p>Your Firebase backend for the EcoVerse Virtual Smart Campus Sustainability System is now live.</p>
        <ul style="text-align: left;">
            <li>✅ Cloud Functions deployed</li>
            <li>✅ Firestore database configured</li>
            <li>✅ Realtime Database active</li>
            <li>✅ Storage bucket ready</li>
            <li>✅ Security rules enforced</li>
        </ul>
        <p><strong>Next steps:</strong> Configure your frontend application to connect to this Firebase backend.</p>
    </div>
</body>
</html>
EOF
        print_success "Firebase Hosting setup complete"
    fi
    
    firebase deploy --only hosting
    print_success "Firebase Hosting deployed"
}

# Verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    # Get project info
    PROJECT_INFO=$(firebase projects:list --filter="displayName:*" --format="table")
    print_success "Firebase project verified"
    
    # Check functions
    FUNCTIONS_LIST=$(firebase functions:list 2>/dev/null || echo "No functions deployed")
    print_status "Functions status: $FUNCTIONS_LIST"
    
    # Get hosting URL
    HOSTING_URL=$(firebase hosting:sites:list --format="table" 2>/dev/null || echo "Hosting not configured")
    print_status "Hosting status: $HOSTING_URL"
    
    print_success "Deployment verification complete"
}

# Generate service account key
generate_service_account() {
    print_status "Setting up service account..."
    
    echo "To generate a service account key:"
    echo "1. Go to Firebase Console > Project Settings > Service Accounts"
    echo "2. Click 'Generate new private key'"
    echo "3. Save the JSON file securely"
    echo "4. Add the file path to your environment variables"
    
    print_warning "Service account key setup is manual - please follow the instructions above"
}

# Create environment file template
create_env_template() {
    print_status "Creating environment file template..."
    
    cat > .env.template << EOF
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id

# External Services
ML_API_URL=https://your-ml-api.onrender.com
WEB3_CONTRACT_ADDRESS=your-contract-address
WEB3_NETWORK=polygon

# Service Account (for backend integration)
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
EOF
    
    print_success "Environment template created (.env.template)"
}

# Main execution
main() {
    echo "Starting Firebase setup for EcoVerse Platform..."
    echo ""
    
    # Pre-flight checks
    check_firebase_cli
    check_firebase_auth
    
    # Setup process
    setup_firebase_project
    install_function_dependencies
    
    # Ask user what they want to deploy
    echo ""
    echo "What would you like to deploy? (You can choose multiple options)"
    echo "1. Security Rules"
    echo "2. Firestore Indexes"
    echo "3. Cloud Functions"
    echo "4. Firebase Hosting"
    echo "5. All of the above"
    echo "6. Just setup (no deployment)"
    echo ""
    read -p "Enter your choice (1-6): " DEPLOY_CHOICE
    
    case $DEPLOY_CHOICE in
        1)
            deploy_security_rules
            ;;
        2)
            deploy_firestore_indexes
            ;;
        3)
            deploy_functions
            ;;
        4)
            deploy_hosting
            ;;
        5)
            set_environment_variables
            deploy_security_rules
            deploy_firestore_indexes
            deploy_functions
            deploy_hosting
            verify_deployment
            ;;
        6)
            print_success "Setup completed without deployment"
            ;;
        *)
            print_error "Invalid choice. Exiting."
            exit 1
            ;;
    esac
    
    # Additional setup
    generate_service_account
    create_env_template
    
    echo ""
    print_success "🎉 Firebase setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Configure your environment variables using .env.template"
    echo "2. Set up service account key for backend integration"
    echo "3. Test your Firebase integration"
    echo "4. Update your frontend configuration"
    echo ""
    echo "For detailed instructions, see: firebase/FIREBASE_SETUP_GUIDE.md"
    echo ""
}

# Run main function
main "$@"
