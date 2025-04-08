import { GameCardOptions } from "../types/room.events.type";

const choices: GameCardOptions[] = ["rock", "paper", "scissors"];

export function randomGameGard(): GameCardOptions {
  return choices[Math.floor(Math.random() * choices.length)];
}
