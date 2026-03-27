import mongoose, { Schema, Document } from 'mongoose';

export enum FeedbackStatus {
  NEW = 'New',
  IN_REVIEW = 'In Review',
  RESOLVED = 'Resolved'
}

export enum FeedbackCategory {
  BUG = 'Bug',
  FEATURE_REQUEST = 'Feature Request',
  IMPROVEMENT = 'Improvement',
  OTHER = 'Other'
}

export interface IFeedback extends Document {
  title: string;
  description: string;
  category: string;
  name?: string;
  email?: string;
  status: FeedbackStatus;
  ai_processed: boolean;
  ai_sentiment?: 'Positive' | 'Neutral' | 'Negative';
  ai_priority?: number;
  ai_summary?: string;
  ai_tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, minlength: 20 },
  category: { type: String, required: true, enum: Object.values(FeedbackCategory) },
  name: { type: String, trim: true },
  email: { type: String, lowercase: true, trim: true },
  status: { type: String, required: true, enum: Object.values(FeedbackStatus), default: FeedbackStatus.NEW },
  ai_processed: { type: Boolean, default: false },
  ai_sentiment: { type: String, enum: ['Positive', 'Neutral', 'Negative'] },
  ai_priority: { type: Number, min: 1, max: 10 },
  ai_summary: { type: String },
  ai_tags: [{ type: String }],
}, { timestamps: true });

// Indexes for performance
FeedbackSchema.index({ status: 1 });
FeedbackSchema.index({ category: 1 });
FeedbackSchema.index({ ai_priority: -1 });
FeedbackSchema.index({ createdAt: -1 });

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);
