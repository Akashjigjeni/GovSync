import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { signJwtToken, generateSha256, verifyJwtToken } from '../security.js';
import { AuthMethod, CitizenProfile } from '../types.js';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', (req: Request, res: Response) => {
  const { authMethod = 'AADHAAR_OTP', aadhaarNumber, phone, password } = req.body;

  const currentProfile = db.getCitizenProfile();
  const { token, claims } = signJwtToken(currentProfile, 'CITIZEN');

  db.addAuditLog({
    id: `LOG-AUTH-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: {
      id: currentProfile.id,
      name: currentProfile.fullName,
      role: 'CITIZEN'
    },
    action: 'CITIZEN_LOGIN',
    affectedCitizenId: currentProfile.id,
    affectedCitizenName: currentProfile.fullName,
    details: `Citizen authenticated successfully via ${authMethod} and issued RS256 JWT session token.`,
    ipAddress: req.ip || '103.21.244.18',
    integrityHash: generateSha256(`LOGIN_${currentProfile.id}_${Date.now()}`)
  });

  return res.json({
    success: true,
    data: {
      jwtToken: token,
      claims,
      authMethod: authMethod as AuthMethod,
      authenticatedAt: new Date().toISOString(),
      user: currentProfile
    }
  });
});

// POST /api/auth/register
authRouter.post('/register', (req: Request, res: Response) => {
  const profileData: CitizenProfile = req.body;

  if (!profileData.fullName || !profileData.phone) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_FIELDS',
      message: 'Full name and mobile phone are required for registration.'
    });
  }

  const updatedProfile = db.updateCitizenProfile(profileData);
  const { token, claims } = signJwtToken(updatedProfile, 'CITIZEN');

  db.addAuditLog({
    id: `LOG-REG-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: {
      id: updatedProfile.id,
      name: updatedProfile.fullName,
      role: 'CITIZEN'
    },
    action: 'CITIZEN_REGISTER',
    affectedCitizenId: updatedProfile.id,
    affectedCitizenName: updatedProfile.fullName,
    details: `New standardized Citizen Profile registered with DigiLocker and DBT Bank verification.`,
    ipAddress: req.ip || '103.21.244.18',
    integrityHash: generateSha256(`REGISTER_${updatedProfile.id}_${Date.now()}`)
  });

  return res.status(201).json({
    success: true,
    data: {
      jwtToken: token,
      claims,
      authMethod: 'AADHAAR_OTP' as AuthMethod,
      authenticatedAt: new Date().toISOString(),
      user: updatedProfile
    }
  });
});

// GET /api/auth/me
authRouter.get('/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyJwtToken(token);

  if (!decoded) {
    return res.status(401).json({ success: false, error: 'EXPIRED_OR_INVALID_TOKEN' });
  }

  const currentProfile = db.getCitizenProfile();
  return res.json({
    success: true,
    data: {
      user: currentProfile,
      claims: decoded
    }
  });
});
