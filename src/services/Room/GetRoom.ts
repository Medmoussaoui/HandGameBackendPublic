import mongoose from "mongoose";
import { IRoom, Room } from "../../models/Room";

export async function getRoom(
  roomId: string
): Promise<(mongoose.Document<unknown, {}, IRoom> & IRoom) | null> {
  return Room.findById(roomId);
}
