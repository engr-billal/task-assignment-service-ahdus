#!/bin/bash
set -e

echo "Building NestJS app for Heroku..."
npm run build

# Don't run migrations during build phase
# They will be run by the Procfile before starting the app
echo "Build completed successfully!" 