import jwt from 'jsonwebtoken';
import { env } from '../env.js';
import { AuthTokenPayload, UserRole } from '@codencampus/types';

export function signAccessToken(payload: Omit<AuthTokenPayload, 'iat' | 'exp'>, expiresIn = '1h'): string {
  return jwt.sign(payload, env.SUPABASE_JWT_SECRET, {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
    algorithm: 'HS256',
  });
}

export function verifyAccessToken(token: string): AuthTokenPayload {
  try {
    const decoded = jwt.verify(token, env.SUPABASE_JWT_SECRET, {
      algorithms: ['HS256'],
    }) as AuthTokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('TOKEN_EXPIRED');
    }
    throw new Error('INVALID_TOKEN');
  }
}

