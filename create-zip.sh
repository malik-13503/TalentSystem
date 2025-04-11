#!/bin/bash

# Create a temporary directory for the project files
mkdir -p temp_project

# Copy all project files excluding node_modules, .git and other unnecessary files
rsync -av \
  --exclude="node_modules" \
  --exclude=".git" \
  --exclude="dist" \
  --exclude=".replit" \
  --exclude="replit.nix" \
  --exclude=".config" \
  --exclude="temp_project" \
  --exclude="*.zip" \
  . temp_project/

# Create the zip file
zip -r footprint-talent-system.zip temp_project

# Clean up the temporary directory
rm -rf temp_project

echo "Project zip file created: footprint-talent-system.zip"