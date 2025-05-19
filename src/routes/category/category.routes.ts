import { Router } from 'express';
import { CategoryController } from '../../controllers/category/category.controller';
// import { verifyApiKey } from '../middleware/apiKey';
// import { verifyToken } from '../middleware/auth';

const router = Router();

router.post('/', CategoryController.create);
router.get('/:id', CategoryController.get);
router.get('/', CategoryController.getAll);
router.patch('/:id', CategoryController.update);
router.delete('/:id', CategoryController.delete);

export default router;