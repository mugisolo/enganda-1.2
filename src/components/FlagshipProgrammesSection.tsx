import React, { useState } from 'react';
import {
  Trophy,
  TreePine,
  ExternalLink,
  MapPin,
  UserCheck,
  CheckCircle2,
  ArrowUpRight,
  Users,
  Briefcase,
  Sparkles,
  Camera,
  Images,
} from 'lucide-react';
import { PublicGroupProfile, SiteMediaSettings, SupportEnquiryPreset } from '../types';
import {
  TREE_PLANTING_IMAGE,
  SACCO_GOVERNANCE_IMAGE,
  BRIQUETTE_ENERGY_IMAGE,
  SIZ_ACADEMY_IMAGE,
} from '../data/content';

interface FlagshipProgrammesSectionProps {
  profiles: PublicGroupProfile[];
  siteMedia: SiteMediaSettings;
  onOpenSupportModal: (preset: SupportEnquiryPreset) => void;
  onOpenGroupGalleryEditor: (groupId: string) => void;
  onOpenPhotoReplacer: () => void;
}

export const FlagshipProgrammesSection: React.FC<FlagshipProgrammesSectionProps> = ({
  profiles,
  siteMedia,
  onOpenSupportModal,
  onOpenGroupGalleryEditor,
  onOpenPhotoReplacer,
}) => {
  const sizProfile = profiles.find((p) => p.id === 'grp-siz-academy');
  const egyaProfile = profiles.find((p) => p.id === 'grp-egya');
  const leoleoProfile = profiles.find((p) => p.id === 'grp-leoleo');

  const [sizActiveImgIdx, setSizActiveImgIdx] = useState(0);
  const [egyaActiveImgIdx, setEgyaActiveImgIdx] = useState(0);
  const [leoleoActiveImgIdx, setLeoleoActiveImgIdx] = useState(0);

  const sizGallery = (
    sizProfile?.galleryImages?.length
      ? sizProfile.galleryImages
      : [SIZ_ACADEMY_IMAGE, siteMedia.sizStewardshipImage || TREE_PLANTING_IMAGE]
  ).slice(0, 5);

  const egyaGallery = (
    egyaProfile?.galleryImages?.length
      ? egyaProfile.galleryImages
      : [siteMedia.egyaBannerImage || SACCO_GOVERNANCE_IMAGE]
  ).slice(0, 5);

  const leoleoGallery = (
    leoleoProfile?.galleryImages?.length
      ? leoleoProfile.galleryImages
      : [siteMedia.leoleoBannerImage || BRIQUETTE_ENERGY_IMAGE]
  ).slice(0, 5);

  const sizPackages = sizProfile?.sponsorshipPackages?.length
    ? sizProfile.sponsorshipPackages
    : [
        {
          id: 'siz-eco-captain',
          name: 'Eco-Captain',
          amountLabel: 'UGX 15,000,000',
          description:
            'Headline programme & league sponsorship supporting full-season youth academy operations, tournament kits, player bursaries, and community environmental drives.',
        },
        {
          id: 'siz-playmaker',
          name: 'Playmaker',
          amountLabel: 'UGX 8,000,000',
          description:
            'Co-sponsors regional youth league fixtures, coaching equipment, medical first-aid kits, and structured athlete mentorship cohorts.',
        },
        {
          id: 'siz-green-striker',
          name: 'Green Striker',
          amountLabel: 'UGX 3,000,000',
          description:
            'Backs "Plant a Tree, Plant a Player" matchday environmental action, match balls, training bibs, and youth player nutrition.',
        },
        {
          id: 'siz-grassroots-in-kind',
          name: 'Grassroots In-Kind',
          amountLabel: 'Custom pledge',
          description:
            'In-kind contribution of football boots, training gear, transport logistics, medical support, or educational materials.',
        },
      ];

  return (
    <section id="programmes" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header with Right-Column Showcase Photo Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#0F5132] mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Programme Hierarchy & Network Anchors</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              Distinct Programmes Under the ENGANDA Umbrella
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
              ENGANDA operates as the parent umbrella organisation. Within the network,{' '}
              <strong className="text-slate-900">SIZ Football Academy</strong>,{' '}
              <strong className="text-slate-900">EGYA Association</strong>, and{' '}
              <strong className="text-slate-900">LeoLeo</strong> maintain their own distinct
              leadership, projects, and 5-photo community galleries.
            </p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <div className="relative h-36 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900">
              <img
                src={sizGallery[0] || SIZ_ACADEMY_IMAGE}
                alt="SIZ Football Academy Youth Training"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-[11px] font-bold text-white">SIZ Football Academy</span>
              </div>
            </div>
            <div className="relative h-36 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900">
              <img
                src={siteMedia.sizStewardshipImage || TREE_PLANTING_IMAGE}
                alt="Plant a Tree, Plant a Player Initiative"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-between p-3">
                <span className="text-[11px] font-bold text-amber-300">Tree Stewardship</span>
                <button
                  type="button"
                  onClick={onOpenPhotoReplacer}
                  className="p-1 rounded bg-slate-950/80 text-white hover:text-amber-300 cursor-pointer"
                  title="Replace Photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 1. Dedicated SIZ Football Academy Feature Profile */}
        <div className="rounded-3xl border-2 border-[#0F5132]/20 bg-[#FAF9F6] overflow-hidden shadow-md">
          <div className="bg-[#0B2B1E] text-white px-6 sm:px-10 py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-emerald-800">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-2">
                <span className="px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-extrabold uppercase tracking-wider">
                  ENGANDA Network Programme
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-emerald-200">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {sizProfile?.location || 'Entebbe, Uganda'}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                {sizProfile?.name || 'SIZ Football Academy'}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenGroupGalleryEditor('grp-siz-academy')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-300 border border-emerald-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <Images className="w-3.5 h-3.5" />
                <span>Manage 5-Photo Gallery ({sizGallery.length}/5)</span>
              </button>
              {sizProfile?.websiteUrl && (
                <a
                  href={sizProfile.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-colors"
                >
                  <span>Visit SIZ ERP & Academy Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                </a>
              )}
              <button
                type="button"
                onClick={() =>
                  onOpenSupportModal({
                    groupId: 'grp-siz-academy',
                    groupName: 'SIZ Football Academy',
                    supportType: 'Sponsor',
                    packageName: 'Plant a Tree, Plant a Player — General Sponsorship',
                  })
                }
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-colors cursor-pointer"
              >
                <TreePine className="w-4 h-4" />
                <span>Sponsor a Tree / Plant a Player (SIZ)</span>
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-10">
            {/* SIZ Overview + Interactive 5-Photo Gallery Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 bg-white px-4 py-3 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#0F5132]" />
                    <span>
                      Public Representative:{' '}
                      <strong className="text-slate-900">
                        {sizProfile?.representativeName || 'Sulait Ibrahim'}
                      </strong>{' '}
                      ({sizProfile?.representativeTitle || 'Chief Executive Officer & Programme Lead'})
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                    Football, Youth Leagues, Development & Environmental Stewardship
                  </h4>
                  <p className="text-sm sm:text-base text-slate-700 mt-2 leading-relaxed">
                    {sizProfile?.summary ||
                      'SIZ Football Academy is a dedicated youth football, league competition, academic mentorship, and environmental stewardship programme operating within the ENGANDA network in Entebbe.'}
                  </p>
                </div>

                <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#0F5132]">
                    <Trophy className="w-4 h-4 text-amber-600" />
                    <span>
                      Active Project: {sizProfile?.projectName || 'Plant a Tree, Plant a Player & Youth League Development'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {sizProfile?.projectDescription}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {(
                      sizProfile?.activities || [
                        'Elite & Grassroots Youth Football Training Clinics (U-10 to U-17)',
                        'SIZ Football Gala & Inter-Community Youth League Competitions',
                        'Academic Bursaries, Life-Skills Mentorship & Player Welfare Tracking',
                        'Environmental Stewardship: "Sponsor a Tree" & "Plant a Tree, Plant a Player"',
                      ]
                    ).map((act) => (
                      <div key={act} className="flex items-start gap-2 text-xs text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-[#0F5132] shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: SIZ 5-Photo Gallery & Environmental Stewardship Card */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="relative h-56 overflow-hidden bg-slate-900">
                    <img
                      src={
                        sizGallery[sizActiveImgIdx] ||
                        siteMedia.sizStewardshipImage ||
                        TREE_PLANTING_IMAGE
                      }
                      alt="SIZ Football Academy Gallery"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent flex flex-col justify-between p-4">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-slate-950/80 text-white text-[10px] font-bold">
                          Photo {(sizActiveImgIdx % sizGallery.length) + 1} of {sizGallery.length}
                        </span>
                        <button
                          type="button"
                          onClick={() => onOpenGroupGalleryEditor('grp-siz-academy')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-950/80 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          <Camera className="w-3 h-3" />
                          <span>Edit Gallery</span>
                        </button>
                      </div>
                      <div>
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-300">
                          <TreePine className="w-3.5 h-3.5" />
                          SIZ 5-Photo Showcase & Stewardship
                        </span>
                        <div className="text-lg font-extrabold text-white mt-0.5">
                          “Plant a Tree, Plant a Player”
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 5-Thumbnail Selector Strip */}
                  {sizGallery.length > 1 && (
                    <div className="grid grid-cols-5 gap-1.5 p-2.5 bg-slate-50 border-b border-slate-200">
                      {sizGallery.map((imgUrl, idx) => (
                        <button
                          key={`${imgUrl}-${idx}`}
                          type="button"
                          onClick={() => setSizActiveImgIdx(idx)}
                          className={`relative h-11 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                            sizActiveImgIdx === idx
                              ? 'border-[#0F5132] ring-1 ring-[#0F5132]'
                              : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`SIZ gallery thumbnail ${idx + 1}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="p-5 space-y-3">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong>Programme Attribution:</strong> The{' '}
                      <strong className="text-slate-900">“Sponsor a Tree”</strong> and{' '}
                      <strong className="text-slate-900">“Plant a Tree, Plant a Player”</strong>{' '}
                      initiatives belong specifically to <strong>SIZ Football Academy</strong>,
                      linking youth athlete development and matchday fixtures with community tree
                      stewardship in Entebbe.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onOpenSupportModal({
                            groupId: 'grp-siz-academy',
                            groupName: 'SIZ Football Academy',
                            supportType: 'Sponsor',
                            packageName: 'Sponsor a Tree / Plant a Player (SIZ Initiative)',
                          })
                        }
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#0F5132] hover:bg-emerald-900 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        <TreePine className="w-3.5 h-3.5 text-amber-300" />
                        <span>Enquire to Sponsor (SIZ)</span>
                      </button>
                      {sizProfile?.websiteUrl && (
                        <a
                          href={sizProfile.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1 px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors"
                        >
                          <span>siz-football-academy-erp.ai.studio</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SIZ Supplied Sponsorship Pathways */}
            <div className="pt-6 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
                    SIZ Football Academy Sponsorship Tiers
                  </span>
                  <h4 className="text-xl font-extrabold text-slate-900 mt-0.5 font-['Plus_Jakarta_Sans',sans-serif]">
                    Supplied SIZ Sponsorship Pathways
                  </h4>
                </div>
                <p className="text-xs text-slate-500">
                  Selecting a pathway opens a formal sponsorship enquiry (no online payment is
                  processed on this site).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {sizPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:border-[#0F5132] transition-all shadow-sm"
                  >
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-50 text-[#0F5132] text-[10px] font-extrabold uppercase tracking-wider border border-emerald-200">
                        SIZ Pathway
                      </span>
                      <h5 className="text-base font-extrabold text-slate-900 mt-2">
                        {pkg.name}
                      </h5>
                      <div className="text-lg font-extrabold text-amber-700 font-mono mt-1 tabular-nums">
                        {pkg.amountLabel}
                      </div>
                      <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                        {pkg.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        onOpenSupportModal({
                          groupId: 'grp-siz-academy',
                          groupName: 'SIZ Football Academy',
                          supportType: 'Sponsor',
                          packageName: `${pkg.name} (${pkg.amountLabel})`,
                        })
                      }
                      className="mt-5 w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-[#0F5132] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Select {pkg.name}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-amber-300" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Distinct Profiles for EGYA Association and LeoLeo (With 5-Photo Galleries) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* EGYA Association Card */}
          <div className="bg-[#FAF9F6] rounded-3xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-sm">
            <div>
              {/* EGYA Visual Gallery Header */}
              <div className="relative h-52 bg-slate-900 overflow-hidden">
                <img
                  src={
                    egyaGallery[egyaActiveImgIdx] ||
                    siteMedia.egyaBannerImage ||
                    SACCO_GOVERNANCE_IMAGE
                  }
                  alt="EGYA Association Community Gallery"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent flex flex-col justify-between p-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-slate-950/80 text-amber-300 text-[10px] font-bold">
                      EGYA Gallery • {(egyaActiveImgIdx % egyaGallery.length) + 1}/{egyaGallery.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenGroupGalleryEditor('grp-egya')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-950/80 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-[10px] font-bold transition-colors cursor-pointer"
                    >
                      <Camera className="w-3 h-3" />
                      <span>Manage 5 Photos</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-md bg-emerald-100 text-[#0F5132] text-xs font-extrabold uppercase tracking-wider">
                      {egyaProfile?.programmeType || 'Savings & Youth Association'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/95 text-xs font-bold text-slate-900">
                      <Users className="w-3.5 h-3.5 text-[#0F5132]" />
                      <span>{egyaProfile?.memberCount ?? 51} Supplied Member Records</span>
                    </span>
                  </div>
                </div>
              </div>

              {egyaGallery.length > 1 && (
                <div className="grid grid-cols-5 gap-1.5 px-4 py-2 bg-white border-b border-slate-200">
                  {egyaGallery.map((imgUrl, idx) => (
                    <button
                      key={`${imgUrl}-${idx}`}
                      type="button"
                      onClick={() => setEgyaActiveImgIdx(idx)}
                      className={`h-10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        egyaActiveImgIdx === idx
                          ? 'border-[#0F5132]'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`EGYA thumbnail ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="p-6 sm:p-8 space-y-5">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                    {egyaProfile?.name || 'EGYA Association'}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0F5132]" />
                      {egyaProfile?.location || 'Entebbe, Uganda'}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-[#0F5132]" />
                      Rep:{' '}
                      <strong className="text-slate-800">
                        {egyaProfile?.representativeName || 'Mugisa Solomon Byakutaaga'}
                      </strong>{' '}
                      ({egyaProfile?.representativeTitle || 'Association Chairperson'})
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">{egyaProfile?.summary}</p>

                <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-2">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-[#0F5132]">
                    Project:{' '}
                    {egyaProfile?.projectName ||
                      'EGYA Livelihood & Collective Savings Strengthening'}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {egyaProfile?.projectDescription}
                  </p>
                  <div className="pt-2 text-xs text-slate-700">
                    <strong className="text-slate-900">Support Focus:</strong>{' '}
                    {egyaProfile?.supportFocus}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              {egyaProfile?.websiteUrl ? (
                <a
                  href={egyaProfile.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F5132] hover:underline"
                >
                  <span>Visit Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-xs text-slate-400 italic">
                  Official profile hosted on ENGANDA directory
                </span>
              )}

              <div className="flex flex-wrap items-center gap-2">
                {(['Sponsor', 'Invest', 'Partner'] as const).map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() =>
                      onOpenSupportModal({
                        groupId: 'grp-egya',
                        groupName: 'EGYA Association',
                        supportType: action,
                      })
                    }
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      action === 'Sponsor'
                        ? 'bg-[#0F5132] hover:bg-emerald-900 text-white'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                    }`}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* LeoLeo Programme Card */}
          <div className="bg-[#FAF9F6] rounded-3xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-sm">
            <div>
              {/* LeoLeo Visual Gallery Header */}
              <div className="relative h-52 bg-slate-900 overflow-hidden">
                <img
                  src={
                    leoleoGallery[leoleoActiveImgIdx] ||
                    siteMedia.leoleoBannerImage ||
                    BRIQUETTE_ENERGY_IMAGE
                  }
                  alt="LeoLeo Programme Gallery"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent flex flex-col justify-between p-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-slate-950/80 text-amber-300 text-[10px] font-bold">
                      LeoLeo Gallery • {(leoleoActiveImgIdx % leoleoGallery.length) + 1}/
                      {leoleoGallery.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenGroupGalleryEditor('grp-leoleo')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-950/80 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-[10px] font-bold transition-colors cursor-pointer"
                    >
                      <Camera className="w-3 h-3" />
                      <span>Manage 5 Photos</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-extrabold uppercase tracking-wider">
                      {leoleoProfile?.programmeType || 'Flagship Programme'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/95 text-xs font-bold text-slate-900">
                      <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                      <span>Enterprise & Skills Programme</span>
                    </span>
                  </div>
                </div>
              </div>

              {leoleoGallery.length > 1 && (
                <div className="grid grid-cols-5 gap-1.5 px-4 py-2 bg-white border-b border-slate-200">
                  {leoleoGallery.map((imgUrl, idx) => (
                    <button
                      key={`${imgUrl}-${idx}`}
                      type="button"
                      onClick={() => setLeoleoActiveImgIdx(idx)}
                      className={`h-10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        leoleoActiveImgIdx === idx
                          ? 'border-[#0F5132]'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`LeoLeo thumbnail ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="p-6 sm:p-8 space-y-5">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                    {leoleoProfile?.name || 'LeoLeo'}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0F5132]" />
                      {leoleoProfile?.location || 'Entebbe, Uganda'}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-[#0F5132]" />
                      Rep:{' '}
                      <strong className="text-slate-800">
                        {leoleoProfile?.representativeName || 'Ronnie Tumusiime'}
                      </strong>{' '}
                      ({leoleoProfile?.representativeTitle || 'Programme Coordinator'})
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">{leoleoProfile?.summary}</p>

                <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-2">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-[#0F5132]">
                    Project:{' '}
                    {leoleoProfile?.projectName ||
                      'LeoLeo Community Enterprise & Digital Coordination'}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {leoleoProfile?.projectDescription}
                  </p>
                  <div className="pt-2 text-xs text-slate-700">
                    <strong className="text-slate-900">Support Focus:</strong>{' '}
                    {leoleoProfile?.supportFocus}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <a
                href={leoleoProfile?.websiteUrl || 'https://leo-leo.ai.studio'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
              >
                <span>Visit LeoLeo (leo-leo.ai.studio)</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
              </a>

              <div className="flex flex-wrap items-center gap-2">
                {(['Sponsor', 'Invest', 'Partner'] as const).map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() =>
                      onOpenSupportModal({
                        groupId: 'grp-leoleo',
                        groupName: 'LeoLeo',
                        supportType: action,
                      })
                    }
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      action === 'Sponsor'
                        ? 'bg-[#0F5132] hover:bg-emerald-900 text-white'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                    }`}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
