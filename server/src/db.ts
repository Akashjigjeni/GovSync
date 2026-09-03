import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  CitizenProfile,
  GovernmentService,
  ServiceApplication,
  ConsentToken,
  AuditLogEntry,
  GatewayMetrics
} from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'govsync_db.json');

export interface DatabaseSchema {
  citizenProfile: CitizenProfile;
  services: GovernmentService[];
  applications: ServiceApplication[];
  consentTokens: ConsentToken[];
  auditLogs: AuditLogEntry[];
  metrics: GatewayMetrics;
}

const INITIAL_CITIZEN_PROFILE: CitizenProfile = {
  id: 'CIT-IN-2026-98124',
  aadhaarNumber: 'XXXX-XXXX-4819',
  fullName: 'Aarav Sharma',
  fatherName: 'Ramesh Sharma',
  dob: '1992-08-15',
  gender: 'Male',
  phone: '+91 98765 43210',
  email: 'aarav.sharma@govsync.demo',
  photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  address: {
    street: '14/B, Krishi Nagar, Near Zilla Parishad',
    villageTown: 'Baramati',
    district: 'Pune',
    state: 'Maharashtra',
    pincode: '413102'
  },
  demographics: {
    category: 'OBC',
    annualIncome: 240000,
    occupation: 'Farmer & Small Agri-Enterprise Owner',
    bplCardNumber: 'MH-BPL-2021-99412'
  },
  verifiedCredentials: {
    digiLockerId: 'DL-AARAV-98124',
    panNumber: 'ABCPS1234F',
    bankAccount: {
      accountNumber: '50100489218492',
      ifsc: 'SBIN0001234',
      bankName: 'State Bank of India',
      branch: 'Baramati Main Branch'
    },
    landRecordId: 'MH-ROR-7/12-PUN-98214',
    landAreaAcres: 3.5,
    rationCardNumber: 'RC-MAH-2022-77192',
    drivingLicenseNumber: 'MH-12-2015009124',
    highestEducation: 'B.Sc. Agriculture',
    passingYear: '2014',
    collegeName: 'College of Agriculture Pune (MPKV)',
    disabilityStatus: false
  },
  updatedAt: new Date().toISOString()
};

