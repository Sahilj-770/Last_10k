import React, { useState } from 'react';
import type {
  SimulationProposal,
  SimulationResult,
  TransactionCategory,
  CalculatedMetrics,
} from '../types/finance';
import { CATEGORY_META, formatINR } from '../utils/financeEngine';
import {
  Zap,
  ArrowRight,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  RotateCcw,
  Clock,
  HelpCircle,
  Tag,
  ShieldAlert,
} from 'lucide-react';

interface SpendingSimulatorProps {
  currentDay: number;
  totalDays: number;
  metrics: CalculatedMetrics;
  activeResult: SimulationResult | null;
  onSimulate: (proposal: SimulationProposal) => void;
  onCommit: () => void;
  onCancel: () => void;
  onShowToast: (msg: string) => void;
}

export const SpendingSimulator: React.FC<SpendingSimulatorProps> = ({
  currentDay,
  totalDays,
  metrics,
  activeResult,
  onSimulate,
  onCommit,
  onCancel,
  onShowToast,
}) => {
  const [amount, setAmount] = useState<number>(1500);
  const [title, setTitle] = useState<string>('Wireless ANC Headphones');
  const [category, setCategory] = useState<TransactionCategory>('entertainment');
  const [day, setDay] = useState<number>(currentDay);
  const [isEssential, setIsEssential] = useState<boolean>(false);

  // Quick simulation presets
  const presets = [
    { title: 'Wireless ANC Headphones', amount: 1500, category: 'entertainment' as TransactionCategory, essential: false },
    { title: 'Late Night Swiggy Biryani Feast', amount: 480, category: 'food' as TransactionCategory, essential: false },
    { title: 'Weekend Roadtrip Split', amount: 2200, category: 'transport' as TransactionCategory, essential: false },
    { title: 'Campus Fest Gold Pass', amount: 800, category: 'entertainment' as TransactionCategory, essential: false },
    { title: 'New Reference Textbook Set', amount: 1200, category: 'academics' as TransactionCategory, essential: true },
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setTitle(p.title);
    setAmount(p.amount);
    setCategory(p.category);
    setIsEssential(p.essential);
    // Auto-trigger simulation preview
    onSimulate({
      title: p.title,
      amount: p.amount,
      category: p.category,
      day,
      isEssential: p.essential,
    });
  };

  const handleTriggerSimulate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    if (!title.trim()) {
      alert('Please enter an item or expense name.');
      return;
    }

    onSimulate({
      title: title.trim(),
      amount: Math.abs(amount),
      category,
      day,
      isEssential,
    });
  };

  const handleCommitPurchase = () => {
    onCommit();
    onShowToast(`Decision committed! ₹${amount} logged to your ledger.`);
  };

  const handleCancel = () => {
    onCancel();
    onShowToast('Simulation cancelled. Ledger untouched.');
  };

  // If no simulation is loaded yet, run the default headphone simulation preview on mount/render
  React.useEffect(() => {
    if (!activeResult) {
      onSimulate({
        title,
        amount,
        category,
        day,
        isEssential,
      });
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="bg-[#10121a] border border-[#1e212d] p-5 sm:p-6">
        <div className="flex items-center gap-2 text-xs font-mono text-[#ccff00] mb-1.5 uppercase tracking-wider">
          <Zap className="w-4 h-4 text-[#ccff00]" />
          <span>SIGNATURE CAPABILITY // DECISION IMPACT ENGINE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#faf7f0] tracking-tight">
          Spending Simulator
        </h2>
        <p className="text-xs sm:text-sm text-[#8e96a8] max-w-2xl font-body mt-1 leading-relaxed">
          Test any purchase before you spend a single rupee. See the real domino effect on your safe daily allowance, month-end forecast, and survival risk level before committing.
        </p>

        {/* Quick Presets Strip */}
        <div className="mt-4 pt-3 border-t border-[#181a24] flex items-center gap-2 flex-wrap text-xs font-mono">
          <span className="text-[#656d80] text-[11px] uppercase mr-1">TRY REAL PRESETS:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(p)}
              className="px-2.5 py-1 bg-[#141722] hover:bg-[#1e2233] text-[#a3adc2] hover:text-[#faf7f0] border border-[#232738] transition-colors"
            >
              {p.title} ({formatINR(p.amount)})
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Simulator Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Simulation Inputs Form (5 cols) */}
        <div className="lg:col-span-5 bg-[#10121a] border border-[#1e212d] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#181a24] pb-2 text-xs font-mono">
            <span className="font-bold text-[#faf7f0] uppercase tracking-wider">
              1. PROPOSED EXPENSE PARAMETERS
            </span>
            <span className="text-[#ccff00]">LIVE PREVIEW</span>
          </div>

          <form onSubmit={handleTriggerSimulate} className="space-y-4 text-xs font-mono">
            {/* Amount */}
            <div>
              <label className="block text-[#a3adc2] mb-1 font-semibold">
                HOW MUCH DO YOU WANT TO SPEND? (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold text-[#ccff00]">
                  ₹
                </span>
                <input
                  type="number"
                  min="1"
                  step="10"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-[#090a0f] border border-[#232738] pl-8 pr-3 py-2.5 text-xl font-heading font-black text-[#faf7f0] focus:border-[#ccff00] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[#a3adc2] mb-1 font-semibold">
                WHAT ARE YOU BUYING? *
              </label>
              <input
                type="text"
                placeholder="e.g. Wireless ANC Headphones"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#090a0f] border border-[#232738] px-3 py-2.5 text-sm font-body text-[#faf7f0] focus:border-[#ccff00] focus:outline-none"
                required
              />
            </div>

            {/* Category & Day */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#a3adc2] mb-1 font-semibold">CATEGORY</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                  className="w-full bg-[#090a0f] border border-[#232738] px-2.5 py-2 text-[#faf7f0] focus:border-[#ccff00] focus:outline-none"
                >
                  {Object.entries(CATEGORY_META).map(([key, meta]) => (
                    <option key={key} value={key}>
                      {meta.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#a3adc2] mb-1 font-semibold">DAY OF EXPENSE</label>
                <select
                  value={day}
                  onChange={(e) => setDay(Number(e.target.value))}
                  className="w-full bg-[#090a0f] border border-[#232738] px-2.5 py-2 text-[#faf7f0] focus:border-[#ccff00] focus:outline-none"
                >
                  {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      Day {d} {d === currentDay ? '(Today)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Essential vs Discretionary Toggle */}
            <div className="bg-[#090a0f] border border-[#1e212d] p-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#faf7f0] block">IS THIS ESSENTIAL?</span>
                <span className="text-[10px] text-[#717b8f]">
                  Non-essential purchases drain discretionary buffer.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsEssential(!isEssential)}
                className={`px-3 py-1 font-mono text-xs font-bold transition-colors ${
                  isEssential
                    ? 'bg-[#10b981] text-black'
                    : 'bg-[#1f2333] text-[#a3adc2] hover:text-white'
                }`}
              >
                {isEssential ? 'ESSENTIAL' : 'DISCRETIONARY'}
              </button>
            </div>

            {/* Recalculate Button */}
            <button
              type="submit"
              className="w-full py-2.5 bg-[#1a1e2b] hover:bg-[#252b3d] text-[#ccff00] border border-[#ccff00]/40 font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Update Simulation</span>
            </button>
          </form>
        </div>

        {/* Right Column: Live Impact Comparison & Decision Actions (7 cols) */}
        <div className="lg:col-span-7 bg-[#10121a] border border-[#1e212d] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#181a24] pb-2 text-xs font-mono mb-4">
              <span className="font-bold text-[#faf7f0] uppercase tracking-wider">
                2. FINANCIAL CONSEQUENCE MATRIX
              </span>
              <span className="text-[#a3adc2]">
                STATUS: {activeResult ? 'CALCULATED' : 'WAITING FOR INPUT'}
              </span>
            </div>

            {activeResult ? (
              <div className="space-y-4">
                {/* Before vs After Impact Comparison Grid */}
                <div className="grid grid-cols-3 gap-3 font-mono">
                  {/* Metric 1: Cash Balance */}
                  <div className="bg-[#090a0f] border border-[#1e212d] p-3">
                    <div className="text-[10px] text-[#717b8f] uppercase">CASH BALANCE</div>
                    <div className="text-xs text-[#8e96a8] line-through mt-0.5">
                      {formatINR(activeResult.balanceBefore)}
                    </div>
                    <div className="text-xl font-heading font-black text-[#faf7f0] mt-0.5">
                      {formatINR(activeResult.balanceAfter)}
                    </div>
                    <div className="text-[10px] text-[#ff4d4f] font-semibold mt-1">
                      -{formatINR(activeResult.proposal.amount)}
                    </div>
                  </div>

                  {/* Metric 2: Safe Daily Allowance */}
                  <div className="bg-[#090a0f] border border-[#1e212d] p-3">
                    <div className="text-[10px] text-[#717b8f] uppercase">DAILY ALLOWANCE</div>
                    <div className="text-xs text-[#8e96a8] line-through mt-0.5">
                      {formatINR(activeResult.allowanceBefore)}/d
                    </div>
                    <div
                      className={`text-xl font-heading font-black mt-0.5 ${
                        activeResult.allowanceAfter < 80 ? 'text-[#ff4d4f]' : 'text-[#ccff00]'
                      }`}
                    >
                      {formatINR(activeResult.allowanceAfter)}/d
                    </div>
                    <div className="text-[10px] text-[#ff4d4f] font-semibold mt-1">
                      -{formatINR(activeResult.allowanceBefore - activeResult.allowanceAfter)}/d
                    </div>
                  </div>

                  {/* Metric 3: Month-End Forecast */}
                  <div className="bg-[#090a0f] border border-[#1e212d] p-3">
                    <div className="text-[10px] text-[#717b8f] uppercase">MONTH-END</div>
                    <div className="text-xs text-[#8e96a8] line-through mt-0.5">
                      {formatINR(activeResult.forecastBefore)}
                    </div>
                    <div
                      className={`text-xl font-heading font-black mt-0.5 ${
                        activeResult.forecastAfter < 0 ? 'text-[#ff4d4f]' : 'text-[#faf7f0]'
                      }`}
                    >
                      {formatINR(activeResult.forecastAfter)}
                    </div>
                    <div className="text-[10px] text-[#717b8f] mt-1">
                      {activeResult.forecastAfter < 0 ? 'DEFICIT RISK' : 'CUSHION REMAINING'}
                    </div>
                  </div>
                </div>

                {/* Risk Shift Alert Box */}
                <div
                  className={`p-3.5 border text-xs font-mono ${
                    activeResult.simulated.risk.level === 'AT_RISK'
                      ? 'bg-[#291315] border-[#ff4d4f]/60 text-[#ff4d4f]'
                      : activeResult.simulated.risk.level === 'CAUTION'
                      ? 'bg-[#261d0f] border-[#f59e0b]/60 text-[#fbbf24]'
                      : 'bg-[#121c10] border-[#ccff00]/40 text-[#ccff00]'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>
                      RISK TRAJECTORY: {activeResult.baseline.risk.level} &rarr;{' '}
                      {activeResult.simulated.risk.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#d1d5db] leading-relaxed">
                    {activeResult.warnings.length > 0
                      ? activeResult.warnings[0]
                      : 'This expense fits comfortably within your current discretionary safety allowance.'}
                  </p>
                </div>

                {/* 3 Actionable Alternatives to Consider */}
                <div>
                  <div className="text-xs font-mono text-[#8e96a8] mb-2 uppercase tracking-wider flex items-center justify-between">
                    <span>STRATEGIC ALTERNATIVES</span>
                    <span className="text-[10px] text-[#656d80]">Transparent scenario modeling</span>
                  </div>
                  <div className="space-y-2">
                    {activeResult.alternatives.map((alt) => (
                      <div
                        key={alt.id}
                        className="p-3 bg-[#090a0f] border border-[#1b1e2c] hover:border-[#2e3346] text-xs font-mono transition-colors"
                      >
                        <div className="flex items-center justify-between font-bold mb-0.5">
                          <span className="text-[#faf7f0]">{alt.title}</span>
                          <span className="text-[#ccff00]">{formatINR(alt.amount)}</span>
                        </div>
                        <p className="text-[11px] text-[#8e96a8] mb-1">{alt.description}</p>
                        <div className="flex items-center gap-3 text-[10px] text-[#717b8f] pt-1 border-t border-[#161822]">
                          <span>Daily: <strong>{formatINR(alt.dailyAllowance)}/d</strong></span>
                          <span>Month-End: <strong>{formatINR(alt.monthEndForecast)}</strong></span>
                          <span className="text-[#d1d5db]">Risk: {alt.riskLevel}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Decision Actions Bar */}
          <div className="pt-4 border-t border-[#181a24] flex items-center justify-between gap-3 mt-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2.5 bg-[#141620] hover:bg-[#1d202e] text-[#a3adc2] hover:text-[#faf7f0] border border-[#252838] text-xs font-mono transition-colors"
            >
              Cancel Simulation
            </button>

            <button
              onClick={handleCommitPurchase}
              className="px-6 py-2.5 bg-[#ccff00] hover:bg-[#b8e600] text-black font-heading font-black text-xs sm:text-sm tracking-tight transition-all flex items-center gap-2 shadow-2xl active:scale-98 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Commit Decision &amp; Deduct ₹{amount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
