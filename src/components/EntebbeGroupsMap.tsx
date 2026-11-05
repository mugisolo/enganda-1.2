import React, { useState, useMemo } from 'react';
import { MapPin, Users, ArrowUpRight, Layers, Compass, ExternalLink } from 'lucide-react';
import { PublicGroupProfile, SupportEnquiryPreset } from '../types';

interface EntebbeGroupsMapProps {
  profiles: PublicGroupProfile[];
  onOpenSupportModal: (preset?: SupportEnquiryPreset) => void;
}

const DEFAULT_COORDS: Record<string, { x: number; y: number; zone: string }> = {
  'grp-abayita-ababiri': { x: 64, y: 24, zone: 'Abayita Ababiri' },
  'grp-baghdad': { x: 46, y: 55, zone: 'Entebbe Central' },
  'grp-bep-auto': { x: 50, y: 48, zone: 'Entebbe Central' },
  'grp-egya': { x: 43, y: 60, zone: 'Entebbe Central' },
  'grp-ghetto-women': { x: 48, y: 63, zone: 'Entebbe Central' },
  'grp-guda-sacco': { x: 54, y: 57, zone: 'Entebbe Central' },
  'grp-island-sacco': { x: 26, y: 82, zone: 'Entebbe Island' },
  'grp-gaza-sacco': { x: 39, y: 52, zone: 'Entebbe Central' },
  'grp-kinazi-katabi': { x: 70, y: 34, zone: 'Kinazi, Katabi' },
  'grp-kitinda-coop': { x: 59, y: 31, zone: 'Kitinda, Nkumba' },
  'grp-lunyo-east': { x: 58, y: 68, zone: 'Lunyo East' },
  'grp-peace-rock': { x: 44, y: 46, zone: 'Entebbe Central' },
  'grp-twezimbe-sacco': { x: 52, y: 64, zone: 'Entebbe Central' },
  'grp-siz-academy': { x: 35, y: 66, zone: 'Entebbe Sports Hub' },
  'grp-leoleo': { x: 41, y: 42, zone: 'Entebbe Innovation Hub' },
};

