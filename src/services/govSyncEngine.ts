import { CitizenProfile, GovernmentService, ConsentToken, ServiceApplication, AuditLogEntry, ApplicationStage } from '../types';

// Simple mock hash generator
export function generateHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `${hex}${hex.split('').reverse().join('')}${hex}${hex.slice(2, 6)}`.padEnd(64, 'a');
}

export function generateTokenId(): string {
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `CST-2026-${rand}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
}

export function generateApplicationNumber(serviceCode: string): string {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `MH-${serviceCode.replace(/[^A-Z]/g, '')}-2026-${rand}`;
}

// Map Citizen Profile + Delta Fields to GovSync Standard Common JSON Model
export function buildCommonJsonPayload(
  citizen: CitizenProfile,
  service: GovernmentService,
  deltaData: Record<string, any>,
  consentToken: ConsentToken
) {
  return {
    $schema: "https://govsync.gov.in/schemas/v2/interoperability-envelope.json",
    metadata: {
      standard: "IFEG-2.0 / API-Setu Compliant",
      transactionId: `TXN-GS-${Date.now()}`,
      timestamp: new Date().toISOString(),
      serviceCode: service.code,
      serviceName: service.title,
      originGateway: "GOVSYNC-GATEWAY-NATIONAL-01",
      targetMinistry: service.ministry,
      targetDepartment: service.department
    },
    consentToken: {
      id: consentToken.id,
      status: consentToken.status,
      purpose: consentToken.purpose,
      grantedAt: consentToken.grantedAt,
      retentionDays: consentToken.retentionDays,
      jwtProof: consentToken.jwtToken,
      integrityChecksum: consentToken.sha256Hash
    },
    citizen: {
      identifier: citizen.id,
      verifiedIdentity: {
        aadhaarMasked: citizen.aadhaarNumber,
        panNumber: citizen.verifiedCredentials.panNumber,
        digiLockerId: citizen.verifiedCredentials.digiLockerId,
        fullName: citizen.fullName,
        fatherName: citizen.fatherName,
        dob: citizen.dob,
        gender: citizen.gender,
        phone: citizen.phone,
        email: citizen.email
      },
      residentialAddress: {
        street: citizen.address.street,
        villageTown: citizen.address.villageTown,
        district: citizen.address.district,
        state: citizen.address.state,
        pincode: citizen.address.pincode,
        country: "IN"
      },
      socioDemographics: {
        category: citizen.demographics.category,
        annualIncomeInr: citizen.demographics.annualIncome,
        occupation: citizen.demographics.occupation,
        bplNumber: citizen.demographics.bplCardNumber
      },
      financialLedger: {
        bankName: citizen.verifiedCredentials.bankAccount.bankName,
        accountMasked: `XXXX-XXXX-${citizen.verifiedCredentials.bankAccount.accountNumber.slice(-4)}`,
        ifscCode: citizen.verifiedCredentials.bankAccount.ifsc,
        branch: citizen.verifiedCredentials.bankAccount.branch,
        dbtEnabled: true
      },
      departmentRegistries: {
        landRecordId: citizen.verifiedCredentials.landRecordId,
        landAreaAcres: citizen.verifiedCredentials.landAreaAcres,
        rationCardNumber: citizen.verifiedCredentials.rationCardNumber,
        drivingLicenseNumber: citizen.verifiedCredentials.drivingLicenseNumber,
        highestEducation: citizen.verifiedCredentials.highestEducation,
        passingYear: citizen.verifiedCredentials.passingYear,
        collegeName: citizen.verifiedCredentials.collegeName
      }
    },
    serviceSpecificDelta: deltaData
  };
}

// Generate Department-Specific Legacy/Modern Payloads from Common JSON
export function transformToTargetFormat(
  commonJson: ReturnType<typeof buildCommonJsonPayload>,
  service: GovernmentService
): { payloadType: string; content: string } {
  if (service.processingType === 'LEGACY_SOAP_XML') {
    return {
      payloadType: 'XML / SOAP 1.2 Envelope',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:dep="http://${service.code.toLowerCase()}.gov.in/interop/v1"
                  xmlns:sec="http://govsync.gov.in/security/tokens">
  <soapenv:Header>
    <sec:ConsentHeader>
      <sec:TokenID>${commonJson.consentToken.id}</sec:TokenID>
      <sec:DigitalSignature>${commonJson.consentToken.integrityChecksum}</sec:DigitalSignature>
      <sec:RetentionPolicyDays>${commonJson.consentToken.retentionDays}</sec:RetentionPolicyDays>
    </sec:ConsentHeader>
    <dep:RoutingHeader>
      <dep:TransactionRef>${commonJson.metadata.transactionId}</dep:TransactionRef>
      <dep:SourceGateway>${commonJson.metadata.originGateway}</dep:SourceGateway>
    </dep:RoutingHeader>
  </soapenv:Header>
  <soapenv:Body>
    <dep:ExecuteApplicationSubmission>
      <dep:BeneficiaryIdentity>
        <dep:FullName>${commonJson.citizen.verifiedIdentity.fullName}</dep:FullName>
        <dep:AadhaarMasked>${commonJson.citizen.verifiedIdentity.aadhaarMasked}</dep:AadhaarMasked>
        <dep:Phone>${commonJson.citizen.verifiedIdentity.phone}</dep:Phone>
        <dep:State>${commonJson.citizen.residentialAddress.state}</dep:State>
        <dep:District>${commonJson.citizen.residentialAddress.district}</dep:District>
        <dep:Pincode>${commonJson.citizen.residentialAddress.pincode}</dep:Pincode>
      </dep:BeneficiaryIdentity>
      <dep:FinancialDisbursement>
        <dep:BankName>${commonJson.citizen.financialLedger.bankName}</dep:BankName>
        <dep:IFSC>${commonJson.citizen.financialLedger.ifscCode}</dep:IFSC>
        <dep:AccountMasked>${commonJson.citizen.financialLedger.accountMasked}</dep:AccountMasked>
      </dep:FinancialDisbursement>
      <dep:RegistryDetails>
        ${commonJson.citizen.departmentRegistries.landRecordId ? `<dep:Land712Id>${commonJson.citizen.departmentRegistries.landRecordId}</dep:Land712Id>` : ''}
        ${commonJson.citizen.departmentRegistries.landAreaAcres ? `<dep:LandAcres>${commonJson.citizen.departmentRegistries.landAreaAcres}</dep:LandAcres>` : ''}
        ${commonJson.citizen.departmentRegistries.rationCardNumber ? `<dep:RationNo>${commonJson.citizen.departmentRegistries.rationCardNumber}</dep:RationNo>` : ''}
      </dep:RegistryDetails>
      <dep:CustomDeltaAttributes>
        ${Object.entries(commonJson.serviceSpecificDelta).map(([k, v]) => `<dep:${k}>${v}</dep:${k}>`).join('\n        ')}
      </dep:CustomDeltaAttributes>
    </dep:ExecuteApplicationSubmission>
  </soapenv:Body>
</soapenv:Envelope>`
    };
  }

  if (service.processingType === 'LEGACY_FLAT_FILE') {
    const deltaStr = Object.entries(commonJson.serviceSpecificDelta).map(([k, v]) => `${k}=${v}`).join(';');
    return {
      payloadType: 'NIC Pipe-Delimited Batch Stream (ASCII/Fixed-Width)',
      content: `# GOVSYNC BATCH TRANSMISSION: ${commonJson.metadata.transactionId}
# GENERATED: ${commonJson.metadata.timestamp}
# CONSENT TOKEN: ${commonJson.consentToken.id} | SHA256: ${commonJson.consentToken.integrityChecksum}
HDR|${commonJson.metadata.serviceCode}|${commonJson.metadata.originGateway}|${commonJson.metadata.timestamp}|BATCH_ID_99182
REC|${commonJson.citizen.identifier}|${commonJson.citizen.verifiedIdentity.fullName}|${commonJson.citizen.verifiedIdentity.aadhaarMasked}|${commonJson.citizen.residentialAddress.district}|${commonJson.citizen.residentialAddress.pincode}|${commonJson.citizen.departmentRegistries.rationCardNumber || 'NA'}|${commonJson.citizen.financialLedger.ifscCode}|${deltaStr}
TRL|CHECKSUM=${commonJson.consentToken.integrityChecksum.slice(0, 16)}|RECORD_COUNT=1|STATUS=VALIDATED`
    };
  }

  // Modern REST OpenAPI JSON
  return {
    payloadType: 'Modern REST OpenAPI v3.1 JSON',
    content: JSON.stringify({
      endpoint: `POST /api/v3/departments/${service.category.toLowerCase()}/intake`,
      headers: {
        "Authorization": `Bearer ${commonJson.consentToken.jwtProof}`,
        "X-GovSync-Consent-ID": commonJson.consentToken.id,
        "X-GovSync-Signature": commonJson.consentToken.integrityChecksum,
        "Content-Type": "application/json"
      },
      body: {
        applicationMetadata: commonJson.metadata,
        beneficiary: commonJson.citizen,
        customParameters: commonJson.serviceSpecificDelta
      }
    }, null, 2)
  };
}

