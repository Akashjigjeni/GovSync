import React from 'react';
import { Award, Sparkles } from 'lucide-react';
import { useGovSync } from '../../context/GovSyncContext';

export const FloatingJudgeTrigger: React.FC = () => {
  const { setIsJudgeTourOpen } = useGovSync();

  return (
    <div className="fixed bottom-5 left-5 z-40">
      <button
        onClick={() => setIsJudgeTourOpen(true)}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#003366] hover:bg-[#005A9C] text-white border-2 border-[#FF9933] shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
        title="Open Smart India Hackathon Prototype Pitch Deck & Evaluation Guide"
      >
        <div className="p-1 rounded-lg bg-[#FF9933] text-[#003366]">
          <Award className="w-4 h-4 fill-[#003366]" />
        </div>
        <div className="text-left hidden sm:block">
          <span className="text-[10px] font-mono font-bold text-[#FF9933] uppercase block leading-none">
            SIH Prototype Sandbox
          </span>
          <span className="text-xs font-black text-white leading-tight">
            Judge Tour & Scenarios
          </span>
        </div>
        <Sparkles className="w-4 h-4 text-[#FF9933] animate-pulse" />
      </button>
    </div>
  );
};
