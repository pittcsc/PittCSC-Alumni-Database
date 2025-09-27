#!/bin/bash

# Pitt CSC Alumni Database Deployment Script
set -e

echo "🚀 Starting Pitt CSC Alumni Database Deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker and try again."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp .env.production .env
    echo "📝 Please edit .env file with your production values before continuing."
    echo "Press Enter when ready to continue..."
    read
fi

# Build and start services
echo "🔨 Building Docker images..."
docker-compose build --no-cache

echo "🗄️  Starting database..."
docker-compose up -d database

echo "⏳ Waiting for database to be ready..."
sleep 10

echo "🔧 Running database migrations..."
docker-compose exec database psql -U $POSTGRES_USER -d $POSTGRES_DB -c "SELECT 1;" > /dev/null 2>&1 || {
    echo "❌ Database connection failed. Check your database configuration."
    exit 1
}

echo "🌐 Starting backend service..."
docker-compose up -d backend

echo "⏳ Waiting for backend to be ready..."
sleep 15

echo "🎨 Starting frontend service..."
docker-compose up -d frontend

echo "✅ Deployment complete!"
echo ""
echo "🌐 Your application should be available at:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:8000"
echo ""
echo "📋 To check the status of services:"
echo "   docker-compose ps"
echo ""
echo "📝 To view logs:"
echo "   docker-compose logs -f [service-name]"
echo ""
echo "🛑 To stop all services:"
echo "   docker-compose down"