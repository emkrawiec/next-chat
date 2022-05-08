import axios from 'axios';
import { CreateRoomPayload, EditRoomPayload, GetRoomsResponsePayload, Room, User } from '@next-chat/types';

export const getRoom = async (roomId: Room['ID']) => {
  try {
    const room = await axios.get(`${process.env.NEXT_PUBLIC_HTTP_API_URL}/api/rooms/${roomId}`);
    
    return room.data;
  } catch (err) {
    console.log(err);
  }
}

export const editRoom = async (roomId: Room["ID"], payload: EditRoomPayload) => {
  try {
    await axios.patch(`${process.env.NEXT_PUBLIC_HTTP_API_URL}/api/rooms/edit/${roomId}`, payload);
  } catch (err) {
    console.log(err);
  }
}

export const getRooms = async () => {
  try {
    const rooms = await axios.get<GetRoomsResponsePayload>(`${process.env.NEXT_PUBLIC_HTTP_API_URL}/api/rooms/`);
    return rooms.data;
  } catch (err) {
    console.log(err);
  }
}

export const createRoom = async (payload: CreateRoomPayload) => {
  try {
    const rooms = await axios.post(`${process.env.NEXT_PUBLIC_HTTP_API_URL}/api/rooms`, payload);
  } catch (err) {
    console.log(err);
  }
}

export const archiveRoom = async (roomId: Room['ID']) => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_HTTP_API_URL}/api/rooms/archive/${roomId}`);
  } catch (err) {
    console.log(err);
  }
}

export const removeRoom = async (roomId: Room['ID']) => {
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_HTTP_API_URL}/api/rooms/${roomId}`);
  } catch (err) {
    console.log(err);
  }
}

export const kickOutOfRoom = async (roomId: Room['ID'], userId: User['ID']) => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_HTTP_API_URL}/api/rooms/kick/`, {
      roomId,
      userId
    });
  } catch (err: unknown) {
    console.log(err);
  }
}