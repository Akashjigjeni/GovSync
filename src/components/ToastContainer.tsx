import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useGovSync } from '../context/GovSyncContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useGovSync();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <Info className="w-5 h-5 text-[#005A9C] shrink-0" />;
        let borderColor = 'border-[#005A9C]/40';
        let bgStyle = 'bg-white text-[#333333]';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-[#138808] shrink-0" />;
          borderColor = 'border-[#138808]/40';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-[#FF9933] shrink-0" />;
          borderColor = 'border-[#FF9933]/50';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-[#B22222] shrink-0" />;
          borderColor = 'border-[#B22222]/50';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${borderColor} ${bgStyle} shadow-xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-right-5`}
          >
            {icon}
            <div className="flex-1">
              <h4 className="text-sm font-bold text-[#333333]">{toast.title}</h4>
              <p className="text-xs text-[#666666] mt-0.5 leading-relaxed font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-[#333333] transition-colors p-1 rounded-md cursor-pointer"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
