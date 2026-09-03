import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  FileCode2,
  User,
  Lock,
  Stamp
} from 'lucide-react';
import { useGovSync } from '../../context/GovSyncContext';
import { ServiceApplication } from '../../types';

interface OfficerReviewModalProps {
  application: ServiceApplication | null;
  onClose: () => void;
  officerName: string;
}

export const OfficerReviewModal: React.FC<OfficerReviewModalProps> = ({
  application,
  onClose,
  officerName
}) => {
  const { updateApplicationStatusByOfficer } = useGovSync();
  const [remarks, setRemarks] = useState<string>(
    'All citizen data verified against national interop registry. Approved under FastTrack Protocol.'
  );
  const [activeView, setActiveView] = useState<'details' | 'raw_payload' | 'consent_jwt'>('details');

  if (!application) return null;

  const handleApprove = () => {
    updateApplicationStatusByOfficer(application.id, 'APPROVED', remarks, officerName);
    onClose();
  };

  const handleReject = () => {
    updateApplicationStatusByOfficer(
      application.id,
      'REJECTED',
      remarks || 'Incomplete documentation or eligibility mismatch.',
      officerName
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-[#D9D9D9] rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header in Deep Navy Blue (#003366) */}
        <div className="p-5 border-b border-[#D9D9D9] flex items-center justify-between bg-[#003366] text-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-[#FF9933] text-[#003366] px-2 py-0.5 rounded">
                OFFICER REVIEW DESK
              </span>
              <span className="text-xs font-mono text-slate-200 font-semibold">
                Ref: <strong className="text-white">{application.applicationNumber}</strong>
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">{application.serviceName}</h3>
            <p className="text-xs text-slate-200 font-medium">Department: {application.department}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors shadow-xs cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Tabs in Government Blue (#005A9C) */}
        <div className="px-6 border-b border-[#D9D9D9] bg-[#F7F7F7] flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveView('details')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer ${
              activeView === 'details'
                ? 'border-[#005A9C] text-[#005A9C]'
                : 'border-transparent text-[#666666] hover:text-[#005A9C]'
            }`}
          >
            <User className="w-3.5 h-3.5 inline mr-1" /> Standardized Application Intake
          </button>

          <button
            onClick={() => setActiveView('raw_payload')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer ${
              activeView === 'raw_payload'
                ? 'border-[#005A9C] text-[#005A9C]'
                : 'border-transparent text-[#666666] hover:text-[#005A9C]'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5 inline mr-1" /> Adapter Payload Ingress
          </button>

          <button
            onClick={() => setActiveView('consent_jwt')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer ${
              activeView === 'consent_jwt'
                ? 'border-[#005A9C] text-[#005A9C]'
                : 'border-transparent text-[#666666] hover:text-[#005A9C]'
            }`}
          >
            <Lock className="w-3.5 h-3.5 inline mr-1" /> Cryptographic Consent Proof
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeView === 'details' && (
            <div className="space-y-6">
              {/* Verification Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-[#F7F7F7] border border-[#D9D9D9] flex items-center gap-3 text-xs shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-[#138808] shrink-0" />
                  <div>
                    <span className="font-bold text-[#333333] block">DigiLocker Synced</span>
                    <span className="text-[10px] text-[#666666] font-medium">Verified Identity Match</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F7F7F7] border border-[#D9D9D9] flex items-center gap-3 text-xs shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-[#005A9C] shrink-0" />
                  <div>
                    <span className="font-bold text-[#333333] block">PFMS DBT Verified</span>
                    <span className="text-[10px] text-[#666666] font-medium">Bank IFSC Linked</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F7F7F7] border border-[#D9D9D9] flex items-center gap-3 text-xs shadow-xs">
                  <Lock className="w-5 h-5 text-[#003366] shrink-0" />
                  <div>
                    <span className="font-bold text-[#333333] block">Consent Token Active</span>
                    <span className="text-[10px] font-mono font-bold text-[#003366]">{application.consentTokenId}</span>
                  </div>
                </div>
              </div>

              {/* Citizen Information Received */}
              <div className="p-5 rounded-2xl bg-[#F7F7F7] border border-[#D9D9D9] space-y-4 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#003366]">
                  Standardized Beneficiary Profile
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[#666666] font-semibold block text-[10px]">Beneficiary Name</span>
                    <span className="font-bold text-[#333333]">{application.citizenName}</span>
                  </div>
                  <div>
                    <span className="text-[#666666] font-semibold block text-[10px]">Aadhaar Masked</span>
                    <span className="font-mono font-bold text-[#333333]">{application.profileDataSnapshot.aadhaarNumber}</span>
                  </div>
                  <div>
                    <span className="text-[#666666] font-semibold block text-[10px]">District & State</span>
                    <span className="font-bold text-[#333333]">
                      {application.profileDataSnapshot.address?.district}, {application.profileDataSnapshot.address?.state}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#666666] font-semibold block text-[10px]">Bank Account (DBT)</span>
                    <span className="font-mono text-[#138808] font-bold">
                      {application.profileDataSnapshot.verifiedCredentials?.bankAccount?.bankName} (
                      {application.profileDataSnapshot.verifiedCredentials?.bankAccount?.ifsc})
                    </span>
                  </div>
                  {application.profileDataSnapshot.verifiedCredentials?.landRecordId && (
                    <div>
                      <span className="text-[#666666] font-semibold block text-[10px]">Land Record 7/12 ROR</span>
                      <span className="font-mono text-[#005A9C] font-bold">
                        {application.profileDataSnapshot.verifiedCredentials.landRecordId} ({application.profileDataSnapshot.verifiedCredentials.landAreaAcres} Ac)
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-[#666666] font-semibold block text-[10px]">Application Submission Date</span>
                    <span className="font-mono font-semibold text-slate-700">
                      {new Date(application.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Service Delta Fields */}
              <div className="p-5 rounded-2xl bg-[#F7F7F7] border border-[#D9D9D9] space-y-3 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#005A9C]">
                  Service-Specific Parameters (Delta Intake)
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {Object.entries(application.deltaData).map(([key, val]) => (
                    <div key={key} className="p-2.5 rounded-xl bg-white border border-[#D9D9D9]">
                      <span className="text-[10px] text-[#666666] font-bold block uppercase font-mono">{key}</span>
                      <span className="font-bold text-[#003366]">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Officer Decision & Remarks Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#333333]">
                  Administrative Sanction Remarks & Order Notes
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full bg-white border border-[#D9D9D9] rounded-xl p-3 text-xs text-[#333333] font-medium focus:outline-none focus:border-[#005A9C] focus:ring-1 focus:ring-[#005A9C] shadow-xs"
                  placeholder="Enter official remarks for approval/rejection..."
                />
              </div>
            </div>
          )}

          {activeView === 'raw_payload' && (
            <div className="space-y-3">
              <span className="text-xs text-[#666666] font-medium">
                Downstream adapter payload delivered to departmental database endpoint
              </span>
              <pre className="p-4 rounded-xl bg-[#1E293B] border border-[#D9D9D9] text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-96 shadow-inner">
                {application.legacyPayloadPreview || 'No raw legacy payload.'}
              </pre>
            </div>
          )}

          {activeView === 'consent_jwt' && (
            <div className="space-y-3">
              <span className="text-xs text-[#666666] font-medium">
                Cryptographic Consent Token verification with SHA-256 payload integrity check
              </span>
              <pre className="p-4 rounded-xl bg-[#1E293B] border border-[#D9D9D9] text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-96 shadow-inner">
                {JSON.stringify(
                  {
                    consentTokenId: application.consentTokenId,
                    citizenIdentifier: application.citizenId,
                    purposeBounded: application.serviceName,
                    legalBasis: 'India DPDP Act 2023 & IFEG Standard',
                    signatureAlgorithm: 'RS256 with SHA-256 Digest',
                    validity: 'ACTIVE',
                    gatewayVerification: 'PASSED (GovSync-GW-01)'
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>

        {/* Footer with Action Buttons */}
        <div className="p-5 border-t border-[#D9D9D9] bg-[#F7F7F7] flex items-center justify-between">
          <div className="text-xs text-[#666666] font-medium">
            Reviewing Officer: <strong className="text-[#003366]">{officerName}</strong>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReject}
              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#B22222] border border-rose-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <XCircle className="w-4 h-4" /> Reject / Return
            </button>

            <button
              onClick={handleApprove}
              className="px-6 py-2 rounded-xl bg-[#138808] hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Stamp className="w-4 h-4" /> Issue Sanction Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
