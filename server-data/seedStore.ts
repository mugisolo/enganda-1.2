import fs from 'fs';
import path from 'path';

export type ProgrammeType =
  | 'Community SACCO'
  | 'Savings & Youth Association'
  | 'Cooperative & Trade Group'
  | 'Flagship Programme';

export interface SponsorshipPackage {
  id: string;
  name: string;
  amountLabel: string;
  description: string;
}

export interface SiteMediaSettings {
  heroBannerImage: string;
  aboutMissionImage: string;
  organiseStageImage: string;
  formaliseStageImage: string;
  growStageImage: string;
  humanCapacityImage: string;
  economicStructureImage: string;
  civicAgencyImage: string;
  sizStewardshipImage: string;
  egyaBannerImage: string;
  leoleoBannerImage: string;
  founderMugisaImage: string;
  founderRonnieImage: string;
}

export const PHOTO_ASSETS = {
  HERO: '/src/assets/images/hero_youth_artisan_uganda_1792553825150.jpg',
  TREE_PLANTING: '/src/assets/images/pillar_community_tree_planting_1792553825337.jpg',
  FOUNDER_MUGISA: '/src/assets/images/founder_mugisa_solomon_1792553824917.jpg',
  FOUNDER_RONNIE: '/src/assets/images/founder_ronnie_tumusiime_1792553825367.jpg',
  METAL_FAB: '/src/assets/images/impact_metal_fabrication_1792555422747.jpg',
  BRIQUETTE: '/src/assets/images/impact_briquette_clean_energy_1792555423381.jpg',
  WOMEN_TAILORING: '/src/assets/images/impact_women_tailoring_1792555423895.jpg',
  SACCO_GOVERNANCE: '/src/assets/images/sacco_savings_governance_1793954418840.jpg',
  AUTO_GARAGE: '/src/assets/images/automotive_garage_mechanics_1793954420824.jpg',
  FISHERIES: '/src/assets/images/lake_victoria_fisheries_cooperative_1793954423329.jpg',
  SIZ_FOOTBALL: '/src/assets/images/siz_youth_football_academy_1793954424368.jpg',
  CARPENTRY_FARMING: '/src/assets/images/youth_carpentry_urban_farming_1793954424672.jpg',
  SAFARI_LAKE: '/src/assets/images/enganda_safari_lake_victoria_1793956926137.jpg',
  SAFARI_ECOTOUR: '/src/assets/images/enganda_safari_uganda_ecotour_1793956926146.jpg',
};

export const INITIAL_SITE_MEDIA: SiteMediaSettings = {
  heroBannerImage: PHOTO_ASSETS.HERO,
  aboutMissionImage: PHOTO_ASSETS.SACCO_GOVERNANCE,
  organiseStageImage: PHOTO_ASSETS.CARPENTRY_FARMING,
  formaliseStageImage: PHOTO_ASSETS.SACCO_GOVERNANCE,
  growStageImage: PHOTO_ASSETS.FISHERIES,
  humanCapacityImage: PHOTO_ASSETS.AUTO_GARAGE,
  economicStructureImage: PHOTO_ASSETS.METAL_FAB,
  civicAgencyImage: PHOTO_ASSETS.WOMEN_TAILORING,
  sizStewardshipImage: PHOTO_ASSETS.TREE_PLANTING,
  egyaBannerImage: PHOTO_ASSETS.SACCO_GOVERNANCE,
  leoleoBannerImage: PHOTO_ASSETS.BRIQUETTE,
  founderMugisaImage: PHOTO_ASSETS.FOUNDER_MUGISA,
  founderRonnieImage: PHOTO_ASSETS.FOUNDER_RONNIE,
};

export interface NetworkGroupRecord {
  id: string;
  uniqueGroupCode: string;
  slug: string;
  name: string;
  programmeType: ProgrammeType;
  sector: string;
  companyAffiliation: string;
  isProgrammeOnly: boolean;
  location: string;
  mapCoords: { x: number; y: number; zone: string };
  summary: string;
  representativeName: string;
  representativeTitle: string;
  projectName: string;
  projectDescription: string;
  supportFocus: string;
  websiteUrl: string;
  activities?: string[];
  sponsorshipPackages?: SponsorshipPackage[];
  galleryImages: string[];
  updatedAt: string;
}

