import { Router, Response } from 'express';
import { db } from '../db.js';
import { generateSha256, AuthenticatedRequest } from '../security.js';
import { CitizenProfile } from '../types.js';

export const profileRouter = Router();

// GET /api/profile
profileRouter.get('/', (_req: AuthenticatedRequest, res: Response) => {
  const profile = db.getCitizenProfile();
  return res.json({
    success: true,
    data: profile
  });
});

// PUT /api/profile
profileRouter.put('/', (req: AuthenticatedRequest, res: Response) => {
  const updates: Partial<CitizenProfile> = req.body;
  const updatedProfile = db.updateCitizenProfile(updates);

  db.addAuditLog({
    id: `LOG-PROF-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: {
      id: updatedProfile.id,
      name: updatedProfile.fullName,
      role: 'CITIZEN'
    },
    action: 'PROFILE_UPDATE',
    affectedCitizenId: updatedProfile.id,
    affectedCitizenName: updatedProfile.fullName,
    details: `Citizen updated profile attributes: ${Object.keys(updates).join(', ')}`,
    ipAddress: req.ip || '103.21.244.18',
    integrityHash: generateSha256(`PROFILE_UPDATE_${Date.now()}`)
  });

  return res.json({
    success: true,
    data: updatedProfile
  });
});
