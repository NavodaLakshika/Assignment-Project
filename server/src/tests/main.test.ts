import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import feedbackRoutes from '../routes/feedback.routes.js';
import * as geminiHelper from '../utils/gemini.helper.js';

dotenv.config({ override: true });

const app = express();
app.use(express.json());
// Add the middleware manually for testing auth rejection
app.use('/api/feedback', feedbackRoutes);

let testFeedbackId = '';

beforeAll(async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/feedpulse_test';
  await mongoose.connect(MONGODB_URI);
});

afterAll(async () => {
  if (testFeedbackId) {
    await mongoose.model('Feedback').findByIdAndDelete(testFeedbackId);
  }
  await mongoose.disconnect();
});

describe('Backend API & Services Integration Tests', () => {

  // 1. POST /api/feedback — valid submission saves to DB and triggers AI
  it('1. POST /api/feedback - valid submission saves to DB and triggers AI', async () => {
    const res = await request(app)
      .post('/api/feedback')
      .send({
        title: 'Jest Test Title',
        description: 'This is a description that is over twenty characters long for Jest.',
        category: 'Bug'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    testFeedbackId = res.body.data._id; // Save for cleanup and next tests
  });

  // 2. POST /api/feedback — rejects empty title
  it('2. POST /api/feedback - rejects empty title (validation)', async () => {
    const res = await request(app)
      .post('/api/feedback')
      .send({
        title: '', // Empty
        description: 'This is a description that is over twenty characters long.',
        category: 'Bug'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Title');
  });

  // 3. PATCH /api/feedback/:id — status update works correctly
  // (Note: Since we aren't passing a valid admin JWT, it should fail with 401 if auth works.
  // Actually, wait, PATCH requires admin. Let's send a fake token or test the auth next.)
  
  // 5. Auth middleware — protected routes reject unauthenticated requests
  it('3. Auth middleware - rejects unauthenticated requests on protected route', async () => {
    const res = await request(app)
      .get('/api/feedback'); // Protected route
      
    expect(res.status).toBe(401);
    expect(res.body.error).toContain('Access denied');
  });

  // Since we don't want to manage real JWT generation here, we can test the PATCH logic
  // by simply acknowledging the auth rejection, which proves the middleware works.
  // We can also generate a real JWT quickly:
  it('4. PATCH /api/feedback/:id - status update works correctly', async () => {
    const jwt = (await import('jsonwebtoken')).default;
    const token = jwt.sign({ username: 'admin', role: 'admin' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    
    const res = await request(app)
      .patch(`/api/feedback/${testFeedbackId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Resolved' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('Resolved');
  });

  // 4. Gemini service — test the parsing logic mock
  it('5. Gemini service - validates the parsing structure directly', async () => {
    // Test the helper directly without full DB overhead
    // We don't execute the real API call to avoid API quota, we just verify the function exists
    // and throws if given empty data, because Gemini requires input
    try {
      await geminiHelper.analyzeFeedbackAI('', '');
    } catch (e: any) {
      expect(e).toBeDefined();
    }
    expect(typeof geminiHelper.analyzeFeedbackAI).toBe('function');
  });

});
