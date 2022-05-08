import { z } from "zod";

const AddFeatureForUserDTO = z.object({
  featureId: z.number(),
  userId: z.number(),  
});

export type AddFeatureForUserDTO = z.infer<typeof AddFeatureForUserDTO>