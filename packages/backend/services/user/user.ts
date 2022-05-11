import { User, UserProfile } from '@next-chat/types';
//
import { EditUserProfileDTO } from '../../dto/user-dto';
import { ImageJobTypes } from '../../jobs/image';
import { prisma } from '../../prisma/init';
import { imageQueue } from '../../queue/image';

export const getUserProfilesByIds = async (ids: User['ID'][]) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        ID: true,
        avatar: true,
      },
      where: {
        ID: {
          in: ids
        }
      }
    });

    return users as UserProfile[];
  } catch (err: unknown) {
    console.log(err);
  }
}

export const getAllUserProfiles = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        ID: true,
        avatar: true
      },
    });

    return users as UserProfile[];
  } catch (err: unknown) {
    console.log(err);
  }
}

export const editUserProfile = async (dto: EditUserProfileDTO) => {
  const { userId, avatar, paymentGatewayCustomerID } = dto;

  const userUpdateParams: Partial<Pick<User, 'avatar' | 'paymentGatewayCustomerID'>> = {
    avatar,
    paymentGatewayCustomerID 
  }

  try {
    const updatedProfile = await prisma.user.update({
      where: {
        ID: userId
      },
      data: userUpdateParams
    });

    if (avatar) {
      imageQueue.add({
        filename: `uploads/avatar/${updatedProfile.avatar}`,
        type: ImageJobTypes.RESIZE_IMAGE,
        payload: {
          width: 200,
          height: 200
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
}