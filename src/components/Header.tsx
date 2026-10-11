import React, { useState, useEffect } from 'react';
import {
  Zap,
  Calendar,
  CreditCard,
  SlidersHorizontal,
  Flame,
  TrendingDown,
  RotateCcw,
  Sparkles,
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
  onBackToLanding?: () => void;
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
  onBackToLanding,
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

  const riskBadge = {
    STABLE: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-500',
      label: 'Stable Runway',
    },
    CAUTION: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
      label: 'Caution / Rationing',
    },
    AT_RISK: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      dot: 'bg-rose-500',
      label: 'At Risk',
    },
  }[riskLevel];

  return (
    <header className="border-b border-[#e8e5dc] bg-[#fbfaf7]/95 backdrop-blur-md sticky top-0 z-40 transition-colors">
      {/* Top Editorial Telemetry Strip */}
      <div className="border-b border-[#ede9df] bg-[#f5f3ec] px-4 sm:px-8 lg:px-12 py-1.5 text-xs text-[#5a6272] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium text-[#12141a]">
            <span className="w-2 h-2 rounded-full bg-[#12141a]" />
            <span className="tracking-wide">DAY {currentDay} OF {totalDays}</span>
          </div>
          <span className="text-[#d6d2c4] hidden sm:inline">&bull;</span>
          <span className="text-[#64748b] hidden sm:inline">
            {remainingDays} days remaining in this budget cycle
          </span>
          <span className="text-[#d6d2c4] hidden sm:inline">&bull;</span>
          <span className="hidden sm:inline font-mono text-[11px] text-[#12141a]">
            ALLOWANCE: <strong className="font-bold">{formatINR(safeDailyAllowance)}/day</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${riskBadge.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${riskBadge.dot}`} />
            {riskBadge.label}
          </span>
          <span className="text-[#d6d2c4] hidden sm:inline">&bull;</span>
          <span className="font-mono text-[11px] text-[#717b8f] hidden sm:inline">
            {timeStr || '16:30'} IST
          </span>
          <button
            onClick={onResetDemoData}
            className="text-[11px] text-[#717b8f] hover:text-[#e11d48] transition-colors flex items-center gap-1 cursor-pointer ml-1"
            title="Reset to clean demonstration state"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Brand Masthead */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand & Wordmark */}
        <div
          className="flex items-center gap-3.5 cursor-pointer select-none group"
          onClick={() => setActiveTab('command')}
        >
          <div className="w-10 h-10 bg-[#12141a] text-[#ccff00] flex items-center justify-center font-heading font-black text-xl tracking-tighter rounded-md shadow-sm group-hover:bg-black transition-colors">
            ₹10k
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="font-heading text-2xl font-black text-[#12141a] tracking-tight">
                LAST ₹10K
              </h1>
              <span className="font-mono text-xs font-semibold text-[#64748b] tracking-wider uppercase hidden sm:inline">
                &mdash; 30 Days. ₹10,000.
              </span>
            </div>
            <p className="text-xs text-[#64748b]">
              Personal finance survival simulator for Indian students &amp; young adults.
            </p>
          </div>
        </div>

        {/* Live Metrics Snippet & Simulation CTA */}
        <div className="flex items-center gap-3">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="text-xs font-semibold text-[#5a6272] hover:text-[#12141a] px-3 py-2 rounded-lg border border-[#ede9df] hover:border-[#12141a]/30 transition-all flex items-center gap-1.5 cursor-pointer bg-white shadow-xs"
              title="Return to the Landing Page & Money Runway"
            >
              <span>← Manifesto</span>
            </button>
          )}

          <div className="hidden lg:flex items-center gap-5 bg-white border border-[#e8e5dc] rounded-lg px-4 py-2 shadow-xs text-xs">
            <div>
              <div className="text-[10px] text-[#64748b] font-medium uppercase tracking-wider">CASH IN HAND</div>
              <div className="text-base font-heading font-black text-[#12141a]">{formatINR(cashBalance)}</div>
            </div>
            <div className="w-px h-7 bg-[#ede9df]" />
            <div>
              <div className="text-[10px] text-[#64748b] font-medium uppercase tracking-wider">SAFE DAILY</div>
              <div className="text-base font-heading font-black text-emerald-700">
                {formatINR(safeDailyAllowance)}<span className="text-xs text-[#64748b] font-normal">/d</span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenQuickSimulate}
            className="w-full md:w-auto bg-[#12141a] hover:bg-black text-[#ccff00] font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-98"
          >
            <Zap className="w-4 h-4 fill-[#ccff00]" />
            <span>Simulate a Purchase</span>
            <kbd className="hidden sm:inline-block bg-white/10 text-[#faf8f5] px-1.5 py-0.5 text-[10px] font-mono rounded-sm">
              S
            </kbd>
          </button>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 border-t border-[#ede9df] flex items-center justify-between overflow-x-auto">
        <nav className="flex space-x-1 sm:space-x-2 py-1 text-xs" aria-label="Main Navigation">
          {[
            { id: 'command', label: 'Command Center', icon: SlidersHorizontal },
            { id: 'simulator', label: 'Decision Simulator', icon: Zap },
            { id: 'calendar', label: '30-Day Calendar', icon: Calendar },
            { id: 'ledger', label: 'Expenses & Commitments', icon: CreditCard },
            { id: 'subscriptions', label: 'Subscriptions', icon: TrendingDown },
            { id: 'stress', label: 'Stress Tests', icon: Flame },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 font-medium transition-all whitespace-nowrap cursor-pointer rounded-t-sm ${
                  isActive
                    ? 'border-[#12141a] text-[#12141a] font-bold bg-white'
                    : 'border-transparent text-[#64748b] hover:text-[#12141a] hover:bg-black/2'
                }`}
              >
                <tab.icon
                  className={`w-3.5 h-3.5 ${isActive ? 'text-[#12141a]' : 'text-[#8c95a6]'}`}
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
