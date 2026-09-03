import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  CheckSquare,
  Square,
  Key,
  Sparkles,
  ArrowRight,
  Building2,
  Cpu,
  CheckCircle2,
  Award,
  Eye,
  EyeOff,
  Smartphone
} from 'lucide-react';
import { useGovSync } from '../../context/GovSyncContext';

export const CitizenLoginPage: React.FC = () => {
  const { login, setActiveRole, citizenProfile } = useGovSync();

  // Form State
  const [username, setUsername] = useState<string>('aarav.sharma');
  const [password, setPassword] = useState<string>('GovSync@2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [hasConsent, setHasConsent] = useState<boolean>(true);
  const [selectedRoleType, setSelectedRoleType] = useState<'CITIZEN' | 'OFFICER' | 'ADMIN'>('CITIZEN');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 1-Click Quick Fill Preset handler for SIH Presentation
  const handleSelectPreset = (role: 'CITIZEN' | 'OFFICER' | 'ADMIN') => {
    setSelectedRoleType(role);
    setErrorMessage('');
    if (role === 'CITIZEN') {
      setUsername('aarav.sharma');
      setPassword('GovSync@2026');
    } else if (role === 'OFFICER') {
      setUsername('officer.rajesh');
      setPassword('Officer@2026');
    } else if (role === 'ADMIN') {
      setUsername('admin.nic');
      setPassword('Admin@2026');
    }
  };

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    if (!hasConsent) {
      setErrorMessage('Please accept the DPDP Act 2023 consent checkbox to proceed.');
      return;
    }

    setIsLoading(true);
    try {
      setActiveRole(selectedRoleType);
      await login('PASSWORD', {
        username,
        password,
        consentAccepted: hasConsent
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col justify-between selection:bg-[#FF9933] selection:text-[#003366]">
      {/* Top Official Tricolor Stripe */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      {/* Top Header Bar */}
      <header className="bg-[#003366] text-white py-3.5 px-4 sm:px-8 border-b border-[#002244] shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 text-[#FF9933] border border-white/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-black text-white leading-tight">
                GovSync — National Interoperability Platform
              </h1>
              <p className="text-[11px] text-slate-300 font-medium">
                भारत सरकार | Ministry of Electronics & Information Technology (MeitY)
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FF9933] text-xs font-bold border border-white/15">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF9933]" />
            <span>National Interoperability Gateway</span>
          </div>
        </div>
      </header>

      {/* Main Authentication Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-xl w-full bg-white rounded-3xl border border-[#D9D9D9] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          {/* Card Header */}
          <div className="bg-[#005A9C] text-white p-6 text-center relative">
            <div className="w-16 h-16 rounded-2xl bg-white text-[#003366] mx-auto flex items-center justify-center shadow-lg mb-3 border-2 border-[#FF9933]">
              <Lock className="w-8 h-8 text-[#003366]" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Sign In to GovSync
            </h2>
            <p className="text-xs text-slate-200 mt-1 font-medium">
              «Fill Once. Reuse Securely. Access Multiple Government Services.»
            </p>

            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-[11px] font-mono border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>OAuth 2.0 & RFC-7519 JWT Verified Gateway</span>
            </div>
          </div>

          {/* Preset Demo Role Switcher */}
          <div className="p-6 bg-[#F7F7F7] border-b border-[#D9D9D9]">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-extrabold text-[#333333] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" />
                <span>1-Click Verified Role Accounts:</span>
              </span>
              <span className="text-[10px] font-mono text-[#666666]">Pre-saved in Registry</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectPreset('CITIZEN')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedRoleType === 'CITIZEN'
                    ? 'bg-white border-[#005A9C] shadow-sm ring-2 ring-[#005A9C]/20'
                    : 'bg-white/60 border-[#D9D9D9] hover:bg-white text-[#666666]'
                }`}
              >
                <div className="flex items-center justify-center gap-1 text-xs font-black text-[#005A9C]">
                  <User className="w-3.5 h-3.5" />
                  <span>Citizen</span>
                </div>
                <p className="text-[10px] text-[#666666] font-mono mt-0.5">aarav.sharma</p>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('OFFICER')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedRoleType === 'OFFICER'
                    ? 'bg-white border-[#003366] shadow-sm ring-2 ring-[#003366]/20'
                    : 'bg-white/60 border-[#D9D9D9] hover:bg-white text-[#666666]'
                }`}
              >
                <div className="flex items-center justify-center gap-1 text-xs font-black text-[#003366]">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Officer</span>
                </div>
                <p className="text-[10px] text-[#666666] font-mono mt-0.5">officer.rajesh</p>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('ADMIN')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedRoleType === 'ADMIN'
                    ? 'bg-white border-[#FF9933] shadow-sm ring-2 ring-[#FF9933]/20'
                    : 'bg-white/60 border-[#D9D9D9] hover:bg-white text-[#666666]'
                }`}
              >
                <div className="flex items-center justify-center gap-1 text-xs font-black text-[#003366]">
                  <Cpu className="w-3.5 h-3.5 text-[#FF9933]" />
                  <span>Admin</span>
                </div>
                <p className="text-[10px] text-[#666666] font-mono mt-0.5">admin.nic</p>
              </button>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSignIn} className="p-6 sm:p-8 space-y-5">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#333333] flex items-center justify-between">
                <span>Username / Citizen ID / Mobile</span>
                <span className="text-[10px] font-mono text-[#666666]">Pre-saved in Registry</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. aarav.sharma or 9876543210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D9D9D9] bg-white text-xs font-semibold text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#005A9C] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#333333] flex items-center justify-between">
                <span>Security Password</span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold">Default: GovSync@2026</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#D9D9D9] bg-white text-xs font-semibold text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#005A9C] focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Mandatory DPDP Act 2023 Consent Checkbox */}
            <div
              onClick={() => setHasConsent(!hasConsent)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                hasConsent
                  ? 'bg-emerald-50/60 border-emerald-300 text-[#333333]'
                  : 'bg-amber-50/60 border-amber-300 text-amber-900'
              }`}
            >
              <div className="mt-0.5 shrink-0 text-[#138808]">
                {hasConsent ? (
                  <CheckSquare className="w-5 h-5 text-[#138808]" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div className="text-xs space-y-1">
                <p className="font-extrabold text-[#333333] leading-snug">
                  I give consent under Section 6 of the Digital Personal Data Protection (DPDP) Act, 2023
                </p>
                <p className="text-[11px] text-[#666666] leading-relaxed">
                  I authorize GovSync to authenticate my identity with verified central registries (DigiLocker, PFMS) and generate a purpose-bounded, tamper-evident RFC-7519 JWT session token.
                </p>
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading || !hasConsent}
              className="w-full py-3.5 px-6 rounded-2xl btn-saffron text-sm font-black shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <span>Verifying & Issuing JWT Token...</span>
              ) : (
                <>
                  <span>Sign In & Enter GovSync Portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Quick Info Credentials Box for Presentation Judges */}
          <div className="p-4 bg-[#F7F7F7] border-t border-[#D9D9D9] text-[11px] text-[#666666]">
            <p className="font-bold text-[#333333] mb-1">
              🔑 Pre-saved Demo Credentials Summary for Presentation:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-mono">
              <div className="bg-white p-2 rounded-lg border border-[#D9D9D9]">
                <span className="font-bold text-[#005A9C]">Citizen:</span> aarav.sharma<br />
                <span className="text-slate-500">Pass:</span> GovSync@2026
              </div>
              <div className="bg-white p-2 rounded-lg border border-[#D9D9D9]">
                <span className="font-bold text-[#003366]">Officer:</span> officer.rajesh<br />
                <span className="text-slate-500">Pass:</span> Officer@2026
              </div>
              <div className="bg-white p-2 rounded-lg border border-[#D9D9D9]">
                <span className="font-bold text-[#FF9933]">Admin:</span> admin.nic<br />
                <span className="text-slate-500">Pass:</span> Admin@2026
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Bottom Footer */}
      <footer className="bg-[#003366] text-slate-300 py-3 px-4 text-center text-[11px] border-t border-[#001830]">
        <p>भारत सरकार | Government of India • IFEG 2.0 & DPDP Act 2023 Compliant Gateway</p>
      </footer>
    </div>
  );
};
