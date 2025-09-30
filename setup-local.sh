#!/bin/bash

echo "🚀 Setting up RaveCapture Cancellation Form for local development..."

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Local Development Environment Variables
# Database - Using local SQLite for development
DATABASE_URL="file:./dev.db"

# Postmark Email Service (you'll need to add your actual token)
POSTMARK_SERVER_TOKEN="your_postmark_server_token_here"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:5000"
NEXT_PUBLIC_APP_NAME="RaveCapture Cancellation Form"

# Calendly Integration (optional)
NEXT_PUBLIC_CALENDLY_URL="https://calendly.com/your-username"
EOF
    echo "✅ .env.local file created"
else
    echo "✅ .env.local file already exists"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate dev --name init

echo "✅ Setup complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "The application will be available at: http://localhost:5000"
echo ""
echo "Note: You'll need to add your Postmark server token to .env.local for email functionality"
