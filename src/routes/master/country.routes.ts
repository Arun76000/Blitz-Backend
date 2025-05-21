import { Router } from 'express';
import { CountryController } from '../../controllers/master/country.controller';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateRequest } from '../../middlewares/validationRequest.middleware';
import { countryZod } from '../../core/ZOD/master/country.validator';
import { authMiddleware } from '../../middlewares/authorizations.middleware';
// import { verifyApiKey } from '../middleware/apiKey';
// import { verifyToken } from '../middleware/auth';

const router = Router();
router.use(authMiddleware)

router.post('/', validateRequest(countryZod), asyncHandler(CountryController.create));
router.get('/:id', asyncHandler(CountryController.get));
router.get('/', asyncHandler(CountryController.getAll));
router.patch('/:id', validateRequest(countryZod), asyncHandler(CountryController.update));
router.delete('/:id', asyncHandler(CountryController.delete));

export default router;

// verifyApiKey,
// verifyToken,

// , { partial: true }