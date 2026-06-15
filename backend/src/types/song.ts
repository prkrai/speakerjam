export interface SongUploadDto {
  roomId?: string;
}

export interface SongRecord {
  id: string;
  owner_user_id: string;
  room_id: string | null;
  original_filename: string;
  stored_filename: string;
  mime_type: string;
  duration_seconds: number;
  file_size: number;
  created_at: string;
  updated_at: string;
}
