import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCode2,
  Database,
  Award,
  Download,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useGovSync } from '../../context/GovSyncContext';

export const ApplicationTrackerModal: React.FC = () => {
  const { selectedAppForDetail, setSelectedAppForDetail, addToast } = useGovSync();
  const [activeTab, setActiveTab] = useState<'timeline' | 'normalized_json' | 'legacy_payload' | 'certificate'>('timeline');

  const app = selectedAppForDetail;
  if (!app) return null;

  const handleDownloadCert = () => {
    addToast({
      type: 'success',
      title: 'Digital Sanction Certificate Downloaded',
      message: `Sanction Order for ${app.applicationNumber} has been saved to your offline records.`
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-[#D9D9D9] rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header in Deep Navy Blue (#003366) */}
        <div className="p-5 border-b border-[#D9D9D9] flex items-center justify-between bg-[#003366] text-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-[#FF9933] text-[#003366] px-2 py-0.5 rounded">
                {app.applicationNumber}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  app.status === 'APPROVED'
                    ? 'bg-[#138808]/20 text-white border-[#138808]'
                    : app.status === 'REJECTED'
                    ? 'bg-[#B22222]/30 text-white border-[#B22222]'
                    : 'bg-[#F39C12]/20 text-[#FF9933] border-[#F39C12]'
                }`}
              >
                ● {app.status.replace('_', ' ')}
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">{app.serviceName}</h3>
            <p className="text-xs text-slate-200 font-medium">{app.department}</p>
          </div>
          <button
            onClick={() => setSelectedAppForDetail(null)}
            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors shadow-xs cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation in Government Blue (#005A9C) */}
        <div className="px-6 border-b border-[#D9D9D9] bg-[#F7F7F7] flex items-center gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-[#005A9C] text-[#005A9C]'
                : 'border-transparent text-[#666666] hover:text-[#005A9C]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Lifecycle Timeline
          </button>

          <button
            onClick={() => setActiveTab('normalized_json')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'normalized_json'
                ? 'border-[#005A9C] text-[#005A9C]'
                : 'border-transparent text-[#666666] hover:text-[#005A9C]'
            }`}
          >
            <Database className="w-3.5 h-3.5" /> Common JSON Model
          </button>

          <button
            onClick={() => setActiveTab('legacy_payload')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'legacy_payload'
                ? 'border-[#005A9C] text-[#005A9C]'
                : 'border-transparent text-[#666666] hover:text-[#005A9C]'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" /> Transformed Adapter Payload
          </button>

          {app.status === 'APPROVED' && (
            <button
              onClick={() => setActiveTab('certificate')}
              className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'certificate'
                  ? 'border-[#138808] text-[#138808]'
                  : 'border-transparent text-[#666666] hover:text-[#138808]'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-[#138808]" /> Digital Sanction Certificate
            </button>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* TAB 1: Lifecycle Timeline */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="space-y-4">
                {app.stages.map((stage, idx) => {
                  const isCompleted = stage.status === 'COMPLETED';
                  const isInProgress = stage.status === 'IN_PROGRESS';
                  const isRejected = stage.status === 'REJECTED';

                  return (
                    <div key={idx} className="relative flex items-start gap-4">
                      {idx !== app.stages.length - 1 && (
                        <div
                          className={`absolute left-4 top-8 -bottom-4 w-0.5 ${
                            isCompleted ? 'bg-[#138808]/50' : 'bg-[#D9D9D9]'
                          }`}
                        />
                      )}

                      <div
                        className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                          isCompleted
                            ? 'bg-[#138808]/10 border-[#138808] text-[#138808]'
                            : isInProgress
                            ? 'bg-[#F39C12]/10 border-[#F39C12] text-[#F39C12] animate-pulse'
                            : isRejected
                            ? 'bg-rose-100 border-[#B22222] text-[#B22222]'
                            : 'bg-slate-100 border-slate-300 text-slate-400'
                        }`}
                      >
                        {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                        {isInProgress && <Clock className="w-4 h-4" />}
                        {isRejected && <AlertCircle className="w-4 h-4" />}
                        {!isCompleted && !isInProgress && !isRejected && (
                          <span className="text-[10px] font-bold">{idx + 1}</span>
                        )}
                      </div>

                      <div className="flex-1 p-4 rounded-2xl bg-[#F7F7F7] border border-[#D9D9D9] shadow-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-[#333333]">{stage.name}</h4>
                          <span className="text-[10px] font-mono text-[#666666] font-semibold">
                            {new Date(stage.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-[#666666] mt-1 leading-relaxed font-medium">{stage.description}</p>
                        {stage.techDetails && (
                          <div className="mt-2 text-[10px] font-mono px-2.5 py-1 rounded bg-white text-[#003366] border border-[#D9D9D9] inline-block font-bold shadow-xs">
                            ⚙️ {stage.techDetails}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {app.officerRemarks && (
                <div className="p-4 rounded-xl bg-white border border-[#D9D9D9] text-xs shadow-xs">
                  <h5 className="font-bold text-[#333333] mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#005A9C]" /> Official Department Remarks
                  </h5>
                  <p className="text-[#666666] italic font-medium">{app.officerRemarks}</p>
                  {app.approvedBy && (
                    <p className="text-[10px] text-[#666666] mt-2 font-mono">
                      Signed by: <strong className="text-[#333333]">{app.approvedBy}</strong>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Common JSON Model */}
          {activeTab === 'normalized_json' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#666666] font-medium">
                  Standardized JSON payload normalized by GovSync Core Engine
                </span>
                <span className="text-[10px] font-mono font-bold bg-[#005A9C]/10 text-[#005A9C] px-2 py-0.5 rounded border border-[#005A9C]/20">
                  IFEG 2.0 Compliant Schema
                </span>
              </div>
              <pre className="p-4 rounded-xl bg-[#1E293B] border border-[#D9D9D9] text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-96 shadow-inner">
                {app.normalizedJsonPreview || 'No payload snapshot generated.'}
              </pre>
            </div>
          )}

          {/* TAB 3: Transformed Legacy Payload */}
          {activeTab === 'legacy_payload' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#666666] font-medium">
                  Adapter translation for legacy SOAP/XML or modern REST downstream service
                </span>
                <span className="text-[10px] font-mono font-bold bg-[#003366]/10 text-[#003366] px-2 py-0.5 rounded border border-[#003366]/20">
                  Bi-Directional Adapter Pipeline
                </span>
              </div>
              <pre className="p-4 rounded-xl bg-[#1E293B] border border-[#D9D9D9] text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-96 shadow-inner">
                {app.legacyPayloadPreview || 'No legacy payload required.'}
              </pre>
            </div>
          )}

          {/* TAB 4: Digital Sanction Certificate (National Look) */}
          {activeTab === 'certificate' && app.status === 'APPROVED' && (
            <div className="p-6 rounded-2xl bg-white border-2 border-[#138808] space-y-6 shadow-xl relative overflow-hidden">
              <div className="tricolor-stripe absolute top-0 left-0 right-0" />

              <div className="text-center space-y-1 border-b border-[#D9D9D9] pb-4 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#138808]">
                  भारत सरकार • Government of India
                </span>
                <h3 className="text-lg font-black text-[#003366]">Digital Sanction & Approval Order</h3>
                <p className="text-xs text-[#666666] font-mono">
                  Certificate No: <strong className="text-[#138808] font-bold">{app.approvalCertificateNumber}</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-[#666666] font-bold block">Beneficiary Name</span>
                  <span className="font-bold text-[#333333] text-sm">{app.citizenName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#666666] font-bold block">Application Ref Number</span>
                  <span className="font-mono font-bold text-[#003366]">{app.applicationNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#666666] font-bold block">Sanctioned Service</span>
                  <span className="font-semibold text-slate-800">{app.serviceName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#666666] font-bold block">Sanctioning Department</span>
                  <span className="font-semibold text-slate-800">{app.department}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#138808]/10 border border-[#138808]/20 text-xs text-[#138808] flex items-center justify-between font-medium">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#138808]" />
                  Verified via GovSync Gateway with cryptographic signature
                </span>
                <span className="font-mono text-[10px] font-bold">STATUS: ACTIVE / VERIFIED</span>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleDownloadCert}
                  className="px-4 py-2 rounded-xl btn-saffron text-xs font-extrabold shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Official Sanction PDF
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#D9D9D9] bg-[#F7F7F7] flex items-center justify-between text-xs text-[#666666]">
          <span>Consent ID: <strong className="font-mono text-[#003366] font-bold">{app.consentTokenId}</strong></span>
          <button
            onClick={() => setSelectedAppForDetail(null)}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#333333] font-bold border border-[#D9D9D9] transition-colors shadow-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
