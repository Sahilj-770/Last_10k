import React, { useState, useMemo } from 'react';
import type {
  CalculatedMetrics,
  Transaction,
  Subscription,
  SavingsGoal,
  SimulationProposal,
} from '../types/finance';
import { formatINR, simulateExpenseDecision } from '../utils/financeEngine';
import { MoneyRunway } from './MoneyRunway';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  Calendar,
  Layers,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Download,
  Info,
} from 'lucide-react';

interface LandingPageProps {
  metrics: CalculatedMetrics;
  currentDay: number;
  totalDays: number;
  startingBudget: number;
  transactions: Transaction[];
  subscriptions: Subscription[];
  savingsGoals: SavingsGoal[];
  onEnterApp: () => void;
  onLaunchSimulationInApp: (proposal: SimulationProposal) => void;
  onResetDemoData: () => void;
  onExportJson: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  metrics,
  currentDay,
  totalDays,
  startingBudget,
  transactions,
  subscriptions,
  savingsGoals,
  onEnterApp,
  onLaunchSimulationInApp,
  onResetDemoData,
  onExportJson,
}) => {
  // Interactive spending preview state on landing page
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(1); // default to headphones
  const [customSliderAmount, setCustomSliderAmount] = useState<number>(1500);

  const previewOptions = [
    {
      title: 'Late Night Swiggy Biryani Feast',
      amount: 480,
      category: 'food' as const,
      isEssential: false,
      tag: 'Canteen & Comfort',
      desc: 'Shared hostel midnight order after hackathon study sprint.',
    },
    {
      title: 'Wireless ANC Headphones',
      amount: 1500,
      category: 'entertainment' as const,
      isEssential: false,
      tag: 'Gear & Focus',
      desc: 'Noise-canceling earphones for studying in noisy campus common rooms.',
    },
    {
      title: 'Weekend Goa Roadtrip Split',
      amount: 2200,
      category: 'transport' as const,
      isEssential: false,
      tag: 'Outing & Commute',
      desc: 'Car rental fuel split, highway toll shares, and weekend hostel getaway.',
    },
  ];

  // Active preview proposal based on selection or slider
  const activeProposal: SimulationProposal = useMemo(() => {
    const opt = previewOptions[selectedPresetIndex];
    return {
      title: opt ? opt.title : 'Custom Simulated Purchase',
      amount: customSliderAmount,
      category: opt ? opt.category : 'entertainment',
      day: currentDay,
      isEssential: opt ? opt.isEssential : false,
    };
  }, [selectedPresetIndex, customSliderAmount, currentDay]);

  // Compute live consequences using the exact finance engine
  const simulationImpact = useMemo(() => {
    return simulateExpenseDecision(
      activeProposal,
      startingBudget,
      totalDays,
      currentDay,
      transactions,
      subscriptions,
      savingsGoals
    );
  }, [
    activeProposal,
    startingBudget,
    totalDays,
    currentDay,
    transactions,
    subscriptions,
    savingsGoals,
  ]);

  const handleSelectPreset = (index: number) => {
    setSelectedPresetIndex(index);
    setCustomSliderAmount(previewOptions[index].amount);
  };

  const handleLaunchWithCurrentSimulation = () => {
    onLaunchSimulationInApp(activeProposal);
  };

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#12141a] flex flex-col font-body selection:bg-[#ccff00] selection:text-black">
      {/* Top Editorial Ribbon */}
      <div className="border-b border-[#ede9df] bg-[#f5f3ec] px-4 sm:px-8 lg:px-12 py-2 text-xs text-[#64748b] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="font-heading font-black text-[#12141a] uppercase tracking-wider">
            LAST ₹10K &middot; FINANCIAL SURVIVAL EXPERIMENT
          </span>
          <span className="text-[#d6d2c4] hidden sm:inline">&bull;</span>
          <span className="font-mono text-[11px] text-[#12141a] hidden sm:inline">
            30 DAYS &middot; ₹10,000 CAPITAL &middot; ZERO EXTERNAL DEBT
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>DAY {currentDay} / {totalDays} ACTIVE</span>
          </span>
          <span className="text-[#64748b] hidden md:inline">
            RUNWAY: <strong>{formatINR(metrics.safeDailyAllowance)}/DAY</strong>
          </span>
          <button
            onClick={onEnterApp}
            className="text-[11px] text-[#12141a] font-bold hover:text-emerald-700 transition-colors cursor-pointer ml-2 flex items-center gap-1"
          >
            <span>Skip to Dashboard</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Masthead Navigation */}
      <header className="border-b border-[#e8e5dc] bg-[#fbfaf7]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onEnterApp}>
            <div className="w-9 h-9 bg-[#12141a] text-[#ccff00] flex items-center justify-center font-heading font-black text-lg rounded-md shadow-xs">
              ₹10k
            </div>
            <div>
              <span className="font-heading font-black text-xl text-[#12141a] tracking-tight block">
                LAST ₹10K
              </span>
              <span className="text-[10px] text-[#64748b] font-mono tracking-wider uppercase block">
                Your month has a price.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#decision-lab"
              className="text-xs font-semibold text-[#5a6272] hover:text-[#12141a] px-3 py-2 rounded-lg transition-colors hidden sm:inline-block cursor-pointer"
            >
              Decision Lab
            </a>
            <a
              href="#pillars"
              className="text-xs font-semibold text-[#5a6272] hover:text-[#12141a] px-3 py-2 rounded-lg transition-colors hidden md:inline-block cursor-pointer"
            >
              How It Works
            </a>
            <button
              onClick={onEnterApp}
              className="bg-[#12141a] hover:bg-black text-[#ccff00] font-heading font-black text-xs sm:text-sm px-5 py-2.5 rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <span>ENTER 30-DAY APP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-16 sm:pb-24 border-b border-[#ede9df]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Typographic Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#12141a] text-[#ccff00] rounded-full text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
                <span>FINANCIAL SURVIVAL SIMULATOR &middot; GEN-Z &amp; CAMPUS EDITION</span>
              </div>

              {/* Massive Kinetic Headline */}
              <div className="space-y-1">
                <h1 className="font-heading font-black text-5xl sm:text-7xl lg:text-8xl tracking-tighter text-[#12141a] leading-[0.92]">
                  YOUR MONEY.
                  <br />
                  <span className="text-[#12141a] opacity-90">YOUR RULES.</span>
                  <br />
                  <span className="text-emerald-700 italic font-serif">YOUR 30 DAYS.</span>
                </h1>
              </div>

              {/* Manifesto Copy */}
              <p className="text-base sm:text-lg text-[#5a6272] max-w-xl font-body leading-relaxed">
                <strong className="text-[#12141a] font-semibold">Your month has a price.</strong> ₹10,000 is a finite physical resource moving through a 30-day timeline. Spending decisions consume it, bills reserve it, and savings protect it. Every decision leaves a mark.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={onEnterApp}
                  className="px-8 py-4 bg-[#12141a] hover:bg-black text-[#ccff00] font-heading font-black text-base rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl active:scale-98 cursor-pointer group"
                >
                  <span>ENTER YOUR 30-DAY EXPERIMENT</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="#decision-lab"
                  className="px-6 py-4 bg-white hover:bg-[#ede9df]/60 text-[#12141a] border border-[#d6d0c2] font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer text-center"
                >
                  <span>Test Decision Simulator</span>
                  <span className="text-xs text-[#64748b] font-mono">↓</span>
                </a>
              </div>

              {/* Key Quick Live Stats Under Hero */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-[#ede9df] text-xs">
                <div>
                  <span className="text-[10px] text-[#64748b] font-mono uppercase block">CURRENT CASH</span>
                  <strong className="text-lg sm:text-xl font-heading font-black text-[#12141a]">
                    {formatINR(metrics.currentCashBalance)}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748b] font-mono uppercase block">SAFE ALLOWANCE</span>
                  <strong className="text-lg sm:text-xl font-heading font-black text-emerald-700">
                    {formatINR(metrics.safeDailyAllowance)}/d
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748b] font-mono uppercase block">PROJECTED CLOSING</span>
                  <strong className="text-lg sm:text-xl font-heading font-black text-[#12141a]">
                    {formatINR(metrics.forecastedMonthEndBalance)}
                  </strong>
                </div>
              </div>
            </div>

            {/* Right Interactive Centerpiece: The Money Runway Physical Disc (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-[#e8e5dc] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-3 border-b border-[#ede9df] mb-2 text-xs font-mono">
                <span className="font-bold text-[#12141a] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#12141a]" />
                  <span>THE MONEY RUNWAY</span>
                </span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px] font-semibold">
                  Live Mathematical Model
                </span>
              </div>

              <MoneyRunway
                metrics={metrics}
                currentDay={currentDay}
                totalDays={totalDays}
                onSelectDay={() => {}}
                onEnterApp={onEnterApp}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: The Interactive Spending Decision Lab */}
      <section id="decision-lab" className="py-16 sm:py-24 bg-[#ffffff] border-b border-[#ede9df]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          {/* Section Header */}
          <div className="max-w-2xl mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-full text-xs font-semibold mb-3">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>INTERACTIVE PROSPECTIVE LAB</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-[#12141a] tracking-tight">
              See the future before you spend.
            </h2>
            <p className="text-sm sm:text-base text-[#5a6272] mt-2 leading-relaxed">
              Before you swipe, UPI, or tap: simulate the exact domino effect on your remaining 30-day runway. Test the real presets below or drag the rupee slider.
            </p>
          </div>

          {/* Interactive Lab Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Interactive Controls (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Preset Selector Cards */}
              <div className="space-y-2.5">
                <span className="text-xs font-mono uppercase tracking-wider text-[#64748b] block">
                  Select a Real Indian College Scenario:
                </span>
                {previewOptions.map((opt, idx) => {
                  const isSelected = selectedPresetIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectPreset(idx)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#12141a] text-white border-[#12141a] shadow-md'
                          : 'bg-[#fbfaf7] text-[#12141a] border-[#e8e5dc] hover:border-[#12141a]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-heading font-bold text-sm sm:text-base">
                          {opt.title}
                        </span>
                        <strong
                          className={`font-mono text-base ${
                            isSelected ? 'text-[#ccff00]' : 'text-emerald-700'
                          }`}
                        >
                          {formatINR(opt.amount)}
                        </strong>
                      </div>
                      <p
                        className={`text-xs leading-relaxed ${
                          isSelected ? 'text-[#a3adc2]' : 'text-[#64748b]'
                        }`}
                      >
                        {opt.desc}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
                        <span
                          className={`px-2 py-0.5 rounded-full ${
                            isSelected ? 'bg-white/10 text-white' : 'bg-stone-200/60 text-stone-700'
                          }`}
                        >
                          {opt.tag}
                        </span>
                        <span className={isSelected ? 'text-[#ccff00]' : 'text-stone-500'}>
                          {isSelected ? '● Active in Simulator' : 'Click to inspect'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Rupee Slider */}
              <div className="bg-[#fbfaf7] border border-[#e8e5dc] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#12141a]">
                    Or Drag Custom Rupee Amount:
                  </span>
                  <strong className="text-xl font-heading font-black text-[#12141a]">
                    {formatINR(customSliderAmount)}
                  </strong>
                </div>

                <input
                  type="range"
                  min="100"
                  max="4000"
                  step="50"
                  value={customSliderAmount}
                  onChange={(e) => {
                    setCustomSliderAmount(Number(e.target.value));
                    setSelectedPresetIndex(-1); // custom mode
                  }}
                  className="w-full accent-[#12141a] cursor-pointer h-2 bg-[#ede9df] rounded-lg"
                />

                <div className="flex items-center justify-between text-[10px] text-[#64748b] font-mono mt-2">
                  <span>₹100 (Quick Snack)</span>
                  <span>₹2,000 (Shopping)</span>
                  <span>₹4,000 (Major Outing)</span>
                </div>
              </div>
            </div>

            {/* Right: Live Domino Effect Consequence Matrix (7 cols) */}
            <div className="lg:col-span-7 bg-[#12141a] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                  <div>
                    <span className="text-[10px] font-mono text-[#ccff00] uppercase tracking-wider block">
                      DETERMINISTIC CONSEQUENCE ENGINE
                    </span>
                    <h3 className="font-heading font-black text-xl text-white">
                      Domino Effect on Your ₹10,000 Budget
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-[#a3adc2] bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                    Proposed: {formatINR(activeProposal.amount)}
                  </span>
                </div>

                {/* 3 Metric Comparison Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  {/* Card 1: Available Cash */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <span className="text-[10px] font-mono text-[#a3adc2] uppercase block">
                      Cash In Hand
                    </span>
                    <div className="text-xs text-[#a3adc2] line-through mt-0.5">
                      {formatINR(simulationImpact.balanceBefore)}
                    </div>
                    <div className="text-2xl font-heading font-black text-white mt-0.5">
                      {formatINR(simulationImpact.balanceAfter)}
                    </div>
                    <div className="text-xs font-mono text-rose-400 mt-1">
                      -{formatINR(activeProposal.amount)}
                    </div>
                  </div>

                  {/* Card 2: Safe Daily Allowance */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <span className="text-[10px] font-mono text-[#a3adc2] uppercase block">
                      Daily Allowance
                    </span>
                    <div className="text-xs text-[#a3adc2] line-through mt-0.5">
                      {formatINR(simulationImpact.allowanceBefore)}/d
                    </div>
                    <div
                      className={`text-2xl font-heading font-black mt-0.5 ${
                        simulationImpact.allowanceAfter < 80 ? 'text-rose-400' : 'text-[#ccff00]'
                      }`}
                    >
                      {formatINR(simulationImpact.allowanceAfter)}
                      <span className="text-xs font-normal text-[#a3adc2] ml-0.5">/d</span>
                    </div>
                    <div className="text-xs font-mono text-rose-400 mt-1">
                      -{formatINR(simulationImpact.allowanceBefore - simulationImpact.allowanceAfter)}/d
                    </div>
                  </div>

                  {/* Card 3: Month-End Forecast */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <span className="text-[10px] font-mono text-[#a3adc2] uppercase block">
                      Month-End Forecast
                    </span>
                    <div className="text-xs text-[#a3adc2] line-through mt-0.5">
                      {formatINR(simulationImpact.forecastBefore)}
                    </div>
                    <div
                      className={`text-2xl font-heading font-black mt-0.5 ${
                        simulationImpact.forecastAfter < 0 ? 'text-rose-400' : 'text-white'
                      }`}
                    >
                      {formatINR(simulationImpact.forecastAfter)}
                    </div>
                    <div className="text-xs text-[#a3adc2] mt-1">
                      {simulationImpact.forecastAfter < 0 ? 'Deficit danger' : 'Reserve remains'}
                    </div>
                  </div>
                </div>

                {/* Risk Trajectory Banner */}
                <div
                  className={`p-4 rounded-xl border text-xs mb-6 ${
                    simulationImpact.simulated.risk.level === 'AT_RISK'
                      ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                      : simulationImpact.simulated.risk.level === 'CAUTION'
                      ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                      : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold mb-1 font-heading text-sm">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>
                      Risk Shift: {simulationImpact.baseline.risk.level} &rarr;{' '}
                      {simulationImpact.simulated.risk.level}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">
                    {simulationImpact.warnings.length > 0
                      ? simulationImpact.warnings[0]
                      : 'This proposed purchase leaves a comfortable safe margin for the remaining 19 days.'}
                  </p>
                </div>
              </div>

              {/* Action: Launch into App with this simulation */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <span className="text-xs text-[#a3adc2]">
                  Sandbox preview &middot; Does not touch actual ledger until committed.
                </span>

                <button
                  onClick={handleLaunchWithCurrentSimulation}
                  className="px-6 py-3.5 bg-[#ccff00] hover:bg-[#b8e600] text-black font-heading font-black text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl active:scale-98 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>Launch in App Simulator ({formatINR(activeProposal.amount)})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: The 3 Pillars of Financial Survival */}
      <section id="pillars" className="py-16 sm:py-24 bg-[#fbfaf7] border-b border-[#ede9df]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-[#64748b] block mb-2">
              THE PHILOSOPHY
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-[#12141a] tracking-tight">
              Three rules for thirty days.
            </h2>
            <p className="text-sm sm:text-base text-[#5a6272] mt-2">
              Most budget apps fail because they show historical graphs after you have already gone broke. LAST ₹10K operates forward in time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="bg-white border border-[#e8e5dc] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-3xl font-heading font-black text-[#d6d2c4] block mb-4">
                  01
                </span>
                <h3 className="font-heading font-black text-xl text-[#12141a] mb-2">
                  Commitments Reserve Cash First
                </h3>
                <p className="text-xs sm:text-sm text-[#5a6272] leading-relaxed">
                  Upcoming exam fees, room electricity shares, and WiFi bills don’t wait for paydays. Our engine ring-fences mandatory commitments from day one so you never accidentally spend your bill money on shawarma.
                </p>
              </div>
              <div className="pt-6 border-t border-[#ede9df] mt-6 flex items-center gap-2 text-xs font-mono text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero Double-Deduction Bug</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white border border-[#e8e5dc] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-3xl font-heading font-black text-[#d6d2c4] block mb-4">
                  02
                </span>
                <h3 className="font-heading font-black text-xl text-[#12141a] mb-2">
                  Daily Allowance Recalculates Every Sunrise
                </h3>
                <p className="text-xs sm:text-sm text-[#5a6272] leading-relaxed">
                  If you overspend on Friday night, Saturday’s allowance decreases automatically. If you stay frugal, Sunday’s allowance grows. You always know the exact number you can spend before midnight.
                </p>
              </div>
              <div className="pt-6 border-t border-[#ede9df] mt-6 flex items-center gap-2 text-xs font-mono text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                <span>Dynamic Daily Runway</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white border border-[#e8e5dc] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-3xl font-heading font-black text-[#d6d2c4] block mb-4">
                  03
                </span>
                <h3 className="font-heading font-black text-xl text-[#12141a] mb-2">
                  Simulate Before You Commit
                </h3>
                <p className="text-xs sm:text-sm text-[#5a6272] leading-relaxed">
                  Never wonder if you can afford that concert ticket or headphones. Enter the price into the simulator, examine the before/after consequence matrix, and view 3 transparent alternatives before money leaves your hands.
                </p>
              </div>
              <div className="pt-6 border-t border-[#ede9df] mt-6 flex items-center gap-2 text-xs font-mono text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                <span>Transparent Scenario Modeling</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Final Call to Action */}
      <section className="py-20 sm:py-28 bg-[#12141a] text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-[#ccff00] rounded-full text-xs font-mono mb-6">
            <span>30 DAYS &middot; ₹10,000 &middot; MAKE IT COUNT</span>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight max-w-4xl leading-tight">
            Ready to take control of your month?
          </h2>

          <p className="text-base sm:text-lg text-[#a3adc2] max-w-xl mt-4 leading-relaxed">
            Enter the live application now. Explore the 30-day calendar, test emergency stress scenarios, ring-fence savings goals, and track your cash in hand.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={onEnterApp}
              className="px-8 py-4 bg-[#ccff00] hover:bg-[#b8e600] text-black font-heading font-black text-base sm:text-lg rounded-xl transition-all flex items-center gap-3 shadow-xl active:scale-98 cursor-pointer"
            >
              <span>ENTER YOUR 30-DAY EXPERIMENT</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Landing Footer */}
      <footer className="border-t border-[#ede9df] bg-[#f5f3ec] py-8 text-xs text-[#64748b]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-[#12141a] text-[#ccff00] font-black flex items-center justify-center font-heading text-xs rounded-xs">
              ₹
            </span>
            <span className="font-heading font-bold text-sm text-[#12141a]">
              LAST ₹10K &middot; Survive the Month
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onExportJson}
              className="text-xs text-[#12141a] hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Ledger JSON</span>
            </button>
            <span className="text-[#d6d2c4]">&bull;</span>
            <button
              onClick={() => {
                if (window.confirm('Reset demo state to initial seed defaults?')) {
                  onResetDemoData();
                }
              }}
              className="text-xs text-rose-700 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Seed</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
