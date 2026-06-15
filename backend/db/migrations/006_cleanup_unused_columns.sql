-- Future Cleanup Migration: Unused Columns
ALTER TABLE songs DROP COLUMN IF EXISTS title;
ALTER TABLE songs DROP COLUMN IF EXISTS waveform_meta;
ALTER TABLE rooms DROP COLUMN IF EXISTS current_song_id;
ALTER TABLE rooms DROP COLUMN IF EXISTS playback_state;
ALTER TABLE room_members DROP COLUMN IF EXISTS role;
