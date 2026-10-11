import React, { useState } from 'react';
import type { NetworkMetrics, Issue } from '../types/issue';
import { CATEGORY_DETAILS, CAMPUS_ZONES } from '../data/zones';
import {
  FileText,
  Download,
  RotateCcw,
  ShieldCheck,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Copy,
  Info,
} from 'lucide-react';

interface ImpactLedgerProps {
  metrics: NetworkMetrics;
  issues: Issue[];
  onResetDemoData: () => void;
  onShowToast: (msg: string) => void;
}

export const ImpactLedger: React.FC<ImpactLedgerProps> = ({
  metrics,
  issues,
  onResetDemoData,
  onShowToast,
}) => {
  const [copiedJson, setCopiedJson] = useState(false);

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(issues, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `patchwork-civic-ledger-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast('Ledger JSON successfully exported.');
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(issues, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
    onShowToast('Raw JSON copied to clipboard.');
  };

  const handleReset = () => {
    if (window.confirm('Reset all issues to default demonstration seed data? Any new records will be cleared.')) {
      onResetDemoData();
      onShowToast('Database reset to clean demonstration seed data.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="bg-[#12141c] border border-[#242735] p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#ff5500] mb-1.5 uppercase tracking-wider">
              <BarChart3 className="w-4 h-4 text-[#ff5500]" />
              <span>CIVIC PERFORMANCE &amp; ACCOUNTABILITY LEDGER</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#faf8f5] mb-1">
              Campus Infrastructure Ledger
            </h2>
            <p className="text-xs sm:text-sm text-[#8e97a8] max-w-2xl font-body leading-relaxed">
              Transparent telemetry tracking reporting volume, resolution throughput, and maintenance turnaround. Derived strictly from live local data without arbitrary estimates.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopyJson}
              className="bg-[#181a24] hover:bg-[#222533] text-[#faf8f5] border border-[#2b2f42] text-xs font-mono px-3 py-2 transition-colors flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={handleExportJson}
              className="bg-[#181a24] hover:bg-[#222533] text-[#faf8f5] border border-[#2b2f42] text-xs font-mono px-3 py-2 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={handleReset}
              className="bg-[#241315] hover:bg-[#381a1e] text-[#f87171] border border-[#482025] text-xs font-mono px-3 py-2 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Seed</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#12141d] border border-[#222533] p-4 font-mono">
          <div className="text-[11px] text-[#8e97a8] mb-1">TOTAL LOGGED</div>
          <div className="text-3xl font-heading font-bold text-[#faf8f5]">{metrics.totalReports}</div>
          <div className="text-[10px] text-[#555e70] mt-1">Across all 5 campus zones</div>
        </div>

        <div className="bg-[#12141d] border border-[#222533] p-4 font-mono">
          <div className="text-[11px] text-[#ff7733] mb-1">OPEN INCIDENTS</div>
          <div className="text-3xl font-heading font-bold text-[#ff5500]">{metrics.openReports}</div>
          <div className="text-[10px] text-[#555e70] mt-1">Pending review &amp; inspection</div>
        </div>

        <div className="bg-[#12141d] border border-[#222533] p-4 font-mono">
          <div className="text-[11px] text-[#34d399] mb-1">VERIFIED FIXED</div>
          <div className="text-3xl font-heading font-bold text-[#10b981]">{metrics.resolvedReports}</div>
          <div className="text-[10px] text-[#555e70] mt-1">Closed with Proof of Fix</div>
        </div>

        <div className="bg-[#12141d] border border-[#222533] p-4 font-mono">
          <div className="text-[11px] text-[#60a5fa] mb-1">FIX RATIO</div>
          <div className="text-3xl font-heading font-bold text-[#38bdf8]">{metrics.resolutionRate}%</div>
          <div className="text-[10px] text-[#555e70] mt-1">
            Avg Turnaround: {metrics.avgResolutionTimeHours} hrs
          </div>
        </div>
      </div>

      {/* Two Column Breakdown: By Category & By Zone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Breakdown */}
        <div className="bg-[#12141c] border border-[#242735] p-5">
          <h3 className="font-heading font-semibold text-base text-[#faf8f5] mb-1 flex items-center justify-between">
            <span>Breakdown by Defect Category</span>
            <span className="font-mono text-xs text-[#8e97a8]">{Object.keys(CATEGORY_DETAILS).length} Types</span>
          </h3>
          <p className="text-xs text-[#6e778a] font-mono mb-4">Distribution of reported maintenance needs</p>

          <div className="space-y-3 font-mono text-xs">
            {Object.entries(CATEGORY_DETAILS).map(([catKey, catVal]) => {
              const count = metrics.categoryCounts[catKey as keyof typeof metrics.categoryCounts] || 0;
              const pct = metrics.totalReports > 0 ? Math.round((count / metrics.totalReports) * 100) : 0;

              return (
                <div key={catKey}>
                  <div className="flex justify-between items-center mb-1 text-[11px]">
                    <span className="text-[#cbd5e1]">{catVal.label}</span>
                    <span className="text-[#8e97a8]">{count} reports ({pct}%)</span>
                  </div>
                  <div className="w-full bg-[#1b1e2a] h-1.5 overflow-hidden">
                    <div
                      className="bg-[#ff5500] h-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Zone Breakdown */}
        <div className="bg-[#12141c] border border-[#242735] p-5">
          <h3 className="font-heading font-semibold text-base text-[#faf8f5] mb-1 flex items-center justify-between">
            <span>Sector Volume Distribution</span>
            <span className="font-mono text-xs text-[#8e97a8]">{CAMPUS_ZONES.length} Sectors</span>
          </h3>
          <p className="text-xs text-[#6e778a] font-mono mb-4">Volume mapped across architectural quad zones</p>

          <div className="space-y-3 font-mono text-xs">
            {CAMPUS_ZONES.map((zone) => {
              const count = metrics.zoneCounts[zone.id] || 0;
              const pct = metrics.totalReports > 0 ? Math.round((count / metrics.totalReports) * 100) : 0;

              return (
                <div key={zone.id}>
                  <div className="flex justify-between items-center mb-1 text-[11px]">
                    <span className="text-[#cbd5e1]">{zone.code} &mdash; {zone.name}</span>
                    <span className="text-[#8e97a8]">{count} reports ({pct}%)</span>
                  </div>
                  <div className="w-full bg-[#1b1e2a] h-1.5 overflow-hidden">
                    <div
                      className="bg-[#10b981] h-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Authenticity Ledger Disclaimer */}
      <div className="bg-[#12141d] border border-[#212535] p-4 text-xs font-mono text-[#8a93a4] flex items-start gap-3">
        <Info className="w-4 h-4 text-[#ff5500] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-[#faf8f5]">DATA AUTHENTICITY TRANSPARENCY NOTICE:</strong>
          <p>
            {metrics.demoRecordCount} of {metrics.totalReports} records are currently designated as seeded demonstration data to simulate campus facilities workflows. {metrics.authenticRecordCount} records were generated during active user sessions and are persisted in your browser's local storage.
          </p>
        </div>
      </div>
    </div>
  );
};
