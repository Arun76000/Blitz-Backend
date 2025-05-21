import express from 'express';
import { applyJob, getAppliedJobs } from '../../controllers/agent/job.controller';
import {  authMiddleware,roleGuard } from '../../middlewares/authorizations.middleware';

const router = express.Router();

router.use(router.use(authMiddleware), roleGuard(['agent']));

router.post('/apply', applyJob);
router.get('/applied', getAppliedJobs);

export default router;