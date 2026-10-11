import React, { useState, useEffect } from 'react';
import type { CalculatedMetrics } from '../types/finance';
import { formatINR } from '../utils/financeEngine';
import {
  Clock,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  TrendingDown,
  Calendar,
  Zap,
  Info,
} from 'lucide-react';

interface MoneyRunwayProps {
  metrics: CalculatedMetrics;
  currentDay: number;
  totalDays: number;
  onSelectDay?: (day: number) => void;
  onEnterApp?: () => void;
}

export const MoneyRunway: React.FC<MoneyRunwayProps> = ({
  metrics,
  currentDay,
  totalDays,
  onSelectDay,
  onEnterApp,
}) => {
  const [animatedDay, setAnimatedDay] = useState<number>(currentDay);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Check user motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Key commitment milestones
  const milestoneDays: Record<number, { name: string; amount: number; color: string }> = {
    16: { name: 'Spotify Student', amount: 59, color: '#f59e0b' },
    18: { name: 'Mid-Sem Exam Fee', amount: 500, color: '#ef4444' },
    22: { name: 'Hostel Electricity', amount: 450, color: '#ef4444' },
    24: { name: 'Hotstar Mobile', amount: 149, color: '#f59e0b' },
    28: { name: 'Google One Cloud', amount: 130, color: '#f59e0b' },
  };

  // Run the sequence animation on mount: Days 1 -> currentDay
  useEffect(() => {
    if (prefersReducedMotion) {
      setAnimatedDay(currentDay);
      setIsPlaying(false);
      return;
    }

    setAnimatedDay(1);
    setIsPlaying(true);

    let dayStep = 1;
    const interval = setInterval(() => {
      dayStep += 1;
      if (dayStep <= currentDay) {
        setAnimatedDay(dayStep);
      } else {
        clearInterval(interval);
        setIsPlaying(false);
      }
    }, 90);

    return () => clearInterval(interval);
  }, [currentDay, prefersReducedMotion]);

  const replayAnimation = () => {
    setAnimatedDay(1);
    setIsPlaying(true);
    let dayStep = 1;
    const interval = setInterval(() => {
      dayStep += 1;
      if (dayStep <= currentDay) {
        setAnimatedDay(dayStep);
      } else {
        clearInterval(interval);
        setIsPlaying(false);
      }
    }, 90);
  };

  // Radial geometry for 30 day nodes
  const radius = 150;
  const center = 180;
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);

  // Hovering a day only highlights its marker. The central figures are current-day metrics,
  // so keep their label tied to currentDay rather than implying a historical/future recalculation.
  // Proportional balance simulation for the active inspected day
  // The inner ring represents spendable cash as a share of the original budget.
  // Clamp the ratio so SVG dash lengths never become negative or exceed a full ring.
  const spendablePct = metrics.startingBudget > 0
    ? Math.max(0, Math.min(100, (metrics.spendableBalance / metrics.startingBudget) * 100))
    : 0;
  const ringCircumference = 2 * Math.PI * 88;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Visual Canvas Container */}
      <div className="relative w-full max-w-[420px] sm:max-w-[460px] aspect-square flex items-center justify-center p-2 select-none">
        {/* Ambient Subtle Glow Behind the Financial Ring */}
        <div className="absolute inset-8 rounded-full bg-[#ccff00]/5 blur-3xl pointer-events-none" />

        {/* SVG Sculpture */}
        <svg
          viewBox="0 0 360 360"
          className="w-full h-full overflow-visible drop-shadow-sm"
        >
          <defs>
            {/* Guilloche Radial Shading Pattern */}
            <radialGradient id="discShading" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#f7f5ed" />
              <stop offset="100%" stopColor="#e8e5dc" />
            </radialGradient>

            <linearGradient id="limeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ccff00" />
              <stop offset="100%" stopColor="#a3e600" />
            </linearGradient>

            <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* Outer Track Ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#ede9df"
            strokeWidth="2"
            strokeDasharray="3 3"
          />

          {/* Active Progress Arc (Days 1 to animatedDay) */}
          {daysArray.map((d) => {
            // Angle starting from top (-90 degrees) and sweeping clockwise 360 deg
            const angleDeg = -90 + ((d - 1) / totalDays) * 360;
            const angleRad = (angleDeg * Math.PI) / 180;
            const x = center + radius * Math.cos(angleRad);
            const y = center + radius * Math.sin(angleRad);

            const isPast = d < currentDay;
            const isToday = d === currentDay;
            const isAnimatedActive = d <= animatedDay;
            const isMilestone = milestoneDays[d] !== undefined;
            const isSelected = hoveredDay === d || (hoveredDay === null && d === currentDay);

            return (
              <g
                key={d}
                className="cursor-pointer transition-transform duration-150 hover:scale-125"
                onMouseEnter={() => setHoveredDay(d)}
                onMouseLeave={() => setHoveredDay(null)}
                onClick={() => onSelectDay && onSelectDay(d)}
              >
                {/* Connecting subtle radial ticks */}
                <line
                  x1={center + (radius - 12) * Math.cos(angleRad)}
                  y1={center + (radius - 12) * Math.sin(angleRad)}
                  x2={center + radius * Math.cos(angleRad)}
                  y2={center + radius * Math.sin(angleRad)}
                  stroke={isToday ? '#12141a' : isPast ? '#d6d2c4' : '#e8e5dc'}
                  strokeWidth={isToday ? 2.5 : 1}
                />

                {/* Day Node Circle */}
                {isToday ? (
                  <g>
                    {/* Pulsing Outer Halo */}
                    <circle
                      cx={x}
                      cy={y}
                      r={10}
                      fill="none"
                      stroke="#ccff00"
                      strokeWidth="2.5"
                      className="animate-ping origin-center opacity-75"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r={8}
                      fill="#12141a"
                      stroke="#ccff00"
                      strokeWidth="2"
                    />
                    <circle cx={x} cy={y} r={3} fill="#ccff00" />
                  </g>
                ) : isMilestone ? (
                  <g>
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 6 : 4.5}
                      fill={milestoneDays[d].color}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  </g>
                ) : (
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 5.5 : isAnimatedActive ? 3.5 : 2.5}
                    fill={
                      isAnimatedActive
                        ? isPast
                          ? '#12141a'
                          : '#12141a'
                        : '#cbd5e1'
                    }
                    stroke={isSelected ? '#ccff00' : '#ffffff'}
                    strokeWidth={isSelected ? 2 : 1}
                  />
                )}
              </g>
            );
          })}

          {/* Central Physical Financial Vault Disc */}
          <g filter="url(#shadowFilter)">
            {/* Outer Coin Edge Bezel */}
            <circle
              cx={center}
              cy={center}
              r={112}
              fill="url(#discShading)"
              stroke="#d6d2c4"
              strokeWidth="1.5"
            />

            {/* Inner Recessed Segment Ring */}
            <circle
              cx={center}
              cy={center}
              r={100}
              fill="#ffffff"
              stroke="#ede9df"
              strokeWidth="1"
            />

            {/* Fine Guilloche Radial Rays */}
            {Array.from({ length: 24 }, (_, i) => {
              const a = (i / 24) * 2 * Math.PI;
              return (
                <line
                  key={i}
                  x1={center + 82 * Math.cos(a)}
                  y1={center + 82 * Math.sin(a)}
                  x2={center + 96 * Math.cos(a)}
                  y2={center + 96 * Math.sin(a)}
                  stroke="#f1ede2"
                  strokeWidth="1"
                />
              );
            })}

            {/* Segmented Capital Ring Arc */}
            <circle
              cx={center}
              cy={center}
              r={88}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="6"
            />
            {/* Track 2: Discretionary Balance in Emerald */}
            <circle
              cx={center}
              cy={center}
              r={88}
              fill="none"
              stroke="#059669"
              strokeWidth="6"
              strokeDasharray={`${(spendablePct / 100) * ringCircumference} ${ringCircumference}`}
              strokeDashoffset={ringCircumference * 0.25}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </g>

          {/* Centerpiece Content In Disc */}
          <g textAnchor="middle" className="select-none pointer-events-none">
            {/* Eyebrow Label */}
            <text
              x={center}
              y={center - 36}
              fontSize="9"
              fontFamily="var(--font-mono)"
              fontWeight="600"
              fill="#64748b"
              letterSpacing="0.1em"
            >
              DAY {currentDay} OF {totalDays} &bull; TODAY
            </text>

            {/* Rupee Symbol Mark */}
            <text
              x={center}
              y={center - 12}
              fontSize="14"
              fontFamily="var(--font-heading)"
              fontWeight="900"
              fill="#12141a"
            >
              {metrics.startingBudget === 10000 ? '₹10,000 STARTING CAPITAL' : `₹${metrics.startingBudget}`}
            </text>

            {/* Dominant Available Cash Number */}
            <text
              x={center}
              y={center + 20}
              fontSize="30"
              fontFamily="var(--font-heading)"
              fontWeight="900"
              fill="#12141a"
              letterSpacing="-0.03em"
            >
              {formatINR(metrics.currentCashBalance)}
            </text>

            {/* Bottom Status Pill */}
            <text
              x={center}
              y={center + 38}
              fontSize="10"
              fontFamily="var(--font-mono)"
              fontWeight="700"
              fill="#059669"
            >
              SAFE: {formatINR(metrics.safeDailyAllowance)}/DAY
            </text>

            <text
              x={center}
              y={center + 52}
              fontSize="9"
              fontFamily="var(--font-body)"
              fontWeight="500"
              fill="#64748b"
            >
              {metrics.remainingDays} days remaining &middot; {formatINR(metrics.spendableBalance)} spendable
            </text>
          </g>
        </svg>

        {/* Live Replay / Motion Trigger Pill */}
        <button
          onClick={replayAnimation}
          className="absolute bottom-1 right-2 bg-white/90 hover:bg-white text-[#12141a] border border-[#e8e5dc] px-2.5 py-1 rounded-full text-[10px] font-mono shadow-xs flex items-center gap-1.5 transition-all cursor-pointer hover:shadow-sm"
          title="Replay 30-day timeline simulation"
        >
          <RotateCcw className={`w-3 h-3 ${isPlaying ? 'animate-spin' : ''}`} />
          <span>{isPlaying ? 'Playing Runway...' : 'Replay Timeline'}</span>
        </button>
      </div>

      {/* Horizontal 30-Day Physical Runway Bar */}
      <div className="w-full max-w-xl mt-4 px-2">
        <div className="flex items-center justify-between text-xs text-[#64748b] mb-1.5 font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#12141a]" />
            <span>DAY 1</span>
          </span>
          <span className="text-[11px] font-medium text-[#12141a]">
            {hoveredDay ? (
              <span className="text-emerald-700 font-bold">
                Inspecting Day {hoveredDay} &middot;{' '}
                {hoveredDay === currentDay
                  ? 'Active Baseline (Today)'
                  : hoveredDay < currentDay
                  ? 'Settled Ledger'
                  : milestoneDays[hoveredDay]
                  ? `${milestoneDays[hoveredDay].name} Due (-₹${milestoneDays[hoveredDay].amount})`
                  : 'Projected Daily Pace'}
              </span>
            ) : (
              <span>Currently at Day {currentDay} of 30</span>
            )}
          </span>
          <span className="flex items-center gap-1">
            <span>DAY 30</span>
            <span className="w-2 h-2 rounded-full bg-[#059669]" />
          </span>
        </div>

        {/* 30 Segmented Timeline Markers */}
        <div className="grid grid-cols-30 gap-1 bg-white p-2 rounded-xl border border-[#ede9df] shadow-xs">
          {daysArray.map((d) => {
            const isPast = d < currentDay;
            const isToday = d === currentDay;
            const isMilestone = milestoneDays[d] !== undefined;
            const isHovered = hoveredDay === d;

            return (
              <div
                key={d}
                onMouseEnter={() => setHoveredDay(d)}
                onMouseLeave={() => setHoveredDay(null)}
                onClick={() => onSelectDay && onSelectDay(d)}
                title={`Day ${d}${isMilestone ? `: ${milestoneDays[d].name}` : ''}`}
                className={`h-7 rounded-sm transition-all cursor-pointer relative flex items-center justify-center ${
                  isToday
                    ? 'bg-[#12141a] ring-2 ring-[#ccff00] scale-110 z-10'
                    : isHovered
                    ? 'bg-[#ccff00] scale-110 z-10'
                    : isPast
                    ? 'bg-[#262a34]'
                    : isMilestone
                    ? 'bg-[#f59e0b]'
                    : 'bg-[#ede9df] hover:bg-[#d6d2c4]'
                }`}
              >
                {isToday && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00]" />
                )}
                {isMilestone && !isToday && (
                  <span className="w-1 h-1 rounded-full bg-white" />
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-[#717b8f] mt-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#262a34]" />
            <span>Past Settled ({currentDay - 1}d)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#12141a] ring-1 ring-[#ccff00]" />
            <span>Today (Day {currentDay})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#f59e0b]" />
            <span>Mandatory Bill Due</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#ede9df]" />
            <span>Future Safe Runway</span>
          </div>
        </div>
      </div>
    </div>
  );
};
