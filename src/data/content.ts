export const HERO_IMAGE = '/src/assets/images/hero_youth_artisan_uganda_1792553825150.jpg';
export const TREE_PLANTING_IMAGE = '/src/assets/images/pillar_community_tree_planting_1792553825337.jpg';
export const FOUNDER_MUGISA_IMAGE = '/src/assets/images/founder_mugisa_solomon_1792553824917.jpg';
export const FOUNDER_RONNIE_IMAGE = '/src/assets/images/founder_ronnie_tumusiime_1792553825367.jpg';

export interface OperatingStage {
  step: string;
  title: string;
  tagline: string;
  description: string;
  outcomes: string[];
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
  },
];

export interface CapacityArea {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
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
    quote:
      '"When community groups are properly structured and visibly represented, responsible partners can engage with confidence and measurable impact."',
  },
];
