import { DefaultEventsMap, Server } from "socket.io";

export type IOType = Server<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>;