export function createApplicationStages(service: GovernmentService, consentToken: ConsentToken): ApplicationStage[] {
  const now = new Date();
  const time1 = new Date(now.getTime() - 2000).toISOString();
  const time2 = new Date(now.getTime() - 1000).toISOString();
  const time3 = now.toISOString();

  return [
    {
      name: 'Consent & Profile Tokenization',
      timestamp: time1,
      status: 'COMPLETED',
      description: `Citizen granted explicit purpose-bounded consent ${consentToken.id}.`,
      techDetails: `Scope: ${consentToken.sharedFields.length} profile attributes. Cryptographic JWT generated.`
    },
    {
      name: 'GovSync API Gateway Ingress',
      timestamp: time2,
      status: 'COMPLETED',
      description: 'Request authenticated, validated against national schema registry.',
      techDetails: `API Gateway: /v2/gateway/route/${service.category.toLowerCase()} [Latency: 28ms]`
    },
    {
      name: `Adapter Normalization (${service.adapterName})`,
      timestamp: time3,
      status: 'COMPLETED',
      description: `Payload mapped to ${service.processingType === 'MODERN_REST' ? 'REST OpenAPI Endpoint' : 'Legacy Department Envelope'}.`,
      techDetails: `Engine: GovSync Interoperability Adapter (${service.processingType})`
    },
    {
      name: 'Department Desk Verification',
      timestamp: new Date(now.getTime() + 1000).toISOString(),
      status: 'IN_PROGRESS',
      description: `Forwarded to ${service.department} officer queue for final administrative sanction.`,
      techDetails: `Estimated SLA: ${service.slaDays} business days`
    },
    {
      name: 'Final Benefit Sanction / Certificate Issue',
      timestamp: new Date(now.getTime() + 2000).toISOString(),
      status: 'PENDING',
      description: 'Awaiting departmental sanction order and digital certificate issuance.',
      techDetails: 'Auto-syncs with Citizen DigiLocker upon approval'
    }
  ];
}

