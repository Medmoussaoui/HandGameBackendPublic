import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { initialMongoDBConnection } from "./config/iniital_mongodb_connection";
import cors from "cors";
import {
  CreateRoomData,
  JoinRoomData,
  JoinsData,
  LeaveRoomData,
} from "./types/room.events.type";

import { CreateRoomUsecase } from "./usecases/CreateRoomUsecase";
import { getPlayerBySocketId } from "./services/Player/GetPlayerBySocketId";
import { JoinRoomUsecase } from "./usecases/JoinRoomUsecase";
import { StartGameUsecase } from "./usecases/StartGameUsecase";

import * as SocketMDL from "./services/Socket/model";
import { MakeMoveUsecase } from "./usecases/MakeMoveUsecase";
import { LeaveRoomUsecase } from "./usecases/LeaveRoomUsecase";
import * as RoomMDL from "./services/Room/model";
import { DestroyRoomUsecase } from "./usecases/DestroyRoomUsecase";

// MongoDB connection
initialMongoDBConnection();

const app = express();

// Enable CORS for Express
app.use(
  cors({
    origin: "*",
    credentials: false,
    methods: ["GET", "POST"],
  })
);

// Add body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: false,
  },
  transports: ["websocket", "polling"],
});

const createRoomUsecase = new CreateRoomUsecase(io);
const joinRoomUsecase = new JoinRoomUsecase(io);
const makeMoveUsecase = new MakeMoveUsecase();
const leaveRoomUsecase = new LeaveRoomUsecase(io);
const roomDestroyUsecase = new DestroyRoomUsecase(io);

/// HTTP REQUESTS
///
app.get("/", (req, res) => {
  res.send("Hello World from the HandGame Server");
});

app.post("/api/rooms/new", async (req, res) => {});

app.get("/api/rooms", async (req, res) => {
  let page = 1;

  if (req.headers.page as string) {
    page = parseInt(req.headers.page as string);
  }

  const rooms = await RoomMDL.getPublicRooms({
    page: page,
  });

  res.send(rooms);
});

//// SOCKET
////
io.on("connection", (socket: Socket) => {
  SocketMDL.handlePlayerConnect(socket);

  console.log("---> A user connected [socket]-> " + socket.id);

  socket.on("disconnect", async () => {
    // handlePlayerDisconnect(socket);
  });

  socket.on("createRoom", async (data: CreateRoomData) => {
    try {
      const player = await getPlayerBySocketId(socket.id);
      if (!player) {
        throw new Error("Player not found");
      }
      const result = await createRoomUsecase.excute({
        playerId: player._id.toString(),
        ...data,
      });
      socket.emit("roomCreated", result);
    } catch (error) {
      console.log(error);
      socket.emit("error", { message: "Failed to create room" });
    }
  });

  socket.on("joinRoom", async (data: JoinRoomData) => {
    try {
      const player = await getPlayerBySocketId(socket.id);
      if (!player) {
        throw new Error("Player not found");
      }

      const result = await joinRoomUsecase.join({
        ...data,
        playerId: player._id.toString(),
      });

      socket.emit("roomJoined", result);

      socket.broadcast.to(data.roomId).emit("playerJoined", {
        roomId: data.roomId,
        joinedPlayers: result.joinedPlayers,
      } as JoinsData);

      /// Start Game if room is full
      if (result.joinedPlayers === result.totalPlayers) {
        const startGameUsecase = new StartGameUsecase(io, data.roomId);
        startGameUsecase.start(data.roomId);
      }
    } catch (err) {
      socket.emit("error", { message: "Failed to join room" });
    }
  });

  socket.on("leaveRoom", async (data: LeaveRoomData) => {
    try {
      await leaveRoomUsecase.leave(data.roomId, socket);
    } catch (err) {
      socket.emit("error", { message: "Failed to leave room" });
    }
  });

  socket.on("selectGameCard", async (data) => {
    const token = socket.data.token;
    makeMoveUsecase.excute({ token, option: data.option });
  });

  socket.on("cancelRoom", async (data) => {
    console.log("-----> cancelRoom");
    const playerId = socket.data.playerId;
    if (!playerId) return;
    const room = await RoomMDL.getOwnerRoom(playerId);
    if (room) {
      roomDestroyUsecase.destroy(room._id.toString());
    }
  });
});

// Cleanup timers when server shuts down
process.on("SIGTERM", () => {
  // gameManager.cleanup();
  // process.exit(0);
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