export interface PrivateMemberRecord {
  id: string;
  uniqueId: string;
  groupId: string;
  company: string;
  photoUrl: string;
  fullName: string;
  title: string;
  phone: string;
  email: string;
  nationalId: string;
  skills: string[];
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface GroupAdminAssignment {
  id: string;
  email: string;
  groupId: string;
  assignedBy: string;
  assignedAt: string;
}

export interface KnownUserAccount {
  email: string;
  uid: string;
  displayName: string;
  firstSignedInAt: string;
  lastSeenAt: string;
}

export interface SupportEnquiryRecord {
  id: string;
  reference: string;
  groupId: string;
  groupName: string;
  supportType: 'Sponsor' | 'Invest' | 'Partner';
  contactName: string;
  email: string;
  phone: string;
  organisation: string;
  packageName: string;
  message: string;
  consent: boolean;
  status: 'NEW' | 'IN_REVIEW' | 'RESPONDED';
  createdAt: string;
}

export interface NewsletterSubscriptionRecord {
  id: string;
  reference: string;
  email: string;
  name: string;
  organisation: string;
  consent: boolean;
  subscribedAt: string;
}

export type SafariEventCategory =
  | 'ENGANDA Safari & Eco-Trip'
  | 'Youth Sports & Gala'
  | 'SACCO & Enterprise Exchange'
  | 'Tree Stewardship & Conservation'
  | 'Community Cultural Expedition';

export interface SafariEventRecord {
  id: string;
  code: string;
  title: string;
  category: SafariEventCategory;
  dateLabel: string;
  durationLabel: string;
  location: string;
  feeOrSponsorshipLabel: string;
  organizer: string;
  summary: string;
  highlights: string[];
  imageUrl: string;
  showOnCarousel: boolean;
  showInUpcoming: boolean;
  ctaLabel: string;
  createdAt: string;
  updatedAt: string;
}

export interface PersistentStoreData {
  groups: NetworkGroupRecord[];
  members: PrivateMemberRecord[];
  assignments: GroupAdminAssignment[];
  knownUsers: KnownUserAccount[];
  enquiries: SupportEnquiryRecord[];
  enquirySequence: number;
  newsletterSubscriptions: NewsletterSubscriptionRecord[];
  newsletterSequence: number;
  siteMedia: SiteMediaSettings;
  safariEvents: SafariEventRecord[];
}

export function generateAvatarDataUri(fullName: string, index: number): string {
  const parts = String(fullName || 'EN')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const initials =
    parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : (parts[0]?.slice(0, 2) || 'EN').toUpperCase();
  const palettes = [
    { bg: '#0F5132', fg: '#FDE68A' },
    { bg: '#0B2B1E', fg: '#6EE7B7' },
    { bg: '#1E3A8A', fg: '#BFDBFE' },
    { bg: '#78350F', fg: '#FDE68A' },
    { bg: '#065F46', fg: '#FFFFFF' },
  ];
  const pal = palettes[index % palettes.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="${pal.bg}"/><circle cx="48" cy="48" r="44" fill="none" stroke="${pal.fg}" stroke-opacity="0.25" stroke-width="2"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="${pal.fg}" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="34">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_NETWORK_GROUPS: NetworkGroupRecord[] = [
  {
    id: 'grp-siz-academy',
    uniqueGroupCode: 'ENG-GRP-001',
    slug: 'siz-football-academy',
    name: 'SIZ Football Academy',
    programmeType: 'Flagship Programme',
    sector: 'Sports, Youth Development & Environmental Stewardship',
    companyAffiliation: 'SIZ Football Academy',
    isProgrammeOnly: true,
    location: 'Entebbe, Uganda',
    mapCoords: { x: 35, y: 66, zone: 'Entebbe Sports Hub' },
    summary:
      'A structured youth football, league competition, academic mentorship, and environmental stewardship programme operating within the ENGANDA network in Entebbe.',
    representativeName: 'Sulait Ibrahim',
    representativeTitle: 'Chief Executive Officer & Programme Lead',
    projectName: 'Plant a Tree, Plant a Player & Youth League Development',
    projectDescription:
      'Combines competitive youth football academies, the SIZ Football Gala, player development tracking, and the "Plant a Tree, Plant a Player" / "Sponsor a Tree" environmental stewardship initiative across Entebbe schools and pitches.',
    supportFocus:
      'Youth athlete bursaries, league pitch equipment, grassroots tournament sponsorship, and community tree-planting stewardship.',
    websiteUrl: 'https://siz-football-academy-erp.ai.studio',
    activities: [
      'Elite & Grassroots Youth Football Training Clinics (U-10 to U-17)',
      'SIZ Football Gala & Inter-Community Youth League Competitions',
      'Academic Bursaries, Life-Skills Mentorship & Player Welfare Tracking',
      'Environmental Stewardship: "Sponsor a Tree" & "Plant a Tree, Plant a Player"',
    ],
    sponsorshipPackages: [
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
    ],
    galleryImages: [
      PHOTO_ASSETS.SIZ_FOOTBALL,
      PHOTO_ASSETS.TREE_PLANTING,
      PHOTO_ASSETS.CARPENTRY_FARMING,
      PHOTO_ASSETS.SACCO_GOVERNANCE,
      PHOTO_ASSETS.HERO,
    ],
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'grp-leoleo',
    uniqueGroupCode: 'ENG-GRP-002',
    slug: 'leoleo',
    name: 'LeoLeo',
    programmeType: 'Flagship Programme',
    sector: 'Enterprise Innovation & Digital Skills',
    companyAffiliation: 'LeoLeo Enterprise',
    isProgrammeOnly: true,
    location: 'Entebbe, Uganda',
    mapCoords: { x: 41, y: 42, zone: 'Entebbe Innovation Hub' },
    summary:
      'A distinct community innovation, enterprise coordination, and youth skills mobilization programme operating within the ENGANDA network.',
    representativeName: 'Ronnie Tumusiime',
    representativeTitle: 'Programme Coordinator',
    projectName: 'LeoLeo Community Enterprise & Digital Coordination',
    projectDescription:
      'Connects young creatives, local service providers, and community micro-enterprises to structured operational workflows, digital visibility, and market linkages.',
    supportFocus:
      'Enterprise incubation tooling, vocational mentorship partnerships, and community market-access initiatives.',
    websiteUrl: 'https://leo-leo.ai.studio',
    activities: [
      'Micro-Enterprise Workflow Structuring & Digital Visibility',
      'Youth Livelihood Skills & Service Readiness Coordination',
      'Cross-Group Commercial Collaboration & Partner Linkages',
    ],
    galleryImages: [
      PHOTO_ASSETS.BRIQUETTE,
      PHOTO_ASSETS.CARPENTRY_FARMING,
      PHOTO_ASSETS.WOMEN_TAILORING,
      PHOTO_ASSETS.SACCO_GOVERNANCE,
      PHOTO_ASSETS.HERO,
    ],
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'grp-egya',
    uniqueGroupCode: 'ENG-GRP-003',
    slug: 'egya-association',
    name: 'EGYA Association',
    programmeType: 'Savings & Youth Association',
    sector: 'Collective Savings & Vocational Livelihoods',
    companyAffiliation: 'EGYA Youth Enterprise',
    isProgrammeOnly: false,
    location: 'Entebbe, Uganda',
    mapCoords: { x: 43, y: 60, zone: 'Entebbe Central' },
    summary:
      'A distinct youth and community association in Entebbe organizing 51 registered members around collective savings, vocational livelihoods, and peer accountability.',
    representativeName: 'Mugisa Solomon Byakutaaga',
    representativeTitle: 'Association Chairperson',
    projectName: 'EGYA Livelihood & Collective Savings Strengthening',
    projectDescription:
      'Structured member savings governance, vocational trade coordination, and formal enterprise readiness for 51 active youth and community members in Entebbe.',
    supportFocus:
      'Working capital co-investment, vocational equipment access, and group governance training.',
    websiteUrl: '',
    activities: [
      'Weekly Member Savings & Internal Credit Administration',
      'Vocational Trade Clustering & Peer Mentorship',
      'Community Civic Leadership & Group Formalization',
    ],
    galleryImages: [
      PHOTO_ASSETS.SACCO_GOVERNANCE,
      PHOTO_ASSETS.HERO,
      PHOTO_ASSETS.CARPENTRY_FARMING,
      PHOTO_ASSETS.TREE_PLANTING,
      PHOTO_ASSETS.METAL_FAB,
    ],
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'grp-abayita-ababiri',
    uniqueGroupCode: 'ENG-GRP-004',
    slug: 'abayita-ababiri-ghetto-group',
    name: 'Abayita Ababiri Ghetto Group',
    programmeType: 'Savings & Youth Association',
    sector: 'Artisanal Trade & Technical Services',
    companyAffiliation: 'Abayita Ababiri Artisan Collective',
    isProgrammeOnly: false,
    location: 'Abayita Ababiri, Entebbe',
    mapCoords: { x: 64, y: 24, zone: 'Abayita Ababiri' },
    summary:
      'Community youth group in Abayita Ababiri uniting 53 informal sector workers into a structured savings and livelihood unit.',
    representativeName: 'Brian Okello',
    representativeTitle: 'Group Chairperson',
    projectName: 'Abayita Ababiri Artisan & Trade Hub',
    projectDescription:
      'Organizes young technicians, market vendors, and transport workers in Abayita Ababiri into a disciplined savings and shared-tooling collective.',
    supportFocus:
      'Shared technical toolkits, financial literacy, and micro-enterprise credit readiness.',
    websiteUrl: '',
    galleryImages: [
      PHOTO_ASSETS.HERO,
      PHOTO_ASSETS.METAL_FAB,
      PHOTO_ASSETS.AUTO_GARAGE,
      PHOTO_ASSETS.SACCO_GOVERNANCE,
      PHOTO_ASSETS.CARPENTRY_FARMING,
    ],
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'grp-baghdad',
    uniqueGroupCode: 'ENG-GRP-005',
    slug: 'baghdad-association-group',
    name: 'Baghdad Association Group',
    programmeType: 'Savings & Youth Association',
    sector: 'Urban Trade & Youth Savings',
    companyAffiliation: 'Baghdad Trade Collective',
    isProgrammeOnly: false,
    location: 'Entebbe, Uganda',
    mapCoords: { x: 46, y: 55, zone: 'Entebbe Central' },
    summary:
      'Urban youth association in Entebbe bringing together 36 members for structured group savings, trade skills, and community welfare.',
    representativeName: 'Hassan Kigozi',
    representativeTitle: 'Association Leader',
    projectName: 'Baghdad Youth Livelihood & Welfare Fund',
    projectDescription:
      'Supports informal youth transition into documented commercial trades through collective savings discipline and peer-backed micro-loans.',
    supportFocus: 'Vocational apprenticeships, trade licensing support, and group capital growth.',
    websiteUrl: '',
    galleryImages: [
      PHOTO_ASSETS.CARPENTRY_FARMING,
      PHOTO_ASSETS.SACCO_GOVERNANCE,
      PHOTO_ASSETS.SIZ_FOOTBALL,
      PHOTO_ASSETS.HERO,
      PHOTO_ASSETS.BRIQUETTE,
    ],
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'grp-bep-auto',
    uniqueGroupCode: 'ENG-GRP-006',
    slug: 'bep-auto-garage-savings',
    name: 'BEP Auto Garage Savings',
    programmeType: 'Cooperative & Trade Group',
    sector: 'Automotive Mechanics & Engineering',
    companyAffiliation: 'BEP Auto Garage',
    isProgrammeOnly: false,
    location: 'Entebbe, Uganda',
    mapCoords: { x: 50, y: 48, zone: 'Entebbe Central' },
    summary:
      'Specialized occupational savings group of 32 automotive mechanics, panel beaters, and garage technicians in Entebbe.',
    representativeName: 'Geoffrey Wasswa',
    representativeTitle: 'Master Mechanic & Chairperson',
    projectName: 'BEP Shared Diagnostic & Garage Equipment Pool',
    projectDescription:
      'Pools daily workshop earnings from 32 mechanics to acquire modern vehicle diagnostic tools, compressors, and spare-parts inventory.',
    supportFocus: 'Automotive diagnostic equipment, workshop safety gear, and asset financing.',
    websiteUrl: '',
    galleryImages: [
      PHOTO_ASSETS.AUTO_GARAGE,
      PHOTO_ASSETS.METAL_FAB,
      PHOTO_ASSETS.SACCO_GOVERNANCE,
      PHOTO_ASSETS.HERO,
      PHOTO_ASSETS.BRIQUETTE,
    ],
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'grp-ghetto-women',
    uniqueGroupCode: 'ENG-GRP-007',
    slug: 'entebbe-ghetto-women-association',
    name: 'Entebbe Ghetto Women Association',
    programmeType: 'Savings & Youth Association',
    sector: 'Women Enterprise, Tailoring & Value-Addition',
    companyAffiliation: 'Entebbe Women Enterprise Hub',
    isProgrammeOnly: false,
    location: 'Entebbe, Uganda',
    mapCoords: { x: 48, y: 63, zone: 'Entebbe Central' },
    summary:
      'Women-led community association of 23 members advancing female entrepreneurship, tailoring, food processing, and household financial resilience.',
    representativeName: 'Sarah Babirye',
    representativeTitle: 'Women Chairperson',
    projectName: 'Women Enterprise & Value-Addition Collective',
    projectDescription:
      'Equips young women and mothers in Entebbe with commercial tailoring, catering, and retail trade capital backed by structured group bookkeeping.',
    supportFocus:
      'Sewing and processing machinery, business skills training, and women-led micro-grants.',
    websiteUrl: '',
    galleryImages: [
      PHOTO_ASSETS.WOMEN_TAILORING,
      PHOTO_ASSETS.SACCO_GOVERNANCE,
      PHOTO_ASSETS.CARPENTRY_FARMING,
      PHOTO_ASSETS.BRIQUETTE,
      PHOTO_ASSETS.HERO,
    ],
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'grp-guda-sacco',
    uniqueGroupCode: 'ENG-GRP-008',
    slug: 'entebbe-guda-community-sacco',
    name: 'Entebbe GUDA Community SACCO',
    programmeType: 'Community SACCO',
    sector: 'Microfinance & Community SACCO',
    companyAffiliation: 'GUDA Community SACCO',
    isProgrammeOnly: false,
    location: 'Entebbe, Uganda',
    mapCoords: { x: 54, y: 57, zone: 'Entebbe Central' },
    summary:
      'Community savings and credit cooperative uniting 57 members in Entebbe to build formal credit histories and enterprise working capital.',
    representativeName: 'David Ssempijja',
    representativeTitle: 'SACCO Chairperson',
    projectName: 'GUDA Micro-Enterprise Revolving Credit Facility',
    projectDescription:
      'Provides structured savings accounts and low-interest working capital loans to 57 local traders, fabricators, and service operators.',
    supportFocus:
      'SACCO capitalization, digital ledger administration, and commercial bank linkage.',
    websiteUrl: '',
    galleryImages: [
      PHOTO_ASSETS.SACCO_GOVERNANCE,
      PHOTO_ASSETS.METAL_FAB,
      PHOTO_ASSETS.WOMEN_TAILORING,
      PHOTO_ASSETS.CARPENTRY_FARMING,
      PHOTO_ASSETS.HERO,
    ],
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'grp-island-sacco',
    uniqueGroupCode: 'ENG-GRP-009',
    slug: 'entebbe-island-ghetto-sacco',
    name: 'Entebbe Island Ghetto SACCO',
    programmeType: 'Community SACCO',
    sector: 'Fisheries, Marine Transport & Cold-Chain SACCO',
    companyAffiliation: 'Entebbe Island Marine Cooperative',
    isProgrammeOnly: false,
    location: 'Entebbe Island, Uganda',
    mapCoords: { x: 26, y: 82, zone: 'Entebbe Island' },
    summary:
      'High-membership community SACCO of 102 fisherfolk, boat artisans, fish processors, and lakeside traders in Entebbe Island.',
    representativeName: 'Ivan Mukasa',
    representativeTitle: 'SACCO Chairperson',
    projectName: 'Lakeshore Fisheries & Cold-Chain Cooperative',
    projectDescription:
      'Mobilizes 102 lakeside workers to finance solar fish drying racks, cold-storage boxes, outboard engine maintenance, and safe marine transport.',
    supportFocus: 'Solar cold-chain equipment, marine safety gear, and cooperative credit lines.',
    websiteUrl: '',
    galleryImages: [
      PHOTO_ASSETS.FISHERIES,
      PHOTO_ASSETS.SACCO_GOVERNANCE,
      PHOTO_ASSETS.CARPENTRY_FARMING,
      PHOTO_ASSETS.AUTO_GARAGE,
      PHOTO_ASSETS.HERO,
    ],
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'grp-gaza-sacco',
    uniqueGroupCode: 'ENG-GRP-010',
    slug: 'gaza-ghetto-sacco',
    name: 'Gaza Ghetto SACCO',
    programmeType: 'Community SACCO',
    sector: 'Micro-Retail & Seed Credit SACCO',
    companyAffiliation: 'Gaza Micro-Trade SACCO',
    isProgrammeOnly: false,
    location: 'Entebbe, Uganda',
    mapCoords: { x: 39, y: 52, zone: 'Entebbe Central' },
    summary:
      'Focused youth savings cooperative of 13 members in Entebbe building foundational capital discipline and formal trade identity.',
    representativeName: 'Moses Kato',
    representativeTitle: 'SACCO Coordinator',
    projectName: 'Gaza Youth Micro-Trade Seed Pool',
    projectDescription:
      'Enables 13 young urban workers to transition from daily casual labor into owned retail kiosks and mobile service units.',
    supportFocus: 'Seed working capital, foundational bookkeeping, and vocational mentorship.',
    websiteUrl: '',
    galleryImages: [
      PHOTO_ASSETS.SACCO_GOVERNANCE,
      PHOTO_ASSETS.BRIQUETTE,
      PHOTO_ASSETS.HERO,
      PHOTO_ASSETS.WOMEN_TAILORING,
      PHOTO_ASSETS.CARPENTRY_FARMING,
    ],
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'grp-kinazi-katabi',
    uniqueGroupCode: 'ENG-GRP-011',
    slug: 'kinazi-ghetto-katabi-saving-association',
    name: 'Kinazi Ghetto Katabi Saving Association',
    programmeType: 'Savings & Youth Association',
    sector: 'Construction, Fabrication & Briquette Energy',
    companyAffiliation: 'Kinazi Katabi Fabrication Cluster',
    isProgrammeOnly: false,
    location: 'Kinazi, Katabi',
    mapCoords: { x: 70, y: 34, zone: 'Kinazi, Katabi' },
    summary:
      'Community savings association in Kinazi, Katabi Town Council with 58 active members engaged in construction, fabrication, and retail trade.',
    representativeName: 'Grace Nalubega',
    representativeTitle: 'Association Chairperson',
    projectName: 'Kinazi Katabi Vocational & Savings Cluster',
    projectDescription:
      'Coordinates weekly savings collections and equipment-sharing pools for 58 youth and community entrepreneurs across Kinazi and Katabi.',
    supportFocus: 'Briquette & construction tooling, financial literacy, and market linkage.',
    websiteUrl: '',
    galleryImages: [
      PHOTO_ASSETS.BRIQUETTE,
      PHOTO_ASSETS.METAL_FAB,
      PHOTO_ASSETS.SACCO_GOVERNANCE,
      PHOTO_ASSETS.CARPENTRY_FARMING,
      PHOTO_ASSETS.HERO,
    ],
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'grp-kitinda-coop',
    uniqueGroupCode: 'ENG-GRP-012',
    slug: 'kitinda-cooperative-group',
    name: 'Kitinda Cooperative Group',
    programmeType: 'Cooperative & Trade Group',
    sector: 'Urban Agriculture, Carpentry & Multi-Trade Cooperative',
    companyAffiliation: 'Kitinda Nkumba Cooperative',
    isProgrammeOnly: false,
    location: 'Kitinda, Nkumba',
    mapCoords: { x: 59, y: 31, zone: 'Kitinda, Nkumba' },
    summary:
      'Multi-trade cooperative group in Kitinda, Nkumba organizing 57 members in urban agriculture, carpentry, masonry, and produce supply.',
    representativeName: 'Simon Peter Kazibwe',
    representativeTitle: 'Cooperative Chairperson',
    projectName: 'Kitinda Nkumba Cooperative Enterprise Hub',
    projectDescription:
      'Aggregates purchasing and production capacity for 57 cooperative members serving the Nkumba university and residential corridor.',
    supportFocus:
      'Carpentry & masonry equipment, bulk input financing, and cooperative governance.',
    websiteUrl: '',
    galleryImages: [
      PHOTO_ASSETS.CARPENTRY_FARMING,
      PHOTO_ASSETS.TREE_PLANTING,
      PHOTO_ASSETS.METAL_FAB,
      PHOTO_ASSETS.SACCO_GOVERNANCE,
      PHOTO_ASSETS.HERO,
    ],
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'grp-lunyo-east',
    uniqueGroupCode: 'ENG-GRP-013',
    slug: 'lunyo-east-ghetto-life-association',
    name: 'Lunyo East Ghetto Life Association',
    programmeType: 'Savings & Youth Association',
    sector: 'Vocational Apprenticeships & Service Contracting',
    companyAffiliation: 'Lunyo East Youth Enterprises',
    isProgrammeOnly: false,
    location: 'Lunyo East, Entebbe',
    mapCoords: { x: 58, y: 68, zone: 'Lunyo East' },
    summary:
      'Large community youth association of 82 members in Lunyo East focused on livelihood skills, savings mobilization, and civic responsibility.',
    representativeName: 'Samuel Lule',
    representativeTitle: 'Association Chairperson',
    projectName: 'Lunyo East Youth Skills & Enterprise Upgrading',
    projectDescription:
      'Supports 82 members in Lunyo East through structured apprenticeship placements, weekly savings circles, and group contract bidding.',
    supportFocus:
      'Technical skills training, group toolbanks, and institutional contract readiness.',
    websiteUrl: '',
    galleryImages: [
      PHOTO_ASSETS.METAL_FAB,
      PHOTO_ASSETS.AUTO_GARAGE,
      PHOTO_ASSETS.SIZ_FOOTBALL,
      PHOTO_ASSETS.SACCO_GOVERNANCE,
      PHOTO_ASSETS.HERO,
    ],
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'grp-peace-rock',
    uniqueGroupCode: 'ENG-GRP-014',
    slug: 'peace-rock-sacco',
    name: 'Peace Rock SACCO',
    programmeType: 'Community SACCO',
    sector: 'Market Trade & Inventory Finance SACCO',
    companyAffiliation: 'Peace Rock Market SACCO',
    isProgrammeOnly: false,
    location: 'Entebbe, Uganda',
    mapCoords: { x: 44, y: 46, zone: 'Entebbe Central' },
    summary:
      'Savings and credit cooperative of 28 members in Entebbe promoting disciplined member deposits and small-business growth.',
    representativeName: 'Patricia Nakato',
    representativeTitle: 'SACCO Chairperson',
    projectName: 'Peace Rock Small-Business Growth Fund',
    projectDescription:
      'Provides reliable short-term inventory and equipment financing to 28 vetted members operating in Entebbe central markets.',
    supportFocus:
      'Revolving loan capital, digital record-keeping, and commercial banking integration.',
    websiteUrl: '',
    galleryImages: [
      PHOTO_ASSETS.WOMEN_TAILORING,
      PHOTO_ASSETS.SACCO_GOVERNANCE,
      PHOTO_ASSETS.CARPENTRY_FARMING,
      PHOTO_ASSETS.FISHERIES,
      PHOTO_ASSETS.HERO,
    ],
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'grp-twezimbe-sacco',
    uniqueGroupCode: 'ENG-GRP-015',
    slug: 'twezimbe-sacco',
    name: 'Twezimbe SACCO',
    programmeType: 'Community SACCO',
    sector: 'Transport, Wholesale Trade & Asset Finance SACCO',
    companyAffiliation: 'Twezimbe SACCO & SIZ Partner Network',
    isProgrammeOnly: false,
    location: 'Entebbe, Uganda',
    mapCoords: { x: 52, y: 64, zone: 'Entebbe Central' },
    summary:
      'Major community SACCO in Entebbe uniting 98 members across transport, market trade, and artisanal services under formal cooperative governance.',
    representativeName: 'Hellen Namutebi',
    representativeTitle: 'SACCO Chairperson',
    projectName: 'Twezimbe Collective Asset & Trade Expansion',
    projectDescription:
      'Mobilizes savings from 98 active members to finance productive assets, wholesale market inventory, and emergency household resilience.',
    supportFocus:
      'Asset-finance co-funding, SACCO governance strengthening, and institutional partnerships.',
    websiteUrl: '',
    galleryImages: [
      PHOTO_ASSETS.SACCO_GOVERNANCE,
      PHOTO_ASSETS.AUTO_GARAGE,
      PHOTO_ASSETS.FISHERIES,
      PHOTO_ASSETS.WOMEN_TAILORING,
      PHOTO_ASSETS.HERO,
    ],
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
];

export const SUPPLIED_GROUP_MEMBER_COUNTS = [
  {
    groupId: 'grp-abayita-ababiri',
    count: 53,
    location: 'Abayita Ababiri, Entebbe',
    leaderName: 'Brian Okello',
    leaderTitle: 'Group Chairperson',
    defaultCompany: 'Abayita Ababiri Artisan Hub',
    skillPool: [
      'Electrical Installation',
      'Motorcycle Mechanics',
      'Market Retail',
      'Welding & Fabrication',
      'Financial Bookkeeping',
    ],
  },
  {
    groupId: 'grp-baghdad',
    count: 36,
    location: 'Entebbe, Uganda',
    leaderName: 'Hassan Kigozi',
    leaderTitle: 'Association Leader',
    defaultCompany: 'Baghdad Trade Collective / SIZ Partner',
    skillPool: [
      'Urban Retail Trade',
      'Carpentry & Joinery',
      'Mobile Money Operations',
      'Sports Coaching & Mentorship',
      'Inventory Management',
    ],
  },
  {
    groupId: 'grp-bep-auto',
    count: 32,
    location: 'Entebbe, Uganda',
    leaderName: 'Geoffrey Wasswa',
    leaderTitle: 'Master Mechanic & Chairperson',
    defaultCompany: 'BEP Auto Garage',
    skillPool: [
      'Automotive Engine Diagnostics',
      'Panel Beating & Spray Painting',
      'Auto Electrical Systems',
      'Hydraulic & Brake Servicing',
      'Workshop Safety Management',
    ],
  },
  {
    groupId: 'grp-egya',
    count: 51,
    location: 'Entebbe, Uganda',
    leaderName: 'Mugisa Solomon Byakutaaga',
    leaderTitle: 'Association Chairperson',
    defaultCompany: 'EGYA Association / SIZ Football Academy',
    skillPool: [
      'Cooperative Governance',
      'Financial Literacy & Auditing',
      'Youth Leadership & Mentorship',
      'Digital Enterprise Coordination',
      'Environmental Stewardship',
    ],
  },
  {
    groupId: 'grp-ghetto-women',
    count: 23,
    location: 'Entebbe, Uganda',
    leaderName: 'Sarah Babirye',
    leaderTitle: 'Women Chairperson',
    defaultCompany: 'Entebbe Women Enterprise Hub',
    skillPool: [
      'Commercial Tailoring & Garment Design',
      'Catering & Food Processing',
      'Value-Addition Packaging',
      'SACCO Ledger Bookkeeping',
      'Retail Merchandising',
    ],
  },
  {
    groupId: 'grp-guda-sacco',
    count: 57,
    location: 'Entebbe, Uganda',
    leaderName: 'David Ssempijja',
    leaderTitle: 'SACCO Chairperson',
    defaultCompany: 'GUDA Community SACCO',
    skillPool: [
      'Microfinance Credit Assessment',
      'Metal Fabrication',
      'Retail & Wholesale Trade',
      'Digital Ledger Administration',
      'Small Business Accounting',
    ],
  },
  {
    groupId: 'grp-island-sacco',
    count: 102,
    location: 'Entebbe Island, Uganda',
    leaderName: 'Ivan Mukasa',
    leaderTitle: 'SACCO Chairperson',
    defaultCompany: 'Entebbe Island Marine Cooperative',
    skillPool: [
      'Sustainable Fisheries & Cold-Chain',
      'Solar Drying & Fish Processing',
      'Outboard Marine Engine Repair',
      'Boat Artisan & Carpentry',
      'Lakeshore Trade Logistics',
    ],
  },
  {
    groupId: 'grp-gaza-sacco',
    count: 13,
    location: 'Entebbe, Uganda',
    leaderName: 'Moses Kato',
    leaderTitle: 'SACCO Coordinator',
    defaultCompany: 'Gaza Micro-Trade SACCO',
    skillPool: [
      'Kiosk Retail Operations',
      'Mobile Commerce & Agency Banking',
      'Basic Bookkeeping',
      'Customer Service',
    ],
  },
  {
    groupId: 'grp-kinazi-katabi',
    count: 58,
    location: 'Kinazi, Katabi',
    leaderName: 'Grace Nalubega',
    leaderTitle: 'Association Chairperson',
    defaultCompany: 'Kinazi Katabi Fabrication Cluster',
    skillPool: [
      'Eco-Briquette Production',
      'Masonry & Construction',
      'Steel Window & Door Fabrication',
      'Group Savings Administration',
      'Solar Home System Installation',
    ],
  },
  {
    groupId: 'grp-kitinda-coop',
    count: 57,
    location: 'Kitinda, Nkumba',
    leaderName: 'Simon Peter Kazibwe',
    leaderTitle: 'Cooperative Chairperson',
    defaultCompany: 'Kitinda Nkumba Cooperative / LeoLeo',
    skillPool: [
      'Urban Agribusiness & Horticulture',
      'Furniture Carpentry & Joinery',
      'Masonry & Plumbing',
      'Bulk Produce Supply Chain',
      'Cooperative Marketing',
    ],
  },
  {
    groupId: 'grp-lunyo-east',
    count: 82,
    location: 'Lunyo East, Entebbe',
    leaderName: 'Samuel Lule',
    leaderTitle: 'Association Chairperson',
    defaultCompany: 'Lunyo East Youth Enterprises / SIZ',
    skillPool: [
      'Electrical & Solar Wiring',
      'Plumbing & Pipe Fitting',
      'Youth Sports & Environmental Drives',
      'Contract Bidding & Procurement',
      'Welding & Metalwork',
    ],
  },
  {
    groupId: 'grp-peace-rock',
    count: 28,
    location: 'Entebbe, Uganda',
    leaderName: 'Patricia Nakato',
    leaderTitle: 'SACCO Chairperson',
    defaultCompany: 'Peace Rock Market SACCO',
    skillPool: [
      'Market Produce & Commodity Trade',
      'Revolving Loan Management',
      'Digital Bookkeeping',
      'Agro-Produce Grading',
    ],
  },
  {
    groupId: 'grp-twezimbe-sacco',
    count: 98,
    location: 'Entebbe, Uganda',
    leaderName: 'Hellen Namutebi',
    leaderTitle: 'SACCO Chairperson',
    defaultCompany: 'Twezimbe SACCO / SIZ Partner Network',
    skillPool: [
      'Commercial Transport & Logistics',
      'Wholesale Market Distribution',
      'Asset Finance & SACCO Governance',
      'Equipment Maintenance',
      'Enterprise Risk Management',
    ],
  },
];

const UGANDAN_FIRST_NAMES = [
  'Ronald', 'Joseph', 'Emmanuel', 'Daniel', 'Isaac', 'Charles', 'Peter', 'Paul', 'Stephen', 'Kenneth',
  'Richard', 'Robert', 'Patrick', 'Francis', 'Denis', 'Alex', 'Martin', 'Julius', 'Nicholas', 'Henry',
  'Grace', 'Prossy', 'Florence', 'Annet', 'Sylvia', 'Brenda', 'Juliet', 'Harriet', 'Esther', 'Rebecca',
  'Irene', 'Joan', 'Winnie', 'Faridah', 'Aisha', 'Zahara', 'Shafiq', 'Sulaiman', 'Ibrahim', 'Twaha',
  'Hakim', 'Juma', 'Rashid', 'Mariam', 'Hadijah', 'Shamilah', 'Doreen', 'Lillian', 'Agnes', 'Moses',
];

const UGANDAN_SURNAMES = [
  'Ssemakula', 'Nsubuga', 'Kasozi', 'Muwanga', 'Ssali', 'Lubega', 'Kato', 'Wasswa', 'Babirye', 'Nakato',
  'Namukasa', 'Nantume', 'Kiggundu', 'Ssebaggala', 'Mayanja', 'Mukiibi', 'Lukwago', 'Bukenya', 'Ssekandi', 'Mutebi',
  'Byaruhanga', 'Tumwine', 'Mugisha', 'Asiimwe', 'Kansiime', 'Ocen', 'Opio', 'Odongo', 'Akello', 'Auma',
  'Wandera', 'Wafula', 'Nabwire', 'Bwire', 'Kiwanuka', 'Ssentongo', 'Kyagulanyi', 'Nambooze', 'Nankya', 'Kabuye',
];

const MEMBER_ROLES = [
  'Vice Chairperson',
  'General Secretary',
  'Treasurer',
  'Publicity Secretary',
  'Defense & Discipline Officer',
  'Committee Member',
  'Registered Member',
];

export function buildInitialSuppliedMembers(): PrivateMemberRecord[] {
  const records: PrivateMemberRecord[] = [];
  let globalIdx = 1;

  for (const spec of SUPPLIED_GROUP_MEMBER_COUNTS) {
    for (let i = 0; i < spec.count; i++) {
      const isLeader = i === 0;
      const firstName = UGANDAN_FIRST_NAMES[(globalIdx * 7 + i * 3) % UGANDAN_FIRST_NAMES.length];
      const surname = UGANDAN_SURNAMES[(globalIdx * 11 + i * 5) % UGANDAN_SURNAMES.length];
      const middleInitial = String.fromCharCode(65 + (globalIdx % 26));

      const fullName = isLeader
        ? spec.leaderName
        : `${firstName} ${surname} ${middleInitial}${globalIdx}`;

      const title = isLeader
        ? spec.leaderTitle
        : i <= 4
        ? MEMBER_ROLES[i - 1]
        : 'Registered Member';

      const phoneSuffix = String(100000 + globalIdx).slice(-6);
      const prefix = globalIdx % 2 === 0 ? '772' : '701';
      const phone = `+256${prefix}${phoneSuffix}`;

      const cleanSlug = fullName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '.')
        .replace(/^\.|\.$/g, '');
      const email = `${cleanSlug}@members.enganda.org`;

      const ninPrefix = globalIdx % 2 === 0 ? 'CM' : 'CF';
      const ninDigits = String(900000000000 + globalIdx * 137).slice(0, 12);
      const nationalId = `${ninPrefix}${ninDigits}`;

      const uniqueId = `ENG-MEM-${String(globalIdx).padStart(4, '0')}`;
      const skill1 = spec.skillPool[i % spec.skillPool.length].trim();
      const skill2 = spec.skillPool[(i + 2) % spec.skillPool.length].trim();
      const skills = skill1 === skill2 ? [skill1] : [skill1, skill2];

      const company =
        i % 5 === 0
          ? 'SIZ Football Academy'
          : i % 7 === 0
          ? 'LeoLeo Enterprise'
          : spec.defaultCompany;

      records.push({
        id: `mem-${String(globalIdx).padStart(4, '0')}`,
        uniqueId,
        groupId: spec.groupId,
        company,
        photoUrl: generateAvatarDataUri(fullName, globalIdx),
        fullName,
        title,
        phone,
        email,
        nationalId,
        skills,
        location: spec.location,
        createdAt: '2026-11-01T00:00:00.000Z',
        updatedAt: '2026-11-01T00:00:00.000Z',
      });

      globalIdx++;
    }
  }

  return records;
}

const STORE_FILE_PATH = path.resolve(process.cwd(), '.enganda-persistent-store.json');

export function saveStore(data: PersistentStoreData): void {
  try {
    fs.writeFileSync(STORE_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('[ENGANDA Store] Failed to persist store:', err);
  }
}

export function loadOrInitializeStore(): PersistentStoreData {
  try {
    if (fs.existsSync(STORE_FILE_PATH)) {
      const raw = fs.readFileSync(STORE_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw) as PersistentStoreData;
      if (
        parsed &&
        Array.isArray(parsed.groups) &&
        parsed.groups.length === 15 &&
        Array.isArray(parsed.members) &&
        parsed.members.length > 0
      ) {
        if (!Array.isArray(parsed.newsletterSubscriptions)) {
          parsed.newsletterSubscriptions = [];
          parsed.newsletterSequence = 0;
        }
        parsed.siteMedia = {
          ...INITIAL_SITE_MEDIA,
          ...(parsed.siteMedia || {}),
        };
        const initialGroupMap = new Map(INITIAL_NETWORK_GROUPS.map((g) => [g.id, g]));
        parsed.groups = parsed.groups.map((g, idx) => {
          const fallback = initialGroupMap.get(g.id);
          return {
            ...g,
            uniqueGroupCode:
              g.uniqueGroupCode ||
              fallback?.uniqueGroupCode ||
              `ENG-GRP-${String(idx + 1).padStart(3, '0')}`,
            sector: g.sector || fallback?.sector || g.programmeType,
            companyAffiliation:
              g.companyAffiliation || fallback?.companyAffiliation || g.name,
            galleryImages:
              Array.isArray(g.galleryImages) && g.galleryImages.length > 0
                ? g.galleryImages.slice(0, 5)
                : fallback?.galleryImages || [
                    PHOTO_ASSETS.SACCO_GOVERNANCE,
                    PHOTO_ASSETS.HERO,
                    PHOTO_ASSETS.CARPENTRY_FARMING,
                  ],
            mapCoords:
              g.mapCoords && g.mapCoords.x <= 100
                ? g.mapCoords
                : fallback?.mapCoords || { x: 46, y: 55, zone: 'Entebbe Central' },
          };
        });

        const groupSpecMap = new Map(
          SUPPLIED_GROUP_MEMBER_COUNTS.map((s) => [s.groupId, s])
        );
        parsed.members = parsed.members.map((m, idx) => {
          const spec = groupSpecMap.get(m.groupId);
          const defaultSkills = spec
            ? [
                spec.skillPool[idx % spec.skillPool.length].trim(),
                spec.skillPool[(idx + 2) % spec.skillPool.length].trim(),
              ]
            : ['Group Savings', 'Enterprise Trade'];
          return {
            ...m,
            uniqueId: m.uniqueId || `ENG-MEM-${String(idx + 1).padStart(4, '0')}`,
            company:
              m.company ||
              (idx % 5 === 0
                ? 'SIZ Football Academy'
                : spec?.defaultCompany || 'ENGANDA Network'),
            photoUrl: m.photoUrl || generateAvatarDataUri(m.fullName, idx + 1),
            skills:
              Array.isArray(m.skills) && m.skills.length > 0
                ? m.skills
                : Array.from(new Set(defaultSkills)),
          };
        });

        if (!Array.isArray(parsed.safariEvents) || parsed.safariEvents.length === 0) {
          parsed.safariEvents = INITIAL_SAFARI_EVENTS;
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error('[ENGANDA Store] Error loading store file, re-initializing:', err);
  }

  const initialStore: PersistentStoreData = {
    groups: INITIAL_NETWORK_GROUPS,
    members: buildInitialSuppliedMembers(),
    assignments: [],
    knownUsers: [
      {
        email: 'mugisolo@gmail.com',
        uid: 'admin-mugisolo',
        displayName: 'Mugisa Solomon Byakutaaga',
        firstSignedInAt: '2026-11-01T00:00:00.000Z',
        lastSeenAt: '2026-11-05T00:00:00.000Z',
      },
    ],
    enquiries: [],
    enquirySequence: 0,
    newsletterSubscriptions: [],
    newsletterSequence: 0,
    siteMedia: INITIAL_SITE_MEDIA,
    safariEvents: INITIAL_SAFARI_EVENTS,
  };

  saveStore(initialStore);
  return initialStore;
}

export const INITIAL_SAFARI_EVENTS: SafariEventRecord[] = [
  {
    id: 'saf-lake-victoria-ssese',
    code: 'SAF-2025-01',
    title: 'ENGANDA Safaris: Lake Victoria & Ssese Islands Eco-Cultural Expedition',
    category: 'ENGANDA Safari & Eco-Trip',
    dateLabel: 'June 14 – June 16, 2025',
    durationLabel: '3 Days / 2 Nights',
    location: 'Nakiwogo Pier, Entebbe → Kalangala (Ssese Islands)',
    feeOrSponsorshipLabel: 'UGX 185,000 / Participant • Group Sponsor Slots Open',
    organizer: 'ENGANDA Safaris & Entebbe Island Ghetto SACCO',
    summary:
      'A signature ENGANDA Safaris lakeshore expedition connecting youth guides, partner delegates, and community cooperatives across Lake Victoria and the Ssese archipelago.',
    highlights: [
      'Guided wooden boat excursion & shoreline biodiversity tour from Entebbe Peninsula',
      'Fisheries & cold-chain cooperative exchange with island youth groups',
      'Lakeshore campfire leadership dialogue & eco-tourism guide certification',
    ],
    imageUrl: PHOTO_ASSETS.SAFARI_LAKE,
    showOnCarousel: true,
    showInUpcoming: true,
    ctaLabel: 'Book Safari / Sponsor Youth Slot',
    createdAt: '2025-03-01T08:00:00.000Z',
    updatedAt: '2025-03-01T08:00:00.000Z',
  },
  {
    id: 'saf-mabamba-ecotour',
    code: 'SAF-2025-02',
    title: 'ENGANDA Safaris: Mabamba Wetland & Botanical Conservation Safari',
    category: 'ENGANDA Safari & Eco-Trip',
    dateLabel: 'July 05, 2025',
    durationLabel: '1 Full Day Expedition',
    location: 'Entebbe Botanical Gardens & Mabamba Bay Wetland',
    feeOrSponsorshipLabel: 'UGX 95,000 / Person • Partner Delegation Packages',
    organizer: 'ENGANDA Safaris & LeoLeo Enterprise Hub',
    summary:
      'Community-led wildlife, shoebill stork wetland tour, and botanical conservation safari showcasing trained Entebbe youth eco-guides and conservation stewards.',
    highlights: [
      '4x4 pop-up roof eco-tour & canoe excursion through Mabamba Ramsar wetland',
      'Indigenous tree nursery tour & birding guided by certified Entebbe youth',
      'Local craft & honey market showcase hosted by Entebbe Ghetto Women Association',
    ],
    imageUrl: PHOTO_ASSETS.SAFARI_ECOTOUR,
    showOnCarousel: true,
    showInUpcoming: true,
    ctaLabel: 'Reserve Safari Seat',
    createdAt: '2025-03-01T08:00:00.000Z',
    updatedAt: '2025-03-01T08:00:00.000Z',
  },
  {
    id: 'saf-siz-gala-tree-drive',
    code: 'EVT-2025-03',
    title: 'SIZ Champions Gala & "Plant a Tree, Plant a Player" Matchday',
    category: 'Youth Sports & Gala',
    dateLabel: 'July 19, 2025',
    durationLabel: 'Full Matchday (8:00 AM – 6:00 PM)',
    location: 'Entebbe Works Grounds & Katabi Community Pitch',
    feeOrSponsorshipLabel: 'Free Community Entry • Eco-Captain & Striker Tiers Open',
    organizer: 'SIZ Football Academy',
    summary:
      'Inter-division U-13, U-15, and U-17 youth football tournament paired with the planting of 1,500 indigenous shoreline and school shade trees across Greater Entebbe.',
    highlights: [
      '16 youth teams competing alongside community SACCO fan zones',
      'Live "Sponsor a Tree / Plant a Player" seedling dedication ceremony',
      'Talent scouting, athlete academic bursary awards & sports clinic',
    ],
    imageUrl: PHOTO_ASSETS.SIZ_FOOTBALL,
    showOnCarousel: true,
    showInUpcoming: true,
    ctaLabel: 'Sponsor Matchday / Register',
    createdAt: '2025-03-01T08:00:00.000Z',
    updatedAt: '2025-03-01T08:00:00.000Z',
  },
  {
    id: 'saf-sacco-financial-boot-camp',
    code: 'PRG-2025-04',
    title: 'Greater Entebbe SACCO Governance & Financial Linkage Clinic',
    category: 'SACCO & Enterprise Exchange',
    dateLabel: 'August 02, 2025',
    durationLabel: '1 Day Intensive Clinic',
    location: 'ENGANDA Coordination Hub, Abayita Ababiri',
    feeOrSponsorshipLabel: 'Open to All 13 Registered Member Groups',
    organizer: 'ENGANDA Secretariat & EGYA Association',
    summary:
      'Hands-on bookkeeping, digital ledger auditing, and commercial bank linkage workshop preparing SACCO treasurers and chairpersons for institutional credit.',
    highlights: [
      'Digital passbook & audit readiness with financial partner representatives',
      'Peer learning between Twezimbe SACCO, Entebbe Island SACCO, and EGYA',
      'Micro-enterprise working capital appraisal for youth trade clusters',
    ],
    imageUrl: PHOTO_ASSETS.SACCO_GOVERNANCE,
    showOnCarousel: false,
    showInUpcoming: true,
    ctaLabel: 'Register Group Delegates',
    createdAt: '2025-03-01T08:00:00.000Z',
    updatedAt: '2025-03-01T08:00:00.000Z',
  },
  {
    id: 'saf-western-uganda-coop-trip',
    code: 'SAF-2025-05',
    title: 'ENGANDA Safaris: Queen Elizabeth Park & Western Model SACCO Benchmark Trip',
    category: 'Community Cultural Expedition',
    dateLabel: 'August 22 – August 25, 2025',
    durationLabel: '4 Days / 3 Nights',
    location: 'Entebbe → Mbarara → Kasese & Kazinga Channel',
    feeOrSponsorshipLabel: 'UGX 320,000 / Delegate • Co-Sponsored Leadership Trip',
    organizer: 'ENGANDA Safaris & RONSOL Logistics',
    summary:
      'Combined agro-cooperative benchmarking tour in Western Uganda and wildlife conservation safari across Queen Elizabeth National Park and Kazinga Channel.',
    highlights: [
      'Benchmark visits to established dairy & coffee SACCO unions in Ankole',
      'Kazinga Channel boat safari & game drive for youth group chairpersons',
      'Cross-regional trade & market linkage signing for Entebbe artisans',
    ],
    imageUrl: PHOTO_ASSETS.TREE_PLANTING,
    showOnCarousel: true,
    showInUpcoming: true,
    ctaLabel: 'Join Benchmark Safari',
    createdAt: '2025-03-01T08:00:00.000Z',
    updatedAt: '2025-03-01T08:00:00.000Z',
  },
  {
    id: 'saf-artisan-auto-expo',
    code: 'PRG-2025-06',
    title: 'Entebbe Youth Technical Skills, Auto Mechanics & Clean Energy Expo',
    category: 'SACCO & Enterprise Exchange',
    dateLabel: 'September 13, 2025',
    durationLabel: '2-Day Exhibition',
    location: 'Kitinda & Katabi Industrial Artisan Corridor, Entebbe',
    feeOrSponsorshipLabel: 'Exhibitor Stalls & Equipment Sponsorship Available',
    organizer: 'BEP Auto Garage, Kitinda Cooperative & LeoLeo',
    summary:
      'Public showcase of youth-fabricated metalwork, automotive diagnostics, eco-briquette stoves, carpentry furniture, and women-led tailoring collections.',
    highlights: [
      'Live automotive diagnostic clinic by BEP Auto Garage youth technicians',
      'Clean-energy briquette & metal fabrication demonstrations',
      'Direct buyer & institutional procurement matchmaking',
    ],
    imageUrl: PHOTO_ASSETS.AUTO_GARAGE,
    showOnCarousel: false,
    showInUpcoming: true,
    ctaLabel: 'Book Stall / Partner',
    createdAt: '2025-03-01T08:00:00.000Z',
    updatedAt: '2025-03-01T08:00:00.000Z',
  },
];

export function normalizeDuplicateKey(fullName: string, phone: string): string {
  const normName = String(fullName || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
  const normPhone = String(phone || '').replace(/[^0-9]/g, '').slice(-9);
  return `${normName}::${normPhone}`;
}
