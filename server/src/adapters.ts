import { CitizenProfile, GovernmentService, ConsentToken, ApplicationStage } from './types.js';

export function buildCommonJsonPayload(
  citizen: CitizenProfile,
  service: GovernmentService,
  deltaData: Record<string, any>,
  consentToken: ConsentToken
) {
  return {
    $schema: 'https://govsync.gov.in/schemas/v2/interoperability-envelope.json',
    metadata: {
      standard: 'IFEG-2.0 / API-Setu Compliant',
      transactionId: `TXN-GS-${Date.now()}`,
      timestamp: new Date().toISOString(),
      serviceCode: service.code,
      serviceName: service.title,
      originGateway: 'GOVSYNC-GATEWAY-NATIONAL-01',
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
        country: 'IN'
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
        ${commonJson.citizen.departmentRegistries.rationCardNumber ? `<dep:RationCardId>${commonJson.citizen.departmentRegistries.rationCardNumber}</dep:RationCardId>` : ''}
      </dep:RegistryDetails>
      <dep:ApplicationDeltaParameters>
        ${Object.entries(commonJson.serviceSpecificDelta)
          .map(([k, v]) => `<dep:${k}>${v}</dep:${k}>`)
          .join('\n        ')}
      </dep:ApplicationDeltaParameters>
    </dep:ExecuteApplicationSubmission>
  </soapenv:Body>
</soapenv:Envelope>`
    };
  }

  if (service.processingType === 'LEGACY_FLAT_FILE') {
    const deltaStr = Object.entries(commonJson.serviceSpecificDelta)
      .map(([k, v]) => `${k}=${v}`)
      .join(';');
    return {
      payloadType: 'NIC Standard ASCII Pipe-Delimited Batch Format',
      content: `HDR|${service.code}|${commonJson.metadata.originGateway}|${commonJson.metadata.timestamp}|BATCH_${Date.now()}
REC|${commonJson.citizen.identifier}|${commonJson.citizen.verifiedIdentity.fullName}|${commonJson.citizen.verifiedIdentity.aadhaarMasked}|${commonJson.citizen.residentialAddress.district}|${commonJson.citizen.residentialAddress.pincode}|${commonJson.citizen.departmentRegistries.rationCardNumber || 'NA'}|${commonJson.citizen.financialLedger.ifscCode}|${deltaStr}
TRL|RECORD_COUNT=1|CHECKSUM=${commonJson.consentToken.integrityChecksum.slice(0, 16)}`
    };
  }

  return {
    payloadType: 'Modern REST OpenAPI 3.1 JSON Payload',
    content: JSON.stringify(
      {
        applicant: {
          id: commonJson.citizen.identifier,
          name: commonJson.citizen.verifiedIdentity.fullName,
          aadhaarMasked: commonJson.citizen.verifiedIdentity.aadhaarMasked,
          contact: {
            email: commonJson.citizen.verifiedIdentity.email,
            phone: commonJson.citizen.verifiedIdentity.phone
          },
          address: commonJson.citizen.residentialAddress,
          dbtAccount: commonJson.citizen.financialLedger
        },
        serviceParameters: commonJson.serviceSpecificDelta,
        authorizationConsent: {
          tokenId: commonJson.consentToken.id,
          valid: true,
          jwtHeaderSignature: commonJson.consentToken.jwtProof
        }
      },
      null,
      2
    )
  };
}

export function createApplicationStages(
  service: GovernmentService,
  consentToken: ConsentToken
): ApplicationStage[] {
  const now = new Date();
  const time1 = new Date(now.getTime() - 1000 * 60 * 2).toISOString();
  const time2 = new Date(now.getTime() - 1000 * 60).toISOString();
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
      description: `Payload translated into ${service.processingType.replace('_', ' ')} format for ${service.department}.`,
      techDetails: `Adapter Engine: IFEG-2.0 Normalizer [Checksum: Verified]`
    },
    {
      name: 'Department Officer Review & Sanction',
      timestamp: new Date(now.getTime() + 1000 * 60).toISOString(),
      status: 'IN_PROGRESS',
      description: 'Routed to Department Officer desk for eligibility verification and sanction order issuance.',
      techDetails: `SLA Deadline: ${service.slaDays} Days`
    }
  ];
}
