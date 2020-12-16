import express from 'express';
import authRouter from './authRouter';
import fileRouter from './fileRouter';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/profile', fileRouter);

export default router;
