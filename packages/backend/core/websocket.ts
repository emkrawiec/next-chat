import http from 'http';
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

let io: Server;

const initWSDebuggingUI = (io: Server) => instrument(io, {
  auth: false,
});

export const initWS = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      // origin: process.env.ALLOWED_WS_HOST,
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  initWSDebuggingUI(io);
}

export { io };