import express from 'express';
import { updateProfile, updateAdminProfile, updateAgencyProfile, updateAgentProfile, getProfile, getAllAgents, getAgentById, getAllAgency, getAgencyById } from '../../controllers/users/profile.controller';
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

//Agents-specific
router.get('/agents', asyncHandler(getAllAgents));
router.get('/agents/:id', asyncHandler(getAgentById));

//Agency-specific
router.get('/agency', asyncHandler(getAllAgency));
router.get('/agency/:id', asyncHandler(getAgencyById));

//user Profile
router.get('/:id', asyncHandler(getProfile));


export default router;