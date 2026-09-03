import React from 'react';
import {
  ShieldCheck,
  User,
  Building2,
  Cpu,
  RotateCcw,
  Layers,
  Globe2,
  LogIn,
  LogOut,
  UserPlus,
  CheckCircle2
} from 'lucide-react';
import { useGovSync } from '../context/GovSyncContext';
import { LanguageCode } from '../types';

export const Navbar: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    language,
    setLanguage,
    t,
    setIsFlowVisualizerOpen,
    resetAllDemoData,
    metrics,
    isAuthenticated,
    citizenProfile,
    setIsAuthModalOpen,
    setAuthModalMode,
    logout,
    isBackendConnected
  } = useGovSync();

  return (
    <header className="sticky top-0 z-40 shadow-md">
      {/* 1. Indian National Tricolor Top Stripe */}
      <div className="tricolor-stripe w-full" />

      {/* 2. Official Deep Navy Blue Header (#003366) */}
      <div className="bg-[#003366] text-white text-xs py-2 px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 border-b border-[#002244]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wide text-xs text-[#FF9933]">
              भारत सरकार
            </span>
            <span className="text-slate-400">|</span>
            <span className="font-semibold text-xs text-white">
              Government of India
            </span>
          </div>
          <span className="hidden md:inline-block text-[11px] bg-white/10 px-2.5 py-0.5 rounded text-slate-200 border border-white/15">
            National e-Governance Interoperability Framework
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5 text-[#138808] bg-white/90 px-2 py-0.5 rounded font-bold shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#138808] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#138808]"></span>
            </span>
            <span className="font-mono text-[10px]">
              {isBackendConnected ? 'Backend API Active (5000)' : `Gateway Active (${metrics.avgLatencyMs}ms)`}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-slate-300 font-mono text-[11px]">
            <span>{metrics.totalRequests.toLocaleString()} Transactions</span>
            <span>•</span>
            <span className="text-[#FF9933] font-bold">{metrics.activeConsentTokens.toLocaleString()} Consents</span>
          </div>
        </div>
      </div>

      {/* 3. Government Blue Navigation Bar (#005A9C) */}
      <div className="bg-[#005A9C] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-17 flex items-center justify-between gap-4">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-white p-0.5 shadow-md">
              <div className="w-full h-full bg-[#003366] rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-[#FF9933]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">
                  Gov<span className="text-[#FF9933]">Sync</span>
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#FF9933] text-[#003366]">
                  Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-200 font-medium hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Center / Right Controls & Persona Switcher */}
          <div className="flex items-center gap-2.5">
            {/* Architecture Flow Visualizer Button */}
            <button
              onClick={() => setIsFlowVisualizerOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer shadow-xs"
              title="Open Live End-to-End Interoperability Architecture Workflow"
            >
              <Layers className="w-4 h-4 text-[#FF9933]" />
              <span>Interop Visualizer</span>
            </button>

            {/* Persona Switcher Buttons */}
            <div className="bg-[#003366] p-1 rounded-xl border border-white/20 flex items-center gap-1 shadow-inner">
              <button
                onClick={() => setActiveRole('CITIZEN')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeRole === 'CITIZEN'
                    ? 'bg-[#FF9933] text-[#003366] shadow-sm'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Citizen</span>
              </button>

              <button
                onClick={() => setActiveRole('OFFICER')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeRole === 'OFFICER'
                    ? 'bg-[#FF9933] text-[#003366] shadow-sm'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Officer</span>
              </button>

              <button
                onClick={() => setActiveRole('ADMIN')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeRole === 'ADMIN'
                    ? 'bg-[#FF9933] text-[#003366] shadow-sm'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Admin Hub</span>
              </button>
            </div>

            {/* Citizen Authentication Widget */}
            {activeRole === 'CITIZEN' && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center gap-2 pl-1">
                    <button
                      onClick={() => {
                        setAuthModalMode('LOGIN');
                        setIsAuthModalOpen(true);
                      }}
                      className="flex items-center gap-2 p-1.5 rounded-xl bg-[#003366] hover:bg-[#002244] border border-white/20 transition-all cursor-pointer text-left shadow-xs"
                      title="Click to view JWT Session & OAuth 2.0 Claims"
                    >
                      <img
                        src={citizenProfile.photoUrl}
                        alt={citizenProfile.fullName}
                        className="w-7 h-7 rounded-lg object-cover border border-[#FF9933]"
                      />
                      <div className="hidden xl:block pr-1.5">
                        <span className="text-xs font-bold text-white block leading-tight">
                          {citizenProfile.fullName.split(' ')[0]}
                        </span>
                        <span className="text-[9px] text-[#138808] bg-white/90 px-1 py-0.2 rounded font-bold">
                          ✓ JWT Valid
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={logout}
                      title="Sign Out of GovSync"
                      className="p-2 rounded-lg bg-[#003366] hover:bg-rose-900/40 text-slate-200 hover:text-rose-300 border border-white/20 transition-colors shadow-xs cursor-pointer"
                      aria-label="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setAuthModalMode('LOGIN');
                        setIsAuthModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg btn-saffron text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Login (OAuth)</span>
                    </button>

                    <button
                      onClick={() => {
                        setAuthModalMode('REGISTER');
                        setIsAuthModalOpen(true);
                      }}
                      className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Register</span>
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Language Selector */}
            <div className="relative flex items-center bg-white text-[#333333] border border-[#D9D9D9] rounded-lg px-2 py-1 text-xs shadow-xs">
              <Globe2 className="w-3.5 h-3.5 text-[#005A9C] mr-1 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="bg-transparent text-[#333333] font-bold focus:outline-none cursor-pointer pr-1"
                aria-label="Select portal language"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
              </select>
            </div>

            {/* Reset Demo Data Button */}
            <button
              onClick={resetAllDemoData}
              title="Reset All Mock Data to Default State"
              className="p-2 rounded-lg bg-[#003366] hover:bg-white/20 text-slate-200 hover:text-[#FF9933] border border-white/20 transition-colors shadow-xs cursor-pointer"
              aria-label="Reset demo state"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
