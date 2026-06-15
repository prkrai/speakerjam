# SyncJam MVP Architecture

## Goals
- Android-first synchronized audio playback MVP.
- Low-latency room coordination via Socket.IO.
- Server-driven clock sync and playback scheduling.

## Backend Flow
1. Auth and room APIs.
2. Socket.IO event handlers for play/pause/seek/clock sync.
3. PostgreSQL for user and room persistence.
4. Redis for session and sync metadata.

## Flutter Flow
1. Riverpod state providers for auth, rooms, and playback.
2. GoRouter for splash/login/register/home/room/upload flows.
3. Audio playback to be wired into a dedicated player screen next.

## Synchronization Design
- NTP-style client/server offset estimation.
- 5-second clock sync cadence.
- 3-second drift detection and micro-correction.
- Playback start scheduled at serverTime + 5000ms.
