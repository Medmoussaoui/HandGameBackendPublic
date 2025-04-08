import { Player } from "../../models/Player";

export async function joinRoom(
  playerId: string,
  roomId: string
): Promise<void> {
  await Player.updateOne({ _id: playerId }, { roomId });
}
