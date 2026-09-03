import React, { useState } from 'react';
import {
  X,
  ArrowRight,
  ShieldCheck,
  Key,
  Database,
  Server,
  FileCode2,
  CheckCircle2,
  Layers,
  Sparkles
} from 'lucide-react';
import { useGovSync } from '../context/GovSyncContext';

export const InteractiveFlowModal: React.FC = () => {
  const { isFlowVisualizerOpen, setIsFlowVisualizerOpen } = useGovSync();
  const [activeStep, setActiveStep] = useState<number>(0);

  if (!isFlowVisualizerOpen) return null;

  const flowSteps = [
    {
      step: 1,
      title: 'Citizen Authentication & One Profile',
      subtitle: 'OAuth 2.0 / JWT Secure Identity',
      icon: <Key className="w-6 h-6 text-[#003366]" />,
      accentColor: 'text-[#003366]',
      borderColor: 'border-[#003366]',
      bgColor: 'bg-[#003366]/5',
      description: 'The citizen logs in once. Their verified credentials (Aadhaar masked, Land ROR, DigiLocker certificates, Bank account) are stored in their standardized Common Profile.',
      technical: 'JWT token issued with RS256 algorithm. Zero plain Aadhaar storage; uses masked UID + DigiLocker credential identifiers.'
    },
    {
      step: 2,
      title: 'Purpose-Bounded Consent Grant',
      subtitle: 'Explicit, Granular & Revocable',
      icon: <ShieldCheck className="w-6 h-6 text-[#138808]" />,
      accentColor: 'text-[#138808]',
      borderColor: 'border-[#138808]',
      bgColor: 'bg-[#138808]/5',
      description: 'When applying for a scheme, the citizen grants permission strictly for the required fields. A tamper-evident cryptographic Consent Token (CST) is generated.',
      technical: 'Time-bound (365 days) retention policy, specific data attribute whitelist, instant 1-click revocation from Citizen Privacy Vault.'
    },
    {
      step: 3,
      title: 'GovSync National API Gateway',
      subtitle: 'Dynamic Ingress & Security Layer',
      icon: <Server className="w-6 h-6 text-[#005A9C]" />,
      accentColor: 'text-[#005A9C]',
      borderColor: 'border-[#005A9C]',
      bgColor: 'bg-[#005A9C]/5',
      description: 'The request hits the centralized GovSync API Gateway. The gateway validates the consent token signature, checks rate limits, and routes to the target department service.',
      technical: 'Validates X-GovSync-Consent-ID header, logs audit hash, performs TLS 1.3 mutual auth routing with sub-50ms latency.'
    },
    {
      step: 4,
      title: 'Legacy & Modern Adapter Layer',
      subtitle: 'SOAP/XML & Batch Normalization',
      icon: <FileCode2 className="w-6 h-6 text-[#FF9933]" />,
      accentColor: 'text-[#003366]',
      borderColor: 'border-[#FF9933]',
      bgColor: 'bg-[#FF9933]/10',
      description: 'For older government systems that cannot read modern JSON APIs, GovSync adapters automatically map and translate payloads into legacy SOAP/XML or pipe-delimited flat files.',
      technical: 'Bi-directional transformation engine with field-level schema validation conforming to IFEG (Interoperability Framework for e-Governance).'
    },
    {
      step: 5,
      title: 'Common JSON Normalization',
      subtitle: 'Standardized Data Envelope',
      icon: <Database className="w-6 h-6 text-[#003366]" />,
      accentColor: 'text-[#003366]',
      borderColor: 'border-[#003366]',
      bgColor: 'bg-[#003366]/5',
      description: 'Departmental responses and updates are normalized back into standard GovSync envelopes, eliminating siloed custom formats across all states and ministries.',
      technical: 'Common Data Model with unified definitions for Identity, Address, Financial, and Land Registry attributes.'
    },
    {
      step: 6,
      title: 'Unified Application Status Hook',
      subtitle: 'End-to-End Real-Time Tracking',
      icon: <CheckCircle2 className="w-6 h-6 text-[#138808]" />,
      accentColor: 'text-[#138808]',
      borderColor: 'border-[#138808]',
      bgColor: 'bg-[#138808]/5',
      description: 'Citizen tracks application progress in real-time on one dashboard instead of logging into 10 different departmental portals.',
      technical: 'Automated webhook listeners & cryptographic sanction order certificates pushed directly to the citizen profile.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-[#D9D9D9] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header in Deep Navy (#003366) */}
        <div className="p-6 border-b border-[#D9D9D9] flex items-center justify-between bg-[#003366] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 text-[#FF9933] border border-white/20">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                GovSync Interoperability Architecture
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#FF9933] text-[#003366]">
                  National Framework
                </span>
              </h3>
              <p className="text-xs text-slate-200 font-medium">
                Interactive step-by-step walkthrough of the end-to-end data lifecycle
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsFlowVisualizerOpen(false)}
            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors shadow-xs cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Step Timeline Indicator */}
          <div className="grid grid-cols-6 gap-2">
            {flowSteps.map((step, idx) => (
              <button
                key={step.step}
                onClick={() => setActiveStep(idx)}
                className={`flex flex-col items-center text-center p-3 rounded-xl border transition-all cursor-pointer ${
                  activeStep === idx
                    ? 'bg-[#003366] border-[#003366] text-white shadow-sm'
                    : 'bg-[#F7F7F7] border-[#D9D9D9] text-[#666666] hover:bg-white hover:text-[#003366]'
                }`}
              >
                <span className="text-[10px] font-mono font-bold mb-1 opacity-80">
                  STEP 0{step.step}
                </span>
                <span className="text-xs font-bold line-clamp-1">{step.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Active Step Showcase Card */}
          <div className={`p-6 rounded-2xl border ${flowSteps[activeStep].borderColor} ${flowSteps[activeStep].bgColor} shadow-xs transition-all`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#D9D9D9]">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white border border-[#D9D9D9] shadow-xs">
                  {flowSteps[activeStep].icon}
                </div>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#666666]">
                    Phase {flowSteps[activeStep].step} of 6
                  </span>
                  <h4 className="text-xl font-black text-[#333333]">{flowSteps[activeStep].title}</h4>
                  <p className="text-xs text-[#005A9C] font-bold">{flowSteps[activeStep].subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                  className="px-3 py-1.5 rounded-xl bg-white text-xs font-bold text-[#333333] hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed border border-[#D9D9D9] shadow-xs cursor-pointer"
                >
                  Previous
                </button>
                <button
                  disabled={activeStep === flowSteps.length - 1}
                  onClick={() => setActiveStep((prev) => Math.min(flowSteps.length - 1, prev + 1))}
                  className="px-3.5 py-1.5 rounded-xl btn-saffron text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Next Step →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-2xl bg-white border border-[#D9D9D9] shadow-xs">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#003366] mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" /> Functional Workflow
                </h5>
                <p className="text-[#666666] text-xs leading-relaxed font-medium">
                  {flowSteps[activeStep].description}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#D9D9D9] shadow-xs">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#005A9C] mb-2 flex items-center gap-1.5">
                  <FileCode2 className="w-3.5 h-3.5 text-[#005A9C]" /> Technical Implementation
                </h5>
                <p className="text-[#666666] text-xs leading-relaxed font-mono font-medium">
                  {flowSteps[activeStep].technical}
                </p>
              </div>
            </div>
          </div>

          {/* Architecture Flow Diagram Visual */}
          <div className="p-5 rounded-2xl bg-[#F7F7F7] border border-[#D9D9D9]">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#666666] mb-4">
              Visual Data Transmission Flow
            </h5>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
              <div className="px-3 py-2 rounded-xl bg-white border border-[#D9D9D9] text-[#333333] font-bold flex items-center gap-2 shadow-xs">
                <Key className="w-4 h-4 text-[#003366]" />
                <span>1. Citizen Profile</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />

              <div className="px-3 py-2 rounded-xl bg-white border border-[#D9D9D9] text-[#333333] font-bold flex items-center gap-2 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#138808]" />
                <span>2. Scope Consent</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />

              <div className="px-3 py-2 rounded-xl bg-white border border-[#D9D9D9] text-[#333333] font-bold flex items-center gap-2 shadow-xs">
                <Server className="w-4 h-4 text-[#005A9C]" />
                <span>3. API Gateway</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />

              <div className="px-3 py-2 rounded-xl bg-white border border-[#D9D9D9] text-[#333333] font-bold flex items-center gap-2 shadow-xs">
                <FileCode2 className="w-4 h-4 text-[#FF9933]" />
                <span>4. Adapter Layer</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />

              <div className="px-3 py-2 rounded-xl bg-white border border-[#D9D9D9] text-[#333333] font-bold flex items-center gap-2 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-[#138808]" />
                <span>5. Status & Certificate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#D9D9D9] bg-[#F7F7F7] flex items-center justify-between text-xs text-[#666666]">
          <span className="font-medium">«Fill Once. Reuse Securely. Access Multiple Government Services.»</span>
          <button
            onClick={() => setIsFlowVisualizerOpen(false)}
            className="px-4 py-2 rounded-xl bg-[#003366] hover:bg-[#005A9C] text-white font-bold transition-colors cursor-pointer"
          >
            Close Visualizer
          </button>
        </div>
      </div>
    </div>
  );
};
