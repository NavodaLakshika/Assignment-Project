import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required' });
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: { token, user: { username, role: 'admin' } }
      });
    }

    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  } catch (error) {
    console.error('Error in login:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
