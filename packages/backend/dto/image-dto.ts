import { z } from "zod";
import { ImageJobTypes } from "../jobs/image";

const ResizeImageDTO = z.object({
  width: z.number(),
  height: z.number(),
  imageBuffer: z.instanceof(Buffer)
});

const ImageJobDTO = z.object({
  filename: z.string(),
  type: z.nativeEnum(ImageJobTypes),
  payload: ResizeImageDTO.pick({
    width: true,
    height: true
  })
});

export type ResizeImageDTO = z.infer<typeof ResizeImageDTO>;
export type ImageJobDTO = z.infer<typeof ImageJobDTO>;