export const TRANSLATIONS = {
  en: {
    tagline: 'Fill Once. Reuse Securely. Access Multiple Government Services.',
    problemStatement: 'Building Interoperable & Integrated Government Ecosystem',
    citizenTab: 'Citizen Portal',
    officerTab: 'Department Officer',
    adminTab: 'Interoperability Hub',
    oneProfile: 'One Reusable Profile',
    activeConsents: 'Active Consents',
    myApplications: 'My Applications',
    exploreServices: 'Explore Services',
    dataPrivacy: 'Privacy & Access Audit',
    effortSaved: 'Citizen Effort Saved',
    dataReduction: 'Repeated Data Entry',
    processEfficiency: 'Process Efficiency',
    applyNow: 'One-Click Apply with GovSync',
    consentGranted: 'Consent Granted',
    grantConsentBtn: 'Authorize & Submit Application',
    statusApproved: 'Approved',
    statusProcessing: 'In Review',
    statusSubmitted: 'Gateway Routed',
    viewDetails: 'Track Status & Audit',
    adapterStudio: 'Adapter Transformation Studio',
    gatewayMonitor: 'API Gateway Live Traffic',
    nationalMetrics: 'Interoperability Metrics'
  },
  hi: {
    tagline: 'एक बार भरें। सुरक्षित रूप से पुनः उपयोग करें। अनेक सरकारी सेवाओं का लाभ उठाएं।',
    problemStatement: 'अंतर-संचालनीय एवं एकीकृत सरकारी डिजिटल तंत्र',
    citizenTab: 'नागरिक पोर्टल',
    officerTab: 'विभागीय अधिकारी',
    adminTab: 'इंटरऑपरेबिलिटी हब',
    oneProfile: 'पुनः प्रयोज्य नागरिक प्रोफाइल',
    activeConsents: 'सक्रिय सहमति (Consents)',
    myApplications: 'मेरे आवेदन',
    exploreServices: 'सरकारी सेवाएं खोजें',
    dataPrivacy: 'गोपनीयता एवं ऑडिट लॉग',
    effortSaved: 'नागरिक समय की बचत',
    dataReduction: 'दोहराव डेटा प्रविष्टि में कमी',
    processEfficiency: 'विभागीय प्रक्रिया दक्षता',
    applyNow: 'GovSync द्वारा 1-क्लिक आवेदन',
    consentGranted: 'सहमति स्वीकृत',
    grantConsentBtn: 'सहमति दें एवं आवेदन जमा करें',
    statusApproved: 'स्वीकृत',
    statusProcessing: 'समीक्षाधीन',
    statusSubmitted: 'गेटवे अग्रेषित',
    viewDetails: 'स्थिति एवं ऑडिट देखें',
    adapterStudio: 'अडैप्टर ट्रांसफॉर्मेशन स्टूडियो',
    gatewayMonitor: 'API गेटवे लाइव ट्रैफिक',
    nationalMetrics: 'राष्ट्रीय इंटरऑपरेबिलिटी मेट्रिक्स'
  },
  mr: {
    tagline: 'एकदाच भरा. सुरक्षितपणे पुनर्वापर करा. अनेक शासकीय सेवा मिळवा.',
    problemStatement: 'आंतर-कार्यक्षम आणि एकात्मिक शासकीय डिजिटल परिसंस्था',
    citizenTab: 'नागरिक पोर्टल',
    officerTab: 'विभागीय अधिकारी',
    adminTab: 'इंटरऑपरेबिलिटी केंद्र',
    oneProfile: 'एकल नागरिक प्रोफाइल',
    activeConsents: 'सक्रिय संमती',
    myApplications: 'माझे अर्ज',
    exploreServices: 'शासकीय सेवा शोधा',
    dataPrivacy: 'गोपनीयता आणि ऑडिट नोंद',
    effortSaved: 'नागरिकांच्या श्रमात बचत',
    dataReduction: 'पुनरावृत्ती माहिती भरणे कमी',
    processEfficiency: 'प्रक्रिया कार्यक्षमता',
    applyNow: 'GovSync द्वारे 1-क्लिक अर्ज करा',
    consentGranted: 'संमती दिली',
    grantConsentBtn: 'संमती द्या आणि अर्ज सादर करा',
    statusApproved: 'मंजूर',
    statusProcessing: 'तपासणी सुरू',
    statusSubmitted: 'गेटवे मार्गस्थ',
    viewDetails: 'स्थिती आणि ऑडिट पाहा',
    adapterStudio: 'अडॅप्टर रूपांतरण स्टुडिओ',
    gatewayMonitor: 'API गेटवे थेट ट्रॅफिक',
    nationalMetrics: 'इंटरऑपरेबिलिटी आकडेवारी'
  }
};
