import mongoose, { Schema, Document } from "mongoose";
import { Move } from "../types/room.entitys";
import { GameCardOptions } from "../types/room.events.type";

export interface IPlayer extends Document {
  socket: string | undefined;
  token: string;
  roomId: string | undefined;
  name: string;
  currentMove: GameCardOptions;
  createdAt: Date;
  updatedAt: Date;
}

const PlayerSchema = new Schema(
  {
    socket: { type: String, default: null },
    token: { type: String, require: true },
    name: { type: String, default: "anonymouse" },
    roomId: { type: String, default: null },
    currentMove: {
      type: String,
      enum: Object.values(Move),
      default: "none",
    },
  },
  { timestamps: true }
);

export const Player = mongoose.model<IPlayer>("Player", PlayerSchema);
