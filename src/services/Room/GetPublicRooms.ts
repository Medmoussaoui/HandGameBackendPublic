import mongoose from "mongoose";
import { IRoom, Room } from "../../models/Room";
import { RoomVisibility } from "../../types/room.entitys";

export async function getPublicRooms(): Promise<
  (mongoose.Document<unknown, {}, IRoom> & IRoom)[]
> {
  return await Room.find({ visibility: RoomVisibility.PUBLIC });
}
