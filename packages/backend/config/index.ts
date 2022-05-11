import { resolve } from 'node:path';
//
import { getProjectRootDir } from '../utils/path';

export const CONFIG = {
  uploadsDir: {
    avatar: resolve(getProjectRootDir(), 'uploads/avatar'),
  },
};
