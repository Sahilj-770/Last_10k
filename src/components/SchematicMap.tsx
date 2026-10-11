import React, { useState } from 'react';
import type { Issue, CampusZoneId, IssueStatus } from '../types/issue';
import { CAMPUS_ZONES, CATEGORY_DETAILS } from '../data/zones';
import { CategoryIcon } from './CategoryIcon';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import {
  Compass,
  Layers,
  MapPin,
  Crosshair,
  CheckCircle2,
  Clock,
  Wrench,
  ChevronRight,
  Maximize2,
  Filter,
} from 'lucide-react';

interface SchematicMapProps {
  issues: Issue[];
  selectedIssueId: string | null;
  onSelectIssue: (issueId: string) => void;
  onOpenReportModal: () => void;
}

export const SchematicMap: React.FC<SchematicMapProps> = ({
  issues,
  selectedIssueId,
  onSelectIssue,
  onOpenReportModal,
}) => {
  const [hoveredIssueId, setHoveredIssueId] = useState<string | null>(null);
  const [hoveredZoneId, setHoveredZoneId] = useState<CampusZoneId | null>(null);
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'all'>('all');
  const [activeZoneFilter, setActiveZoneFilter] = useState<CampusZoneId | 'all'>('all');
  const [viewMode, setViewMode] = useState<'schematic' | 'directory'>('schematic');

  const filteredPins = issues.filter((issue) => {
    if (statusFilter !== 'all' && issue.status !== statusFilter) return false;
    if (activeZoneFilter !== 'all' && issue.zoneId !== activeZoneFilter) return false;
    return true;
  });

  const hoveredIssue = issues.find((i) => i.id === hoveredIssueId);
  const selectedIssue = issues.find((i) => i.id === selectedIssueId);

  // Status counts for legend
  const openCount = issues.filter((i) => i.status === 'reported' || i.status === 'verified').length;
  const inProgressCount = issues.filter((i) => i.status === 'in_progress').length;
  const resolvedCount = issues.filter((i) => i.status === 'resolved').length;

  return (
    <div className="bg-[#101217] border border-[#242735] rounded-none overflow-hidden relative shadow-2xl">
      {/* Schematic Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#242735] px-4 py-3 bg-[#13151e] gap-3">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-[#ff5500] animate-pulse" />
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xs text-[#ff5500] tracking-widest uppercase">
              CAMPUS SCHEMATIC GRID
            </span>
            <span className="font-mono text-[11px] text-[#6b7280] hidden sm:inline">
              // EPSG:4326 // REF: QUAD-ATLAS-2026
            </span>
          </div>
        </div>

        {/* Controls: Filter & View Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status quick toggle */}
          <div className="flex items-center bg-[#0d0e13] border border-[#222533] p-0.5 text-xs font-mono">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 transition-colors ${
                statusFilter === 'all'
                  ? 'bg-[#1e2230] text-[#faf8f5]'
                  : 'text-[#8b92a2] hover:text-[#d1d5db]'
              }`}
            >
              ALL ({issues.length})
            </button>
            <button
              onClick={() => setStatusFilter('reported')}
              className={`px-2 py-1 transition-colors ${
                statusFilter === 'reported'
                  ? 'bg-[#ff5500]/20 text-[#ff7733]'
                  : 'text-[#8b92a2] hover:text-[#ff7733]'
              }`}
            >
              OPEN ({openCount})
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`px-2 py-1 transition-colors ${
                statusFilter === 'in_progress'
                  ? 'bg-[#f59e0b]/20 text-[#fbbf24]'
                  : 'text-[#8b92a2] hover:text-[#fbbf24]'
              }`}
            >
              ACTIVE ({inProgressCount})
            </button>
            <button
              onClick={() => setStatusFilter('resolved')}
              className={`px-2 py-1 transition-colors ${
                statusFilter === 'resolved'
                  ? 'bg-[#10b981]/20 text-[#34d399]'
                  : 'text-[#8b92a2] hover:text-[#34d399]'
              }`}
            >
              RESOLVED ({resolvedCount})
            </button>
          </div>

          {/* Mode switch for mobile/dense display */}
          <div className="flex items-center bg-[#0d0e13] border border-[#222533] p-0.5 text-xs font-mono">
            <button
              onClick={() => setViewMode('schematic')}
              className={`px-2.5 py-1 flex items-center gap-1.5 transition-colors ${
                viewMode === 'schematic'
                  ? 'bg-[#ff5500] text-black font-semibold'
                  : 'text-[#8b92a2] hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>MAP</span>
            </button>
            <button
              onClick={() => setViewMode('directory')}
              className={`px-2.5 py-1 flex items-center gap-1.5 transition-colors ${
                viewMode === 'directory'
                  ? 'bg-[#ff5500] text-black font-semibold'
                  : 'text-[#8b92a2] hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>DIRECTORY</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Viewport */}
      {viewMode === 'schematic' ? (
        <div className="relative w-full aspect-16/10 sm:aspect-16/9 md:aspect-21/10 min-h-[420px] blueprint-bg overflow-hidden select-none">
          {/* SVG Campus Layout */}
          <svg
            viewBox="0 0 1000 560"
            className="w-full h-full pointer-events-auto"
            style={{ shapeRendering: 'geometricPrecision' }}
          >
            <defs>
              {/* Architectural Hatch Pattern */}
              <pattern
                id="archHatch"
                width="8"
                height="8"
                patternTransform="rotate(45 0 0)"
                patternUnits="userSpaceOnUse"
              >
                <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              </pattern>
              <pattern
                id="courtyardPattern"
                width="16"
                height="16"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="8" cy="8" r="1" fill="rgba(255,255,255,0.06)" />
              </pattern>
            </defs>

            {/* Perimeter & Coordinate Boundaries */}
            <rect
              x="20"
              y="20"
              width="960"
              height="520"
              fill="none"
              stroke="#242735"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            {/* Axis Grid markings */}
            <g opacity="0.3" fill="#64748b" fontFamily="monospace" fontSize="8">
              <text x="30" y="14">GRID-X // 000</text>
              <text x="250" y="14">GRID-X // 250</text>
              <text x="500" y="14">GRID-X // 500</text>
              <text x="750" y="14">GRID-X // 750</text>
              <text x="940" y="14">GRID-X // 999</text>
              <text x="4" y="40">Y00</text>
              <text x="4" y="280">Y50</text>
              <text x="4" y="520">Y99</text>
            </g>

            {/* Pedestrian Pathways and Spine */}
            <g stroke="#1e2230" strokeWidth="20" strokeLinecap="round" opacity="0.6">
              {/* East-West Pedestrian Promenade */}
              <line x1="140" y1="280" x2="860" y2="280" />
              {/* North-South Spine */}
              <line x1="500" y1="80" x2="500" y2="480" />
              {/* Diagonal Connector */}
              <line x1="240" y1="160" x2="480" y2="280" />
              <line x1="520" y1="280" x2="760" y2="400" />
            </g>

            {/* Central Courtyard & Piazza */}
            <rect
              x="420"
              y="220"
              width="160"
              height="120"
              fill="url(#courtyardPattern)"
              stroke="#2b3042"
              strokeWidth="1"
            />
            <circle cx="500" cy="280" r="28" fill="#13151d" stroke="#ff5500" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <text x="500" y="283" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#ff5500" opacity="0.8">
              CIVIC FORUM
            </text>

            {/* ZONE A: Science & Engineering Quad (Top-Left) */}
            <g
              className="cursor-pointer transition-opacity"
              opacity={hoveredZoneId && hoveredZoneId !== 'zone_a' ? 0.35 : 1}
              onMouseEnter={() => setHoveredZoneId('zone_a')}
              onMouseLeave={() => setHoveredZoneId(null)}
              onClick={() => setActiveZoneFilter(activeZoneFilter === 'zone_a' ? 'all' : 'zone_a')}
            >
              {/* Building: Foundry Hall */}
              <polygon
                points="100,70 230,70 230,170 150,170 150,210 100,210"
                fill="#151720"
                stroke={activeZoneFilter === 'zone_a' ? '#ff5500' : '#2d3244'}
                strokeWidth={activeZoneFilter === 'zone_a' ? '2' : '1.5'}
              />
              <rect x="105" y="75" width="120" height="90" fill="url(#archHatch)" opacity="0.7" />
              <text x="115" y="100" fontFamily="sans-serif" fontWeight="600" fontSize="11" fill="#faf8f5">
                FOUNDRY HALL
              </text>
              <text x="115" y="118" fontFamily="monospace" fontSize="8" fill="#ff7733">
                MECH LABS // AUD 108
              </text>

              {/* Building: Turing Labs */}
              <rect
                x="250"
                y="90"
                width="140"
                height="110"
                fill="#151720"
                stroke={activeZoneFilter === 'zone_a' ? '#ff5500' : '#2d3244'}
                strokeWidth={activeZoneFilter === 'zone_a' ? '2' : '1.5'}
              />
              <text x="265" y="130" fontFamily="sans-serif" fontWeight="600" fontSize="11" fill="#faf8f5">
                TURING COMPUTING LABS
              </text>
              <text x="265" y="148" fontFamily="monospace" fontSize="8" fill="#94a3b8">
                SERVER SPACES // CS CORRIDOR
              </text>

              {/* Zone Tag */}
              <rect x="100" y="44" width="76" height="18" fill="#ff5500" fillOpacity="0.15" stroke="#ff5500" strokeWidth="1" />
              <text x="108" y="56" fontFamily="monospace" fontSize="8" fontWeight="bold" fill="#ff5500">
                ZONE A // NW
              </text>
            </g>

            {/* ZONE B: Arts & Architecture Terrace (Bottom-Left) */}
            <g
              className="cursor-pointer transition-opacity"
              opacity={hoveredZoneId && hoveredZoneId !== 'zone_b' ? 0.35 : 1}
              onMouseEnter={() => setHoveredZoneId('zone_b')}
              onMouseLeave={() => setHoveredZoneId(null)}
              onClick={() => setActiveZoneFilter(activeZoneFilter === 'zone_b' ? 'all' : 'zone_b')}
            >
              {/* Building: Atelier Studios */}
              <polygon
                points="90,340 230,340 230,480 180,480 180,420 90,420"
                fill="#151720"
                stroke={activeZoneFilter === 'zone_b' ? '#3b82f6' : '#2d3244'}
                strokeWidth={activeZoneFilter === 'zone_b' ? '2' : '1.5'}
              />
              <rect x="95" y="345" width="130" height="70" fill="url(#archHatch)" opacity="0.7" />
              <text x="105" y="375" fontFamily="sans-serif" fontWeight="600" fontSize="11" fill="#faf8f5">
                ATELIER STUDIOS
              </text>
              <text x="105" y="393" fontFamily="monospace" fontSize="8" fill="#60a5fa">
                ARCH STUDIOS // CERAMICS
              </text>

              {/* South Colonnade / Walkway */}
              <rect
                x="250"
                y="370"
                width="140"
                height="80"
                fill="#151720"
                stroke={activeZoneFilter === 'zone_b' ? '#3b82f6' : '#2d3244'}
                strokeWidth={activeZoneFilter === 'zone_b' ? '2' : '1.5'}
              />
              <text x="265" y="405" fontFamily="sans-serif" fontWeight="600" fontSize="11" fill="#faf8f5">
                SOUTH COLONNADE
              </text>
              <text x="265" y="423" fontFamily="monospace" fontSize="8" fill="#94a3b8">
                DESIGN PAVILION // PLAZA
              </text>

              {/* Zone Tag */}
              <rect x="90" y="314" width="76" height="18" fill="#3b82f6" fillOpacity="0.15" stroke="#3b82f6" strokeWidth="1" />
              <text x="98" y="326" fontFamily="monospace" fontSize="8" fontWeight="bold" fill="#60a5fa">
                ZONE B // SW
              </text>
            </g>

            {/* ZONE C: Student Commons & Refectory (Center) */}
            <g
              className="cursor-pointer transition-opacity"
              opacity={hoveredZoneId && hoveredZoneId !== 'zone_c' ? 0.35 : 1}
              onMouseEnter={() => setHoveredZoneId('zone_c')}
              onMouseLeave={() => setHoveredZoneId(null)}
              onClick={() => setActiveZoneFilter(activeZoneFilter === 'zone_c' ? 'all' : 'zone_c')}
            >
              {/* Building: Refectory Hall */}
              <rect
                x="440"
                y="110"
                width="120"
                height="90"
                fill="#151720"
                stroke={activeZoneFilter === 'zone_c' ? '#f59e0b' : '#2d3244'}
                strokeWidth={activeZoneFilter === 'zone_c' ? '2' : '1.5'}
              />
              <text x="455" y="145" fontFamily="sans-serif" fontWeight="600" fontSize="11" fill="#faf8f5">
                REFECTORY HALL
              </text>
              <text x="455" y="163" fontFamily="monospace" fontSize="8" fill="#fbbf24">
                MAIN DINING // COMMONS
              </text>

              {/* Building: Student Union */}
              <rect
                x="430"
                y="360"
                width="140"
                height="90"
                fill="#151720"
                stroke={activeZoneFilter === 'zone_c' ? '#f59e0b' : '#2d3244'}
                strokeWidth={activeZoneFilter === 'zone_c' ? '2' : '1.5'}
              />
              <text x="445" y="395" fontFamily="sans-serif" fontWeight="600" fontSize="11" fill="#faf8f5">
                STUDENT UNION
              </text>
              <text x="445" y="413" fontFamily="monospace" fontSize="8" fill="#fbbf24">
                GUILD OFFICES // LOUNGE
              </text>

              {/* Zone Tag */}
              <rect x="440" y="84" width="76" height="18" fill="#f59e0b" fillOpacity="0.15" stroke="#f59e0b" strokeWidth="1" />
              <text x="448" y="96" fontFamily="monospace" fontSize="8" fontWeight="bold" fill="#fbbf24">
                ZONE C // CTR
              </text>
            </g>

            {/* ZONE D: Library & Archival Spine (Top-Right) */}
            <g
              className="cursor-pointer transition-opacity"
              opacity={hoveredZoneId && hoveredZoneId !== 'zone_d' ? 0.35 : 1}
              onMouseEnter={() => setHoveredZoneId('zone_d')}
              onMouseLeave={() => setHoveredZoneId(null)}
              onClick={() => setActiveZoneFilter(activeZoneFilter === 'zone_d' ? 'all' : 'zone_d')}
            >
              {/* Building: Main Rotunda */}
              <circle
                cx="720"
                cy="140"
                r="65"
                fill="#151720"
                stroke={activeZoneFilter === 'zone_d' ? '#10b981' : '#2d3244'}
                strokeWidth={activeZoneFilter === 'zone_d' ? '2' : '1.5'}
              />
              <circle cx="720" cy="140" r="40" fill="url(#archHatch)" opacity="0.6" />
              <text x="720" y="140" textAnchor="middle" fontFamily="sans-serif" fontWeight="600" fontSize="11" fill="#faf8f5">
                MAIN ROTUNDA
              </text>
              <text x="720" y="156" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#34d399">
                LAW LIBRARY // ARCHIVES
              </text>

              {/* Archival Annex */}
              <rect
                x="810"
                y="90"
                width="120"
                height="120"
                fill="#151720"
                stroke={activeZoneFilter === 'zone_d' ? '#10b981' : '#2d3244'}
                strokeWidth={activeZoneFilter === 'zone_d' ? '2' : '1.5'}
              />
              <text x="825" y="135" fontFamily="sans-serif" fontWeight="600" fontSize="11" fill="#faf8f5">
                SPECIAL COLLECTIONS
              </text>
              <text x="825" y="153" fontFamily="monospace" fontSize="8" fill="#94a3b8">
                ANNEX // RESEARCH
              </text>

              {/* Zone Tag */}
              <rect x="680" y="44" width="76" height="18" fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="1" />
              <text x="688" y="56" fontFamily="monospace" fontSize="8" fontWeight="bold" fill="#34d399">
                ZONE D // NE
              </text>
            </g>

            {/* ZONE E: Transit Bay & Field Pavilion (Bottom-Right) */}
            <g
              className="cursor-pointer transition-opacity"
              opacity={hoveredZoneId && hoveredZoneId !== 'zone_e' ? 0.35 : 1}
              onMouseEnter={() => setHoveredZoneId('zone_e')}
              onMouseLeave={() => setHoveredZoneId(null)}
              onClick={() => setActiveZoneFilter(activeZoneFilter === 'zone_e' ? 'all' : 'zone_e')}
            >
              {/* Transit Center */}
              <polygon
                points="660,360 840,360 810,480 630,480"
                fill="#151720"
                stroke={activeZoneFilter === 'zone_e' ? '#a855f7' : '#2d3244'}
                strokeWidth={activeZoneFilter === 'zone_e' ? '2' : '1.5'}
              />
              <text x="670" y="405" fontFamily="sans-serif" fontWeight="600" fontSize="11" fill="#faf8f5">
                TRANSIT INTERMODAL
              </text>
              <text x="670" y="423" fontFamily="monospace" fontSize="8" fill="#c084fc">
                BUS BAYS // BIKE HUB
              </text>

              {/* Sports Pavilion */}
              <rect
                x="850"
                y="350"
                width="80"
                height="110"
                fill="#151720"
                stroke={activeZoneFilter === 'zone_e' ? '#a855f7' : '#2d3244'}
                strokeWidth={activeZoneFilter === 'zone_e' ? '2' : '1.5'}
              />
              <text x="858" y="390" fontFamily="sans-serif" fontWeight="600" fontSize="10" fill="#faf8f5">
                SPORTS
              </text>
              <text x="858" y="405" fontFamily="monospace" fontSize="8" fill="#94a3b8">
                PAVILION
              </text>

              {/* Zone Tag */}
              <rect x="660" y="324" width="76" height="18" fill="#a855f7" fillOpacity="0.15" stroke="#a855f7" strokeWidth="1" />
              <text x="668" y="336" fontFamily="monospace" fontSize="8" fontWeight="bold" fill="#c084fc">
                ZONE E // SE
              </text>
            </g>

            {/* Scale Bar & Blueprint Stamp */}
            <g transform="translate(40, 500)">
              <line x1="0" y1="0" x2="100" y2="0" stroke="#4b5563" strokeWidth="2" />
              <line x1="0" y1="-4" x2="0" y2="4" stroke="#4b5563" strokeWidth="2" />
              <line x1="50" y1="-3" x2="50" y2="3" stroke="#4b5563" strokeWidth="1" />
              <line x1="100" y1="-4" x2="100" y2="4" stroke="#4b5563" strokeWidth="2" />
              <text x="0" y="14" fontFamily="monospace" fontSize="8" fill="#6b7280">
                0m
              </text>
              <text x="45" y="14" fontFamily="monospace" fontSize="8" fill="#6b7280">
                50m
              </text>
              <text x="90" y="14" fontFamily="monospace" fontSize="8" fill="#6b7280">
                100m
              </text>
            </g>

            {/* Orientation Compass */}
            <g transform="translate(930, 480)" opacity="0.7">
              <circle cx="0" cy="0" r="16" fill="#13151f" stroke="#374151" strokeWidth="1" />
              <path d="M0 -12 L4 0 L0 12 L-4 0 Z" fill="#ff5500" />
              <text x="0" y="-14" textAnchor="middle" fontFamily="monospace" fontSize="8" fontWeight="bold" fill="#faf8f5">
                N
              </text>
            </g>

            {/* Interactive Issue Pins Layer */}
            {filteredPins.map((issue) => {
              // Convert coordinate percentages to 1000x560 space
              const pinX = (issue.mapCoordinates.x / 100) * 940 + 30;
              const pinY = (issue.mapCoordinates.y / 100) * 500 + 30;

              const isSelected = selectedIssueId === issue.id;
              const isHovered = hoveredIssueId === issue.id;
              const isResolved = issue.status === 'resolved';
              const isInProgress = issue.status === 'in_progress';
              const isUrgent = issue.priority === 'urgent';

              // Marker pin styling
              let pinFill = '#ff5500'; // Default open
              if (isResolved) pinFill = '#10b981';
              else if (isInProgress) pinFill = '#f59e0b';
              else if (issue.status === 'verified') pinFill = '#06b6d4';

              return (
                <g
                  key={issue.id}
                  transform={`translate(${pinX}, ${pinY})`}
                  className="cursor-pointer transition-transform duration-150"
                  onMouseEnter={() => setHoveredIssueId(issue.id)}
                  onMouseLeave={() => setHoveredIssueId(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectIssue(issue.id);
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Issue: ${issue.title}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onSelectIssue(issue.id);
                    }
                  }}
                >
                  {/* Outer Pulsing Aura for Open / Urgent issues */}
                  {(!isResolved || isSelected) && (
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? '24' : isUrgent ? '20' : '15'}
                      fill={pinFill}
                      fillOpacity={isSelected ? 0.35 : 0.2}
                      className={isUrgent || isSelected ? 'animate-ping-slow' : 'animate-pulse-subtle'}
                    />
                  )}

                  {/* Target Crosshair if Selected */}
                  {isSelected && (
                    <g stroke={pinFill} strokeWidth="1.5" strokeDasharray="3 2" opacity="0.9">
                      <circle cx="0" cy="0" r="18" fill="none" />
                      <line x1="-22" y1="0" x2="22" y2="0" />
                      <line x1="0" y1="-22" x2="0" y2="22" />
                    </g>
                  )}

                  {/* Pin Base Circle */}
                  <circle
                    cx="0"
                    cy="0"
                    r={isSelected || isHovered ? '11' : '8'}
                    fill="#0a0b0e"
                    stroke={pinFill}
                    strokeWidth={isSelected ? '3' : '2'}
                  />

                  {/* Pin Inner Icon / Pip */}
                  {isResolved ? (
                    <circle cx="0" cy="0" r="4.5" fill="#10b981" />
                  ) : isInProgress ? (
                    <rect x="-3" y="-3" width="6" height="6" fill="#f59e0b" transform="rotate(45)" />
                  ) : (
                    <circle cx="0" cy="0" r={isUrgent ? '4' : '3.5'} fill="#ff5500" />
                  )}

                  {/* Floating ID badge on selected/hovered */}
                  {(isSelected || isHovered) && (
                    <g transform="translate(0, -18)">
                      <rect
                        x="-38"
                        y="-14"
                        width="76"
                        height="15"
                        rx="1"
                        fill="#0c0e14"
                        stroke={pinFill}
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="-3"
                        textAnchor="middle"
                        fontFamily="monospace"
                        fontSize="9"
                        fontWeight="bold"
                        fill="#faf8f5"
                      >
                        {issue.id}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Hover Tooltip */}
          {hoveredIssue && (
            <div
              className="absolute pointer-events-none z-30 bg-[#0d0e14]/95 border border-[#3b3f54] p-3 text-xs shadow-2xl max-w-xs transition-opacity duration-150 backdrop-blur-md"
              style={{
                left: `${Math.min(75, Math.max(5, hoveredIssue.mapCoordinates.x))}%`,
                top: `${Math.min(70, Math.max(10, hoveredIssue.mapCoordinates.y))}%`,
                transform: 'translate(-50%, -115%)',
              }}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5 font-mono text-[10px] text-[#9ca3af] border-b border-[#242735] pb-1">
                <span className="text-[#ff5500] font-bold">{hoveredIssue.id}</span>
                <span>{hoveredIssue.building}</span>
              </div>
              <h4 className="font-heading font-medium text-sm text-[#faf8f5] mb-2 leading-tight">
                {hoveredIssue.title}
              </h4>
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={hoveredIssue.status} size="sm" />
                <PriorityBadge priority={hoveredIssue.priority} size="sm" />
                <span className="text-[10px] text-[#6b7280] font-mono ml-auto">Click to inspect</span>
              </div>
            </div>
          )}

          {/* Bottom Bar Controls Overlay */}
          <div className="absolute bottom-2 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none text-xs">
            <div className="flex items-center gap-2 bg-[#0c0d12]/90 border border-[#242735] px-2.5 py-1.5 font-mono text-[11px] pointer-events-auto backdrop-blur-sm">
              <span className="text-[#9ca3af]">ZONE FILTER:</span>
              {CAMPUS_ZONES.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setActiveZoneFilter(activeZoneFilter === zone.id ? 'all' : zone.id)}
                  className={`px-1.5 py-0.5 transition-colors ${
                    activeZoneFilter === zone.id
                      ? 'bg-[#ff5500] text-black font-semibold'
                      : 'text-[#8b92a2] hover:text-white'
                  }`}
                >
                  {zone.code}
                </button>
              ))}
              {activeZoneFilter !== 'all' && (
                <button
                  onClick={() => setActiveZoneFilter('all')}
                  className="text-[#ef4444] hover:underline ml-1"
                >
                  CLEAR
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 bg-[#0c0d12]/90 border border-[#242735] px-2.5 py-1.5 font-mono text-[11px] pointer-events-auto backdrop-blur-sm">
              <span className="text-[#9ca3af]">LEGEND:</span>
              <span className="inline-flex items-center gap-1 text-[#ff7733]">
                <span className="w-2 h-2 rounded-full bg-[#ff5500]" /> Open
              </span>
              <span className="inline-flex items-center gap-1 text-[#fbbf24]">
                <span className="w-2 h-2 rotate-45 bg-[#f59e0b]" /> In-Progress
              </span>
              <span className="inline-flex items-center gap-1 text-[#34d399]">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" /> Resolved
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Alternative Zone Directory View for Small Screens / Dense Lists */
        <div className="p-4 bg-[#0d0e14] divide-y divide-[#222533]">
          <div className="pb-3 text-xs font-mono text-[#9ca3af] flex items-center justify-between">
            <span>CAMPUS INFRASTRUCTURE DIRECTORY // {CAMPUS_ZONES.length} SECTORS</span>
            <span className="text-[#ff5500]">{issues.length} ACTIVE REPORTS</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-3">
            {CAMPUS_ZONES.map((zone) => {
              const zoneIssues = issues.filter((i) => i.zoneId === zone.id);
              const zoneOpen = zoneIssues.filter((i) => i.status !== 'resolved').length;
              const zoneResolved = zoneIssues.filter((i) => i.status === 'resolved').length;

              return (
                <div
                  key={zone.id}
                  className="bg-[#13151f] border border-[#232636] p-3 hover:border-[#383d54] transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs text-[#ff5500] font-semibold">{zone.code}</span>
                    <span className="font-mono text-[10px] text-[#6b7280]">{zone.quadrant}</span>
                  </div>
                  <h4 className="font-heading font-medium text-sm text-[#faf8f5] mb-1">{zone.name}</h4>
                  <p className="text-xs text-[#8b92a2] mb-3 line-clamp-2">{zone.description}</p>

                  <div className="flex items-center justify-between border-t border-[#222533] pt-2 text-xs font-mono">
                    <div className="flex gap-2">
                      <span className="text-[#ff7733]">{zoneOpen} Open</span>
                      <span className="text-[#34d399]">{zoneResolved} Fixed</span>
                    </div>
                    <button
                      onClick={() => {
                        setActiveZoneFilter(zone.id);
                        setViewMode('schematic');
                      }}
                      className="text-[#ff5500] hover:underline flex items-center gap-0.5 text-[11px]"
                    >
                      Map View <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Issue Drawer / Strip if an issue is selected on map */}
      {selectedIssue && (
        <div className="border-t border-[#242735] bg-[#141620] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-[#ff5500] bg-[#ff5500]/10 border border-[#ff5500]/30 px-2 py-0.5">
              TARGET: {selectedIssue.id}
            </span>
            <div>
              <h5 className="font-heading text-sm text-[#faf8f5] font-semibold line-clamp-1">
                {selectedIssue.title}
              </h5>
              <p className="text-xs text-[#9ca3af] font-mono">
                {selectedIssue.building} &middot; {selectedIssue.specificLocation}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={selectedIssue.status} />
            <PriorityBadge priority={selectedIssue.priority} />
            <button
              onClick={() => onSelectIssue(selectedIssue.id)}
              className="bg-[#ff5500] hover:bg-[#ff6b22] text-black font-semibold text-xs px-3 py-1.5 transition-colors flex items-center gap-1"
            >
              Full Accountability Trail &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
