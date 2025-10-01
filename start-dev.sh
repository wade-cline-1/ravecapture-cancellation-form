#!/bin/bash

# RaveCapture Cancellation Form - Development Server
# Double-click this file to start the development server on localhost:3001

echo "🚀 Starting RaveCapture Cancellation Form Development Server..."
echo "📍 Server will be available at: http://localhost:3001"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root directory."
    echo "Press any key to exit..."
    read -n 1
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check for environment variables
if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
    echo "⚠️  Warning: No .env file found. You may need to set up environment variables."
    echo "   See ENV_SETUP.md for instructions."
    echo ""
fi

# Start the development server
echo "🎯 Starting development server on port 3001..."
echo "   Press Ctrl+C to stop the server"
echo ""

npm run dev
