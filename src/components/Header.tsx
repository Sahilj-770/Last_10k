import React, { useState, useEffect } from 'react';
import {
  Zap,
  Calendar,
  CreditCard,
  SlidersHorizontal,
  Flame,
  PiggyBank,
  TrendingDown,
  ShieldAlert,
  RotateCcw,
} from 'lucide-react';
import { formatINR } from '../utils/financeEngine';

interface HeaderProps {
  currentDay: number;
  totalDays: number;
  cashBalance: number;
  safeDailyAllowance: number;
  riskLevel: 'STABLE' | 'CAUTION' | 'AT_RISK';
  activeTab: 'command' | 'simulator' | 'calendar' | 'ledger' | 'subscriptions' | 'stress';
  setActiveTab: (tab: 'command' | 'simulator' | 'calendar' | 'ledger' | 'subscriptions' | 'stress') => void;
  onOpenQuickSimulate: () => void;
  onResetDemoData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDay,
  totalDays,
  cashBalance,
  safeDailyAllowance,
  riskLevel,
  activeTab,
  setActiveTab,
  onOpenQuickSimulate,
  onResetDemoData,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const remainingDays = Math.max(1, totalDays - currentDay + 1);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-IN', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const riskBadgeStyles = {
    STABLE: 'bg-[#ccff00]/15 text-[#ccff00] border-[#ccff00]/40',
    CAUTION: 'bg-[#f59e0b]/15 text-[#fbbf24] border-[#f59e0b]/40',
    AT_RISK: 'bg-[#ff4d4f]/15 text-[#ff4d4f] border-[#ff4d4f]/40',
  }[riskLevel];

  return (
    <header className="border-b border-[#1e212d] bg-[#090a0f]/95 backdrop-blur-md sticky top-0 z-40">
      {/* Top Telemetry Ticker */}
      <div className="bg-[#050608] border-b border-[#161822] px-4 py-1.5 text-[11px] font-mono text-[#8a92a3] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#ccff00]">
            <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
            <span className="font-semibold tracking-wider uppercase">SURVIVAL ENGINE LIVE</span>
          </div>
          <span className="text-[#2b3042] hidden sm:inline">|</span>
          <span className="text-[#faf7f0]">
            DAY {currentDay} OF {totalDays}
          </span>
          <span className="text-[#717b8f]">({remainingDays} DAYS REMAINING)</span>
          <span className="text-[#2b3042] hidden sm:inline">|</span>
          <span className="hidden sm:inline text-[#a3adc2]">
            ALLOWANCE: <strong className="text-[#ccff00]">{formatINR(safeDailyAllowance)}/DAY</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] px-2 py-0.5 border uppercase tracking-wider font-semibold rounded-xs ${riskBadgeStyles}">
            STATUS: {riskLevel.replace('_', ' ')}
          </span>
          <span className="text-[#2b3042] hidden sm:inline">|</span>
          <span className="text-[#8e96a8] hidden sm:inline">{timeStr || '16:20:00'} IST</span>
          <button
            onClick={onResetDemoData}
            className="text-[10px] text-[#788296] hover:text-[#ff4d4f] transition-colors flex items-center gap-1"
            title="Reset to clean demonstration state"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* Main Masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand & Editorial Title */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => setActiveTab('command')}
        >
          <div className="w-10 h-10 bg-[#ccff00] flex items-center justify-center font-heading font-black text-black text-xl tracking-tighter shrink-0 shadow-lg">
            ₹10k
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="font-heading text-2xl font-black text-[#faf7f0] tracking-tight uppercase">
                LAST ₹10K
              </h1>
              <span className="font-mono text-xs text-[#ccff00] font-semibold tracking-widest hidden sm:inline">
                // SURVIVE THE MONTH
              </span>
            </div>
            <p className="text-xs text-[#8e96a8] font-mono">
              30 days. ₹10,000. Make it count. Real-time decision simulator for Gen Z.
            </p>
          </div>
        </div>

        {/* Live Metrics Snippet & Simulation CTA */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-4 bg-[#10121a] border border-[#1e212d] px-3.5 py-1.5 font-mono text-xs">
            <div>
              <div className="text-[10px] text-[#717b8f] uppercase">CASH IN HAND</div>
              <div className="text-sm font-bold text-[#faf7f0]">{formatINR(cashBalance)}</div>
            </div>
            <div className="w-px h-6 bg-[#232738]" />
            <div>
              <div className="text-[10px] text-[#717b8f] uppercase">SAFE DAILY</div>
              <div className="text-sm font-bold text-[#ccff00]">
                {formatINR(safeDailyAllowance)}/d
              </div>
            </div>
          </div>

          <button
            onClick={onOpenQuickSimulate}
            className="w-full md:w-auto bg-[#ccff00] hover:bg-[#b8e600] text-black font-semibold text-xs sm:text-sm font-mono px-4 py-2.5 transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer active:scale-98"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>Simulate Expense</span>
            <kbd className="hidden sm:inline-block bg-black/20 text-black px-1.5 py-0.2 text-[10px] font-mono rounded-xs">
              S
            </kbd>
          </button>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 border-t border-[#181a24] flex items-center justify-between overflow-x-auto">
        <nav className="flex space-x-1 sm:space-x-2 py-1 text-xs font-mono" aria-label="Main Navigation">
          {[
            { id: 'command', label: 'COMMAND CENTER', icon: SlidersHorizontal },
            { id: 'simulator', label: 'DECISION SIMULATOR', icon: Zap },
            { id: 'calendar', label: '30-DAY CALENDAR', icon: Calendar },
            { id: 'ledger', label: 'EXPENSES & COMMITMENTS', icon: CreditCard },
            { id: 'subscriptions', label: 'SUBSCRIPTIONS', icon: TrendingDown },
            { id: 'stress', label: 'STRESS TESTS', icon: Flame },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#ccff00] text-[#faf7f0] font-semibold bg-[#12141c]'
                    : 'border-transparent text-[#8a92a3] hover:text-[#faf7f0] hover:bg-[#0d0e14]'
                }`}
              >
                <tab.icon
                  className={`w-3.5 h-3.5 ${isActive ? 'text-[#ccff00]' : 'text-[#656d80]'}`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
