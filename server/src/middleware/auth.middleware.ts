import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';

export const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);

    if (decoded && decoded.role === 'admin') {
      (req as any).user = decoded;
      next();
    } else {
      return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};
