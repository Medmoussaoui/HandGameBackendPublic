import { Player } from "../../models/Player";
import { Room } from "../../models/Room";

export async function deleteRoom(roomId: string): Promise<void> {
  await Promise.all([
    Player.deleteMany({ roomId }),
    Room.deleteOne({ _id: roomId }),
  ]);
}
