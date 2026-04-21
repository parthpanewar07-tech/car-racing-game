# Neon Rush Racing Game

A modern, scalable Car Racing Web Game platform built with React, Tailwind CSS, and Node.js.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Context API, Canvas API
- **Backend**: Node.js, Express.js
- **Other**: Progressive Web App (PWA) enabled

## Project Structure
```
/frontend
  /src
    /components  - Reusable UI elements (Navbar)
    /context     - Global state management (GameContext)
    /hooks       - Custom React hooks (useGameEngine)
    /pages       - Main routes (Home, Game, Leaderboard, Settings)
  /public        - PWA assets (manifest, sw.js)
/backend
  server.js      - Express REST API for leaderboards
```

## Running the Application Locally

### 1. Start the Backend
```bash
cd backend
npm install
npm start
```
The API will run on `http://localhost:5000`

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
The game will run on `http://localhost:5173`

## Firebase Functions Setup (Optional Serverless Deployment)

If you prefer to host the backend using Firebase Functions instead of a standalone Express server:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
2. Install Firebase CLI globally: `npm install -g firebase-tools`
3. Login to Firebase: `firebase login`
4. Initialize Firebase in the root directory: `firebase init functions`
5. Replace `functions/index.js` with the contents of `backend/server.js`, wrapping the express app:
   ```javascript
   const functions = require('firebase-functions');
   const express = require('express');
   // ... middleware and routes
   exports.api = functions.https.onRequest(app);
   ```
6. Deploy: `firebase deploy --only functions`

## Features Included
- **Arcade Gameplay**: Responsive HTML5 Canvas game loop via `requestAnimationFrame`.
- **Progressive Web App**: Offline capability via service worker and installable via `manifest.json`.
- **Global State**: Context API used for managing game lifecycle, scores, and settings.
- **Glassmorphism UI**: Modern aesthetic utilizing Tailwind CSS backdrop filters.
- **Dynamic Difficulty**: Game speed and enemy frequency scales with score.
- **Mobile First Controls**: Touch-based steering support for mobile users.
