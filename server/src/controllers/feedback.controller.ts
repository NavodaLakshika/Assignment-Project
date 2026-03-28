import type { Request, Response, NextFunction } from 'express';
import Feedback, { FeedbackStatus, FeedbackCategory } from '../models/feedback.model.js';
import { analyzeFeedbackAI } from '../utils/gemini.helper.js';

// Public: Submit feedback
export const submitFeedback = async (req: Request, res: Response) => {
  try {
    const { title, description, category, name, email } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ success: false, error: 'Title, description, and category are required' });
    }

    if (description.length < 20) {
      return res.status(400).json({ success: false, error: 'Description must be at least 20 characters long' });
    }

    const feedback = new Feedback({
      title, description, category, name, email, status: FeedbackStatus.NEW
    });

    const savedFeedback = await feedback.save();

    setImmediate(async () => {
      try {
        const aiResponse = await analyzeFeedbackAI(title, description);
        if (aiResponse) {
          await Feedback.findByIdAndUpdate(savedFeedback._id, {
            ai_processed: true,
            ai_sentiment: aiResponse.sentiment,
            ai_priority: aiResponse.priority,
            ai_summary: aiResponse.summary,
            ai_tags: aiResponse.tags,
            category: Object.values(FeedbackCategory).includes(aiResponse.category) ? aiResponse.category : savedFeedback.category
          });
        }
      } catch (err) {}
    });

    return res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: savedFeedback
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Admin: Get all feedback with filters
export const getAllFeedback = async (req: Request, res: Response) => {
  try {
    const { status, category, priority, page = 1, limit = 10 } = req.query;

    const filter: any = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.ai_priority = { $gte: Number(priority) };

    const total = await Feedback.countDocuments(filter);
    const feedbackList = await Feedback.find(filter)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      data: feedbackList,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Admin: Get single feedback item
export const getFeedbackById = async (req: Request, res: Response) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ success: false, error: 'Feedback not found' });
    return res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Admin: Get AI-generated trend summary (Stats)
export const getFeedbackSummary = async (req: Request, res: Response) => {
  try {
    const total = await Feedback.countDocuments();
    const newItems = await Feedback.countDocuments({ status: FeedbackStatus.NEW });
    const resolvedItems = await Feedback.countDocuments({ status: FeedbackStatus.RESOLVED });

    // Calculate average priority (aggregation)
    const priorityResult = await Feedback.aggregate([
      { $match: { ai_processed: true } },
      { $group: { _id: null, avgPriority: { $avg: '$ai_priority' } } }
    ]);
    const avgPriority = priorityResult.length > 0 ? (priorityResult[0].avgPriority || 0).toFixed(1) : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalFeedback: total,
        openItems: newItems,
        resolvedItems,
        averagePriority: avgPriority
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Admin: Update feedback status
export const updateFeedbackStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(FeedbackStatus).includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const updated = await Feedback.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ success: false, error: 'Feedback not found' });

    return res.status(200).json({ success: true, data: updated, message: 'Status updated' });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Admin: Delete feedback
export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const deleted = await Feedback.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Feedback not found' });
    return res.status(200).json({ success: true, message: 'Feedback deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
