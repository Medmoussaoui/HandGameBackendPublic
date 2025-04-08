import { Socket } from "socket.io";
import * as PlayerMDL from "../Player/model";
import { Player } from "../../models/Player";
import { randomUniqueToken } from "../../functions/roundom_token";

interface PlayerConnect {
  playerId: string;
  token: string;
  isNew: boolean;
}

export async function handlePlayerConnect(
  socket: Socket
): Promise<PlayerConnect> {
  const token = socket.data.token;
  if (token) {
    const player = await PlayerMDL.getPlayerByToken(token);
    if (player) {
      socket.data.token = token;
      socket.data.playerId = player._id.toString();

      // Update Socket
      player.socket = socket.id;
      await player.save();

      return {
        isNew: false,
        playerId: player._id.toString(),
        token: player.token,
      };
    }
  }
  /// else New user
  const newPlayer = new Player({
    token: randomUniqueToken(),
    socket: socket.id,
  });

  await newPlayer.save();
  socket.data.token = newPlayer.token;
  socket.data.playerId = newPlayer._id.toString();
  return {
    isNew: true,
    playerId: newPlayer._id.toString(),
    token: newPlayer.token,
  };
}
