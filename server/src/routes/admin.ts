import { Router, Request, Response } from 'express';
import { db } from '../db.js';

export const adminRouter = Router();

// GET /api/admin/audit-ledger
adminRouter.get('/audit-ledger', (req: Request, res: Response) => {
  const { action, search } = req.query;
  let logs = db.getAuditLogs();

  if (action && action !== 'ALL') {
    logs = logs.filter((l) => l.action === action);
  }

  if (search) {
    const q = String(search).toLowerCase();
    logs = logs.filter(
      (l) =>
        l.actor.name.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q) ||
        l.affectedCitizenName.toLowerCase().includes(q) ||
        l.integrityHash.toLowerCase().includes(q)
    );
  }

  return res.json({
    success: true,
    data: logs
  });
});

// GET /api/admin/metrics
adminRouter.get('/metrics', (_req: Request, res: Response) => {
  const metrics = db.getMetrics();
  return res.json({
    success: true,
    data: metrics
  });
});

// POST /api/admin/reset
adminRouter.post('/reset', (_req: Request, res: Response) => {
  const baseline = db.resetToBaseline();
  return res.json({
    success: true,
    message: 'All mock database tables restored to baseline seed state.',
    data: baseline
  });
});
