import express from 'express';
import { postJob, getJobs } from '../../controllers/agency/job.controller';
import { authMiddleware, roleGuard } from '../../middlewares/authorizations.middleware';

const router = express.Router();

router.use(router.use(authMiddleware), roleGuard(['agent']));

router.post('/', postJob);
router.get('/', getJobs);

export default router;