const GOVERNMENT_SERVICES: GovernmentService[] = [
  {
    id: 'SRV-001',
    code: 'PM-KISAN',
    title: 'PM Kisan Samman Nidhi (Income Support)',
    department: 'Department of Agriculture & Farmers Welfare',
    ministry: 'Ministry of Agriculture',
    category: 'Agriculture',
    description: 'Financial benefit of Rs 6,000 per year in 3 equal installments to all landholding farmer families.',
    benefit: '₹6,000 / year Direct Benefit Transfer (DBT)',
    requiredProfileFields: ['fullName', 'aadhaarNumber', 'bankAccount', 'landRecordId', 'address'],
    deltaFields: [
      {
        id: 'cropSeason',
        label: 'Current Crop Season',
        type: 'select',
        options: ['Kharif 2026', 'Rabi 2026-27', 'Zaid 2026'],
        required: true,
        defaultValue: 'Kharif 2026',
        description: 'Select current active cropping cycle.'
      },
      {
        id: 'primaryCrop',
        label: 'Primary Sown Crop',
        type: 'text',
        placeholder: 'e.g., Soybean, Cotton, Wheat',
        required: true,
        defaultValue: 'Soybean & Sugarcane',
        description: 'Major agricultural produce for insurance correlation.'
      }
    ],
    processingType: 'LEGACY_SOAP_XML',
    adapterName: 'AgriStack SOAP/XML Adapter',
    slaDays: 7,
    iconName: 'Sprout',
    popularityRank: 1
  },
  {
    id: 'SRV-002',
    code: 'NSP-MERIT',
    title: 'National Scholarship Portal (Merit-cum-Means)',
    department: 'Department of Higher Education',
    ministry: 'Ministry of Education',
    category: 'Education',
    description: 'Financial assistance to meritorious students from economically weaker sections.',
    benefit: 'Up to ₹20,000 / year Tuition Allowance',
    requiredProfileFields: ['fullName', 'aadhaarNumber', 'demographics', 'bankAccount', 'highestEducation'],
    deltaFields: [
      {
        id: 'currentCourse',
        label: 'Current Academic Degree & Year',
        type: 'text',
        placeholder: 'e.g., M.Sc. Sustainable Agri (Year 2)',
        required: true,
        defaultValue: 'M.Sc. Sustainable Agriculture Tech',
        description: 'Degree program currently pursued.'
      },
      {
        id: 'lastSemesterCgpa',
        label: 'Previous Semester GPA / Percentage',
        type: 'number',
        placeholder: 'e.g. 8.85',
        required: true,
        defaultValue: 8.9,
        description: 'Cumulative Grade Point Average.'
      }
    ],
    processingType: 'MODERN_REST',
    adapterName: 'NSP OpenAPI 3.1 Connector',
    slaDays: 14,
    iconName: 'GraduationCap',
    popularityRank: 2
  },
  {
    id: 'SRV-003',
    code: 'ONORC-PDS',
    title: 'One Nation One Ration Card (Portability)',
    department: 'Department of Food & Public Distribution',
    ministry: 'Ministry of Consumer Affairs, Food & Public Distribution',
    category: 'Social Welfare',
    description: 'Interstate and inter-district subsidized foodgrains portability under NFSA across Fair Price Shops.',
    benefit: 'Monthly Subsidized Grains (Rice/Wheat)',
    requiredProfileFields: ['fullName', 'aadhaarNumber', 'rationCardNumber', 'address'],
    deltaFields: [
      {
        id: 'targetFpsPincode',
        label: 'Target Fair Price Shop (FPS) Pincode',
        type: 'text',
        placeholder: 'e.g. 411038',
        required: true,
        defaultValue: '411038',
        description: 'Location where you wish to draw monthly quota.'
      },
      {
        id: 'migrationDurationMonths',
        label: 'Expected Portability Duration (Months)',
        type: 'number',
        required: true,
        defaultValue: 12,
        description: 'Duration of temporary stay in target district.'
      }
    ],
    processingType: 'LEGACY_FLAT_FILE',
    adapterName: 'NIC PDS ASCII Batch Pipe Adapter',
    slaDays: 3,
    iconName: 'ShoppingBag',
    popularityRank: 3
  },
  {
    id: 'SRV-004',
    code: 'SARATHI-DL',
    title: 'Driving License Address Endorsement (Sarathi)',
    department: 'Transport Department (Sarathi)',
    ministry: 'Ministry of Road Transport and Highways (MoRTH)',
    category: 'Transport',
    description: 'Instant contactless synchronization of residential address to state motor vehicle driving license.',
    benefit: 'Immediate Digital DL Endorsement',
    requiredProfileFields: ['fullName', 'aadhaarNumber', 'drivingLicenseNumber', 'address'],
    deltaFields: [
      {
        id: 'dlCategory',
        label: 'License Vehicle Class',
        type: 'select',
        options: ['LMV (Light Motor Vehicle)', 'MCWG (Motorcycle with Gear)', 'TRANS (Transport)'],
        required: true,
        defaultValue: 'LMV (Light Motor Vehicle)',
        description: 'Endorsed vehicle class.'
      }
    ],
    processingType: 'MODERN_REST',
    adapterName: 'MoRTH Sarathi Gateway REST Connector',
    slaDays: 2,
    iconName: 'Car',
    popularityRank: 4
  },
  {
    id: 'SRV-005',
    code: 'PMJAY-AYUSH',
    title: 'Ayushman Bharat PM-JAY (Golden Card Issuance)',
    department: 'National Health Authority',
    ministry: 'Ministry of Health and Family Welfare',
    category: 'Healthcare',
    description: 'Health cover of Rs 5 Lakhs per family per year for secondary and tertiary care hospitalization.',
    benefit: '₹5,00,000 / year Cashless Health Coverage',
    requiredProfileFields: ['fullName', 'aadhaarNumber', 'demographics', 'address', 'bplCardNumber'],
    deltaFields: [
      {
        id: 'familyMemberCount',
        label: 'Total Family Members to Include',
        type: 'number',
        required: true,
        defaultValue: 4,
        description: 'Dependent family members covered under SECC.'
      }
    ],
    processingType: 'MODERN_REST',
    adapterName: 'NHA Health Stack REST Connector',
    slaDays: 5,
    iconName: 'HeartPulse',
    popularityRank: 5
  },
  {
    id: 'SRV-006',
    code: 'UDYAM-MSME',
    title: 'Udyam MSME Enterprise Registration',
    department: 'Ministry of Micro, Small and Medium Enterprises',
    ministry: 'Ministry of MSME',
    category: 'Revenue',
    description: 'Zero-cost paperless certificate for micro and small enterprise credit access and priority subsidies.',
    benefit: 'Official MSME Recognition & Priority Credit',
    requiredProfileFields: ['fullName', 'aadhaarNumber', 'panNumber', 'bankAccount', 'address'],
    deltaFields: [
      {
        id: 'enterpriseName',
        label: 'Proposed Enterprise Name',
        type: 'text',
        placeholder: 'e.g. Sahyadri Agro Processing Tech',
        required: true,
        defaultValue: 'Sahyadri Agro Solutions & Logistics',
        description: 'Business unit brand identity.'
      },
      {
        id: 'majorActivity',
        label: 'Major Activity Type',
        type: 'select',
        options: ['Manufacturing', 'Services / Agro-Tech', 'Trading'],
        required: true,
        defaultValue: 'Services / Agro-Tech',
        description: 'Classification of commercial activity.'
      }
    ],
    processingType: 'LEGACY_SOAP_XML',
    adapterName: 'MSME Centralized XML Gateway Adapter',
    slaDays: 1,
    iconName: 'Building2',
    popularityRank: 6
  }
];

