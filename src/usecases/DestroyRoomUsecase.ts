import * as RoomMDL from "../services/Room/model";
import { IOType } from "../types/global";
import { LeavedRoomData } from "../types/room.events.type";

export class DestroyRoomUsecase {
  constructor(public io: IOType) {}

  async destroy(roomId: string) {
    await RoomMDL.deleteRoom(roomId);
    const sockets = await this.io.in(roomId).fetchSockets();

    const payload: LeavedRoomData = { roomId: roomId };
    for (const socket of sockets) {
      socket.emit("roomLeft", payload);
      socket.leave(roomId);
    }
  }
}
