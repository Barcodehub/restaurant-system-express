 
import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';

export const roleMiddleware = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.userId).populate('role');
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (!roles.includes(user.role.name)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
};