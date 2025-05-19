import express from 'express';
import { approveJob, getPendingJobs } from '../../controllers/admin/job.controller';
import { auth, roleGuard } from '../../middlewares/auth.middleware';

const router = express.Router();

router.use(auth, roleGuard(['admin']));
router.put('/:jobId/approve', approveJob);
router.get('/pending', getPendingJobs);

export default router;