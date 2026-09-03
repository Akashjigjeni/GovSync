import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.js';
import { profileRouter } from './routes/profile.js';
import { servicesRouter } from './routes/services.js';
import { applicationsRouter } from './routes/applications.js';
import { consentsRouter } from './routes/consents.js';
import { adminRouter } from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-GovSync-Consent-ID']
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Health check endpoint for Docker & Container Probes
app.get('/api/health', (_req: Request, res: Response) => {
  return res.json({
    status: 'HEALTHY',
    service: 'GovSync National Interoperability Engine',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    standards: ['IFEG 2.0', 'API Setu', 'DPDP 2023', 'OAuth 2.0', 'RFC-7519 JWT']
  });
});

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/services', servicesRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/consents', consentsRouter);
app.use('/api/admin', adminRouter);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: any) => {
  console.error('Unhandled Server Error:', err);
  return res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected error occurred in GovSync Gateway'
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🇮🇳 GovSync National Interoperability Engine v2.0`);
  console.log(`🚀 Gateway Server running on http://localhost:${PORT}`);
  console.log(`🛡️ Standards: IFEG 2.0 | API Setu | OAuth 2.0 | JWT`);
  console.log(`=======================================================`);
});
