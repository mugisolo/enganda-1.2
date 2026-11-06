import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowRight,
  Network,
  ShieldCheck,
  Users,
  Layers,
  Building2,
  History,
  Camera,
  ChevronLeft,
  ChevronRight,
  Compass,
  Calendar,
} from 'lucide-react';
import { HERO_IMAGE, DEFAULT_SAFARI_EVENTS } from '../data/content';
import { SiteMediaSettings, SupportEnquiryPreset, SafariEventItem } from '../types';

interface HeroProps {
  totalProfiles: number;
  memberGroupsCount: number;
  totalMemberRecords: number;
  siteMedia: SiteMediaSettings;
  safariEvents?: SafariEventItem[];
  onOpenSupportModal: (preset?: SupportEnquiryPreset) => void;
  onOpenAdminModal: () => void;
  onOpenPhotoReplacer: () => void;
  onOpenSafariAdmin?: () => void;
  onOpenTransitionModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  totalProfiles,
  memberGroupsCount,
  totalMemberRecords,
  siteMedia,
  safariEvents,
  onOpenSupportModal,
  onOpenAdminModal,
  onOpenPhotoReplacer,
  onOpenSafariAdmin,
  onOpenTransitionModal,
}) => {
  const carouselSlides = useMemo(() => {
    const events =
      safariEvents && safariEvents.length > 0 ? safariEvents : DEFAULT_SAFARI_EVENTS;
    const featuredSafaris = events.filter((e) => e.showOnCarousel);

    return [
      {
        id: 'hero-main-showcase',
        badge: 'Institutional Governance',
        code: 'ENGANDA HUB',
        title: 'Network Architecture & 15 Verified Profiles',
        subtitle: 'Entebbe, Uganda • 690 Reconciled Member Records',
        description:
          'Connecting SIZ Football Academy, EGYA Association, LeoLeo, and 13 community groups to verified governance and responsible partnerships.',
        imageUrl: siteMedia.heroBannerImage || HERO_IMAGE,
        isSafariSlide: false,
      },
      ...featuredSafaris.map((item) => ({
        id: item.id,
        badge: item.category,
        code: item.code,
        title: item.title,
        subtitle: `${item.dateLabel} • ${item.location}`,
        description: item.summary,
        imageUrl: item.imageUrl || HERO_IMAGE,
        isSafariSlide: true,
      })),
    ];
  }, [siteMedia.heroBannerImage, safariEvents]);

  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  const safeSlideIdx = carouselSlides.length > 0 ? activeSlide % carouselSlides.length : 0;
  const current = carouselSlides[safeSlideIdx] || carouselSlides[0];

  useEffect(() => {
    if (paused || carouselSlides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [paused, carouselSlides.length]);

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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-9 pb-12 lg:pt-14 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Editorial Column (7 cols) */}
          <div className="lg:col-span-7 space-y-5 min-w-0">
            <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-md bg-emerald-900/90 border border-emerald-700/60 text-amber-300 text-[11px] font-bold uppercase tracking-[0.12em]">
              <Network className="w-3.5 h-3.5 shrink-0" />
              <span>ENGANDA • Entebbe, Uganda</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-[2.65rem] font-extrabold tracking-tight leading-[1.15] font-['Plus_Jakarta_Sans',sans-serif] text-white break-words">
              Connecting Community Groups to{' '}
              <span className="text-amber-400">Skills, Structure, Finance</span> &amp; Responsible
              Partnerships.
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-[1.65] max-w-2xl break-words">
              <strong className="text-white font-semibold">ENGANDA</strong> serves as the trusted
              institutional umbrella uniting community SACCOs, youth savings associations, trade
              cooperatives, <strong className="text-amber-300 font-semibold">ENGANDA Safaris</strong>
              , and flagship programmes—including{' '}
              <strong className="text-amber-300 font-semibold">SIZ Football Academy</strong>,{' '}
              <strong className="text-amber-300 font-semibold">EGYA Association</strong>, and{' '}
              <strong className="text-amber-300 font-semibold">LeoLeo</strong>—into visible,
              accountable economic units advancing toward the 2,000,000 youth formalisation vision.
            </p>

            {/* Primary Actions */}
            <div className="pt-1 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <a
                href="#directory"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg transition-all"
              >
                <span>Explore 15 Network Profiles</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </a>

              <a
                href="#safaris-events"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-amber-300 font-bold text-xs sm:text-sm border border-emerald-700 transition-all"
              >
                <Compass className="w-4 h-4 shrink-0" />
                <span>ENGANDA Safaris &amp; Trips</span>
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
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-950/90 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm border border-emerald-800 transition-all cursor-pointer"
              >
                <span>Partner, Sponsor or Invest</span>
              </button>

              <button
                type="button"
                onClick={onOpenTransitionModal}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-amber-300 font-bold text-xs border border-emerald-800 transition-colors cursor-pointer"
              >
                <History className="w-3.5 h-3.5 shrink-0" />
                <span>Transition Log</span>
              </button>
            </div>
          </div>

          {/* Right Visual Editorial Carousel Column (5 cols) — Strictly Bounded Inside Tab */}
          <div className="lg:col-span-5 min-w-0">
            <div className="rounded-2xl overflow-hidden border border-emerald-700/70 bg-slate-950 shadow-2xl">
              {/* Top Bounded Slide Tabs Bar */}
              <div className="bg-emerald-950/95 border-b border-emerald-800/80 px-3 py-2 flex items-center justify-between gap-2 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
                  <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-extrabold font-mono shrink-0">
                    {safeSlideIdx + 1}/{carouselSlides.length}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-200 truncate">
                    {current.code} • {current.badge}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setPaused(true);
                      setActiveSlide(
                        (prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length
                      );
                    }}
                    className="p-1 rounded bg-emerald-900 hover:bg-amber-500 hover:text-slate-950 text-white transition-colors cursor-pointer"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaused(true);
                      setActiveSlide((prev) => (prev + 1) % carouselSlides.length);
                    }}
                    className="p-1 rounded bg-emerald-900 hover:bg-amber-500 hover:text-slate-950 text-white transition-colors cursor-pointer"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Image Frame */}
              <div className="relative h-[240px] sm:h-[260px] overflow-hidden bg-slate-900">
                <img
                  src={current.imageUrl}
                  alt={current.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent flex flex-col justify-between p-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-950/85 border border-white/15 text-[10px] font-bold uppercase tracking-wider text-amber-300 max-w-[65%] truncate">
                      {current.badge}
                    </span>
                    <button
                      type="button"
                      onClick={
                        current.isSafariSlide && onOpenSafariAdmin
                          ? onOpenSafariAdmin
                          : onOpenPhotoReplacer
                      }
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950/85 hover:bg-amber-500 hover:text-slate-950 text-amber-300 border border-amber-400/40 text-[10px] font-extrabold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                    >
                      <Camera className="w-3 h-3 shrink-0" />
                      <span>{current.isSafariSlide ? 'Edit Safari' : 'Replace Photo'}</span>
                    </button>
                  </div>

                  {/* Indicator Dots */}
                  <div className="flex items-center gap-1.5">
                    {carouselSlides.map((s, idx) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setPaused(true);
                          setActiveSlide(idx);
                        }}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          idx === safeSlideIdx
                            ? 'w-6 bg-amber-400'
                            : 'w-2 bg-white/40 hover:bg-white/70'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Strictly Bounded Text Footer (Never Overflows Out of Boundaries) */}
              <div className="p-4 bg-[#071D14] border-t border-emerald-800/80 space-y-1.5 min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 min-w-0">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{current.subtitle}</span>
                </div>
                <h2 className="text-sm sm:text-base font-extrabold text-white leading-snug break-words line-clamp-2">
                  {current.title}
                </h2>
                <p className="text-xs text-emerald-100/85 leading-relaxed break-words line-clamp-2">
                  {current.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Network Key Figures Bar */}
        <div className="mt-9 pt-6 border-t border-emerald-800/70 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-emerald-950/70 border border-emerald-800/70 rounded-xl p-4 min-w-0">
            <div className="flex items-center justify-between text-emerald-300 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider truncate">
                Public Network Profiles
              </span>
              <Layers className="w-4 h-4 text-amber-400 shrink-0" />
            </div>
            <div className="text-2xl font-extrabold text-white tabular-nums">{totalProfiles}</div>
            <p className="text-[11px] text-emerald-200/80 mt-0.5 break-words">
              13 Member Groups + SIZ &amp; LeoLeo Programmes
            </p>
          </div>

          <div className="bg-emerald-950/70 border border-emerald-800/70 rounded-xl p-4 min-w-0">
            <div className="flex items-center justify-between text-emerald-300 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider truncate">
                Supplied Member Records
              </span>
              <Users className="w-4 h-4 text-amber-400 shrink-0" />
            </div>
            <div className="text-2xl font-extrabold text-amber-400 tabular-nums">
              {totalMemberRecords.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-200/80 mt-0.5 break-words">
              Reconciled across {memberGroupsCount} community groups &amp; SACCOs
            </p>
          </div>

          <div className="bg-emerald-950/70 border border-emerald-800/70 rounded-xl p-4 min-w-0">
            <div className="flex items-center justify-between text-emerald-300 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider truncate">
                Operating Framework
              </span>
              <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-white mt-0.5 break-words">
              Organise → Formalise → Grow
            </div>
            <p className="text-[11px] text-emerald-200/80 mt-0.5 break-words">
              Human capacity, economic structure &amp; civic agency
            </p>
          </div>

          <div className="bg-emerald-950/70 border border-emerald-800/70 rounded-xl p-4 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-center justify-between text-emerald-300 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider truncate">
                  Data Privacy Standard
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
              <div className="text-base font-extrabold text-white">Server-Enforced RBAC</div>
              <p className="text-[11px] text-emerald-200/80 mt-0.5 break-words">
                Public views expose zero private member PII
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenAdminModal}
              className="mt-2 text-left text-[11px] font-bold text-amber-300 hover:text-amber-200 underline cursor-pointer"
            >
              Open Authorised Registry Console &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
