import { Types } from 'mongoose';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: Types.ObjectId; // Añadir la propiedad userId
  }
}