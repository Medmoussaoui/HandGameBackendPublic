import { FilterQuery } from "mongoose";
import { IPlayer, Player } from "../../models/Player";

export function getRoomPlayers(
  roomId: string,
  filter?: FilterQuery<IPlayer>
): Promise<IPlayer[]> {
  return Player.find({ roomId, ...filter });
}
