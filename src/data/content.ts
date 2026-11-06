import { SiteMediaSettings, SafariEventItem } from '../types';

export const HERO_IMAGE = '/src/assets/images/hero_youth_artisan_uganda_1792553825150.jpg';
export const TREE_PLANTING_IMAGE = '/src/assets/images/pillar_community_tree_planting_1792553825337.jpg';
export const FOUNDER_MUGISA_IMAGE = '/src/assets/images/founder_mugisa_solomon_1792553824917.jpg';
export const FOUNDER_RONNIE_IMAGE = '/src/assets/images/founder_ronnie_tumusiime_1792553825367.jpg';
export const METAL_FABRICATION_IMAGE = '/src/assets/images/impact_metal_fabrication_1792555422747.jpg';
export const BRIQUETTE_ENERGY_IMAGE = '/src/assets/images/impact_briquette_clean_energy_1792555423381.jpg';
export const WOMEN_TAILORING_IMAGE = '/src/assets/images/impact_women_tailoring_1792555423895.jpg';
export const SACCO_GOVERNANCE_IMAGE = '/src/assets/images/sacco_savings_governance_1793954418840.jpg';
export const AUTO_GARAGE_IMAGE = '/src/assets/images/automotive_garage_mechanics_1793954420824.jpg';
export const FISHERIES_COOP_IMAGE = '/src/assets/images/lake_victoria_fisheries_cooperative_1793954423329.jpg';
export const SIZ_ACADEMY_IMAGE = '/src/assets/images/siz_youth_football_academy_1793954424368.jpg';
export const CARPENTRY_FARMING_IMAGE = '/src/assets/images/youth_carpentry_urban_farming_1793954424672.jpg';
export const SAFARI_LAKE_VICTORIA_IMAGE = '/src/assets/images/enganda_safari_lake_victoria_1793956926137.jpg';
export const SAFARI_UGANDA_ECOTOUR_IMAGE = '/src/assets/images/enganda_safari_uganda_ecotour_1793956926146.jpg';

export const POWERED_BY_LINE =
  'Powered by Enganda, RONSOL, RELWORX, FINCA & ECO Bank';

export const POWERED_BY_PARTNERS = [
  'Enganda',
  'RONSOL',
  'RELWORX',
  'FINCA & ECO Bank',
];

export const PARTNER_LOGOS = {
  relworx: '/assets/aistudio/relworx_9ec37c45.jfif',
  finca: '/assets/aistudio/finca_84848a21.png',
  ecobank: '/assets/aistudio/eco_bank_551a5850.png',
  entebbeMunicipal: '/assets/aistudio/ebb_muni_b92e383f.jfif',
  plu: '/assets/aistudio/PLU_6740178b.jfif',
  gcic: '/assets/aistudio/gcic_2d3a48ab.jfif',
};

export const DEFAULT_SITE_MEDIA: SiteMediaSettings = {
  heroBannerImage: HERO_IMAGE,
  aboutMissionImage: SACCO_GOVERNANCE_IMAGE,
  organiseStageImage: CARPENTRY_FARMING_IMAGE,
  formaliseStageImage: SACCO_GOVERNANCE_IMAGE,
  growStageImage: FISHERIES_COOP_IMAGE,
  humanCapacityImage: AUTO_GARAGE_IMAGE,
  economicStructureImage: METAL_FABRICATION_IMAGE,
  civicAgencyImage: WOMEN_TAILORING_IMAGE,
  sizStewardshipImage: TREE_PLANTING_IMAGE,
  egyaBannerImage: SACCO_GOVERNANCE_IMAGE,
  leoleoBannerImage: BRIQUETTE_ENERGY_IMAGE,
  founderMugisaImage: FOUNDER_MUGISA_IMAGE,
  founderRonnieImage: FOUNDER_RONNIE_IMAGE,
};

