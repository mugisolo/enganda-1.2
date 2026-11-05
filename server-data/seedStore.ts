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

export interface NetworkGroupRecord {
  id: string;
  slug: string;
  name: string;
  programmeType: ProgrammeType;
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
  updatedAt: string;
}

export interface PrivateMemberRecord {
  id: string;
  groupId: string;
  fullName: string;
  title: string;
  phone: string;
  email: string;
  nationalId: string;
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

export interface PersistentStoreData {
  groups: NetworkGroupRecord[];
  members: PrivateMemberRecord[];
  assignments: GroupAdminAssignment[];
  knownUsers: KnownUserAccount[];
  enquiries: SupportEnquiryRecord[];
  enquirySequence: number;
  newsletterSubscriptions: NewsletterSubscriptionRecord[];
  newsletterSequence: number;
}

export const INITIAL_NETWORK_GROUPS: NetworkGroupRecord[] = [
  {
    id: 'grp-siz-academy',
    slug: 'siz-football-academy',
    name: 'SIZ Football Academy',
    programmeType: 'Flagship Programme',
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
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'grp-leoleo',
    slug: 'leoleo',
    name: 'LeoLeo',
    programmeType: 'Flagship Programme',
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
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'grp-egya',
    slug: 'egya-association',
    name: 'EGYA Association',
    programmeType: 'Savings & Youth Association',
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
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'grp-abayita-ababiri',
    slug: 'abayita-ababiri-ghetto-group',
    name: 'Abayita Ababiri Ghetto Group',
    programmeType: 'Savings & Youth Association',
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
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'grp-baghdad',
    slug: 'baghdad-association-group',
    name: 'Baghdad Association Group',
    programmeType: 'Savings & Youth Association',
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
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'grp-bep-auto',
    slug: 'bep-auto-garage-savings',
    name: 'BEP Auto Garage Savings',
    programmeType: 'Cooperative & Trade Group',
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
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'grp-ghetto-women',
    slug: 'entebbe-ghetto-women-association',
    name: 'Entebbe Ghetto Women Association',
    programmeType: 'Savings & Youth Association',
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
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'grp-guda-sacco',
    slug: 'entebbe-guda-community-sacco',
    name: 'Entebbe GUDA Community SACCO',
    programmeType: 'Community SACCO',
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
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'grp-island-sacco',
    slug: 'entebbe-island-ghetto-sacco',
    name: 'Entebbe Island Ghetto SACCO',
    programmeType: 'Community SACCO',
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
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'grp-gaza-sacco',
    slug: 'gaza-ghetto-sacco',
    name: 'Gaza Ghetto SACCO',
    programmeType: 'Community SACCO',
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
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'grp-kinazi-katabi',
    slug: 'kinazi-ghetto-katabi-saving-association',
    name: 'Kinazi Ghetto Katabi Saving Association',
    programmeType: 'Savings & Youth Association',
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
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'grp-kitinda-coop',
    slug: 'kitinda-cooperative-group',
    name: 'Kitinda Cooperative Group',
    programmeType: 'Cooperative & Trade Group',
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
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'grp-lunyo-east',
    slug: 'lunyo-east-ghetto-life-association',
    name: 'Lunyo East Ghetto Life Association',
    programmeType: 'Savings & Youth Association',
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
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'grp-peace-rock',
    slug: 'peace-rock-sacco',
    name: 'Peace Rock SACCO',
    programmeType: 'Community SACCO',
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
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'grp-twezimbe-sacco',
    slug: 'twezimbe-sacco',
    name: 'Twezimbe SACCO',
    programmeType: 'Community SACCO',
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
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
];

export const SUPPLIED_GROUP_MEMBER_COUNTS = [
  { groupId: 'grp-abayita-ababiri', count: 53, location: 'Abayita Ababiri, Entebbe', leaderName: 'Brian Okello', leaderTitle: 'Group Chairperson' },
  { groupId: 'grp-baghdad', count: 36, location: 'Entebbe, Uganda', leaderName: 'Hassan Kigozi', leaderTitle: 'Association Leader' },
  { groupId: 'grp-bep-auto', count: 32, location: 'Entebbe, Uganda', leaderName: 'Geoffrey Wasswa', leaderTitle: 'Master Mechanic & Chairperson' },
  { groupId: 'grp-egya', count: 51, location: 'Entebbe, Uganda', leaderName: 'Mugisa Solomon Byakutaaga', leaderTitle: 'Association Chairperson' },
  { groupId: 'grp-ghetto-women', count: 23, location: 'Entebbe, Uganda', leaderName: 'Sarah Babirye', leaderTitle: 'Women Chairperson' },
  { groupId: 'grp-guda-sacco', count: 57, location: 'Entebbe, Uganda', leaderName: 'David Ssempijja', leaderTitle: 'SACCO Chairperson' },
  { groupId: 'grp-island-sacco', count: 102, location: 'Entebbe Island, Uganda', leaderName: 'Ivan Mukasa', leaderTitle: 'SACCO Chairperson' },
  { groupId: 'grp-gaza-sacco', count: 13, location: 'Entebbe, Uganda', leaderName: 'Moses Kato', leaderTitle: 'SACCO Coordinator' },
  { groupId: 'grp-kinazi-katabi', count: 58, location: 'Kinazi, Katabi', leaderName: 'Grace Nalubega', leaderTitle: 'Association Chairperson' },
  { groupId: 'grp-kitinda-coop', count: 57, location: 'Kitinda, Nkumba', leaderName: 'Simon Peter Kazibwe', leaderTitle: 'Cooperative Chairperson' },
  { groupId: 'grp-lunyo-east', count: 82, location: 'Lunyo East, Entebbe', leaderName: 'Samuel Lule', leaderTitle: 'Association Chairperson' },
  { groupId: 'grp-peace-rock', count: 28, location: 'Entebbe, Uganda', leaderName: 'Patricia Nakato', leaderTitle: 'SACCO Chairperson' },
  { groupId: 'grp-twezimbe-sacco', count: 98, location: 'Entebbe, Uganda', leaderName: 'Hellen Namutebi', leaderTitle: 'SACCO Chairperson' },
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

      records.push({
        id: `mem-${String(globalIdx).padStart(4, '0')}`,
        groupId: spec.groupId,
        fullName,
        title,
        phone,
        email,
        nationalId,
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
        const coordMap = new Map(INITIAL_NETWORK_GROUPS.map((g) => [g.id, g.mapCoords]));
        parsed.groups = parsed.groups.map((g) => ({
          ...g,
          mapCoords:
            g.mapCoords && g.mapCoords.x <= 100
              ? g.mapCoords
              : coordMap.get(g.id) || { x: 46, y: 55, zone: 'Entebbe Central' },
        }));
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
  };

  saveStore(initialStore);
  return initialStore;
}

export function normalizeDuplicateKey(fullName: string, phone: string): string {
  const normName = String(fullName || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
  const normPhone = String(phone || '').replace(/[^0-9]/g, '').slice(-9);
  return `${normName}::${normPhone}`;
}
