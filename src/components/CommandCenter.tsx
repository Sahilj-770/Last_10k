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
  ArrowRight,
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
  const budgetResources = Math.max(1, metrics.startingBudget + metrics.totalIncome);
  const spentPercent = Math.round((metrics.totalPaidExpenses / budgetResources) * 100);
  const committedPercent = Math.round((metrics.totalUnpaidCommitments / budgetResources) * 100);
  const subscriptionsPercent = Math.round((metrics.upcomingSubscriptionCost / budgetResources) * 100);
  const spendablePercent = Math.round((metrics.spendableBalance / budgetResources) * 100);
  const savingsPercent = Math.round((metrics.totalSavingsAllocated / budgetResources) * 100);

  const riskBadge = {
    STABLE: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-500',
      title: 'Stable Runway',
      description: 'Your safe daily allowance is healthy and commitments are fully covered.',
    },
    CAUTION: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
      title: 'Caution // Rationing Required',
      description: 'Daily allowance requires disciplined tracking across remaining days.',
    },
    AT_RISK: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      dot: 'bg-rose-500',
      title: 'At Risk // Deficit Imminent',
      description: 'Spendable cash is insufficient to cover mandatory obligations.',
    },
  }[metrics.risk.level];

  return (
    <div className="space-y-8">
      {/* 1. HERO FINANCIAL COMMAND CENTER: Asymmetrical Editorial Hero */}
      <div className="bg-[#12141a] text-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg relative overflow-hidden">
        {/* Subtle background ambient graphic */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-radial from-[#ccff00]/10 to-transparent pointer-events-none rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          {/* Main Hero Column */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-mono text-[#ccff00] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
              <span>YOUR 30-DAY MONEY PLAN &middot; DAY {currentDay} OF {totalDays}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-white mb-4">
              Make your ₹10,000 last.
            </h2>

            <p className="text-sm sm:text-base text-[#a3adc2] leading-relaxed max-w-xl mb-6">
              You have <strong className="text-white font-semibold">{remainingDays} days</strong> left in this monthly cycle. Distinguish clearly between cash already spent, upcoming commitments reserved for bills, and your true daily allowance.
            </p>

            {/* Dominant Financial Figure */}
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 pt-2">
              <span className="text-xs uppercase tracking-wider text-[#a3adc2] font-mono">
                CURRENT CASH IN HAND
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl lg:text-7xl font-heading font-black text-white tracking-tight">
                  {formatINR(metrics.currentCashBalance)}
                </span>
                <span className="text-sm font-mono text-[#a3adc2]">
                  / {formatINR(metrics.startingBudget)} budget
                </span>
              </div>
            </div>
          </div>

          {/* Hero Quick Action Card */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 lg:w-80 backdrop-blur-sm flex flex-col justify-between shrink-0">
            <div>
              <div className="flex items-center justify-between text-xs text-[#a3adc2] font-mono mb-2">
                <span>HEALTH STATUS</span>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${riskBadge.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${riskBadge.dot}`} />
                  {riskBadge.title}
                </span>
              </div>
              <p className="text-xs text-[#d1d5db] leading-relaxed mb-4">
                {riskBadge.description}
              </p>
            </div>

            <button
              onClick={onOpenSimulator}
              className="w-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-semibold text-xs sm:text-sm py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>Simulate a Purchase</span>
            </button>
          </div>
        </div>

        {/* Hero Secondary Companion Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10 relative z-10">
          {/* Safe Daily Allowance */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-[#a3adc2] font-mono mb-1">
              <span>SAFE DAILY ALLOWANCE</span>
              <Zap className="w-3.5 h-3.5 text-[#ccff00]" />
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-black text-[#ccff00]">
              {formatINR(metrics.safeDailyAllowance)}
              <span className="text-xs text-[#a3adc2] font-normal font-mono ml-1">/ day</span>
            </div>
            <div className="text-[11px] text-[#a3adc2] mt-1">
              Sustainable baseline over {remainingDays} days
            </div>
          </div>

          {/* True Spendable Cash */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-[#a3adc2] font-mono mb-1">
              <span>FREE TO SPEND</span>
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-black text-cyan-300">
              {formatINR(metrics.spendableBalance)}
            </div>
            <div className="text-[11px] text-[#a3adc2] mt-1">
              After {formatINR(metrics.totalUnpaidCommitments)} bills, {formatINR(metrics.upcomingSubscriptionCost)} renewals & {formatINR(metrics.totalSavingsAllocated)} saved
            </div>
          </div>

          {/* Month-End Forecast */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-[#a3adc2] font-mono mb-1">
              <span>MONTH-END FORECAST</span>
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className={`text-2xl sm:text-3xl font-heading font-black ${metrics.forecastedMonthEndBalance >= 0 ? 'text-white' : 'text-rose-400'}`}>
              {formatINR(metrics.forecastedMonthEndBalance)}
            </div>
            <div className="text-[11px] text-[#a3adc2] mt-1">
              Locked in savings: {formatINR(metrics.totalSavingsAllocated)}
            </div>
          </div>
        </div>
      </div>

      {/* 2. REDESIGNED BUDGET CAPITAL ALLOCATION VISUALIZATION */}
      <div className="bg-white border border-[#e8e5dc] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-heading font-bold text-lg sm:text-xl text-[#12141a]">
              ₹10,000 Budget Capital Allocation
            </h3>
            <p className="text-xs text-[#64748b]">
              Each rupee sits in one bucket. Free cash excludes bills, renewals, and locked savings.
            </p>
          </div>
          <div className="text-xs font-mono text-[#12141a] font-semibold bg-[#f6f4ee] px-3 py-1.5 rounded-md border border-[#e8e5dc] self-start sm:self-auto">
            {formatINR(metrics.spendableBalance)} Free Discretionary Runway
          </div>
        </div>

        {/* Large Visual Stacked Bar */}
        <div className="w-full bg-[#f6f4ee] h-5 rounded-lg flex overflow-hidden border border-[#e8e5dc] my-4">
          {/* 1. Spent so far */}
          <div
            className="bg-[#2d313d] transition-all duration-300"
            style={{ width: `${spentPercent}%` }}
            title={`Already Spent: ${formatINR(metrics.totalPaidExpenses)} (${spentPercent}%)`}
          />
          {/* 2. Unpaid Commitments */}
          <div
            className="bg-[#d97706] transition-all duration-300"
            style={{ width: `${committedPercent}%` }}
            title={`Reserved Bills: ${formatINR(metrics.totalUnpaidCommitments)} (${committedPercent}%)`}
          />
          {/* 3. Upcoming subscription renewals */}
          <div
            className="bg-[#0ea5e9] transition-all duration-300"
            style={{ width: `${subscriptionsPercent}%` }}
            title={`Upcoming Subscriptions: ${formatINR(metrics.upcomingSubscriptionCost)} (${subscriptionsPercent}%)`}
          />
          {/* 4. Spendable Free Cash */}
          <div
            className="bg-[#10b981] transition-all duration-300"
            style={{ width: `${spendablePercent}%` }}
            title={`Free-to-spend cash: ${formatINR(metrics.spendableBalance)} (${spendablePercent}%)`}
          />
          {/* 5. Locked in savings */}
          <div
            className="bg-[#059669] transition-all duration-300"
            style={{ width: `${savingsPercent}%` }}
            title={`Savings Vaults: ${formatINR(metrics.totalSavingsAllocated)} (${savingsPercent}%)`}
          />
        </div>

        {/* Detailed Explanation Cards Below Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 pt-3">
          {/* Card 1: Spent */}
          <div className="bg-[#fcfbf9] border border-[#ede9df] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#2d313d]" />
              <span className="font-mono text-xs text-[#64748b] uppercase font-semibold">Already Spent</span>
            </div>
            <div className="text-xl font-heading font-black text-[#12141a]">
              {formatINR(metrics.totalPaidExpenses)}
            </div>
            <div className="text-xs text-[#64748b] mt-1">
              {spentPercent}% of budget across Days 1&ndash;11
            </div>
          </div>

          {/* Card 2: Committed */}
          <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#d97706]" />
              <span className="font-mono text-xs text-amber-800 uppercase font-semibold">Reserved Bills</span>
            </div>
            <div className="text-xl font-heading font-black text-amber-900">
              {formatINR(metrics.totalUnpaidCommitments)}
            </div>
            <div className="text-xs text-amber-700 mt-1">
              WiFi, exam fee &amp; power bill upcoming
            </div>
          </div>

          {/* Card 3: Upcoming subscriptions */}
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-3 h-3 rounded-xs bg-sky-500" />
              <span className="font-mono text-xs text-sky-800 uppercase font-semibold">Upcoming Renewals</span>
            </div>
            <div className="text-xl font-heading font-black text-sky-900">
              {formatINR(metrics.upcomingSubscriptionCost)}
            </div>
            <div className="text-xs text-sky-700 mt-1">
              Active subscriptions due this cycle
            </div>
          </div>

          {/* Card 4: Free Spendable */}
          <div className="bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#10b981]" />
              <span className="font-mono text-xs text-emerald-800 uppercase font-semibold">Discretionary Cash</span>
            </div>
            <div className="text-xl font-heading font-black text-emerald-900">
              {formatINR(metrics.spendableBalance)}
            </div>
            <div className="text-xs text-emerald-700 mt-1">
              Safe for daily meals, travel &amp; leisure
            </div>
          </div>

          {/* Card 5: Savings */}
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#059669]" />
              <span className="font-mono text-xs text-emerald-800 uppercase font-semibold">Locked Savings</span>
            </div>
            <div className="text-xl font-heading font-black text-emerald-900">
              {formatINR(metrics.totalSavingsAllocated)}
            </div>
            <div className="text-xs text-emerald-700 mt-1">
              Emergency &amp; trip reserve goals
            </div>
          </div>
        </div>
      </div>

      {/* 3. TWO-COLUMN COMPOSITION: Health Diagnostic vs Upcoming Commitments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Health Diagnostic (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#e8e5dc] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#ede9df]">
              <div>
                <h4 className="font-heading font-bold text-base text-[#12141a]">
                  Financial Health &amp; Runway Diagnostics
                </h4>
                <p className="text-xs text-[#64748b]">Transparent, deterministic rules based on your cash and commitments</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${riskBadge.bg}`}>
                <span className={`w-2 h-2 rounded-full ${riskBadge.dot}`} />
                {riskBadge.title}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              {metrics.risk.reasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-[#fbfaf7] border border-[#ede9df] text-xs text-[#475569]"
                >
                  <Info className="w-4 h-4 text-[#12141a] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#ede9df] flex flex-wrap items-center justify-between text-xs text-[#64748b] gap-2">
            <span>RUNWAY PACE: <strong>{metrics.risk.runwayDays} days</strong> at current discretionary pace</span>
            <span>SHOCK RESISTANCE BUFFER: <strong>{formatINR(metrics.risk.emergencyBuffer)}</strong></span>
          </div>
        </div>

        {/* Right Column: Next Obligations & Quick Actions (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#e8e5dc] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#ede9df]">
              <div>
                <h4 className="font-heading font-bold text-base text-[#12141a]">
                  Mandatory Upcoming Bills
                </h4>
                <p className="text-xs text-[#64748b]">Reserved upcoming commitments</p>
              </div>
              <button
                onClick={() => onNavigateTab('ledger')}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
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
                    className="flex items-center justify-between p-3 rounded-lg bg-[#fbfaf7] border border-[#ede9df] text-xs"
                  >
                    <div>
                      <div className="font-semibold text-[#12141a]">{comm.title}</div>
                      <div className="text-[11px] text-[#64748b]">
                        Due on {comm.dateStr} &middot; Mandatory
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-rose-600 font-mono text-sm">{formatINR(comm.amount)}</div>
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-sm border border-amber-200">
                        RESERVED
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#ede9df] flex items-center justify-between">
            <button
              onClick={onOpenAddTransaction}
              className="text-xs font-medium text-[#12141a] hover:underline cursor-pointer"
            >
              + Record another expense
            </button>
            <button
              onClick={onOpenSimulator}
              className="bg-[#12141a] hover:bg-black text-[#ccff00] font-semibold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Simulate Purchase</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
