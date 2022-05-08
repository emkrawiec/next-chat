import { getFeatureByID } from "../services/feature";

export const getFeature = async (req: Express.Request, res: Express.Response) => {
  const { featureId } = req.body;

  const feature = await getFeatureByID(featureId);

  if (feature) {
    return res.status(200).send();
  } else {
    return res.status(404).send();
  }
}