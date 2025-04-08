import { Player } from "../../models/Player";

export async function getPlayerSocketId(
  playerId: string
): Promise<string | undefined> {
  const player = await Player.findOne({ _id: playerId });
  return player?.socket;
}
