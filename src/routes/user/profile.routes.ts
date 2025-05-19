import express from 'express';
import { updateProfile, getProfile } from '../../controllers/users/profile.controller';
import { auth } from '../../middlewares/auth.middleware';

const router = express.Router();

router.use(auth);
router.put('/', updateProfile);
router.get('/', getProfile);

export default router;