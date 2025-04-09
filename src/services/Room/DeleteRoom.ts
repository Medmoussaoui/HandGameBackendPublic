import { Player } from "../../models/Player";
import { Room } from "../../models/Room";

export async function deleteRoom(roomId: string): Promise<void> {
  await Promise.all([
    Player.updateMany({ roomId }, { roomId: null }),
    Room.deleteOne({ _id: roomId }),
  ]);
}
