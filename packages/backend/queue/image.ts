import Bull, { Job } from 'bull';
// 
import { ImageJobDTO } from '../dto/image-dto';
import { imageJobHandler, ImageJobTypes } from '../jobs/image';
import { logger } from '../services/log/logger';

export const imageQueue = new Bull<ImageJobDTO>("image");

const imageJobSuccessHandler = (job: Job<ImageJobDTO>) => {
  const dto = job.data;

  switch (dto.type) {
    case (ImageJobTypes.RESIZE_IMAGE): {
      logger.info(`Image ${dto.filename} resize job has finished.`);
      break;
    }
  }
}

const imageJobTickHandler = (job: Job<ImageJobDTO>) => {
  const dto = job.data;

  switch (dto.type) {
    case (ImageJobTypes.RESIZE_IMAGE): {
      logger.info(`Image ${dto.filename} resize job has started.`);
      break;
    }
  }
}

imageQueue.process(imageJobHandler);
imageQueue.on('active', imageJobTickHandler);
imageQueue.on('completed', imageJobSuccessHandler);
imageQueue.on('failed', (err) => {
  console.log(err);
});