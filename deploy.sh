#!/bin/bash

# Mantouji.ma Deployment Script
echo "🚀 Deploying Mantouji.ma Platform..."

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -f "backend/requirements.txt" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 16+"
    exit 1
fi

if ! command_exists python3; then
    echo "❌ Python 3 is not installed. Please install Python 3.12+"
    exit 1
fi

if ! command_exists git; then
    echo "❌ Git is not installed. Please install Git"
    exit 1
fi

echo "✅ All prerequisites are installed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
cd ..

# Build frontend for production
echo "🏗️ Building frontend for production..."
cd frontend
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Failed to build frontend"
    exit 1
fi
cd ..

echo "✅ Deployment preparation complete!"
echo ""
echo "🌐 Services:"
echo "   Backend:  http://localhost:5000"
echo "   Frontend: http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "   README.md - Complete setup and usage guide"
echo "   API endpoints documented in README.md"
echo ""
echo "🔧 To start services:"
echo "   ./start.sh"
echo ""
echo "📤 To push to remote repository:"
echo "   git remote add origin <your-repo-url>"
echo "   git push -u origin master"
echo ""
echo "🎉 Mantouji.ma is ready for deployment!"
