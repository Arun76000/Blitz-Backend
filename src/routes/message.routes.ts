import express from 'express';
import { sendMessage, getMessages } from '../controllers/message.controller';
import { authMiddleware } from '../middlewares/authorizations.middleware';
// import { auth } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authMiddleware);

router.post('/', sendMessage);
router.get('/', getMessages);

export default router;