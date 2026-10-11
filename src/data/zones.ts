import type { CampusZone, IssueCategory } from '../types/issue';

export const CAMPUS_ZONES: CampusZone[] = [
  {
    id: 'zone_a',
    code: 'ZN-A',
    name: 'Science & Engineering Quad',
    quadrant: 'North-West Sector',
    description: 'Foundry Hall, Turing Computing Labs, North Science Atrium & Robotics Wing',
    buildings: ['Foundry Hall', 'Turing Labs', 'North Science Atrium', 'Robotics Wing'],
    color: '#ff5500',
  },
  {
    id: 'zone_b',
    code: 'ZN-B',
    name: 'Arts & Architecture Terrace',
    quadrant: 'South-West Sector',
    description: 'Atelier Studios, Design Pavilion, South Colonnade & Quad Walkway',
    buildings: ['Atelier Studios', 'Design Pavilion', 'South Colonnade', 'Ceramics Wing'],
    color: '#3b82f6',
  },
  {
    id: 'zone_c',
    code: 'ZN-C',
    name: 'Student Commons & Refectory',
    quadrant: 'Central Sector',
    description: 'Civic Commons, Main Dining Hall, East Piazza & Student Union Hub',
    buildings: ['Civic Commons', 'Refectory Hall', 'East Piazza', 'Student Union'],
    color: '#f59e0b',
  },
  {
    id: 'zone_d',
    code: 'ZN-D',
    name: 'Library & Archival Spine',
    quadrant: 'North-East Sector',
    description: 'Main Rotunda, Special Collections Annex, North Reading Room & Sunken Lawn',
    buildings: ['Main Rotunda', 'Archival Annex', 'North Reading Room', 'Law Gallery'],
    color: '#10b981',
  },
  {
    id: 'zone_e',
    code: 'ZN-E',
    name: 'Transit Bay & Field Pavilion',
    quadrant: 'South-East Sector',
    description: 'Intermodal Transit Center, Bicycle Hub, South Ramps & Sports Pavilion',
    buildings: ['Transit Center', 'Bicycle Hub', 'South Ramps', 'Sports Pavilion'],
    color: '#a855f7',
  },
];

export const CATEGORY_DETAILS: Record<
  IssueCategory,
  { label: string; shortLabel: string; icon: string; description: string }
> = {
  water_plumbing: {
    label: 'Water & Plumbing',
    shortLabel: 'Plumbing',
    icon: 'Droplets',
    description: 'Water coolers, hydration stations, leaking taps, restrooms, drainage',
  },
  accessibility: {
    label: 'Accessibility & Mobility',
    shortLabel: 'Accessibility',
    icon: 'Accessibility',
    description: 'Ramps, tactile pavers, push-to-open doors, elevator callbuttons, handrails',
  },
  waste_sanitation: {
    label: 'Waste & Cleanliness',
    shortLabel: 'Sanitation',
    icon: 'Trash2',
    description: 'Overflowing bins, recycling stations, compost sorting, spills, litter hotspots',
  },
  electrical_lighting: {
    label: 'Electrical & Lighting',
    shortLabel: 'Electrical',
    icon: 'Zap',
    description: 'Flickering stairwell fixtures, dead exterior lamps, exposed conduits, outlet banks',
  },
  furniture_fixtures: {
    label: 'Furniture & Fixtures',
    shortLabel: 'Fixtures',
    icon: 'Armchair',
    description: 'Broken classroom fans, damaged benches, uneven desks, acoustic baffling',
  },
  doors_hardware: {
    label: 'Doors & Access',
    shortLabel: 'Doors/Locks',
    icon: 'DoorClosed',
    description: 'Jammed latches, broken automatic closers, panic hardware, badge readers',
  },
  structural_safety: {
    label: 'Walkways & Safety',
    shortLabel: 'Walkways',
    icon: 'AlertTriangle',
    description: 'Cracked paving stones, loose steps, hazard sign posts, wet weather slips',
  },
};

