import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Smartphone,
  Key,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  User,
  MapPin,
  Landmark,
  Eye,
  FileCode2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useGovSync } from '../../context/GovSyncContext';
import { CitizenProfile, AuthMethod } from '../../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    citizenProfile
  } = useGovSync();

  // Mode: 'LOGIN' | 'REGISTER'
  const [activeAuthTab, setActiveAuthTab] = useState<'LOGIN' | 'REGISTER'>(authModalMode);

  // Login States
  const [loginMethod, setLoginMethod] = useState<AuthMethod>('AADHAAR_OTP');
  const [aadhaarInput, setAadhaarInput] = useState<string>('9812-4819-2026');
  const [phoneInput, setPhoneInput] = useState<string>('+91 98765 43210');
  const [passwordInput, setPasswordInput] = useState<string>('GovSync@2026');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>('481920');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showJwtPreview, setShowJwtPreview] = useState<boolean>(false);

  // Registration Multi-step Form State
  const [regStep, setRegStep] = useState<number>(1);
  const [regForm, setRegForm] = useState<CitizenProfile>({
    id: `CIT-IN-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    aadhaarNumber: 'XXXX-XXXX-7721',
    fullName: 'Rohan Deshmukh',
    fatherName: 'Anil Deshmukh',
    dob: '1998-05-12',
    gender: 'Male',
    phone: '+91 98231 55410',
    email: 'rohan.deshmukh@example.com',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    address: {
      street: 'Flat 302, Sai Residency',
      villageTown: 'Haveli',
      district: 'Pune',
      state: 'Maharashtra',
      pincode: '411041'
    },
    demographics: {
      category: 'General',
      annualIncome: 350000,
      occupation: 'Software & Agri-Tech Consultant'
    },
    verifiedCredentials: {
      digiLockerId: 'DL-ROHAN-7721',
      panNumber: 'BNMPD4812L',
      bankAccount: {
        accountNumber: '60218492019482',
        ifsc: 'MAHB0000123',
        bankName: 'Bank of Maharashtra',
        branch: 'Kothrud, Pune'
      },
      landRecordId: 'MH-ROR-7/12-HAV-11029',
      landAreaAcres: 2.0,
      highestEducation: 'Bachelor of Technology',
      passingYear: '2020',
      collegeName: 'Pune Institute of Computer Technology',
      disabilityStatus: false
    },
    updatedAt: new Date().toISOString()
  });

  if (!isAuthModalOpen) return null;

  const handleSendOtp = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setOtpSent(true);
      setOtpValue('481920'); // Pre-fill mock OTP for smooth testing
    }, 600);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 700));
    login(loginMethod, citizenProfile);
    setIsProcessing(false);
    setIsAuthModalOpen(false);
  };

  const handleDigiLockerOauth = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 900));
    login('DIGILOCKER_OAUTH', citizenProfile);
    setIsProcessing(false);
    setIsAuthModalOpen(false);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regStep < 3) {
      setRegStep((prev) => prev + 1);
      return;
    }

    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 900));
    register(regForm);
    setIsProcessing(false);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-[#D9D9D9] rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header in Deep Navy Blue (#003366) */}
        <div className="p-5 border-b border-[#D9D9D9] bg-[#003366] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 text-[#FF9933] border border-white/20">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FF9933] text-[#003366] px-2 py-0.5 rounded">
                OAuth 2.0 & JWT Security
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Citizen Authentication Desk
              </h3>
              <p className="text-xs text-slate-200">
                Single Sign-On for all integrated government services
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="px-6 border-b border-[#D9D9D9] bg-[#F7F7F7] flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-bold">
            <button
              onClick={() => setActiveAuthTab('LOGIN')}
              className={`py-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-all ${
                activeAuthTab === 'LOGIN'
                  ? 'border-[#005A9C] text-[#005A9C]'
                  : 'border-transparent text-[#666666] hover:text-[#005A9C]'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>Citizen Login (OAuth 2.0)</span>
            </button>

            <button
              onClick={() => setActiveAuthTab('REGISTER')}
              className={`py-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-all ${
                activeAuthTab === 'REGISTER'
                  ? 'border-[#005A9C] text-[#005A9C]'
                  : 'border-transparent text-[#666666] hover:text-[#005A9C]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>New Registration (Create Profile)</span>
            </button>
          </div>

          <button
            onClick={() => setShowJwtPreview(!showJwtPreview)}
            className="text-[11px] font-mono font-bold text-[#005A9C] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>{showJwtPreview ? 'Hide JWT Claims' : 'Inspect JWT Claims'}</span>
          </button>
        </div>

        {/* JWT Claims Live Visualizer (if toggled) */}
        {showJwtPreview && (
          <div className="p-4 bg-[#1E293B] border-b border-[#D9D9D9] text-xs font-mono text-emerald-400 overflow-x-auto max-h-48 shadow-inner">
            <div className="flex items-center justify-between text-slate-300 text-[10px] pb-1 border-b border-slate-700 mb-2">
              <span>Standard RFC-7519 JSON Web Token (RS256 Algorithm)</span>
              <span>Issuer: govsync.gov.in</span>
            </div>
            <pre>
              {JSON.stringify(
                {
                  header: { alg: "RS256", typ: "JWT", kid: "GOVSYNC-KEY-2026-01" },
                  payload: {
                    iss: "https://auth.govsync.gov.in",
                    sub: citizenProfile.id,
                    name: citizenProfile.fullName,
                    role: "CITIZEN",
                    aadhaar_masked: citizenProfile.aadhaarNumber,
                    scopes: ["PROFILE_READ", "CONSENT_GRANT", "SERVICE_APPLY", "DIGILOCKER_SYNC"],
                    iat: Math.floor(Date.now() / 1000),
                    exp: Math.floor(Date.now() / 1000) + 86400,
                    jti: "jwt-sec-991824a"
                  },
                  signature: "HMACSHA256(base64UrlEncode(header) + '.' + base64UrlEncode(payload))"
                },
                null,
                2
              )}
            </pre>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeAuthTab === 'LOGIN' ? (
            <div className="space-y-6">
              {/* DigiLocker Single Sign-On Primary Button */}
              <div className="p-4 rounded-xl bg-[#005A9C]/10 border border-[#005A9C]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#005A9C] text-white">
                    <ShieldCheck className="w-6 h-6 text-[#FF9933]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#003366] uppercase tracking-wider">
                      DigiLocker / MeriPehchaan SSO
                    </h4>
                    <p className="text-[11px] text-[#666666]">
                      Instant biometric / Aadhaar-linked OAuth 2.0 verification
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDigiLockerOauth}
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl bg-[#003366] hover:bg-[#005A9C] text-white text-xs font-bold shadow-sm flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <Key className="w-4 h-4 text-[#FF9933]" />
                  <span>Login with DigiLocker</span>
                </button>
              </div>

              {/* Or Divider */}
              <div className="flex items-center gap-3 text-xs text-[#666666]">
                <div className="h-px bg-[#D9D9D9] flex-1" />
                <span className="uppercase font-bold text-[10px]">Or Authenticate via Portal Credentials</span>
                <div className="h-px bg-[#D9D9D9] flex-1" />
              </div>

              {/* Login Method Radio Options */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setLoginMethod('AADHAAR_OTP')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 cursor-pointer transition-all ${
                    loginMethod === 'AADHAAR_OTP'
                      ? 'bg-[#003366]/10 border-[#003366] text-[#003366] font-bold'
                      : 'bg-white border-[#D9D9D9] text-[#666666]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-[#FF9933]" />
                  <span>Aadhaar Number + OTP</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLoginMethod('PASSWORD_OTP')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 cursor-pointer transition-all ${
                    loginMethod === 'PASSWORD_OTP'
                      ? 'bg-[#003366]/10 border-[#003366] text-[#003366] font-bold'
                      : 'bg-white border-[#D9D9D9] text-[#666666]'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-[#005A9C]" />
                  <span>Phone & Password</span>
                </button>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginMethod === 'AADHAAR_OTP' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-[#333333] mb-1">
                        Aadhaar Number / Virtual ID (12 Digits)
                      </label>
                      <input
                        type="text"
                        value={aadhaarInput}
                        onChange={(e) => setAadhaarInput(e.target.value)}
                        placeholder="XXXX-XXXX-4819"
                        required
                        className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3.5 py-2.5 text-xs text-[#333333] font-mono font-bold focus:outline-none focus:border-[#005A9C] shadow-xs"
                      />
                    </div>

                    {!otpSent ? (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isProcessing}
                        className="w-full py-2.5 px-4 rounded-xl btn-saffron text-xs font-extrabold shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isProcessing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Smartphone className="w-4 h-4" />
                        )}
                        <span>Send Aadhaar OTP</span>
                      </button>
                    ) : (
                      <div className="space-y-3 p-4 rounded-xl bg-[#F7F7F7] border border-[#D9D9D9] animate-in fade-in">
                        <div className="flex items-center justify-between text-xs text-[#138808] font-bold">
                          <span>✓ OTP sent to Aadhaar-linked phone (**4210)</span>
                          <span className="font-mono text-[10px] text-[#666666]">Valid: 10 mins</span>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#333333] mb-1">
                            Enter 6-Digit OTP
                          </label>
                          <input
                            type="text"
                            value={otpValue}
                            onChange={(e) => setOtpValue(e.target.value)}
                            maxLength={6}
                            required
                            className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3.5 py-2.5 text-center text-base font-mono tracking-widest font-bold text-[#003366] focus:outline-none focus:border-[#005A9C] shadow-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-[#333333] mb-1">
                        Registered Mobile Number
                      </label>
                      <input
                        type="text"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="+91 98765 43210"
                        required
                        className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3.5 py-2.5 text-xs text-[#333333] font-bold focus:outline-none focus:border-[#005A9C] shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#333333] mb-1">
                        Citizen Password
                      </label>
                      <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        required
                        className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3.5 py-2.5 text-xs text-[#333333] font-bold focus:outline-none focus:border-[#005A9C] shadow-xs"
                      />
                    </div>
                  </div>
                )}

                {(otpSent || loginMethod === 'PASSWORD_OTP') && (
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#003366] hover:bg-[#005A9C] text-white text-xs font-extrabold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-[#FF9933]" />
                    )}
                    <span>Verify & Generate JWT Session Token</span>
                  </button>
                )}
              </form>
            </div>
          ) : (
            /* REGISTRATION FORM (CREATE ONE PROFILE) */
            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              {/* Steps Progress */}
              <div className="grid grid-cols-3 gap-2 pb-2">
                <div
                  className={`p-2 rounded-lg border text-center text-[10px] font-bold ${
                    regStep >= 1
                      ? 'bg-[#005A9C] text-white border-[#005A9C]'
                      : 'bg-[#F7F7F7] text-[#666666] border-[#D9D9D9]'
                  }`}
                >
                  1. Identity & Aadhaar
                </div>
                <div
                  className={`p-2 rounded-lg border text-center text-[10px] font-bold ${
                    regStep >= 2
                      ? 'bg-[#005A9C] text-white border-[#005A9C]'
                      : 'bg-[#F7F7F7] text-[#666666] border-[#D9D9D9]'
                  }`}
                >
                  2. Address & Residence
                </div>
                <div
                  className={`p-2 rounded-lg border text-center text-[10px] font-bold ${
                    regStep >= 3
                      ? 'bg-[#005A9C] text-white border-[#005A9C]'
                      : 'bg-[#F7F7F7] text-[#666666] border-[#D9D9D9]'
                  }`}
                >
                  3. DBT Bank Account
                </div>
              </div>

              {regStep === 1 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[#666666] font-semibold mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        value={regForm.fullName}
                        onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                        required
                        className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-[#333333] font-bold focus:outline-none focus:border-[#005A9C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#666666] font-semibold mb-1">Father's / Guardian Name</label>
                      <input
                        type="text"
                        value={regForm.fatherName}
                        onChange={(e) => setRegForm({ ...regForm, fatherName: e.target.value })}
                        required
                        className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-[#333333] font-bold focus:outline-none focus:border-[#005A9C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#666666] font-semibold mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={regForm.dob}
                        onChange={(e) => setRegForm({ ...regForm, dob: e.target.value })}
                        required
                        className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-[#333333] font-bold focus:outline-none focus:border-[#005A9C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#666666] font-semibold mb-1">Mobile Phone (Aadhaar-Linked)</label>
                      <input
                        type="text"
                        value={regForm.phone}
                        onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                        required
                        className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-[#333333] font-bold focus:outline-none focus:border-[#005A9C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#666666] font-semibold mb-1">Email Address</label>
                      <input
                        type="email"
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        required
                        className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-[#333333] font-bold focus:outline-none focus:border-[#005A9C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#666666] font-semibold mb-1">PAN Number</label>
                      <input
                        type="text"
                        value={regForm.verifiedCredentials.panNumber}
                        onChange={(e) =>
                          setRegForm({
                            ...regForm,
                            verifiedCredentials: { ...regForm.verifiedCredentials, panNumber: e.target.value }
                          })
                        }
                        className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-[#333333] font-mono font-bold focus:outline-none focus:border-[#005A9C]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {regStep === 2 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-[#666666] font-semibold mb-1">Street / House / Landmark</label>
                      <input
                        type="text"
                        value={regForm.address.street}
                        onChange={(e) =>
                          setRegForm({ ...regForm, address: { ...regForm.address, street: e.target.value } })
                        }
                        required
                        className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-[#333333] font-bold focus:outline-none focus:border-[#005A9C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#666666] font-semibold mb-1">Village / Taluka</label>
                      <input
                        type="text"
                        value={regForm.address.villageTown}
                        onChange={(e) =>
                          setRegForm({ ...regForm, address: { ...regForm.address, villageTown: e.target.value } })
                        }
                        required
                        className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-[#333333] font-bold focus:outline-none focus:border-[#005A9C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#666666] font-semibold mb-1">District</label>
                      <input
                        type="text"
                        value={regForm.address.district}
                        onChange={(e) =>
                          setRegForm({ ...regForm, address: { ...regForm.address, district: e.target.value } })
                        }
                        required
                        className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-[#333333] font-bold focus:outline-none focus:border-[#005A9C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#666666] font-semibold mb-1">State</label>
                      <input
                        type="text"
                        value={regForm.address.state}
                        onChange={(e) =>
                          setRegForm({ ...regForm, address: { ...regForm.address, state: e.target.value } })
                        }
                        required
                        className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-[#333333] font-bold focus:outline-none focus:border-[#005A9C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#666666] font-semibold mb-1">Pincode</label>
                      <input
                        type="text"
                        value={regForm.address.pincode}
                        onChange={(e) =>
                          setRegForm({ ...regForm, address: { ...regForm.address, pincode: e.target.value } })
                        }
                        required
                        className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-[#333333] font-bold focus:outline-none focus:border-[#005A9C]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {regStep === 3 && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#138808]/10 border border-[#138808]/20 text-xs text-[#138808] font-bold">
                    ✓ Direct Benefit Transfer (DBT) Direct Bank Verification
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[#666666] font-semibold mb-1">Bank Name</label>
                      <input
                        type="text"
                        value={regForm.verifiedCredentials.bankAccount.bankName}
                        onChange={(e) =>
                          setRegForm({
                            ...regForm,
                            verifiedCredentials: {
                              ...regForm.verifiedCredentials,
                              bankAccount: { ...regForm.verifiedCredentials.bankAccount, bankName: e.target.value }
                            }
                          })
                        }
                        required
                        className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-[#333333] font-bold focus:outline-none focus:border-[#005A9C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#666666] font-semibold mb-1">Account Number</label>
                      <input
                        type="text"
                        value={regForm.verifiedCredentials.bankAccount.accountNumber}
                        onChange={(e) =>
                          setRegForm({
                            ...regForm,
                            verifiedCredentials: {
                              ...regForm.verifiedCredentials,
                              bankAccount: { ...regForm.verifiedCredentials.bankAccount, accountNumber: e.target.value }
                            }
                          })
                        }
                        required
                        className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-[#333333] font-mono font-bold focus:outline-none focus:border-[#005A9C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#666666] font-semibold mb-1">IFSC Code</label>
                      <input
                        type="text"
                        value={regForm.verifiedCredentials.bankAccount.ifsc}
                        onChange={(e) =>
                          setRegForm({
                            ...regForm,
                            verifiedCredentials: {
                              ...regForm.verifiedCredentials,
                              bankAccount: { ...regForm.verifiedCredentials.bankAccount, ifsc: e.target.value }
                            }
                          })
                        }
                        required
                        className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-[#333333] font-mono font-bold focus:outline-none focus:border-[#005A9C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#666666] font-semibold mb-1">Branch Name</label>
                      <input
                        type="text"
                        value={regForm.verifiedCredentials.bankAccount.branch}
                        onChange={(e) =>
                          setRegForm({
                            ...regForm,
                            verifiedCredentials: {
                              ...regForm.verifiedCredentials,
                              bankAccount: { ...regForm.verifiedCredentials.bankAccount, branch: e.target.value }
                            }
                          })
                        }
                        required
                        className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-[#333333] font-bold focus:outline-none focus:border-[#005A9C]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Form Navigation Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-[#D9D9D9]">
                {regStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setRegStep((prev) => prev - 1)}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-xs font-bold text-[#666666] border border-[#D9D9D9] cursor-pointer"
                  >
                    Previous
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-xl btn-saffron text-xs font-extrabold shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : regStep < 3 ? (
                    <>
                      <span>Next Step</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#003366]" />
                      <span>Complete Registration & Issue JWT</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#D9D9D9] bg-[#F7F7F7] flex items-center justify-between text-xs text-[#666666]">
          <span>Protected under Digital Personal Data Protection (DPDP) Act 2023</span>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="text-xs font-bold text-[#005A9C] hover:underline cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
