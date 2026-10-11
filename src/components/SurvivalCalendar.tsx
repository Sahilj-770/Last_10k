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
  // Day 1 starts with ₹10,000 starting budget
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
      // Projected future days: subtract unpaid commitments and average safe daily allowance
      runningBalance = runningBalance - dayCommittedUnpaid - metrics.safeDailyAllowance;
    }
    dayBalances[d] = Math.round(runningBalance);
  }

  const selectedTxs = transactionsByDay[selectedDay] || [];
  const selectedSubscriptions = subscriptions.filter((s) => s.renewalDay === selectedDay);

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="bg-[#10121a] border border-[#1e212d] p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#ccff00] mb-1.5 uppercase tracking-wider">
              <CalendarIcon className="w-4 h-4 text-[#ccff00]" />
              <span>CHRONOLOGICAL FINANCIAL LIFELINE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#faf7f0] tracking-tight">
              30-Day Survival Calendar
            </h2>
            <p className="text-xs sm:text-sm text-[#8e96a8] max-w-2xl font-body mt-1 leading-relaxed">
              Track historical expenses, upcoming mandatory bills, and predicted daily spending pace. High financial pressure days are flagged to prevent mid-month insolvency.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#0a0b0f] border border-[#1e212d] p-3 text-xs font-mono">
            <div>
              <span className="text-[#717b8f] block">CURRENT POSITION</span>
              <strong className="text-[#ccff00] text-sm">DAY {currentDay} OF {totalDays}</strong>
            </div>
            <div className="w-px h-8 bg-[#232738]" />
            <div>
              <span className="text-[#717b8f] block">SAFE DAILY</span>
              <strong className="text-[#faf7f0] text-sm">{formatINR(metrics.safeDailyAllowance)}/d</strong>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-[#181a24] text-xs font-mono text-[#8a92a3]">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3b4254]" /> Past Recorded Day
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#ccff00]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ccff00]" /> Today (Day {currentDay})
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#f59e0b]">
            <span className="w-2.5 h-2.5 bg-[#f59e0b]" /> Mandatory Commitment Due
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#ff4d4f]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff4d4f]" /> High Pressure Point
          </span>
        </div>
      </div>

      {/* 30-Day Calendar Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
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
              className={`p-3 border transition-all cursor-pointer relative flex flex-col justify-between min-h-[95px] font-mono ${
                isSelected
                  ? 'border-[#ccff00] bg-[#171a24] shadow-xl'
                  : isToday
                  ? 'border-[#ccff00]/60 bg-[#121622]'
                  : isPast
                  ? 'border-[#1a1d28] bg-[#0c0d14] hover:border-[#2e3346]'
                  : 'border-[#1a1d28] bg-[#0e1017] hover:border-[#2e3346]'
              }`}
            >
              {/* Day Number & Status */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm font-bold ${
                    isToday
                      ? 'text-[#ccff00]'
                      : isSelected
                      ? 'text-[#faf7f0]'
                      : isPast
                      ? 'text-[#8a92a3]'
                      : 'text-[#656d80]'
                  }`}
                >
                  DAY {d}
                </span>

                {isToday ? (
                  <span className="text-[9px] bg-[#ccff00] text-black px-1.5 py-0.2 font-bold">
                    TODAY
                  </span>
                ) : isHighPressure ? (
                  <span className="w-2 h-2 rounded-full bg-[#ff4d4f]" title="High financial pressure" />
                ) : hasCommitment ? (
                  <span className="w-2 h-2 bg-[#f59e0b]" title="Commitment due" />
                ) : null}
              </div>

              {/* Day Value Readout */}
              <div className="my-1.5">
                {isPast ? (
                  dayTotalSpent > 0 ? (
                    <div>
                      <div className="text-xs font-semibold text-[#faf7f0]">
                        -{formatINR(dayTotalSpent)}
                      </div>
                      <div className="text-[10px] text-[#717b8f]">{dayTxs.length} entries</div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-[#555d70]">Zero spend</div>
                  )
                ) : isToday ? (
                  <div>
                    <div className="text-xs font-semibold text-[#ccff00]">
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
                        <div className="text-xs font-bold text-[#f59e0b]">
                          Bill: {formatINR(dayCommitted)}
                        </div>
                        <div className="text-[10px] text-[#717b8f]">Commitment</div>
                      </div>
                    ) : daySubs.length > 0 ? (
                      <div>
                        <div className="text-xs text-[#ec4899]">
                          Sub: {formatINR(daySubs[0].amount)}
                        </div>
                        <div className="text-[10px] text-[#717b8f]">{daySubs[0].name}</div>
                      </div>
                    ) : (
                      <div className="text-[10px] text-[#555d70]">
                        Pace: ~{formatINR(metrics.safeDailyAllowance)}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Projected Closing Balance on That Day */}
              <div className="text-[10px] text-[#656d80] pt-1 border-t border-[#181a24] flex justify-between items-center">
                <span>EOD:</span>
                <span className={dayBalances[d] < 0 ? 'text-[#ff4d4f] font-bold' : 'text-[#8a92a3]'}>
                  {formatINR(dayBalances[d])}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Day Inspection Drawer / Detail Panel */}
      <div className="bg-[#10121a] border border-[#1e212d] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#181a24]">
          <div className="flex items-center gap-3">
            <span className="font-heading font-black text-xl text-[#faf7f0]">
              Day {selectedDay} Audit &amp; Ledger
            </span>
            <span className="text-xs font-mono text-[#ccff00]">
              {selectedDay === currentDay
                ? '(TODAY)'
                : selectedDay < currentDay
                ? '(PAST RECORD)'
                : '(FUTURE FORECAST)'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-[#8a92a3]">
              Projected Balance at Day {selectedDay} Close:{' '}
              <strong className="text-[#faf7f0]">{formatINR(dayBalances[selectedDay])}</strong>
            </span>
            <button
              onClick={() => onOpenSimulatorForDay(selectedDay)}
              className="bg-[#181b28] hover:bg-[#25293d] text-[#ccff00] border border-[#ccff00]/40 px-3 py-1.5 transition-colors"
            >
              Simulate on Day {selectedDay} &rarr;
            </button>
          </div>
        </div>

        {/* Transactions list for selected day */}
        <div className="mt-4">
          {selectedTxs.length === 0 && selectedSubscriptions.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-[#656d80]">
              No discrete transactions recorded on Day {selectedDay}.
              {selectedDay > currentDay && (
                <span className="block mt-1 text-[#8a92a3]">
                  Projected discretionary spending pace: ~{formatINR(metrics.safeDailyAllowance)}/day.
                </span>
              )}
            </div>
          ) : (
            <div className="space-y-2 font-mono text-xs">
              {selectedTxs.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 bg-[#090a0f] border border-[#1b1e2c] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        tx.type === 'commitment'
                          ? 'bg-[#f59e0b]'
                          : tx.type === 'income'
                          ? 'bg-[#22c55e]'
                          : 'bg-[#ff4d4f]'
                      }`}
                    />
                    <div>
                      <div className="font-bold text-[#faf7f0]">{tx.title}</div>
                      <div className="text-[11px] text-[#717b8f]">
                        {CATEGORY_META[tx.category]?.label} &middot;{' '}
                        {tx.isEssential ? 'Essential' : 'Discretionary'}
                        {tx.notes && ` · ${tx.notes}`}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-black text-sm ${
                        tx.type === 'income' ? 'text-[#22c55e]' : 'text-[#faf7f0]'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}
                      {formatINR(tx.amount)}
                    </div>
                    <span className="text-[10px] text-[#717b8f]">
                      {tx.type === 'commitment' ? (tx.isPaid ? 'PAID' : 'UNPAID COMMITMENT') : 'RECORDED'}
                    </span>
                  </div>
                </div>
              ))}

              {/* Subscriptions renewing on this day */}
              {selectedSubscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-3 bg-[#13101b] border border-[#ec4899]/30 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#ec4899]" />
                    <div>
                      <div className="font-bold text-[#ec4899]">{sub.name} (Recurring)</div>
                      <div className="text-[11px] text-[#8a92a3]">Scheduled Subscription Renewal</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm text-[#ec4899]">-{formatINR(sub.amount)}</div>
                    <span className="text-[10px] text-[#a3adc2]">
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
