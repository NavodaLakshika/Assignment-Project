import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';

const router = Router();

// Admin login
router.post('/login', login);

export default router;
