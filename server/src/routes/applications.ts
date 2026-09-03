import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import {
  generateTokenId,
  generateApplicationNumber,
  generateSanctionCertificateNumber,
  generateSha256
} from '../security.js';
import {
  buildCommonJsonPayload,
  transformToTargetFormat,
  createApplicationStages
} from '../adapters.js';
import { ConsentToken, ServiceApplication } from '../types.js';

export const applicationsRouter = Router();

// GET /api/applications
applicationsRouter.get('/', (req: Request, res: Response) => {
  const { citizenId, department, status } = req.query;
  let apps = db.getApplications();

  if (citizenId) {
    apps = apps.filter((a) => a.citizenId === citizenId);
  }
  if (department && department !== 'ALL') {
    apps = apps.filter((a) => a.department === department);
  }
  if (status && status !== 'ALL') {
    apps = apps.filter((a) => a.status === status);
  }

  return res.json({
    success: true,
    data: apps
  });
});

// GET /api/applications/:id
applicationsRouter.get('/:id', (req: Request, res: Response) => {
  const app = db.getApplicationById(req.params.id);
  if (!app) {
    return res.status(404).json({
      success: false,
      error: 'NOT_FOUND',
      message: 'Application not found'
    });
  }

  return res.json({
    success: true,
    data: app
  });
});

// POST /api/applications (Intake with Consent Token & Normalization)
applicationsRouter.post('/', (req: Request, res: Response) => {
  const { serviceId, deltaData = {} } = req.body;

  const service = db.getServiceById(serviceId);
  if (!service) {
    return res.status(404).json({
      success: false,
      error: 'SERVICE_NOT_FOUND',
      message: 'Specified government service scheme does not exist.'
    });
  }

  const citizen = db.getCitizenProfile();
  const consentTokenId = generateTokenId();
  const applicationNumber = generateApplicationNumber(service.code);

  const consentToken: ConsentToken = {
    id: consentTokenId,
    citizenId: citizen.id,
    citizenName: citizen.fullName,
    serviceId: service.id,
    serviceName: service.title,
    department: service.department,
    purpose: `Scheme processing and benefit disbursement for ${service.title}`,
    sharedFields: service.requiredProfileFields,
    status: 'ACTIVE',
    grantedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    retentionDays: 365,
    jwtToken: `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.${Buffer.from(consentTokenId).toString('base64')}.sig`,
    sha256Hash: generateSha256(`CONSENT_${consentTokenId}_${citizen.id}`)
  };

  db.addConsentToken(consentToken);

  const commonJsonObj = buildCommonJsonPayload(citizen, service, deltaData, consentToken);
  const commonJson = JSON.stringify(commonJsonObj, null, 2);
  const targetPayload = transformToTargetFormat(commonJsonObj, service);

  const newApp: ServiceApplication = {
    id: `APP-ID-${Date.now()}`,
    applicationNumber,
    serviceId: service.id,
    serviceName: service.title,
    department: service.department,
    citizenId: citizen.id,
    citizenName: citizen.fullName,
    submittedAt: new Date().toISOString(),
    status: 'SUBMITTED',
    stages: createApplicationStages(service, consentToken),
    consentTokenId,
    profileDataSnapshot: citizen,
    deltaData,
    legacyPayloadPreview: targetPayload.content,
    normalizedJsonPreview: commonJson,
    updatedAt: new Date().toISOString()
  };

  const savedApp = db.addApplication(newApp);

  // Audit Log 1: Consent
  db.addAuditLog({
    id: `LOG-CST-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: { id: citizen.id, name: citizen.fullName, role: 'CITIZEN' },
    action: 'CONSENT_GRANTED',
    serviceName: service.title,
    affectedCitizenId: citizen.id,
    affectedCitizenName: citizen.fullName,
    details: `Explicit Purpose-Bounded Consent granted to ${service.department} for attributes: [${service.requiredProfileFields.join(', ')}]`,
    ipAddress: req.ip || '103.21.244.18',
    consentTokenId,
    integrityHash: generateSha256(`CONSENT_${consentTokenId}`)
  });

  // Audit Log 2: Gateway Routing & Normalization
  db.addAuditLog({
    id: `LOG-GW-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: { id: 'GOVSYNC-GATEWAY', name: 'GovSync API Gateway', role: 'ADMIN' },
    action: 'DATA_NORMALIZED',
    serviceName: service.title,
    affectedCitizenId: citizen.id,
    affectedCitizenName: citizen.fullName,
    details: `Ingress data normalized to IFEG 2.0 Common JSON model and routed to ${service.adapterName}`,
    ipAddress: '10.0.4.12',
    consentTokenId,
    integrityHash: generateSha256(`NORMALIZATION_${applicationNumber}`)
  });

  return res.status(201).json({
    success: true,
    data: savedApp
  });
});

// PUT /api/applications/:id/status (Officer Review & Sanction)
applicationsRouter.put('/:id/status', (req: Request, res: Response) => {
  const { status, remarks = '', officerName = 'Dr. Priya Verma (District Officer)' } = req.body;

  if (status !== 'APPROVED' && status !== 'REJECTED') {
    return res.status(400).json({
      success: false,
      error: 'INVALID_STATUS',
      message: 'Status must be APPROVED or REJECTED'
    });
  }

  const app = db.getApplicationById(req.params.id);
  if (!app) {
    return res.status(404).json({
      success: false,
      error: 'NOT_FOUND',
      message: 'Application not found'
    });
  }

  const certNumber = status === 'APPROVED' ? generateSanctionCertificateNumber() : undefined;

  const updatedStages = app.stages.map((stage) => {
    if (status === 'APPROVED') {
      return { ...stage, status: 'COMPLETED' as const };
    } else {
      if (stage.name.includes('Sanction') || stage.name.includes('Review')) {
        return { ...stage, status: 'REJECTED' as const };
      }
      return stage;
    }
  });

  const updatedApp = db.updateApplication(app.id, {
    status,
    stages: updatedStages,
    officerRemarks: remarks,
    approvedBy: officerName,
    approvalCertificateNumber: certNumber
  });

  db.addAuditLog({
    id: `LOG-OFFICER-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: {
      id: 'OFFICER-009',
      name: officerName,
      role: 'OFFICER',
      department: app.department
    },
    action: status === 'APPROVED' ? 'OFFICER_APPROVED' : 'OFFICER_REJECTED',
    serviceName: app.serviceName,
    affectedCitizenId: app.citizenId,
    affectedCitizenName: app.citizenName,
    details: `Officer decision [${status}] recorded for Application ${app.applicationNumber}. Remarks: "${remarks}"`,
    ipAddress: req.ip || '10.12.89.44',
    consentTokenId: app.consentTokenId,
    integrityHash: generateSha256(`OFFICER_${app.id}_${status}`)
  });

  return res.json({
    success: true,
    data: updatedApp
  });
});
