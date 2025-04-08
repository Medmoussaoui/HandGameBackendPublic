import { CreateRoomDTO } from "../types/room.entitys";
import * as RoomMDL from "../services/Room/model";
import * as PlayerMDL from "../services/Player/model";
import { IOType } from "../types/global";
import { Room } from "../models/Room";
import { CreatedRoomData } from "../types/room.events.type";

export class CreateRoomUsecase {
  constructor(public io: IOType) {}

  async excute(input: CreateRoomDTO): Promise<CreatedRoomData> {
    // Create
    const room = await RoomMDL.createRoom(
      input.playerId,
      input.name,
      input.maxPlayers,
      input.visibility
    );

    const roomId = room._id.toString();

    // Join
    await this.joindCreatedRoom(input.playerId, roomId);

    return {
      roomId: roomId,
      name: room.name,
      maxPlayers: room.maxPlayers,
      visibility: room.visibility,
    };
  }

  private async joindCreatedRoom(
    playerId: string,
    roomId: string
  ): Promise<void> {
    const socket = await PlayerMDL.getPlayerSocket(playerId, this.io);
    if (!socket) {
      Room.deleteOne({ _id: roomId });
      throw new Error("Socket not found");
    }
    socket.join(roomId);
    await PlayerMDL.joinRoom(playerId, roomId);
  }
}
