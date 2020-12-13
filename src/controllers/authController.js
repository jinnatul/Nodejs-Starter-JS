import catchAsync from '../middlewares/catchAsync';
import AppError from '../../utils/AppError';
import User from '../models/User';
import sendSMS from '../middlewares/twilioSMS';
import {
  createJWT,
} from '../middlewares/jwtToken';

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

const smsAuthentication = catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const {
    name,
    phone,
    password,
  } = req.body;
  if (!name) return next(new AppError('Provide your name.', 400));
  if (!phone) return next(new AppError('Provide your phone.', 400));
  if (!password) return next(new AppError('Provide your password.', 400));

  let userInfo = await User.findOne({
    phone,
  });
  if (userInfo) return next(new AppError('Already use this number.', 400));

  const otpInfo = await sendSMS(phone);
  const reqBody = {
    ...req.body,
    otp: otpInfo.OTP,
    createdAtOTP: otpInfo.createdAtOTP,
  };
  userInfo = await User.create(reqBody);
  if (!userInfo) return next(new AppError('Try again.'));
  sendMessage(res, 'ok', 201, `Send an SMS verification code to ${phone}`);
});

const smsVerify = catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const {
    otp,
    phone,
  } = req.body;

  let userInfo = await User.findOne({
    phone,
    otp,
  }).select('createdAtOTP');

  if (!userInfo) next(new AppError('Provide valid verification code.', 400));

  const currentTime = new Date();
  const difference = currentTime - userInfo.createdAtOTP;
  if (difference > 300000) return next(new AppError('Expire SMS verification code.', 403));

  userInfo = await User.findByIdAndUpdate(userInfo._id, {
    active: true,
  }, {
    new: true,
    runValidators: true,
  });

  userInfo._doc.token = createJWT(userInfo._id);
  sendData(res, userInfo);
});

export {
  smsAuthentication,
  smsVerify,
};
