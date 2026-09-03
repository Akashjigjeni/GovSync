import { CitizenProfile, GovernmentService, ServiceApplication, ConsentToken, AuditLogEntry, GatewayMetrics } from '../types';

export const INITIAL_CITIZEN_PROFILE: CitizenProfile = {
  id: 'CIT-IN-2026-98124',
  aadhaarNumber: 'XXXX-XXXX-4819',
  fullName: 'Aarav Sharma',
  fatherName: 'Rajendra Sharma',
  dob: '1996-08-15',
  gender: 'Male',
  phone: '+91 98765 43210',
  email: 'aarav.sharma@example.gov.in',
  photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  address: {
    street: 'Plot 42, Kisan Nagar, Sector 4',
    villageTown: 'Pune Rural',
    district: 'Pune',
    state: 'Maharashtra',
    pincode: '411038'
  },
  demographics: {
    category: 'OBC',
    annualIncome: 240000,
    occupation: 'Small Farmer & Agri-entrepreneur',
    bplCardNumber: 'MH-BPL-2024-88412'
  },
  verifiedCredentials: {
    digiLockerId: 'DL-AARAV-98124',
    panNumber: 'ABCPS1234K',
    bankAccount: {
      accountNumber: '50100489218492',
      ifsc: 'SBIN0001234',
      bankName: 'State Bank of India',
      branch: 'Shivaji Nagar, Pune'
    },
    landRecordId: 'MH-ROR-7/12-PUN-98214',
    landAreaAcres: 3.5,
    rationCardNumber: 'RC-MAH-2022-77192',
    drivingLicenseNumber: 'MH-12-2018-0091823',
    highestEducation: 'Bachelor of Science (Agriculture)',
    passingYear: '2019',
    collegeName: 'College of Agriculture, Pune',
    disabilityStatus: false
  },
  updatedAt: '2026-09-02T10:30:00Z'
};

