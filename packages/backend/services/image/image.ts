import { resolve } from 'node:path';
import {  } from 'node:fs';
// Strange quirk from piscina esModuleInterop.
import Piscina = require('piscina');
import { ResizeImageDTO } from '../../dto/image-dto';

const imageWorkerPool = new Piscina({
  // dirname available as TS transforms to cjs.
  filename: resolve(__dirname, 'worker.js'),
  maxThreads: 2,
  minThreads: 1,
});

export const resizeImage = async (dto: ResizeImageDTO) => {
  const imageBuffer = await imageWorkerPool.run(dto, {
    name: 'resizeImageInWorker',
  }) as Buffer;

  return imageBuffer;
}