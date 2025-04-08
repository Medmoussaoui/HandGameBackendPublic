import { Player } from "../../models/Player";
import { GameCardOptions } from "../../types/room.events.type";

export async function makeMove(
  id: string,
  option: GameCardOptions
): Promise<void> {
  try {
    await Player.updateOne({ _id: id }, { currentMove: option });
  } catch (error) {
    console.error("Error making move:", error);
  }
}
