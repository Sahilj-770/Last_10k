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
      <div className="bg-white border border-[#e8e5dc] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-mono mb-2 border border-rose-200">
              <Flame className="w-3.5 h-3.5 text-rose-700" />
              <span>BLACK SWAN RESILIENCE PROTOCOL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#12141a] tracking-tight">
              Stress Test &amp; Emergency Shocks
            </h2>
            <p className="text-xs sm:text-sm text-[#5a6272] max-w-2xl mt-1 leading-relaxed">
              In college, life happens: broken phones, medical visits, train tickets home. Test your runway against 3 realistic financial shocks to see if your remaining ₹10K budget collapses or absorbs the hit.
            </p>
          </div>

          {activeScenario && (
            <button
              onClick={() => {
                onResetScenario();
                onShowToast('Emergency shock reset.');
              }}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-medium px-4 py-2.5 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Active Shock ({activeScenario.title})</span>
            </button>
          )}
        </div>
      </div>

      {/* 3 One-Click Shock Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {STRESS_SCENARIOS.map((scenario) => {
          const isApplied = activeScenario?.id === scenario.id;

          const revisedCash = metrics.currentCashBalance - scenario.amount;
          const revisedSpendable = Math.max(0, metrics.spendableBalance - scenario.amount);
          const revisedAllowance = Math.round(revisedSpendable / metrics.remainingDays);
          const essentialsRemainCovered = revisedCash >= metrics.totalUnpaidCommitments;

          return (
            <div
              key={scenario.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between text-xs ${
                isApplied
                  ? 'bg-rose-50/60 border-rose-300 shadow-md ring-2 ring-rose-400/20'
                  : 'bg-white border-[#e8e5dc] shadow-xs hover:border-[#12141a]/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-heading font-bold text-base text-[#12141a]">{scenario.title}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      isApplied
                        ? 'bg-rose-600 text-white border-rose-600 font-bold'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {isApplied ? 'APPLIED TO LEDGER' : 'SHOCK SCENARIO'}
                  </span>
                </div>

                <div className="text-3xl font-heading font-black text-rose-600 my-2">
                  -{formatINR(scenario.amount)}
                </div>

                <p className="text-xs text-[#5a6272] leading-relaxed mb-4">{scenario.description}</p>

                {/* Impact Preview Metrics */}
                <div className="space-y-2 bg-[#fbfaf7] p-3.5 rounded-xl border border-[#ede9df] mb-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#64748b]">Revised Cash in Hand:</span>
                    <strong className="text-[#12141a] font-mono">{formatINR(revisedCash)}</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#64748b]">Revised Safe Daily:</span>
                    <strong
                      className={`font-mono ${revisedAllowance < 75 ? 'text-rose-600' : 'text-emerald-700'}`}
                    >
                      {formatINR(revisedAllowance)}/day
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#64748b]">Commitments Safe?</span>
                    <strong className={essentialsRemainCovered ? 'text-emerald-700 font-mono' : 'text-rose-600 font-mono'}>
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
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
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
                    className="w-full py-2.5 bg-[#12141a] hover:bg-black text-[#ccff00] font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
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
      <div className="bg-white border border-[#e8e5dc] rounded-2xl p-5 text-xs text-[#5a6272] flex items-start gap-3 shadow-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-[#12141a] font-heading text-sm">Resilience Rating &amp; Buffer Guidelines:</strong>
          <p className="leading-relaxed">
            Stress testing calculations benchmark against your current spendable balance of{' '}
            <strong className="text-[#12141a] font-mono">{formatINR(metrics.spendableBalance)}</strong>. A healthy student budget maintains at least a ₹1,500 emergency buffer before committing to non-essential lifestyle purchases.
          </p>
        </div>
      </div>
    </div>
  );
};