const INITIAL_CONSENT_TOKENS: ConsentToken[] = [
  {
    id: 'CST-2026-88192A',
    citizenId: 'CIT-IN-2026-98124',
    citizenName: 'Aarav Sharma',
    serviceId: 'SRV-001',
    serviceName: 'PM Kisan Samman Nidhi (Income Support)',
    department: 'Department of Agriculture & Farmers Welfare',
    purpose: 'Scheme processing and benefit disbursement for PM Kisan Samman Nidhi',
    sharedFields: ['fullName', 'aadhaarNumber', 'bankAccount', 'landRecordId', 'address'],
    status: 'ACTIVE',
    grantedAt: '2026-08-28T09:30:00.000Z',
    expiresAt: '2027-08-28T09:30:00.000Z',
    retentionDays: 365,
    jwtToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnb3ZzeW5jIiwiY29uc2VudElkIjoiQ1NULTIwMjYtODgxOTJBIn0.sig',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    id: 'CST-2026-44019B',
    citizenId: 'CIT-IN-2026-98124',
    citizenName: 'Aarav Sharma',
    serviceId: 'SRV-004',
    serviceName: 'Driving License Address Endorsement (Sarathi)',
    department: 'Transport Department (Sarathi)',
    purpose: 'Address sync and digital driving license endorsement',
    sharedFields: ['fullName', 'aadhaarNumber', 'drivingLicenseNumber', 'address'],
    status: 'ACTIVE',
    grantedAt: '2026-08-29T11:15:00.000Z',
    expiresAt: '2027-08-29T11:15:00.000Z',
    retentionDays: 365,
    jwtToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnb3ZzeW5jIiwiY29uc2VudElkIjoiQ1NULTIwMjYtNDQwMTlCIn0.sig',
    sha256Hash: '9f83c605e4f208b9b41a3848b61073b64abef42e3160b45d045d65bb4ef0c487'
  }
];

