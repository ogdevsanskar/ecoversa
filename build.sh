#!/bin/bash

# Build script for Render deployment
set -e

echo "Building Ecoversa Web App..."

# Navigate to web-app directory
cd web-app

# Install dependencies
npm ci

# Build the application
npm run build

echo "Build completed successfully!"