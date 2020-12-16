import express from 'express';
import {
  pictureUploadCloudinary,
  pictureUploadImgur,
  pictureRemoveFromImgur,
} from '../controllers/fileController';

const router = express.Router();

router.post('/picture/upload/cloudinary', pictureUploadCloudinary);
router.post('/picture/upload/imgur', pictureUploadImgur);
router.delete('/picture/remove/imgur/:id', pictureRemoveFromImgur);

export default router;
