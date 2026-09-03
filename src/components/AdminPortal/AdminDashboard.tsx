import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Activity,
  FileCheck2
} from 'lucide-react';
import { useGovSync } from '../../context/GovSyncContext';
import { AdapterStudio } from './AdapterStudio';
import { GatewayTrafficMonitor } from './GatewayTrafficMonitor';
import { AuditLedgerViewer } from './AuditLedgerViewer';

export const AdminDashboard: React.FC = () => {
  const { t } = useGovSync();
  const [activeTab, setActiveTab] = useState<'adapter_studio' | 'gateway_traffic' | 'audit_ledger'>('adapter_studio');

  return (
    <div className="space-y-6">
      {/* Admin Hub Header in Deep Navy (#003366) */}
      <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-[#003366] text-[#FF9933] shadow-md">
            <Cpu className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#333333]">GovSync National Interoperability Center</h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FF9933]/15 text-[#003366] border border-[#FF9933]/30">
                GovSync Core Engine
              </span>
            </div>
            <p className="text-xs text-[#666666] mt-1 font-medium">
              Gateway Routing • Bi-Directional Adapter Framework • IFEG Standard Normalization • Immutable Ledger
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-[#138808]/10 border border-[#138808]/20 text-[#138808] font-bold flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#138808] animate-pulse" />
            Active Gateway Node (01)
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#D9D9D9] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('adapter_studio')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'adapter_studio'
              ? 'bg-[#003366] text-white shadow-sm'
              : 'text-[#666666] hover:text-[#003366] hover:bg-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{t.adapterStudio}</span>
        </button>

        <button
          onClick={() => setActiveTab('gateway_traffic')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'gateway_traffic'
              ? 'bg-[#003366] text-white shadow-sm'
              : 'text-[#666666] hover:text-[#003366] hover:bg-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{t.gatewayMonitor}</span>
        </button>

        <button
          onClick={() => setActiveTab('audit_ledger')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'audit_ledger'
              ? 'bg-[#003366] text-white shadow-sm'
              : 'text-[#666666] hover:text-[#003366] hover:bg-white'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Immutable Audit Ledger</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'adapter_studio' && <AdapterStudio />}
      {activeTab === 'gateway_traffic' && <GatewayTrafficMonitor />}
      {activeTab === 'audit_ledger' && <AuditLedgerViewer />}
    </div>
  );
};
