import React, { useState } from 'react';
import {
  Search,
  Download
} from 'lucide-react';
import { useGovSync } from '../../context/GovSyncContext';

export const AuditLedgerViewer: React.FC = () => {
  const { auditLogs, addToast } = useGovSync();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesAction = selectedAction === 'ALL' || log.action === selectedAction;
    const matchesSearch =
      log.actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.affectedCitizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.integrityHash.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAction && matchesSearch;
  });

  const handleExportCsv = () => {
    const headers = 'ID,Timestamp,ActorName,ActorRole,Action,Citizen,Details,IPAddress,IntegrityHash\n';
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.actor.name}","${l.actor.role}","${l.action}","${l.affectedCitizenName}","${l.details.replace(/"/g, '""')}","${l.ipAddress}","${l.integrityHash}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GovSync_Audit_Ledger_${Date.now()}.csv`;
    a.click();

    addToast({
      type: 'success',
      title: 'Audit Log Exported',
      message: 'Tamper-evident audit ledger exported as CSV.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail by actor, citizen, hash, or action details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#D9D9D9] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#333333] font-medium placeholder-[#666666] focus:outline-none focus:border-[#005A9C] focus:ring-1 focus:ring-[#005A9C] shadow-xs"
          />
        </div>

        {/* Action Filter */}
        <div className="flex items-center gap-2">
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="bg-white border border-[#D9D9D9] rounded-xl px-3 py-2.5 text-xs text-[#333333] font-bold focus:outline-none focus:border-[#005A9C] shadow-xs cursor-pointer"
          >
            <option value="ALL">All Event Types</option>
            <option value="CONSENT_GRANTED">CONSENT_GRANTED</option>
            <option value="CONSENT_REVOKED">CONSENT_REVOKED</option>
            <option value="DATA_NORMALIZED">DATA_NORMALIZED</option>
            <option value="OFFICER_APPROVED">OFFICER_APPROVED</option>
            <option value="PROFILE_UPDATE">PROFILE_UPDATE</option>
          </select>

          <button
            onClick={handleExportCsv}
            className="px-4 py-2.5 rounded-xl btn-saffron text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#003366] text-white border-b border-[#002244] text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Action Event</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Affected Citizen</th>
                <th className="p-4">Details</th>
                <th className="p-4">Cryptographic Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9D9D9] font-medium text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-[#666666] font-mono whitespace-nowrap font-medium">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                        log.action.includes('APPROVED')
                          ? 'bg-[#138808]/10 text-[#138808] border-[#138808]/30'
                          : log.action.includes('REVOKED')
                          ? 'bg-rose-500/10 text-[#B22222] border-rose-500/30'
                          : log.action.includes('CONSENT')
                          ? 'bg-[#005A9C]/10 text-[#005A9C] border-[#005A9C]/30'
                          : 'bg-[#003366]/10 text-[#003366] border-[#003366]/30'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="text-[#333333] font-bold block">{log.actor.name}</span>
                    <span className="text-[10px] text-[#666666] font-semibold uppercase">{log.actor.role}</span>
                  </td>
                  <td className="p-4 whitespace-nowrap text-[#333333] font-semibold">{log.affectedCitizenName}</td>
                  <td className="p-4 text-[#666666] max-w-xs">{log.details}</td>
                  <td className="p-4 font-mono text-[10px] text-[#F39C12] font-bold whitespace-nowrap">
                    <span className="cursor-help" title={log.integrityHash}>
                      {log.integrityHash.slice(0, 16)}...
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
