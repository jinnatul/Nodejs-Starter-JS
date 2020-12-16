import express from 'express';
import {
  fileUploadCloudinary,
} from '../controllers/fileController';

const router = express.Router();

router.post('/picture/upload', fileUploadCloudinary);

export default router;
