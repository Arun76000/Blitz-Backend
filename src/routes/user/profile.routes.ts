import express from 'express';
import { updateProfile, updateAdminProfile, updateAgencyProfile, updateAgentProfile, getProfile } from '../../controllers/users/profile.controller';
import { auth } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';
import { baseUserZod } from '../../core/ZOD/baseuser.validator';
import { validateRequest } from '../../middlewares/validationRequest.middleware';
import { agencyZod } from '../../core/ZOD/agency.validator';
import { agentZod } from '../../core/ZOD/agent.validator';

const router = express.Router();

router.use(auth);
router.put('/admin', validateRequest(baseUserZod, { partial: true }), asyncHandler(updateAdminProfile));
router.put('/agency', validateRequest(agencyZod, { partial: true }), asyncHandler(updateAgencyProfile));
router.put('/agent', validateRequest(agentZod, { partial: true }), asyncHandler(updateAgentProfile));
router.get('/:id', asyncHandler(getProfile));



export default router;