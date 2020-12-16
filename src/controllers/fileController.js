import fs from 'fs';
import catchAsync from '../middlewares/catchAsync';
import AppError from '../../utils/AppError';
import cloudinary from '../../config/cloudinary';
import User from '../models/User';

const sendData = (res, data) => {
  res.json({
    status: 'ok',
    data,
  });
};

const sendMessage = (res, type, statusCode, message) => {
  res.status(statusCode).json({
    status: type,
    message,
  });
};

// cloudinary image upload
const fileUploadCloudinary = catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const { email } = req.body;

  let userInfo = await User.findOne({ email });
  if (userInfo) {
    let filePath = req.files.photo.tempFilePath;
    cloudinary.uploader.upload(filePath, async (data) => {
      if (data.error) {
        return next(new AppError('An unexpected error occurred while uploading your image', 400));
      }
      // Remove file from temp directory
      fs.unlinkSync(filePath);

      const pictureInfo = {
        picture: data.url,
        pictureId: data.public_id,
      };
      userInfo = await User.findByIdAndUpdate(userInfo._id, pictureInfo, {
        new: true,
        runValidators: true,
      });
      sendData(res, userInfo);
    });
  } else {
    next(new AppError('Email not exist', 404));
  }
});

export {
  fileUploadCloudinary,
};
