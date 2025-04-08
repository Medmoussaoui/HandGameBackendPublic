import { IPlayer, Player } from "../../models/Player";

export async function getPlayerByToken(token: string) {
  return Player.findOne({ token: token });
}
