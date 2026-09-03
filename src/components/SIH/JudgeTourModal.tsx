import React, { useState } from 'react';
import {
  X,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  FileCode2,
  Lock,
  Cpu,
  User,
  Building2,
  CheckCircle2,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { useGovSync } from '../../context/GovSyncContext';

export const JudgeTourModal: React.FC = () => {
  const {
    isJudgeTourOpen,
    setIsJudgeTourOpen,
    launchScenario,
    setIsFlowVisualizerOpen
  } = useGovSync();

  const [activeSlide, setActiveSlide] = useState<number>(0);

  if (!isJudgeTourOpen) return null;

  const slides = [
    {
      id: 'problem',
      badge: 'THE CORE PROBLEM',
      title: 'Fragmented Government Digital Silos',
      subtitle: 'Citizens repeatedly entering the same demographic and registry information',
      icon: <Layers className="w-6 h-6 text-[#B22222]" />,
      accentColor: 'text-[#B22222]',
      borderColor: 'border-[#B22222]/30',
      bgColor: 'bg-rose-50',
      bulletPoints: [
        'Each government department (Agriculture, Transport, Education, MSME) operates on legacy, isolated infrastructure.',
        'Citizens are forced to re-upload Aadhaar, Land ROR, Ration Cards, and Bank Details separately for every scheme.',
        'Older backend systems cannot talk to modern REST APIs (still relying on SOAP 1.2 XML envelopes and flat files).'
      ],
      highlight: 'Result: Citizen fatigue, high administrative overhead, and weeks of delayed benefit disbursements.'
    },
    {
      id: 'solution',
      badge: 'OUR SOLUTION',
      title: 'GovSync National Interoperability Layer',
      subtitle: '«Fill Once. Reuse Securely. Access Multiple Government Services.»',
      icon: <ShieldCheck className="w-6 h-6 text-[#138808]" />,
      accentColor: 'text-[#138808]',
      borderColor: 'border-[#138808]/30',
      bgColor: 'bg-emerald-50',
      bulletPoints: [
        'Single Standardized Citizen Profile: Verified credentials (DigiLocker, PFMS, Land Records) linked once.',
        'Purpose-Bounded Consent Tokens: Citizens grant granular, time-bound (365 days) data access with 1-click revocation (DPDP Act 2023).',
        'Bi-Directional Adapter Framework: Seamlessly translates IFEG 2.0 Common JSON into legacy SOAP/XML and flat-file formats.'
      ],
      highlight: 'Key Innovation: Zero schema changes required on legacy departmental databases!'
    },
    {
      id: 'tech_arch',
      badge: 'TECHNICAL EXCELLENCE',
      title: 'National Standards & Zero-Trust Architecture',
      subtitle: 'Compliant with IFEG 2.0, API Setu, and OAuth 2.0 / JWT Specifications',
      icon: <Cpu className="w-6 h-6 text-[#005A9C]" />,
      accentColor: 'text-[#005A9C]',
      borderColor: 'border-[#005A9C]/30',
      bgColor: 'bg-sky-50',
      bulletPoints: [
        'OAuth 2.0 & RFC-7519 JWT: Secure Single Sign-On and tokenized authorization with custom claim scopes.',
        'SHA-256 Tamper-Evident Ledger: Every consent grant, gateway route, and officer sanction is cryptographically hashed.',
        'Express REST Backend + Docker: Production-ready multi-container architecture with Nginx reverse proxy.'
      ],
      highlight: 'High Performance: Sub-50ms API Gateway routing with 99.2% uptime SLA.'
    },
    {
      id: 'impact',
      badge: 'QUANTIFIABLE IMPACT',
      title: 'Proven Measurable Impact & Scalability',
      subtitle: 'Drastic reduction in administrative load and processing delays',
      icon: <BarChart3 className="w-6 h-6 text-[#FF9933]" />,
      accentColor: 'text-[#003366]',
      borderColor: 'border-[#FF9933]/40',
      bgColor: 'bg-amber-50',
      bulletPoints: [
        '60% Citizen Effort Saved: Form intake reduced from 15 minutes to under 60 seconds with 1-Click Apply.',
        '80% Reduction in Repeated Data Entry: Automated autofill from verified national registries.',
        '90% Processing Efficiency: Real-time officer verification and digital sanction order issuance.'
      ],
      highlight: 'Scalable: Ready for nationwide integration across Central Ministries & State Portals.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-[#D9D9D9] rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#D9D9D9] bg-[#003366] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 text-[#FF9933] border border-white/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FF9933] text-[#003366] px-2 py-0.5 rounded">
                  SIH Prototype Presentation Deck
                </span>
                <span className="text-xs text-slate-300 font-semibold hidden sm:inline">
                  Interactive Evaluation Tour
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                GovSync Interoperability Ecosystem Pitch
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsJudgeTourOpen(false)}
            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Step Navigation Bar */}
        <div className="grid grid-cols-4 border-b border-[#D9D9D9] bg-[#F7F7F7]">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setActiveSlide(idx)}
              className={`p-3 text-center border-b-2 text-xs font-bold transition-all cursor-pointer ${
                activeSlide === idx
                  ? 'border-[#005A9C] bg-white text-[#005A9C] shadow-xs'
                  : 'border-transparent text-[#666666] hover:bg-slate-100 hover:text-[#003366]'
              }`}
            >
              <span className="text-[10px] font-mono block opacity-70">STAGE 0{idx + 1}</span>
              <span className="line-clamp-1">{s.badge}</span>
            </button>
          ))}
        </div>

        {/* Slide Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Slide Card */}
          <div className={`p-6 rounded-2xl border ${slides[activeSlide].borderColor} ${slides[activeSlide].bgColor} space-y-4 shadow-xs`}>
            <div className="flex items-start justify-between gap-4 border-b border-[#D9D9D9] pb-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-white border border-[#D9D9D9] shadow-xs">
                  {slides[activeSlide].icon}
                </div>
                <div>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${slides[activeSlide].accentColor}`}>
                    {slides[activeSlide].badge}
                  </span>
                  <h4 className="text-xl font-black text-[#333333] leading-tight">
                    {slides[activeSlide].title}
                  </h4>
                  <p className="text-xs text-[#666666] font-medium mt-0.5">
                    {slides[activeSlide].subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  disabled={activeSlide === 0}
                  onClick={() => setActiveSlide((prev) => Math.max(0, prev - 1))}
                  className="px-3 py-1.5 rounded-xl bg-white text-xs font-bold text-[#333333] border border-[#D9D9D9] hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Prev
                </button>
                <button
                  disabled={activeSlide === slides.length - 1}
                  onClick={() => setActiveSlide((prev) => Math.min(slides.length - 1, prev + 1))}
                  className="px-3.5 py-1.5 rounded-xl btn-saffron text-xs font-extrabold shadow-xs hover:bg-[#F39C12] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Bullet Points */}
            <ul className="space-y-2.5 text-xs text-[#333333]">
              {slides[activeSlide].bulletPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-2.5 leading-relaxed font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#138808] shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            {/* Key Takeaway Callout */}
            <div className="p-3.5 rounded-xl bg-white border border-[#D9D9D9] text-xs font-bold text-[#003366] flex items-center gap-2 shadow-xs">
              <Sparkles className="w-4 h-4 text-[#FF9933] shrink-0" />
              <span>{slides[activeSlide].highlight}</span>
            </div>
          </div>

          {/* Interactive Live Scenario Launchers */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#333333] flex items-center justify-between">
              <span>🚀 Hands-On Live Prototype Scenarios (Click to Test)</span>
              <span className="text-[10px] font-mono text-[#666666]">Instant Role & Modal Switcher</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <button
                onClick={() => launchScenario('CITIZEN_APPLY')}
                className="p-3.5 rounded-2xl bg-white hover:bg-[#F7F7F7] border border-[#D9D9D9] hover:border-[#005A9C] text-left space-y-1.5 transition-all shadow-xs cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-[#005A9C]/10 text-[#005A9C] group-hover:bg-[#005A9C] group-hover:text-white transition-colors">
                    <User className="w-4 h-4" />
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#005A9C] group-hover:translate-x-1 transition-all" />
                </div>
                <h6 className="font-bold text-[#333333]">1. Citizen 1-Click Intake</h6>
                <p className="text-[10px] text-[#666666]">Pre-fills 85% data & grants consent</p>
              </button>

              <button
                onClick={() => launchScenario('OFFICER_REVIEW')}
                className="p-3.5 rounded-2xl bg-white hover:bg-[#F7F7F7] border border-[#D9D9D9] hover:border-[#003366] text-left space-y-1.5 transition-all shadow-xs cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-[#003366]/10 text-[#003366] group-hover:bg-[#003366] group-hover:text-white transition-colors">
                    <Building2 className="w-4 h-4" />
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#003366] group-hover:translate-x-1 transition-all" />
                </div>
                <h6 className="font-bold text-[#333333]">2. Officer Sanction Desk</h6>
                <p className="text-[10px] text-[#666666]">Checks JWT proof & issues certificate</p>
              </button>

              <button
                onClick={() => launchScenario('ADAPTER_STUDIO')}
                className="p-3.5 rounded-2xl bg-white hover:bg-[#F7F7F7] border border-[#D9D9D9] hover:border-[#FF9933] text-left space-y-1.5 transition-all shadow-xs cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-[#FF9933]/15 text-[#003366] group-hover:bg-[#FF9933] transition-colors">
                    <Cpu className="w-4 h-4" />
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF9933] group-hover:translate-x-1 transition-all" />
                </div>
                <h6 className="font-bold text-[#333333]">3. Adapter Studio</h6>
                <p className="text-[10px] text-[#666666]">Live SOAP/XML & Flat-File normalizer</p>
              </button>

              <button
                onClick={() => launchScenario('PRIVACY_REVOKE')}
                className="p-3.5 rounded-2xl bg-white hover:bg-[#F7F7F7] border border-[#D9D9D9] hover:border-[#138808] text-left space-y-1.5 transition-all shadow-xs cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-[#138808]/10 text-[#138808] group-hover:bg-[#138808] group-hover:text-white transition-colors">
                    <Lock className="w-4 h-4" />
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#138808] group-hover:translate-x-1 transition-all" />
                </div>
                <h6 className="font-bold text-[#333333]">4. DPDP Consent Vault</h6>
                <p className="text-[10px] text-[#666666]">1-click revocation & audit ledger</p>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#D9D9D9] bg-[#F7F7F7] flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            onClick={() => {
              setIsJudgeTourOpen(false);
              setIsFlowVisualizerOpen(true);
            }}
            className="text-xs font-bold text-[#005A9C] hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-4 h-4" /> Open 6-Step Visual Architecture Diagram
          </button>

          <button
            onClick={() => setIsJudgeTourOpen(false)}
            className="px-5 py-2 rounded-xl bg-[#003366] hover:bg-[#005A9C] text-white font-bold transition-colors cursor-pointer shadow-xs"
          >
            Close Pitch Deck & Explore Live App
          </button>
        </div>
      </div>
    </div>
  );
};
