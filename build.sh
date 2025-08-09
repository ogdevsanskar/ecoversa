#!/bin/bash

# Build script for Render deployment
set -e

echo "🚀 Starting EcoVerse Web App Build..."
echo "Current directory: $(pwd)"
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Navigate to web-app directory
echo "📁 Navigating to web-app directory..."
cd web-app

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found in web-app directory"
    exit 1
fi

echo "📦 Installing dependencies..."
# Use npm ci for faster, reliable, reproducible builds
npm ci --verbose

echo "🏗️  Building the application..."
# Build the application with detailed output
npm run build --verbose

echo "✅ Build completed successfully!"
echo "📂 Build output directory contents:"
ls -la dist/

# Verify critical files exist
if [ ! -f "dist/index.html" ]; then
    echo "❌ Error: dist/index.html not found"
    exit 1
fi

echo "🎉 EcoVerse Web App build successful!"
echo "📊 Build statistics:"
du -sh dist/
echo "📁 Dist directory structure:"
find dist/ -type f | head -20