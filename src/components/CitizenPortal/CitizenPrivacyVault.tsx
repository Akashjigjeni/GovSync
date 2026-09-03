import React from 'react';
import {
  ShieldCheck,
  Lock,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  FileCode2
} from 'lucide-react';
import { useGovSync } from '../../context/GovSyncContext';

export const CitizenPrivacyVault: React.FC = () => {
  const { consentTokens, revokeConsent, auditLogs, citizenProfile } = useGovSync();

  const citizenLogs = auditLogs.filter((log) => log.affectedCitizenId === citizenProfile.id);

  return (
    <div className="space-y-6">
      {/* Privacy Guarantee Header */}
      <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#333333] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#005A9C]" />
              Citizen Privacy & Consent Center
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#138808]/10 text-[#138808] border border-[#138808]/20">
              Zero-Trust Architecture
            </span>
          </div>
          <p className="text-xs text-[#666666] mt-1 max-w-2xl leading-relaxed font-medium">
            Under India's Digital Personal Data Protection (DPDP) principles, you maintain sovereign control over your profile data. Every department access requires active cryptographic consent and can be revoked instantly.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-[#F7F7F7] border border-[#D9D9D9] text-[#003366]">
            {consentTokens.filter((t) => t.status === 'ACTIVE').length} Active Tokens
          </span>
        </div>
      </div>

      {/* Grid: Active Consents vs Access Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Purpose-Bounded Consents */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#003366] flex items-center justify-between border-b border-[#D9D9D9] pb-3">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#138808]" /> Authorized Data Grants
            </span>
            <span className="text-[11px] font-semibold text-[#666666]">Time-bounded tokens</span>
          </h3>

          <div className="space-y-3">
            {consentTokens.map((token) => {
              const isActive = token.status === 'ACTIVE';

              return (
                <div
                  key={token.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-[#F7F7F7] border-[#D9D9D9] hover:border-[#005A9C]'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#003366]">
                          {token.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isActive
                              ? 'bg-[#138808]/10 text-[#138808] border-[#138808]/30'
                              : 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                          }`}
                        >
                          {token.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#333333] mt-1">{token.serviceName}</h4>
                      <p className="text-[11px] text-[#666666] font-medium">{token.department}</p>
                    </div>

                    {isActive && (
                      <button
                        onClick={() => revokeConsent(token.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                        title="Revoke Data Access Immediately"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Revoke
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-[#333333] mt-2 italic bg-white p-2.5 rounded-lg border border-[#D9D9D9] font-medium">
                    "{token.purpose}"
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#666666] font-mono font-medium">
                    <span>
                      Granted: {new Date(token.grantedAt).toLocaleDateString()}
                    </span>
                    <span>
                      Expires: {new Date(token.expiresAt).toLocaleDateString()} ({token.retentionDays} days)
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#D9D9D9] flex flex-wrap gap-1">
                    {token.sharedFields.map((f) => (
                      <span
                        key={f}
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white text-[#666666] border border-[#D9D9D9]"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Immutable Citizen Access Audit Log */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#005A9C] flex items-center justify-between border-b border-[#D9D9D9] pb-3">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#005A9C]" /> Data Access History & Audit Trail
            </span>
            <span className="text-[11px] font-semibold text-[#666666]">Cryptographically verified</span>
          </h3>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {citizenLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-[#F7F7F7] border border-[#D9D9D9] text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-[#333333] flex items-center gap-1.5">
                    {log.action === 'CONSENT_GRANTED' && <CheckCircle2 className="w-3.5 h-3.5 text-[#138808]" />}
                    {log.action === 'CONSENT_REVOKED' && <XCircle className="w-3.5 h-3.5 text-[#B22222]" />}
                    {log.action === 'OFFICER_APPROVED' && <CheckCircle2 className="w-3.5 h-3.5 text-[#003366]" />}
                    {log.action === 'DATA_NORMALIZED' && <FileCode2 className="w-3.5 h-3.5 text-[#005A9C]" />}
                    {log.action.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-[#666666] font-semibold">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-[#666666] text-[11px] leading-relaxed font-medium">{log.details}</p>

                <div className="flex items-center justify-between text-[10px] text-[#666666] pt-1 font-mono font-medium">
                  <span>Actor: {log.actor.name}</span>
                  <span className="truncate max-w-[120px] text-[#003366]" title={log.integrityHash}>
                    Hash: {log.integrityHash.slice(0, 10)}...
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
