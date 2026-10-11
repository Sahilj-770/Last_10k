import React, { useState, useEffect } from 'react';
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
  ArrowDownRight,
  Info,
  Sliders,
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

  // College-life realistic presets
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
  };

  const handleTriggerSimulate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!amount || amount <= 0) return;
    if (!title.trim()) return;

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

  // Immediate real-time reactive calculation as slider or fields change
  useEffect(() => {
    if (amount > 0 && title.trim()) {
      onSimulate({
        title: title.trim(),
        amount: Math.abs(amount),
        category,
        day,
        isEssential,
      });
    }
  }, [amount, title, category, day, isEssential]);

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="bg-white border border-[#e8e5dc] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#12141a] text-[#ccff00] rounded-full text-xs font-mono mb-2">
            <Zap className="w-3.5 h-3.5 fill-[#ccff00]" />
            <span>THE SIGNATURE CAPABILITY &middot; PROSPECTIVE PURCHASE SIMULATOR</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-[#12141a] tracking-tight mb-2">
            See the future before you spend.
          </h2>
          <p className="text-sm text-[#5a6272] leading-relaxed">
            Test any purchase before committing. Move the responsive amount slider below to immediately watch the consequence matrix update before a single rupee leaves your hands.
          </p>
        </div>

        {/* Quick Example Scenarios Bar */}
        <div className="mt-5 pt-4 border-t border-[#ede9df] flex items-center gap-2 flex-wrap text-xs">
          <span className="font-medium text-[#717b8f] uppercase text-[11px] mr-1">Try College Presets:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(p)}
              className="px-3 py-1.5 bg-[#f6f4ee] hover:bg-[#ede9df] text-[#12141a] border border-[#e8e5dc] rounded-md transition-colors cursor-pointer font-medium"
            >
              {p.title} <strong className="text-emerald-700 ml-1">({formatINR(p.amount)})</strong>
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Simulator Workspace (Fluid 12-col grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Purchase Parameters Input (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#e8e5dc] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#ede9df] mb-5">
              <h3 className="font-heading font-bold text-base text-[#12141a]">
                1. Proposed Purchase
              </h3>
              <span className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Live Reactive Modeling
              </span>
            </div>

            <form onSubmit={handleTriggerSimulate} className="space-y-4 text-xs">
              {/* Amount Input (Oversized digits) */}
              <div>
                <label className="block text-xs font-semibold text-[#12141a] uppercase tracking-wide mb-1.5">
                  How much does it cost? (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-2xl font-bold text-[#12141a]">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="10"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-[#fbfaf7] border border-[#d6d2c4] rounded-xl pl-9 pr-4 py-3 text-2xl sm:text-3xl font-heading font-black text-[#12141a] focus:bg-white focus:border-[#12141a] focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Real-Time Responsive Slider */}
                <div className="mt-3 p-3 bg-[#fbfaf7] border border-[#e8e5dc] rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#64748b]">
                    <span className="flex items-center gap-1.5">
                      <Sliders className="w-3 h-3 text-[#12141a]" />
                      <span>Drag Amount Slider</span>
                    </span>
                    <span className="font-bold text-[#12141a]">{formatINR(amount)}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max={Math.max(4000, metrics.spendableBalance)}
                    step="25"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full accent-[#12141a] cursor-pointer h-2 bg-[#ede9df] rounded-lg"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {[250, 500, 1000, 1500, 2200, 3000].map((quickAmt) => (
                      <button
                        key={quickAmt}
                        type="button"
                        onClick={() => setAmount(quickAmt)}
                        className={`px-2 py-0.5 text-[10px] font-mono rounded-md border transition-colors cursor-pointer ${
                          amount === quickAmt
                            ? 'bg-[#12141a] text-[#ccff00] border-[#12141a]'
                            : 'bg-white text-[#5a6272] border-[#ede9df] hover:border-[#12141a]/30'
                        }`}
                      >
                        ₹{quickAmt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Item Title */}
              <div>
                <label className="block text-xs font-semibold text-[#12141a] uppercase tracking-wide mb-1.5">
                  What are you considering buying? *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wireless ANC Headphones"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#fbfaf7] border border-[#d6d2c4] rounded-xl px-3.5 py-2.5 text-sm text-[#12141a] focus:bg-white focus:border-[#12141a] focus:outline-none transition-colors font-medium"
                  required
                />
              </div>

              {/* Category & Day Selectors */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#12141a] uppercase tracking-wide mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                    className="w-full bg-[#fbfaf7] border border-[#d6d2c4] rounded-xl px-3 py-2 text-xs text-[#12141a] focus:bg-white focus:border-[#12141a] focus:outline-none cursor-pointer"
                  >
                    {Object.entries(CATEGORY_META).map(([key, meta]) => (
                      <option key={key} value={key}>
                        {meta.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#12141a] uppercase tracking-wide mb-1.5">
                    Purchase Day
                  </label>
                  <select
                    value={day}
                    onChange={(e) => setDay(Number(e.target.value))}
                    className="w-full bg-[#fbfaf7] border border-[#d6d2c4] rounded-xl px-3 py-2 text-xs text-[#12141a] focus:bg-white focus:border-[#12141a] focus:outline-none cursor-pointer"
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
              <div className="p-3.5 bg-[#f6f4ee] border border-[#e8e5dc] rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-semibold text-xs text-[#12141a] block">Classification</span>
                  <span className="text-[11px] text-[#64748b]">
                    Discretionary spends drain your daily allowance directly.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEssential(!isEssential)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    isEssential
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-[#12141a] border border-[#d6d2c4] hover:bg-[#ede9df]'
                  }`}
                >
                  {isEssential ? 'ESSENTIAL' : 'DISCRETIONARY'}
                </button>
              </div>
            </form>
          </div>

          <div className="pt-4 border-t border-[#ede9df] text-[11px] text-[#717b8f] mt-4 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#12141a] shrink-0" />
            <span>Simulation does not mutate your actual budget until committed.</span>
          </div>
        </div>

        {/* Right Column: Financial Consequence Matrix (7 cols) */}
        <div className="lg:col-span-7 bg-[#12141a] text-white rounded-2xl p-6 sm:p-7 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-5">
              <h3 className="font-heading font-bold text-base text-white">
                2. Financial Consequence Matrix
              </h3>
              <span className="text-xs font-mono text-[#ccff00] bg-white/10 px-2.5 py-0.5 rounded-full">
                Real-Time Domino Effect
              </span>
            </div>

            {activeResult ? (
              <div className="space-y-5">
                {/* Before vs After Metric Cards (Clean Grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Metric 1: Cash Balance */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#a3adc2]">
                      Cash Balance
                    </div>
                    <div className="text-xs text-[#a3adc2] line-through mt-0.5">
                      {formatINR(activeResult.balanceBefore)}
                    </div>
                    <div className="text-2xl font-heading font-black text-white mt-0.5">
                      {formatINR(activeResult.balanceAfter)}
                    </div>
                    <div className="text-xs text-rose-400 font-medium mt-1 font-mono">
                      -{formatINR(activeResult.proposal.amount)}
                    </div>
                  </div>

                  {/* Metric 2: Safe Daily Allowance */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#a3adc2]">
                      Daily Allowance
                    </div>
                    <div className="text-xs text-[#a3adc2] line-through mt-0.5">
                      {formatINR(activeResult.allowanceBefore)}/d
                    </div>
                    <div className={`text-2xl font-heading font-black mt-0.5 ${activeResult.allowanceAfter < 80 ? 'text-rose-400' : 'text-[#ccff00]'}`}>
                      {formatINR(activeResult.allowanceAfter)}
                      <span className="text-xs font-normal text-[#a3adc2] ml-0.5">/d</span>
                    </div>
                    <div className="text-xs text-rose-400 font-medium mt-1 font-mono">
                      -{formatINR(activeResult.allowanceBefore - activeResult.allowanceAfter)}/d
                    </div>
                  </div>

                  {/* Metric 3: Month-End Forecast */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#a3adc2]">
                      Month-End Forecast
                    </div>
                    <div className="text-xs text-[#a3adc2] line-through mt-0.5">
                      {formatINR(activeResult.forecastBefore)}
                    </div>
                    <div className={`text-2xl font-heading font-black mt-0.5 ${activeResult.forecastAfter < 0 ? 'text-rose-400' : 'text-white'}`}>
                      {formatINR(activeResult.forecastAfter)}
                    </div>
                    <div className="text-xs text-[#a3adc2] mt-1">
                      {activeResult.forecastAfter < 0 ? 'Deficit risk' : 'Buffer remaining'}
                    </div>
                  </div>
                </div>

                {/* Comparative Visual Forecast Bar */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#a3adc2]">
                    <span>Capital Preservation Trajectory</span>
                    <span className="text-white">
                      Baseline: {formatINR(activeResult.forecastBefore)} &rarr; Simulated: {formatINR(activeResult.forecastAfter)}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{
                        width: `${Math.max(0, Math.min(100, (activeResult.forecastAfter / 10000) * 100))}%`,
                      }}
                    />
                    <div
                      className="bg-rose-500/80 h-full transition-all duration-300"
                      style={{
                        width: `${Math.max(0, Math.min(100, (activeResult.proposal.amount / 10000) * 100))}%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#717b8f] font-mono">
                    <span className="text-emerald-400">Green = Remaining buffer</span>
                    <span className="text-rose-400">Red = Consumed by this purchase</span>
                  </div>
                </div>

                {/* Risk Trajectory Banner */}
                <div
                  className={`p-4 rounded-xl border text-xs ${
                    activeResult.simulated.risk.level === 'AT_RISK'
                      ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                      : activeResult.simulated.risk.level === 'CAUTION'
                      ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                      : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold mb-1 font-heading text-sm">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>
                      Risk Trajectory: {activeResult.baseline.risk.level} &rarr;{' '}
                      {activeResult.simulated.risk.level}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-white/90">
                    {activeResult.warnings.length > 0
                      ? activeResult.warnings[0]
                      : 'This expense fits comfortably within your current discretionary safety allowance.'}
                  </p>
                </div>

                {/* Strategic Alternatives Comparison */}
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-[#a3adc2] mb-2.5 flex items-center justify-between">
                    <span>Strategic Alternatives</span>
                    <span className="text-[10px] text-[#717b8f]">Transparent Scenario Modeling</span>
                  </div>
                  <div className="space-y-2">
                    {activeResult.alternatives.map((alt) => (
                      <div
                        key={alt.id}
                        onClick={() => {
                          if (alt.id === 'budget_alternative') {
                            setAmount(alt.amount);
                          } else if (alt.id === 'delay_purchase') {
                            setDay(26);
                          }
                        }}
                        className="p-3.5 bg-white/5 border border-white/10 rounded-xl hover:border-white/30 transition-colors text-xs cursor-pointer group"
                      >
                        <div className="flex items-center justify-between font-bold mb-1">
                          <span className="text-white group-hover:text-[#ccff00] transition-colors">{alt.title}</span>
                          <span className="text-[#ccff00] font-mono text-sm">{formatINR(alt.amount)}</span>
                        </div>
                        <p className="text-xs text-[#a3adc2] mb-2 leading-relaxed">{alt.description}</p>
                        <div className="flex items-center gap-4 text-[11px] text-[#717b8f] pt-1.5 border-t border-white/5 font-mono">
                          <span>Daily: <strong className="text-white">{formatINR(alt.dailyAllowance)}/d</strong></span>
                          <span>Month-End: <strong className="text-white">{formatINR(alt.monthEndForecast)}</strong></span>
                          <span>Risk: <strong className="text-[#ccff00]">{alt.riskLevel}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Decision Actions Bar */}
          <div className="pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 mt-6">
            <button
              onClick={handleCancel}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-[#a3adc2] hover:text-white border border-white/10 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              Cancel Simulation
            </button>

            <button
              onClick={handleCommitPurchase}
              className="px-6 py-3 bg-[#ccff00] hover:bg-[#b8e600] text-black font-heading font-black text-xs sm:text-sm rounded-lg transition-all flex items-center gap-2 shadow-xl active:scale-98 cursor-pointer"
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
