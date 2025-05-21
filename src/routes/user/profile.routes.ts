import express from 'express';
import { updateProfile, updateAdminProfile, updateAgencyProfile, updateAgentProfile, getProfile, getAllAgents, getAgentById, getAllAgency, getAgencyById } from '../../controllers/users/profile.controller';
import { asyncHandler } from '../../utils/asyncHandler';
import { baseUserZod } from '../../core/ZOD/baseuser.validator';
import { validateRequest } from '../../middlewares/validationRequest.middleware';
import { agencyZod } from '../../core/ZOD/agency.validator';
import { agentZod } from '../../core/ZOD/agent.validator';
import { authMiddleware, roleGuard } from '../../middlewares/authorizations.middleware';

const router = express.Router();


router.use(authMiddleware)

router.put('/admin', validateRequest(baseUserZod, { partial: true }), asyncHandler(updateAdminProfile));

//Agents-specific
router.route('/agents').get(roleGuard(['admin']), asyncHandler(getAllAgents))
router.route('/agents/:id')
    .get(roleGuard(['agent']), asyncHandler(getAgentById))
    .put(validateRequest(agentZod, { partial: true }), asyncHandler(updateAgentProfile))

//Agency-specific
router.route('/agency').get(asyncHandler(getAllAgency))
router.route('/agency/:id')
    .get(asyncHandler(getAgencyById))
    .put(validateRequest(agencyZod, { partial: true }), asyncHandler(updateAgencyProfile))

//user Profile
router.get('/:id', asyncHandler(getProfile));


export default router;