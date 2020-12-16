import fs from 'fs';
import Imgur from 'imgur';
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

/*  Cloudinary  */
// picture upload
const pictureUploadCloudinary = catchAsync(async (req, res, next) => {
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

// picture remove
const pictureRemoveFromCloudinary = catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const imageId = req.params.id;
  cloudinary.uploader.destroy(imageId, (data) => {
    if (data.result !== 'ok') {
      return next(new AppError(`Invalid image id: ${imageId}`, 400));
    }
    sendMessage(res, 'ok', 200, 'Picture remove successfully');
  });
});

/*  Imgur  */
// picture upload
const pictureUploadImgur = catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const { email } = req.body;

  let userInfo = await User.findOne({ email });
  if (userInfo) {
    let filePath = req.files.photo.tempFilePath;
    Imgur.uploadFile(filePath).then(async (data) => {
      // Remove file from temp directory
      fs.unlinkSync(filePath);

      const pictureInfo = {
        picture: data.data.link,
        pictureId: data.data.deletehash,
      };

      userInfo = await User.findByIdAndUpdate(userInfo._id, pictureInfo, {
        new: true,
        runValidators: true,
      });
      sendData(res, userInfo);
    }).catch(() => {
      next(new AppError('An unexpected error occurred while uploading your image', 400));
    });
  } else {
    next(new AppError('Email not exist', 404));
  }
});

// picture remove
const pictureRemoveFromImgur = catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const imageId = req.params.id;
  Imgur.deleteImage(imageId).then(() => {
    sendMessage(res, 'ok', 200, 'Picture remove successfully');
  }).catch(() => {
    next(new AppError(`Invalid image id: ${imageId}`, 400));
  });
});

export {
  pictureUploadCloudinary,
  pictureUploadImgur,
  pictureRemoveFromImgur,
  pictureRemoveFromCloudinary,
};
