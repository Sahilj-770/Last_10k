import React, { useState } from 'react';
import type { SavingsGoal, CalculatedMetrics } from '../types/finance';
import { formatINR } from '../utils/financeEngine';
import {
  PiggyBank,
  Plus,
  X,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Target,
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
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="bg-[#10121a] border border-[#1e212d] p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#22c55e] mb-1.5 uppercase tracking-wider">
              <PiggyBank className="w-4 h-4 text-[#22c55e]" />
              <span>CAPITAL PRESERVATION TARGETS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#faf7f0] tracking-tight">
              Savings Goals &amp; Reserves
            </h2>
            <p className="text-xs sm:text-sm text-[#8e96a8] max-w-2xl font-body mt-1 leading-relaxed">
              Ring-fence money from your daily spending temptations. Lock funds into dedicated goal vaults before non-essential purchases consume it.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#0a0b0f] border border-[#1e212d] p-3 text-xs font-mono">
            <div>
              <span className="text-[#717b8f] block uppercase">TOTAL SAVED</span>
              <strong className="text-lg text-[#22c55e] font-black">
                {formatINR(metrics.totalSavingsAllocated)}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Goal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              className="bg-[#10121a] border border-[#222533] p-5 flex flex-col justify-between font-mono text-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-[#faf7f0]">{goal.title}</span>
                  <span className="text-[10px] text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 border border-[#22c55e]/30">
                    {progressPercent}% FUNDED
                  </span>
                </div>

                <div className="flex items-baseline gap-2 my-2">
                  <span className="text-2xl font-heading font-black text-[#22c55e]">
                    {formatINR(goal.currentAmount)}
                  </span>
                  <span className="text-xs text-[#717b8f]">
                    of {formatINR(goal.targetAmount)} target
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#181a24] h-2 border border-[#232738] my-3 overflow-hidden">
                  <div
                    className="bg-[#22c55e] h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="space-y-1.5 text-[11px] text-[#8e96a8] border-t border-[#181a24] pt-2 mb-3">
                  <div>
                    Remaining Gap: <strong className="text-[#faf7f0]">{formatINR(shortfall)}</strong>
                  </div>
                  <div>
                    Target Horizon: <strong>Day {goal.targetDay}</strong> (Month End)
                  </div>
                  <div>
                    Required Pace: <strong>{formatINR(requiredDailyRate)}/day</strong>
                  </div>
                  {goal.description && (
                    <div className="text-[#656d80] text-[10px] mt-1">{goal.description}</div>
                  )}
                </div>

                {/* Feasibility Warning */}
                {isAtRisk && (
                  <div className="bg-[#241315] border border-[#ff4d4f]/40 p-2 text-[10px] text-[#ff4d4f] flex items-center gap-1.5 mb-3">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Required pace ({formatINR(requiredDailyRate)}/d) exceeds safe daily allowance ({formatINR(metrics.safeDailyAllowance)}/d)!
                    </span>
                  </div>
                )}
              </div>

              {/* Action: Add Funds to Vault */}
              <div className="pt-3 border-t border-[#181a24]">
                {selectedGoalId === goal.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="50"
                      min="50"
                      max={metrics.spendableBalance}
                      value={contributeAmount}
                      onChange={(e) => setContributeAmount(Number(e.target.value))}
                      className="w-24 bg-[#090a0f] border border-[#22c55e] px-2 py-1 text-xs text-[#faf7f0] focus:outline-none"
                    />
                    <button
                      onClick={() => handleContribute(goal.id)}
                      className="px-3 py-1 bg-[#22c55e] text-black font-bold text-xs"
                    >
                      Confirm Lock
                    </button>
                    <button
                      onClick={() => setSelectedGoalId(null)}
                      className="text-[#656d80] hover:text-[#faf7f0]"
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
                    className="w-full py-2 bg-[#161a26] hover:bg-[#202538] text-[#22c55e] border border-[#22c55e]/40 font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Transfer Cash to This Goal Vault</span>
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
