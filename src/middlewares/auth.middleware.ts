import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { Types } from 'mongoose'; // Importar Types de mongoose

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Access denied' });
    return;
  }

  try {
    const decoded = verifyToken(token); // decoded es de tipo JwtPayload
    if (typeof decoded === 'string') {
      throw new Error('Invalid token');
    }

    req.userId = new Types.ObjectId(decoded.userId); // Convertir string a ObjectId
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};