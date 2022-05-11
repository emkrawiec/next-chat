import Express from 'express';
import { EmptyObject } from '@next-chat/types';
//
import { EditUserProfileDTO } from '../dto/user-dto';
import {
  getAllUserProfiles,
  editUserProfile,
  getUserProfilesByIds,
} from '../services/user';

export const getUsersAction = async (
  req: Express.Request<
    EmptyObject,
    EmptyObject,
    EmptyObject,
    {
      id: string[];
    }
  >,
  res: Express.Response,
  next: Express.NextFunction
) => {
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
    next(err);
  }
};

export const editUserProfileAction = async (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  try {
    const userId = req.user!.ID;
    const dto: EditUserProfileDTO = {
      userId,
      avatar: req.file?.filename,
    };

    await editUserProfile(dto);

    res.status(200).send();
  } catch (err: unknown) {
    next(err);
  }
};
