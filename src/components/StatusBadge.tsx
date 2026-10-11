import React from 'react';
import type { IssuePriority, IssueStatus } from '../types/issue';
import { getStatusLabel, getPriorityLabel } from '../utils/formatters';
import { CheckCircle2, Clock, Wrench, ShieldAlert } from 'lucide-react';

interface StatusBadgeProps {
  status: IssueStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const label = getStatusLabel(status);

  const icons = {
    reported: <Clock className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />,
    verified: <ShieldAlert className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />,
    in_progress: <Wrench className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />,
    resolved: <CheckCircle2 className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />,
  };

  const sizeClasses =
    size === 'sm'
      ? 'text-[10px] px-1.5 py-0.5 gap-1 font-mono tracking-wider uppercase'
      : 'text-xs px-2.5 py-1 gap-1.5 font-mono tracking-wider uppercase';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-xs transition-colors badge-status-${status} ${sizeClasses}`}
    >
      {icons[status]}
      <span>{label}</span>
    </span>
  );
};

interface PriorityBadgeProps {
  priority: IssuePriority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const label = getPriorityLabel(priority);

  const sizeClasses =
    size === 'sm'
      ? 'text-[10px] px-1.5 py-0.5 font-mono tracking-wider uppercase'
      : 'text-xs px-2 py-0.5 font-mono tracking-wider uppercase';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-xs transition-colors badge-priority-${priority} ${sizeClasses}`}
    >
      {priority === 'urgent' && <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-1 animate-pulse" />}
      {label}
    </span>
  );
};
