export interface CreateRoomDto {
  title?: string;
}

export interface JoinRoomDto {
  roomCode: string;
}

export interface RoomResponse {
  roomId: string;
  roomCode: string;
  host: { id: string; email: string };
  members: Array<{ id: string; email: string }>;
}
