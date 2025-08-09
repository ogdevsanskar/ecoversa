#!/bin/bash

# Build script for Render deployment
set -e

echo "🚀 Starting EcoVerse Web App Build..."
echo "📍 Current directory: $(pwd)"
echo "🔧 Node.js version: $(node --version)"
echo "📦 npm version: $(npm --version)"

# Navigate to web-app directory
echo "📁 Navigating to web-app directory..."
cd web-app

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found in web-app directory"
    exit 1
fi

echo "� Package.json found, checking dependencies..."
echo "�📦 Installing dependencies with npm ci..."
# Use npm ci for faster, reliable, reproducible builds
npm ci --verbose --no-audit --no-fund

echo "🔍 Checking environment variables..."
if [ -z "$VITE_FIREBASE_API_KEY" ]; then
    echo "⚠️  Warning: VITE_FIREBASE_API_KEY not set"
fi

if [ -z "$VITE_FIREBASE_PROJECT_ID" ]; then
    echo "⚠️  Warning: VITE_FIREBASE_PROJECT_ID not set"
fi

echo "🔨 Building the application with TypeScript check..."
# Build the application with detailed output
npm run build --verbose

echo "✅ Build completed successfully!"

# Verify critical files exist
echo "🔍 Verifying build output..."
if [ ! -f "dist/index.html" ]; then
    echo "❌ Error: dist/index.html not found"
    exit 1
fi

if [ ! -d "dist/assets" ]; then
    echo "❌ Error: dist/assets directory not found"
    exit 1
fi

echo "📊 Build statistics:"
du -sh dist/
echo "📁 Dist directory structure:"
find dist/ -type f -name "*.html" -o -name "*.js" -o -name "*.css" | head -20

echo "🔍 Checking if _redirects file exists..."
if [ -f "public/_redirects" ]; then
    echo "✅ _redirects file found in public/"
    if [ -f "dist/_redirects" ]; then
        echo "✅ _redirects file copied to dist/"
    else
        echo "⚠️  _redirects file not in dist, copying manually..."
        cp public/_redirects dist/
    fi
else
    echo "⚠️  _redirects file not found, creating one for SPA routing..."
    echo "/*    /index.html   200" > dist/_redirects
fi

echo "🎉 EcoVerse Web App build successful!"
echo "📂 Ready for deployment from: web-app/dist"