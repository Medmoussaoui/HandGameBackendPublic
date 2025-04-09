import { Room } from "../../models/Room";
import { PublicRoomEntity, RoomVisibility } from "../../types/room.entitys";
import { getRoomPlayerCount } from "./GetRoomPlayerCount";

export interface GetPublicRoomsProps {
  page?: number; // default = 1
  limit?: number; // default = 10
  sortBy?: "createdAt" | "name"; // example sort fields
  order?: "asc" | "desc";
  search?: string; // optional text search
}

export async function getPublicRooms(
  props: GetPublicRoomsProps
): Promise<PublicRoomEntity[]> {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
    search,
  } = props;

  const skip = (page - 1) * limit;

  const filter: any = {
    visibility: RoomVisibility.PUBLIC,
  };

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  const query = await Room.find(filter)
    .select("_id name maxPlayers visibility owner isGameStarted createdAt")
    .sort({ [sortBy]: order === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  if (query.length === 0) return [];

  const rooms: PublicRoomEntity[] = [];

  const mapItem = async (item: (typeof query)[0]) => {
    rooms.push({
      roomId: item._id,
      name: item.name,
      maxPlayers: item.maxPlayers,
      visibility: item.visibility,
      owner: item.owner,
      joinedPlayers: await getRoomPlayerCount(item._id),
      createdAt: item.createdAt,
    });
  };

  let resolved = 0;
  await new Promise(async (resolve, reject) => {
    for (let room of query) {
      mapItem(room).then(() => {
        resolved++;
        if (resolved === query.length) resolve(true);
      });
    }
  });

  return rooms;
}
