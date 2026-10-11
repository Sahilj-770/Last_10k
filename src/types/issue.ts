export type IssueStatus = 'reported' | 'verified' | 'in_progress' | 'resolved';

export type IssuePriority = 'urgent' | 'high' | 'medium' | 'low';

export type IssueCategory =
  | 'water_plumbing'
  | 'accessibility'
  | 'waste_sanitation'
  | 'electrical_lighting'
  | 'furniture_fixtures'
  | 'doors_hardware'
  | 'structural_safety';

export type CampusZoneId = 'zone_a' | 'zone_b' | 'zone_c' | 'zone_d' | 'zone_e';

export interface CampusZone {
  id: CampusZoneId;
  name: string;
  code: string;
  quadrant: string;
  description: string;
  buildings: string[];
  color: string;
}

export interface ActivityEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  notes: string;
  statusChange?: IssueStatus;
  evidenceNote?: string;
  evidencePhoto?: string;
}

export interface ProofOfFixData {
  resolvedAt: string;
  resolvedBy: string;
  workSummary: string;
  afterPhotoUrl?: string;
  verificationMethod: string;
  resolutionTimeHours?: number;
}

export interface Issue {
  id: string;
  title: string;
  category: IssueCategory;
  description: string;
  zoneId: CampusZoneId;
  building: string;
  specificLocation: string;
  mapCoordinates: { x: number; y: number }; // Percentage 0-100 on schematic map
  priority: IssuePriority;
  status: IssueStatus;
  reportedAt: string;
  updatedAt: string;
  resolvedAt?: string;
  reporterName: string;
  reporterAffiliation: string;
  isDemoRecord: boolean;
  photoUrl?: string;
  proofOfFix?: ProofOfFixData;
  activityHistory: ActivityEntry[];
  upvotes: number;
  userUpvoted?: boolean;
}

export interface IssueFilterState {
  searchQuery: string;
  status: IssueStatus | 'all';
  category: IssueCategory | 'all';
  priority: IssuePriority | 'all';
  zoneId: CampusZoneId | 'all';
  sortBy: 'newest' | 'oldest' | 'priority' | 'recently_updated';
  proofOnly: boolean;
}

export interface NetworkMetrics {
  totalReports: number;
  openReports: number;
  inProgressReports: number;
  resolvedReports: number;
  resolutionRate: number; // 0 to 100 percentage
  avgResolutionTimeHours: number;
  demoRecordCount: number;
  authenticRecordCount: number;
  categoryCounts: Record<IssueCategory, number>;
  zoneCounts: Record<CampusZoneId, number>;
}
