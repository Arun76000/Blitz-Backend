import express from 'express';
import { sendMessage, getMessages } from '../controllers/message.controller';
import { auth } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(auth);
router.post('/', sendMessage);
router.get('/', getMessages);

export default router;