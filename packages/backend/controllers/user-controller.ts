import { UserProfile } from "@next-chat/types";
import { Request, Response } from "express";
import { EditUserProfileDTO } from "../dto/user-dto";
import { getAllUserProfiles, editUserProfile, getUserProfilesByIds } from "../services/user";

export const getUsersAction = async (req: Request<{}, UserProfile[], {}, {
  id: string[]
}>, res: Response) => {
  try {
    let users;
    
    if (req.query.id) {
      users = await getUserProfilesByIds(req.query.id.map((id) => Number(id)));
    } else {
      users = await getAllUserProfiles();
    }

    if (users) {
      return res.status(200).json(users);
    } else {
      return res.status(204).json([]);
    }
  } catch (err) {
    console.log(err);
  }
}

export const editUserProfileAction = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.ID;
    const dto: EditUserProfileDTO = {
      userId,
      avatar: req.file?.filename,
    }
    
    await editUserProfile(dto);

    res.status(200).send();
  } catch (err) {
    console.log(err);
  }
}