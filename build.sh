#!/bin/bash

# Build script for EcoVerse Web App on Render
echo "🚀 Building EcoVerse Web Application..."

# Navigate to web-app directory
cd web-app

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --prefer-offline --no-audit

# Run build
echo "🔨 Building application..."
npm run build

echo "✅ Build completed successfully!"

# List build output
echo "📁 Build output:"
ls -la dist/
