import React, { useState, useEffect } from 'react';
import type { IssueCategory, IssuePriority, CampusZoneId, Issue } from '../types/issue';
import { CAMPUS_ZONES, CATEGORY_DETAILS, SAMPLE_PHOTO_PRESETS } from '../data/zones';
import { CategoryIcon } from './CategoryIcon';
import {
  X,
  Upload,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Sparkles,
  Image as ImageIcon,
  Send,
  HelpCircle,
} from 'lucide-react';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
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
  }) => Issue;
}

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IssueCategory>('water_plumbing');
  const [zoneId, setZoneId] = useState<CampusZoneId>('zone_a');
  const [building, setBuilding] = useState('Foundry Hall');
  const [specificLocation, setSpecificLocation] = useState('');
  const [priority, setPriority] = useState<IssuePriority>('high');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterAffiliation, setReporterAffiliation] = useState('Campus Community');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Sync default building when zone changes
  useEffect(() => {
    const zone = CAMPUS_ZONES.find((z) => z.id === zoneId);
    if (zone && zone.buildings.length > 0) {
      setBuilding(zone.buildings[0]);
    }
  }, [zoneId]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = 'Issue title is required.';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters.';
    }

    if (!building.trim()) {
      newErrors.building = 'Building or facility name is required.';
    }

    if (!specificLocation.trim()) {
      newErrors.specificLocation = 'Specific location details (room/floor) are required.';
    } else if (specificLocation.trim().length < 4) {
      newErrors.specificLocation = 'Please provide clearer location cues.';
    }

    if (!description.trim()) {
      newErrors.description = 'Please describe the observed problem.';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit for local browser storage.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
        setSelectedPresetId(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (presetId: string) => {
    const preset = SAMPLE_PHOTO_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      // Use preset svg as data uri
      const svgDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(preset.svg)}`;
      setPhotoUrl(svgDataUri);
      setSelectedPresetId(presetId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      title: true,
      building: true,
      specificLocation: true,
      description: true,
    });

    if (!validate()) {
      return;
    }

    onSubmit({
      title: title.trim(),
      category,
      zoneId,
      building: building.trim(),
      specificLocation: specificLocation.trim(),
      priority,
      description: description.trim(),
      reporterName: reporterName.trim() || undefined,
      reporterAffiliation: reporterAffiliation.trim() || undefined,
      photoUrl,
    });

    // Reset fields
    setTitle('');
    setSpecificLocation('');
    setDescription('');
    setPhotoUrl(undefined);
    setSelectedPresetId(null);
    setErrors({});
    setTouched({});
    onClose();
  };

  const activeZone = CAMPUS_ZONES.find((z) => z.id === zoneId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 modal-backdrop overflow-y-auto">
      <div
        className="relative w-full max-w-3xl bg-[#101218] border border-[#262939] shadow-2xl my-auto overflow-hidden text-left"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#141620] border-b border-[#242735]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#ff5500]" />
            <h2
              id="report-modal-title"
              className="font-heading font-semibold text-base sm:text-lg text-[#faf8f5]"
            >
              Log Infrastructure Defect // Public Report
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#8e97a8] hover:text-[#faf8f5] p-1.5 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Banner */}
        <div className="bg-[#121520] px-5 py-2 border-b border-[#1f2230] text-xs font-mono text-[#8e97a8] flex items-center justify-between">
          <span>ALL REPORTS ARE RECORDED ON THE PUBLIC ACCOUNTABILITY GRID</span>
          <span className="text-[#ff5500] hidden sm:inline">PERSISTED TO LOCAL STORAGE</span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-4 text-xs font-mono">
          {/* Issue Title */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[#d1d5db] font-semibold">ISSUE TITLE *</label>
              <span className="text-[10px] text-[#6b7280]">{title.length}/80 chars</span>
            </div>
            <input
              type="text"
              maxLength={80}
              placeholder="e.g. Broken water cooler chiller on 2nd floor, leaking onto corridor floor"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, title: true }))}
              className={`w-full bg-[#0d0e14] border px-3 py-2 text-[#faf8f5] placeholder-[#505769] focus:outline-none transition-colors ${
                touched.title && errors.title
                  ? 'border-[#ef4444] focus:border-[#ef4444]'
                  : 'border-[#242735] focus:border-[#ff5500]'
              }`}
            />
            {touched.title && errors.title && (
              <p className="text-[#ef4444] text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.title}
              </p>
            )}
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-[#d1d5db] font-semibold mb-1">CATEGORY *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IssueCategory)}
                className="w-full bg-[#0d0e14] border border-[#242735] px-3 py-2 text-[#faf8f5] focus:border-[#ff5500] focus:outline-none"
              >
                {Object.entries(CATEGORY_DETAILS).map(([key, meta]) => (
                  <option key={key} value={key}>
                    {meta.label}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-[#6e778a] mt-1">
                {CATEGORY_DETAILS[category]?.description}
              </p>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[#d1d5db] font-semibold mb-1">PRIORITY LEVEL *</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as IssuePriority)}
                className="w-full bg-[#0d0e14] border border-[#242735] px-3 py-2 text-[#faf8f5] focus:border-[#ff5500] focus:outline-none"
              >
                <option value="urgent">URGENT — Direct safety risk / critical access blocked</option>
                <option value="high">HIGH — Significant disruption to daily academic use</option>
                <option value="medium">MEDIUM — Moderate degradation, functional alternative exists</option>
                <option value="low">LOW — Minor cosmetic, non-urgent maintenance</option>
              </select>
            </div>
          </div>

          {/* Zone & Building Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Campus Zone */}
            <div>
              <label className="block text-[#d1d5db] font-semibold mb-1">CAMPUS ZONE *</label>
              <select
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value as CampusZoneId)}
                className="w-full bg-[#0d0e14] border border-[#242735] px-3 py-2 text-[#faf8f5] focus:border-[#ff5500] focus:outline-none"
              >
                {CAMPUS_ZONES.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.code} — {zone.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Building / Wing */}
            <div>
              <label className="block text-[#d1d5db] font-semibold mb-1">BUILDING / FACILITY *</label>
              {activeZone && activeZone.buildings.length > 0 ? (
                <div className="flex gap-2">
                  <select
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    className="w-full bg-[#0d0e14] border border-[#242735] px-3 py-2 text-[#faf8f5] focus:border-[#ff5500] focus:outline-none"
                  >
                    {activeZone.buildings.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                    <option value="Custom">Other Building / Outdoor Sector</option>
                  </select>
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="e.g. Foundry Hall"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  className="w-full bg-[#0d0e14] border border-[#242735] px-3 py-2 text-[#faf8f5]"
                />
              )}
            </div>
          </div>

          {/* Specific Location Details */}
          <div>
            <label className="block text-[#d1d5db] font-semibold mb-1">
              SPECIFIC LOCATION DETAILS *
            </label>
            <input
              type="text"
              placeholder="e.g. 2nd Floor, Corridor East adjacent to Room 204 water point"
              value={specificLocation}
              onChange={(e) => setSpecificLocation(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, specificLocation: true }))}
              className={`w-full bg-[#0d0e14] border px-3 py-2 text-[#faf8f5] placeholder-[#505769] focus:outline-none transition-colors ${
                touched.specificLocation && errors.specificLocation
                  ? 'border-[#ef4444]'
                  : 'border-[#242735] focus:border-[#ff5500]'
              }`}
            />
            {touched.specificLocation && errors.specificLocation && (
              <p className="text-[#ef4444] text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.specificLocation}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[#d1d5db] font-semibold">DETAILED DEFECT DESCRIPTION *</label>
              <span className="text-[10px] text-[#6b7280]">Min 10 characters</span>
            </div>
            <textarea
              rows={3}
              placeholder="Describe symptoms, safety impact, when observed, and any interim measures..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, description: true }))}
              className={`w-full bg-[#0d0e14] border px-3 py-2 text-[#faf8f5] placeholder-[#505769] focus:outline-none transition-colors ${
                touched.description && errors.description
                  ? 'border-[#ef4444]'
                  : 'border-[#242735] focus:border-[#ff5500]'
              }`}
            />
            {touched.description && errors.description && (
              <p className="text-[#ef4444] text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.description}
              </p>
            )}
          </div>

          {/* Photo Evidence & Diagnostic Presets */}
          <div className="bg-[#12141d] border border-[#212535] p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[#d1d5db] font-semibold">
                PHOTO EVIDENCE OR SCHEMATIC PRESET (OPTIONAL)
              </span>
              <span className="text-[10px] text-[#717b8f]">Stored in browser only</span>
            </div>

            {/* Upload or Preset Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1d29] hover:bg-[#25293b] text-[#cbd5e1] border border-[#2d3246] transition-colors">
                <Upload className="w-3.5 h-3.5 text-[#ff5500]" />
                <span>Upload Photo File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <span className="text-[#555d70]">or select diagnostic preset:</span>

              {SAMPLE_PHOTO_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`px-2 py-1 border text-[11px] transition-colors ${
                    selectedPresetId === preset.id
                      ? 'bg-[#ff5500]/20 border-[#ff5500] text-[#ff7733]'
                      : 'bg-[#151722] border-[#222533] text-[#8e97a8] hover:text-[#faf8f5]'
                  }`}
                >
                  {preset.title}
                </button>
              ))}

              {photoUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setPhotoUrl(undefined);
                    setSelectedPresetId(null);
                  }}
                  className="text-[#ef4444] hover:underline text-[11px] ml-auto"
                >
                  Clear Photo
                </button>
              )}
            </div>

            {/* Preview if attached */}
            {photoUrl && (
              <div className="flex items-center gap-3 bg-[#0c0d12] p-2 border border-[#1f2231]">
                <div className="w-16 h-14 bg-black overflow-hidden border border-[#2a2e3f] shrink-0">
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="text-[11px] text-[#8e97a8]">
                  <span className="text-[#10b981] font-semibold block">Attachment loaded</span>
                  <span>Will be preserved in report audit trail</span>
                </div>
              </div>
            )}
          </div>

          {/* Reporter Signature (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[#8e97a8] mb-1">REPORTER NAME / PSEUDONYM</label>
              <input
                type="text"
                placeholder="Anonymous or e.g. Maya Lin"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="w-full bg-[#0d0e14] border border-[#242735] px-3 py-2 text-[#faf8f5]"
              />
            </div>
            <div>
              <label className="block text-[#8e97a8] mb-1">AFFILIATION / DEPARTMENT</label>
              <input
                type="text"
                placeholder="e.g. Architecture Studio, CS 3rd Year"
                value={reporterAffiliation}
                onChange={(e) => setReporterAffiliation(e.target.value)}
                className="w-full bg-[#0d0e14] border border-[#242735] px-3 py-2 text-[#faf8f5]"
              />
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-[#1f2230]">
            <span className="text-[11px] text-[#555d70]">
              * Required fields. Instantly updates map and ledger.
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-[#1b1e2a] hover:bg-[#252a3b] text-[#8e97a8] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#ff5500] hover:bg-[#ff6b22] text-black font-semibold flex items-center gap-1.5 transition-colors shadow-lg"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Report to Grid</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
