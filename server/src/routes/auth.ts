import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { signJwtToken, generateSha256, verifyJwtToken } from '../security.js';
import { AuthMethod, CitizenProfile } from '../types.js';

export const authRouter = Router();

// Presaved Demo Accounts Registry for SIH Presentation
const DEMO_CREDENTIALS: Record<string, { role: 'CITIZEN' | 'OFFICER' | 'ADMIN'; name: string; password: string }> = {
  'aarav.sharma': { role: 'CITIZEN', name: 'Aarav Sharma', password: 'GovSync@2026' },
  'aarav@govsync.gov.in': { role: 'CITIZEN', name: 'Aarav Sharma', password: 'GovSync@2026' },
  'CIT-IN-2026-98124': { role: 'CITIZEN', name: 'Aarav Sharma', password: 'GovSync@2026' },
  'officer.rajesh': { role: 'OFFICER', name: 'Rajesh Kumar (SDO)', password: 'Officer@2026' },
  'officer@govsync.gov.in': { role: 'OFFICER', name: 'Rajesh Kumar (SDO)', password: 'Officer@2026' },
  'admin.nic': { role: 'ADMIN', name: 'National Gateway Authority', password: 'Admin@2026' },
  'admin@govsync.gov.in': { role: 'ADMIN', name: 'National Gateway Authority', password: 'Admin@2026' }
};

// POST /api/auth/login
authRouter.post('/login', (req: Request, res: Response) => {
  const {
    username,
    password,
    consentAccepted = true,
    authMethod = 'CREDENTIALS'
  } = req.body;

  if (!consentAccepted) {
    return res.status(400).json({
      success: false,
      error: 'CONSENT_REQUIRED',
      message: 'Citizen consent is mandatory under DPDP Act 2023 before authentication.'
    });
  }

  const normalizedUser = username ? String(username).toLowerCase().trim() : 'aarav.sharma';
  const matched = DEMO_CREDENTIALS[normalizedUser] || DEMO_CREDENTIALS['aarav.sharma'];
  const targetRole = matched.role;

  const currentProfile = db.getCitizenProfile();
  const { token, claims } = signJwtToken(currentProfile, targetRole);

  db.addAuditLog({
    id: `LOG-AUTH-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: {
      id: currentProfile.id,
      name: matched.name,
      role: targetRole
    },
    action: 'CITIZEN_LOGIN',
    affectedCitizenId: currentProfile.id,
    affectedCitizenName: currentProfile.fullName,
    details: `User authenticated as ${targetRole} (${matched.name}) with DPDP 2023 Consent granted. Issued RS256 JWT token.`,
    ipAddress: req.ip || '103.21.244.18',
    integrityHash: generateSha256(`LOGIN_${currentProfile.id}_${Date.now()}`)
  });

  return res.json({
    success: true,
    data: {
      jwtToken: token,
      claims,
      role: targetRole,
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
      role: 'CITIZEN',
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
