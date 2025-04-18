#!/bin/bash
set -e

echo "Building NestJS app for Heroku..."
npm run build

# Explicitly ensure migrations are copied to dist
echo "Copying migration files to dist directory..."
mkdir -p ./dist/drizzle
cp -r ./drizzle/* ./dist/drizzle/

# Don't run migrations during build phase
# They will be run by the Procfile before starting the app
echo "Build completed successfully!" 