import React, { useState } from 'react';
import type { Transaction, Subscription, CalculatedMetrics } from '../types/finance';
import { formatINR, CATEGORY_META } from '../utils/financeEngine';
import {
  Calendar as CalendarIcon,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Lock,
  ChevronRight,
  TrendingDown,
  Info,
} from 'lucide-react';

interface SurvivalCalendarProps {
  currentDay: number;
  totalDays: number;
  transactions: Transaction[];
  subscriptions: Subscription[];
  metrics: CalculatedMetrics;
  onOpenSimulatorForDay: (day: number) => void;
}

export const SurvivalCalendar: React.FC<SurvivalCalendarProps> = ({
  currentDay,
  totalDays,
  transactions,
  subscriptions,
  metrics,
  onOpenSimulatorForDay,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(currentDay);

  // Group transactions by day
  const transactionsByDay: Record<number, Transaction[]> = {};
  for (let d = 1; d <= totalDays; d++) {
    transactionsByDay[d] = [];
  }
  transactions.forEach((tx) => {
    if (transactionsByDay[tx.day]) {
      transactionsByDay[tx.day].push(tx);
    }
  });

  // Calculate day-by-day running balance simulation
  const dayBalances: Record<number, number> = {};
  let runningBalance = metrics.startingBudget;

  for (let d = 1; d <= totalDays; d++) {
    const dayTxs = transactionsByDay[d] || [];
    const daySpent = dayTxs
      .filter((t) => t.type === 'expense' || (t.type === 'commitment' && t.isPaid))
      .reduce((sum, t) => sum + t.amount, 0);

    const dayCommittedUnpaid = dayTxs
      .filter((t) => t.type === 'commitment' && !t.isPaid)
      .reduce((sum, t) => sum + t.amount, 0);

    const dayIncome = dayTxs
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    if (d <= currentDay) {
      runningBalance = runningBalance + dayIncome - daySpent;
    } else {
      runningBalance = runningBalance - dayCommittedUnpaid - metrics.safeDailyAllowance;
    }
    dayBalances[d] = Math.round(runningBalance);
  }

  const selectedTxs = transactionsByDay[selectedDay] || [];
  const selectedSubscriptions = subscriptions.filter((s) => s.renewalDay === selectedDay);

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="bg-white border border-[#e8e5dc] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f6f4ee] rounded-full text-xs font-mono text-[#5a6272] mb-2 border border-[#e8e5dc]">
              <CalendarIcon className="w-3.5 h-3.5 text-[#12141a]" />
              <span>CHRONOLOGICAL FINANCIAL LIFELINE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#12141a] tracking-tight">
              30-Day Survival Calendar
            </h2>
            <p className="text-xs sm:text-sm text-[#5a6272] max-w-2xl mt-1 leading-relaxed">
              Track historical expenses, upcoming mandatory bills, and predicted daily spending pace. High financial pressure days are flagged to prevent mid-month insolvency.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#fbfaf7] border border-[#e8e5dc] rounded-xl p-3.5 text-xs font-mono">
            <div>
              <span className="text-[#8c95a6] block text-[10px] uppercase">Current Position</span>
              <strong className="text-sm font-bold text-[#12141a]">Day {currentDay} of {totalDays}</strong>
            </div>
            <div className="w-px h-8 bg-[#e8e5dc]" />
            <div>
              <span className="text-[#8c95a6] block text-[10px] uppercase">Daily Allowance</span>
              <strong className="text-sm font-bold text-emerald-700">{formatINR(metrics.safeDailyAllowance)}/d</strong>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-[#ede9df] text-xs text-[#5a6272]">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#cbd5e1]" /> Past Recorded Day
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium text-[#12141a]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#12141a]" /> Today (Day {currentDay})
          </span>
          <span className="inline-flex items-center gap-1.5 text-amber-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#d97706]" /> Mandatory Commitment Due
          </span>
          <span className="inline-flex items-center gap-1.5 text-rose-600 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e11d48]" /> High Pressure Point
          </span>
        </div>
      </div>

      {/* 30-Day Calendar Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => {
          const isPast = d < currentDay;
          const isToday = d === currentDay;
          const isFuture = d > currentDay;
          const dayTxs = transactionsByDay[d] || [];
          const daySubs = subscriptions.filter((s) => s.renewalDay === d);

          const hasCommitment = dayTxs.some((t) => t.type === 'commitment');
          const dayTotalSpent = dayTxs
            .filter((t) => t.type === 'expense' || (t.type === 'commitment' && t.isPaid))
            .reduce((sum, t) => sum + t.amount, 0);

          const dayCommitted = dayTxs
            .filter((t) => t.type === 'commitment' && !t.isPaid)
            .reduce((sum, t) => sum + t.amount, 0);

          const isHighPressure = dayCommitted >= 400 || (isPast && dayTotalSpent >= 700);
          const isSelected = selectedDay === d;

          return (
            <div
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between min-h-[105px] ${
                isSelected
                  ? 'border-[#12141a] bg-white shadow-md ring-2 ring-[#12141a]/10'
                  : isToday
                  ? 'border-[#12141a] bg-[#12141a] text-white shadow-sm'
                  : isPast
                  ? 'border-[#e8e5dc] bg-[#fbfaf7] hover:border-[#12141a]/40 hover:bg-white'
                  : 'border-[#ede9df] bg-white hover:border-[#12141a]/40'
              }`}
            >
              {/* Day Number Header */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-mono font-bold ${
                    isToday
                      ? 'text-[#ccff00]'
                      : isSelected
                      ? 'text-[#12141a]'
                      : isPast
                      ? 'text-[#5a6272]'
                      : 'text-[#8c95a6]'
                  }`}
                >
                  DAY {d}
                </span>

                {isToday ? (
                  <span className="text-[9px] bg-[#ccff00] text-black px-1.5 py-0.5 rounded-xs font-bold font-mono">
                    TODAY
                  </span>
                ) : isHighPressure ? (
                  <span className="w-2 h-2 rounded-full bg-rose-500" title="High financial pressure point" />
                ) : hasCommitment ? (
                  <span className="w-2 h-2 rounded-xs bg-amber-500" title="Commitment bill due" />
                ) : null}
              </div>

              {/* Day Activity Readout */}
              <div className="my-1.5 font-mono">
                {isPast ? (
                  dayTotalSpent > 0 ? (
                    <div>
                      <div className="text-xs font-bold text-[#12141a]">
                        -{formatINR(dayTotalSpent)}
                      </div>
                      <div className="text-[10px] text-[#8c95a6]">{dayTxs.length} spent</div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-[#8c95a6]">₹0 spend</div>
                  )
                ) : isToday ? (
                  <div>
                    <div className="text-xs font-bold text-white">
                      {dayTotalSpent > 0 ? `-${formatINR(dayTotalSpent)}` : 'Active'}
                    </div>
                    <div className="text-[10px] text-[#a3adc2]">
                      Allow: {formatINR(metrics.safeDailyAllowance)}
                    </div>
                  </div>
                ) : (
                  <div>
                    {hasCommitment ? (
                      <div>
                        <div className="text-xs font-bold text-amber-700">
                          Bill: {formatINR(dayCommitted)}
                        </div>
                        <div className="text-[10px] text-[#8c95a6]">Reserved</div>
                      </div>
                    ) : daySubs.length > 0 ? (
                      <div>
                        <div className="text-xs text-pink-600 font-semibold">
                          Sub: {formatINR(daySubs[0].amount)}
                        </div>
                        <div className="text-[10px] text-[#8c95a6] truncate">{daySubs[0].name}</div>
                      </div>
                    ) : (
                      <div className="text-[10px] text-[#8c95a6]">
                        Pace: ~{formatINR(metrics.safeDailyAllowance)}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Projected Closing Balance */}
              <div
                className={`text-[10px] font-mono pt-1.5 border-t flex justify-between items-center ${
                  isToday ? 'border-white/10 text-[#a3adc2]' : 'border-[#f0ece1] text-[#8c95a6]'
                }`}
              >
                <span>EOD:</span>
                <span className={dayBalances[d] < 0 ? 'text-rose-600 font-bold' : isToday ? 'text-white font-medium' : 'text-[#5a6272] font-medium'}>
                  {formatINR(dayBalances[d])}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Day Audit & Ledger Drawer */}
      <div className="bg-white border border-[#e8e5dc] rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#ede9df]">
          <div className="flex items-center gap-3">
            <h3 className="font-heading font-black text-xl text-[#12141a]">
              Day {selectedDay} Audit &amp; Ledger
            </h3>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#f6f4ee] text-[#5a6272] border border-[#e8e5dc]">
              {selectedDay === currentDay
                ? 'TODAY'
                : selectedDay < currentDay
                ? 'PAST RECORD'
                : 'FUTURE FORECAST'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-[#5a6272]">
              Projected balance at Day {selectedDay} close:{' '}
              <strong className="text-[#12141a] text-sm">{formatINR(dayBalances[selectedDay])}</strong>
            </span>
            <button
              onClick={() => onOpenSimulatorForDay(selectedDay)}
              className="bg-[#12141a] hover:bg-black text-[#ccff00] font-semibold px-3 py-1.5 rounded-md transition-colors cursor-pointer text-xs"
            >
              Simulate on Day {selectedDay} &rarr;
            </button>
          </div>
        </div>

        {/* Selected day entries */}
        <div className="mt-4">
          {selectedTxs.length === 0 && selectedSubscriptions.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#8c95a6]">
              No discrete transactions recorded on Day {selectedDay}.
              {selectedDay > currentDay && (
                <span className="block mt-1 text-[#5a6272]">
                  Projected discretionary spending pace: ~{formatINR(metrics.safeDailyAllowance)}/day.
                </span>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              {selectedTxs.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-xl bg-[#fbfaf7] border border-[#ede9df] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        tx.type === 'commitment'
                          ? 'bg-amber-500'
                          : tx.type === 'income'
                          ? 'bg-emerald-500'
                          : 'bg-slate-700'
                      }`}
                    />
                    <div>
                      <div className="font-bold text-[#12141a]">{tx.title}</div>
                      <div className="text-[11px] text-[#64748b]">
                        {CATEGORY_META[tx.category]?.label} &middot;{' '}
                        {tx.isEssential ? 'Essential' : 'Discretionary'}
                        {tx.notes && ` · ${tx.notes}`}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div
                      className={`font-black text-sm ${
                        tx.type === 'income' ? 'text-emerald-700' : 'text-[#12141a]'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}
                      {formatINR(tx.amount)}
                    </div>
                    <span className="text-[10px] text-[#8c95a6]">
                      {tx.type === 'commitment' ? (tx.isPaid ? 'SETTLED' : 'RESERVED BILL') : 'COMPLETED DEBIT'}
                    </span>
                  </div>
                </div>
              ))}

              {selectedSubscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-3.5 rounded-xl bg-pink-50/50 border border-pink-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                    <div>
                      <div className="font-bold text-pink-900">{sub.name} (Recurring)</div>
                      <div className="text-[11px] text-pink-700">Scheduled subscription renewal</div>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="font-bold text-sm text-pink-900">-{formatINR(sub.amount)}</div>
                    <span className="text-[10px] text-pink-700">
                      {sub.isActive ? 'ACTIVE' : 'SIMULATED OFF'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
