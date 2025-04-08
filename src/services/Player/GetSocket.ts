import { Socket } from "socket.io";
import { IOType } from "../../types/global";
import { getPlayerSocketId } from "./GetPlayerSocketId";

export async function getPlayerSocket(
  playerId: string,
  io: IOType
): Promise<Socket | undefined> {
  const socketId = await getPlayerSocketId(playerId);
  if (socketId) return io.sockets.sockets.get(socketId);
}
