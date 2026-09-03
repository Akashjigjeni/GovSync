import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { CitizenProfile, JwtClaims, UserRole } from './types.js';

const JWT_SECRET = process.env.JWT_SECRET || 'govsync_sih2026_super_secure_rsa256_key_national_interop';

export function generateSha256(input: string | object): string {
  const content = typeof input === 'string' ? input : JSON.stringify(input);
  return crypto.createHash('sha256').update(content).digest('hex');
}

export function generateTokenId(): string {
  const rand = Math.floor(10000 + Math.random() * 90000);
  const suffix = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `CST-2026-${rand}${suffix}`;
}

export function generateApplicationNumber(serviceCode: string): string {
  const prefix = serviceCode.replace(/[^A-Z]/g, '').slice(0, 8);
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `MH-${prefix}-2026-${rand}`;
}

export function generateSanctionCertificateNumber(): string {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `SANCTION-MH-2026-${rand}`;
}

export function signJwtToken(profile: CitizenProfile, role: UserRole = 'CITIZEN'): { token: string; claims: JwtClaims } {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 24 * 60 * 60; // 24 hours

  const claims: JwtClaims = {
    sub: profile.id,
    name: profile.fullName,
    role,
    aadhaarMasked: profile.aadhaarNumber,
    email: profile.email,
    phone: profile.phone,
    scopes: ['PROFILE_READ', 'CONSENT_GRANT', 'SERVICE_APPLY', 'DIGILOCKER_SYNC'],
    iss: 'https://auth.govsync.gov.in',
    iat,
    exp,
    jti: `jwt-sec-${Date.now()}-${Math.floor(Math.random() * 10000)}`
  };

  const token = jwt.sign(claims, JWT_SECRET, { algorithm: 'HS256' });
  return { token, claims };
}

export function verifyJwtToken(token: string): JwtClaims | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtClaims;
  } catch (err) {
    return null;
  }
}

export interface AuthenticatedRequest extends Request {
  user?: JwtClaims;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Missing or malformed Authorization Bearer token'
    });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyJwtToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Expired or invalid JWT Session Signature'
    });
  }

  req.user = decoded;
  next();
}