export const SAMPLE_PHOTO_PRESETS = [
  {
    id: 'water_cooler',
    title: 'Water Station Leak',
    category: 'water_plumbing' as IssueCategory,
    svg: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" class="w-full h-full bg-[#171821]"><rect width="200" height="150" fill="#14151b"/><rect x="70" y="30" width="60" height="90" rx="4" fill="#222430" stroke="#383c4e" stroke-width="2"/><circle cx="100" cy="55" r="14" fill="#1b1c24" stroke="#ff5500" stroke-width="1.5"/><path d="M100 50v8M96 54h8" stroke="#ff5500" stroke-width="1.5"/><rect x="85" y="80" width="30" height="25" rx="2" fill="#0d0e12" stroke="#4a4f66"/><path d="M96 105c0 6-3 10-3 18m7-18c0 8 3 12 3 18" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="2 2"/><ellipse cx="100" cy="132" rx="35" ry="6" fill="#38bdf8" fill-opacity="0.25"/><text x="100" y="22" font-family="monospace" font-size="8" fill="#ff5500" text-anchor="middle">LEAK RECORD // WATER STATION</text></svg>`,
  },
  {
    id: 'ramp_damage',
    title: 'Cracked Curb Ramp',
    category: 'accessibility' as IssueCategory,
    svg: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" class="w-full h-full bg-[#171821]"><rect width="200" height="150" fill="#14151b"/><path d="M20 120 L180 80 L180 135 L20 135 Z" fill="#222430" stroke="#383c4e" stroke-width="2"/><path d="M80 102 L95 110 L92 118 L110 125" stroke="#ef4444" stroke-width="2.5" fill="none"/><line x1="20" y1="120" x2="180" y2="80" stroke="#ff5500" stroke-width="2" stroke-dasharray="4 4"/><circle cx="95" cy="110" r="10" fill="#ef4444" fill-opacity="0.2" stroke="#ef4444" stroke-width="1.5"/><text x="100" y="25" font-family="monospace" font-size="8" fill="#ef4444" text-anchor="middle">BARRIER // SLOPE LIP CRACK</text></svg>`,
  },
  {
    id: 'waste_bin',
    title: 'Overflowing Waste Depot',
    category: 'waste_sanitation' as IssueCategory,
    svg: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" class="w-full h-full bg-[#171821]"><rect width="200" height="150" fill="#14151b"/><rect x="65" y="60" width="70" height="70" rx="6" fill="#222430" stroke="#eab308" stroke-width="2"/><path d="M60 55 L140 45 L142 58 L58 65 Z" fill="#2d3040" stroke="#eab308" stroke-width="1.5"/><circle cx="90" cy="40" r="12" fill="#ef4444" fill-opacity="0.3"/><rect x="105" y="30" width="18" height="16" fill="#38bdf8" fill-opacity="0.3"/><text x="100" y="22" font-family="monospace" font-size="8" fill="#eab308" text-anchor="middle">OVERFLOW // CAPACITY EXCEEDED</text></svg>`,
  },
  {
    id: 'fan_ceiling',
    title: 'Classroom Ceiling Fan Wobble',
    category: 'furniture_fixtures' as IssueCategory,
    svg: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" class="w-full h-full bg-[#171821]"><rect width="200" height="150" fill="#14151b"/><circle cx="100" cy="70" r="16" fill="#2d3040" stroke="#f97316" stroke-width="2"/><line x1="100" y1="20" x2="100" y2="54" stroke="#64748b" stroke-width="3"/><path d="M100 70 L40 50 M100 70 L160 50 M100 70 L100 125" stroke="#f97316" stroke-width="4" stroke-linecap="round"/><path d="M35 45 C45 60 55 60 65 50" stroke="#f97316" stroke-width="1" stroke-dasharray="2 2" fill="none"/><text x="100" y="140" font-family="monospace" font-size="8" fill="#f97316" text-anchor="middle">MOTOR VIBRATION // UNBALANCED</text></svg>`,
  },
  {
    id: 'stair_light',
    title: 'Flickering Staircase Luminaire',
    category: 'electrical_lighting' as IssueCategory,
    svg: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" class="w-full h-full bg-[#171821]"><rect width="200" height="150" fill="#14151b"/><rect x="40" y="30" width="120" height="20" rx="3" fill="#222430" stroke="#475569" stroke-width="1.5"/><line x1="50" y1="50" x2="150" y2="50" stroke="#fef08a" stroke-width="4" stroke-dasharray="8 6"/><path d="M90 70 L110 70 L95 95 L115 95 L85 130 L98 90 L85 90 Z" fill="#eab308" fill-opacity="0.3" stroke="#eab308" stroke-width="1.5"/><text x="100" y="20" font-family="monospace" font-size="8" fill="#eab308" text-anchor="middle">BALLAST FAILURE // FLICKER</text></svg>`,
  },
];
