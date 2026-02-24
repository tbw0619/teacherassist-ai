#!/usr/bin/env bash
set -e

# Install backend dependencies
pip install -r backend/requirements.txt

# Install frontend dependencies and build
cd frontend
npm install
npx vite build
cd ..

# Copy frontend build to backend/static
rm -rf backend/static
cp -r frontend/dist backend/static
