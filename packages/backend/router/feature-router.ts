import express from "express";
//
import { httpAuthCheckMiddleware } from "../middleware/auth";

export const getFeatureRouter = () => {
  const featureRouter = express.Router();

  featureRouter.get("/feature/:featureId", httpAuthCheckMiddleware);

  return featureRouter;
}; 