export const EntebbeGroupsMap: React.FC<EntebbeGroupsMapProps> = ({
  profiles,
  onOpenSupportModal,
}) => {
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [activeProfileId, setActiveProfileId] = useState<string>('grp-island-sacco');

  const enrichedProfiles = useMemo(() => {
    return profiles.map((p) => {
      const coords = p.mapCoords || DEFAULT_COORDS[p.id] || {
        x: 50,
        y: 55,
        zone: p.location || 'Entebbe, Uganda',
      };
      return {
        ...p,
        coords,
      };
    });
  }, [profiles]);

  const zones = useMemo(() => {
    const set = new Set<string>();
    enrichedProfiles.forEach((p) => set.add(p.coords.zone));
    return ['ALL', ...Array.from(set)];
  }, [enrichedProfiles]);

  const visibleProfiles = useMemo(() => {
    if (selectedZone === 'ALL') return enrichedProfiles;
    return enrichedProfiles.filter((p) => p.coords.zone === selectedZone);
  }, [enrichedProfiles, selectedZone]);

  const activeProfile = useMemo(() => {
    return (
      enrichedProfiles.find((p) => p.id === activeProfileId) ||
      visibleProfiles[0] ||
      enrichedProfiles[0] ||
      null
    );
  }, [enrichedProfiles, visibleProfiles, activeProfileId]);

  const zoneSummary = useMemo(() => {
    const map: Record<string, { groups: number; members: number }> = {};
    enrichedProfiles.forEach((p) => {
      const z = p.coords.zone;
      if (!map[z]) map[z] = { groups: 0, members: 0 };
      map[z].groups += 1;
      map[z].members += p.memberCount;
    });
    return Object.entries(map).sort((a, b) => b[1].members - a[1].members);
  }, [enrichedProfiles]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 bg-[#0B2B1E] text-white flex flex-wrap items-center justify-between gap-3 border-b border-emerald-900">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-400">
            <Compass className="w-3.5 h-3.5" />
            <span>Greater Entebbe Peninsula Spatial Distribution</span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
            Interactive Density Map: 13 Community Groups (690 Members) & Flagship Hubs
          </h3>
        </div>

        {/* Zone Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {zones.map((zone) => (
            <button
              key={zone}
              type="button"
              onClick={() => setSelectedZone(zone)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                selectedZone === zone
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-emerald-950/90 text-emerald-200 hover:bg-emerald-900 border border-emerald-800'
              }`}
            >
              {zone === 'ALL' ? 'All Zones (15)' : zone}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map + Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left: SVG Peninsula Map Canvas (7 cols) */}
        <div className="lg:col-span-7 relative bg-[#E6F2F5] p-3 sm:p-5 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between min-h-[380px]">
          <div className="relative w-full aspect-[16/11] rounded-xl overflow-hidden border border-sky-200/80 bg-[#CFE7EE] shadow-inner">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full select-none"
              role="img"
              aria-label="Map of Greater Entebbe showing ENGANDA network groups"
            >
              <defs>
                <radialGradient id="lakeGradient" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="#D8EEF5" />
                  <stop offset="100%" stopColor="#B8DCE8" />
                </radialGradient>
                <linearGradient id="peninsulaLand" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F5F7F2" />
                  <stop offset="100%" stopColor="#E4EFE6" />
                </linearGradient>
              </defs>

              {/* Lake Victoria Water Backdrop */}
              <rect x="0" y="0" width="100" height="100" fill="url(#lakeGradient)" />

              {/* Subtle Coordinate Grid Lines */}
              <g stroke="#99C5D4" strokeWidth="0.2" strokeDasharray="1 1" opacity="0.7">
                <line x1="0" y1="20" x2="100" y2="20" />
                <line x1="0" y1="40" x2="100" y2="40" />
                <line x1="0" y1="60" x2="100" y2="60" />
                <line x1="0" y1="80" x2="100" y2="80" />
                <line x1="20" y1="0" x2="20" y2="100" />
                <line x1="40" y1="0" x2="40" y2="100" />
                <line x1="60" y1="0" x2="60" y2="100" />
                <line x1="80" y1="0" x2="80" y2="100" />
              </g>

              {/* Greater Entebbe Peninsula Landmass Polygon */}
              <path
                d="M 52 5 L 86 5 L 82 28 L 74 44 L 66 56 L 64 72 L 52 76 L 38 72 L 28 64 L 32 48 L 44 34 L 50 18 Z"
                fill="url(#peninsulaLand)"
                stroke="#0F5132"
                strokeWidth="0.6"
                strokeOpacity="0.45"
              />

              {/* Entebbe Island Landmass */}
              <path
                d="M 16 78 C 20 73, 32 74, 35 81 C 36 87, 26 91, 18 87 Z"
                fill="url(#peninsulaLand)"
                stroke="#0F5132"
                strokeWidth="0.6"
                strokeOpacity="0.5"
              />

              {/* Entebbe-Kampala Corridor Road Line */}
              <path
                d="M 72 8 Q 64 26 54 44 T 42 66"
                fill="none"
                stroke="#94A3B8"
                strokeWidth="0.9"
                strokeDasharray="2 1"
              />

              {/* Geographic Zone Labels */}
              <text
                x="78"
                y="92"
                fontSize="3.2"
                fontWeight="700"
                fill="#0369A1"
                opacity="0.75"
                textAnchor="middle"
              >
                LAKE VICTORIA
              </text>
              <text x="66" y="19" fontSize="2.5" fontWeight="700" fill="#334155">
                Abayita Ababiri
              </text>
              <text x="75" y="34" fontSize="2.5" fontWeight="700" fill="#334155">
                Katabi / Kinazi
              </text>
              <text x="48" y="30" fontSize="2.5" fontWeight="700" fill="#334155">
                Kitinda / Nkumba
              </text>
              <text x="33" y="55" fontSize="2.6" fontWeight="800" fill="#0F5132">
                Entebbe Central
              </text>
              <text x="66" y="70" fontSize="2.5" fontWeight="700" fill="#334155">
                Lunyo East
              </text>
              <text x="25" y="92" fontSize="2.5" fontWeight="800" fill="#0F5132" textAnchor="middle">
                Entebbe Island
              </text>

              {/* Network Connection Lines to Central ENGANDA Hub */}
              {visibleProfiles.map((group) => (
                <line
                  key={`line-${group.id}`}
                  x1={46}
                  y1={56}
                  x2={group.coords.x}
                  y2={group.coords.y}
                  stroke={group.id === activeProfile?.id ? '#D97706' : '#0F5132'}
                  strokeWidth={group.id === activeProfile?.id ? '0.7' : '0.35'}
                  strokeDasharray={group.isProgrammeOnly ? '1.2 0.8' : undefined}
                  opacity={group.id === activeProfile?.id ? '0.9' : '0.35'}
                />
              ))}

              {/* Group Density Nodes */}
              {visibleProfiles.map((group) => {
                const isSelected = group.id === activeProfile?.id;
                // Radius scaled by memberCount (from 2.6 for programme-only up to 6.2 for 102 members)
                const radius = group.isProgrammeOnly
                  ? 3.0
                  : Math.max(2.8, Math.min(6.2, 2.3 + Math.sqrt(group.memberCount) * 0.36));

                const fill = group.isProgrammeOnly
                  ? '#D97706'
                  : group.programmeType === 'Community SACCO'
                  ? '#0F5132'
                  : '#0284C7';

                return (
                  <g
                    key={group.id}
                    className="cursor-pointer transition-transform"
                    onClick={() => setActiveProfileId(group.id)}
                  >
                    {isSelected && (
                      <circle
                        cx={group.coords.x}
                        cy={group.coords.y}
                        r={radius + 2.2}
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="0.9"
                      />
                    )}
                    <circle
                      cx={group.coords.x}
                      cy={group.coords.y}
                      r={radius}
                      fill={fill}
                      fillOpacity={isSelected ? '0.95' : '0.82'}
                      stroke="#FFFFFF"
                      strokeWidth={isSelected ? '0.9' : '0.5'}
                    />
                    <text
                      x={group.coords.x}
                      y={group.coords.y + 0.8}
                      textAnchor="middle"
                      fontSize="2.1"
                      fontWeight="800"
                      fill="#FFFFFF"
                    >
                      {group.isProgrammeOnly ? '★' : group.memberCount}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Legend */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-700">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0F5132] inline-block" />
                <span>Community SACCO</span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7] inline-block" />
                <span>Savings / Cooperative Group</span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] inline-block" />
                <span>Flagship Programme (SIZ / LeoLeo)</span>
              </span>
            </div>
            <span className="text-slate-500 font-medium">
              Click any node to inspect group details
            </span>
          </div>
        </div>

        {/* Right: Active Node Inspector + Zone Density Summary (5 cols) */}
        <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between gap-4 bg-[#FAF9F6]">
          {activeProfile ? (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-[#0F5132] text-[10px] font-extrabold uppercase tracking-wider">
                    {activeProfile.programmeType}
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 mt-1">
                    {activeProfile.name}
                  </h4>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-slate-500">Zone</div>
                  <div className="text-xs font-extrabold text-[#0F5132]">
                    {activeProfile.coords.zone}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{activeProfile.summary}</p>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] font-bold uppercase text-slate-400">
                    Public Representative
                  </div>
                  <div className="text-xs font-extrabold text-slate-900 truncate mt-0.5">
                    {activeProfile.representativeName}
                  </div>
                  <div className="text-[11px] text-slate-500">{activeProfile.representativeTitle}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80">
                  <div className="text-[10px] font-bold uppercase text-emerald-800">
                    {activeProfile.isProgrammeOnly ? 'Network Scope' : 'Reconciled Members'}
                  </div>
                  <div className="text-sm font-extrabold text-[#0F5132] mt-0.5 tabular-nums flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-700" />
                    <span>
                      {activeProfile.isProgrammeOnly
                        ? 'Flagship Programme'
                        : `${activeProfile.memberCount} Records`}
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium">
                    PII Protected at Server
                  </div>
                </div>
              </div>

              <div className="pt-1 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onOpenSupportModal({
                      groupId: activeProfile.id,
                      groupName: activeProfile.name,
                      supportType: 'Partner',
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F5132] hover:bg-emerald-900 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>Support or Partner</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-300" />
                </button>

                {activeProfile.websiteUrl && (
                  <a
                    href={activeProfile.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors"
                  >
                    <span>Visit Portal</span>
                    <ExternalLink className="w-3 h-3 text-[#0F5132]" />
                  </a>
                )}
              </div>
            </div>
          ) : null}

          {/* Zone Member Density Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-800">
              <span className="inline-flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#0F5132]" />
                <span>Greater Entebbe Cluster Density</span>
              </span>
              <span className="text-[#0F5132] tabular-nums">690 Total Members</span>
            </div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {zoneSummary.map(([zoneName, stats]) => (
                <button
                  key={zoneName}
                  type="button"
                  onClick={() =>
                    setSelectedZone(selectedZone === zoneName ? 'ALL' : zoneName)
                  }
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    selectedZone === zoneName
                      ? 'bg-emerald-900 text-white font-bold'
                      : 'bg-slate-50 hover:bg-emerald-50/70 text-slate-700'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5 truncate">
                    <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                    <span className="truncate">{zoneName}</span>
                  </span>
                  <span className="tabular-nums font-bold shrink-0 ml-2">
                    {stats.groups} {stats.groups === 1 ? 'profile' : 'profiles'} •{' '}
                    {stats.members} members
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
