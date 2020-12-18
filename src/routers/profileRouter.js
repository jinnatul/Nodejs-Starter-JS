import express from 'express';
import {
  getProfiles,
} from '../controllers/profileController';

const router = express.Router();

router.get('/:id', getProfiles);

export default router;
