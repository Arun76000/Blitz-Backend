import { Router } from 'express';
import { CityController } from '../../controllers/master/city.controller';
// import { verifyApiKey } from '../middleware/apiKey';
// import { verifyToken } from '../middleware/auth';

const router = Router();

router.post('/', CityController.create);
router.get('/:id', CityController.get);
router.get('/', CityController.getAll);
router.patch('/:id', CityController.update);
router.delete('/:id', CityController.delete);

export default router;