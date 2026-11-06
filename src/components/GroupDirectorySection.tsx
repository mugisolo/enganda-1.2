import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Users,
  UserCheck,
  ExternalLink,
  ShieldCheck,
  Filter,
  Layers,
  RotateCcw,
  Briefcase,
  X,
  Camera,
  ChevronLeft,
  ChevronRight,
  Images,
  Maximize2,
} from 'lucide-react';
import { PublicGroupProfile, DirectoryMeta, SupportEnquiryPreset } from '../types';
import {
  SACCO_GOVERNANCE_IMAGE,
  HERO_IMAGE,
  CARPENTRY_FARMING_IMAGE,
} from '../data/content';

interface GroupDirectorySectionProps {
  profiles: PublicGroupProfile[];
  meta: DirectoryMeta | null;
  onOpenSupportModal: (preset: SupportEnquiryPreset) => void;
  onOpenAdminModal: () => void;
  onOpenGroupGalleryEditor: (groupId: string) => void;
}

const QUICK_SECTOR_TAGS = [
  { label: 'All Sectors', value: 'all' },
  { label: 'SACCO & Microfinance', value: 'SACCO' },
  { label: 'Savings & Youth Livelihoods', value: 'Savings' },
  { label: 'Automotive & Technical', value: 'Automotive' },
  { label: 'Fisheries & Cold-Chain', value: 'Fisheries' },
  { label: 'Women Enterprise', value: 'Women' },
  { label: 'Agriculture & Carpentry', value: 'Agriculture' },
  { label: 'Sports & Innovation (SIZ / LeoLeo)', value: 'Sports' },
];

