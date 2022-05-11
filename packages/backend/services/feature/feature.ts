import { Feature } from '@prisma/client';
import { AddFeatureForUserDTO } from '../../dto/feature-dto';
import { PaymentFullfilledEvent } from '../../event/payment';
import { prisma } from '../../prisma/init';

export const getFeatureByID = async (id: Feature['ID']) => {
  try {
    const feature = await prisma.feature.findUnique({
      where: {
        ID: id,
      },
    });

    return feature;
  } catch (err: unknown) {
    console.log(err);
  }
};

export const prepareAddFeatureForUserDtoFromPaymentFullfilledEvent = async (
  paymentIntentSucessEvent: PaymentFullfilledEvent
): Promise<AddFeatureForUserDTO> => {
  const { paymentIntentId } = paymentIntentSucessEvent;

  const payment = await prisma.paymentIntent.findFirst({
    where: {
      ID: paymentIntentId,
    },
  });

  if (!payment) {
    throw new Error();
  }

  const { featureId, userId } = payment;

  return {
    featureId,
    userId,
  };
};

export const addFeatureForUser = async (dto: AddFeatureForUserDTO) => {
  const { featureId, userId } = dto;

  const updatedUser = await prisma.user.update({
    where: {
      ID: userId,
    },
    data: {
      features: {
        create: {
          featureId,
        },
      },
    },
  });

  if (!updatedUser) {
    throw new Error();
  }
};

export const getUserFeature = async (
  featureId: Feature['ID'],
  userId: number
) => {
  const userFeature = await prisma.userFeatures.findFirst({
    where: {
      userId,
      featureId,
    },
  });

  return Boolean(userFeature);
};