export const GOVERNMENT_SERVICES: GovernmentService[] = [
  {
    id: 'SRV-AGRI-001',
    code: 'PM-KISAN',
    title: 'PM-Kisan Samman Nidhi Scheme',
    department: 'Department of Agriculture & Farmers Welfare',
    ministry: 'Ministry of Agriculture',
    category: 'Agriculture',
    description: 'Financial benefit of ₹6,000/- per year in three equal installments to all landholding farmer families across India.',
    benefit: '₹6,000 / year direct DBT credit',
    requiredProfileFields: [
      'fullName',
      'aadhaarNumber',
      'bankAccount',
      'landRecordId',
      'landAreaAcres',
      'address'
    ],
    deltaFields: [
      {
        id: 'cropCategory',
        label: 'Primary Sown Crop (Current Kharif/Rabi)',
        type: 'select',
        options: ['Wheat / Rice', 'Soybean / Pulses', 'Cotton / Sugarcane', 'Vegetables / Horticulture'],
        required: true,
        defaultValue: 'Soybean / Pulses',
        description: 'Selected for seasonal subsidy alignment'
      },
      {
        id: 'irrigationSource',
        label: 'Primary Irrigation Infrastructure',
        type: 'select',
        options: ['Canal Water', 'Borewell / Tube Well', 'Drip / Sprinkler Irrigation', 'Rainfed Only'],
        required: true,
        defaultValue: 'Drip / Sprinkler Irrigation',
        description: 'For energy subsidy coordination'
      }
    ],
    processingType: 'LEGACY_SOAP_XML',
    adapterName: 'AgriStack-Legacy-SOAP-Adapter v2.4',
    slaDays: 3,
    iconName: 'Sprout',
    popularityRank: 1
  },
  {
    id: 'SRV-EDU-002',
    code: 'NSP-MERIT-2026',
    title: 'National Higher Education Merit Scholarship',
    department: 'Department of Higher Education',
    ministry: 'Ministry of Education',
    category: 'Education',
    description: 'Direct scholarship grant for students and young researchers pursuing professional and postgraduate education.',
    benefit: '₹50,000 / year fee waiver + stipend',
    requiredProfileFields: [
      'fullName',
      'dob',
      'annualIncome',
      'category',
      'bankAccount',
      'highestEducation',
      'passingYear',
      'collegeName'
    ],
    deltaFields: [
      {
        id: 'currentCourse',
        label: 'Enrolled Degree Program',
        type: 'text',
        placeholder: 'e.g. M.Sc. Agronomy / MBA Agri-Business',
        required: true,
        defaultValue: 'M.Sc. Sustainable Agriculture Tech',
        description: 'Academic program for scholarship credit'
      },
      {
        id: 'lastSemesterCgpa',
        label: 'Previous Semester CGPA / Percentage',
        type: 'number',
        placeholder: 'e.g. 8.75 or 85',
        required: true,
        defaultValue: 8.9,
        description: 'Merit score criterion'
      }
    ],
    processingType: 'MODERN_REST',
    adapterName: 'NSP-OpenAPI-Gateway-Connector v4.1',
    slaDays: 5,
    iconName: 'GraduationCap',
    popularityRank: 2
  },
  {
    id: 'SRV-PDS-003',
    code: 'ONORC-PORTABILITY',
    title: 'One Nation One Ration Card (ONORC) Portability',
    department: 'Department of Food & Public Distribution',
    ministry: 'Ministry of Consumer Affairs',
    category: 'Social Welfare',
    description: 'Enables migrant beneficiaries to access subsidized food grains from any Fair Price Shop (FPS) across the country.',
    benefit: 'Seamless nationwide monthly ration quota',
    requiredProfileFields: [
      'fullName',
      'aadhaarNumber',
      'rationCardNumber',
      'address',
      'demographics'
    ],
    deltaFields: [
      {
        id: 'targetFpsPincode',
        label: 'Destination FPS Delivery Pincode',
        type: 'text',
        placeholder: '6-digit destination pincode',
        required: true,
        defaultValue: '411014',
        description: 'Desired Fair Price Shop location for ration lift'
      },
      {
        id: 'migrationDurationMonths',
        label: 'Anticipated Stay Duration (Months)',
        type: 'number',
        required: true,
        defaultValue: 12,
        description: 'Temporary transfer window'
      }
    ],
    processingType: 'LEGACY_FLAT_FILE',
    adapterName: 'NIC-PDS-FlatFile-Batch-Adapter v1.9',
    slaDays: 2,
    iconName: 'ShoppingBag',
    popularityRank: 3
  },
  {
    id: 'SRV-TRN-004',
    code: 'SARATHI-DL-RENEW',
    title: 'Driving License Online Endorsement & Renewal',
    department: 'Transport Department (Sarathi)',
    ministry: 'Ministry of Road Transport and Highways',
    category: 'Transport',
    description: 'Faceless renewal of Light Motor Vehicle (LMV) driving license and digital e-DL generation with biometric sync.',
    benefit: 'Instant Digital Smart License on DigiLocker',
    requiredProfileFields: [
      'fullName',
      'dob',
      'drivingLicenseNumber',
      'address',
      'phone'
    ],
    deltaFields: [
      {
        id: 'vehicleClass',
        label: 'Vehicle Class Category',
        type: 'select',
        options: ['LMV (Car/Jeep)', 'MCWG (Motorcycle with Gear)', 'LMV + MCWG (Combined)', 'Transport / Commercial'],
        required: true,
        defaultValue: 'LMV + MCWG (Combined)',
        description: 'Endorsed driving license classes'
      },
      {
        id: 'organDonorConsent',
        label: 'Opt-in for National Organ Donor Registry',
        type: 'select',
        options: ['Yes, I pledge to donate', 'No, not at this time'],
        required: true,
        defaultValue: 'Yes, I pledge to donate',
        description: 'Printed onto the digital driving license'
      }
    ],
    processingType: 'MODERN_REST',
    adapterName: 'Parivahan-Sarathi-REST-Connector v3.2',
    slaDays: 1,
    iconName: 'Car',
    popularityRank: 4
  },
  {
    id: 'SRV-HLT-005',
    code: 'ABHA-PMJAY',
    title: 'Ayushman Bharat PM-JAY Golden Health Cover',
    department: 'National Health Authority (NHA)',
    ministry: 'Ministry of Health & Family Welfare',
    category: 'Healthcare',
    description: 'Free healthcare insurance coverage of up to ₹5,00,000 per family per year for secondary and tertiary hospitalization.',
    benefit: '₹5 Lakh cashless family medical protection',
    requiredProfileFields: [
      'fullName',
      'dob',
      'gender',
      'aadhaarNumber',
      'rationCardNumber',
      'annualIncome',
      'address'
    ],
    deltaFields: [
      {
        id: 'preferredHospitalNetwork',
        label: 'Nearest Empanelled Health Facility Tier',
        type: 'select',
        options: ['District Civil Hospital', 'Empanelled Private Super-Specialty', 'Community Health Centre (CHC)'],
        required: true,
        defaultValue: 'District Civil Hospital',
        description: 'Primary treatment cluster'
      }
    ],
    processingType: 'MODERN_REST',
    adapterName: 'ABDM-FHIR-OpenHealth-Adapter v2.1',
    slaDays: 2,
    iconName: 'HeartPulse',
    popularityRank: 5
  },
  {
    id: 'SRV-REV-006',
    code: 'UDYAM-MSME',
    title: 'Udyam Micro & Small Enterprise Registration',
    department: 'Ministry of Micro, Small and Medium Enterprises',
    ministry: 'Ministry of MSME',
    category: 'Revenue',
    description: 'Official zero-cost digital registration certificate for nano and micro enterprises with priority bank lending access.',
    benefit: 'Government tender priority & 1% collateral interest rebate',
    requiredProfileFields: [
      'fullName',
      'aadhaarNumber',
      'panNumber',
      'bankAccount',
      'phone',
      'email',
      'address'
    ],
    deltaFields: [
      {
        id: 'enterpriseName',
        label: 'Enterprise / Commercial Trade Name',
        type: 'text',
        placeholder: 'e.g. Sharma Agro-Tech Innovations',
        required: true,
        defaultValue: 'Sharma Organic Bio-Tech Produce',
        description: 'Business entity registered name'
      },
      {
        id: 'nicMajorActivity',
        label: 'Primary National Industrial Classification (NIC)',
        type: 'select',
        options: ['0161 - Agricultural Support Activities', '1079 - Manufacture of Food Products', '4630 - Wholesale of Agricultural Raw Materials', '6209 - Other Information Technology Services'],
        required: true,
        defaultValue: '0161 - Agricultural Support Activities',
        description: 'Classification code for MSME policy'
      }
    ],
    processingType: 'LEGACY_SOAP_XML',
    adapterName: 'MSME-Portal-Legacy-XML-Adapter v1.8',
    slaDays: 4,
    iconName: 'Building2',
    popularityRank: 6
  }
];

