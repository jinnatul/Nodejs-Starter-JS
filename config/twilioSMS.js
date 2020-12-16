import './ImportEnv';
import configTwilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = configTwilio(accountSid, authToken);

const sendSMS = async (number) => {
  const OTP = Math.floor(100000 + Math.random() * 900000);
  const message = `Welcome to Nodejs-Starter-JS! Your verification code is ${OTP}`;
  let smsInfo = await client.messages.create({
    body: message,
    from: process.env.TWILIO_ACCOUNT_NUMBER,
    to: number,
  });
  smsInfo = {
    OTP,
    createdAtOTP: smsInfo.dateCreated,
  };
  return smsInfo;
};

export default sendSMS;
