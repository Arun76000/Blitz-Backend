import express from 'express';
import { postJob, getJobs } from '../../controllers/agency/job.controller';
import { auth, roleGuard } from '../../middlewares/auth.middleware';

const router = express.Router();

router.use(auth, roleGuard(['agency']));
router.post('/', postJob);
router.get('/', getJobs);

export default router;