export const INITIAL_CONSENT_TOKENS: ConsentToken[] = [
  {
    id: 'CST-2026-88192A',
    citizenId: 'CIT-IN-2026-98124',
    citizenName: 'Aarav Sharma',
    serviceId: 'SRV-AGRI-001',
    serviceName: 'PM-Kisan Samman Nidhi Scheme',
    department: 'Department of Agriculture & Farmers Welfare',
    purpose: 'Verification of Land Title 7/12 ROR and Direct DBT Transfer of Installments',
    sharedFields: ['fullName', 'aadhaarNumber', 'bankAccount', 'landRecordId', 'landAreaAcres', 'address'],
    status: 'ACTIVE',
    grantedAt: '2026-09-01T09:15:00Z',
    expiresAt: '2027-09-01T09:15:00Z',
    retentionDays: 365,
    jwtToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWFyYXYgU2hhcm1hIiwicHVycG9zZSI6IlBNLUtpc2FuIiwiaWF0IjoxNzI1MTgxNzAwfQ.govsync-sig-88192a',
    sha256Hash: '9a8f4c2e6d1b7a0f3e5c8d2a1b9f4e6c8a2d0f1b3e5c7a9f2d4b6e8a0c2e4f6a'
  },
  {
    id: 'CST-2026-44019B',
    citizenId: 'CIT-IN-2026-98124',
    citizenName: 'Aarav Sharma',
    serviceId: 'SRV-TRN-004',
    serviceName: 'Driving License Online Endorsement & Renewal',
    department: 'Transport Department (Sarathi)',
    purpose: 'Identity, Address verification & biometric match for Driving License renewal',
    sharedFields: ['fullName', 'dob', 'drivingLicenseNumber', 'address', 'phone'],
    status: 'ACTIVE',
    grantedAt: '2026-08-20T14:20:00Z',
    expiresAt: '2027-08-20T14:20:00Z',
    retentionDays: 365,
    jwtToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWFyYXYgU2hhcm1hIiwicHVycG9zZSI6IlNhcmF0aGktREwiLCJpYXQiOjE3MjQxNjM2MDB9.govsync-sig-44019b',
    sha256Hash: '4f2e6a8d1c9b3e5f7a0c2e4f6a8d1b3e5c7a9f2d4b6e8a0c2e4f6a9a8f4c2e6d'
  }
];

