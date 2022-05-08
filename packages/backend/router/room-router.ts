import express from "express";
import { io } from "../core/websocket";
import { initAuthForWS } from "../services/auth";
import { roomEventEmitter } from '../services/room';
//
import {
  httpAuthCheckMiddleware,
  wsAuthCheckMiddleware,
} from "../middleware/auth";
import {
  getRoomsHTTPAction,
  createRoomHTTPAction,
  validateCreateRoomActionPayloadMiddleware,
  joinRoomWSAction,
  leaveRoomWSAction,
  getRoomMessagesAndMembersWSAction,
  createMessageHTTPAction,
  createMessageWSAction,
  updateRoomMembersAction,
  removeRoomHTTPAction,
  archiveRoomHTTPAction,
  kickUserOutOfRoomHTTPAction,
  getRoomHTTPAction,
  editRoomHTTPAction
} from "../controllers/room/room-controller";

export const getRoomRouter = () => {
  const roomRouter = express.Router();

  roomRouter.get("/rooms", httpAuthCheckMiddleware, getRoomsHTTPAction);
  roomRouter.get('/rooms/:id', httpAuthCheckMiddleware, getRoomHTTPAction);
  roomRouter.post(
    "/rooms/",
    httpAuthCheckMiddleware,
    validateCreateRoomActionPayloadMiddleware,
    createRoomHTTPAction
  );
  roomRouter.patch('/rooms/edit/:id', httpAuthCheckMiddleware, editRoomHTTPAction);
  roomRouter.post('/rooms/archive/:id', httpAuthCheckMiddleware, archiveRoomHTTPAction);
  roomRouter.delete('/rooms/:id', httpAuthCheckMiddleware, removeRoomHTTPAction);
  roomRouter.post('/rooms/kick', httpAuthCheckMiddleware, kickUserOutOfRoomHTTPAction);
  roomRouter.post("/messages", httpAuthCheckMiddleware, createMessageHTTPAction);

  const roomNamespace = io.of("/rooms");
  initAuthForWS(roomNamespace);
  
  roomNamespace.use(wsAuthCheckMiddleware);
  roomNamespace.on("connection", (socket) => {
    socket.on("room:join", joinRoomWSAction(socket));
    socket.on("room:leave", leaveRoomWSAction(socket));
    socket.on("room:init", getRoomMessagesAndMembersWSAction(socket));
    socket.on("room:post-message", createMessageWSAction(socket));
    roomEventEmitter.on('room:user-join', (payload) => updateRoomMembersAction(socket)(payload));
    roomEventEmitter.on('room:user-leave', (payload) => updateRoomMembersAction(socket)(payload));
    roomEventEmitter.on('room:user-kicked', (payload) => updateRoomMembersAction(socket)(payload));
    roomEventEmitter.on('room:updated', (payload) => updateRoomMembersAction(socket)(payload));
  });

  return roomRouter;
};
