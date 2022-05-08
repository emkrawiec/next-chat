import { User } from "@next-chat/types";
import axios from "axios";

export const getUsers = async (ids?: User['ID'][]) => {
  try {
    const users = await axios.get(`${process.env.NEXT_PUBLIC_HTTP_API_URL}/api/users`, {
      params: (ids?.length ?? 0) > 0 ? {
        id: ids
      } : {}
    });
    
    return users.data;
  } catch (err) {
    console.log(err);
  }
}

export const editUserProfile = async (userProfile: FormData) => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_HTTP_API_URL}/api/profile`, userProfile);
  } catch (err) {
    console.log(err);
  }
}