export const INITIAL_APPLICATIONS: ServiceApplication[] = [
  {
    id: 'APP-AGRI-2026-0901',
    applicationNumber: 'MH-AGRI-PMK-2026-904812',
    serviceId: 'SRV-AGRI-001',
    serviceName: 'PM-Kisan Samman Nidhi Scheme',
    department: 'Department of Agriculture & Farmers Welfare',
    citizenId: 'CIT-IN-2026-98124',
    citizenName: 'Aarav Sharma',
    submittedAt: '2026-09-01T09:16:30Z',
    status: 'APPROVED',
    stages: [
      {
        name: 'Consent & Profile Dispatch',
        timestamp: '2026-09-01T09:15:00Z',
        status: 'COMPLETED',
        description: 'Citizen granted scope-bounded consent CST-2026-88192A for 6 profile attributes.',
        techDetails: 'OAuth 2.0 Token Signed with SHA-256'
      },
      {
        name: 'GovSync API Gateway Ingress',
        timestamp: '2026-09-01T09:15:04Z',
        status: 'COMPLETED',
        description: 'Request authenticated, rate-limit passed (24ms latency), routed to AgriStack adapter.',
        techDetails: 'API Gateway Endpoint: /v1/routes/agri/pm-kisan [HTTP 200]'
      },
      {
        name: 'Legacy Adapter Normalization',
        timestamp: '2026-09-01T09:15:10Z',
        status: 'COMPLETED',
        description: 'Common JSON model transformed into legacy SOAP envelope (<FarmerRegistrationReq>).',
        techDetails: 'AgriStack-Legacy-SOAP-Adapter v2.4 (Bi-directional mapping 100%)'
      },
      {
        name: 'Department Land & Bank Verification',
        timestamp: '2026-09-01T15:40:00Z',
        status: 'COMPLETED',
        description: 'Revenue record MH-ROR-7/12 verified with Pune land registry. DBT bank IFSC verified.',
        techDetails: 'Land Registry API: Verified 3.5 Acres. PFMS Bank Status: Active'
      },
      {
        name: 'Final Benefit Sanction',
        timestamp: '2026-09-02T11:00:00Z',
        status: 'COMPLETED',
        description: 'Approved by District Agriculture Officer. First DBT installment scheduled.',
        techDetails: 'Sanction Order: AGRI-DBT-2026-PUN-0912'
      }
    ],
    consentTokenId: 'CST-2026-88192A',
    profileDataSnapshot: {
      fullName: 'Aarav Sharma',
      aadhaarNumber: 'XXXX-XXXX-4819',
      address: INITIAL_CITIZEN_PROFILE.address,
      verifiedCredentials: INITIAL_CITIZEN_PROFILE.verifiedCredentials
    },
    deltaData: {
      cropCategory: 'Soybean / Pulses',
      irrigationSource: 'Drip / Sprinkler Irrigation'
    },
    legacyPayloadPreview: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:agr="http://agri.gov.in/pmkisan/v1">
  <soapenv:Header>
    <agr:AuthToken>CST-2026-88192A</agr:AuthToken>
    <agr:InteroperabilityGatewayId>GOVSYNC-GW-IN-01</agr:InteroperabilityGatewayId>
  </soapenv:Header>
  <soapenv:Body>
    <agr:FarmerBeneficiaryRequest>
      <agr:FarmerName>Aarav Sharma</agr:FarmerName>
      <agr:AadhaarMasked>XXXX-XXXX-4819</agr:AadhaarMasked>
      <agr:LandRecordNumber>MH-ROR-7/12-PUN-98214</agr:LandRecordNumber>
      <agr:AreaHectares>1.416</agr:AreaHectares>
      <agr:BankIFSC>SBIN0001234</agr:BankIFSC>
      <agr:AccountNumber>50100489218492</agr:AccountNumber>
      <agr:DistrictCode>MH-PUN</agr:DistrictCode>
    </agr:FarmerBeneficiaryRequest>
  </soapenv:Body>
</soapenv:Envelope>`,
    normalizedJsonPreview: `{
  "govsyncVersion": "2.0",
  "eventType": "GOV_SERVICE_SUBMISSION",
  "serviceCode": "PM-KISAN",
  "consent": {
    "tokenId": "CST-2026-88192A",
    "verified": true,
    "scope": ["IDENTITY", "FINANCIAL", "LAND_REGISTRY"]
  },
  "citizen": {
    "identifier": "CIT-IN-2026-98124",
    "demographics": {
      "fullName": "Aarav Sharma",
      "aadhaarMasked": "XXXX-XXXX-4819",
      "pincode": "411038",
      "district": "Pune",
      "state": "Maharashtra"
    },
    "landHoldings": {
      "recordId": "MH-ROR-7/12-PUN-98214",
      "acres": 3.5,
      "ownershipStatus": "INDIVIDUAL_CLEAR"
    },
    "disbursement": {
      "ifsc": "SBIN0001234",
      "account": "50100489218492",
      "validatedPfms": true
    }
  }
}`,
    officerRemarks: 'All land registry attributes matched Pune District record 7/12. Auto-approved under FastTrack Interop Protocol.',
    approvedBy: 'Dr. Priya Verma (District Agriculture Officer)',
    approvalCertificateNumber: 'CERT-PMK-2026-MH-88912',
    updatedAt: '2026-09-02T11:00:00Z'
  },
  {
    id: 'APP-TRN-2026-0820',
    applicationNumber: 'MH-TRN-DL-2026-441092',
    serviceId: 'SRV-TRN-004',
    serviceName: 'Driving License Online Endorsement & Renewal',
    department: 'Transport Department (Sarathi)',
    citizenId: 'CIT-IN-2026-98124',
    citizenName: 'Aarav Sharma',
    submittedAt: '2026-08-20T14:22:00Z',
    status: 'DEPARTMENT_PROCESSING',
    stages: [
      {
        name: 'Consent & Profile Dispatch',
        timestamp: '2026-08-20T14:20:00Z',
        status: 'COMPLETED',
        description: 'Consent token CST-2026-44019B generated for Parivahan Sarathi.',
        techDetails: 'Data payload size: 1.8 KB'
      },
      {
        name: 'GovSync API Gateway Ingress',
        timestamp: '2026-08-20T14:20:02Z',
        status: 'COMPLETED',
        description: 'Direct REST OpenAPI endpoint dispatch.',
        techDetails: 'Target: https://api.parivahan.gov.in/v2/dl/renew [Latency: 18ms]'
      },
      {
        name: 'Modern REST Connector Verification',
        timestamp: '2026-08-20T14:20:05Z',
        status: 'COMPLETED',
        description: 'National Registry verified existing DL MH-12-2018-0091823 validity.',
        techDetails: 'HTTP 200 OK — Biometric sync confirmed'
      },
      {
        name: 'RTO Officer Final Clearance',
        timestamp: '2026-08-21T10:00:00Z',
        status: 'IN_PROGRESS',
        description: 'Pending digital endorsement by Pune RTO Assistant Transport Officer.',
        techDetails: 'Queue Position: 3 of 42'
      }
    ],
    consentTokenId: 'CST-2026-44019B',
    profileDataSnapshot: {
      fullName: 'Aarav Sharma',
      dob: INITIAL_CITIZEN_PROFILE.dob,
      address: INITIAL_CITIZEN_PROFILE.address,
      phone: INITIAL_CITIZEN_PROFILE.phone,
      verifiedCredentials: INITIAL_CITIZEN_PROFILE.verifiedCredentials
    },
    deltaData: {
      vehicleClass: 'LMV + MCWG (Combined)',
      organDonorConsent: 'Yes, I pledge to donate'
    },
    officerRemarks: 'Under review by Pune RTO desk. Biometrics matched with DigiLocker repository.',
    updatedAt: '2026-08-21T10:00:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-2026-9901',
    timestamp: '2026-09-02T11:00:00Z',
    actor: {
      id: 'OFF-MH-AGRI-04',
      name: 'Dr. Priya Verma',
      role: 'OFFICER',
      department: 'Department of Agriculture & Farmers Welfare'
    },
    action: 'OFFICER_APPROVED',
    serviceName: 'PM-Kisan Samman Nidhi Scheme',
    affectedCitizenId: 'CIT-IN-2026-98124',
    affectedCitizenName: 'Aarav Sharma',
    details: 'Approved application MH-AGRI-PMK-2026-904812 with digital sanction order CERT-PMK-2026-MH-88912.',
    ipAddress: '10.128.44.18 (NIC GovNet)',
    consentTokenId: 'CST-2026-88192A',
    integrityHash: '8f7a9c2b4d6e8a0f1c3e5a7b9d2f4e6a8c0b2d4e6f8a0c2e4f6a8d1b3e5c7a9f'
  },
  {
    id: 'AUD-2026-9900',
    timestamp: '2026-09-01T09:15:10Z',
    actor: {
      id: 'SYS-ADAPTER-AGRI',
      name: 'AgriStack Legacy SOAP Adapter',
      role: 'ADMIN',
      department: 'GovSync Core Interoperability Hub'
    },
    action: 'DATA_NORMALIZED',
    serviceName: 'PM-Kisan Samman Nidhi Scheme',
    affectedCitizenId: 'CIT-IN-2026-98124',
    affectedCitizenName: 'Aarav Sharma',
    details: 'Transformed GovSync Common JSON into legacy XML payload with 100% field parity.',
    ipAddress: '127.0.0.1 (Gateway Internal)',
    consentTokenId: 'CST-2026-88192A',
    integrityHash: '3a5c7e9f1a2d4b6c8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8c0d2e4f6a8b0c2e4a'
  },
  {
    id: 'AUD-2026-9899',
    timestamp: '2026-09-01T09:15:00Z',
    actor: {
      id: 'CIT-IN-2026-98124',
      name: 'Aarav Sharma',
      role: 'CITIZEN'
    },
    action: 'CONSENT_GRANTED',
    serviceName: 'PM-Kisan Samman Nidhi Scheme',
    affectedCitizenId: 'CIT-IN-2026-98124',
    affectedCitizenName: 'Aarav Sharma',
    details: 'Explicit consent granted for 6 attributes with 365-day retention policy.',
    ipAddress: '103.21.144.92 (Citizen Mobile Device)',
    consentTokenId: 'CST-2026-88192A',
    integrityHash: '7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d'
  },
  {
    id: 'AUD-2026-9898',
    timestamp: '2026-08-20T14:20:00Z',
    actor: {
      id: 'CIT-IN-2026-98124',
      name: 'Aarav Sharma',
      role: 'CITIZEN'
    },
    action: 'CONSENT_GRANTED',
    serviceName: 'Driving License Online Endorsement & Renewal',
    affectedCitizenId: 'CIT-IN-2026-98124',
    affectedCitizenName: 'Aarav Sharma',
    details: 'Consent token CST-2026-44019B created for Transport Department (Sarathi).',
    ipAddress: '103.21.144.92 (Citizen Mobile Device)',
    consentTokenId: 'CST-2026-44019B',
    integrityHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b'
  }
];

export const INITIAL_METRICS: GatewayMetrics = {
  totalRequests: 148920,
  successfulInteractions: 147810,
  avgLatencyMs: 38,
  activeConsentTokens: 12450,
  legacyTransformations: 68420,
  citizenEffortSavedPercent: 60,
  repeatedDataEntryReductionPercent: 80,
  processEfficiencyPercent: 90
};
