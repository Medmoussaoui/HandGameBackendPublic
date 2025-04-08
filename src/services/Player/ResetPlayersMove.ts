import { Player } from "../../models/Player";

export async function resetPlayersMove(roomId: string) {
  await Player.updateMany({ roomId }, { currentMove: "none" });
}
