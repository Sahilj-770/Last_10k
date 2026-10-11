import React from 'react';
import type { NetworkMetrics } from '../types/issue';
import { CheckCircle2, Clock, Wrench, ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';

interface StatsOverviewProps {
  metrics: NetworkMetrics;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* 1. Total Reported */}
      <div className="bg-[#12141a] border border-[#242735] p-3.5 relative overflow-hidden group hover:border-[#3b3f54] transition-colors">
        <div className="flex items-center justify-between text-[#8b92a2] text-xs font-mono mb-1">
          <span className="uppercase tracking-wider">TOTAL LOGGED</span>
          <Clock className="w-3.5 h-3.5 text-[#ff5500]" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-heading font-bold text-[#faf8f5] tracking-tight">
            {metrics.totalReports}
          </span>
          <span className="text-[11px] font-mono text-[#8b92a2]">RECORDS</span>
        </div>
        <div className="text-[10px] font-mono text-[#6b7280] mt-1.5 flex items-center justify-between border-t border-[#1e202a] pt-1">
          <span>{metrics.authenticRecordCount ? `${metrics.authenticRecordCount} COMMUNITY` : 'ALL SECTORS'}</span>
          <span className="text-[#ff5500]">{metrics.demoRecordCount} DEMO</span>
        </div>
      </div>

      {/* 2. Open / Pending Review */}
      <div className="bg-[#12141a] border border-[#242735] p-3.5 relative overflow-hidden group hover:border-[#ff5500]/50 transition-colors">
        <div className="flex items-center justify-between text-[#ff7733] text-xs font-mono mb-1">
          <span className="uppercase tracking-wider">UNDER REVIEW</span>
          <AlertTriangle className="w-3.5 h-3.5 text-[#ff5500]" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-heading font-bold text-[#ff5500] tracking-tight">
            {metrics.openReports}
          </span>
          <span className="text-[11px] font-mono text-[#ff7733]/70">PENDING</span>
        </div>
        <div className="text-[10px] font-mono text-[#6b7280] mt-1.5 flex items-center justify-between border-t border-[#1e202a] pt-1">
          <span>REPORTED / VERIFIED</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500] animate-pulse" />
        </div>
      </div>

      {/* 3. In Progress */}
      <div className="bg-[#12141a] border border-[#242735] p-3.5 relative overflow-hidden group hover:border-[#f59e0b]/50 transition-colors">
        <div className="flex items-center justify-between text-[#f59e0b] text-xs font-mono mb-1">
          <span className="uppercase tracking-wider">IN PROGRESS</span>
          <Wrench className="w-3.5 h-3.5 text-[#f59e0b]" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-heading font-bold text-[#fbbf24] tracking-tight">
            {metrics.inProgressReports}
          </span>
          <span className="text-[11px] font-mono text-[#f59e0b]/70">ASSIGNED</span>
        </div>
        <div className="text-[10px] font-mono text-[#6b7280] mt-1.5 flex items-center justify-between border-t border-[#1e202a] pt-1">
          <span>CREWS DISPATCHED</span>
          <span className="w-1.5 h-1.5 bg-[#f59e0b] rotate-45" />
        </div>
      </div>

      {/* 4. Resolved & Verified */}
      <div className="bg-[#12141a] border border-[#242735] p-3.5 relative overflow-hidden group hover:border-[#10b981]/50 transition-colors">
        <div className="flex items-center justify-between text-[#10b981] text-xs font-mono mb-1">
          <span className="uppercase tracking-wider">RESOLVED</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-heading font-bold text-[#34d399] tracking-tight">
            {metrics.resolvedReports}
          </span>
          <span className="text-[11px] font-mono text-[#10b981]/70">VERIFIED</span>
        </div>
        <div className="text-[10px] font-mono text-[#6b7280] mt-1.5 flex items-center justify-between border-t border-[#1e202a] pt-1">
          <span>WITH PROOF OF FIX</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
        </div>
      </div>

      {/* 5. Resolution Rate */}
      <div className="bg-[#12141a] border border-[#242735] p-3.5 relative overflow-hidden group hover:border-[#3b3f54] transition-colors">
        <div className="flex items-center justify-between text-[#8b92a2] text-xs font-mono mb-1">
          <span className="uppercase tracking-wider">FIX RATE</span>
          <TrendingUp className="w-3.5 h-3.5 text-[#38bdf8]" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl sm:text-3xl font-heading font-bold text-[#faf8f5] tracking-tight">
            {metrics.resolutionRate}%
          </span>
        </div>
        {/* Visual progress track */}
        <div className="w-full bg-[#1e2230] h-1 mt-2.5 overflow-hidden">
          <div
            className="bg-[#10b981] h-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, metrics.resolutionRate))}%` }}
          />
        </div>
      </div>

      {/* 6. Avg Resolution Time */}
      <div className="bg-[#12141a] border border-[#242735] p-3.5 relative overflow-hidden group hover:border-[#3b3f54] transition-colors">
        <div className="flex items-center justify-between text-[#8b92a2] text-xs font-mono mb-1">
          <span className="uppercase tracking-wider">AVG TURNAROUND</span>
          <ShieldCheck className="w-3.5 h-3.5 text-[#a855f7]" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-heading font-bold text-[#faf8f5] tracking-tight">
            {metrics.avgResolutionTimeHours > 0 ? metrics.avgResolutionTimeHours : '—'}
          </span>
          <span className="text-[11px] font-mono text-[#8b92a2]">HRS</span>
        </div>
        <div className="text-[10px] font-mono text-[#6b7280] mt-1.5 border-t border-[#1e202a] pt-1">
          <span>REPORT &rarr; SIGN-OFF</span>
        </div>
      </div>
    </div>
  );
};