const INITIAL_APPLICATIONS: ServiceApplication[] = [
  {
    id: 'APP-ID-1001',
    applicationNumber: 'MH-PMKISAN-2026-881920',
    serviceId: 'SRV-001',
    serviceName: 'PM Kisan Samman Nidhi (Income Support)',
    department: 'Department of Agriculture & Farmers Welfare',
    citizenId: 'CIT-IN-2026-98124',
    citizenName: 'Aarav Sharma',
    submittedAt: '2026-08-28T09:30:00.000Z',
    status: 'APPROVED',
    stages: [
      {
        name: 'Consent & Profile Tokenization',
        timestamp: '2026-08-28T09:30:00.000Z',
        status: 'COMPLETED',
        description: 'Citizen granted explicit purpose-bounded consent CST-2026-88192A.',
        techDetails: 'Scope: 5 profile attributes. Cryptographic JWT generated.'
      },
      {
        name: 'GovSync API Gateway Ingress',
        timestamp: '2026-08-28T09:30:01.000Z',
        status: 'COMPLETED',
        description: 'Request authenticated, validated against national schema registry.',
        techDetails: 'API Gateway: /v2/gateway/route/agriculture [Latency: 24ms]'
      },
      {
        name: 'Adapter Normalization (AgriStack SOAP/XML)',
        timestamp: '2026-08-28T09:30:02.000Z',
        status: 'COMPLETED',
        description: 'Payload translated into legacy SOAP/XML schema for state AgriStack database.',
        techDetails: 'Engine: GovSync-Legacy-XML-Adapter-v2.4'
      },
      {
        name: 'Department Officer Review & Sanction',
        timestamp: '2026-08-30T14:20:00.000Z',
        status: 'COMPLETED',
        description: 'Sanction order approved by District Agriculture Officer.',
        techDetails: 'Digital Signature: SHA-256 (PFMS DBT Linked)'
      }
    ],
    consentTokenId: 'CST-2026-88192A',
    profileDataSnapshot: INITIAL_CITIZEN_PROFILE,
    deltaData: { cropSeason: 'Kharif 2026', primaryCrop: 'Soybean & Sugarcane' },
    officerRemarks: 'Landholding 7/12 verified against Pune district revenue records. DBT enabled.',
    approvedBy: 'Dr. Priya Verma (District Officer)',
    approvalCertificateNumber: 'SANCTION-MH-2026-991244',
    updatedAt: '2026-08-30T14:20:00.000Z'
  },
  {
    id: 'APP-ID-1002',
    applicationNumber: 'MH-SARATHIDL-2026-440192',
    serviceId: 'SRV-004',
    serviceName: 'Driving License Address Endorsement (Sarathi)',
    department: 'Transport Department (Sarathi)',
    citizenId: 'CIT-IN-2026-98124',
    citizenName: 'Aarav Sharma',
    submittedAt: '2026-08-29T11:15:00.000Z',
    status: 'DEPARTMENT_PROCESSING',
    stages: [
      {
        name: 'Consent & Profile Tokenization',
        timestamp: '2026-08-29T11:15:00.000Z',
        status: 'COMPLETED',
        description: 'Citizen granted explicit consent CST-2026-44019B.',
        techDetails: 'Scope: 4 profile attributes. Cryptographic JWT generated.'
      },
      {
        name: 'GovSync API Gateway Ingress',
        timestamp: '2026-08-29T11:15:01.000Z',
        status: 'COMPLETED',
        description: 'Request authenticated, validated against national schema registry.',
        techDetails: 'API Gateway: /v2/gateway/route/transport [Latency: 18ms]'
      },
      {
        name: 'Adapter Normalization (Sarathi REST Connector)',
        timestamp: '2026-08-29T11:15:02.000Z',
        status: 'COMPLETED',
        description: 'Payload routed to MoRTH Sarathi OpenAPI endpoint.',
        techDetails: 'Engine: GovSync-OpenAPI-Connector-v4.1'
      },
      {
        name: 'Department Officer Review & Sanction',
        timestamp: '2026-08-29T11:15:03.000Z',
        status: 'IN_PROGRESS',
        description: 'Automated validation passed. Awaiting final state RTO endorsement.',
        techDetails: 'Queue: Pune RTO Regional Desk'
      }
    ],
    consentTokenId: 'CST-2026-44019B',
    profileDataSnapshot: INITIAL_CITIZEN_PROFILE,
    deltaData: { dlCategory: 'LMV (Light Motor Vehicle)' },
    updatedAt: '2026-08-29T11:15:03.000Z'
  }
];

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'LOG-88192-01',
    timestamp: '2026-08-28T09:30:00.000Z',
    actor: { id: 'CIT-IN-2026-98124', name: 'Aarav Sharma', role: 'CITIZEN' },
    action: 'CONSENT_GRANTED',
    serviceName: 'PM Kisan Samman Nidhi',
    affectedCitizenId: 'CIT-IN-2026-98124',
    affectedCitizenName: 'Aarav Sharma',
    details: 'Explicit Purpose-Bounded Consent granted to Dept of Agriculture for 5 attributes.',
    ipAddress: '103.21.244.18 (Pune, India)',
    consentTokenId: 'CST-2026-88192A',
    integrityHash: '8f7a9c2b4d6e8a0f1c3e5b7d9f2a4c6e8b0d2f4a6c8e0b2d4f6a8c0e2b4d6f8'
  },
  {
    id: 'LOG-88192-02',
    timestamp: '2026-08-28T09:30:01.000Z',
    actor: { id: 'GOVSYNC-GW', name: 'GovSync API Gateway', role: 'ADMIN' },
    action: 'DATA_NORMALIZED',
    serviceName: 'PM Kisan Samman Nidhi',
    affectedCitizenId: 'CIT-IN-2026-98124',
    affectedCitizenName: 'Aarav Sharma',
    details: 'Ingress data normalized to IFEG 2.0 Common JSON model and routed to AgriStack SOAP Adapter.',
    ipAddress: '10.0.4.12 (GovSync Core)',
    consentTokenId: 'CST-2026-88192A',
    integrityHash: '2c4e6a8b0d2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6a8b0d2f4'
  },
  {
    id: 'LOG-88192-03',
    timestamp: '2026-08-30T14:20:00.000Z',
    actor: { id: 'OFFICER-009', name: 'Dr. Priya Verma', role: 'OFFICER', department: 'Dept of Agriculture' },
    action: 'OFFICER_APPROVED',
    serviceName: 'PM Kisan Samman Nidhi',
    affectedCitizenId: 'CIT-IN-2026-98124',
    affectedCitizenName: 'Aarav Sharma',
    details: 'Officer approved application MH-PMKISAN-2026-881920. Issued Sanction Certificate #SANCTION-MH-2026-991244.',
    ipAddress: '10.12.89.44 (NIC District Node)',
    consentTokenId: 'CST-2026-88192A',
    integrityHash: 'a1b2c3d4e5f60718293a4b5c6d7e8f901a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6'
  }
];

