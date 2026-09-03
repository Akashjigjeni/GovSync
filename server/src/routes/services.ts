import { Router, Request, Response } from 'express';
import { db } from '../db.js';

export const servicesRouter = Router();

// GET /api/services
servicesRouter.get('/', (req: Request, res: Response) => {
  const { category, search } = req.query;
  let services = db.getServices();

  if (category && category !== 'ALL') {
    services = services.filter((s) => s.category.toLowerCase() === String(category).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    services = services.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.benefit.toLowerCase().includes(q)
    );
  }

  return res.json({
    success: true,
    data: services
  });
});

// GET /api/services/:id
servicesRouter.get('/:id', (req: Request, res: Response) => {
  const service = db.getServiceById(req.params.id);
  if (!service) {
    return res.status(404).json({
      success: false,
      error: 'NOT_FOUND',
      message: 'Service scheme not found'
    });
  }

  return res.json({
    success: true,
    data: service
  });
});
