import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Sparkles,
  Lock,
  Cpu,
  Loader2
} from 'lucide-react';
import { useGovSync } from '../../context/GovSyncContext';

export const OneClickApplyModal: React.FC = () => {
  const {
    selectedServiceForApply,
    setSelectedServiceForApply,
    citizenProfile,
    applyForService,
    setSelectedAppForDetail
  } = useGovSync();

  const service = selectedServiceForApply;

  const [deltaValues, setDeltaValues] = useState<Record<string, any>>(() => {
    if (!service) return {};
    const initial: Record<string, any> = {};
    service.deltaFields.forEach((field) => {
      initial[field.id] = field.defaultValue || '';
    });
    return initial;
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionStep, setSubmissionStep] = useState<string>('');

  if (!service) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setSubmissionStep('1/3 Signing Scope-Bounded Consent Token...');
    await new Promise((r) => setTimeout(r, 600));

    setSubmissionStep('2/3 GovSync Gateway Ingress & Schema Normalization...');
    await new Promise((r) => setTimeout(r, 600));

    setSubmissionStep(`3/3 Dispatching to ${service.adapterName}...`);
    await new Promise((r) => setTimeout(r, 600));

    const newApp = await applyForService(service, deltaValues);
    setIsSubmitting(false);
    setSelectedServiceForApply(null);
    setSelectedAppForDetail(newApp);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-[#D9D9D9] rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header in Deep Navy Blue (#003366) */}
        <div className="p-5 border-b border-[#D9D9D9] flex items-center justify-between bg-[#003366] text-white">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FF9933] text-[#003366] px-2 py-0.5 rounded">
              One-Click Intake Form
            </span>
            <h3 className="text-lg font-bold text-white mt-1">{service.title}</h3>
            <p className="text-xs text-slate-200 font-medium">{service.department}</p>
          </div>
          <button
            onClick={() => setSelectedServiceForApply(null)}
            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors shadow-xs cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {/* Fill Once Value Proposition Banner */}
          <div className="p-4 rounded-xl bg-[#005A9C]/10 border border-[#005A9C]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#005A9C] text-white shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#003366] uppercase tracking-wider">
                  85% Reusable Profile Data Pre-Filled
                </h4>
                <p className="text-[11px] text-[#005A9C] font-medium">
                  Zero redundant paperwork. Verified attributes pulled securely from your Common Citizen Profile.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[#138808]/20 text-[#138808] border border-[#138808]/30">
              80% Less Entry
            </span>
          </div>

          {/* Section 1: Pre-filled Reusable Data Showcase */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#333333] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#138808]" /> Autofilled From Verified Profile
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-[#F7F7F7] border border-[#D9D9D9]">
                <span className="text-[10px] text-[#666666] font-semibold block">Full Name</span>
                <span className="font-bold text-[#333333]">{citizenProfile.fullName}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F7F7] border border-[#D9D9D9]">
                <span className="text-[10px] text-[#666666] font-semibold block">Aadhaar (Masked)</span>
                <span className="font-mono font-bold text-[#003366]">{citizenProfile.aadhaarNumber}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F7F7] border border-[#D9D9D9]">
                <span className="text-[10px] text-[#666666] font-semibold block">District & State</span>
                <span className="font-semibold text-[#333333]">{citizenProfile.address.district}, {citizenProfile.address.state}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F7F7] border border-[#D9D9D9]">
                <span className="text-[10px] text-[#666666] font-semibold block">Bank Account</span>
                <span className="font-mono font-bold text-[#138808]">{citizenProfile.verifiedCredentials.bankAccount.bankName} (IFSC: {citizenProfile.verifiedCredentials.bankAccount.ifsc})</span>
              </div>
              {citizenProfile.verifiedCredentials.landRecordId && (
                <div className="p-2.5 rounded-xl bg-[#F7F7F7] border border-[#D9D9D9]">
                  <span className="text-[10px] text-[#666666] font-semibold block">Land 7/12 ROR</span>
                  <span className="font-mono font-bold text-[#005A9C]">{citizenProfile.verifiedCredentials.landRecordId} ({citizenProfile.verifiedCredentials.landAreaAcres} Ac)</span>
                </div>
              )}
              <div className="p-2.5 rounded-xl bg-[#F7F7F7] border border-[#D9D9D9]">
                <span className="text-[10px] text-[#666666] font-semibold block">DigiLocker ID</span>
                <span className="font-mono font-bold text-[#003366]">{citizenProfile.verifiedCredentials.digiLockerId}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Minimum Delta Fields Required for this specific service */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#333333] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#FF9933]" /> Service-Specific Additional Details (Delta Fields)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.deltaFields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <label className="block text-xs font-bold text-[#333333]">
                    {field.label} {field.required && <span className="text-[#B22222]">*</span>}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      value={deltaValues[field.id] || ''}
                      onChange={(e) => setDeltaValues({ ...deltaValues, [field.id]: e.target.value })}
                      className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-xs text-[#333333] focus:outline-none focus:border-[#005A9C] focus:ring-1 focus:ring-[#005A9C] font-medium shadow-xs"
                    >
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={deltaValues[field.id] || ''}
                      onChange={(e) => setDeltaValues({ ...deltaValues, [field.id]: e.target.value })}
                      required={field.required}
                      className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-xs text-[#333333] focus:outline-none focus:border-[#005A9C] focus:ring-1 focus:ring-[#005A9C] font-medium shadow-xs"
                    />
                  )}
                  <p className="text-[10px] text-[#666666]">{field.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Explicit Purpose-Bounded Consent Grant */}
          <div className="p-4 rounded-xl bg-[#F7F7F7] border border-[#138808]/40 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#138808]" />
                <h4 className="text-xs font-bold text-[#333333] uppercase tracking-wider">
                  Explicit Consent & Data Sharing Authorization
                </h4>
              </div>
              <span className="text-[10px] font-mono font-bold bg-[#138808]/10 text-[#138808] px-2 py-0.5 rounded border border-[#138808]/20">
                DPDP Act 2023 & IFEG Compliant
              </span>
            </div>

            <p className="text-xs text-[#666666] leading-relaxed font-medium">
              I, <strong className="text-[#333333]">{citizenProfile.fullName}</strong>, hereby grant explicit, purpose-bounded consent to{' '}
              <strong className="text-[#333333]">{service.department}</strong> to access my verified profile attributes strictly for the processing of{' '}
              <strong className="text-[#333333]">{service.title}</strong>.
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {service.requiredProfileFields.map((field) => (
                <span
                  key={field}
                  className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white text-[#333333] border border-[#D9D9D9]"
                >
                  ✓ {field}
                </span>
              ))}
            </div>

            <p className="text-[10px] text-[#666666] pt-1">
              • Valid for 365 days • Revocable anytime from Citizen Privacy Vault • Cryptographically signed with SHA-256
            </p>
          </div>

          {/* Submission progress indicator if submitting */}
          {isSubmitting && (
            <div className="p-4 rounded-xl bg-[#005A9C]/10 border border-[#005A9C]/30 flex items-center gap-3 animate-pulse">
              <Loader2 className="w-5 h-5 text-[#005A9C] animate-spin shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-[#003366]">Interoperability Processing in Progress</p>
                <p className="text-[#005A9C] font-mono text-[11px] font-semibold">{submissionStep}</p>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-2 flex items-center justify-between border-t border-[#D9D9D9]">
            <button
              type="button"
              onClick={() => setSelectedServiceForApply(null)}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-xs font-bold text-[#666666] border border-[#D9D9D9] transition-colors shadow-xs cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl btn-saffron text-xs font-extrabold shadow-sm flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize Consent & Submit</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
