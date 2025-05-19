import express from 'express';
import { applyJob, getAppliedJobs } from '../../controllers/agent/job.controller';
import { auth, roleGuard } from '../../middlewares/auth.middleware';

const router = express.Router();

router.use(auth, roleGuard(['agent']));
router.post('/apply', applyJob);
router.get('/applied', getAppliedJobs);

export default router;