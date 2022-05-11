import multer, { StorageEngine } from 'multer';

const DEFAULT_UPLOADS_DIR = './uploads';

export const getUploadMiddlewareConfig = (storage?: StorageEngine) => {
  if (storage) {
    return multer({
      storage,
    });
  }

  return multer({
    dest: DEFAULT_UPLOADS_DIR,
  });
};
