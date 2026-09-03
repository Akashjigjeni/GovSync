import React from 'react';
import { GovSyncProvider, useGovSync } from './context/GovSyncContext';
import { SIHPrototypeBanner } from './components/SIH/SIHPrototypeBanner';
import { Navbar } from './components/Navbar';
import { CitizenDashboard } from './components/CitizenPortal/CitizenDashboard';
import { OfficerDashboard } from './components/OfficerPortal/OfficerDashboard';
import { AdminDashboard } from './components/AdminPortal/AdminDashboard';
import { ToastContainer } from './components/ToastContainer';
import { InteractiveFlowModal } from './components/InteractiveFlowModal';
import { AuthModal } from './components/Auth/AuthModal';
import { JudgeTourModal } from './components/SIH/JudgeTourModal';
import { FloatingJudgeTrigger } from './components/SIH/FloatingJudgeTrigger';
import { ShieldCheck } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeRole, t } = useGovSync();

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#333333] flex flex-col selection:bg-[#FF9933] selection:text-[#003366]">
      {/* 1. SIH Prototype Evaluation Header Banner */}
      <SIHPrototypeBanner />

      {/* 2. Main Official Government Navbar */}
      <Navbar />

      {/* 3. Main Portal Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {activeRole === 'CITIZEN' && <CitizenDashboard />}
        {activeRole === 'OFFICER' && <OfficerDashboard />}
        {activeRole === 'ADMIN' && <AdminDashboard />}
      </main>

      {/* Interactive Global Modals & Evaluation Tools */}
      <AuthModal />
      <JudgeTourModal />
      <InteractiveFlowModal />
      <FloatingJudgeTrigger />
      <ToastContainer />

      {/* Official Government of India Footer */}
      <footer className="mt-auto border-t border-[#D9D9D9] bg-[#003366] text-white py-8 text-xs shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 text-[#FF9933] border border-white/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-extrabold text-base text-white">
                GovSync — National Interoperability Platform
              </p>
              <p className="text-[11px] text-slate-300 mt-0.5 font-medium">
                {t.tagline}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-200 font-medium">
            <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/10">IFEG 2.0 Compliant</span>
            <span>•</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/10">API Setu National Standard</span>
            <span>•</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/10">OGD India Registry</span>
          </div>

          <div className="text-center md:text-right text-[11px] text-slate-300">
            <p className="font-semibold">भारत सरकार | Government of India</p>
            <p className="text-[#FF9933] font-bold mt-0.5">Ministry of Electronics & Information Technology (MeitY)</p>
          </div>
        </div>

        {/* Bottom micro copyright bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-400">
          <p>© 2026 GovSync National Portal. Smart India Hackathon Functional Working Prototype.</p>
          <div className="flex items-center gap-3">
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Privacy Policy (DPDP 2023)</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Hyperlinking Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <GovSyncProvider>
      <AppContent />
    </GovSyncProvider>
  );
}
