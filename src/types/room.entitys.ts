export enum Move {
  ROCK = "rock",
  PAPER = "paper",
  SCISSORS = "scissors",
  NONE = "none",
}

export enum RoomVisibility {
  PUBLIC = "Public",
  PRIVATE = "Private",
}

export interface CreateRoomDTO {
  name: string;
  maxPlayers: number;
  visibility: RoomVisibility;
  playerId: string;
}

export interface PublicRoomEntity {
  roomId: string;
  name: string;
  maxPlayers: number;
  visibility: RoomVisibility;
  owner: string;
  joinedPlayers: number;
  createdAt: Date;
}
