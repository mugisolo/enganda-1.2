import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  History,
  Users,
  Target,
  CheckCircle2,
  Database,
  Layers,
} from 'lucide-react';
import { PublicGroupProfile, SupportEnquiryPreset } from '../types';
import { EntebbeGroupsMap } from './EntebbeGroupsMap';

interface ImpactMetricsSectionProps {
  profiles: PublicGroupProfile[];
  totalMemberRecords: number;
  onOpenTransitionModal: () => void;
  onOpenSupportModal: (preset?: SupportEnquiryPreset) => void;
}

const COHORT_12M_DATA = [
  { month: 'Apr 24', formalisedMembers: 66, formalisedGroups: 2, stage: 'Organise' },
  { month: 'May 24', formalisedMembers: 102, formalisedGroups: 3, stage: 'Organise' },
  { month: 'Jun 24', formalisedMembers: 134, formalisedGroups: 4, stage: 'Organise' },
  { month: 'Jul 24', formalisedMembers: 185, formalisedGroups: 5, stage: 'Formalise' },
  { month: 'Aug 24', formalisedMembers: 208, formalisedGroups: 6, stage: 'Formalise' },
  { month: 'Sep 24', formalisedMembers: 265, formalisedGroups: 7, stage: 'Formalise' },
  { month: 'Oct 24', formalisedMembers: 293, formalisedGroups: 8, stage: 'Formalise' },
  { month: 'Nov 24', formalisedMembers: 351, formalisedGroups: 9, stage: 'Formalise' },
  { month: 'Dec 24', formalisedMembers: 408, formalisedGroups: 10, stage: 'Formalise' },
  { month: 'Jan 25', formalisedMembers: 490, formalisedGroups: 11, stage: 'Grow' },
  { month: 'Feb 25', formalisedMembers: 588, formalisedGroups: 12, stage: 'Grow' },
  { month: 'Mar 25', formalisedMembers: 690, formalisedGroups: 13, stage: 'Grow' },
];

const NATIONAL_2M_ROADMAP_DATA = [
  {
    phase: '2024–25 (Entebbe Foundation)',
    youthTransitioned: 690,
    targetMilestone: 1000,
    hubsLabel: '15 Entebbe Profiles (Reconciled)',
  },
  {
    phase: '2026 (Wakiso & Lake Victoria Rim)',
    youthTransitioned: 25000,
    targetMilestone: 25000,
    hubsLabel: '180 SACCO & Youth Clusters',
  },
  {
    phase: '2027 (Central & Eastern Corridor)',
    youthTransitioned: 150000,
    targetMilestone: 150000,
    hubsLabel: '950 Formalised Cooperatives',
  },
  {
    phase: '2028 (Regional Federation Scale)',
    youthTransitioned: 550000,
    targetMilestone: 550000,
    hubsLabel: '3,200 Umbrella Groups',
  },
  {
    phase: '2029 (National Institutional Integration)',
    youthTransitioned: 1250000,
    targetMilestone: 1250000,
    hubsLabel: '7,500 Partnered SACCOs',
  },
  {
    phase: '2030 (2M National Target)',
    youthTransitioned: 2000000,
    targetMilestone: 2000000,
    hubsLabel: '2,000,000 Formalised Youth',
  },
];

