# Sync Validation Guide

## Phone A
1. Create a room.
2. Upload a test song.
3. Schedule playback from the room view.
4. Keep the phone on a stable network.

## Phone B
1. Join the same room.
2. Preload the uploaded song.
3. Wait for the scheduled playback event.
4. Record the observed RTT, offset, and actual start error for each attempt.

## Test Run
- Perform at least 10 playback attempts.
- For each attempt, capture:
  - RTT
  - Offset
  - Start Error
- After the run, compute:
  - Average Start Error
  - 95th Percentile Start Error
  - Maximum Start Error

## Interpretation
- Excellent: <= 5 ms
- Good: 10–20 ms
- Needs Improvement: > 20 ms
