import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  FileText,
  UserCheck,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { useGovSync } from '../../context/GovSyncContext';
import { ServiceCatalog } from './ServiceCatalog';
import { CitizenProfileManager } from './CitizenProfileManager';
import { CitizenPrivacyVault } from './CitizenPrivacyVault';
import { OneClickApplyModal } from './OneClickApplyModal';
import { ApplicationTrackerModal } from './ApplicationTrackerModal';

export const CitizenDashboard: React.FC = () => {
  const {
    citizenProfile,
    applications,
    consentTokens,
    setSelectedAppForDetail,
    t,
    isAuthenticated,
    setIsAuthModalOpen,
    setAuthModalMode
  } = useGovSync();

  const [activeTab, setActiveTab] = useState<'catalog' | 'applications' | 'profile' | 'privacy'>('catalog');

  const pendingApps = applications.filter(
    (a) => a.status === 'SUBMITTED' || a.status === 'DEPARTMENT_PROCESSING' || a.status === 'GATEWAY_ROUTED'
  );
  const approvedApps = applications.filter((a) => a.status === 'APPROVED');

  return (
    <div className="space-y-8">
      {/* Official Government Hero Banner (#003366 to #005A9C) */}
      <div className="relative rounded-2xl p-6 md:p-8 bg-gradient-to-r from-[#003366] via-[#004780] to-[#005A9C] border border-[#002244] text-white shadow-lg overflow-hidden">
        {/* Tricolor corner watermark */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#FF9933]/15 via-transparent to-[#138808]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF9933]/20 border border-[#FF9933]/40 text-[#FF9933] text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>National Digital Governance Platform</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            Fill Once. Reuse Securely. <br className="hidden sm:inline" />
            <span className="text-[#FF9933]">Access All Government Services.</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-100 leading-relaxed max-w-2xl font-medium">
            Welcome, <strong className="text-white font-bold">{citizenProfile.fullName}</strong>. Your standardized citizen profile enables 1-click scheme enrollment across central & state departments with zero repeated paperwork.
          </p>

          {/* Value metrics row */}
          <div className="grid grid-cols-3 gap-3 pt-3 max-w-xl">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-center shadow-xs">
              <span className="text-lg sm:text-2xl font-black text-[#FF9933] font-mono">60%</span>
              <p className="text-[10px] text-slate-200 font-bold uppercase mt-0.5">{t.effortSaved}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-center shadow-xs">
              <span className="text-lg sm:text-2xl font-black text-[#138808] bg-white/90 px-1.5 py-0.2 rounded font-mono">-80%</span>
              <p className="text-[10px] text-slate-200 font-bold uppercase mt-0.5">{t.dataReduction}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-center shadow-xs">
              <span className="text-lg sm:text-2xl font-black text-white font-mono">+90%</span>
              <p className="text-[10px] text-slate-200 font-bold uppercase mt-0.5">{t.processEfficiency}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Unauthenticated Alert Banner (if logged out) */}
      {!isAuthenticated && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-[#F39C12] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#F39C12] text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-[#003366] tracking-wider">
                Authentication Required for Full Profile & Service Access
              </h4>
              <p className="text-xs text-[#666666] mt-0.5">
                Please authenticate using Aadhaar OTP or DigiLocker OAuth 2.0 to access your protected profile and 1-click enrollments.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setAuthModalMode('LOGIN');
              setIsAuthModalOpen(true);
            }}
            className="px-5 py-2 rounded-xl btn-saffron text-xs font-extrabold shadow-xs whitespace-nowrap cursor-pointer"
          >
            Authenticate Now (OAuth 2.0)
          </button>
        </div>
      )}

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#D9D9D9] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'catalog'
              ? 'bg-[#003366] text-white shadow-sm'
              : 'text-[#666666] hover:text-[#003366] hover:bg-white'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>{t.exploreServices}</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'applications'
              ? 'bg-[#003366] text-white shadow-sm'
              : 'text-[#666666] hover:text-[#003366] hover:bg-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t.myApplications}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white text-[#003366] text-[10px] font-mono font-bold">
            {applications.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-[#003366] text-white shadow-sm'
              : 'text-[#666666] hover:text-[#003366] hover:bg-white'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>{t.oneProfile}</span>
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'privacy'
              ? 'bg-[#003366] text-white shadow-sm'
              : 'text-[#666666] hover:text-[#003366] hover:bg-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{t.dataPrivacy}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-[#138808]/15 text-[#138808] text-[10px] font-mono font-bold border border-[#138808]/30">
            {consentTokens.filter((c) => c.status === 'ACTIVE').length} Active
          </span>
        </button>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'catalog' && <ServiceCatalog />}

      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#333333]">Application Status & History</h2>
            <span className="text-xs text-[#666666] font-medium">
              {pendingApps.length} in progress • {approvedApps.length} approved
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map((app) => {
              const isApproved = app.status === 'APPROVED';
              const isRejected = app.status === 'REJECTED';

              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppForDetail(app)}
                  className="glass-card glass-card-hover rounded-2xl p-5 cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#003366] bg-[#003366]/10 px-2 py-0.5 rounded border border-[#003366]/20">
                        {app.applicationNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isApproved
                            ? 'bg-[#138808]/10 text-[#138808] border-[#138808]/30'
                            : isRejected
                            ? 'bg-[#B22222]/10 text-[#B22222] border-[#B22222]/30'
                            : 'bg-[#F39C12]/10 text-[#F39C12] border-[#F39C12]/30'
                        }`}
                      >
                        ● {app.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#333333] group-hover:text-[#005A9C] transition-colors">
                      {app.serviceName}
                    </h3>
                    <p className="text-[11px] text-[#666666] font-medium">{app.department}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#D9D9D9] flex items-center justify-between text-xs">
                    <span className="text-[#666666] text-[11px] font-medium">
                      Submitted: {new Date(app.submittedAt).toLocaleDateString()}
                    </span>
                    <span className="text-[#005A9C] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      {t.viewDetails} <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'profile' && <CitizenProfileManager />}
      {activeTab === 'privacy' && <CitizenPrivacyVault />}

      {/* Modals */}
      <OneClickApplyModal />
      <ApplicationTrackerModal />
    </div>
  );
};
