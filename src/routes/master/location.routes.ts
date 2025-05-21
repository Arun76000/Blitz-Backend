import { Router } from 'express';
import { LocationController } from '../../controllers/master/location.controller';
import { authMiddleware } from '../../middlewares/authorizations.middleware';
// import { verifyApiKey } from '../middleware/apiKey';
// import { verifyToken } from '../middleware/auth';

const router = Router();

router.use(authMiddleware)

router.post('/',  LocationController.create);
router.get('/:id',  LocationController.get);
router.get('/',  LocationController.getAll);
router.patch('/:id',  LocationController.update);
router.delete('/:id',  LocationController.delete);

export default router;