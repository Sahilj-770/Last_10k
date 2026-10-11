import React from 'react';
import type { Issue } from '../types/issue';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { CategoryIcon } from './CategoryIcon';
import { CATEGORY_DETAILS } from '../data/zones';
import { formatRelativeTime } from '../utils/formatters';
import {
  MapPin,
  Clock,
  ArrowUp,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

interface IssueCardProps {
  issue: Issue;
  onSelect: (issueId: string) => void;
  onToggleUpvote: (issueId: string) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onSelect, onToggleUpvote }) => {
  const categoryMeta = CATEGORY_DETAILS[issue.category];
  const latestActivity = issue.activityHistory[issue.activityHistory.length - 1];
  const isResolved = issue.status === 'resolved';

  return (
    <article
      className={`group relative bg-[#12141c] border transition-all duration-200 flex flex-col justify-between ${
        isResolved
          ? 'border-[#1b382b] hover:border-[#10b981]/50'
          : issue.priority === 'urgent'
          ? 'border-[#3f1f22] hover:border-[#ef4444]/60'
          : 'border-[#222533] hover:border-[#383d54]'
      }`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f1118] border-b border-[#1f2230] text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[#ff5500] font-bold tracking-wider">{issue.id}</span>
          <span className="text-[#474f63]">|</span>
          <span className="text-[#8e97a8] truncate max-w-[140px] sm:max-w-[200px]">
            {issue.building}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {issue.isDemoRecord && (
            <span
              className="text-[10px] font-mono px-1.5 py-0.2 bg-[#1c1f2b] text-[#717b8f] border border-[#2b3144]"
              title="Demonstration record for campus simulation"
            >
              DEMO
            </span>
          )}
          <PriorityBadge priority={issue.priority} size="sm" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 flex-1">
        {/* Category & Status Bar */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs text-[#a0a8b8]">
            <CategoryIcon category={issue.category} className="w-3.5 h-3.5 text-[#ff5500]" />
            <span className="font-mono text-[11px]">{categoryMeta?.shortLabel || issue.category}</span>
          </div>
          <StatusBadge status={issue.status} size="sm" />
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelect(issue.id)}
          className="font-heading font-semibold text-base sm:text-lg text-[#faf8f5] group-hover:text-[#ff7733] transition-colors cursor-pointer leading-snug mb-2"
        >
          {issue.title}
        </h3>

        {/* Description snippet */}
        <p className="text-xs sm:text-sm text-[#8a93a4] line-clamp-2 mb-3 leading-relaxed">
          {issue.description}
        </p>

        {/* Location specifics */}
        <div className="flex items-start gap-1.5 text-xs text-[#6e778a] font-mono mb-3 bg-[#0c0e14] p-2 border border-[#1b1d28]">
          <MapPin className="w-3.5 h-3.5 text-[#ff5500] shrink-0 mt-0.5" />
          <span className="line-clamp-1">{issue.specificLocation}</span>
        </div>

        {/* Latest Activity Snapshot */}
        {latestActivity && (
          <div className="text-[11px] font-mono text-[#7b8599] border-l-2 border-[#ff5500]/40 pl-2.5 py-0.5 mb-3 bg-[#131622]/40">
            <div className="flex items-center justify-between text-[#a1abbd]">
              <span className="font-semibold text-[#faf8f5] truncate">{latestActivity.action}</span>
              <span className="text-[10px] text-[#5e6678] shrink-0">
                {formatRelativeTime(latestActivity.timestamp)}
              </span>
            </div>
            <p className="text-[#7a8497] line-clamp-1 text-[10px] mt-0.5">
              by {latestActivity.actor} ({latestActivity.actorRole})
            </p>
          </div>
        )}

        {/* Proof of Fix Highlight if Resolved */}
        {isResolved && issue.proofOfFix && (
          <div className="p-2.5 bg-[#0f241a] border border-[#1b4332] text-xs mb-3 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
            <div>
              <div className="font-mono text-[10px] font-bold text-[#34d399] tracking-wider uppercase">
                PROOF OF FIX VERIFIED
              </div>
              <p className="text-[11px] text-[#a7f3d0] line-clamp-1 mt-0.5">
                {issue.proofOfFix.workSummary}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer Bar */}
      <div className="px-4 py-2.5 bg-[#0f1118] border-t border-[#1f2230] flex items-center justify-between text-xs">
        {/* Civic Upvote Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleUpvote(issue.id);
          }}
          className={`flex items-center gap-1.5 px-2 py-1 font-mono transition-colors text-xs ${
            issue.userUpvoted
              ? 'bg-[#ff5500]/20 text-[#ff5500] border border-[#ff5500]/40'
              : 'bg-[#181a24] text-[#8e97a8] hover:text-[#faf8f5] border border-[#262939]'
          }`}
          title="Affirm this issue affects campus community"
        >
          <ArrowUp className={`w-3.5 h-3.5 ${issue.userUpvoted ? 'stroke-2' : ''}`} />
          <span>{issue.upvotes}</span>
        </button>

        {/* Timestamp */}
        <span className="text-[11px] font-mono text-[#5f687a] flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatRelativeTime(issue.reportedAt)}
        </span>

        {/* Inspect action */}
        <button
          onClick={() => onSelect(issue.id)}
          className="text-xs font-mono text-[#ff7733] hover:text-[#ff9955] flex items-center gap-0.5 font-medium"
        >
          <span>Audit Trail</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </article>
  );
};