export const AI_GENERATED_PHOTO_LIBRARY = [
  {
    id: 'ai-safari-lake',
    label: 'ENGANDA Safaris: Lake Victoria Boat Expedition',
    url: SAFARI_LAKE_VICTORIA_IMAGE,
  },
  {
    id: 'ai-safari-ecotour',
    label: 'ENGANDA Safaris: Eco-Tour & Conservation Vehicle',
    url: SAFARI_UGANDA_ECOTOUR_IMAGE,
  },
  {
    id: 'ai-sacco',
    label: 'SACCO Ledger & Governance Meeting',
    url: SACCO_GOVERNANCE_IMAGE,
  },
  {
    id: 'ai-siz-football',
    label: 'SIZ Youth Football Academy Training',
    url: SIZ_ACADEMY_IMAGE,
  },
  {
    id: 'ai-tree-planting',
    label: 'Plant a Tree, Plant a Player Stewardship',
    url: TREE_PLANTING_IMAGE,
  },
  {
    id: 'ai-auto-garage',
    label: 'BEP Auto Garage & Youth Mechanics',
    url: AUTO_GARAGE_IMAGE,
  },
  {
    id: 'ai-fisheries',
    label: 'Lake Victoria Fisheries & Cold-Chain',
    url: FISHERIES_COOP_IMAGE,
  },
  {
    id: 'ai-carpentry',
    label: 'Youth Carpentry & Urban Nursery',
    url: CARPENTRY_FARMING_IMAGE,
  },
  {
    id: 'ai-metal-fab',
    label: 'Welding & Metal Fabrication Workshop',
    url: METAL_FABRICATION_IMAGE,
  },
  {
    id: 'ai-women-tailoring',
    label: 'Women Tailoring & Garment Enterprise',
    url: WOMEN_TAILORING_IMAGE,
  },
  {
    id: 'ai-briquette',
    label: 'Clean Energy & Briquette Cooperative',
    url: BRIQUETTE_ENERGY_IMAGE,
  },
  {
    id: 'ai-hero-artisan',
    label: 'Entebbe Youth Artisan Collective',
    url: HERO_IMAGE,
  },
  {
    id: 'ai-founder-mugisa',
    label: 'Portrait: Mugisa Solomon Byakutaaga',
    url: FOUNDER_MUGISA_IMAGE,
  },
  {
    id: 'ai-founder-ronnie',
    label: 'Portrait: Ronnie Tumusiime',
    url: FOUNDER_RONNIE_IMAGE,
  },
];

export const DEFAULT_SAFARI_EVENTS: SafariEventItem[] = [
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
    imageUrl: SAFARI_LAKE_VICTORIA_IMAGE,
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
    imageUrl: SAFARI_UGANDA_ECOTOUR_IMAGE,
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
    imageUrl: SIZ_ACADEMY_IMAGE,
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
    imageUrl: SACCO_GOVERNANCE_IMAGE,
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
    imageUrl: TREE_PLANTING_IMAGE,
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
    location: 'Kitinda &Katabi Industrial Artisan Corridor, Entebbe',
    feeOrSponsorshipLabel: 'Exhibitor Stalls & Equipment Sponsorship Available',
    organizer: 'BEP Auto Garage, Kitinda Cooperative & LeoLeo',
    summary:
      'Public showcase of youth-fabricated metalwork, automotive diagnostics, eco-briquette stoves, carpentry furniture, and women-led tailoring collections.',
    highlights: [
      'Live automotive diagnostic clinic by BEP Auto Garage youth technicians',
      'Clean-energy briquette & metal fabrication demonstrations',
      'Direct buyer & institutional procurement matchmaking',
    ],
    imageUrl: AUTO_GARAGE_IMAGE,
    showOnCarousel: false,
    showInUpcoming: true,
    ctaLabel: 'Book Stall / Partner',
    createdAt: '2025-03-01T08:00:00.000Z',
    updatedAt: '2025-03-01T08:00:00.000Z',
  },
];

export interface OperatingStage {
  step: string;
  title: string;
  tagline: string;
  description: string;
  outcomes: string[];
  mediaKey: 'organiseStageImage' | 'formaliseStageImage' | 'growStageImage';
}

