import { IRoom, Room } from "../../models/Room";

export async function getOwnerRoom(ownerId: string): Promise<IRoom | null> {
  return Room.findOne({ owner: ownerId });
}
