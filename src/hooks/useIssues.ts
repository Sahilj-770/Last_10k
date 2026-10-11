import { useState, useEffect, useMemo, useCallback } from 'react';
import type {
  Issue,
  IssueStatus,
  IssuePriority,
  IssueCategory,
  CampusZoneId,
  IssueFilterState,
  NetworkMetrics,
  ProofOfFixData,
  ActivityEntry,
} from '../types/issue';
import { INITIAL_ISSUES } from '../data/initialData';

const STORAGE_KEY = 'patchwork_civic_issues_v1';

export function useIssues() {
  const [issues, setIssues] = useState<Issue[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored issues, reverting to initial seed data', e);
    }
    return INITIAL_ISSUES;
  });

  // Sync to local storage whenever issues change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  }, [issues]);

  const [filterState, setFilterState] = useState<IssueFilterState>({
    searchQuery: '',
    status: 'all',
    category: 'all',
    priority: 'all',
    zoneId: 'all',
    sortBy: 'newest',
    proofOnly: false,
  });

  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  // Selected issue object
  const selectedIssue = useMemo(() => {
    if (!selectedIssueId) return null;
    return issues.find((i) => i.id === selectedIssueId) || null;
  }, [issues, selectedIssueId]);

  // Derived metrics from current data
  const metrics = useMemo<NetworkMetrics>(() => {
    const totalReports = issues.length;
    let openReports = 0;
    let inProgressReports = 0;
    let resolvedReports = 0;
    let demoCount = 0;
    let authenticCount = 0;

    const categoryCounts: Record<IssueCategory, number> = {
      water_plumbing: 0,
      accessibility: 0,
      waste_sanitation: 0,
      electrical_lighting: 0,
      furniture_fixtures: 0,
      doors_hardware: 0,
      structural_safety: 0,
    };

    const zoneCounts: Record<CampusZoneId, number> = {
      zone_a: 0,
      zone_b: 0,
      zone_c: 0,
      zone_d: 0,
      zone_e: 0,
    };

    let totalResolutionHours = 0;
    let validResolvedWithTime = 0;

    for (const issue of issues) {
      if (issue.isDemoRecord) demoCount++;
      else authenticCount++;

      if (issue.status === 'reported' || issue.status === 'verified') {
        openReports++;
      } else if (issue.status === 'in_progress') {
        inProgressReports++;
      } else if (issue.status === 'resolved') {
        resolvedReports++;

        // Calculate turnaround time in hours
        if (issue.proofOfFix?.resolutionTimeHours) {
          totalResolutionHours += issue.proofOfFix.resolutionTimeHours;
          validResolvedWithTime++;
        } else if (issue.resolvedAt && issue.reportedAt) {
          const hours =
            (new Date(issue.resolvedAt).getTime() - new Date(issue.reportedAt).getTime()) /
            (1000 * 60 * 60);
          if (hours > 0 && hours < 1000) {
            totalResolutionHours += hours;
            validResolvedWithTime++;
          }
        }
      }

      if (categoryCounts[issue.category] !== undefined) {
        categoryCounts[issue.category]++;
      }
      if (zoneCounts[issue.zoneId] !== undefined) {
        zoneCounts[issue.zoneId]++;
      }
    }

    const resolutionRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0;
    const avgResolutionTimeHours =
      validResolvedWithTime > 0 ? Number((totalResolutionHours / validResolvedWithTime).toFixed(1)) : 0;

    return {
      totalReports,
      openReports,
      inProgressReports,
      resolvedReports,
      resolutionRate,
      avgResolutionTimeHours,
      demoRecordCount: demoCount,
      authenticRecordCount: authenticCount,
      categoryCounts,
      zoneCounts,
    };
  }, [issues]);

  // Filtered issues list
  const filteredIssues = useMemo(() => {
    let result = [...issues];

    // Search query
    if (filterState.searchQuery.trim()) {
      const q = filterState.searchQuery.toLowerCase().trim();
      result = result.filter(
        (issue) =>
          issue.id.toLowerCase().includes(q) ||
          issue.title.toLowerCase().includes(q) ||
          issue.description.toLowerCase().includes(q) ||
          issue.building.toLowerCase().includes(q) ||
          issue.specificLocation.toLowerCase().includes(q) ||
          issue.reporterName.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (filterState.status !== 'all') {
      result = result.filter((issue) => issue.status === filterState.status);
    }

    // Category filter
    if (filterState.category !== 'all') {
      result = result.filter((issue) => issue.category === filterState.category);
    }

    // Priority filter
    if (filterState.priority !== 'all') {
      result = result.filter((issue) => issue.priority === filterState.priority);
    }

    // Zone filter
    if (filterState.zoneId !== 'all') {
      result = result.filter((issue) => issue.zoneId === filterState.zoneId);
    }

    // Proof only
    if (filterState.proofOnly) {
      result = result.filter((issue) => issue.status === 'resolved');
    }

    // Sort order
    const priorityWeight: Record<IssuePriority, number> = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    result.sort((a, b) => {
      switch (filterState.sortBy) {
        case 'priority':
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        case 'oldest':
          return new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime();
        case 'recently_updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'newest':
        default:
          return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
      }
    });

    return result;
  }, [issues, filterState]);

  // Create issue
  const createIssue = useCallback(
    (newIssueData: {
      title: string;
      category: IssueCategory;
      description: string;
      zoneId: CampusZoneId;
      building: string;
      specificLocation: string;
      priority: IssuePriority;
      reporterName?: string;
      reporterAffiliation?: string;
      photoUrl?: string;
      customCoords?: { x: number; y: number };
    }): Issue => {
      // Zone default coordinates if not specified
      const zoneCoords: Record<CampusZoneId, { x: number; y: number }> = {
        zone_a: { x: 22 + Math.floor(Math.random() * 12), y: 25 + Math.floor(Math.random() * 12) },
        zone_b: { x: 30 + Math.floor(Math.random() * 14), y: 70 + Math.floor(Math.random() * 14) },
        zone_c: { x: 48 + Math.floor(Math.random() * 10), y: 46 + Math.floor(Math.random() * 10) },
        zone_d: { x: 72 + Math.floor(Math.random() * 10), y: 30 + Math.floor(Math.random() * 12) },
        zone_e: { x: 76 + Math.floor(Math.random() * 12), y: 72 + Math.floor(Math.random() * 12) },
      };

      const now = new Date().toISOString();
      const randomSeq = Math.floor(100 + Math.random() * 899);
      const generatedId = `PW-2026-${randomSeq}`;

      const reporter = newIssueData.reporterName?.trim() || 'Community Member';
      const affiliation = newIssueData.reporterAffiliation?.trim() || 'Campus Resident';

      const initialActivity: ActivityEntry = {
        id: `act-${Date.now()}-1`,
        timestamp: now,
        actor: reporter,
        actorRole: affiliation,
        action: 'Report Submitted',
        notes: newIssueData.description.slice(0, 160) + (newIssueData.description.length > 160 ? '...' : ''),
        evidencePhoto: newIssueData.photoUrl,
      };

      const newIssue: Issue = {
        id: generatedId,
        title: newIssueData.title.trim(),
        category: newIssueData.category,
        description: newIssueData.description.trim(),
        zoneId: newIssueData.zoneId,
        building: newIssueData.building.trim(),
        specificLocation: newIssueData.specificLocation.trim(),
        mapCoordinates: newIssueData.customCoords || zoneCoords[newIssueData.zoneId],
        priority: newIssueData.priority,
        status: 'reported',
        reportedAt: now,
        updatedAt: now,
        reporterName: reporter,
        reporterAffiliation: affiliation,
        isDemoRecord: false,
        photoUrl: newIssueData.photoUrl,
        activityHistory: [initialActivity],
        upvotes: 1,
        userUpvoted: true,
      };

      setIssues((prev) => [newIssue, ...prev]);
      return newIssue;
    },
    []
  );

  // Update status transition
  const updateIssueStatus = useCallback(
    (
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
    ) => {
      const now = new Date().toISOString();

      setIssues((prev) =>
        prev.map((issue) => {
          if (issue.id !== issueId) return issue;

          const activityId = `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          let actionLabel = `Status advanced to ${newStatus.toUpperCase()}`;
          if (newStatus === 'verified') actionLabel = 'Physical Inspection Verified';
          if (newStatus === 'in_progress') actionLabel = 'Maintenance Crew Assigned';
          if (newStatus === 'resolved') actionLabel = 'Proof of Fix Confirmed & Signed Off';

          const newActivity: ActivityEntry = {
            id: activityId,
            timestamp: now,
            actor: actor || 'Campus Maintenance Lead',
            actorRole: actorRole || 'Facilities Operations',
            action: actionLabel,
            notes: notes || `Status changed from ${issue.status} to ${newStatus}.`,
            statusChange: newStatus,
            evidencePhoto: proofDetails?.afterPhotoUrl,
          };

          let proofOfFix: ProofOfFixData | undefined = issue.proofOfFix;
          let resolvedAt = issue.resolvedAt;

          if (newStatus === 'resolved') {
            resolvedAt = now;
            const diffHours =
              (new Date(now).getTime() - new Date(issue.reportedAt).getTime()) / (1000 * 60 * 60);
            const roundedHours = Math.max(0.5, Number(diffHours.toFixed(1)));

            proofOfFix = {
              resolvedAt: now,
              resolvedBy: actor || 'Facilities Specialist',
              workSummary: proofDetails?.workSummary || notes || 'Remediation completed and verified.',
              verificationMethod:
                proofDetails?.verificationMethod || 'On-site physical inspection & photo verification',
              afterPhotoUrl: proofDetails?.afterPhotoUrl,
              resolutionTimeHours: roundedHours,
            };
          } else if (issue.status === 'resolved') {
            // Reopened
            resolvedAt = undefined;
            proofOfFix = undefined;
          }

          return {
            ...issue,
            status: newStatus,
            updatedAt: now,
            resolvedAt,
            proofOfFix,
            activityHistory: [...issue.activityHistory, newActivity],
          };
        })
      );
    },
    []
  );

  // Upvote issue
  const toggleUpvote = useCallback((issueId: string) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id !== issueId) return issue;
        const wasUpvoted = Boolean(issue.userUpvoted);
        return {
          ...issue,
          upvotes: wasUpvoted ? Math.max(0, issue.upvotes - 1) : issue.upvotes + 1,
          userUpvoted: !wasUpvoted,
        };
      })
    );
  }, []);

  // Reset to initial demo data
  const resetToDemoData = useCallback(() => {
    setIssues(INITIAL_ISSUES);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ISSUES));
    } catch (e) {
      console.error(e);
    }
  }, []);

  return {
    issues,
    filteredIssues,
    metrics,
    filterState,
    setFilterState,
    selectedIssueId,
    setSelectedIssueId,
    selectedIssue,
    createIssue,
    updateIssueStatus,
    toggleUpvote,
    resetToDemoData,
  };
}
