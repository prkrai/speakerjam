# SyncJam MVP

Production-quality MVP scaffold for Android-first synchronized audio playback.

## Architecture

- Backend: Node.js + TypeScript + Express + Socket.IO + PostgreSQL + Redis
- Frontend: Flutter + Riverpod + GoRouter + Material 3
- Deployment: Docker + Docker Compose

## Initial Folder Structure

- backend/
  - src/
    - config/
    - middleware/
    - routes/
    - services/
    - socket/
    - types/
  - db/
    - migrations/
- frontend/
  - lib/
  - test/
- infra/
- docs/

## Current Status

- Architecture and folder structure are scaffolded.
- Backend starter server, auth routes, and Socket.IO event surface are implemented.
- Flutter app shell is scaffolded for further screen implementation.
