// src/types/jwt.d.ts
import 'jsonwebtoken';

declare module 'jsonwebtoken' {
  interface JwtPayload {
    userId: string; // Añadir la propiedad userId
  }
}