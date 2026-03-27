import { Router } from 'express';
import { submitFeedback, getAllFeedback, updateFeedbackStatus, deleteFeedback, getFeedbackById, getFeedbackSummary } from '../controllers/feedback.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Public route
router.post('/', submitFeedback);

// Protected routes (Admin only)
router.get('/summary', authenticateAdmin, getFeedbackSummary);
router.get('/', authenticateAdmin, getAllFeedback);
router.get('/:id', getFeedbackById);
router.patch('/:id/status', authenticateAdmin, updateFeedbackStatus);
router.delete('/:id', authenticateAdmin, deleteFeedback);

export default router;
