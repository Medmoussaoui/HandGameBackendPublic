import { randomUUID } from "crypto";

export function randomUniqueToken(): string {
  return randomUUID();
}
