import { IOType } from "../types/global";
import { JoinedRoomData, JoinRoomData } from "../types/room.events.type";
import * as RoomMDL from "../services/Room/model";
import * as PlayerMDL from "../services/Player/model";

interface JoinRoomDTO extends JoinRoomData {
  playerId: string;
}

export class JoinRoomUsecase {
  constructor(public io: IOType) {}

  async join(input: JoinRoomDTO): Promise<JoinedRoomData> {
    const room = await RoomMDL.getRoom(input.roomId);

    if (!room) {
      throw new Error("Room not found");
    }

    const playersCount = await RoomMDL.getRoomPlayerCount(room._id.toString());
    if (playersCount >= room.maxPlayers) {
      throw new Error("Room is full");
    }

    const socket = await PlayerMDL.getPlayerSocket(input.playerId, this.io);
    if (!socket) {
      throw new Error("Socket not found");
    }

    PlayerMDL.joinRoom(input.playerId, room._id.toString());
    socket.join(input.roomId);

    return {
      roomId: room._id.toString(),
      roomName: room.name,
      totalPlayers: room.maxPlayers,
      joinedPlayers: playersCount + 1,
    };
  }
}
