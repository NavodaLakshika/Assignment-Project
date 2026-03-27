import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import feedbackRoutes from './routes/feedback.routes.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config({ override: true });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

// Health Check
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString() 
  });
});

// Routes
app.use('/api/feedback', feedbackRoutes);
app.use('/api/auth', authRoutes);

// Start Server immediately
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});

// Database Connection in background
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/feedpulse';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((error) => console.error('❌ MongoDB connection error:', error));
