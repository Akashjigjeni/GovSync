import React, { useState, useEffect } from 'react';
import {
  Activity,
  Zap,
  ShieldCheck,
  Lock,
  Radio,
  Cpu
} from 'lucide-react';
import { useGovSync } from '../../context/GovSyncContext';

interface LiveRequestLog {
  id: string;
  time: string;
  method: 'GET' | 'POST' | 'PUT';
  path: string;
  status: number;
  latencyMs: number;
  department: string;
  consentId: string;
}

export const GatewayTrafficMonitor: React.FC = () => {
  const { metrics } = useGovSync();

  const [liveStream, setLiveStream] = useState<LiveRequestLog[]>([
    {
      id: 'REQ-9921',
      time: '14:38:12',
      method: 'POST',
      path: '/v2/gateway/route/agri/pm-kisan/intake',
      status: 200,
      latencyMs: 24,
      department: 'Dept of Agriculture',
      consentId: 'CST-2026-88192A'
    },
    {
      id: 'REQ-9920',
      time: '14:38:09',
      method: 'POST',
      path: '/v2/gateway/route/transport/sarathi/endorse',
      status: 200,
      latencyMs: 18,
      department: 'Transport (Sarathi)',
      consentId: 'CST-2026-44019B'
    },
    {
      id: 'REQ-9919',
      time: '14:38:02',
      method: 'GET',
      path: '/v2/consents/verify/CST-2026-88192A',
      status: 200,
      latencyMs: 12,
      department: 'GovSync Security Engine',
      consentId: 'CST-2026-88192A'
    },
    {
      id: 'REQ-9918',
      time: '14:37:55',
      method: 'POST',
      path: '/v2/adapters/normalize/nic-pds-batch',
      status: 200,
      latencyMs: 31,
      department: 'Food & Public Distribution',
      consentId: 'CST-2026-11094C'
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const endpoints = [
        { path: '/v2/gateway/route/education/nsp-merit', dept: 'Higher Education' },
        { path: '/v2/gateway/route/revenue/udyam-msme', dept: 'Ministry of MSME' },
        { path: '/v2/gateway/route/health/pmjay-golden', dept: 'National Health Authority' },
        { path: '/v2/consents/validate-token', dept: 'Security Gateway' }
      ];
      const selected = endpoints[Math.floor(Math.random() * endpoints.length)];
      const randLat = Math.floor(15 + Math.random() * 30);
      const randReqId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;

      const newLog: LiveRequestLog = {
        id: randReqId,
        time: new Date().toLocaleTimeString(),
        method: 'POST',
        path: selected.path,
        status: 200,
        latencyMs: randLat,
        department: selected.dept,
        consentId: `CST-2026-${Math.floor(10000 + Math.random() * 90000)}`
      };

      setLiveStream((prev) => [newLog, ...prev.slice(0, 7)]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#666666] text-xs mb-2 font-semibold">
            <span>Total API Traffic</span>
            <Activity className="w-4 h-4 text-[#003366]" />
          </div>
          <span className="text-2xl font-black text-[#333333] font-mono">
            {metrics.totalRequests.toLocaleString()}
          </span>
          <p className="text-[11px] text-[#138808] font-bold mt-1">
            ↑ 99.2% Uptime (Zero Failure)
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#666666] text-xs mb-2 font-semibold">
            <span>Average Gateway Latency</span>
            <Zap className="w-4 h-4 text-[#F39C12]" />
          </div>
          <span className="text-2xl font-black text-[#F39C12] font-mono">
            {metrics.avgLatencyMs} ms
          </span>
          <p className="text-[11px] text-[#666666] font-medium mt-1">Sub-50ms National SLA</p>
        </div>

        <div className="glass-card rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#666666] text-xs mb-2 font-semibold">
            <span>Active Consent Tokens</span>
            <Lock className="w-4 h-4 text-[#138808]" />
          </div>
          <span className="text-2xl font-black text-[#138808] font-mono">
            {metrics.activeConsentTokens.toLocaleString()}
          </span>
          <p className="text-[11px] text-[#666666] font-medium mt-1">DPDP 2023 Compliant</p>
        </div>

        <div className="glass-card rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#666666] text-xs mb-2 font-semibold">
            <span>Legacy Transformations</span>
            <Cpu className="w-4 h-4 text-[#005A9C]" />
          </div>
          <span className="text-2xl font-black text-[#005A9C] font-mono">
            {metrics.legacyTransformations.toLocaleString()}
          </span>
          <p className="text-[11px] text-[#666666] font-medium mt-1">SOAP/XML & Batch Adapters</p>
        </div>
      </div>

      {/* Live Gateway Ingress Feed */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#D9D9D9] pb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#138808] animate-pulse" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#333333]">
              Real-Time National API Gateway Ingress Stream
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#666666] font-semibold">
            Node: IN-WEST-PUNE-01 (Active)
          </span>
        </div>

        <div className="space-y-2">
          {liveStream.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-xl bg-[#F7F7F7] border border-[#D9D9D9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#005A9C]/10 text-[#005A9C] border border-[#005A9C]/20">
                  {log.method}
                </span>
                <span className="font-mono text-[#333333] font-bold">{log.path}</span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#666666] font-mono">
                <span className="font-bold text-[#003366]">{log.department}</span>
                <span className="text-[#005A9C] font-semibold">{log.consentId}</span>
                <span className="text-[#F39C12] font-bold">{log.latencyMs}ms</span>
                <span className="text-[#138808] font-bold">HTTP {log.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Frameworks Badge Row */}
      <div className="p-4 rounded-2xl bg-white border border-[#D9D9D9] flex flex-wrap items-center justify-between gap-4 text-xs shadow-xs">
        <div className="flex items-center gap-2 text-[#333333] font-bold">
          <ShieldCheck className="w-4 h-4 text-[#138808]" />
          <span>Interoperability Standards Compliance:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] font-bold">
          <span className="px-2.5 py-1 rounded-lg bg-[#003366]/10 border border-[#003366]/20 text-[#003366]">
            ✓ IFEG 2.0 Framework
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#005A9C]/10 border border-[#005A9C]/20 text-[#005A9C]">
            ✓ API Setu Open Standard
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#FF9933]/15 border border-[#FF9933]/30 text-[#003366]">
            ✓ OGD Data Catalog
          </span>
        </div>
      </div>
    </div>
  );
};
