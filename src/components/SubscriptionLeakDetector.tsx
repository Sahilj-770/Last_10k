import React from 'react';
import type { Subscription } from '../types/finance';
import { formatINR } from '../utils/financeEngine';
import {
  TrendingDown,
  Power,
  AlertTriangle,
  CheckCircle2,
  Plus,
  X,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';

interface SubscriptionLeakDetectorProps {
  subscriptions: Subscription[];
  startingBudget: number;
  onToggleSubscription: (id: string) => void;
  onAddSubscription?: (sub: Subscription) => void;
  onShowToast: (msg: string) => void;
}

export const SubscriptionLeakDetector: React.FC<SubscriptionLeakDetectorProps> = ({
  subscriptions,
  startingBudget,
  onToggleSubscription,
  onShowToast,
}) => {
  const activeSubs = subscriptions.filter((s) => s.isActive);
  const totalActiveMonthly = activeSubs.reduce((sum, s) => sum + s.amount, 0);
  const budgetConsumedPercent = ((totalActiveMonthly / startingBudget) * 100).toFixed(1);

  // Total potential savings if non-essential subscriptions were cancelled
  const discretionarySubs = activeSubs.filter((s) => !s.isEssential);
  const potentialSavings = discretionarySubs.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="bg-white border border-[#e8e5dc] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-xs font-mono mb-2 border border-pink-200">
              <TrendingDown className="w-3.5 h-3.5 text-pink-700" />
              <span>RECURRING CASH LEAK RADAR</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#12141a] tracking-tight">
              Subscription Leak Detector
            </h2>
            <p className="text-xs sm:text-sm text-[#5a6272] max-w-2xl mt-1 leading-relaxed">
              Small monthly auto-debits eat away at your daily allowance silently. Toggle any subscription off to test what cancelling it immediately does to your 30-day runway.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-4 bg-[#fbfaf7] border border-[#e8e5dc] rounded-xl p-3.5 text-xs">
            <div>
              <span className="text-[#8c95a6] block text-[10px] uppercase font-mono">Active Subscriptions</span>
              <strong className="text-xl text-pink-700 font-heading font-black">
                {formatINR(totalActiveMonthly)}<span className="text-xs text-[#8c95a6] font-normal">/mo</span>
              </strong>
            </div>
            <div className="w-px h-8 bg-[#e8e5dc]" />
            <div>
              <span className="text-[#8c95a6] block text-[10px] uppercase font-mono">Budget Drain</span>
              <strong className="text-xl text-[#12141a] font-heading font-black">
                {budgetConsumedPercent}%
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Cards & Toggle Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {subscriptions.map((sub) => {
          const percentOfBudget = ((sub.amount / startingBudget) * 100).toFixed(1);

          return (
            <div
              key={sub.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between text-xs ${
                sub.isActive
                  ? 'bg-white border-[#e8e5dc] shadow-xs hover:border-[#12141a]/40'
                  : 'bg-[#fbfaf7] border-[#ede9df] opacity-60'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#12141a] font-heading font-bold text-base">{sub.name}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      sub.isActive
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-medium'
                        : 'bg-stone-100 text-stone-500 border-stone-200'
                    }`}
                  >
                    {sub.isActive ? 'ACTIVE BILL' : 'PAUSED'}
                  </span>
                </div>

                {/* Amount */}
                <div className="text-3xl font-heading font-black text-[#12141a] my-2">
                  {formatINR(sub.amount)}
                  <span className="text-xs font-mono text-[#8c95a6] font-normal"> / month</span>
                </div>

                <div className="space-y-1.5 text-xs text-[#5a6272] border-t border-[#ede9df] pt-3 mb-4">
                  <div className="flex justify-between">
                    <span>Renews on:</span>
                    <strong className="text-[#12141a] font-mono">Day {sub.renewalDay} of month</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Budget Consumed:</span>
                    <strong className="text-[#12141a] font-mono">{percentOfBudget}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Classification:</span>
                    <span className={sub.isEssential ? 'text-blue-700 font-medium' : 'text-amber-700 font-medium'}>
                      {sub.isEssential ? 'Essential (Cloud backup)' : 'Discretionary'}
                    </span>
                  </div>
                  {sub.notes && <div className="text-[#8c95a6] text-[11px] pt-1">{sub.notes}</div>}
                </div>
              </div>

              {/* Interactive Simulation Toggle */}
              <div className="pt-3 border-t border-[#ede9df] flex items-center justify-between">
                <span className="text-[11px] text-[#8c95a6]">
                  {sub.isActive ? 'Simulate cancellation' : 'Simulate reactivation'}
                </span>
                <button
                  onClick={() => {
                    onToggleSubscription(sub.id);
                    onShowToast(
                      sub.isActive
                        ? `Paused ${sub.name}: +₹${sub.amount} freed for your month-end forecast!`
                        : `Reactivated ${sub.name}: -₹${sub.amount} committed.`
                    );
                  }}
                  className={`px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                    sub.isActive
                      ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{sub.isActive ? 'Simulate Cancel' : 'Reactivate'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Strategic Insight Box */}
      {potentialSavings > 0 && (
        <div className="bg-[#fffbeb] border border-amber-200 rounded-2xl p-5 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-amber-900 font-heading text-sm">Discretionary Subscription Audit Recommendation:</strong>
            <p className="text-amber-800 leading-relaxed text-xs">
              Cancelling non-essential streaming and gaming auto-debits would immediately free up{' '}
              <strong className="text-emerald-800">{formatINR(potentialSavings)}</strong>, adding ~
              <strong className="text-emerald-800 font-mono">
                {formatINR(Math.round(potentialSavings / 19))}/day
              </strong>{' '}
              to your remaining daily discretionary allowance.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
