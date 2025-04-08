import { Player } from "../../models/Player";

export async function getRoomPlayerCount(roomId: string): Promise<number> {
  return await Player.countDocuments({ roomId });
}
