import React, { useState, useEffect } from 'react';
import type { Issue, IssueStatus } from '../types/issue';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { CategoryIcon } from './CategoryIcon';
import { CATEGORY_DETAILS, CAMPUS_ZONES, SAMPLE_PHOTO_PRESETS } from '../data/zones';
import { formatDate, formatRelativeTime, getStatusLabel } from '../utils/formatters';
import {
  X,
  MapPin,
  Clock,
  ArrowUp,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  ShieldAlert,
  ChevronRight,
  Send,
  Calendar,
  Share2,
  Copy,
  Info,
} from 'lucide-react';

interface IssueDetailModalProps {
  issue: Issue | null;
  onClose: () => void;
  onUpdateStatus: (
    issueId: string,
    newStatus: IssueStatus,
    actor: string,
    actorRole: string,
    notes: string,
    proofDetails?: {
      workSummary: string;
      verificationMethod: string;
      afterPhotoUrl?: string;
    }
  ) => void;
  onToggleUpvote: (issueId: string) => void;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  issue,
  onClose,
  onUpdateStatus,
  onToggleUpvote,
}) => {
  // Status transition form state
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [targetStatus, setTargetStatus] = useState<IssueStatus>('verified');
  const [actorName, setActorName] = useState('');
  const [actorRole, setActorRole] = useState('Campus Operations');
  const [transitionNotes, setTransitionNotes] = useState('');
  const [workSummary, setWorkSummary] = useState('');
  const [verificationMethod, setVerificationMethod] = useState(
    'Physical inspection by Campus Steward & photographic log'
  );
  const [copiedId, setCopiedId] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!issue) return null;

  const categoryMeta = CATEGORY_DETAILS[issue.category];
  const zoneMeta = CAMPUS_ZONES.find((z) => z.id === issue.zoneId);
  const isResolved = issue.status === 'resolved';

  // Determine next suggested status
  const getNextStatus = (): IssueStatus => {
    switch (issue.status) {
      case 'reported':
        return 'verified';
      case 'verified':
        return 'in_progress';
      case 'in_progress':
        return 'resolved';
      case 'resolved':
        return 'reported'; // Re-open
    }
  };

  const handleOpenStatusForm = () => {
    const next = getNextStatus();
    setTargetStatus(next);
    setShowStatusForm(true);
  };

  const handleSubmitStatusTransition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actorName.trim()) {
      alert('Please provide an actor name or department.');
      return;
    }

    onUpdateStatus(
      issue.id,
      targetStatus,
      actorName.trim(),
      actorRole.trim() || 'Campus Operations',
      transitionNotes.trim() || `Status updated to ${getStatusLabel(targetStatus)}`,
      targetStatus === 'resolved'
        ? {
            workSummary:
              workSummary.trim() ||
              transitionNotes.trim() ||
              'Maintenance remediation completed successfully.',
            verificationMethod: verificationMethod.trim(),
          }
        : undefined
    );

    setShowStatusForm(false);
    setTransitionNotes('');
    setWorkSummary('');
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(issue.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Find sample illustration if matching category
  const matchingPreset = SAMPLE_PHOTO_PRESETS.find((p) => p.category === issue.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 modal-backdrop overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-[#101218] border border-[#262939] shadow-2xl my-auto overflow-hidden text-left"
        role="dialog"
        aria-modal="true"
        aria-labelledby="issue-modal-title"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#141620] border-b border-[#242735]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-[#ff5500] tracking-wider">
              {issue.id}
            </span>
            <button
              onClick={handleCopyId}
              className="text-[#8e97a8] hover:text-[#faf8f5] transition-colors"
              title="Copy identifier"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            {copiedId && (
              <span className="text-[11px] font-mono text-[#10b981]">Copied!</span>
            )}
            <span className="text-[#3b3f54]">|</span>
            <span className="font-mono text-xs text-[#8e97a8] hidden sm:inline">
              {zoneMeta?.name || issue.building}
            </span>
            {issue.isDemoRecord && (
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#1f2231] text-[#9ca3af] border border-[#2c3247]">
                DEMO RECORD
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-[#8e97a8] hover:text-[#faf8f5] p-1.5 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Lifecycle Stepper Bar */}
        <div className="px-5 py-3 bg-[#0d0e14] border-b border-[#1f2230]">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-[#6e778a]">PUBLIC ACCOUNTABILITY LIFECYCLE</span>
            <span className="text-[#faf8f5] font-semibold">
              CURRENT STAGE: <span className="text-[#ff5500]">{getStatusLabel(issue.status).toUpperCase()}</span>
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'reported', label: '1. REPORTED', icon: Clock },
              { id: 'verified', label: '2. VERIFIED', icon: ShieldAlert },
              { id: 'in_progress', label: '3. IN PROGRESS', icon: Wrench },
              { id: 'resolved', label: '4. RESOLVED', icon: CheckCircle2 },
            ].map((step, idx) => {
              const order = ['reported', 'verified', 'in_progress', 'resolved'];
              const currentIdx = order.indexOf(issue.status);
              const isPast = idx <= currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <div
                  key={step.id}
                  className={`p-2 border text-[11px] font-mono transition-colors flex items-center gap-1.5 ${
                    isCurrent
                      ? issue.status === 'resolved'
                        ? 'bg-[#10b981]/20 border-[#10b981] text-[#34d399] font-bold'
                        : 'bg-[#ff5500]/20 border-[#ff5500] text-[#ff7733] font-bold'
                      : isPast
                      ? 'bg-[#151824] border-[#25293c] text-[#cbd5e1]'
                      : 'bg-[#0f1118] border-[#1c1f2b] text-[#555d70]'
                  }`}
                >
                  <step.icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Modal Body */}
        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Title & Metadata Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-xs text-[#a0a8b8] bg-[#161822] px-2 py-0.5 border border-[#242735]">
                <CategoryIcon category={issue.category} className="w-3.5 h-3.5 text-[#ff5500]" />
                <span className="font-mono">{categoryMeta?.label}</span>
              </div>
              <StatusBadge status={issue.status} />
              <PriorityBadge priority={issue.priority} />
            </div>

            <h2
              id="issue-modal-title"
              className="text-xl sm:text-2xl font-heading font-bold text-[#faf8f5] mb-2 leading-tight"
            >
              {issue.title}
            </h2>

            {/* Location Specs */}
            <div className="flex items-center gap-2 text-xs font-mono text-[#8a94a6] bg-[#0c0e14] p-2.5 border border-[#1e212f]">
              <MapPin className="w-4 h-4 text-[#ff5500] shrink-0" />
              <span>
                <strong>{issue.building}</strong> &middot; {issue.specificLocation} (Zone:{' '}
                {zoneMeta?.code})
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-mono uppercase text-[#6e778a] tracking-wider mb-2">
              OBSERVED INFRASTRUCTURE DEFECT
            </h4>
            <p className="text-sm text-[#cbd5e1] leading-relaxed bg-[#13151f] p-3.5 border border-[#212433]">
              {issue.description}
            </p>
          </div>

          {/* Photo / Schematic Visual Evidence */}
          <div>
            <h4 className="text-xs font-mono uppercase text-[#6e778a] tracking-wider mb-2">
              EVIDENCE &amp; DIAGNOSTIC SCHEMATIC
            </h4>
            <div className="bg-[#0b0c10] border border-[#222533] p-3 flex flex-col sm:flex-row items-center gap-4">
              {issue.photoUrl ? (
                <div className="w-full sm:w-64 h-44 bg-[#141620] border border-[#2a2e3f] overflow-hidden flex items-center justify-center">
                  <img
                    src={issue.photoUrl}
                    alt="Issue evidence"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : matchingPreset ? (
                <div
                  className="w-full sm:w-64 h-44 bg-[#141620] border border-[#2a2e3f] overflow-hidden flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: matchingPreset.svg }}
                />
              ) : (
                <div className="w-full sm:w-64 h-44 bg-[#141620] border border-[#2a2e3f] flex flex-col items-center justify-center text-xs font-mono text-[#6e778a] p-4 text-center">
                  <Info className="w-6 h-6 text-[#ff5500] mb-2" />
                  <span>No user photo attached</span>
                  <span className="text-[10px] text-[#4b5563] mt-1">
                    Visual verification confirmed via field inspection
                  </span>
                </div>
              )}

              <div className="flex-1 text-xs font-mono space-y-2 text-[#8e97a8]">
                <div>
                  <span className="text-[#faf8f5] font-semibold">REPORTED BY:</span>{' '}
                  {issue.reporterName} ({issue.reporterAffiliation})
                </div>
                <div>
                  <span className="text-[#faf8f5] font-semibold">TIMESTAMP:</span>{' '}
                  {formatDate(issue.reportedAt)} ({formatRelativeTime(issue.reportedAt)})
                </div>
                <div>
                  <span className="text-[#faf8f5] font-semibold">COORDINATES:</span> X:
                  {issue.mapCoordinates.x}% / Y:{issue.mapCoordinates.y}% on Schematic
                </div>
                {issue.isDemoRecord && (
                  <p className="text-[11px] text-[#ff7733] bg-[#ff5500]/10 p-2 border border-[#ff5500]/20">
                    Demonstration Record: Seeded to showcase campus reporting workflow.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Proof of Fix Certificate (If Resolved) */}
          {isResolved && issue.proofOfFix && (
            <div className="proof-seal p-4 sm:p-5 border border-[#10b981] relative">
              <div className="flex items-center justify-between mb-3 border-b border-[#10b981]/30 pb-2.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                  <span className="font-heading font-bold text-sm sm:text-base text-[#faf8f5]">
                    PROOF OF FIX // VERIFIED RESOLUTION
                  </span>
                </div>
                {issue.proofOfFix.resolutionTimeHours && (
                  <span className="font-mono text-xs text-[#34d399] bg-[#10b981]/15 px-2.5 py-0.5 border border-[#10b981]/40">
                    RESOLVED IN {issue.proofOfFix.resolutionTimeHours} HRS
                  </span>
                )}
              </div>

              <div className="space-y-2 text-xs font-mono text-[#cbd5e1]">
                <div>
                  <strong className="text-[#34d399]">WORK COMPLETED:</strong>{' '}
                  {issue.proofOfFix.workSummary}
                </div>
                <div>
                  <strong className="text-[#34d399]">RESOLVED BY:</strong>{' '}
                  {issue.proofOfFix.resolvedBy}
                </div>
                <div>
                  <strong className="text-[#34d399]">VERIFICATION METHOD:</strong>{' '}
                  {issue.proofOfFix.verificationMethod}
                </div>
                <div>
                  <strong className="text-[#34d399]">RESOLUTION TIMESTAMP:</strong>{' '}
                  {formatDate(issue.proofOfFix.resolvedAt)}
                </div>
              </div>
            </div>
          )}

          {/* Accountability Trail (Audit History) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-mono uppercase text-[#6e778a] tracking-wider">
                ACCOUNTABILITY TRAIL ({issue.activityHistory.length} ENTRIES)
              </h4>
              <span className="text-[11px] font-mono text-[#5e6678]">
                CHRONOLOGICAL AUDIT LOG
              </span>
            </div>

            <div className="relative border-l-2 border-[#242735] ml-3 pl-4 space-y-4">
              {issue.activityHistory.map((act) => (
                <div key={act.id} className="relative group">
                  {/* Timeline Node Pip */}
                  <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-[#12141c] border-2 border-[#ff5500]" />

                  <div className="bg-[#12141d] border border-[#202331] p-3 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1 font-mono">
                      <span className="text-[#faf8f5] font-semibold text-sm">
                        {act.action}
                      </span>
                      <span className="text-[#6b7280] text-[11px]">
                        {formatDate(act.timestamp)}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-[#ff7733] mb-1">
                      {act.actor} &middot; <span className="text-[#8e97a8]">{act.actorRole}</span>
                    </div>

                    <p className="text-[#9ca3af] leading-relaxed">{act.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Status Transition Drawer/Form */}
          {showStatusForm ? (
            <div className="bg-[#141724] border border-[#ff5500]/50 p-4 sm:p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-3 border-b border-[#252a3d] pb-2">
                <h4 className="font-heading font-semibold text-sm text-[#faf8f5]">
                  Record Status Transition for {issue.id}
                </h4>
                <button
                  type="button"
                  onClick={() => setShowStatusForm(false)}
                  className="text-xs font-mono text-[#8e97a8] hover:text-[#faf8f5]"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSubmitStatusTransition} className="space-y-3.5 text-xs font-mono">
                {/* Target Status Selector */}
                <div>
                  <label className="block text-[#a0a8b8] mb-1">TARGET STATUS *</label>
                  <select
                    value={targetStatus}
                    onChange={(e) => setTargetStatus(e.target.value as IssueStatus)}
                    className="w-full bg-[#0d0e14] border border-[#2d3246] px-3 py-2 text-[#faf8f5] focus:border-[#ff5500] focus:outline-none"
                  >
                    <option value="verified">VERIFIED — Inspection confirmed on-site</option>
                    <option value="in_progress">IN PROGRESS — Maintenance crew dispatched</option>
                    <option value="resolved">RESOLVED — Fix completed with proof</option>
                    <option value="reported">REPORTED — Reopen report for review</option>
                  </select>
                </div>

                {/* Actor & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#a0a8b8] mb-1">YOUR NAME / INSPECTOR *</label>
                    <input
                      type="text"
                      placeholder="e.g. Jordan Miller"
                      value={actorName}
                      onChange={(e) => setActorName(e.target.value)}
                      required
                      className="w-full bg-[#0d0e14] border border-[#2d3246] px-3 py-2 text-[#faf8f5] focus:border-[#ff5500] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#a0a8b8] mb-1">ROLE / UNIT *</label>
                    <input
                      type="text"
                      placeholder="e.g. Campus Facilities Lead"
                      value={actorRole}
                      onChange={(e) => setActorRole(e.target.value)}
                      required
                      className="w-full bg-[#0d0e14] border border-[#2d3246] px-3 py-2 text-[#faf8f5] focus:border-[#ff5500] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Transition Notes */}
                <div>
                  <label className="block text-[#a0a8b8] mb-1">ACTION NOTES / DETAILS *</label>
                  <textarea
                    rows={2}
                    placeholder="Specific work executed, work order number, or field notes..."
                    value={transitionNotes}
                    onChange={(e) => setTransitionNotes(e.target.value)}
                    required
                    className="w-full bg-[#0d0e14] border border-[#2d3246] px-3 py-2 text-[#faf8f5] focus:border-[#ff5500] focus:outline-none"
                  />
                </div>

                {/* Specific Proof of Fix Fields if transitioning to Resolved */}
                {targetStatus === 'resolved' && (
                  <div className="bg-[#0f1f16] border border-[#1b4332] p-3 space-y-3">
                    <div className="text-[11px] font-bold text-[#34d399] uppercase">
                      Proof of Fix Attestation
                    </div>
                    <div>
                      <label className="block text-[#a7f3d0] mb-1">REMEDIATION SUMMARY *</label>
                      <input
                        type="text"
                        placeholder="e.g. Replaced defective cartridge valve and calibrated flow."
                        value={workSummary}
                        onChange={(e) => setWorkSummary(e.target.value)}
                        required
                        className="w-full bg-[#0a140f] border border-[#1b4332] px-3 py-1.5 text-[#faf8f5] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#a7f3d0] mb-1">VERIFICATION METHOD *</label>
                      <input
                        type="text"
                        value={verificationMethod}
                        onChange={(e) => setVerificationMethod(e.target.value)}
                        required
                        className="w-full bg-[#0a140f] border border-[#1b4332] px-3 py-1.5 text-[#faf8f5] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowStatusForm(false)}
                    className="px-3 py-2 bg-[#1b1e2a] hover:bg-[#252a3b] text-[#8e97a8]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#ff5500] hover:bg-[#ff6b22] text-black font-semibold flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Commit Status &amp; Sign Audit Trail</span>
                  </button>
                </div>
              </form>
            </div>
          ) : null}
        </div>

        {/* Modal Action Bar */}
        <div className="px-5 py-3.5 bg-[#141620] border-t border-[#242735] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleUpvote(issue.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs border transition-colors ${
                issue.userUpvoted
                  ? 'bg-[#ff5500]/20 text-[#ff5500] border-[#ff5500]/40'
                  : 'bg-[#1b1e2b] text-[#8e97a8] border-[#292d40] hover:text-[#faf8f5]'
              }`}
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Affirm Issue ({issue.upvotes})</span>
            </button>
            <span className="text-[11px] font-mono text-[#6e778a] hidden sm:inline">
              Every vote signals maintenance urgency
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!showStatusForm && (
              <button
                onClick={handleOpenStatusForm}
                className="bg-[#ff5500] hover:bg-[#ff6b22] text-black font-semibold text-xs font-mono px-4 py-2 transition-colors flex items-center gap-1.5"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>
                  {issue.status === 'resolved'
                    ? 'Reopen / Update Issue'
                    : `Advance Status &rarr; ${getStatusLabel(getNextStatus()).toUpperCase()}`}
                </span>
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-[#1b1e2b] hover:bg-[#262a3c] text-[#8e97a8] hover:text-[#faf8f5] text-xs font-mono px-4 py-2 border border-[#2b3044] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
