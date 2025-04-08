import { Player } from "../../models/Player";
import { SelectedOption } from "../../types/room.events.type";

export async function getRoomMoves(roomId: string): Promise<SelectedOption[]> {
  const activePlayers = await Player.find({ roomId });

  const moves: SelectedOption[] = [
    { option: "rock", quantity: 0 },
    { option: "paper", quantity: 0 },
    { option: "scissors", quantity: 0 },
  ];

  for (const player of activePlayers) {
    if (player.currentMove) {
      const moveIndex = moves.findIndex((m) => m.option === player.currentMove);
      if (moveIndex !== -1) {
        moves[moveIndex].quantity++;
      }
    }
  }

  return moves;
}