const INITIAL_METRICS: GatewayMetrics = {
  totalRequests: 284192,
  successfulInteractions: 283990,
  avgLatencyMs: 24,
  activeConsentTokens: 14208,
  legacyTransformations: 198421,
  citizenEffortSavedPercent: 60,
  repeatedDataEntryReductionPercent: 80,
  processEfficiencyPercent: 90
};

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.data = this.loadData();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      } catch (err) {
        console.error('Failed to parse database file, initializing baseline seed:', err);
      }
    }

    const baseline: DatabaseSchema = {
      citizenProfile: INITIAL_CITIZEN_PROFILE,
      services: GOVERNMENT_SERVICES,
      applications: INITIAL_APPLICATIONS,
      consentTokens: INITIAL_CONSENT_TOKENS,
      auditLogs: INITIAL_AUDIT_LOGS,
      metrics: INITIAL_METRICS
    };

    this.saveData(baseline);
    return baseline;
  }

  public saveData(updatedData?: DatabaseSchema) {
    if (updatedData) {
      this.data = updatedData;
    }
    this.ensureDataDir();
    fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  public getCitizenProfile(): CitizenProfile {
    return this.data.citizenProfile;
  }

  public updateCitizenProfile(profile: Partial<CitizenProfile>): CitizenProfile {
    this.data.citizenProfile = {
      ...this.data.citizenProfile,
      ...profile,
      updatedAt: new Date().toISOString()
    };
    this.saveData();
    return this.data.citizenProfile;
  }

  public getServices(): GovernmentService[] {
    return this.data.services;
  }

  public getServiceById(id: string): GovernmentService | undefined {
    return this.data.services.find((s) => s.id === id || s.code === id);
  }

  public getApplications(): ServiceApplication[] {
    return this.data.applications;
  }

  public getApplicationById(id: string): ServiceApplication | undefined {
    return this.data.applications.find((a) => a.id === id || a.applicationNumber === id);
  }

  public addApplication(app: ServiceApplication): ServiceApplication {
    this.data.applications.unshift(app);
    this.data.metrics.totalRequests += 1;
    this.data.metrics.successfulInteractions += 1;
    this.saveData();
    return app;
  }

  public updateApplication(id: string, updates: Partial<ServiceApplication>): ServiceApplication | null {
    const idx = this.data.applications.findIndex((a) => a.id === id || a.applicationNumber === id);
    if (idx === -1) return null;
    this.data.applications[idx] = {
      ...this.data.applications[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveData();
    return this.data.applications[idx];
  }

  public getConsentTokens(): ConsentToken[] {
    return this.data.consentTokens;
  }

  public addConsentToken(token: ConsentToken): ConsentToken {
    this.data.consentTokens.unshift(token);
    this.data.metrics.activeConsentTokens += 1;
    this.saveData();
    return token;
  }

  public revokeConsentToken(tokenId: string): boolean {
    const token = this.data.consentTokens.find((c) => c.id === tokenId);
    if (token) {
      token.status = 'REVOKED';
      this.data.metrics.activeConsentTokens = Math.max(0, this.data.metrics.activeConsentTokens - 1);
      this.saveData();
      return true;
    }
    return false;
  }

  public getAuditLogs(): AuditLogEntry[] {
    return this.data.auditLogs;
  }

  public addAuditLog(entry: AuditLogEntry): AuditLogEntry {
    this.data.auditLogs.unshift(entry);
    this.saveData();
    return entry;
  }

  public getMetrics(): GatewayMetrics {
    return this.data.metrics;
  }

  public resetToBaseline(): DatabaseSchema {
    this.data = {
      citizenProfile: INITIAL_CITIZEN_PROFILE,
      services: GOVERNMENT_SERVICES,
      applications: INITIAL_APPLICATIONS,
      consentTokens: INITIAL_CONSENT_TOKENS,
      auditLogs: INITIAL_AUDIT_LOGS,
      metrics: INITIAL_METRICS
    };
    this.saveData();
    return this.data;
  }
}

export const db = new DatabaseManager();