export const GroupDirectorySection: React.FC<GroupDirectorySectionProps> = ({
  profiles,
  meta,
  onOpenSupportModal,
  onOpenAdminModal,
  onOpenGroupGalleryEditor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedRepresentative, setSelectedRepresentative] = useState('all');

  // Per-card active gallery photo index
  const [activePhotoIndexMap, setActivePhotoIndexMap] = useState<Record<string, number>>({});
  // Lightbox modal state for viewing a group's 5-photo gallery in full size
  const [lightboxGroup, setLightboxGroup] = useState<PublicGroupProfile | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  const locations = useMemo(() => {
    if (meta?.locations?.length) return meta.locations;
    return Array.from(new Set(profiles.map((p) => p.location)));
  }, [meta, profiles]);

  const programmeTypes = useMemo(() => {
    if (meta?.programmeTypes?.length) return meta.programmeTypes;
    return Array.from(new Set(profiles.map((p) => p.programmeType)));
  }, [meta, profiles]);

  const sectors = useMemo(() => {
    if (meta?.sectors?.length) return meta.sectors;
    return Array.from(new Set(profiles.map((p) => p.sector).filter(Boolean)));
  }, [meta, profiles]);

  const representatives = useMemo(() => {
    if (meta?.representatives?.length) return meta.representatives;
    return Array.from(new Set(profiles.map((p) => p.representativeName)));
  }, [meta, profiles]);

  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      if (selectedLocation !== 'all' && p.location !== selectedLocation) {
        return false;
      }
      if (selectedType !== 'all' && p.programmeType !== selectedType) {
        return false;
      }
      if (selectedSector !== 'all') {
        const secQ = selectedSector.toLowerCase();
        const inSector =
          (p.sector || '').toLowerCase().includes(secQ) ||
          p.programmeType.toLowerCase().includes(secQ) ||
          p.summary.toLowerCase().includes(secQ);
        if (!inSector) return false;
      }
      if (
        selectedRepresentative !== 'all' &&
        p.representativeName !== selectedRepresentative
      ) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.trim().toLowerCase();
        const match =
          p.name.toLowerCase().includes(q) ||
          (p.uniqueGroupCode || '').toLowerCase().includes(q) ||
          (p.sector || '').toLowerCase().includes(q) ||
          (p.companyAffiliation || '').toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.representativeName.toLowerCase().includes(q) ||
          p.programmeType.toLowerCase().includes(q) ||
          p.projectName.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [
    profiles,
    selectedLocation,
    selectedType,
    selectedSector,
    selectedRepresentative,
    searchQuery,
  ]);

  const totalDisplayedMembers = useMemo(() => {
    return filteredProfiles
      .filter((p) => !p.isProgrammeOnly)
      .reduce((acc, p) => acc + p.memberCount, 0);
  }, [filteredProfiles]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSector('all');
    setSelectedLocation('all');
    setSelectedType('all');
    setSelectedRepresentative('all');
  };

  const getGroupGallery = (profile: PublicGroupProfile): string[] => {
    if (Array.isArray(profile.galleryImages) && profile.galleryImages.length > 0) {
      return profile.galleryImages.slice(0, 5);
    }
    return [SACCO_GOVERNANCE_IMAGE, HERO_IMAGE, CARPENTRY_FARMING_IMAGE];
  };

  const setCardPhotoIndex = (groupId: string, idx: number) => {
    setActivePhotoIndexMap((prev) => ({ ...prev, [groupId]: idx }));
  };

  return (
    <section
      id="directory"
      className="py-14 sm:py-20 bg-[#FAF9F6] border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header & Reconciliation Summary */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#0F5132] mb-2.5">
              <Layers className="w-4 h-4" />
              <span>Complete Public Network Directory & Group Photo Galleries</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              15 Public Network Profiles & 690 Reconciled Member Records
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed">
              Explore all 13 community groups and SACCOs alongside{' '}
              <strong className="text-slate-900">SIZ Football Academy</strong> and{' '}
              <strong className="text-slate-900">LeoLeo</strong>. Every group profile includes an
              interactive photo gallery (up to 5 pictures) that administrators can customize.
            </p>
          </div>

          {/* Privacy & Reconciliation Badge Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs shrink-0 max-w-md w-full">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0F5132] mb-1">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Server-Enforced Member Privacy & CSV Export</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Individual member records, photos, NIN / Passport numbers, and skills are protected at
              the API level. Authorised administrators can manage records, replace gallery photos, or
              export CSVs in the{' '}
              <button
                type="button"
                onClick={onOpenAdminModal}
                className="font-bold text-[#0F5132] underline cursor-pointer"
              >
                Member Administration Console
              </button>
              .
            </p>
          </div>
        </div>

        {/* TOP PROMINENT QUICK SEARCH BAR (By Name, Sector, or Location) */}
        <div className="bg-[#0B2B1E] text-white rounded-2xl p-4 sm:p-6 shadow-md border border-emerald-900 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label
              htmlFor="directory-top-search-input"
              className="text-xs sm:text-sm font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Quick Search Directory by Group Name, Sector, or Location</span>
            </label>
            <span className="text-xs text-emerald-200/80">
              Instant filtering across 15 network profiles &amp; 690 member records
            </span>
          </div>

          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-emerald-700 absolute left-4 pointer-events-none" />
            <input
              id="directory-top-search-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type a group name (e.g. SIZ, EGYA, Twezimbe), sector (e.g. Automotive, Fisheries, SACCO), or location (e.g. Entebbe Island, Katabi)..."
              className="w-full pl-12 pr-24 py-3.5 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Quick Sector Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-emerald-300/90 mr-1">
              Quick Sector Filter:
            </span>
            {QUICK_SECTOR_TAGS.map((tag) => (
              <button
                key={tag.value}
                type="button"
                onClick={() =>
                  setSelectedSector(selectedSector === tag.value ? 'all' : tag.value)
                }
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                  selectedSector === tag.value
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-100 border border-emerald-800'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Facet Dropdown Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Filter by Sector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Filter by Sector
              </label>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
              >
                <option value="all">All Sectors ({sectors.length})</option>
                {sectors.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Location */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Filter by Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
              >
                <option value="all">All Locations ({locations.length})</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Programme Type */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Filter by Programme Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
              >
                <option value="all">All Programme Types ({programmeTypes.length})</option>
                {programmeTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Public Representative */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Filter by Representative
              </label>
              <select
                value={selectedRepresentative}
                onChange={(e) => setSelectedRepresentative(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
              >
                <option value="all">All Representatives ({representatives.length})</option>
                {representatives.map((rep) => (
                  <option key={rep} value={rep}>
                    {rep}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter Status Bar */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800">
                <Filter className="w-3.5 h-3.5 text-[#0F5132]" />
                Showing <strong>{filteredProfiles.length}</strong> of{' '}
                <strong>{profiles.length}</strong> public profiles
              </span>
              <span>•</span>
              <span className="font-semibold text-[#0F5132] tabular-nums">
                Reconciled Member Records in View:{' '}
                <strong>{totalDisplayedMembers.toLocaleString()}</strong>
              </span>
            </div>

            {(searchQuery ||
              selectedSector !== 'all' ||
              selectedLocation !== 'all' ||
              selectedType !== 'all' ||
              selectedRepresentative !== 'all') && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Directory Grid (15 Profiles with 5-Photo Galleries) */}
        {filteredProfiles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <p className="text-base font-bold text-slate-800">
              No network profiles match your current search or filter criteria.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-[#0F5132] text-white text-xs font-bold cursor-pointer"
            >
              Show All 15 Profiles
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => {
              const isFlagship = profile.isProgrammeOnly;
              const gallery = getGroupGallery(profile);
              const activeIdx = (activePhotoIndexMap[profile.id] || 0) % gallery.length;
              const activeImg = gallery[activeIdx] || SACCO_GOVERNANCE_IMAGE;

              return (
                <article
                  key={profile.id}
                  className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all shadow-xs ${
                    isFlagship
                      ? 'bg-[#0B2B1E] text-white border-emerald-800'
                      : 'bg-white text-slate-900 border-slate-200 hover:border-emerald-700/50'
                  }`}
                >
                  <div>
                    {/* 5-PHOTO GALLERY HEADER */}
                    <div className="relative h-48 bg-slate-900 overflow-hidden group">
                      <img
                        src={activeImg}
                        alt={`${profile.name} photo ${activeIdx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-between p-3 min-w-0">
                        {/* Top Overlay Controls */}
                        <div className="flex items-center justify-between gap-1.5 min-w-0">
                          <span className="px-2 py-0.5 rounded bg-slate-950/85 text-amber-300 font-mono text-[10px] font-extrabold truncate max-w-[45%]">
                            {profile.uniqueGroupCode || 'ENG-GRP'}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setLightboxGroup(profile);
                                setLightboxIdx(activeIdx);
                              }}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950/85 hover:bg-slate-800 text-white text-[10px] font-bold cursor-pointer"
                              title="View Full-Size Gallery"
                            >
                              <Maximize2 className="w-3 h-3 shrink-0" />
                              <span>
                                {activeIdx + 1}/{gallery.length}
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onOpenGroupGalleryEditor(profile.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950/85 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-[10px] font-bold transition-colors cursor-pointer"
                              title="Admin: Manage up to 5 gallery photos"
                            >
                              <Camera className="w-3 h-3 shrink-0" />
                              <span>Photos</span>
                            </button>
                          </div>
                        </div>

                        {/* Prev / Next Arrows + Bottom Badges */}
                        <div className="flex items-center justify-between gap-1.5 min-w-0">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider truncate max-w-[72%] ${
                              isFlagship
                                ? 'bg-amber-400 text-slate-950'
                                : 'bg-white/95 text-[#0F5132]'
                            }`}
                          >
                            {profile.programmeType}
                          </span>

                          {gallery.length > 1 && (
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  setCardPhotoIndex(
                                    profile.id,
                                    (activeIdx - 1 + gallery.length) % gallery.length
                                  )
                                }
                                className="p-1 rounded-full bg-slate-950/85 hover:bg-amber-500 hover:text-slate-950 text-white transition-colors cursor-pointer"
                                aria-label="Previous photo"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setCardPhotoIndex(
                                    profile.id,
                                    (activeIdx + 1) % gallery.length
                                  )
                                }
                                className="p-1 rounded-full bg-slate-950/85 hover:bg-amber-500 hover:text-slate-950 text-white transition-colors cursor-pointer"
                                aria-label="Next photo"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 5-Thumbnail Gallery Strip */}
                    <div
                      className={`grid grid-cols-5 gap-1.5 px-3.5 py-2 border-b ${
                        isFlagship
                          ? 'bg-emerald-950/70 border-emerald-800'
                          : 'bg-slate-50 border-slate-200/80'
                      }`}
                    >
                      {gallery.map((imgUrl, idx) => (
                        <button
                          key={`${profile.id}-thumb-${idx}`}
                          type="button"
                          onClick={() => setCardPhotoIndex(profile.id, idx)}
                          className={`relative h-10 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                            activeIdx === idx
                              ? isFlagship
                                ? 'border-amber-400'
                                : 'border-[#0F5132]'
                              : 'border-transparent opacity-65 hover:opacity-100'
                          }`}
                          title={`View photo ${idx + 1} of ${gallery.length}`}
                        >
                          <img
                            src={imgUrl}
                            alt={`${profile.name} thumb ${idx + 1}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>

                    {/* Card Body */}
                    <div className="p-5 sm:p-6 pb-3 space-y-3.5">
                      {/* Group Name & Member Count */}
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          className={`text-lg font-extrabold leading-snug font-['Plus_Jakarta_Sans',sans-serif] ${
                            isFlagship ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {profile.name}
                        </h3>

                        {!profile.isProgrammeOnly ? (
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-extrabold tabular-nums shrink-0 ${
                              isFlagship
                                ? 'bg-emerald-900 text-emerald-100'
                                : 'bg-emerald-50 text-[#0F5132] border border-emerald-200'
                            }`}
                          >
                            <Users className="w-3.5 h-3.5" />
                            <span>{profile.memberCount} records</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-900/90 border border-emerald-700 text-[10px] font-bold text-amber-300 shrink-0">
                            Flagship Hub
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                        <span
                          className={`inline-flex items-center gap-1 font-semibold ${
                            isFlagship ? 'text-amber-300' : 'text-[#0F5132]'
                          }`}
                        >
                          <Briefcase className="w-3.5 h-3.5 shrink-0" />
                          <span>{profile.sector || profile.programmeType}</span>
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 ${
                            isFlagship ? 'text-emerald-200' : 'text-slate-500'
                          }`}
                        >
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                          <span>{profile.location}</span>
                        </span>
                      </div>

                      {/* Summary */}
                      <p
                        className={`text-xs leading-relaxed ${
                          isFlagship ? 'text-emerald-100/90' : 'text-slate-600'
                        }`}
                      >
                        {profile.summary}
                      </p>

                      {/* Designated Public Representative */}
                      <div
                        className={`p-3 rounded-xl border text-xs ${
                          isFlagship
                            ? 'bg-emerald-950/80 border-emerald-800 text-emerald-100'
                            : 'bg-slate-50 border-slate-200/80 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold">
                          <UserCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>Public Representative: {profile.representativeName}</span>
                        </div>
                        <div
                          className={`mt-0.5 pl-5 text-[11px] ${
                            isFlagship ? 'text-emerald-300' : 'text-slate-500'
                          }`}
                        >
                          {profile.representativeTitle}
                        </div>
                      </div>

                      {/* Project & Support Focus */}
                      <div
                        className={`pt-2.5 border-t text-xs space-y-1.5 ${
                          isFlagship ? 'border-emerald-800/80' : 'border-slate-100'
                        }`}
                      >
                        <div>
                          <span
                            className={`font-bold ${
                              isFlagship ? 'text-amber-300' : 'text-slate-900'
                            }`}
                          >
                            Active Project:
                          </span>{' '}
                          <span
                            className={
                              isFlagship
                                ? 'text-white font-semibold'
                                : 'text-slate-800 font-semibold'
                            }
                          >
                            {profile.projectName}
                          </span>
                        </div>
                        <p
                          className={`text-[11px] leading-relaxed ${
                            isFlagship ? 'text-emerald-200/85' : 'text-slate-500'
                          }`}
                        >
                          {profile.projectDescription}
                        </p>
                        <div className="pt-0.5">
                          <span
                            className={`font-bold ${
                              isFlagship ? 'text-amber-300' : 'text-[#0F5132]'
                            }`}
                          >
                            Support Focus:
                          </span>{' '}
                          <span className={isFlagship ? 'text-emerald-100' : 'text-slate-600'}>
                            {profile.supportFocus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Website Link (if supplied) + Sponsor / Invest / Partner Buttons */}
                  <div
                    className={`px-5 sm:px-6 pb-5 sm:pb-6 pt-3.5 border-t space-y-2.5 ${
                      isFlagship ? 'border-emerald-800' : 'border-slate-100'
                    }`}
                  >
                    {profile.websiteUrl ? (
                      <a
                        href={profile.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 text-xs font-bold hover:underline ${
                          isFlagship ? 'text-amber-300' : 'text-[#0F5132]'
                        }`}
                      >
                        <span>Official Programme Website</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : null}

                    <div className="grid grid-cols-3 gap-2">
                      {(['Sponsor', 'Invest', 'Partner'] as const).map((action) => (
                        <button
                          key={action}
                          type="button"
                          onClick={() =>
                            onOpenSupportModal({
                              groupId: profile.id,
                              groupName: profile.name,
                              supportType: action,
                            })
                          }
                          className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-colors text-center cursor-pointer ${
                            action === 'Sponsor'
                              ? isFlagship
                                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                                : 'bg-[#0F5132] hover:bg-emerald-900 text-white'
                              : isFlagship
                              ? 'bg-emerald-900 hover:bg-emerald-800 text-white border border-emerald-700'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          }`}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Full-Size Group 5-Photo Gallery Lightbox Modal */}
      {lightboxGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-sm">
          <div className="bg-slate-900 text-white rounded-2xl max-w-4xl w-full overflow-hidden border border-slate-700 shadow-2xl">
            <div className="px-5 py-4 bg-[#0B2B1E] border-b border-emerald-800 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Images className="w-4 h-4 text-amber-300" />
                  <h4 className="font-extrabold text-sm sm:text-base">{lightboxGroup.name}</h4>
                  <span className="px-2 py-0.5 rounded bg-emerald-900 text-amber-300 text-[10px] font-mono font-bold">
                    Photo {lightboxIdx + 1} of {getGroupGallery(lightboxGroup).length}
                  </span>
                </div>
                <p className="text-xs text-emerald-200/80 mt-0.5">
                  {lightboxGroup.sector} • {lightboxGroup.location}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const targetId = lightboxGroup.id;
                    setLightboxGroup(null);
                    onOpenGroupGalleryEditor(targetId);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Admin: Replace / Edit 5 Photos</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxGroup(null)}
                  className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative h-[340px] sm:h-[460px] bg-slate-950 flex items-center justify-center">
              <img
                src={getGroupGallery(lightboxGroup)[lightboxIdx] || SACCO_GOVERNANCE_IMAGE}
                alt={`${lightboxGroup.name} gallery ${lightboxIdx + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {getGroupGallery(lightboxGroup).map((imgUrl, idx) => (
                  <button
                    key={`lb-${idx}`}
                    type="button"
                    onClick={() => setLightboxIdx(idx)}
                    className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      lightboxIdx === idx
                        ? 'border-amber-400 scale-105'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-400">
                Up to 5 verified photos per group • Replaceable in Admin Console
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