export const OPERATING_MODEL_STAGES: OperatingStage[] = [
  {
    step: '01',
    title: 'Organise',
    tagline: 'Cohesive community groups with clear internal governance',
    description:
      'Bringing together informal youth artisans, traders, mechanics, fisherfolk, and community associations under transparent leadership and verified member registries.',
    outcomes: [
      'Designated public representatives and accountable committee roles',
      'Verified member registries protected by strict data privacy',
      'Shared vocational identity and peer solidarity structures',
    ],
    mediaKey: 'organiseStageImage',
  },
  {
    step: '02',
    title: 'Formalise',
    tagline: 'Structured economic units ready for institutional trust',
    description:
      'Equipping community associations and SACCOs with legal registration pathways, disciplined savings records, and structured project portfolios.',
    outcomes: [
      'SACCO and cooperative governance standards',
      'Auditable savings and internal credit discipline',
      'Clear project scopes ready for banking and institutional due diligence',
    ],
    mediaKey: 'formaliseStageImage',
  },
  {
    step: '03',
    title: 'Grow',
    tagline: 'Connecting groups to finance, visibility, and partnerships',
    description:
      'Linking organized groups and flagship programmes to commercial finance, equipment co-investment, sponsorship pathways, and long-term partnerships.',
    outcomes: [
      'Direct sponsorship, investment, and partnership linkages',
      'Shared productive equipment and working capital growth',
      'Sustained community livelihoods and regional economic resilience',
    ],
    mediaKey: 'growStageImage',
  },
];

export interface CapacityArea {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  mediaKey: 'humanCapacityImage' | 'economicStructureImage' | 'civicAgencyImage';
}

export const CAPACITY_AREAS: CapacityArea[] = [
  {
    id: 'human-capacity',
    title: 'Human Capacity',
    subtitle: 'Skills that become livelihoods',
    description:
      'Practical vocational mastery, technical apprenticeships, athletic and personal development, and enterprise literacy that translate directly into dependable daily income.',
    highlights: [
      'Automotive diagnostics, metal fabrication, marine & artisanal trades',
      'Youth athletics, mentorship, and academic bursary support via SIZ',
      'Enterprise coordination and digital service readiness via LeoLeo',
    ],
    mediaKey: 'humanCapacityImage',
  },
  {
    id: 'economic-structure',
    title: 'Economic Structure',
    subtitle: 'Groups ready for formal opportunity',
    description:
      'Transforming fragmented individual workers into organized SACCOs, savings associations, and cooperatives capable of managing shared assets and credit.',
    highlights: [
      '13 community groups and SACCOs representing 690 registered members',
      'Structured group savings pools and revolving micro-enterprise funds',
      'Investment-ready project profiles with clear support pathways',
    ],
    mediaKey: 'economicStructureImage',
  },
  {
    id: 'civic-agency',
    title: 'Civic Agency',
    subtitle: 'Confident leadership and accountability',
    description:
      'Empowering community leaders and youth representatives to govern transparently, advocate for their members, and steward local community initiatives.',
    highlights: [
      'Accountable group chairpersons and elected committee leadership',
      'Privacy-first member administration with role-based data stewardship',
      'Community-led initiatives in women’s enterprise and local stewardship',
    ],
    mediaKey: 'civicAgencyImage',
  },
];

export const LEADERSHIP_PROFILES = [
  {
    name: 'Mugisa Solomon Byakutaaga',
    role: 'Founder & Executive Director',
    title: 'Network Mobilisation & Community Systems Lead',
    bio: 'Mugisa works directly with urban youth associations, community SACCOs, and trade groups across Greater Entebbe to build trusted governance structures, verified group registries, and practical livelihood pathways.',
    focus: [
      'Community Group & SACCO Mobilisation',
      'EGYA Association Leadership & Livelihood Structuring',
      'Grassroots Governance & Accountability Systems',
    ],
    image: FOUNDER_MUGISA_IMAGE,
    mediaKey: 'founderMugisaImage' as const,
    quote:
      '"Informal youth and community groups do not lack talent or work ethic—they need trusted structure, visibility, and fair pathways to formal opportunity."',
  },
  {
    name: 'Ronnie Tumusiime',
    role: 'Co-Founder & Strategy Lead',
    title: 'Enterprise Coordination & Institutional Partnerships',
    bio: 'Ronnie leads strategic partnership architecture, programme coordination across LeoLeo and the broader ENGANDA network, and institutional engagement with financial and development partners.',
    focus: [
      'Institutional Partnership & Investment Structuring',
      'LeoLeo Programme Coordination & Enterprise Workflows',
      'Network-Wide Governance & Compliance Standards',
    ],
    image: FOUNDER_RONNIE_IMAGE,
    mediaKey: 'founderRonnieImage' as const,
    quote:
      '"When community groups are properly structured and visibly represented, responsible partners can engage with confidence and measurable impact."',
  },
];
