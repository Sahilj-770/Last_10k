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
    <footer className="border-t border-[#1e212d] bg-[#07080c] py-10 px-4 sm:px-6 font-mono text-xs text-[#717b8f] mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 bg-[#ccff00] text-black font-black flex items-center justify-center font-heading text-xs">
              ₹
            </span>
            <span className="font-heading font-black text-sm text-[#faf7f0] uppercase tracking-wider">
              LAST ₹10K // SURVIVE THE MONTH
            </span>
          </div>
          <p className="max-w-xl text-[#8e96a8] leading-relaxed text-[11px]">
            An editorial personal finance survival simulator crafted for Indian college students and young adults. Every metric is computed deterministically from real ledger state without arbitrary estimates.
          </p>
        </div>

        {/* Data Tools */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onExportJson}
            className="bg-[#12141c] hover:bg-[#1a1e2b] text-[#faf7f0] border border-[#232738] px-3 py-1.5 transition-colors flex items-center gap-1.5"
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
            className="bg-[#1a1215] hover:bg-[#2b181e] text-[#ff4d4f] border border-[#ff4d4f]/30 px-3 py-1.5 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Seed</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-[#141620] mt-6 pt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] text-[#555d70] gap-2">
        <span>&copy; 2026 LAST ₹10K &middot; Engineered for individual hackathon run</span>
        <span>Local browser persistence active &middot; Zero external API dependencies</span>
      </div>
    </footer>
  );
};
