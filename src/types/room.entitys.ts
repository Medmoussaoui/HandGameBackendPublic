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
