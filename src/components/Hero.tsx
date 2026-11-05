import React from 'react';
import { ArrowRight, Network, ShieldCheck, Users, Layers, Building2 } from 'lucide-react';
import { HERO_IMAGE } from '../data/content';
import { SupportEnquiryPreset } from '../types';

interface HeroProps {
  totalProfiles: number;
  memberGroupsCount: number;
  totalMemberRecords: number;
  onOpenSupportModal: (preset?: SupportEnquiryPreset) => void;
  onOpenAdminModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  totalProfiles,
  memberGroupsCount,
  totalMemberRecords,
  onOpenSupportModal,
  onOpenAdminModal,
}) => {
  return (
    <section
      id="home"
      className="relative bg-[#0B2B1E] text-white overflow-hidden border-b border-emerald-900"
    >
      {/* Subtle editorial grid texture */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 2px 2px, rgba(167, 243, 208, 0.35) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Editorial Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-md bg-emerald-900/90 border border-emerald-700/60 text-amber-300 text-xs font-bold uppercase tracking-[0.14em]">
              <Network className="w-3.5 h-3.5 shrink-0" />
              <span>ENGANDA Umbrella Organisation • Entebbe, Uganda</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight leading-[1.12] font-['Plus_Jakarta_Sans',sans-serif] text-white">
              Connecting Community Groups to{' '}
              <span className="text-amber-400">Skills, Structure, Finance</span> & Responsible
              Partnerships.
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 leading-[1.7] max-w-2xl">
              <strong className="text-white font-semibold">ENGANDA</strong> serves as the trusted
              institutional umbrella uniting community SACCOs, youth savings associations, trade
              cooperatives, and flagship programmes—including{' '}
              <strong className="text-amber-300 font-semibold">SIZ Football Academy</strong>,{' '}
              <strong className="text-amber-300 font-semibold">EGYA Association</strong>, and{' '}
              <strong className="text-amber-300 font-semibold">LeoLeo</strong>—into visible,
              accountable economic units.
            </p>

            {/* Primary Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <a
                href="#directory"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-lg transition-all min-h-[46px]"
              >
                <span>Explore 15 Network Profiles</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() =>
                  onOpenSupportModal({
                    groupId: 'grp-egya',
                    groupName: 'EGYA Association',
                    supportType: 'Partner',
                  })
                }
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-white font-bold text-sm border border-emerald-700 transition-all cursor-pointer min-h-[46px]"
              >
                <span>Partner, Sponsor or Invest</span>
              </button>

              <a
                href="#about-network"
                className="inline-flex items-center justify-center px-4 py-3.5 rounded-xl text-emerald-200 hover:text-white font-semibold text-sm underline underline-offset-4 transition-colors"
              >
                View Network Architecture
              </a>
            </div>
          </div>

          {/* Right Visual Editorial Column (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-emerald-700/60 bg-slate-900 shadow-2xl">
              <img
                src={HERO_IMAGE}
                alt="ENGANDA Community Artisans and Youth Groups in Entebbe"
                className="w-full h-[360px] sm:h-[420px] object-cover object-center brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071D14] via-[#071D14]/35 to-transparent flex flex-col justify-between p-5 sm:p-6">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-white/15 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                    Umbrella Governance
                  </span>
                  <span className="px-3 py-1 rounded-md bg-amber-500/95 text-slate-950 text-[11px] font-extrabold uppercase tracking-wider">
                    Entebbe Network
                  </span>
                </div>

                <div className="bg-slate-950/90 backdrop-blur-md border border-emerald-800/70 rounded-xl p-4 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Network Architecture
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    Connecting <strong className="text-white">SIZ Football Academy</strong>,{' '}
                    <strong className="text-white">EGYA Association</strong>,{' '}
                    <strong className="text-white">LeoLeo</strong>, and community SACCOs to
                    verified governance and responsible partnerships.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Network Key Figures Bar */}
        <div className="mt-12 pt-8 border-t border-emerald-800/70 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-emerald-950/70 border border-emerald-800/70 rounded-xl p-5">
            <div className="flex items-center justify-between text-emerald-300 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider">
                Public Network Profiles
              </span>
              <Layers className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-white tabular-nums">{totalProfiles}</div>
            <p className="text-xs text-emerald-200/80 mt-1">
              13 Member Groups + SIZ & LeoLeo Programmes
            </p>
          </div>

          <div className="bg-emerald-950/70 border border-emerald-800/70 rounded-xl p-5">
            <div className="flex items-center justify-between text-emerald-300 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider">
                Supplied Member Records
              </span>
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-amber-400 tabular-nums">
              {totalMemberRecords.toLocaleString()}
            </div>
            <p className="text-xs text-emerald-200/80 mt-1">
              Reconciled across {memberGroupsCount} community groups & SACCOs
            </p>
          </div>

          <div className="bg-emerald-950/70 border border-emerald-800/70 rounded-xl p-5">
            <div className="flex items-center justify-between text-emerald-300 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider">
                Operating Framework
              </span>
              <Building2 className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Organise → Formalise → Grow
            </div>
            <p className="text-xs text-emerald-200/80 mt-1">
              Human capacity, economic structure & civic agency
            </p>
          </div>

          <div className="bg-emerald-950/70 border border-emerald-800/70 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-emerald-300 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Data Privacy Standard
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-lg font-extrabold text-white">Server-Enforced RBAC</div>
              <p className="text-xs text-emerald-200/80 mt-1">
                Public views expose zero private member PII
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenAdminModal}
              className="mt-3 text-left text-xs font-bold text-amber-300 hover:text-amber-200 underline cursor-pointer"
            >
              Open Authorised Registry Console &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
