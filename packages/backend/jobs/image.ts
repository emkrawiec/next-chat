import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
//
import { ProcessPromiseFunction } from 'bull';
//
import { ImageJobDTO } from '../dto/image-dto';
import { resizeImage } from '../services/image';
import { getProjectRootDir } from '../utils/path';

export enum ImageJobTypes {
  RESIZE_IMAGE,
}

export const imageJobHandler: ProcessPromiseFunction<ImageJobDTO> = async (
  job
) => {
  const { ...dto } = job.data;

  switch (dto.type) {
    case ImageJobTypes.RESIZE_IMAGE: {
      const payload = dto.payload;
      const appDir = getProjectRootDir();
      const imageBuffer = await readFile(resolve(appDir, dto.filename));

      const resizedImageBuffer = await resizeImage({
        ...payload,
        imageBuffer,
      });

      await writeFile(dto.filename, resizedImageBuffer);
    }
  }
};
