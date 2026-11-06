import React, { useState, useMemo, useEffect } from 'react';
import {
  Compass,
  Calendar,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Users,
  Layers,
  SlidersHorizontal,
} from 'lucide-react';
import { SafariEventItem, SupportEnquiryPreset } from '../types';
import { DEFAULT_SAFARI_EVENTS, SAFARI_LAKE_VICTORIA_IMAGE } from '../data/content';

interface SafarisEventsSectionProps {
  safariEvents: SafariEventItem[];
  onOpenSupportModal: (preset: SupportEnquiryPreset) => void;
  onOpenSafariAdmin: () => void;
}

export const SafarisEventsSection: React.FC<SafarisEventsSectionProps> = ({
  safariEvents,
  onOpenSupportModal,
  onOpenSafariAdmin,
}) => {
  const allEvents = useMemo(
    () => (safariEvents && safariEvents.length > 0 ? safariEvents : DEFAULT_SAFARI_EVENTS),
    [safariEvents]
  );

  const carouselEvents = useMemo(() => {
    const filtered = allEvents.filter((e) => e.showOnCarousel);
    return filtered.length > 0 ? filtered : allEvents.slice(0, 3);
  }, [allEvents]);

  const upcomingEvents = useMemo(() => {
    const filtered = allEvents.filter((e) => e.showInUpcoming);
    return filtered.length > 0 ? filtered : allEvents;
  }, [allEvents]);

  const [activeViewTab, setActiveViewTab] = useState<'both' | 'carousel' | 'upcoming'>('both');
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [autoPlayPaused, setAutoPlayPaused] = useState(false);

  const safeSlideIdx = carouselEvents.length > 0 ? activeSlideIdx % carouselEvents.length : 0;
  const currentSlide = carouselEvents[safeSlideIdx] || carouselEvents[0];

  useEffect(() => {
    if (autoPlayPaused || carouselEvents.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlideIdx((prev) => (prev + 1) % carouselEvents.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [autoPlayPaused, carouselEvents.length]);

  const categories = useMemo(() => {
    return Array.from(new Set(upcomingEvents.map((e) => e.category)));
  }, [upcomingEvents]);

  const filteredUpcoming = useMemo(() => {
    if (selectedCategory === 'all') return upcomingEvents;
    return upcomingEvents.filter((e) => e.category === selectedCategory);
  }, [upcomingEvents, selectedCategory]);

  const handlePrevSlide = () => {
    setAutoPlayPaused(true);
    setActiveSlideIdx((prev) => (prev - 1 + carouselEvents.length) % carouselEvents.length);
  };

  const handleNextSlide = () => {
    setAutoPlayPaused(true);
    setActiveSlideIdx((prev) => (prev + 1) % carouselEvents.length);
  };

  return (
    <section
      id="safaris-events"
      className="py-14 sm:py-20 bg-[#071D14] text-white border-b border-emerald-900 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header + Admin Load New Event / Trip Trigger */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl min-w-0">
            <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-md bg-emerald-900/90 border border-emerald-700/70 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider mb-3">
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span className="break-words">
                ENGANDA Safaris • Expeditions, Events & Upcoming Programs
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif] break-words leading-tight">
              ENGANDA Safaris, Community Trips & Upcoming Network Programs
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-emerald-100/85 leading-relaxed break-words">
              Explore featured eco-safaris across Lake Victoria, community cooperative benchmark
              trips, SIZ youth tournament matchdays, and upcoming SACCO capacity clinics.
              Administrators can load new trips and assign them to the{' '}
              <strong className="text-amber-300">Featured Carousel</strong> or{' '}
              <strong className="text-amber-300">Upcoming Programs</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenSafariAdmin}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-md transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>Admin: Load New Event / Safari Trip</span>
            </button>
          </div>
        </div>

        {/* Bounded Section View Tabs (Zero Overflow) */}
        <div className="bg-[#0B2B1E] border border-emerald-800/80 rounded-2xl p-2 sm:p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 w-full sm:w-auto"
            role="tablist"
            aria-label="ENGANDA Safaris and Upcoming Programs view tabs"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeViewTab === 'both'}
              onClick={() => setActiveViewTab('both')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-colors text-center break-words leading-snug cursor-pointer ${
                activeViewTab === 'both'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-emerald-950/70 text-emerald-100 hover:bg-emerald-900'
              }`}
            >
              Carousel + Upcoming ({allEvents.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeViewTab === 'carousel'}
              onClick={() => setActiveViewTab('carousel')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-colors text-center break-words leading-snug cursor-pointer ${
                activeViewTab === 'carousel'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-emerald-950/70 text-emerald-100 hover:bg-emerald-900'
              }`}
            >
              Featured Carousel Only ({carouselEvents.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeViewTab === 'upcoming'}
              onClick={() => setActiveViewTab('upcoming')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-colors text-center break-words leading-snug cursor-pointer ${
                activeViewTab === 'upcoming'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-emerald-950/70 text-emerald-100 hover:bg-emerald-900'
              }`}
            >
              Upcoming Programs ({upcomingEvents.length})
            </button>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 px-2 text-[11px] text-emerald-300/90">
            <span className="truncate">
              Powered by Enganda, RONSOL, RELWORX, FINCA &amp; ECO Bank
            </span>
          </div>
        </div>

        {/* 1. REFINED FEATURED SAFARIS & EVENTS CAROUSEL (Fits Strictly Inside Tab Boundaries) */}
        {(activeViewTab === 'both' || activeViewTab === 'carousel') && currentSlide && (
          <div className="rounded-3xl bg-[#0B2B1E] border border-emerald-800/90 shadow-2xl overflow-hidden">
            {/* Top Carousel Slide Selector Tabs — Bounded Grid so Words Never Go Out of Boundaries */}
            <div className="bg-emerald-950/90 border-b border-emerald-800/80 p-2.5 sm:p-3">
              <div className="flex items-center justify-between gap-2 mb-2 px-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5 min-w-0">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    Featured ENGANDA Safaris &amp; Events Carousel (Slide {safeSlideIdx + 1} of{' '}
                    {carouselEvents.length})
                  </span>
                </span>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    className="p-1.5 rounded-lg bg-emerald-900 hover:bg-amber-500 hover:text-slate-950 text-white border border-emerald-700 transition-colors cursor-pointer"
                    aria-label="Previous carousel slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    className="p-1.5 rounded-lg bg-emerald-900 hover:bg-amber-500 hover:text-slate-950 text-white border border-emerald-700 transition-colors cursor-pointer"
                    aria-label="Next carousel slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bounded Slide Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5">
                {carouselEvents.map((slide, idx) => {
                  const isActive = idx === safeSlideIdx;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => {
                        setAutoPlayPaused(true);
                        setActiveSlideIdx(idx);
                      }}
                      className={`w-full min-w-0 text-left px-3 py-2 rounded-xl border transition-all cursor-pointer overflow-hidden ${
                        isActive
                          ? 'bg-[#0F5132] border-amber-400 text-white shadow-sm'
                          : 'bg-emerald-950/60 border-emerald-800/70 text-emerald-200/80 hover:bg-emerald-900/60 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                        <span className="text-amber-300 font-mono truncate">{slide.code}</span>
                        <span className="text-emerald-300/90 shrink-0">{slide.dateLabel}</span>
                      </div>
                      <div className="text-xs font-extrabold mt-0.5 line-clamp-1 break-words">
                        {slide.title}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Carousel Slide Content — Strictly Contained Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Image Column (6 cols) */}
              <div className="lg:col-span-6 relative min-h-[260px] sm:min-h-[340px] bg-slate-950 overflow-hidden">
                <img
                  src={currentSlide.imageUrl || SAFARI_LAKE_VICTORIA_IMAGE}
                  alt={currentSlide.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-between p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 text-[11px] font-extrabold uppercase tracking-wider max-w-full break-words">
                      {currentSlide.category}
                    </span>
                    <button
                      type="button"
                      onClick={onOpenSafariAdmin}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-950/85 hover:bg-amber-500 hover:text-slate-950 text-amber-300 border border-amber-400/40 text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3 h-3 shrink-0" />
                      <span>Edit Carousel / Trips</span>
                    </button>
                  </div>

                  <div className="bg-slate-950/85 backdrop-blur-md border border-emerald-800/80 rounded-xl p-3 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-emerald-200">
                      <span className="inline-flex items-center gap-1.5 font-bold text-amber-300 min-w-0">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span className="break-words">{currentSlide.dateLabel}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 min-w-0">
                        <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="break-words">{currentSlide.durationLabel}</span>
                      </span>
                    </div>
                    <div className="mt-1 inline-flex items-start gap-1.5 text-xs text-white font-semibold min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span className="break-words">{currentSlide.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Details Column (6 cols) — Strictly Bounded with min-w-0 and break-words */}
              <div className="lg:col-span-6 p-5 sm:p-7 lg:p-8 flex flex-col justify-between min-w-0 space-y-5">
                <div className="space-y-3.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-900 text-amber-300 font-mono text-xs font-extrabold border border-emerald-700">
                      {currentSlide.code}
                    </span>
                    <span className="text-xs text-emerald-300 font-semibold break-words">
                      Organised by {currentSlide.organizer}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans',sans-serif] leading-snug break-words">
                    {currentSlide.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed break-words">
                    {currentSlide.summary}
                  </p>

                  {/* Itinerary / Event Highlights */}
                  {Array.isArray(currentSlide.highlights) && currentSlide.highlights.length > 0 && (
                    <div className="bg-emerald-950/80 border border-emerald-800/80 rounded-2xl p-3.5 space-y-2 min-w-0">
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
                        Trip &amp; Programme Highlights
                      </div>
                      <ul className="space-y-1.5">
                        {currentSlide.highlights.map((item, idx) => (
                          <li
                            key={`${currentSlide.id}-hl-${idx}`}
                            className="flex items-start gap-2 text-xs text-emerald-100 min-w-0"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span className="break-words leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Bottom Action & Fee Bar */}
                <div className="pt-4 border-t border-emerald-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      Participation / Sponsorship
                    </div>
                    <div className="text-xs sm:text-sm font-extrabold text-amber-300 break-words">
                      {currentSlide.feeOrSponsorshipLabel}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onOpenSupportModal({
                        groupId: 'grp-siz-academy',
                        groupName: currentSlide.organizer || 'ENGANDA Safaris',
                        supportType: 'Partner',
                        packageName: `${currentSlide.code}: ${currentSlide.title}`,
                      })
                    }
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-colors shrink-0 cursor-pointer"
                  >
                    <span>{currentSlide.ctaLabel || 'Book Safari / Register'}</span>
                    <ArrowUpRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. UPCOMING PROGRAMS, EXPEDITIONS & TRIPS GRID */}
        {(activeViewTab === 'both' || activeViewTab === 'upcoming') && (
          <div className="space-y-6 pt-2">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-400">
                  <Layers className="w-3.5 h-3.5 shrink-0" />
                  <span>Schedule of Upcoming Programs &amp; Trips</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1 font-['Plus_Jakarta_Sans',sans-serif] break-words">
                  Upcoming ENGANDA Safaris, Youth Galas &amp; SACCO Clinics ({filteredUpcoming.length})
                </h3>
              </div>

              {/* Category Filter Chips — Wrapped & Bounded */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-emerald-950/90 text-emerald-200 border border-emerald-800 hover:bg-emerald-900'
                  }`}
                >
                  All Upcoming ({upcomingEvents.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(selectedCategory === cat ? 'all' : cat)
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer break-words ${
                      selectedCategory === cat
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-emerald-950/90 text-emerald-200 border border-emerald-800 hover:bg-emerald-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUpcoming.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl bg-[#0B2B1E] border border-emerald-800/90 overflow-hidden flex flex-col justify-between shadow-lg hover:border-amber-400/60 transition-all min-w-0"
                >
                  <div className="min-w-0">
                    {/* Card Image Header */}
                    <div className="relative h-44 bg-slate-950 overflow-hidden">
                      <img
                        src={item.imageUrl || SAFARI_LAKE_VICTORIA_IMAGE}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent flex flex-col justify-between p-3.5">
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-slate-950/85 text-amber-300 font-mono text-[10px] font-extrabold">
                            {item.code}
                          </span>
                          <div className="flex flex-wrap items-center gap-1">
                            {item.showOnCarousel && (
                              <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-extrabold">
                                On Carousel
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded bg-emerald-900/95 text-emerald-100 border border-emerald-700 text-[10px] font-bold">
                              Upcoming
                            </span>
                          </div>
                        </div>

                        <div className="min-w-0">
                          <span className="inline-block px-2 py-0.5 rounded bg-white/95 text-[#0F5132] text-[10px] font-extrabold uppercase tracking-wider max-w-full truncate">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-3 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-amber-300 font-bold">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          <span>{item.dateLabel}</span>
                        </span>
                        <span>•</span>
                        <span className="text-emerald-200 font-medium">{item.durationLabel}</span>
                      </div>

                      <h4 className="text-base sm:text-lg font-extrabold text-white font-['Plus_Jakarta_Sans',sans-serif] leading-snug break-words">
                        {item.title}
                      </h4>

                      <div className="flex items-start gap-1.5 text-xs text-emerald-200 min-w-0">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="break-words">{item.location}</span>
                      </div>

                      <p className="text-xs text-emerald-100/85 leading-relaxed break-words">
                        {item.summary}
                      </p>

                      {Array.isArray(item.highlights) && item.highlights.length > 0 && (
                        <ul className="pt-2 border-t border-emerald-800/70 space-y-1">
                          {item.highlights.slice(0, 3).map((hl, idx) => (
                            <li
                              key={`${item.id}-up-hl-${idx}`}
                              className="flex items-start gap-1.5 text-[11px] text-emerald-200/90 min-w-0"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                              <span className="break-words">{hl}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 pb-5 pt-3 border-t border-emerald-800/80 space-y-2.5 min-w-0">
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="inline-flex items-center gap-1 text-emerald-300 truncate">
                        <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{item.organizer}</span>
                      </span>
                    </div>
                    <div className="text-xs font-extrabold text-amber-300 break-words">
                      {item.feeOrSponsorshipLabel}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          onOpenSupportModal({
                            groupId: 'grp-siz-academy',
                            groupName: item.organizer || 'ENGANDA Safaris',
                            supportType: 'Partner',
                            packageName: `${item.code}: ${item.title}`,
                          })
                        }
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-colors cursor-pointer"
                      >
                        <span className="truncate">{item.ctaLabel || 'Book / Register'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                      </button>
                      <button
                        type="button"
                        onClick={onOpenSafariAdmin}
                        className="px-2.5 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-800 text-xs font-bold transition-colors cursor-pointer shrink-0"
                        title="Admin: Edit or toggle Carousel / Upcoming placement"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
