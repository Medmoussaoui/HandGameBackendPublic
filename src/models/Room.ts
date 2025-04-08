import mongoose, { Schema, Document } from "mongoose";
import { RoomVisibility } from "../types/room.entitys";
import { IPlayer } from "./Player";

export interface IRoom extends Document {
  owner: string;
  name: string;
  maxPlayers: number;
  visibility: RoomVisibility;
  isGameStarted: boolean;
  roundNumber: number;
  currentRound: number;
  winner: IPlayer;
  roundEndTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema(
  {
    owner: { type: String, required: true },
    name: { type: String, required: true },
    maxPlayers: { type: Number, required: true },
    visibility: {
      type: String,
      enum: Object.values(RoomVisibility),
      required: true,
    },
    isGameStarted: { type: Boolean, default: false },
    roundNumber: { type: Number, default: 0 },
    currentRound: { type: Number, default: 0 },
    winner: { type: Schema.Types.ObjectId, ref: "Player", default: null },
    roundEndTime: { type: Date },
  },
  { timestamps: true }
);

export const Room = mongoose.model<IRoom>("Room", RoomSchema);
