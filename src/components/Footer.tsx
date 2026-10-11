import React from 'react';
import { RotateCcw, Download, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onResetDemoData: () => void;
  onExportJson: () => void;
  onShowToast: (msg: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onResetDemoData,
  onExportJson,
  onShowToast,
}) => {
  return (
    <footer className="border-t border-[#ede9df] bg-[#f5f3ec] py-10 text-xs text-[#64748b] mt-16 transition-colors">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 bg-[#12141a] text-[#ccff00] font-black flex items-center justify-center font-heading text-xs rounded-sm">
              ₹
            </span>
            <span className="font-heading font-black text-sm text-[#12141a] uppercase tracking-wider">
              LAST ₹10K &middot; SURVIVE THE MONTH
            </span>
          </div>
          <p className="max-w-xl text-[#64748b] leading-relaxed text-xs">
            An editorial personal finance survival simulator crafted for Indian college students and young adults. Every metric is computed deterministically from real ledger state without arbitrary estimates.
          </p>
        </div>

        {/* Data Tools */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onExportJson}
            className="bg-white hover:bg-[#ede9df]/60 text-[#12141a] border border-[#d6d0c2] rounded-lg px-3.5 py-2 transition-colors flex items-center gap-2 shadow-xs font-medium cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON Ledger</span>
          </button>
          <button
            onClick={() => {
              if (window.confirm('Reset all transactions and state to initial demonstration defaults?')) {
                onResetDemoData();
                onShowToast('Database reset to clean demonstration seed data.');
              }
            }}
            className="bg-rose-50 hover:bg-rose-100/70 text-rose-700 border border-rose-200/80 rounded-lg px-3.5 py-2 transition-colors flex items-center gap-2 font-medium cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Seed</span>
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 border-t border-[#ede9df] mt-6 pt-5 flex flex-col sm:flex-row justify-between items-center text-[11px] text-[#8c95a6] gap-2">
        <span>&copy; 2026 LAST ₹10K &middot; Engineered for individual hackathon run</span>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Local browser persistence active &middot; Zero external API dependencies</span>
        </div>
      </div>
    </footer>
  );
};
