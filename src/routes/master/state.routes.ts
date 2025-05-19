import { Router } from 'express';
import { StateController } from '../../controllers/master/state.controller';
// import { verifyApiKey } from '../middleware/apiKey';
// import { verifyToken } from '../middleware/auth';

const router = Router();

router.post('/', StateController.create);
router.get('/:id', StateController.get);
router.get('/', StateController.getAll);
router.patch('/:id', StateController.update);
router.delete('/:id', StateController.delete);

export default router;