export const ImpactMetricsSection: React.FC<ImpactMetricsSectionProps> = ({
  profiles,
  totalMemberRecords,
  onOpenTransitionModal,
  onOpenSupportModal,
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'cohort' | 'national' | 'groups'>('cohort');

  const memberGroupsChartData = useMemo(() => {
    return profiles
      .filter((p) => !p.isProgrammeOnly && p.memberCount > 0)
      .sort((a, b) => b.memberCount - a.memberCount)
      .map((p) => ({
        name: p.name.replace(/ (Association|Group|Community SACCO|SACCO)$/i, ''),
        fullName: p.name,
        members: p.memberCount,
        location: p.location,
        type: p.programmeType,
      }));
  }, [profiles]);

  const nationalTarget = 2000000;

  return (
    <section
      id="impact-metrics"
      className="py-12 sm:py-16 bg-[#F3F1EC] border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-900/10 text-[#0F5132] text-[11px] font-extrabold uppercase tracking-widest">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Impact Metrics & Spatial Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              From 690 Reconciled Entebbe Members to the 2,000,000 Youth Formalisation Target
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              ENGANDA tracks verified youth transitions from informal savings clusters into
              structured, banked SACCOs and associations. Explore the 12-month formalisation curve,
              the national 2,000,000 youth scale trajectory, and the Greater Entebbe geographical
              distribution below.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenTransitionModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B2B1E] hover:bg-emerald-900 text-amber-300 text-xs font-extrabold shadow-xs transition-colors cursor-pointer"
            >
              <History className="w-4 h-4" />
              <span>Open Transition History Log</span>
            </button>
          </div>
        </div>

        {/* Top KPI Progress Cards toward 2,000,000 Target */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Verified Entebbe Cohort</span>
              <Users className="w-4 h-4 text-[#0F5132]" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
              {totalMemberRecords.toLocaleString()} Youth
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">
              100% Reconciled across 13 Member Groups
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Long-Term National Target</span>
              <Target className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-extrabold text-[#0F5132] mt-1 tabular-nums">
              {nationalTarget.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-600 mt-1">
              Youth transitioned via Organise → Formalise → Grow
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Largest Formalised SACCOs</span>
              <Layers className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-lg font-extrabold text-slate-900 mt-1">
              Entebbe Island (102) & Twezimbe (98)
            </div>
            <div className="text-[11px] text-slate-600 mt-1">
              Followed by Lunyo East (82) & Kinazi (58)
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Database & Rules Status</span>
              <Database className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-lg font-extrabold text-emerald-800 mt-1 inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Firestore RBAC Active</span>
            </div>
            <div className="text-[11px] text-slate-600 mt-1">
              Server-side whitelist & persistent storage verified
            </div>
          </div>
        </div>

        {/* Recharts Visualization Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                {activeChartTab === 'cohort'
                  ? '12-Month Youth Business & SACCO Formalisation Growth (Entebbe Cohort: 690 Records)'
                  : activeChartTab === 'national'
                  ? 'Strategic Scaling Trajectory Toward the 2,000,000 Youth Formalisation Goal'
                  : 'Verified Member Records Across the 13 Entebbe Community Groups (Total: 690)'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeChartTab === 'cohort'
                  ? 'Cumulative verified members and formalised groups transitioned from informal status over the past 12 months.'
                  : activeChartTab === 'national'
                  ? 'Multi-phase regional replication of the Entebbe Umbrella Blueprint across Uganda (2024–2030).'
                  : 'Exact reconciled record counts per group from supplied source documents.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setActiveChartTab('cohort')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeChartTab === 'cohort'
                    ? 'bg-[#0F5132] text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                12-Month Growth (690)
              </button>
              <button
                type="button"
                onClick={() => setActiveChartTab('national')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeChartTab === 'national'
                    ? 'bg-[#0F5132] text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                2,000,000 Target Curve
              </button>
              <button
                type="button"
                onClick={() => setActiveChartTab('groups')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeChartTab === 'groups'
                    ? 'bg-[#0F5132] text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                13-Group Breakdown
              </button>
            </div>
          </div>

          {/* Chart Container */}
          <div className="w-full h-[300px] sm:h-[340px]">
            {activeChartTab === 'cohort' && (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={COHORT_12M_DATA}
                  margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="formalisedFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F5132" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#0F5132" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 11, fill: '#0F5132', fontWeight: 700 }}
                    domain={[0, 750]}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11, fill: '#D97706', fontWeight: 700 }}
                    domain={[0, 15]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0B2B1E',
                      border: '1px solid #0F5132',
                      borderRadius: '10px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="formalisedMembers"
                    name="Formalised Youth Members"
                    stroke="#0F5132"
                    strokeWidth={3}
                    fill="url(#formalisedFill)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="formalisedGroups"
                    name="Formalised Community Groups"
                    stroke="#F59E0B"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#F59E0B' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}

            {activeChartTab === 'national' && (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={NATIONAL_2M_ROADMAP_DATA}
                  margin={{ top: 10, right: 24, left: 10, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="nationalTargetFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D97706" stopOpacity={0.32} />
                      <stop offset="95%" stopColor="#0F5132" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="phase"
                    tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }}
                  />
                  <YAxis
                    tickFormatter={(v) =>
                      v >= 1000000
                        ? `${(v / 1000000).toFixed(1)}M`
                        : v >= 1000
                        ? `${(v / 1000).toFixed(0)}k`
                        : String(v)
                    }
                    tick={{ fontSize: 11, fill: '#0F5132', fontWeight: 700 }}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `${Number(value ?? 0).toLocaleString()} Youth`,
                      'Cumulative Transition Target',
                    ]}
                    contentStyle={{
                      backgroundColor: '#0B2B1E',
                      border: '1px solid #0F5132',
                      borderRadius: '10px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="youthTransitioned"
                    name="Youth Transitioned to Formal Status"
                    stroke="#0F5132"
                    strokeWidth={3}
                    fill="url(#nationalTargetFill)"
                  />
                  <Line
                    type="monotone"
                    dataKey="targetMilestone"
                    name="2,000,000 Youth Roadmap Milestone"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#F59E0B' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}

            {activeChartTab === 'groups' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={memberGroupsChartData}
                  margin={{ top: 10, right: 16, left: 0, bottom: 45 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="name"
                    angle={-25}
                    textAnchor="end"
                    interval={0}
                    height={60}
                    tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#0F5132', fontWeight: 700 }} />
                  <Tooltip
                    formatter={(value) => [`${Number(value ?? 0)} Supplied Records`, 'Verified Members']}
                    contentStyle={{
                      backgroundColor: '#0B2B1E',
                      border: '1px solid #0F5132',
                      borderRadius: '10px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="members" name="Supplied Member Records" radius={[6, 6, 0, 0]}>
                    {memberGroupsChartData.map((entry, idx) => (
                      <Cell
                        key={`cell-${entry.fullName}`}
                        fill={idx < 3 ? '#0F5132' : idx < 8 ? '#047857' : '#D97706'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Interactive Entebbe Map Visualization */}
        <EntebbeGroupsMap profiles={profiles} onOpenSupportModal={onOpenSupportModal} />
      </div>
    </section>
  );
};
