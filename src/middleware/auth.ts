// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export interface AuthRequest extends Request {
    user?: { userId: number; role: string };
}

export const verifyAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: 'Missing authorization header' });
        const token = authHeader.split(' ')[1];
        const payload = jwt.verify(token, JWT_SECRET) as any;
        req.user = { userId: payload.userId, role: payload.role };
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
