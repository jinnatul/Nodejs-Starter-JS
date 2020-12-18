import express from 'express';
import authRouter from './authRouter';
import fileRouter from './fileRouter';
import profileRouter from './profileRouter';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/profile', fileRouter);
router.use('/profile', profileRouter);

export default router;
