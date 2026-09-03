export type UserRole = 'CITIZEN' | 'OFFICER' | 'ADMIN';

export type LanguageCode = 'en' | 'hi' | 'mr';

export type AuthMethod = 'AADHAAR_OTP' | 'DIGILOCKER_OAUTH' | 'PASSWORD_OTP' | 'PASSWORD' | 'CREDENTIALS';

export interface JwtClaims {
  sub: string;
  name: string;
  role: UserRole;
  aadhaarMasked: string;
  email: string;
  phone: string;
  scopes: string[];
  iss: string;
  iat: number;
  exp: number;
  jti: string;
}

export interface AuthSession {
  jwtToken: string;
  claims: JwtClaims;
  authMethod: AuthMethod;
  authenticatedAt: string;
}

export interface CitizenProfile {
  id: string;
  aadhaarNumber: string;
  fullName: string;
  fatherName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  photoUrl: string;
  address: {
    street: string;
    villageTown: string;
    district: string;
    state: string;
    pincode: string;
  };
  demographics: {
    category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
    annualIncome: number;
    occupation: string;
    bplCardNumber?: string;
  };
  verifiedCredentials: {
    digiLockerId: string;
    panNumber: string;
    bankAccount: {
      accountNumber: string;
      ifsc: string;
      bankName: string;
      branch: string;
    };
    landRecordId?: string;
    landAreaAcres?: number;
    rationCardNumber?: string;
    drivingLicenseNumber?: string;
    highestEducation?: string;
    passingYear?: string;
    collegeName?: string;
    disabilityStatus: boolean;
  };
  updatedAt: string;
}

export interface ServiceDeltaField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date';
  options?: string[];
  placeholder?: string;
  required: boolean;
  defaultValue?: string | number;
  description: string;
}

export interface GovernmentService {
  id: string;
  code: string;
  title: string;
  department: string;
  ministry: string;
  category: 'Agriculture' | 'Education' | 'Social Welfare' | 'Transport' | 'Healthcare' | 'Revenue';
  description: string;
  benefit: string;
  requiredProfileFields: string[];
  deltaFields: ServiceDeltaField[];
  processingType: 'MODERN_REST' | 'LEGACY_SOAP_XML' | 'LEGACY_FLAT_FILE';
  adapterName: string;
  slaDays: number;
  iconName: string;
  popularityRank: number;
}

export interface ConsentToken {
  id: string;
  citizenId: string;
  citizenName: string;
  serviceId: string;
  serviceName: string;
  department: string;
  purpose: string;
  sharedFields: string[];
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  grantedAt: string;
  expiresAt: string;
  retentionDays: number;
  jwtToken: string;
  sha256Hash: string;
}

export type ApplicationStatus =
  | 'SUBMITTED'
  | 'GATEWAY_ROUTED'
  | 'ADAPTER_TRANSFORMED'
  | 'DEPARTMENT_PROCESSING'
  | 'APPROVED'
  | 'REJECTED';

export interface ApplicationStage {
  name: string;
  timestamp: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'REJECTED';
  description: string;
  techDetails?: string;
}

export interface ServiceApplication {
  id: string;
  applicationNumber: string;
  serviceId: string;
  serviceName: string;
  department: string;
  citizenId: string;
  citizenName: string;
  submittedAt: string;
  status: ApplicationStatus;
  stages: ApplicationStage[];
  consentTokenId: string;
  profileDataSnapshot: Partial<CitizenProfile>;
  deltaData: Record<string, any>;
  legacyPayloadPreview?: string;
  normalizedJsonPreview?: string;
  officerRemarks?: string;
  approvedBy?: string;
  approvalCertificateNumber?: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: {
    id: string;
    name: string;
    role: UserRole;
    department?: string;
  };
  action:
    | 'CONSENT_GRANTED'
    | 'CONSENT_REVOKED'
    | 'GATEWAY_ROUTE'
    | 'DATA_NORMALIZED'
    | 'SERVICE_SUBMIT'
    | 'OFFICER_APPROVED'
    | 'OFFICER_REJECTED'
    | 'PROFILE_UPDATE'
    | 'CITIZEN_LOGIN'
    | 'CITIZEN_REGISTER';
  serviceName?: string;
  affectedCitizenId: string;
  affectedCitizenName: string;
  details: string;
  ipAddress: string;
  consentTokenId?: string;
  integrityHash: string;
}

export interface GatewayMetrics {
  totalRequests: number;
  successfulInteractions: number;
  avgLatencyMs: number;
  activeConsentTokens: number;
  legacyTransformations: number;
  citizenEffortSavedPercent: number;
  repeatedDataEntryReductionPercent: number;
  processEfficiencyPercent: number;
}
