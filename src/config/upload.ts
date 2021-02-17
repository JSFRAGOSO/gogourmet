import multer, { StorageEngine } from 'multer';
import crypto from 'crypto';
import path from 'path';

const tempFolder = path.resolve(__dirname, '..', '..', 'temp');
const uploadFolder = path.resolve(tempFolder, 'uploads');

interface IUploadConfig {
  driver: 's3' | 'disk';
  tempFolder: string;
  uploadFolder: string;
  multer: { storage: StorageEngine };
  config: {
    disk: { local: string };
    s3: { bucket: string };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,
  tempFolder,
  uploadFolder,
  multer: {
    storage: multer.diskStorage({
      destination: tempFolder,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex');

        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      },
    }),
  },
  config: {
    disk: {},
    s3: {
      bucket: 'app-gobarber-jsfragoso',
    },
  },
} as IUploadConfig;
