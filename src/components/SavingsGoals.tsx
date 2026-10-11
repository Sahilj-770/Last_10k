import React, { useState } from 'react';
import type { SavingsGoal, CalculatedMetrics } from '../types/finance';
import { formatINR } from '../utils/financeEngine';
import {
  PiggyBank,
  Plus,
  X,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';

interface SavingsGoalsProps {
  savingsGoals: SavingsGoal[];
  metrics: CalculatedMetrics;
  onContributeToGoal: (goalId: string, amount: number) => void;
  onShowToast: (msg: string) => void;
}

export const SavingsGoals: React.FC<SavingsGoalsProps> = ({
  savingsGoals,
  metrics,
  onContributeToGoal,
  onShowToast,
}) => {
  const [contributeAmount, setContributeAmount] = useState<number>(200);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const handleContribute = (goalId: string) => {
    if (contributeAmount <= 0) {
      alert('Please specify a positive contribution amount.');
      return;
    }
    if (contributeAmount > metrics.spendableBalance) {
      alert(
        `Insufficient spendable cash! You have ${formatINR(
          metrics.spendableBalance
        )} spendable, but are trying to lock ${formatINR(contributeAmount)}.`
      );
      return;
    }

    onContributeToGoal(goalId, contributeAmount);
    onShowToast(`Locked ${formatINR(contributeAmount)} into savings goal reserve!`);
    setSelectedGoalId(null);
  };

  return (
    <div className="bg-white border border-[#e8e5dc] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#ede9df]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60 mb-2">
            <PiggyBank className="w-3.5 h-3.5 text-emerald-600" />
            <span>CAPITAL PRESERVATION &amp; RESERVES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#12141a] tracking-tight">
            Ring-Fenced Savings Goals
          </h2>
          <p className="text-sm text-[#5a6272] max-w-2xl mt-1 leading-relaxed">
            Ring-fence funds from daily temptation. Money allocated here is shielded from your safe daily allowance calculations to guarantee end-of-month targets.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-[#f8f7f2] border border-[#e8e5dc] rounded-xl p-4 self-start md:self-auto">
          <div className="w-10 h-10 rounded-lg bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-emerald-800 font-black">
            <Lock className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <span className="text-[10px] text-[#64748b] font-medium uppercase tracking-wider block">TOTAL RING-FENCED</span>
            <strong className="text-2xl font-heading font-black text-emerald-700">
              {formatINR(metrics.totalSavingsAllocated)}
            </strong>
          </div>
        </div>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {savingsGoals.map((goal) => {
          const progressPercent = Math.min(
            100,
            Math.round((goal.currentAmount / goal.targetAmount) * 100)
          );
          const shortfall = Math.max(0, goal.targetAmount - goal.currentAmount);
          const requiredDailyRate =
            metrics.remainingDays > 0 ? Math.round(shortfall / metrics.remainingDays) : 0;
          const isAtRisk = requiredDailyRate > metrics.safeDailyAllowance;

          return (
            <div
              key={goal.id}
              className="bg-[#fbfaf7] border border-[#e8e5dc] rounded-xl p-5 flex flex-col justify-between hover:border-[#d6d0c2] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-heading font-bold text-base text-[#12141a]">{goal.title}</span>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70">
                    {progressPercent}% FUNDED
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl sm:text-3xl font-heading font-black text-[#12141a]">
                    {formatINR(goal.currentAmount)}
                  </span>
                  <span className="text-xs text-[#64748b] font-medium">
                    of {formatINR(goal.targetAmount)} target
                  </span>
                </div>

                {/* Progress Track */}
                <div className="w-full bg-[#ede9df] h-2.5 rounded-full my-3 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-t border-[#ede9df] text-xs">
                  <div>
                    <span className="text-[10px] text-[#64748b] block">Remaining Gap</span>
                    <strong className="text-[#12141a] font-semibold">{formatINR(shortfall)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748b] block">Target Day</span>
                    <strong className="text-[#12141a] font-semibold">Day {goal.targetDay}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748b] block">Required Pace</span>
                    <strong className="text-[#12141a] font-semibold">{formatINR(requiredDailyRate)}/d</strong>
                  </div>
                </div>

                {goal.description && (
                  <p className="text-xs text-[#64748b] italic pt-1 mb-3">
                    {goal.description}
                  </p>
                )}

                {/* Feasibility Warning */}
                {isAtRisk && (
                  <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 text-xs text-rose-800 flex items-start gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>
                      Required pace ({formatINR(requiredDailyRate)}/d) exceeds safe daily allowance ({formatINR(metrics.safeDailyAllowance)}/d). Consider reallocating or extending horizon.
                    </span>
                  </div>
                )}
              </div>

              {/* Action: Add Funds to Vault */}
              <div className="pt-3 border-t border-[#ede9df] mt-2">
                {selectedGoalId === goal.id ? (
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-2.5 top-2 text-xs text-[#64748b]">₹</span>
                      <input
                        type="number"
                        step="50"
                        min="50"
                        max={metrics.spendableBalance}
                        value={contributeAmount}
                        onChange={(e) => setContributeAmount(Number(e.target.value))}
                        className="w-full bg-white border border-[#12141a] pl-6 pr-2 py-1.5 rounded-lg text-xs font-semibold text-[#12141a] focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => handleContribute(goal.id)}
                      className="px-4 py-2 bg-[#12141a] hover:bg-black text-[#ccff00] font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Confirm Lock
                    </button>
                    <button
                      onClick={() => setSelectedGoalId(null)}
                      className="text-[#64748b] hover:text-[#12141a] p-1.5 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedGoalId(goal.id);
                      setContributeAmount(Math.min(250, metrics.spendableBalance));
                    }}
                    disabled={metrics.spendableBalance <= 0}
                    className="w-full py-2.5 bg-white hover:bg-[#ede9df]/50 text-[#12141a] border border-[#d6d0c2] rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#12141a]" />
                    <span>Lock Cash into Goal Vault</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
