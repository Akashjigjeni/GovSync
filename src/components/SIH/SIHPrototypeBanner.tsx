import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  Layers,
  ShieldCheck,
  User,
  Building2,
  Cpu,
  Lock
} from 'lucide-react';
import { useGovSync } from '../../context/GovSyncContext';

export const SIHPrototypeBanner: React.FC = () => {
  const {
    setIsJudgeTourOpen,
    launchScenario,
    resetAllDemoData,
    isBackendConnected,
    metrics
  } = useGovSync();

  const [isScenarioDropdownOpen, setIsScenarioDropdownOpen] = useState<boolean>(false);

  return (
    <div className="bg-[#002244] border-b border-[#001830] text-white text-xs py-2 px-4 sm:px-6 lg:px-8 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: SIH Evaluation Title & Status Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FF9933]/20 border border-[#FF9933]/40 text-[#FF9933] font-bold text-[11px] shadow-xs">
            <Award className="w-3.5 h-3.5 text-[#FF9933]" />
            <span>SIH Prototype Sandbox</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-300 font-medium">
            <span>•</span>
            <span className="text-white font-bold">Interoperability & Data Reuse Platform</span>
            <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-emerald-300 border border-white/15">
              Live Evaluation Ready
            </span>
          </div>
        </div>

        {/* Right: Judge Evaluation Controls */}
        <div className="flex items-center gap-2">
          {/* Start Guided Judge Tour CTA */}
          <button
            onClick={() => setIsJudgeTourOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg btn-saffron text-xs font-extrabold shadow-sm transition-all cursor-pointer"
            title="Open Interactive 4-Stage SIH Judge Presentation Deck"
          >
            <Sparkles className="w-3.5 h-3.5 fill-[#003366]" />
            <span>Judge Pitch Tour</span>
          </button>

          {/* Quick Scenario Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsScenarioDropdownOpen(!isScenarioDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#005A9C] hover:bg-[#004780] text-white text-xs font-bold border border-white/20 transition-colors shadow-xs cursor-pointer"
            >
              <Play className="w-3 h-3 text-[#FF9933] fill-[#FF9933]" />
              <span>Test Scenarios</span>
              <ChevronDown className="w-3 h-3 text-slate-300" />
            </button>

            {isScenarioDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-72 bg-white text-[#333333] rounded-2xl border border-[#D9D9D9] shadow-2xl z-50 p-2 space-y-1 animate-in fade-in"
                onMouseLeave={() => setIsScenarioDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 border-b border-[#D9D9D9] text-[10px] font-mono font-bold text-[#666666] uppercase">
                  1-Click Hands-On Test Scenarios
                </div>

                <button
                  onClick={() => {
                    launchScenario('CITIZEN_APPLY');
                    setIsScenarioDropdownOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-[#F7F7F7] flex items-start gap-2.5 transition-colors cursor-pointer group"
                >
                  <div className="p-1.5 rounded-lg bg-[#005A9C]/10 text-[#005A9C] group-hover:bg-[#005A9C] group-hover:text-white transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#333333]">Scenario 1: Citizen 1-Click Intake</h5>
                    <p className="text-[10px] text-[#666666]">85% pre-filled data + consent grant</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    launchScenario('OFFICER_REVIEW');
                    setIsScenarioDropdownOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-[#F7F7F7] flex items-start gap-2.5 transition-colors cursor-pointer group"
                >
                  <div className="p-1.5 rounded-lg bg-[#003366]/10 text-[#003366] group-hover:bg-[#003366] group-hover:text-white transition-colors">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#333333]">Scenario 2: Officer Sanction Desk</h5>
                    <p className="text-[10px] text-[#666666]">Instant review & digital certificate</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    launchScenario('ADAPTER_STUDIO');
                    setIsScenarioDropdownOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-[#F7F7F7] flex items-start gap-2.5 transition-colors cursor-pointer group"
                >
                  <div className="p-1.5 rounded-lg bg-[#FF9933]/15 text-[#003366] group-hover:bg-[#FF9933] transition-colors">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#333333]">Scenario 3: Legacy Adapter Studio</h5>
                    <p className="text-[10px] text-[#666666]">SOAP/XML & Flat-File normalization</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    launchScenario('PRIVACY_REVOKE');
                    setIsScenarioDropdownOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-[#F7F7F7] flex items-start gap-2.5 transition-colors cursor-pointer group"
                >
                  <div className="p-1.5 rounded-lg bg-[#138808]/10 text-[#138808] group-hover:bg-[#138808] group-hover:text-white transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#333333]">Scenario 4: DPDP Consent Revocation</h5>
                    <p className="text-[10px] text-[#666666]">1-click token invalidation & audit log</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Reset Demo Button */}
          <button
            onClick={resetAllDemoData}
            title="Reset All Applications, Consents, and Metrics to Default Baseline"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-[#FF9933] border border-white/20 transition-colors shadow-xs cursor-pointer"
            aria-label="Reset demo data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
