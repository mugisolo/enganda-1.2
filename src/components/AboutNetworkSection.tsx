import React from 'react';
import {
  ArrowRight,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Network,
  Layers,
  Award,
  Camera,
} from 'lucide-react';
import { OPERATING_MODEL_STAGES, CAPACITY_AREAS, DEFAULT_SITE_MEDIA } from '../data/content';
import { SiteMediaSettings } from '../types';

interface AboutNetworkSectionProps {
  siteMedia: SiteMediaSettings;
  onOpenPhotoReplacer: () => void;
  onSelectGroupSlug?: (slug: string) => void;
}

export const AboutNetworkSection: React.FC<AboutNetworkSectionProps> = ({
  siteMedia,
  onOpenPhotoReplacer,
  onSelectGroupSlug,
}) => {
  const communityGroupNodes = [
    { name: 'Abayita Ababiri Ghetto Group', count: 53, loc: 'Abayita Ababiri' },
    { name: 'Baghdad Association Group', count: 36, loc: 'Entebbe' },
    { name: 'BEP Auto Garage Savings', count: 32, loc: 'Entebbe' },
    { name: 'Entebbe Ghetto Women Assoc.', count: 23, loc: 'Entebbe' },
    { name: 'Entebbe GUDA Community SACCO', count: 57, loc: 'Entebbe' },
    { name: 'Entebbe Island Ghetto SACCO', count: 102, loc: 'Entebbe Island' },
    { name: 'Gaza Ghetto SACCO', count: 13, loc: 'Entebbe' },
    { name: 'Kinazi Ghetto Katabi Saving', count: 58, loc: 'Kinazi, Katabi' },
    { name: 'Kitinda Cooperative Group', count: 57, loc: 'Kitinda, Nkumba' },
    { name: 'Lunyo East Ghetto Life Assoc.', count: 82, loc: 'Lunyo East' },
    { name: 'Peace Rock SACCO', count: 28, loc: 'Entebbe' },
    { name: 'Twezimbe SACCO', count: 98, loc: 'Entebbe' },
  ];

  return (
    <section
      id="about-network"
      className="py-16 sm:py-24 bg-[#FAF9F6] border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* 1. Mission Header with Balanced Editorial Photo Showcase (No Blank White Space) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#0F5132]">
              <Network className="w-4 h-4" />
              <span>About ENGANDA & Visual Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif] leading-tight">
              One Trusted Umbrella. Multiple Autonomous Community Groups & Programmes.
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-[1.7]">
              <strong className="text-slate-900">ENGANDA’s mission</strong> is to connect informal
              youth and community groups to{' '}
              <strong className="text-[#0F5132]">
                skills, structure, finance, visibility, and responsible partnerships
              </strong>
              . Rather than replacing grassroots leadership, ENGANDA provides the shared
              institutional governance and verification bridge that connects community groups to
              partners.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <span>15 Verified Public Profiles</span>
              <span aria-hidden="true">·</span>
              <span>690 Reconciled Member Records</span>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={onOpenPhotoReplacer}
                className="inline-flex items-center gap-1 font-bold text-[#0F5132] hover:underline cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Admin: Replace Section Photos</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md">
              <img
                src={siteMedia.aboutMissionImage || DEFAULT_SITE_MEDIA.aboutMissionImage}
                alt="ENGANDA Community SACCO Governance and Ledger Review in Entebbe"
                referrerPolicy="no-referrer"
                className="w-full h-64 sm:h-72 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent flex flex-col justify-between p-4">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={onOpenPhotoReplacer}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-950/80 hover:bg-amber-500 hover:text-slate-950 text-amber-300 border border-white/15 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Replace Photo</span>
                  </button>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                    Community Governance in Action
                  </span>
                  <p className="text-xs text-slate-100 mt-0.5 leading-snug">
                    SACCO leaders and youth committee representatives reviewing weekly member
                    savings ledgers in Entebbe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Infographic 1: The ENGANDA Umbrella Network Diagram */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
                Infographic 01 • Institutional Topology
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 font-['Plus_Jakarta_Sans',sans-serif]">
                The ENGANDA Umbrella Network Diagram
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              ENGANDA coordinates governance, member registry privacy, and partner inquiries across
              distinct flagship programmes and 13 community member groups.
            </p>
          </div>

          {/* Visual Diagram Hierarchy */}
          <div className="mt-8 space-y-6">
            {/* Top Level: ENGANDA Umbrella Node */}
            <div className="flex flex-col items-center">
              <div className="bg-[#0B2B1E] text-white rounded-2xl px-6 py-5 border-2 border-amber-400 shadow-lg max-w-xl w-full text-center">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold uppercase tracking-widest mb-1.5">
                  Central Umbrella Organisation
                </div>
                <div className="text-2xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                  ENGANDA
                </div>
                <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
                  Skills • Governance Structure • Financial Linkages • Visibility • Responsible
                  Partnerships
                </p>
              </div>

              {/* Vertical Connector Line */}
              <div className="w-0.5 h-8 bg-emerald-700/50" />
              <div className="w-full max-w-4xl h-0.5 bg-emerald-700/40 hidden md:block" />
            </div>

            {/* Second Tier: Flagship Programmes & Anchor Associations (SIZ, EGYA, LeoLeo) */}
            <div>
              <div className="text-center mb-4">
                <span className="inline-block px-3 py-1 rounded-md bg-emerald-50 text-[#0F5132] border border-emerald-200 text-xs font-bold uppercase tracking-wider">
                  Distinct Network Programmes & Anchor Associations
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Node A: SIZ Football Academy */}
                <div className="bg-emerald-950 text-white rounded-2xl p-5 border border-emerald-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider">
                        Flagship Programme
                      </span>
                      <span className="text-[11px] text-emerald-300 font-mono">Entebbe</span>
                    </div>
                    <h4 className="text-lg font-extrabold text-white">SIZ Football Academy</h4>
                    <p className="text-xs text-emerald-100/85 mt-1.5 leading-relaxed">
                      Youth football development, SIZ Football Gala leagues, athlete bursaries, and
                      home of the <strong>“Sponsor a Tree”</strong> /{' '}
                      <strong>“Plant a Tree, Plant a Player”</strong> stewardship campaign.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-emerald-800/80 flex items-center justify-between text-xs">
                    <span className="text-amber-300 font-semibold">Rep: Sulait Ibrahim</span>
                    <a
                      href="#programmes"
                      onClick={() => onSelectGroupSlug?.('siz-football-academy')}
                      className="font-bold text-white hover:text-amber-300 underline"
                    >
                      View SIZ &rarr;
                    </a>
                  </div>
                </div>

                {/* Node B: EGYA Association */}
                <div className="bg-[#0F5132] text-white rounded-2xl p-5 border border-emerald-700 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded bg-emerald-200 text-emerald-950 text-[10px] font-extrabold uppercase tracking-wider">
                        Youth Association (51 Members)
                      </span>
                      <span className="text-[11px] text-emerald-200 font-mono">Entebbe</span>
                    </div>
                    <h4 className="text-lg font-extrabold text-white">EGYA Association</h4>
                    <p className="text-xs text-emerald-100/90 mt-1.5 leading-relaxed">
                      Distinct community association organizing 51 registered members in collective
                      savings discipline, vocational trade clustering, and peer accountability.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-emerald-700/80 flex items-center justify-between text-xs">
                    <span className="text-amber-300 font-semibold">
                      Rep: Mugisa Solomon B.
                    </span>
                    <a
                      href="#programmes"
                      onClick={() => onSelectGroupSlug?.('egya-association')}
                      className="font-bold text-white hover:text-amber-300 underline"
                    >
                      View EGYA &rarr;
                    </a>
                  </div>
                </div>

                {/* Node C: LeoLeo */}
                <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-700 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider">
                        Flagship Programme
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">Entebbe</span>
                    </div>
                    <h4 className="text-lg font-extrabold text-white">LeoLeo</h4>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      Community enterprise coordination, youth livelihood skills mobilization, and
                      digital market visibility linking local micro-enterprises to opportunity.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-amber-300 font-semibold">Rep: Ronnie Tumusiime</span>
                    <a
                      href="#programmes"
                      onClick={() => onSelectGroupSlug?.('leoleo')}
                      className="font-bold text-white hover:text-amber-300 underline"
                    >
                      View LeoLeo &rarr;
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Connector to Community SACCOs & Groups */}
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-6 bg-emerald-700/40" />
              <span className="px-3.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold uppercase tracking-wider">
                + 12 Connected Community SACCOs, Cooperatives & Savings Associations (639 + 51 EGYA
                = 690 Member Records)
              </span>
            </div>

            {/* Third Tier: Connected Community & SACCO Groups Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
              {communityGroupNodes.map((node) => (
                <a
                  key={node.name}
                  href="#directory"
                  className="group p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-600/50 transition-all flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 group-hover:text-[#0F5132] truncate">
                      {node.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{node.loc}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[11px] font-extrabold text-[#0F5132] tabular-nums shrink-0">
                    {node.count}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Infographic 2: Three-Stage Operating Model (Organise -> Formalise -> Grow) with AI Visual Banners */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#0F5132]">
                Infographic 02 • Three-Stage Operating Model
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-['Plus_Jakarta_Sans',sans-serif]">
                Organise → Formalise → Grow
              </h3>
            </div>
            <p className="text-sm text-slate-600 max-w-md">
              A sequential pathway that turns informal neighbourhood groups into structured,
              investment-ready economic units.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
            {OPERATING_MODEL_STAGES.map((stage, idx) => {
              const stageImg =
                siteMedia[stage.mediaKey] || DEFAULT_SITE_MEDIA[stage.mediaKey];
              return (
                <div
                  key={stage.step}
                  className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div>
                    {/* Stage Visual Banner */}
                    <div className="relative h-44 bg-slate-900 overflow-hidden">
                      <img
                        src={stageImg}
                        alt={`Stage ${stage.step}: ${stage.title}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent flex items-start justify-between p-3.5">
                        <span className="px-2.5 py-1 rounded-lg bg-[#0F5132] text-white font-extrabold text-xs font-mono shadow-sm">
                          Stage {stage.step}
                        </span>
                        <button
                          type="button"
                          onClick={onOpenPhotoReplacer}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-950/80 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          <Camera className="w-3 h-3" />
                          <span>Replace</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-6 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                          {stage.title}
                        </h4>
                        {idx < 2 && (
                          <ArrowRight className="hidden lg:block w-5 h-5 text-amber-600 shrink-0" />
                        )}
                      </div>

                      <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
                        {stage.tagline}
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {stage.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-4 border-t border-slate-100 space-y-2">
                    {stage.outcomes.map((outcome) => (
                      <div key={outcome} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-[#0F5132] shrink-0 mt-0.5" />
                        <span className="leading-snug">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Infographic 3: Three Connected Areas of Capacity with AI Visual Banners */}
        <div className="bg-[#0B2B1E] text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-emerald-900 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Infographic 03 • Core Capacity Framework
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-['Plus_Jakarta_Sans',sans-serif]">
                Three Connected Areas of Capacity
              </h3>
              <p className="text-sm sm:text-base text-emerald-100/85 mt-2 leading-relaxed">
                Every group and programme within the ENGANDA umbrella builds strength across three
                mutually reinforcing pillars.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenPhotoReplacer}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-300 border border-emerald-700 text-xs font-bold cursor-pointer self-start md:self-auto"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Admin: Replace Pillar Photos</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {CAPACITY_AREAS.map((area, index) => {
              const Icon =
                index === 0 ? Award : index === 1 ? Building2 : ShieldCheck;
              const pillarImg =
                siteMedia[area.mediaKey] || DEFAULT_SITE_MEDIA[area.mediaKey];
              return (
                <div
                  key={area.id}
                  className="bg-emerald-950/80 border border-emerald-800/80 rounded-2xl overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-40 bg-slate-900 overflow-hidden">
                      <img
                        src={pillarImg}
                        alt={area.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/30 to-transparent flex items-end justify-between p-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 backdrop-blur-sm border border-amber-400/40 flex items-center justify-center text-amber-300">
                          <Icon className="w-5 h-5" />
                        </div>
                        <button
                          type="button"
                          onClick={onOpenPhotoReplacer}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-950/75 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          <Camera className="w-3 h-3" />
                          <span>Replace</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-6 pb-4">
                      <h4 className="text-xl font-extrabold text-white font-['Plus_Jakarta_Sans',sans-serif]">
                        {area.title}
                      </h4>
                      <p className="text-xs font-bold uppercase tracking-wider text-amber-400 mt-1">
                        {area.subtitle}
                      </p>
                      <p className="text-sm text-emerald-100/85 mt-3 leading-relaxed">
                        {area.description}
                      </p>
                    </div>
                  </div>

                  <ul className="px-6 pb-6 pt-4 border-t border-emerald-800/60 space-y-2">
                    {area.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-xs text-emerald-100/90"
                      >
                        <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
