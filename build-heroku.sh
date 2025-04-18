#!/bin/bash
echo "Building NestJS app for Heroku..."
npm run build
echo "Running migrations..."
npm run db:migrate
echo "Seeding database..."
npm run db:seed
echo "Build completed!" 