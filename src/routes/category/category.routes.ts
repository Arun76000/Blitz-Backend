import { Router } from 'express';
import { CategoryController } from '../../controllers/category/category.controller';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateRequest } from '../../middlewares/validationRequest.middleware';
import { CategoryZod } from '../../core/ZOD/category.validator';
// import { verifyApiKey } from '../middleware/apiKey';
// import { verifyToken } from '../middleware/auth';

const router = Router();

router.post('/', validateRequest(CategoryZod), asyncHandler(CategoryController.create));
router.get('/:id', asyncHandler(CategoryController.get));
router.get('/', asyncHandler(CategoryController.getAll));
router.patch('/:id', validateRequest(CategoryZod), asyncHandler(CategoryController.update));
router.delete('/:id', asyncHandler(CategoryController.delete));

export default router;