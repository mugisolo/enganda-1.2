import React, { useState, useMemo } from 'react';
import {
  X,
  History,
  CheckCircle2,
  MapPin,
  Users,
  ShieldCheck,
  TrendingUp,
  Layers,
} from 'lucide-react';
import { TransitionMilestone } from '../types';

interface TransitionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRANSITION_MILESTONES: TransitionMilestone[] = [
  {
    id: 'ms-01',
    period: 'Q1 2024',
    stage: 'Organise',
    groupName: 'Abayita Ababiri Ghetto Group & Gaza Ghetto SACCO',
    location: 'Abayita Ababiri & Entebbe Central',
    membersTransitioned: 66,
    cumulativeFormalised: 66,
    milestoneTitle: 'Baseline Mobilisation & Leadership Constitution',
    verificationNote:
      'Completed leadership elections, group constitutions, and verified initial 53 records in Abayita Ababiri (Chair: Tumusiime) plus 13 records in Gaza Ghetto SACCO (Chair: Denis M).',
    representative: 'Tumusiime & Denis M',
  },
  {
    id: 'ms-02',
    period: 'Q2 2024',
    stage: 'Organise',
    groupName: 'Baghdad Association Group & BEP Auto Garage Savings',
    location: 'Entebbe, Uganda',
    membersTransitioned: 68,
    cumulativeFormalised: 134,
    milestoneTitle: 'Artisan & Urban Youth Savings Ledger Standardisation',
    verificationNote:
      'Transitioned 36 Baghdad Association members (Chair:Ssembatya) and 32 BEP Auto Garage mechanics and technicians (Rep: Mutebi R.) from informal cash pools into audited weekly savings ledgers.',
    representative: 'Ssembatya & Mutebi R.',
  },
  {
    id: 'ms-03',
    period: 'Q2 2024',
    stage: 'Formalise',
    groupName: 'EGYA Association & Entebbe Ghetto Women Association',
    location: 'Entebbe, Uganda',
    membersTransitioned: 74,
    cumulativeFormalised: 208,
    milestoneTitle: 'Gender-Inclusive Governance & Flagship Youth Association Charter',
    verificationNote:
      'Formalised 51 EGYA Association members (Chair: Kasule) and 23 Entebbe Ghetto Women Association entrepreneurs (Chair: Nabukenya) with structured executive committees.',
    representative: 'Kasule & Nabukenya',
  },
  {
    id: 'ms-04',
    period: 'Q3 2024',
    stage: 'Formalise',
    groupName: 'Entebbe GUDA Community SACCO & Peace Rock SACCO',
    location: 'Entebbe, Uganda',
    membersTransitioned: 85,
    cumulativeFormalised: 293,
    milestoneTitle: 'SACCO Bylaws Adoption & Internal Credit Governance',
    verificationNote:
      'Registered 57 members in Entebbe GUDA Community SACCO (Chair: Mutesi) and 28 members in Peace Rock SACCO (Chair: Kizza) under formal SACCO governance standards.',
    representative: 'Mutesi & Kizza',
  },
  {
    id: 'ms-05',
    period: 'Q4 2024',
    stage: 'Formalise',
    groupName: 'Kinazi Ghetto Katabi Saving Assoc. & Kitinda Cooperative Group',
    location: 'Kinazi, Katabi & Kitinda, Nkumba',
    membersTransitioned: 115,
    cumulativeFormalised: 408,
    milestoneTitle: 'Peri-Urban Corridor Cooperative & Savings Formalisation',
    verificationNote:
      'Onboarded 58 members in Kinazi Ghetto Katabi (Chair: Ssekandi) and 57 cooperative producers in Kitinda, Nkumba (Chair: Namukasa) into the ENGANDA registry.',
    representative: 'Ssekandi & Namukasa',
  },
  {
    id: 'ms-06',
    period: 'Q1 2025',
    stage: 'Grow',
    groupName: 'Lunyo East Ghetto Life Assoc. & Twezimbe SACCO',
    location: 'Lunyo East & Entebbe Central',
    membersTransitioned: 180,
    cumulativeFormalised: 588,
    milestoneTitle: 'High-Density SACCO Capitalisation & Enterprise Readiness',
    verificationNote:
      'Consolidated 82 members in Lunyo East (Chair: Opio) and 98 members in Twezimbe SACCO (Chair: Mugisha) for working-capital readiness and institutional partnerships.',
    representative: 'Opio & Mugisha',
  },
  {
    id: 'ms-07',
    period: 'Q1 2025',
    stage: 'Grow',
    groupName: 'Entebbe Island Ghetto SACCO + SIZ & LeoLeo Flagship Integration',
    location: 'Entebbe Island & Greater Entebbe',
    membersTransitioned: 102,
    cumulativeFormalised: 690,
    milestoneTitle: 'Full 15-Profile Network Reconciliation (690 Verified Member Records)',
    verificationNote:
      'Formalised 102 island fishing and trade members in Entebbe Island Ghetto SACCO (Chair: Mukasa) alongside flagship programmes SIZ Football Academy and LeoLeo, completing the 690-member Entebbe benchmark cohort.',
    representative: 'Mukasa, Coach Wasswa & Nsubuga',
  },
];

