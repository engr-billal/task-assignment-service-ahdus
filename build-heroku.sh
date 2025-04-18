#!/bin/bash
set -e

echo "Building NestJS app for Heroku..."

# Build the app
echo "Building the application..."
npm run build

# Make sure utility scripts get compiled
echo "Compiling utility scripts..."
npx tsc -p tsconfig.scripts.json

# Explicitly ensure migrations are copied to dist
echo "Copying migration files to dist directory..."
mkdir -p ./dist/drizzle
cp -r ./drizzle/* ./dist/drizzle/

# Don't run migrations during build phase
# They will be run by the Procfile before starting the app
echo "Build completed successfully!" 