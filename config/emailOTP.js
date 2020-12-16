import nodemailer from 'nodemailer';

// create reusable transporter object using the default SMTP transport
const Transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmailOTP = async (email) => {
  const OTP = Math.floor(100000 + Math.random() * 900000);
  const message = `Welcome to Nodejs-Starter-JS! <br><br> Your verification code is <h1>${OTP}</h1>`;
  // send mail with defined transport object
  let emailInfo = await Transporter.sendMail({
    from: '<morolswediu@gmail.com>',
    to: email,
    subject: 'Account verification',
    html: message,
  });
  emailInfo = {
    OTP,
    createdAtOTP: new Date(),
  };
  return emailInfo;
};

export default sendEmailOTP;
