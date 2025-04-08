import { GameCardOptions } from "../types/room.events.type";
import * as PlayerMDL from "../services/Player/model";

interface MakeMoveData {
  token: string;
  option: GameCardOptions;
}

export class MakeMoveUsecase {
  async excute(input: MakeMoveData) {
    const player = await PlayerMDL.getPlayerByToken(input.token);

    if (player == null) throw new Error("Player not found");
    if (player.roomId == null) throw new Error("Player not in room");

    await PlayerMDL.makeMove(player._id.toString(), input.option);
  }
}
