import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Clock,
  Filter,
  Stamp
} from 'lucide-react';
import { useGovSync } from '../../context/GovSyncContext';
import { ServiceApplication } from '../../types';
import { OfficerReviewModal } from './OfficerReviewModal';

export const OfficerDashboard: React.FC = () => {
  const { applications } = useGovSync();
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedAppForReview, setSelectedAppForReview] = useState<ServiceApplication | null>(null);
  const officerName = 'Dr. Priya Verma (District Officer)';

  const departments = [
    'ALL',
    'Department of Agriculture & Farmers Welfare',
    'Department of Higher Education',
    'Transport Department (Sarathi)',
    'Department of Food & Public Distribution',
    'Ministry of MSME'
  ];

  const filteredApps = applications.filter((app) => {
    return selectedDepartment === 'ALL' || app.department === selectedDepartment;
  });

  const pendingCount = filteredApps.filter((a) => a.status === 'DEPARTMENT_PROCESSING' || a.status === 'SUBMITTED').length;
  const approvedCount = filteredApps.filter((a) => a.status === 'APPROVED').length;

  return (
    <div className="space-y-6">
      {/* Officer Header Card in Deep Navy Blue (#003366) */}
      <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-[#003366] text-white shadow-md">
            <Building2 className="w-7 h-7 text-[#FF9933]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#333333]">Department Processing & Sanction Portal</h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#005A9C]/10 text-[#005A9C] border border-[#005A9C]/20">
                RBAC: Officer Desk
              </span>
            </div>
            <p className="text-xs text-[#666666] mt-1 font-medium">
              Active Officer: <strong className="text-[#003366] font-bold">{officerName}</strong> • Digital Signature Token Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-[#F7F7F7] border border-[#D9D9D9] text-xs flex items-center gap-2 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-[#F39C12]" />
            <span className="text-[#666666] font-medium">Pending Review: <strong className="text-[#F39C12] font-bold font-mono">{pendingCount}</strong></span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#F7F7F7] border border-[#D9D9D9] text-xs flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#138808]" />
            <span className="text-[#666666] font-medium">Approved: <strong className="text-[#138808] font-bold font-mono">{approvedCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Filter and Queue Selection */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
          <Filter className="w-4 h-4 text-[#666666] shrink-0" />
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedDepartment === dept
                  ? 'bg-[#005A9C] text-white shadow-xs'
                  : 'bg-white text-[#666666] hover:text-[#005A9C] border border-[#D9D9D9] shadow-xs'
              }`}
            >
              {dept === 'ALL' ? 'All Departments' : dept.split(' ')[0] + ' ' + (dept.split(' ')[1] || '')}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Queue Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredApps.map((app) => {
          const isPending = app.status === 'DEPARTMENT_PROCESSING' || app.status === 'SUBMITTED';
          const isApproved = app.status === 'APPROVED';

          return (
            <div
              key={app.id}
              className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#003366] bg-[#003366]/10 px-2 py-0.5 rounded border border-[#003366]/20">
                    {app.applicationNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      isApproved
                        ? 'bg-[#138808]/10 text-[#138808] border-[#138808]/30'
                        : isPending
                        ? 'bg-[#F39C12]/10 text-[#F39C12] border-[#F39C12]/30'
                        : 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                    }`}
                  >
                    ● {app.status.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#333333]">{app.serviceName}</h3>
                  <p className="text-[11px] text-[#666666] font-medium">{app.department}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#F7F7F7] border border-[#D9D9D9] text-xs space-y-1">
                  <div className="flex items-center justify-between text-[#666666]">
                    <span className="font-medium">Beneficiary:</span>
                    <strong className="text-[#333333] font-bold">{app.citizenName}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[#666666] text-[11px]">
                    <span>Consent Ref:</span>
                    <span className="font-mono font-bold text-[#005A9C]">{app.consentTokenId}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#666666] text-[11px]">
                    <span>Submitted On:</span>
                    <span className="font-mono font-semibold">{new Date(app.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#D9D9D9] flex items-center justify-between">
                <span className="text-[11px] text-[#666666] font-medium">
                  {app.approvedBy ? `Approved by ${app.approvedBy}` : 'Awaiting officer action'}
                </span>

                <button
                  onClick={() => setSelectedAppForReview(app)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isPending
                      ? 'btn-saffron shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-[#333333] border border-[#D9D9D9] shadow-xs'
                  }`}
                >
                  <Stamp className="w-3.5 h-3.5" />
                  <span>{isPending ? 'Review & Sanction' : 'View Decision Audit'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Review Modal */}
      <OfficerReviewModal
        application={selectedAppForReview}
        onClose={() => setSelectedAppForReview(null)}
        officerName={officerName}
      />
    </div>
  );
};
