#!/bin/bash
# Build script for Railway production deployment

echo "Starting production build process..."

# Step 1: Build the frontend
echo "Building frontend with Vite..."
npx vite build

# Step 2: Build the production-specific server
echo "Building production server..."
npx esbuild server/index.production.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js

# Step 3: Create necessary directories
echo "Creating public directory..."
mkdir -p server/public

# Step 4: Copy static assets
echo "Copying static assets..."
cp -r dist/* server/public/

echo "Build completed successfully!"