#!/bin/bash

echo "🚀 Starting build process..."

# Install PHP dependencies
echo "📦 Installing Composer dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Install Node dependencies
echo "📦 Installing NPM dependencies..."
npm ci --production=false

# Build frontend assets
echo "🔨 Building frontend assets..."
npm run build

# Clear any cached configs
echo "🧹 Clearing cache..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Run database migrations
echo "🗄️ Running database migrations..."
php artisan migrate --force --no-interaction

# Cache configuration for production
echo "⚡ Optimizing for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions
echo "🔐 Setting permissions..."
chmod -R 775 storage bootstrap/cache

echo "✅ Build completed successfully!"
