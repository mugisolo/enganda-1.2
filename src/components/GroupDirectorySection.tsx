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
} from 'lucide-react';
import { PublicGroupProfile, DirectoryMeta, SupportEnquiryPreset } from '../types';

interface GroupDirectorySectionProps {
  profiles: PublicGroupProfile[];
  meta: DirectoryMeta | null;
  onOpenSupportModal: (preset: SupportEnquiryPreset) => void;
  onOpenAdminModal: () => void;
}

export const GroupDirectorySection: React.FC<GroupDirectorySectionProps> = ({
  profiles,
  meta,
  onOpenSupportModal,
  onOpenAdminModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedRepresentative, setSelectedRepresentative] = useState('all');

  const locations = useMemo(() => {
    if (meta?.locations?.length) return meta.locations;
    return Array.from(new Set(profiles.map((p) => p.location)));
  }, [meta, profiles]);

  const programmeTypes = useMemo(() => {
    if (meta?.programmeTypes?.length) return meta.programmeTypes;
    return Array.from(new Set(profiles.map((p) => p.programmeType)));
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
          p.location.toLowerCase().includes(q) ||
          p.representativeName.toLowerCase().includes(q) ||
          p.programmeType.toLowerCase().includes(q) ||
          p.projectName.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [profiles, selectedLocation, selectedType, selectedRepresentative, searchQuery]);

  const totalDisplayedMembers = useMemo(() => {
    return filteredProfiles
      .filter((p) => !p.isProgrammeOnly)
      .reduce((acc, p) => acc + p.memberCount, 0);
  }, [filteredProfiles]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedLocation('all');
    setSelectedType('all');
    setSelectedRepresentative('all');
  };

  return (
    <section
      id="directory"
      className="py-16 sm:py-24 bg-[#FAF9F6] border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header & Reconciliation Summary */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#0F5132] mb-3">
              <Layers className="w-4 h-4" />
              <span>Complete Public Network Directory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              15 Public Network Profiles & 690 Reconciled Member Records
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Explore all 13 community groups and SACCOs alongside{' '}
              <strong className="text-slate-900">SIZ Football Academy</strong> and{' '}
              <strong className="text-slate-900">LeoLeo</strong>. To protect member privacy, public
              profiles display only group-level information, aggregate record counts, and one
              designated public representative.
            </p>
          </div>

          {/* Privacy & Reconciliation Badge Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm shrink-0 max-w-md w-full">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0F5132] mb-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Server-Enforced Member Privacy</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Individual member names, phone numbers, email addresses, and National IDs are
              protected at the API level. Authorised group and global administrators can manage
              records in the{' '}
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

        {/* Search & Multi-Facet Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search by Group Name, Project, or Keyword */}
            <div className="relative">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Search Group or Keyword
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Group name, location, representative..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                />
              </div>
            </div>

            {/* Filter by Location */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Filter by Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
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
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Filter by Programme Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
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
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Filter by Representative
              </label>
              <select
                value={selectedRepresentative}
                onChange={(e) => setSelectedRepresentative(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
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
                Reconciled Member Records in View: <strong>{totalDisplayedMembers.toLocaleString()}</strong>
              </span>
            </div>

            {(searchQuery ||
              selectedLocation !== 'all' ||
              selectedType !== 'all' ||
              selectedRepresentative !== 'all') && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Directory Grid (15 Profiles) */}
        {filteredProfiles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <p className="text-base font-bold text-slate-800">
              No network profiles match your current filter criteria.
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
              return (
                <article
                  key={profile.id}
                  className={`rounded-2xl border p-6 flex flex-col justify-between transition-all shadow-sm ${
                    isFlagship
                      ? 'bg-[#0B2B1E] text-white border-emerald-800'
                      : 'bg-white text-slate-900 border-slate-200 hover:border-emerald-700/50'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Meta Row */}
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                          isFlagship
                            ? 'bg-amber-400 text-slate-950'
                            : profile.programmeType === 'Community SACCO'
                            ? 'bg-emerald-100 text-[#0F5132]'
                            : profile.programmeType === 'Cooperative & Trade Group'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {profile.programmeType}
                      </span>

                      {!profile.isProgrammeOnly ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-extrabold tabular-nums ${
                            isFlagship
                              ? 'bg-emerald-900 text-emerald-100'
                              : 'bg-emerald-50 text-[#0F5132] border border-emerald-200'
                          }`}
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>{profile.memberCount} records</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-900/90 border border-emerald-700 text-[11px] font-bold text-amber-300">
                          Network Programme
                        </span>
                      )}
                    </div>

                    {/* Group Name & Location */}
                    <div>
                      <h3
                        className={`text-lg sm:text-xl font-extrabold leading-snug font-['Plus_Jakarta_Sans',sans-serif] ${
                          isFlagship ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {profile.name}
                      </h3>
                      <div
                        className={`flex items-center gap-1.5 text-xs mt-1 ${
                          isFlagship ? 'text-emerald-200' : 'text-slate-500'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                        <span>{profile.location}</span>
                      </div>
                    </div>

                    {/* Summary */}
                    <p
                      className={`text-xs sm:text-sm leading-relaxed ${
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
                      className={`pt-3 border-t text-xs space-y-1.5 ${
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
                        <span className={isFlagship ? 'text-white font-semibold' : 'text-slate-800 font-semibold'}>
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
                      <div className="pt-1">
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

                  {/* Card Footer: Website Link (if supplied) + Sponsor / Invest / Partner Buttons */}
                  <div
                    className={`mt-5 pt-4 border-t space-y-3 ${
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
    </section>
  );
};
