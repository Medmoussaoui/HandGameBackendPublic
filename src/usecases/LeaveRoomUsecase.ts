import { Socket } from "socket.io";
import * as PlayerMDL from "../services/Player/model";
import * as RoomMDL from "../services/Room/model";
import { LeavedRoomData, PlayerLeftData } from "../types/room.events.type";
import { IOType } from "../types/global";

export class LeaveRoomUsecase {
  constructor(public io: IOType) {}

  async leave(roomId: string, socket: Socket) {
    const token = socket.data.token;
    const player = await PlayerMDL.getPlayerByToken(token);

    if (!player) {
      throw new Error("Player not found");
    }

    player.roomId = undefined;
    await player.save();

    socket.leave(roomId);
    socket.emit("roomLeft", { roomId: roomId } as LeavedRoomData);
    await this.alertPlayersOnLeave(roomId, player._id.toString());
  }

  private async alertPlayersOnLeave(roomId: string, playerId: string) {
    const playersCount = await RoomMDL.getRoomPlayerCount(roomId);

    const payload: PlayerLeftData = {
      roomId: roomId,
      playerId: playerId,
      remainsePlayers: playersCount,
    };

    this.io.to(roomId).emit("playerLeft", payload);
  }
}
