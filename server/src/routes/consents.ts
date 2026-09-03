import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { generateSha256 } from '../security.js';

export const consentsRouter = Router();

// GET /api/consents
consentsRouter.get('/', (req: Request, res: Response) => {
  const { citizenId, status } = req.query;
  let tokens = db.getConsentTokens();

  if (citizenId) {
    tokens = tokens.filter((c) => c.citizenId === citizenId);
  }
  if (status && status !== 'ALL') {
    tokens = tokens.filter((c) => c.status === status);
  }

  return res.json({
    success: true,
    data: tokens
  });
});

// POST /api/consents/:id/revoke
consentsRouter.post('/:id/revoke', (req: Request, res: Response) => {
  const { id } = req.params;
  const citizen = db.getCitizenProfile();

  const success = db.revokeConsentToken(id);
  if (!success) {
    return res.status(404).json({
      success: false,
      error: 'NOT_FOUND',
      message: 'Consent token not found'
    });
  }

  db.addAuditLog({
    id: `LOG-REVOKE-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: {
      id: citizen.id,
      name: citizen.fullName,
      role: 'CITIZEN'
    },
    action: 'CONSENT_REVOKED',
    affectedCitizenId: citizen.id,
    affectedCitizenName: citizen.fullName,
    details: `Citizen revoked Purpose-Bounded Consent Token: ${id}. Target department access blocked immediately.`,
    ipAddress: req.ip || '103.21.244.18',
    consentTokenId: id,
    integrityHash: generateSha256(`REVOKE_${id}_${Date.now()}`)
  });

  return res.json({
    success: true,
    message: `Consent Token ${id} successfully revoked.`
  });
});
