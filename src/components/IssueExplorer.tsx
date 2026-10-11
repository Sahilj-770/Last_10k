import React, { useState } from 'react';
import type {
  Issue,
  IssueFilterState,
  IssueCategory,
  IssuePriority,
  IssueStatus,
  CampusZoneId,
} from '../types/issue';
import { IssueCard } from './IssueCard';
import { CATEGORY_DETAILS, CAMPUS_ZONES } from '../data/zones';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { formatRelativeTime } from '../utils/formatters';
import {
  Search,
  X,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Sparkles,
  ArrowUpDown,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface IssueExplorerProps {
  issues: Issue[];
  filteredIssues: Issue[];
  filterState: IssueFilterState;
  setFilterState: React.Dispatch<React.SetStateAction<IssueFilterState>>;
  onSelectIssue: (issueId: string) => void;
  onToggleUpvote: (issueId: string) => void;
  onOpenReportModal: () => void;
}

export const IssueExplorer: React.FC<IssueExplorerProps> = ({
  issues,
  filteredIssues,
  filterState,
  setFilterState,
  onSelectIssue,
  onToggleUpvote,
  onOpenReportModal,
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const hasActiveFilters =
    filterState.searchQuery !== '' ||
    filterState.status !== 'all' ||
    filterState.category !== 'all' ||
    filterState.priority !== 'all' ||
    filterState.zoneId !== 'all' ||
    filterState.proofOnly !== false;

  const handleResetFilters = () => {
    setFilterState({
      searchQuery: '',
      status: 'all',
      category: 'all',
      priority: 'all',
      zoneId: 'all',
      sortBy: 'newest',
      proofOnly: false,
    });
  };

  return (
    <div className="space-y-4">
      {/* Control Bar: Search + Filter Triggers */}
      <div className="bg-[#12141a] border border-[#242735] p-3 sm:p-4 shadow-xl">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#6e778a] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports by ID (PW-...), title, location, keywords..."
              value={filterState.searchQuery}
              onChange={(e) =>
                setFilterState((prev) => ({ ...prev, searchQuery: e.target.value }))
              }
              className="w-full bg-[#0d0e14] border border-[#242735] pl-9 pr-8 py-2 text-sm text-[#faf8f5] placeholder-[#5f687a] focus:border-[#ff5500] focus:outline-none transition-colors font-mono"
            />
            {filterState.searchQuery && (
              <button
                onClick={() => setFilterState((prev) => ({ ...prev, searchQuery: '' }))}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6e778a] hover:text-[#faf8f5]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Sort & View Toggle */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-[#0d0e14] border border-[#242735] px-2.5 py-1.5 text-xs font-mono">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#ff5500]" />
              <select
                value={filterState.sortBy}
                onChange={(e) =>
                  setFilterState((prev) => ({
                    ...prev,
                    sortBy: e.target.value as IssueFilterState['sortBy'],
                  }))
                }
                className="bg-transparent text-[#d1d5db] focus:outline-none cursor-pointer"
              >
                <option value="newest">NEWEST FIRST</option>
                <option value="oldest">OLDEST FIRST</option>
                <option value="priority">HIGHEST PRIORITY</option>
                <option value="recently_updated">RECENTLY UPDATED</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#0d0e14] border border-[#242735] p-0.5 text-xs">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-[#ff5500] text-black'
                    : 'text-[#8b92a2] hover:text-white'
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 transition-colors ${
                  viewMode === 'table'
                    ? 'bg-[#ff5500] text-black'
                    : 'text-[#8b92a2] hover:text-white'
                }`}
                title="Dense Ledger View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden flex items-center gap-1 bg-[#0d0e14] border border-[#242735] px-2.5 py-1.5 text-xs font-mono text-[#faf8f5]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff5500]" />
              <span>FILTERS</span>
            </button>
          </div>
        </div>

        {/* Filter Strip */}
        <div
          className={`mt-3 pt-3 border-t border-[#1e2230] space-y-3 ${
            showMobileFilters ? 'block' : 'hidden md:block'
          }`}
        >
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <span className="text-[#6e778a] text-[11px] uppercase mr-1">STATUS:</span>
            {(['all', 'reported', 'verified', 'in_progress', 'resolved'] as const).map((st) => {
              const count =
                st === 'all' ? issues.length : issues.filter((i) => i.status === st).length;
              return (
                <button
                  key={st}
                  onClick={() => setFilterState((prev) => ({ ...prev, status: st }))}
                  className={`px-2.5 py-1 border transition-colors ${
                    filterState.status === st
                      ? 'bg-[#ff5500] text-black font-semibold border-[#ff5500]'
                      : 'bg-[#0e1017] text-[#8e97a8] border-[#222533] hover:border-[#383d54] hover:text-[#faf8f5]'
                  }`}
                >
                  {st.toUpperCase().replace('_', ' ')} ({count})
                </button>
              );
            })}

            {/* Proof of Fix Quick Filter */}
            <button
              onClick={() =>
                setFilterState((prev) => ({ ...prev, proofOnly: !prev.proofOnly }))
              }
              className={`ml-auto px-2.5 py-1 border transition-colors flex items-center gap-1.5 ${
                filterState.proofOnly
                  ? 'bg-[#10b981] text-black font-semibold border-[#10b981]'
                  : 'bg-[#0e1017] text-[#34d399] border-[#10b981]/30 hover:border-[#10b981]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>PROOF OF FIX ONLY</span>
            </button>
          </div>

          {/* Secondary Filters: Priority, Category, Zone */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
            {/* Category */}
            <div className="flex items-center gap-2 bg-[#0c0e14] border border-[#222533] px-2.5 py-1.5">
              <span className="text-[#6e778a] shrink-0 text-[11px]">CATEGORY:</span>
              <select
                value={filterState.category}
                onChange={(e) =>
                  setFilterState((prev) => ({
                    ...prev,
                    category: e.target.value as IssueCategory | 'all',
                  }))
                }
                className="bg-transparent text-[#d1d5db] focus:outline-none w-full cursor-pointer"
              >
                <option value="all">ALL CATEGORIES</option>
                {Object.entries(CATEGORY_DETAILS).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className="flex items-center gap-2 bg-[#0c0e14] border border-[#222533] px-2.5 py-1.5">
              <span className="text-[#6e778a] shrink-0 text-[11px]">PRIORITY:</span>
              <select
                value={filterState.priority}
                onChange={(e) =>
                  setFilterState((prev) => ({
                    ...prev,
                    priority: e.target.value as IssuePriority | 'all',
                  }))
                }
                className="bg-transparent text-[#d1d5db] focus:outline-none w-full cursor-pointer"
              >
                <option value="all">ALL PRIORITIES</option>
                <option value="urgent">URGENT</option>
                <option value="high">HIGH</option>
                <option value="medium">MEDIUM</option>
                <option value="low">LOW</option>
              </select>
            </div>

            {/* Zone */}
            <div className="flex items-center gap-2 bg-[#0c0e14] border border-[#222533] px-2.5 py-1.5">
              <span className="text-[#6e778a] shrink-0 text-[11px]">ZONE:</span>
              <select
                value={filterState.zoneId}
                onChange={(e) =>
                  setFilterState((prev) => ({
                    ...prev,
                    zoneId: e.target.value as CampusZoneId | 'all',
                  }))
                }
                className="bg-transparent text-[#d1d5db] focus:outline-none w-full cursor-pointer"
              >
                <option value="all">ALL CAMPUS ZONES</option>
                {CAMPUS_ZONES.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.code}: {zone.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter Summary Bar */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-1 text-xs font-mono text-[#8e97a8]">
              <span>
                FILTER ACTIVE &middot; {filteredIssues.length} of {issues.length} records matching
              </span>
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-[#ff5500] hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results View */}
      {filteredIssues.length === 0 ? (
        /* Empty State */
        <div className="bg-[#12141a] border border-[#242735] p-12 text-center">
          <AlertCircle className="w-10 h-10 text-[#6e778a] mx-auto mb-3" />
          <h3 className="font-heading text-lg font-semibold text-[#faf8f5] mb-1">
            No matching reports found
          </h3>
          <p className="text-xs text-[#8a93a4] max-w-md mx-auto mb-5 font-mono">
            No infrastructure issues match your current query or filter criteria. Try adjusting the
            search or clearing active filters.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleResetFilters}
              className="bg-[#1a1d28] hover:bg-[#25293a] text-[#faf8f5] border border-[#2f3448] text-xs font-mono px-4 py-2 transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={onOpenReportModal}
              className="bg-[#ff5500] hover:bg-[#ff6b22] text-black font-semibold text-xs font-mono px-4 py-2 transition-colors"
            >
              + Log New Issue
            </button>
          </div>
        </div>
      ) : viewMode === 'cards' ? (
        /* Grid of Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onSelect={onSelectIssue}
              onToggleUpvote={onToggleUpvote}
            />
          ))}
        </div>
      ) : (
        /* Dense Table / Ledger View */
        <div className="bg-[#12141a] border border-[#242735] overflow-x-auto shadow-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0e1017] border-b border-[#242735] text-[#8e97a8] font-mono">
                <th className="py-3 px-4">IDENTIFIER</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">PRIORITY</th>
                <th className="py-3 px-4">TITLE & LOCATION</th>
                <th className="py-3 px-4">CATEGORY</th>
                <th className="py-3 px-4">REPORTED</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2230] font-mono">
              {filteredIssues.map((issue) => (
                <tr
                  key={issue.id}
                  onClick={() => onSelectIssue(issue.id)}
                  className="hover:bg-[#181a24] cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 text-[#ff5500] font-bold">{issue.id}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={issue.status} size="sm" />
                  </td>
                  <td className="py-3 px-4">
                    <PriorityBadge priority={issue.priority} size="sm" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-heading font-medium text-sm text-[#faf8f5] line-clamp-1">
                      {issue.title}
                    </div>
                    <div className="text-[11px] text-[#6b7280] line-clamp-1">
                      {issue.building} &middot; {issue.specificLocation}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#8e97a8]">
                    {CATEGORY_DETAILS[issue.category]?.shortLabel || issue.category}
                  </td>
                  <td className="py-3 px-4 text-[#6b7280]">
                    {formatRelativeTime(issue.reportedAt)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectIssue(issue.id);
                      }}
                      className="text-[#ff5500] hover:underline"
                    >
                      Audit Trail &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
