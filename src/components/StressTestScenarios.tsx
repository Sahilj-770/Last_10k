import React from 'react';
import type { StressScenario, CalculatedMetrics } from '../types/finance';
import { STRESS_SCENARIOS } from '../data/initialFinanceData';
import { formatINR } from '../utils/financeEngine';
import { Flame, AlertTriangle, ShieldCheck, RotateCcw, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface StressTestScenariosProps {
  metrics: CalculatedMetrics;
  activeScenario: StressScenario | null;
  onApplyScenario: (scenario: StressScenario) => void;
  onResetScenario: () => void;
  onShowToast: (msg: string) => void;
}

export const StressTestScenarios: React.FC<StressTestScenariosProps> = ({
  metrics,
  activeScenario,
  onApplyScenario,
  onResetScenario,
  onShowToast,
}) => {
  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="bg-[#10121a] border border-[#1e212d] p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#ff4d4f] mb-1.5 uppercase tracking-wider">
              <Flame className="w-4 h-4 text-[#ff4d4f]" />
              <span>BLACK SWAN RESILIENCE PROTOCOL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#faf7f0] tracking-tight">
              Stress Test &amp; Emergency Shocks
            </h2>
            <p className="text-xs sm:text-sm text-[#8e96a8] max-w-2xl font-body mt-1 leading-relaxed">
              In college, life happens: broken phones, medical visits, train tickets home. Test your runway against 3 realistic financial shocks to see if your remaining ₹10K budget collapses or absorbs the hit.
            </p>
          </div>

          {activeScenario && (
            <button
              onClick={() => {
                onResetScenario();
                onShowToast('Emergency shock reset.');
              }}
              className="bg-[#241318] hover:bg-[#381a24] text-[#ff4d4f] border border-[#ff4d4f]/40 font-mono text-xs px-4 py-2 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Active Shock ({activeScenario.title})</span>
            </button>
          )}
        </div>
      </div>

      {/* 3 One-Click Shock Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STRESS_SCENARIOS.map((scenario) => {
          const isApplied = activeScenario?.id === scenario.id;

          // Compute impact if applied
          const revisedCash = metrics.currentCashBalance - scenario.amount;
          const revisedSpendable = Math.max(0, metrics.spendableBalance - scenario.amount);
          const revisedAllowance = Math.round(revisedSpendable / metrics.remainingDays);
          const essentialsRemainCovered = revisedCash >= metrics.totalUnpaidCommitments;

          return (
            <div
              key={scenario.id}
              className={`p-5 border transition-all flex flex-col justify-between font-mono text-xs ${
                isApplied
                  ? 'bg-[#1e1115] border-[#ff4d4f] shadow-2xl'
                  : 'bg-[#10121a] border-[#222533] hover:border-[#3a3f55]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-[#faf7f0]">{scenario.title}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 border font-semibold ${
                      isApplied
                        ? 'bg-[#ff4d4f] text-black border-[#ff4d4f]'
                        : 'bg-[#ff4d4f]/10 text-[#ff4d4f] border-[#ff4d4f]/30'
                    }`}
                  >
                    {isApplied ? 'APPLIED TO LEDGER' : 'SHOCK SCENARIO'}
                  </span>
                </div>

                <div className="text-3xl font-heading font-black text-[#ff4d4f] my-2">
                  -{formatINR(scenario.amount)}
                </div>

                <p className="text-xs text-[#8e96a8] leading-relaxed mb-4">{scenario.description}</p>

                {/* Impact Preview Metrics */}
                <div className="space-y-2 bg-[#090a0f] p-3 border border-[#1b1e2c] mb-4">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#717b8f]">Revised Cash in Hand:</span>
                    <strong className="text-[#faf7f0]">{formatINR(revisedCash)}</strong>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#717b8f]">Revised Safe Daily:</span>
                    <strong
                      className={revisedAllowance < 75 ? 'text-[#ff4d4f]' : 'text-[#ccff00]'}
                    >
                      {formatINR(revisedAllowance)}/day
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#717b8f]">Commitments Safe?</span>
                    <strong className={essentialsRemainCovered ? 'text-[#22c55e]' : 'text-[#ff4d4f]'}>
                      {essentialsRemainCovered ? 'YES // COVERED' : 'NO // DEFICIT'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                {isApplied ? (
                  <button
                    onClick={() => {
                      onResetScenario();
                      onShowToast('Shock test removed.');
                    }}
                    className="w-full py-2 bg-[#ff4d4f] hover:bg-[#e03b3d] text-black font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Remove Shock from Ledger</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onApplyScenario(scenario);
                      onShowToast(`Stress Test Applied: -₹${scenario.amount} deducted!`);
                    }}
                    className="w-full py-2 bg-[#1a1e2b] hover:bg-[#ff4d4f] text-[#ff4d4f] hover:text-black border border-[#ff4d4f]/40 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Apply This Shock to Ledger</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Advisory Note */}
      <div className="bg-[#12141e] border border-[#1e212d] p-4 text-xs font-mono text-[#8e96a8] flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-[#ccff00] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-[#faf7f0]">RESILIENCE RATING // METHODOLOGY:</strong>
          <p>
            Illustrative stress testing calculations based on your current spendable balance of{' '}
            <strong className="text-[#ccff00]">{formatINR(metrics.spendableBalance)}</strong>. A healthy budget maintains at least a ₹1,500 emergency buffer before committing to non-essential lifestyle purchases.
          </p>
        </div>
      </div>
    </div>
  );
};
