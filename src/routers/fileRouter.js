import express from 'express';
import {
  pictureUploadCloudinary,
  pictureUploadImgur,
  pictureRemoveFromImgur,
  pictureRemoveFromCloudinary,
} from '../controllers/fileController';

const router = express.Router();

router.post('/picture/upload/cloudinary', pictureUploadCloudinary);
router.delete('/picture/remove/cloudinary/:id', pictureRemoveFromCloudinary);

router.post('/picture/upload/imgur', pictureUploadImgur);
router.delete('/picture/remove/imgur/:id', pictureRemoveFromImgur);

export default router;
