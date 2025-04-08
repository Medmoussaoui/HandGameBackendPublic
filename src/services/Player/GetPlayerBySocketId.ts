import { Player } from "../../models/Player";

export async function getPlayerBySocketId(socketId: string) {
  return await Player.findOne({ socket: socketId });
}
