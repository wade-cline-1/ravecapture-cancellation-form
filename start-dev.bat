@echo off
REM RaveCapture Cancellation Form - Development Server
REM Double-click this file to start the development server on localhost:3001

echo 🚀 Starting RaveCapture Cancellation Form Development Server...
echo 📍 Server will be available at: http://localhost:3001
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root directory.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    echo.
)

REM Check for environment variables
if not exist ".env.local" if not exist ".env" (
    echo ⚠️  Warning: No .env file found. You may need to set up environment variables.
    echo    See ENV_SETUP.md for instructions.
    echo.
)

REM Start the development server
echo 🎯 Starting development server on port 3001...
echo    Press Ctrl+C to stop the server
echo.

npm run dev

REM Keep window open if there's an error
if errorlevel 1 (
    echo.
    echo ❌ Error occurred. Press any key to exit...
    pause >nul
)
