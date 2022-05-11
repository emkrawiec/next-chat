import Express from 'express';
import { APIGetFeatureRequestPayload, EmptyObject } from '@next-chat/types';
//
import { getFeatureByID } from '../services/feature';

export const getFeature = async (
  req: Express.Request<EmptyObject, EmptyObject, APIGetFeatureRequestPayload>,
  res: Express.Response
) => {
  const { featureId } = req.body;
  const maybeFeatureIdInt = Number(featureId);

  if (!Number.isInteger(maybeFeatureIdInt)) {
    return res.status(400).send();
  }

  const feature = await getFeatureByID(maybeFeatureIdInt);

  if (feature) {
    return res.status(200).send();
  } else {
    return res.status(404).send();
  }
};
