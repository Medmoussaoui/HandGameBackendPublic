import { Socket } from "socket.io";
import * as PlayerMDL from "../Player/model";

export async function handlePlayerDisconnect(socket: Socket): Promise<void> {
  const player = await PlayerMDL.getPlayerBySocketId(socket.id);
  if (player) {
    player.socket = undefined;
    await player.save();
  }
}
