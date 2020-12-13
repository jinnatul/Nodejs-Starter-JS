import jwt from 'jsonwebtoken';

const createJWT = (userId) => {
  const token = jwt.sign({
    userId,
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

export {
  createJWT,
};
