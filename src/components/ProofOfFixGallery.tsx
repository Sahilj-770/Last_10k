import React from 'react';
import type { Issue } from '../types/issue';
import { CATEGORY_DETAILS, SAMPLE_PHOTO_PRESETS } from '../data/zones';
import { formatDate, formatRelativeTime } from '../utils/formatters';
import { CheckCircle2, ShieldCheck, Clock, MapPin, ChevronRight, Award } from 'lucide-react';

interface ProofOfFixGalleryProps {
  issues: Issue[];
  onSelectIssue: (issueId: string) => void;
}

export const ProofOfFixGallery: React.FC<ProofOfFixGalleryProps> = ({
  issues,
  onSelectIssue,
}) => {
  const resolvedIssues = issues.filter((i) => i.status === 'resolved');

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="bg-[#12141c] border border-[#242735] p-5 sm:p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#10b981] mb-1.5 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#10b981]" />
              <span>VERIFIED CIVIC REPAIRS // AUDITED EVIDENCE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#faf8f5] mb-1">
              Proof of Fix Gallery
            </h2>
            <p className="text-xs sm:text-sm text-[#8e97a8] max-w-2xl font-body leading-relaxed">
              Every resolved report on the Patchwork grid requires verifiable proof of fix: physical inspection sign-off, turnaround duration logs, and community re-check confirmation.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#0c0e14] border border-[#1b382b] p-3 text-right">
            <div>
              <div className="font-heading text-2xl font-bold text-[#10b981]">
                {resolvedIssues.length}
              </div>
              <div className="font-mono text-[10px] text-[#6b7280] uppercase">
                RESOLVED INCIDENTS
              </div>
            </div>
            <Award className="w-8 h-8 text-[#10b981]/60" />
          </div>
        </div>
      </div>

      {/* Grid of Verified Fix Certificates */}
      {resolvedIssues.length === 0 ? (
        <div className="bg-[#12141a] border border-[#242735] p-12 text-center">
          <CheckCircle2 className="w-10 h-10 text-[#6e778a] mx-auto mb-3" />
          <h3 className="font-heading text-lg font-semibold text-[#faf8f5] mb-1">
            No resolved issues yet
          </h3>
          <p className="text-xs text-[#8a93a4] max-w-md mx-auto font-mono">
            As open reports are completed and verified by maintenance stewards, their proof of fix records will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resolvedIssues.map((issue) => {
            const proof = issue.proofOfFix;
            const categoryMeta = CATEGORY_DETAILS[issue.category];
            const matchingPreset = SAMPLE_PHOTO_PRESETS.find((p) => p.category === issue.category);

            return (
              <div
                key={issue.id}
                onClick={() => onSelectIssue(issue.id)}
                className="group proof-seal p-5 border border-[#1b4332] hover:border-[#10b981] transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Certificate Top Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#1b4332] text-xs font-mono mb-3">
                    <span className="text-[#34d399] font-bold">{issue.id}</span>
                    <span className="text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 border border-[#10b981]/30 text-[10px]">
                      VERIFIED REPAIR
                    </span>
                  </div>

                  {/* Title & Category */}
                  <h3 className="font-heading font-semibold text-base text-[#faf8f5] group-hover:text-[#34d399] transition-colors mb-2">
                    {issue.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-xs text-[#8a94a6] font-mono mb-3">
                    <MapPin className="w-3.5 h-3.5 text-[#ff5500] shrink-0" />
                    <span className="truncate">{issue.building} &middot; {issue.specificLocation}</span>
                  </div>

                  {/* Visual Proof / Diagram */}
                  <div className="h-32 bg-[#090b10] border border-[#1a3829] overflow-hidden mb-3.5 flex items-center justify-center relative">
                    {issue.photoUrl ? (
                      <img src={issue.photoUrl} alt="Proof" className="w-full h-full object-cover" />
                    ) : matchingPreset ? (
                      <div
                        className="w-full h-full opacity-80"
                        dangerouslySetInnerHTML={{ __html: matchingPreset.svg }}
                      />
                    ) : (
                      <div className="text-center font-mono text-[11px] text-[#6b7280]">
                        <CheckCircle2 className="w-6 h-6 text-[#10b981] mx-auto mb-1" />
                        <span>Physical Audit Sign-off</span>
                      </div>
                    )}

                    {/* Stamp Watermark */}
                    <div className="absolute top-2 right-2 bg-[#0d1f16]/90 border border-[#10b981] px-1.5 py-0.5 text-[9px] font-mono text-[#34d399] tracking-wider uppercase">
                      CLOSED
                    </div>
                  </div>

                  {/* Remediation Work Summary */}
                  {proof && (
                    <div className="bg-[#0b1712] border border-[#1a3d2c] p-3 text-xs font-mono space-y-1.5 mb-3">
                      <div className="text-[#34d399] font-semibold text-[11px]">
                        WORK SUMMARY:
                      </div>
                      <p className="text-[#a7f3d0] text-xs line-clamp-2 leading-relaxed">
                        {proof.workSummary}
                      </p>
                      <div className="text-[10px] text-[#6ee7b7] pt-1 border-t border-[#1a3d2c]">
                        Signed by: <strong>{proof.resolvedBy}</strong>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Info */}
                <div className="pt-2 border-t border-[#1b4332] flex items-center justify-between text-[11px] font-mono text-[#6b7280]">
                  <span>
                    {proof?.resolutionTimeHours ? `Turnaround: ${proof.resolutionTimeHours}h` : 'Turnaround logged'}
                  </span>
                  <span className="text-[#34d399] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    Audit Trail &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
