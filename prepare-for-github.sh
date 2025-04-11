#!/bin/bash
# This script prepares your project for GitHub and Railway deployment
# Run this script on your local machine after downloading the project from Replit

# Check if the directory exists
if [ ! -d "footprint-talent-system" ]; then
  mkdir -p footprint-talent-system
fi

# Copy essential directories
echo "Copying essential directories..."
cp -r client footprint-talent-system/
cp -r server footprint-talent-system/
cp -r shared footprint-talent-system/
cp -r attached_assets footprint-talent-system/

# Copy configuration files
echo "Copying configuration files..."
cp package.json footprint-talent-system/
cp tsconfig.json footprint-talent-system/
cp vite.config.ts footprint-talent-system/
cp drizzle.config.ts footprint-talent-system/
cp tailwind.config.ts footprint-talent-system/
cp postcss.config.js footprint-talent-system/
cp theme.json footprint-talent-system/

# Copy deployment files
echo "Copying deployment files..."
cp Procfile footprint-talent-system/
cp .npmrc footprint-talent-system/
cp .env.sample footprint-talent-system/
cp README.md footprint-talent-system/
cp .gitignore footprint-talent-system/

# Create an empty .env.example file (copy of .env.sample)
cp .env.sample footprint-talent-system/.env.example

# Create a zip file
echo "Creating zip file..."
cd footprint-talent-system
zip -r ../footprint-talent-system.zip .
cd ..

echo "Project prepared for GitHub and Railway deployment!"
echo "The zip file is ready: footprint-talent-system.zip"
echo "You can now extract this file and push to GitHub."