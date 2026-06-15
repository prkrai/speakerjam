-- Users Table Fixes
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Rooms Table Fixes
ALTER TABLE rooms RENAME COLUMN code TO room_code;
ALTER TABLE rooms ALTER COLUMN room_code TYPE VARCHAR(10);
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Room Members Table Fixes
CREATE INDEX IF NOT EXISTS idx_room_members_user_id ON room_members(user_id);

-- Songs Table Fixes
ALTER TABLE songs RENAME COLUMN owner_id TO owner_user_id;
ALTER TABLE songs RENAME COLUMN storage_path TO stored_filename;
ALTER TABLE songs ALTER COLUMN stored_filename TYPE VARCHAR(255);
ALTER TABLE songs RENAME COLUMN duration_ms TO duration_seconds;
ALTER TABLE songs ALTER COLUMN duration_seconds SET DATA TYPE INTEGER;
ALTER TABLE songs ALTER COLUMN duration_seconds SET DEFAULT 0;
ALTER TABLE songs ALTER COLUMN duration_seconds SET NOT NULL;
ALTER TABLE songs RENAME COLUMN size_bytes TO file_size;
ALTER TABLE songs ALTER COLUMN file_size SET DATA TYPE BIGINT;
ALTER TABLE songs ALTER COLUMN file_size SET DEFAULT 0;
ALTER TABLE songs ALTER COLUMN file_size SET NOT NULL;
ALTER TABLE songs ADD COLUMN IF NOT EXISTS room_id UUID NULL REFERENCES rooms(id) ON DELETE SET NULL;
ALTER TABLE songs ADD COLUMN IF NOT EXISTS original_filename VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE songs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Alter title column to allow NULL to prevent constraint errors on insertion
ALTER TABLE songs ALTER COLUMN title DROP NOT NULL;

-- Indexes
DROP INDEX IF EXISTS idx_songs_owner_id;
CREATE INDEX IF NOT EXISTS idx_songs_owner_user_id ON songs(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_songs_room_id ON songs(room_id);
