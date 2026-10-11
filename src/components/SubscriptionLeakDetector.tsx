import React, { useState } from 'react';
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
      <div className="bg-[#10121a] border border-[#1e212d] p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#ec4899] mb-1.5 uppercase tracking-wider">
              <TrendingDown className="w-4 h-4 text-[#ec4899]" />
              <span>RECURRING CASH LEAK RADAR</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#faf7f0] tracking-tight">
              Subscription Leak Detector
            </h2>
            <p className="text-xs sm:text-sm text-[#8e96a8] max-w-2xl font-body mt-1 leading-relaxed">
              Small monthly auto-debits eat away at your daily allowance silently. Toggle any subscription off to test what cancelling it immediately does to your 30-day runway.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-4 bg-[#090a0f] border border-[#1e212d] p-3 text-xs font-mono">
            <div>
              <span className="text-[#717b8f] block uppercase">ACTIVE SUBS</span>
              <strong className="text-lg text-[#ec4899] font-black">
                {formatINR(totalActiveMonthly)}/mo
              </strong>
            </div>
            <div className="w-px h-8 bg-[#232738]" />
            <div>
              <span className="text-[#717b8f] block uppercase">BUDGET DRAIN</span>
              <strong className="text-lg text-[#faf7f0] font-black">
                {budgetConsumedPercent}%
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Cards & Toggle Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subscriptions.map((sub) => {
          const percentOfBudget = ((sub.amount / startingBudget) * 100).toFixed(1);

          return (
            <div
              key={sub.id}
              className={`p-5 border transition-all flex flex-col justify-between font-mono text-xs ${
                sub.isActive
                  ? 'bg-[#10121a] border-[#222533] hover:border-[#383d54]'
                  : 'bg-[#090a0f] border-[#161822] opacity-60'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#ec4899] font-bold text-sm">{sub.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 border ${
                      sub.isActive
                        ? 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/30'
                        : 'bg-[#374151]/20 text-[#6b7280] border-[#374151]'
                    }`}
                  >
                    {sub.isActive ? 'ACTIVE BILL' : 'PAUSED'}
                  </span>
                </div>

                {/* Amount */}
                <div className="text-2xl font-heading font-black text-[#faf7f0] my-2">
                  {formatINR(sub.amount)}
                  <span className="text-xs font-mono text-[#717b8f] font-normal"> / month</span>
                </div>

                <div className="space-y-1.5 text-[11px] text-[#8e96a8] border-t border-[#181a24] pt-2 mb-3">
                  <div>
                    Renews on: <strong>Day {sub.renewalDay}</strong> of month
                  </div>
                  <div>
                    Consumes: <strong>{percentOfBudget}%</strong> of total ₹10K budget
                  </div>
                  <div>
                    Classification:{' '}
                    <span className={sub.isEssential ? 'text-[#60a5fa]' : 'text-[#f59e0b]'}>
                      {sub.isEssential ? 'Essential (Cloud backup)' : 'Discretionary'}
                    </span>
                  </div>
                  {sub.notes && <div className="text-[#656d80] text-[10px] mt-1">{sub.notes}</div>}
                </div>
              </div>

              {/* Interactive Simulation Toggle */}
              <div className="pt-3 border-t border-[#181a24] flex items-center justify-between">
                <span className="text-[10px] text-[#717b8f]">
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
                  className={`px-3 py-1.5 font-bold text-xs flex items-center gap-1.5 transition-colors ${
                    sub.isActive
                      ? 'bg-[#241318] hover:bg-[#381a24] text-[#ff4d4f] border border-[#48202b]'
                      : 'bg-[#121c10] hover:bg-[#1a2b16] text-[#ccff00] border border-[#ccff00]/40'
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
        <div className="bg-[#12141e] border border-[#ec4899]/30 p-4 text-xs font-mono flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-[#ec4899] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-[#faf7f0]">DISCRETIONARY SUBSCRIPTION AUDIT:</strong>
            <p className="text-[#a3adc2] leading-relaxed">
              Cancelling non-essential streaming and gaming auto-debits would immediately free up{' '}
              <strong className="text-[#ccff00]">{formatINR(potentialSavings)}</strong>, adding ~
              <strong className="text-[#ccff00]">
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
