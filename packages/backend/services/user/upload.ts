import multer from 'multer';
import mime from 'mime-types';
//
import { getUploadMiddlewareConfig } from '../../middleware/upload';
import { CONFIG } from '../../config';

const userAvatarUploadStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, CONFIG.uploadsDir.avatar),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = mime.extension(file.mimetype);
    cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
  },
});

export const userAvatarUploadMiddleware = getUploadMiddlewareConfig(
  userAvatarUploadStorage
);
