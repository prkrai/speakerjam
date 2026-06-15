# Socket Events

## Required events
- room_created
- room_joined
- room_left
- member_joined
- member_left
- song_uploaded
- play
- pause
- resume
- seek
- stop
- clock_sync
- drift_detected
- drift_corrected
- sync_status

## Notes
- `clock_sync` returns server time for NTP-style offset estimation.
- `play` broadcasts a startAt timestamp to align all clients.
- `drift_detected` is the signal for correction logic to be implemented in the next iteration.
