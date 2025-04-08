import { RoomVisibility } from "./room.entitys";

export interface CreateRoomData {
  name: string;
  visibility: RoomVisibility;
  maxPlayers: number;
}

export interface CreatedRoomData extends CreateRoomData {
  roomId: string;
}

export interface JoinRoomData {
  roomId: string;
}

export interface JoinedRoomData {
  roomId: string;
  roomName: string;
  totalPlayers: number;
  joinedPlayers: number;
}

export interface JoinsData {
  roomId: string;
  joinedPlayers: number;
}

export type GameCardOptions = "rock" | "paper" | "scissors";
export type OptionState = "win" | "loss" | "draw" | "none";

export interface SelectedOption {
  option: GameCardOptions;
  quantity: number;
}

export interface RoundResultData {
  winingOption?: GameCardOptions;
  options: SelectedOption[];
  isLastRound: boolean;
}

export interface GameStartData {
  roundNumber: number;
  playersCount: number;
}

export interface PlayingData {
  roundNumber: number;
  roundEndTime: Date;
  playersCount: number;
}

export interface LeaveRoomData {
  roomId: string;
}

export interface LeavedRoomData {
  roomId: string;
}

export interface PlayerLeftData {
  roomId: string;
  playerId: string;
  remainsePlayers: number;
}
