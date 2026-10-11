import React from 'react';
import type { CalculatedMetrics, SavingsGoal, Transaction } from '../types/finance';
import { formatINR } from '../utils/financeEngine';
import {
  Wallet,
  ShieldCheck,
  TrendingDown,
  Calendar,
  AlertTriangle,
  Zap,
  ArrowUpRight,
  Lock,
  PiggyBank,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';

interface CommandCenterProps {
  metrics: CalculatedMetrics;
  currentDay: number;
  totalDays: number;
  savingsGoals: SavingsGoal[];
  recentTransactions: Transaction[];
  onOpenSimulator: () => void;
  onOpenAddTransaction: () => void;
  onNavigateTab: (tab: 'simulator' | 'calendar' | 'ledger' | 'subscriptions' | 'stress') => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  metrics,
  currentDay,
  totalDays,
  savingsGoals,
  recentTransactions,
  onOpenSimulator,
  onOpenAddTransaction,
  onNavigateTab,
}) => {
  const remainingDays = metrics.remainingDays;
  const spentPercent = Math.round((metrics.totalPaidExpenses / metrics.startingBudget) * 100);
  const committedPercent = Math.round((metrics.totalUnpaidCommitments / metrics.startingBudget) * 100);
  const spendablePercent = Math.round((metrics.spendableBalance / metrics.startingBudget) * 100);

  const riskBadge = {
    STABLE: {
      bg: 'bg-[#ccff00]/10 border-[#ccff00]/40 text-[#ccff00]',
      dot: 'bg-[#ccff00]',
      label: 'STABLE RUNWAY',
    },
    CAUTION: {
      bg: 'bg-[#f59e0b]/10 border-[#f59e0b]/40 text-[#fbbf24]',
      dot: 'bg-[#f59e0b]',
      label: 'CAUTION // RATIONING',
    },
    AT_RISK: {
      bg: 'bg-[#ff4d4f]/10 border-[#ff4d4f]/40 text-[#ff4d4f]',
      dot: 'bg-[#ff4d4f]',
      label: 'AT RISK // DEFICIT IMMINENT',
    },
  }[metrics.risk.level];

  return (
    <div className="space-y-6">
      {/* Editorial Headline & Mission Statement */}
      <div className="bg-[#10121a] border border-[#1e212d] p-5 sm:p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#ccff00] mb-1.5 uppercase tracking-wider">
              <Zap className="w-4 h-4 text-[#ccff00]" />
              <span>THE ₹10,000 / 30-DAY EXPERIMENT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#faf7f0] tracking-tight">
              Financial Command Center
            </h2>
            <p className="text-xs sm:text-sm text-[#8e96a8] max-w-2xl font-body mt-1 leading-relaxed">
              Every rupee decision affects your remaining {remainingDays} days. Distinguish clearly between cash spent, cash reserved for upcoming commitments, and your actual safe daily allowance.
            </p>
          </div>

          {/* Quick Decision Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSimulator}
              className="bg-[#ccff00] hover:bg-[#b8e600] text-black font-semibold text-xs sm:text-sm font-mono px-4 py-3 transition-colors flex items-center gap-2 shadow-xl cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>Simulate a Purchase</span>
            </button>
            <button
              onClick={onOpenAddTransaction}
              className="bg-[#161822] hover:bg-[#202330] text-[#faf7f0] border border-[#2b3042] text-xs sm:text-sm font-mono px-4 py-3 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>+ Log Transaction</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Numbers Grid (Oversized Editorial) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Cash In Hand */}
        <div className="bg-[#10121a] border border-[#1e212d] p-5 relative overflow-hidden group hover:border-[#2e3346] transition-colors">
          <div className="flex items-center justify-between text-xs font-mono text-[#8a92a3] mb-1">
            <span className="uppercase tracking-wider">CASH IN HAND</span>
            <Wallet className="w-4 h-4 text-[#faf7f0]" />
          </div>
          <div className="text-3xl sm:text-4xl font-heading font-black text-[#faf7f0] tracking-tight my-1">
            {formatINR(metrics.currentCashBalance)}
          </div>
          <div className="text-[11px] font-mono text-[#717b8f] flex items-center justify-between border-t border-[#181a24] pt-2 mt-2">
            <span>STARTING BUDGET</span>
            <span className="text-[#faf7f0]">{formatINR(metrics.startingBudget)}</span>
          </div>
        </div>

        {/* 2. Safe Daily Allowance */}
        <div className="bg-[#10121a] border border-[#1e212d] p-5 relative overflow-hidden group hover:border-[#ccff00]/40 transition-colors">
          <div className="flex items-center justify-between text-xs font-mono text-[#ccff00] mb-1">
            <span className="uppercase tracking-wider font-semibold">SAFE DAILY ALLOWANCE</span>
            <Zap className="w-4 h-4 text-[#ccff00]" />
          </div>
          <div className="text-3xl sm:text-4xl font-heading font-black text-[#ccff00] tracking-tight my-1">
            {formatINR(metrics.safeDailyAllowance)}
            <span className="text-xs font-mono text-[#8a92a3] ml-1 font-normal">/ DAY</span>
          </div>
          <div className="text-[11px] font-mono text-[#717b8f] flex items-center justify-between border-t border-[#181a24] pt-2 mt-2">
            <span>OVER {remainingDays} DAYS LEFT</span>
            <span className="text-[#ccff00]">
              {metrics.safeDailyAllowance >= 150 ? 'SUSTAINABLE' : 'TIGHT RATION'}
            </span>
          </div>
        </div>

        {/* 3. Spendable Balance (After Commitments) */}
        <div className="bg-[#10121a] border border-[#1e212d] p-5 relative overflow-hidden group hover:border-[#2e3346] transition-colors">
          <div className="flex items-center justify-between text-xs font-mono text-[#8a92a3] mb-1">
            <span className="uppercase tracking-wider">TRUE SPENDABLE CASH</span>
            <Lock className="w-4 h-4 text-[#06b6d4]" />
          </div>
          <div className="text-3xl sm:text-4xl font-heading font-black text-[#06b6d4] tracking-tight my-1">
            {formatINR(metrics.spendableBalance)}
          </div>
          <div className="text-[11px] font-mono text-[#717b8f] flex items-center justify-between border-t border-[#181a24] pt-2 mt-2">
            <span>RESERVED COMMITMENTS</span>
            <span className="text-[#ff4d4f] font-semibold">
              -{formatINR(metrics.totalUnpaidCommitments)}
            </span>
          </div>
        </div>

        {/* 4. Forecasted Month-End Balance */}
        <div className="bg-[#10121a] border border-[#1e212d] p-5 relative overflow-hidden group hover:border-[#2e3346] transition-colors">
          <div className="flex items-center justify-between text-xs font-mono text-[#8a92a3] mb-1">
            <span className="uppercase tracking-wider">MONTH-END FORECAST</span>
            <Calendar className="w-4 h-4 text-[#a855f7]" />
          </div>
          <div
            className={`text-3xl sm:text-4xl font-heading font-black tracking-tight my-1 ${
              metrics.forecastedMonthEndBalance >= 0 ? 'text-[#faf7f0]' : 'text-[#ff4d4f]'
            }`}
          >
            {formatINR(metrics.forecastedMonthEndBalance)}
          </div>
          <div className="text-[11px] font-mono text-[#717b8f] flex items-center justify-between border-t border-[#181a24] pt-2 mt-2">
            <span>SAVINGS LOCKED</span>
            <span className="text-[#22c55e]">{formatINR(metrics.totalSavingsAllocated)}</span>
          </div>
        </div>
      </div>

      {/* Visual Budget Partition Ledger Bar */}
      <div className="bg-[#10121a] border border-[#1e212d] p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-sm text-[#faf7f0]">
              ₹10,000 Budget Capital Allocation
            </span>
            <span className="font-mono text-xs text-[#717b8f]">
              // LIVE RECONCILIATION
            </span>
          </div>
          <div className="font-mono text-xs text-[#a3adc2] flex items-center gap-3">
            <span className="text-[#ccff00] font-bold">
              {formatINR(metrics.spendableBalance)} Free Discretionary
            </span>
          </div>
        </div>

        {/* Stacked Percentage Bar */}
        <div className="w-full bg-[#161822] h-4 flex overflow-hidden border border-[#252938]">
          {/* 1. Paid Spent */}
          <div
            className="bg-[#3b4254] transition-all duration-300"
            style={{ width: `${spentPercent}%` }}
            title={`Spent so far: ${formatINR(metrics.totalPaidExpenses)} (${spentPercent}%)`}
          />
          {/* 2. Unpaid Commitments */}
          <div
            className="bg-[#f59e0b] transition-all duration-300"
            style={{ width: `${committedPercent}%` }}
            title={`Committed Upcoming: ${formatINR(metrics.totalUnpaidCommitments)} (${committedPercent}%)`}
          />
          {/* 3. Spendable Free */}
          <div
            className="bg-[#ccff00] transition-all duration-300"
            style={{ width: `${spendablePercent}%` }}
            title={`Spendable Cash: ${formatINR(metrics.spendableBalance)} (${spendablePercent}%)`}
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs font-mono pt-2 border-t border-[#181a24]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#3b4254]" />
            <span className="text-[#8a92a3]">
              Spent: <strong>{formatINR(metrics.totalPaidExpenses)}</strong> ({spentPercent}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#f59e0b]" />
            <span className="text-[#f59e0b]">
              Committed: <strong>{formatINR(metrics.totalUnpaidCommitments)}</strong> ({committedPercent}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#ccff00]" />
            <span className="text-[#ccff00]">
              Spendable: <strong>{formatINR(metrics.spendableBalance)}</strong> ({spendablePercent}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#22c55e]" />
            <span className="text-[#22c55e]">
              Savings: <strong>{formatINR(metrics.totalSavingsAllocated)}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Two-Column Diagnostic: Risk Analysis vs Next Commitments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Risk Analysis Card */}
        <div className="bg-[#10121a] border border-[#1e212d] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-[#8a92a3] uppercase tracking-wider">
                FINANCIAL HEALTH &amp; RUNWAY DIAGNOSTIC
              </span>
              <span
                className={`font-mono text-xs px-2.5 py-1 border font-bold flex items-center gap-1.5 ${riskBadge.bg}`}
              >
                <span className={`w-2 h-2 rounded-full ${riskBadge.dot}`} />
                {riskBadge.label}
              </span>
            </div>

            <h3 className="font-heading text-lg font-bold text-[#faf7f0] mb-2">
              {metrics.risk.title}
            </h3>

            {/* Transparent Reasons List */}
            <div className="space-y-2 my-3">
              {metrics.risk.reasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs font-mono text-[#a3adc2] bg-[#0c0d14] p-2.5 border border-[#181a24]"
                >
                  <Info className="w-3.5 h-3.5 text-[#ccff00] shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#181a24] flex items-center justify-between text-xs font-mono text-[#717b8f]">
            <span>RUNWAY: {metrics.risk.runwayDays} DAYS AT CURRENT PACE</span>
            <span>SHOCK BUFFER: {formatINR(metrics.risk.emergencyBuffer)}</span>
          </div>
        </div>

        {/* Upcoming Commitments & Quick Simulation Teaser */}
        <div className="bg-[#10121a] border border-[#1e212d] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-[#8a92a3] uppercase tracking-wider">
                MANDATORY UPCOMING OBLIGATIONS
              </span>
              <button
                onClick={() => onNavigateTab('ledger')}
                className="text-xs font-mono text-[#ccff00] hover:underline flex items-center gap-0.5"
              >
                <span>View All</span> &rarr;
              </button>
            </div>

            <div className="space-y-2.5">
              {recentTransactions
                .filter((t) => t.type === 'commitment' && !t.isPaid)
                .slice(0, 3)
                .map((comm) => (
                  <div
                    key={comm.id}
                    className="flex items-center justify-between p-3 bg-[#0c0d14] border border-[#1a1c28] text-xs font-mono"
                  >
                    <div>
                      <div className="font-semibold text-[#faf7f0]">{comm.title}</div>
                      <div className="text-[11px] text-[#717b8f]">
                        Due on {comm.dateStr} &middot; Mandatory
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#ff4d4f]">{formatINR(comm.amount)}</div>
                      <span className="text-[10px] text-[#f59e0b]">RESERVED</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-[#131722] border border-[#ccff00]/30 text-xs font-mono flex items-center justify-between gap-2">
            <span className="text-[#ccff00] font-semibold">
              Want to see what happens before spending ₹1,500?
            </span>
            <button
              onClick={onOpenSimulator}
              className="bg-[#ccff00] text-black font-bold px-3 py-1.5 hover:bg-[#b8e600] transition-colors shrink-0"
            >
              Simulate &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
