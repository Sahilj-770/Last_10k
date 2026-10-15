import React, { useState, useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type {
  CalculatedMetrics,
  Transaction,
  Subscription,
  SavingsGoal,
  SimulationProposal,
} from '../types/finance';
import { formatINR, simulateExpenseDecision } from '../utils/financeEngine';
import { MoneyRunway } from './MoneyRunway';
import { RupeeCoinGSAP } from './RupeeCoinGSAP';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  Calendar,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Download,
  Info,
  Sun,
  Moon,
  ChevronDown,
  Layers,
  Flame,
  Clock,
  HelpCircle,
  Eye,
  Check,
  X,
  CreditCard,
} from 'lucide-react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

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
  theme?: 'dark' | 'light';
  toggleTheme?: () => void;
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
  theme = 'dark',
  toggleTheme,
}) => {
  const pageRef = useRef<HTMLDivElement>(null);

  // Global Scroll Progress (0 to 1)
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState(1);

  // Chapter 2 Allocation stream selection
  const [activeAllocationIndex, setActiveAllocationIndex] = useState(0);

  // Chapter 5 Simulator presets & slider
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(1); // Headphones
  const [customSliderAmount, setCustomSliderAmount] = useState<number>(1500);

  // Track scroll progress for top bar
  useEffect(() => {
    const handleScroll = () => {
      const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = totalScrollHeight > 0 ? Math.min(1, Math.max(0, currentScroll / totalScrollHeight)) : 0;
      setScrollProgress(progress);

      // Determine active chapter
      if (currentScroll < 600) setActiveChapter(1);
      else if (currentScroll < 1400) setActiveChapter(2);
      else if (currentScroll < 2200) setActiveChapter(3);
      else if (currentScroll < 3000) setActiveChapter(4);
      else if (currentScroll < 4000) setActiveChapter(5);
      else setActiveChapter(6);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP + ScrollTrigger context animation orchestrator
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // Ensure all animated elements are immediately visible without motion
        gsap.set(
          [
            '.gsap-hero-pill',
            '.gsap-hero-title-line',
            '.gsap-hero-paragraph',
            '.gsap-hero-stats',
            '.gsap-hero-actions',
            '.gsap-hero-centerpiece',
            '.gsap-alloc-header',
            '.gsap-alloc-stream-item',
            '.gsap-alloc-preview',
            '.gsap-runway-header',
            '.gsap-runway-disc',
            '.gsap-runway-milestone',
            '.gsap-dilemma-header',
            '.gsap-impulse-card',
            '.gsap-consequence-card',
            '.gsap-shock-pill',
            '.gsap-sim-header',
            '.gsap-sim-controls',
            '.gsap-sim-output',
            '.gsap-cta-badge',
            '.gsap-cta-title',
            '.gsap-cta-desc',
            '.gsap-cta-btn',
          ],
          { opacity: 1, y: 0, x: 0, scale: 1, clearProps: 'all' }
        );
        return;
      }

      // 1. Hero Entrance Timeline
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .fromTo(
          '.gsap-hero-pill',
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.6 }
        )
        .fromTo(
          '.gsap-hero-title-line',
          { opacity: 0, y: 40, skewY: 2 },
          { opacity: 1, y: 0, skewY: 0, stagger: 0.12, duration: 0.8 },
          '-=0.3'
        )
        .fromTo(
          '.gsap-hero-paragraph',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.4'
        )
        .fromTo(
          '.gsap-hero-stats',
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.4'
        )
        .fromTo(
          '.gsap-hero-actions',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.3'
        )
        .fromTo(
          '.gsap-hero-centerpiece',
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.2)' },
          '-=0.7'
        );

      // Subtle Hero Parallax scroll response for Centerpiece
      gsap.to('.gsap-hero-centerpiece', {
        y: 60,
        scrollTrigger: {
          trigger: '#chapter-1',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      // 2. Chapter 2: Capital Allocation Reveal
      gsap.fromTo(
        '.gsap-alloc-header',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#chapter-2',
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        '.gsap-alloc-stream-item',
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.08,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#chapter-2 .gsap-alloc-streams-list',
            start: 'top 78%',
          },
        }
      );

      gsap.fromTo(
        '.gsap-alloc-preview',
        { opacity: 0, x: 30, scale: 0.96 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#chapter-2 .gsap-alloc-preview',
            start: 'top 78%',
          },
        }
      );

      // 3. Chapter 3: Money Runway Progressive Reveal
      gsap.fromTo(
        '.gsap-runway-header',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#chapter-3',
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        '.gsap-runway-disc',
        { opacity: 0, scale: 0.88 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#chapter-3 .gsap-runway-disc',
            start: 'top 75%',
          },
        }
      );

      gsap.fromTo(
        '.gsap-runway-milestone',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#chapter-3 .gsap-runway-milestones-list',
            start: 'top 75%',
          },
        }
      );

      // 4. Chapter 4: Purchase Consequence Visual Response
      gsap.fromTo(
        '.gsap-dilemma-header',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#chapter-4',
            start: 'top 80%',
          },
        }
      );

      const dilemmaTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#chapter-4 .gsap-dilemma-cards',
          start: 'top 75%',
        },
      });

      dilemmaTl
        .fromTo(
          '.gsap-impulse-card',
          { opacity: 0, x: -35 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }
        )
        .fromTo(
          '.gsap-consequence-card',
          { opacity: 0, x: 35, scale: 0.96 },
          { opacity: 1, x: 0, scale: 1, duration: 0.8, ease: 'power2.out' },
          '-=0.5'
        )
        .fromTo(
          '.gsap-shock-pill',
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' },
          '-=0.2'
        );

      // 5. Chapter 5: Spending Simulator Reveal
      gsap.fromTo(
        '.gsap-sim-header',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#chapter-5',
            start: 'top 80%',
          },
        }
      );

      const simTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#chapter-5 .gsap-sim-stage',
          start: 'top 75%',
        },
      });

      simTl
        .fromTo(
          '.gsap-sim-controls',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        )
        .fromTo(
          '.gsap-sim-output',
          { opacity: 0, y: 30, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.5'
        );

      // 6. Chapter 6: Final CTA Dramatic Reveal
      const ctaTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#chapter-6',
          start: 'top 75%',
        },
      });

      ctaTl
        .fromTo(
          '.gsap-cta-badge',
          { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
        )
        .fromTo(
          '.gsap-cta-title',
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo(
          '.gsap-cta-desc',
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.5'
        )
        .fromTo(
          '.gsap-cta-btn',
          { opacity: 0, scale: 0.9, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(1.5)' },
          '-=0.3'
        );
    }, pageRef);

    // Revert context during cleanup to prevent duplicate animations and memory leaks
    return () => ctx.revert();
  }, []);

  // Budget Allocation streams for Chapter 2
  const allocationStreams = [
    {
      id: 'mess',
      label: 'Hostel Mess & Core Nutrition',
      amount: 3500,
      pct: 35.0,
      color: '#10b981',
      badge: 'Protected Essential',
      desc: 'Mandatory daily sustenance. If compromised, cognitive fatigue and academic performance suffer.',
      dailyImpact: '₹116.60 / day',
    },
    {
      id: 'buffer',
      label: 'Discretionary Survival Buffer',
      amount: 4712,
      pct: 47.1,
      color: '#ccff00',
      badge: 'Liquid Runway',
      desc: 'The only money you actually control. Every impulse purchase, snack, or cafe visit draws directly from here.',
      dailyImpact: '₹248.00 / day',
    },
    {
      id: 'commute',
      label: 'Campus Metro & Commute',
      amount: 900,
      pct: 9.0,
      color: '#38bdf8',
      badge: 'Predictable Utility',
      desc: 'Smart card recharges, shared autos, and weekend lab transit tokens.',
      dailyImpact: '₹30.00 / day',
    },
    {
      id: 'academic',
      label: 'Xerox, Printouts & Supplies',
      amount: 550,
      pct: 5.5,
      color: '#f59e0b',
      badge: 'Academic Toll',
      desc: 'Lab manual spiral bindings, project submissions, engineering graphics sheets.',
      dailyImpact: '₹18.33 / day',
    },
    {
      id: 'subscriptions',
      label: 'Locked Digital Subscriptions',
      amount: 338,
      pct: 3.4,
      color: '#f43f5e',
      badge: 'Silent Drain',
      desc: 'Spotify Student plan (₹59), iCloud 50GB (₹75), and shared OTT/GitHub student tools.',
      dailyImpact: '₹11.26 / day',
    },
  ];

  // Presets for Chapter 5 Decision Lab
  const previewOptions = [
    {
      title: 'Late Night Swiggy Biryani Feast',
      amount: 480,
      category: 'food' as const,
      isEssential: false,
      tag: 'Canteen & Comfort',
      desc: 'Shared hostel midnight order after hackathon sprint.',
      alternatives: [
        { title: 'Hostel Canteen Egg Maggi + Chai', cost: 75, saved: 405 },
        { title: 'Split across 4 roommates', cost: 120, saved: 360 },
      ],
    },
    {
      title: 'Wireless ANC Headphones',
      amount: 1500,
      category: 'entertainment' as const,
      isEssential: false,
      tag: 'Gear & Focus',
      desc: 'Noise-canceling earphones for studying in noisy campus common rooms.',
      alternatives: [
        { title: 'Wired Studio Earphones (Type-C)', cost: 450, saved: 1050 },
        { title: 'Buy Certified Pre-owned on Campus', cost: 700, saved: 800 },
        { title: 'Delay purchase to Day 28 survival surplus', cost: 0, saved: 1500 },
      ],
    },
    {
      title: 'Weekend Goa Roadtrip Split',
      amount: 2200,
      category: 'transport' as const,
      isEssential: false,
      tag: 'Outing & Commute',
      desc: 'Car rental fuel split, highway tolls, and weekend hostel getaway.',
      alternatives: [
        { title: 'Local Trek & Metro Day Trip', cost: 350, saved: 1850 },
        { title: 'Camp on Campus & Host Film Night', cost: 150, saved: 2050 },
      ],
    },
  ];

  // Active Proposal
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

  // Exact math from deterministic engine
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

  const remainingDays = Math.max(1, totalDays - currentDay + 1);

  return (
    <div
      ref={pageRef}
      className={`min-h-screen transition-colors duration-300 font-body selection:bg-[#ccff00] selection:text-black ${
        theme === 'dark' ? 'bg-[#0a0b10] text-[#faf8f5]' : 'bg-[#fbfaf7] text-[#12141a]'
      }`}
    >
      {/* Floating Scroll Storytelling Navigation & Telemetry */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b ${
          theme === 'dark'
            ? 'bg-[#0a0b10]/85 border-[#232838] text-[#faf8f5]'
            : 'bg-[#fbfaf7]/90 border-[#e8e5dc] text-[#12141a]'
        } backdrop-blur-md`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          {/* Brand Wordmark */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={onEnterApp}
          >
            <div className="w-9 h-9 bg-[#12141a] text-[#ccff00] dark:bg-[#1a1e2b] dark:text-[#ccff00] flex items-center justify-center font-heading font-black text-lg rounded-md shadow-xs group-hover:scale-105 transition-transform">
              ₹10k
            </div>
            <div>
              <span className="font-heading font-black text-lg tracking-tight block">
                LAST ₹10K
              </span>
              <span className="text-[10px] text-[#8c95a6] dark:text-[#9aa4b8] font-mono tracking-wider uppercase block">
                The Small-Fix &amp; Survival Network
              </span>
            </div>
          </div>

          {/* Chapter Progress Indicators (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-mono">
            {[
              { id: 1, label: '01. Capital' },
              { id: 2, label: '02. Allocation' },
              { id: 3, label: '03. Runway' },
              { id: 4, label: '04. Decision' },
              { id: 5, label: '05. Simulator' },
            ].map((ch) => (
              <a
                key={ch.id}
                href={`#chapter-${ch.id}`}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeChapter === ch.id
                    ? 'bg-[#ccff00] text-black font-bold shadow-xs'
                    : 'text-[#8c95a6] hover:text-[#faf8f5] dark:hover:text-[#faf8f5]'
                }`}
              >
                {ch.label}
              </a>
            ))}
          </nav>

          {/* Right Action Tools: Theme Switcher & Direct App Entry */}
          <div className="flex items-center gap-2.5">
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-[#232838] bg-[#12151f] text-[#faf8f5] hover:border-[#ccff00]/40'
                    : 'border-[#e8e5dc] bg-white text-[#12141a] hover:border-[#12141a]/40 shadow-xs'
                }`}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-[#ccff00]" />
                ) : (
                  <Moon className="w-4 h-4 text-[#12141a]" />
                )}
              </button>
            )}

            <button
              onClick={onEnterApp}
              className="px-4 py-2 bg-[#12141a] dark:bg-[#ccff00] hover:bg-black dark:hover:bg-[#b8e600] text-[#ccff00] dark:text-black font-heading font-black text-xs sm:text-sm rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <span>ENTER APP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Global Cinematic Scroll Progress Bar */}
        <div className="w-full h-[2px] bg-white/5 relative">
          <div
            className="h-full bg-[#ccff00] transition-all duration-75"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
      </header>

      {/* ========================================================================= */}
      {/* CHAPTER 1: THE OPENING — ₹10,000 CAPITAL                                 */}
      {/* ========================================================================= */}
      <section
        id="chapter-1"
        className="relative min-h-[92vh] flex flex-col justify-center pt-24 pb-16 overflow-hidden border-b border-[#232838]/20 dark:border-[#232838]"
      >
        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Oversized Typography & Kinetic Manifesto */}
          <div className="lg:col-span-7 space-y-6 z-10">
            {/* Live Telemetry Pill */}
            <div className="gsap-hero-pill inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-[#232838] bg-black/20 backdrop-blur-md text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
              <span className="text-[#8c95a6] dark:text-[#9aa4b8]">LIVE EXPERIMENT &middot;</span>
              <strong className="text-[#ccff00]">DAY {currentDay} OF {totalDays}</strong>
              <span className="text-[#8c95a6] hidden sm:inline">&middot; {remainingDays} DAYS REMAINING</span>
            </div>

            {/* Massive Kinetic Headline */}
            <div className="space-y-1">
              <span className="gsap-hero-title-line text-xs sm:text-sm font-mono tracking-widest uppercase text-[#8c95a6] dark:text-[#9aa4b8] block">
                THE EDITORIAL FINANCIAL SURVIVAL ENGINE
              </span>
              <h1 className="font-heading font-black text-5xl sm:text-7xl lg:text-8xl tracking-tighter leading-[0.92]">
                <span className="gsap-hero-title-line block">THE LAST</span>
                <span className="gsap-hero-title-line text-[#ccff00] block">₹10,000</span>
                <span className="gsap-hero-title-line italic font-serif opacity-90 block">RUPEE.</span>
              </h1>
            </div>

            <p className="gsap-hero-paragraph text-base sm:text-lg text-[#5a6272] dark:text-[#9aa4b8] max-w-xl leading-relaxed">
              <strong className="text-[#12141a] dark:text-[#faf8f5] font-semibold">
                Your month has a price.
              </strong>{' '}
              ₹10,000 is not just a budget; it is a finite resource moving across thirty days. Every snack, recharge, and impulse purchase alters your trajectory.
            </p>

            {/* Quick Live Stats Ribbon */}
            <div className="gsap-hero-stats grid grid-cols-3 gap-4 pt-4 border-t border-[#ede9df] dark:border-[#232838] max-w-lg text-xs font-mono">
              <div>
                <span className="text-[#8c95a6] block text-[10px] uppercase">Cash In Hand</span>
                <strong className="text-xl sm:text-2xl font-heading font-black text-[#12141a] dark:text-white">
                  {formatINR(metrics.currentCashBalance)}
                </strong>
              </div>
              <div>
                <span className="text-[#8c95a6] block text-[10px] uppercase">Safe Daily</span>
                <strong className="text-xl sm:text-2xl font-heading font-black text-emerald-600 dark:text-[#ccff00]">
                  {formatINR(metrics.safeDailyAllowance)}/d
                </strong>
              </div>
              <div>
                <span className="text-[#8c95a6] block text-[10px] uppercase">Forecast</span>
                <strong className="text-xl sm:text-2xl font-heading font-black text-[#12141a] dark:text-white">
                  {formatINR(metrics.forecastedMonthEndBalance)}
                </strong>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="gsap-hero-actions pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onEnterApp}
                className="px-8 py-4 bg-[#12141a] dark:bg-[#ccff00] hover:bg-black dark:hover:bg-[#b8e600] text-[#ccff00] dark:text-black font-heading font-black text-base rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl active:scale-98 cursor-pointer group"
              >
                <span>ENTER 30-DAY WORKSPACE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#chapter-2"
                className="px-6 py-4 rounded-xl border border-[#d6d0c2] dark:border-[#232838] font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer text-center hover:border-[#ccff00]"
              >
                <span>Scroll the Story</span>
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </a>
            </div>
          </div>

          {/* Right: GSAP-Animated Rupee Coin Centerpiece */}
          <div className="gsap-hero-centerpiece lg:col-span-5 relative flex items-center justify-center min-h-[420px] sm:min-h-[480px]">
            <RupeeCoinGSAP
              theme={theme}
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CHAPTER 2: THE ALLOCATION — WHERE IT GOES                                */}
      {/* ========================================================================= */}
      <section
        id="chapter-2"
        className="py-20 sm:py-28 border-b border-[#ede9df] dark:border-[#232838] relative"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          {/* Chapter Masthead */}
          <div className="gsap-alloc-header max-w-2xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b981]/10 text-emerald-600 dark:text-[#10b981] border border-emerald-500/20 text-xs font-mono mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>CHAPTER 02 &middot; CAPITAL DECONSTRUCTION</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight">
              Where the ₹10,000 actually goes.
            </h2>
            <p className="text-sm sm:text-base text-[#5a6272] dark:text-[#9aa4b8] mt-2 leading-relaxed">
              ₹10,000 feels substantial on Day 1. But once mandatory living overhead, academic tolls, and locked subscriptions claim their share, the true liquid survival runway is under half.
            </p>
          </div>

          {/* Deconstruction Visualizer Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Stream Breakdown List (6 cols) */}
            <div className="gsap-alloc-streams-list lg:col-span-6 space-y-3">
              {allocationStreams.map((item, idx) => {
                const isSelected = activeAllocationIndex === idx;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveAllocationIndex(idx)}
                    className={`gsap-alloc-stream-item p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#ccff00] bg-white dark:bg-[#12151f] shadow-lg ring-1 ring-[#ccff00]/40'
                        : 'border-[#e8e5dc] dark:border-[#232838] bg-[#fbfaf7] dark:bg-[#0f121a] hover:border-[#8c95a6]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-heading font-bold text-base">
                          {item.label}
                        </span>
                      </div>
                      <strong className="font-mono text-base font-black">
                        {formatINR(item.amount)}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#8c95a6] dark:text-[#9aa4b8] mb-2 font-mono">
                      <span>{item.pct}% of total capital</span>
                      <span>{item.dailyImpact}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${item.pct}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>

                    <p className="text-xs text-[#5a6272] dark:text-[#9aa4b8] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Right: Interactive Capital Anatomy Callout (6 cols) */}
            <div className="gsap-alloc-preview lg:col-span-6 sticky top-28 bg-white dark:bg-[#12151f] border border-[#e8e5dc] dark:border-[#232838] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#ede9df] dark:border-[#232838] pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#8c95a6] uppercase tracking-wider block">
                    ACTIVE ANATOMY INSPECTION
                  </span>
                  <h3 className="text-xl font-heading font-black">
                    {allocationStreams[activeAllocationIndex].label}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#ccff00]/20 text-[#12141a] dark:text-[#ccff00] border border-[#ccff00]/40">
                  {allocationStreams[activeAllocationIndex].badge}
                </span>
              </div>

              {/* Big Denomination Graphic */}
              <div className="p-6 rounded-2xl bg-[#fbfaf7] dark:bg-[#0a0b10] border border-[#ede9df] dark:border-[#232838] text-center space-y-2">
                <div className="text-4xl sm:text-5xl font-heading font-black text-[#12141a] dark:text-white">
                  {formatINR(allocationStreams[activeAllocationIndex].amount)}
                </div>
                <div className="text-xs font-mono text-[#8c95a6]">
                  Represents {allocationStreams[activeAllocationIndex].pct}% of your ₹10,000 monthly allowance
                </div>
              </div>

              {/* Strategic Rule Insight */}
              <div className="space-y-3 text-xs leading-relaxed text-[#5a6272] dark:text-[#9aa4b8]">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#ccff00] shrink-0 mt-0.5" />
                  <span>
                    <strong>Ring-fenced Protection:</strong> Mandatory obligations are calculated first so you never face sudden eviction, WiFi cutoff, or mess penalties.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#ccff00] shrink-0 mt-0.5" />
                  <span>
                    <strong>Zero Double-Deduction Bug:</strong> Paying a tracked commitment instantly moves money without decreasing your safe daily allowance twice.
                  </span>
                </div>
              </div>

              {/* Quick Jump to Simulator */}
              <a
                href="#chapter-5"
                className="w-full py-3.5 bg-[#12141a] dark:bg-white/10 hover:bg-black dark:hover:bg-white/20 text-[#ccff00] dark:text-white rounded-xl font-heading font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Simulate Spending This Buffer</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CHAPTER 3: THE COUNTDOWN — 30 DAYS                                       */}
      {/* ========================================================================= */}
      <section
        id="chapter-3"
        className="py-20 sm:py-28 border-b border-[#ede9df] dark:border-[#232838] bg-[#fbfaf7]/50 dark:bg-[#07080c]"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="gsap-runway-header max-w-2xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 text-xs font-mono mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>CHAPTER 03 &middot; THE 30-DAY COUNTDOWN</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight">
              The Money Runway.
            </h2>
            <p className="text-sm sm:text-base text-[#5a6272] dark:text-[#9aa4b8] mt-2 leading-relaxed">
              Every day on campus is a coordinate on the timeline. Days 1 through 11 are settled past; Day 12 is live today; and the remaining 19 days depend on today’s discipline.
            </p>
          </div>

          {/* Runway Interactive Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: The Circular Runway Component (7 cols) */}
            <div className="gsap-runway-disc lg:col-span-7 bg-white dark:bg-[#12151f] border border-[#e8e5dc] dark:border-[#232838] rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-3 border-b border-[#ede9df] dark:border-[#232838] mb-4 text-xs font-mono">
                <span className="font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ccff00]" />
                  <span>CIRCULAR RUNWAY TIMELINE</span>
                </span>
                <span className="text-emerald-700 dark:text-[#ccff00] text-[10px] font-semibold">
                  Day {currentDay} Halo Active
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

            {/* Right: Milestone Trail (5 cols) */}
            <div className="gsap-runway-milestones-list lg:col-span-5 space-y-4">
              <div className="gsap-runway-milestone p-6 rounded-2xl bg-white dark:bg-[#12151f] border border-[#e8e5dc] dark:border-[#232838]">
                <span className="text-[10px] font-mono text-[#8c95a6] uppercase tracking-wider block mb-1">
                  SETTLED MILESTONE
                </span>
                <h4 className="font-heading font-black text-lg">Days 1–11: Capital Influx &amp; Essentials</h4>
                <p className="text-xs text-[#5a6272] dark:text-[#9aa4b8] mt-1 leading-relaxed">
                  Mess fee (₹3,500) cleared, textbook xerox batches printed, metro card recharged. Initial burn rate successfully stabilized.
                </p>
              </div>

              <div className="gsap-runway-milestone p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
                    TODAY &middot; ACTIVE HORIZON
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h4 className="font-heading font-black text-lg text-emerald-950 dark:text-emerald-200">
                  Day 12: ₹248 Safe Daily Burn
                </h4>
                <p className="text-xs text-emerald-900/80 dark:text-emerald-300/80 mt-1 leading-relaxed">
                  Spend under ₹248 today and tomorrow’s allowance increases. Overspend, and the remaining 18 days must absorb the rationing penalty.
                </p>
              </div>

              <div className="gsap-runway-milestone p-6 rounded-2xl bg-white dark:bg-[#12151f] border border-[#e8e5dc] dark:border-[#232838]">
                <span className="text-[10px] font-mono text-[#8c95a6] uppercase tracking-wider block mb-1">
                  LOCKED BILLS AHEAD
                </span>
                <h4 className="font-heading font-black text-lg">Days 15 &amp; 24: WiFi &amp; Phone Recharge</h4>
                <p className="text-xs text-[#5a6272] dark:text-[#9aa4b8] mt-1 leading-relaxed">
                  ₹798 total commitments already deducted from your runway. Zero surprises when due dates arrive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CHAPTER 4: THE DECISION — SPEND OR SURVIVE?                              */}
      {/* ========================================================================= */}
      <section
        id="chapter-4"
        className="py-20 sm:py-28 border-b border-[#ede9df] dark:border-[#232838]"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="gsap-dilemma-header max-w-2xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-mono mb-3">
              <Flame className="w-3.5 h-3.5" />
              <span>CHAPTER 04 &middot; THE SPENDING DILEMMA</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight">
              Spend or survive? The domino effect.
            </h2>
            <p className="text-sm sm:text-base text-[#5a6272] dark:text-[#9aa4b8] mt-2 leading-relaxed">
              You consider spending ₹1,500 on noise-cancelling headphones. It feels affordable because your current bank balance shows ₹4,712. Here is what happens under the surface:
            </p>
          </div>

          {/* Side by Side Contrast Stage */}
          <div className="gsap-dilemma-cards grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Temptation */}
            <div className="gsap-impulse-card p-8 rounded-3xl border border-[#e8e5dc] dark:border-[#232838] bg-white dark:bg-[#12151f] space-y-5">
              <div className="flex items-center justify-between border-b border-[#ede9df] dark:border-[#232838] pb-3">
                <span className="text-xs font-mono text-[#8c95a6] uppercase tracking-wider">
                  THE IMPULSE
                </span>
                <span className="text-xs font-mono font-bold text-rose-500">
                  -₹1,500 Instant Hit
                </span>
              </div>

              <h3 className="font-heading font-black text-2xl">
                "It's an investment in study focus."
              </h3>
              <p className="text-sm text-[#5a6272] dark:text-[#9aa4b8] leading-relaxed">
                Campus hostel common rooms are loud. Midterm exams are approaching. The 50% discount ends tonight. Your current bank balance is ₹4,712, so the payment succeeds immediately.
              </p>

              <div className="p-4 rounded-xl bg-[#fbfaf7] dark:bg-[#0a0b10] border border-[#ede9df] dark:border-[#232838] space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span>Current Bank Balance</span>
                  <strong>{formatINR(metrics.currentCashBalance)}</strong>
                </div>
                <div className="flex justify-between text-rose-500">
                  <span>Headphones Cart Total</span>
                  <strong>-₹1,500</strong>
                </div>
                <div className="flex justify-between border-t border-black/10 dark:border-white/10 pt-2 font-bold">
                  <span>Apparent Balance Remaining</span>
                  <span>{formatINR(metrics.currentCashBalance - 1500)}</span>
                </div>
              </div>
            </div>

            {/* The Consequence */}
            <div className="gsap-consequence-card p-8 rounded-3xl border border-rose-500/40 bg-rose-950/10 dark:bg-rose-950/20 text-[#12141a] dark:text-[#faf8f5] space-y-5">
              <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
                <span className="text-xs font-mono text-rose-500 uppercase tracking-wider font-bold">
                  THE DOMINO CONSEQUENCE
                </span>
                <span className="gsap-shock-pill text-xs font-mono bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full">
                  Runway Shock
                </span>
              </div>

              <h3 className="font-heading font-black text-2xl text-rose-600 dark:text-rose-400">
                Safe Daily Allowance: ₹248 &rarr; ₹169/day (-32%)
              </h3>
              <p className="text-sm text-[#5a6272] dark:text-[#9aa4b8] leading-relaxed">
                Because 19 days remain, that ₹1,500 deduction is not a one-time event. It permanently slashes ₹79 from every single day until the 30th. You can no longer afford an evening snack without skipping lunch.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-2">
                <div className="p-3 rounded-lg bg-black/5 dark:bg-black/40 border border-rose-500/20">
                  <span className="text-[10px] text-[#8c95a6] block">SURPLUS FOR GOALS</span>
                  <strong className="text-base text-rose-500">Slumped to ₹0</strong>
                </div>
                <div className="p-3 rounded-lg bg-black/5 dark:bg-black/40 border border-rose-500/20">
                  <span className="text-[10px] text-[#8c95a6] block">RISK POSTURE</span>
                  <strong className="text-base text-amber-500">CAUTION / RATION</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CHAPTER 5: THE REVEAL — INTERACTIVE SPENDING SIMULATOR                   */}
      {/* ========================================================================= */}
      <section
        id="chapter-5"
        className="py-20 sm:py-28 border-b border-[#ede9df] dark:border-[#232838] bg-white dark:bg-[#0d0f17]"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="gsap-sim-header max-w-2xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ccff00]/10 text-[#12141a] dark:text-[#ccff00] border border-[#ccff00]/30 text-xs font-mono mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>CHAPTER 05 &middot; LIVE INTERACTIVE SIMULATOR</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight">
              Test any decision before paying.
            </h2>
            <p className="text-sm sm:text-base text-[#5a6272] dark:text-[#9aa4b8] mt-2 leading-relaxed">
              Select an Indian campus scenario or drag the custom amount slider below. The consequence engine computes live mathematical feedback instantly.
            </p>
          </div>

          {/* Interactive Workspace */}
          <div className="gsap-sim-stage grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Preset Selector & Range Slider (5 cols) */}
            <div className="gsap-sim-controls lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[#8c95a6] block">
                  Select Campus Scenario:
                </span>
                {previewOptions.map((opt, idx) => {
                  const isSelected = selectedPresetIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectPreset(idx)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#ccff00] bg-[#12141a] text-white dark:bg-[#151824] shadow-md ring-1 ring-[#ccff00]/40'
                          : 'border-[#e8e5dc] dark:border-[#232838] bg-[#fbfaf7] dark:bg-[#0f121a] hover:border-[#8c95a6]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-heading font-bold text-sm sm:text-base">
                          {opt.title}
                        </span>
                        <strong
                          className={`font-mono text-base ${
                            isSelected ? 'text-[#ccff00]' : 'text-emerald-600 dark:text-[#ccff00]'
                          }`}
                        >
                          {formatINR(opt.amount)}
                        </strong>
                      </div>
                      <p className="text-xs text-[#8c95a6] dark:text-[#9aa4b8] leading-relaxed">
                        {opt.desc}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
                        <span className="px-2 py-0.5 rounded-full bg-white/10 dark:bg-white/5">
                          {opt.tag}
                        </span>
                        <span className={isSelected ? 'text-[#ccff00]' : 'text-[#8c95a6]'}>
                          {isSelected ? '● Active In Simulation' : 'Click to test'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Range Slider */}
              <div className="p-5 rounded-2xl border border-[#e8e5dc] dark:border-[#232838] bg-[#fbfaf7] dark:bg-[#0f121a] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">Or Drag Custom Amount:</span>
                  <strong className="text-2xl font-heading font-black text-[#ccff00] bg-black px-3 py-1 rounded-lg">
                    {formatINR(customSliderAmount)}
                  </strong>
                </div>

                <input
                  type="range"
                  min="50"
                  max="4000"
                  step="50"
                  value={customSliderAmount}
                  onChange={(e) => {
                    setCustomSliderAmount(Number(e.target.value));
                    setSelectedPresetIndex(-1);
                  }}
                  className="w-full accent-[#ccff00] cursor-pointer h-2 bg-stone-300 dark:bg-stone-700 rounded-lg"
                />

                <div className="flex justify-between text-[10px] font-mono text-[#8c95a6]">
                  <span>₹50 (Chai)</span>
                  <span>₹1,500 (Shopping)</span>
                  <span>₹4,000 (Major Outing)</span>
                </div>
              </div>

              {/* Smart Alternatives */}
              {previewOptions[selectedPresetIndex]?.alternatives && (
                <div className="p-5 rounded-2xl border border-[#e8e5dc] dark:border-[#232838] bg-[#fbfaf7] dark:bg-[#0f121a] space-y-2.5">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-[#ccff00] block font-bold">
                    Smart Survival Alternatives:
                  </span>
                  {previewOptions[selectedPresetIndex].alternatives.map((alt, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-white dark:bg-[#12151f] border border-[#ede9df] dark:border-[#232838] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold">{alt.title}</div>
                        <div className="text-[10px] font-mono text-emerald-600 dark:text-[#ccff00]">
                          Saves {formatINR(alt.saved)}
                        </div>
                      </div>
                      <strong className="font-mono">{formatINR(alt.cost)}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Consequence Output (7 cols) */}
            <div className="gsap-sim-output lg:col-span-7 bg-[#12141a] dark:bg-[#12151f] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between border border-white/10 space-y-6">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono text-[#ccff00] uppercase tracking-wider block">
                      DETERMINISTIC SIMULATION
                    </span>
                    <h3 className="font-heading font-black text-2xl text-white">
                      Domino Effect On 30-Day Budget
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-[#a3adc2] bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                    Testing: {formatINR(activeProposal.amount)}
                  </span>
                </div>

                {/* 3 Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
                  {/* Cash */}
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

                  {/* Daily Allowance */}
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

                  {/* Forecast */}
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
                    <div className="text-xs font-mono text-[#a3adc2] mt-1">
                      {simulationImpact.forecastAfter < 0 ? 'Deficit Warning' : 'Surplus Remains'}
                    </div>
                  </div>
                </div>

                {/* Risk Trajectory Banner */}
                <div
                  className={`p-4 rounded-xl border text-xs ${
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

              {/* Action Button: Launch into App */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <span className="text-xs text-[#a3adc2]">
                  Live sandbox &middot; Won't touch your ledger until explicitly committed.
                </span>

                <button
                  onClick={() => onLaunchSimulationInApp(activeProposal)}
                  className="px-6 py-3.5 bg-[#ccff00] hover:bg-[#b8e600] text-black font-heading font-black text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl active:scale-98 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>Launch in Full App Simulator ({formatINR(activeProposal.amount)})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CHAPTER 6: THE TRANSITION — ENTER THE WORKSPACE                          */}
      {/* ========================================================================= */}
      <section
        id="chapter-6"
        className="py-24 sm:py-32 bg-[#090a0f] text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-radial from-[#ccff00]/5 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 text-center flex flex-col items-center relative z-10">
          <div className="gsap-cta-badge inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-[#ccff00] rounded-full text-xs font-mono mb-6">
            <span>READY TO MANAGE YOUR 30-DAY TIMELINE</span>
          </div>

          <h2 className="gsap-cta-title text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight max-w-4xl leading-tight">
            Take control of your Last ₹10,000.
          </h2>

          <p className="gsap-cta-desc text-base sm:text-lg text-[#9aa4b8] max-w-xl mt-4 leading-relaxed">
            Enter the live workspace now. Inspect the unified ledger, test emergency stress tests (broken phone screen, sudden campus fest fee), protect savings goals, and track daily cash in hand.
          </p>

          <div className="gsap-cta-btn mt-8 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={onEnterApp}
              className="px-10 py-5 bg-[#ccff00] hover:bg-[#b8e600] text-black font-heading font-black text-base sm:text-lg rounded-2xl transition-all flex items-center gap-3 shadow-2xl active:scale-98 cursor-pointer"
            >
              <span>ENTER FINANCIAL DASHBOARD</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#ede9df] dark:border-[#232838] bg-[#f5f3ec] dark:bg-[#07080c] py-8 text-xs text-[#64748b] dark:text-[#8c95a6]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-[#12141a] text-[#ccff00] font-black flex items-center justify-center font-heading text-xs rounded-xs">
              ₹
            </span>
            <span className="font-heading font-bold text-sm text-[#12141a] dark:text-[#faf8f5]">
              LAST ₹10K &middot; Survive the Month
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onExportJson}
              className="hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Ledger JSON</span>
            </button>
            <span>&bull;</span>
            <button
              onClick={() => {
                if (window.confirm('Reset demo state to initial seed defaults?')) {
                  onResetDemoData();
                }
              }}
              className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
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
