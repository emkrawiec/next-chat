import multer from 'multer';
import mime from 'mime-types';
// 
import { getUploadMiddlewareConfig } from "../../middleware/upload";

const userAvatarUploadStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/avatar'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = mime.extension(file.mimetype);
    cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
  }
});

export const userAvatarUploadMiddleware = getUploadMiddlewareConfig(userAvatarUploadStorage);