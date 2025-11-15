#!/bin/bash

# FinGenie - cPanel Deployment Script
# This script helps deploy the Laravel application to cPanel

set -e

echo "🚀 FinGenie Deployment Script"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ .env file created. Please configure it before continuing.${NC}"
        exit 1
    else
        echo -e "${RED}❌ .env.example not found. Please create .env file manually.${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}📦 Installing Composer dependencies...${NC}"
composer install --no-dev --optimize-autoloader --no-interaction

echo -e "${GREEN}📦 Installing NPM dependencies...${NC}"
npm ci

echo -e "${GREEN}🔨 Building assets...${NC}"
npm run build

echo -e "${GREEN}🗑️  Clearing caches...${NC}"
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

echo -e "${GREEN}🔐 Generating application key...${NC}"
php artisan key:generate --force || echo "Key already exists"

echo -e "${GREEN}🗄️  Running database migrations...${NC}"
php artisan migrate --force

echo -e "${GREEN}⚡ Optimizing for production...${NC}"
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo -e "${GREEN}📁 Setting permissions...${NC}"
chmod -R 755 storage bootstrap/cache
chmod -R 755 public

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Verify .env configuration"
echo "2. Check storage and bootstrap/cache permissions"
echo "3. Test the application"
echo ""

