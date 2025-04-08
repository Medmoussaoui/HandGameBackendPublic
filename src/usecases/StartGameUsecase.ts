import { IOType } from "../types/global";
import * as RoomMDL from "../services/Room/model";
import * as PlayerMDL from "../services/Player/model";

import {
  GameCardOptions,
  PlayingData,
  RoundResultData,
  SelectedOption,
} from "../types/room.events.type";
import { IPlayer } from "../models/Player";
import { randomGameGard } from "../functions/randomGameOption";
import { DestroyRoomUsecase } from "./DestroyRoomUsecase";

const ROUND_DURATION = 13000; // 12 seconds for each round
const ROUND_BREAK = 8000; // 8 seconds break between rounds

export class StartGameUsecase {
  evaluator: EvalutaeRound = new EvalutaeRound();
  eliminater: EliminateLosers = new EliminateLosers(this.io);
  idleMoveHandler: AutoAssignIdleMoves = new AutoAssignIdleMoves();
  roomDestroy: DestroyRoomUsecase = new DestroyRoomUsecase(this.io);

  constructor(public io: IOType, public roomId: string) {}

  async start(roomId: string) {
    const room = await RoomMDL.getRoom(roomId);

    if (!room) {
      throw new Error("Room not found");
    }

    // Room is already started
    if (room.isGameStarted) return;

    room.isGameStarted = true;
    room.roundNumber = 1;
    room.currentRound = 1;
    await room.save();

    const firstRound = {
      roundNumber: room.currentRound,
      roundEndTime: new Date(Date.now() + ROUND_DURATION),
      playersCount: room.maxPlayers,
    };

    this.io.to(roomId).emit("gameStarted", firstRound);
    this.playing(firstRound);
  }

  /// Playing In Current Round #Number
  ///
  private playing(round: PlayingData) {
    this.io.to(this.roomId).emit("playing", round);
    setTimeout(async () => {
      await this.idleMoveHandler.excute(this.roomId);
      const roundResult = await this.evaluator.evaluate(this.roomId);
      this.io.to(this.roomId).emit("roundResult", roundResult);

      const isTie = roundResult.winingOption == undefined;

      // Eliminate Losers by leave them from room
      if (!isTie) {
        await this.eliminater.eliminate(roundResult.winingOption!, this.roomId);
      }

      if (!roundResult.isLastRound) {
        const newRound = await this.nextRound();
        this.roundBreak().then(() => this.playing(newRound));
      } else {
        // end game cleanup !!
        this.roomDestroy.destroy(this.roomId);
      }
    }, ROUND_DURATION);
  }

  private async nextRound(): Promise<PlayingData> {
    const room = await RoomMDL.getRoom(this.roomId);
    if (!room) {
      throw new Error("Room not found");
    }

    const futures = await Promise.all([
      PlayerMDL.resetPlayersMove(this.roomId),
      RoomMDL.getRoomPlayerCount(this.roomId),
    ]);

    const playersCount = futures[1];

    room.roundNumber++;
    room.currentRound++;
    room.roundEndTime = new Date(Date.now() + ROUND_DURATION);
    room.save();

    return {
      roundNumber: room.currentRound,
      roundEndTime: room.roundEndTime,
      playersCount: playersCount,
    };
  }

  private roundBreak(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ROUND_BREAK);
    });
  }
}

class AutoAssignIdleMoves {
  async excute(roomId: string) {
    const players = await this.playersWithoutMove(roomId);
    if (players.length > 0) {
      for (let player of players) {
        this.setRandomMove(player);
      }
    }
  }

  async playersWithoutMove(roomId: string): Promise<IPlayer[]> {
    return RoomMDL.getRoomPlayers(roomId, {
      currentMove: { $eq: "none" },
    });
  }

  async setRandomMove(player: IPlayer): Promise<void> {
    player.currentMove = randomGameGard();
    await player.save();
  }
}

class EvalutaeRound {
  beats = { rock: "scissors", paper: "rock", scissors: "paper" };

  async evaluate(roomId: string): Promise<RoundResultData> {
    const moves = await RoomMDL.getRoomMoves(roomId);
    const winningMove = this.determineWinningMove(moves);

    const isLastRound = moves.some(
      (move) => move.option === winningMove && move.quantity === 1
    );

    return {
      options: moves,
      winingOption: winningMove,
      isLastRound,
    };
  }

  private determineWinningMove(
    moves: SelectedOption[]
  ): GameCardOptions | undefined {
    const selectedOptions = moves.filter((m) => m.quantity > 0);
    // If all three options are present, it's a draw
    if (selectedOptions.length == 3 || selectedOptions.length == 0) return;
    // If only one option was selected, it wins
    if (selectedOptions.length === 1) return selectedOptions[0].option;

    const [option1, option2] = selectedOptions;

    // Tie — return undefined
    if (option1.option === option2.option) return undefined;

    if (this.beats[option1.option] === option2.option) return option1.option;
    return option2.option;
  }
}

class EliminateLosers {
  constructor(public io: IOType) {}

  async eliminate(
    winingOption: GameCardOptions,
    roomId: string
  ): Promise<void> {
    const players = await RoomMDL.getRoomPlayers(roomId, {
      currentMove: { $ne: winingOption },
    });

    for (const player of players) {
      player.roomId = undefined;
      await Promise.all([
        this.liveRoomSocket(player._id, roomId),
        player.save(),
      ]);
    }
  }

  private async liveRoomSocket(
    playerId: string,
    roomId: string
  ): Promise<void> {
    const socket = await PlayerMDL.getPlayerSocket(playerId, this.io);
    if (socket) socket.leave(roomId);
  }
}