export const TransitionHistoryModal: React.FC<TransitionHistoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [stageFilter, setStageFilter] = useState<'ALL' | 'Organise' | 'Formalise' | 'Grow'>('ALL');

  const filteredMilestones = useMemo(() => {
    if (stageFilter === 'ALL') return TRANSITION_MILESTONES;
    return TRANSITION_MILESTONES.filter((m) => m.stage === stageFilter);
  }, [stageFilter]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="transition-history-title"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90dvh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-[#0B2B1E] text-white flex items-start justify-between gap-4 border-b border-emerald-900">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-400">
              <History className="w-3.5 h-3.5" />
              <span>ENGANDA Institutional Verification Log</span>
            </div>
            <h2
              id="transition-history-title"
              className="text-lg sm:text-xl font-extrabold text-white mt-1"
            >
              Youth Group Transition History: Informal Clusters to Formalised SACCOs
            </h2>
            <p className="text-xs text-emerald-100/85 mt-1 max-w-2xl">
              Chronological audit log tracking how 13 Entebbe community groups (690 verified member
              records) progressed through ENGANDA&apos;s Organise → Formalise → Grow operating model
              as the foundation for the 2,000,000 youth transition goal.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 transition-colors cursor-pointer shrink-0"
            aria-label="Close transition history modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Strip & Stage Filter */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5 font-bold text-slate-800">
              <Users className="w-4 h-4 text-[#0F5132]" />
              <span>Reconciled Cohort: 690 Members (13 Groups)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-bold text-amber-800">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span>National Scale Target: 2,000,000 Youth</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {(['ALL', 'Organise', 'Formalise', 'Grow'] as const).map((stage) => (
              <button
                key={stage}
                type="button"
                onClick={() => setStageFilter(stage)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  stageFilter === stage
                    ? 'bg-[#0F5132] text-white'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {stage === 'ALL' ? 'All Stages (7)' : stage}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-[#FAF9F6]">
          <div className="relative pl-5 sm:pl-7 border-l-2 border-emerald-700/40 space-y-5">
            {filteredMilestones.map((item) => {
              const stageBadgeColor =
                item.stage === 'Organise'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : item.stage === 'Formalise'
                  ? 'bg-sky-100 text-sky-900 border-sky-300'
                  : 'bg-emerald-100 text-emerald-900 border-emerald-300';

              return (
                <div
                  key={item.id}
                  className="relative bg-white rounded-xl border border-slate-200 p-4 shadow-xs"
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-[27px] sm:-left-[35px] top-5 w-4 h-4 rounded-full bg-[#0F5132] border-2 border-amber-400 shadow-xs" />

                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 text-[11px] font-extrabold">
                        {item.period}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded border text-[11px] font-extrabold uppercase tracking-wider ${stageBadgeColor}`}
                      >
                        Stage: {item.stage}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#0F5132]" />
                        <span>{item.location}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-extrabold">
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-[#0F5132] border border-emerald-200 tabular-nums">
                        +{item.membersTransitioned} Transitioned
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 tabular-nums">
                        Cumulative: {item.cumulativeFormalised} / 690
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    {item.milestoneTitle}
                  </h3>
                  <div className="text-xs font-bold text-[#0F5132] mt-0.5">
                    Groups: {item.groupName} • Public Rep: {item.representative}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2">
                    {item.verificationNote}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#0F5132]" />
            <span>
              Individual member records remain protected by server-side RBAC in the Registry Console.
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#0F5132] hover:bg-emerald-900 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close Transition Log
          </button>
        </div>
      </div>
    </div>
  );
};
