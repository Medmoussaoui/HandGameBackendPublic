import mongoose from "mongoose";
import { IRoom, Room } from "../../models/Room";
import { RoomVisibility } from "../../types/room.entitys";

/**
 * @params owner: string is the playerId ref
 */

export async function createRoom(
  owner: string,
  name: string,
  maxPlayers: number,
  visibility: RoomVisibility
): Promise<mongoose.Document<unknown, {}, IRoom> & IRoom> {
  const room = new Room({ owner, name, maxPlayers, visibility });
  await room.save();
  return room;
}
