import express from 'express';
import { approveJob, getPendingJobs } from '../../controllers/admin/job.controller';
import { authMiddleware, roleGuard } from '../../middlewares/authorizations.middleware';

const router = express.Router();

router.use(authMiddleware, roleGuard(['admin']));
router.put('/:jobId/approve', approveJob);
router.get('/pending', getPendingJobs);

export default router;