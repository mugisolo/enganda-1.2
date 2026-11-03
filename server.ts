import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini SDK with process.env.API_KEY (or GEMINI_API_KEY fallback)
const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Seed data: 21 Active Pilot Groups in Greater Entebbe
export interface YouthGroup {
  id: string;
  name: string;
  division: string;
  location: string;
  memberCount: number;
  womenPercentage: number;
  trade: string;
  stage: 'Formalized & Banked' | 'In Incubation' | 'Skilling Phase';
  bankAccount: string;
  treesPlanted: number;
  leaderName: string;
  leaderPhone: string;
}

const initialGroups: YouthGroup[] = [
  {
    id: 'ENG-ENT-001',
    name: 'Kigungu Fisherfolk & Boat Artisans',
    division: 'Entebbe Division A',
    location: 'Kigungu Landing Site',
    memberCount: 142,
    womenPercentage: 38,
    trade: 'Boat Building & Cold Storage',
    stage: 'Formalized & Banked',
    bankAccount: 'EcoBank UG #80429104',
    treesPlanted: 620,
    leaderName: 'Ivan Mukasa',
    leaderPhone: '+256 772 109 231',
  },
  {
    id: 'ENG-ENT-002',
    name: 'Kitoro Boda Boda Savings Syndicate',
    division: 'Entebbe Division B',
    location: 'Kitoro Taxi Park',
    memberCount: 180,
    womenPercentage: 15,
    trade: 'Logistics & Safe Transport',
    stage: 'Formalized & Banked',
    bankAccount: 'EcoBank UG #80429188',
    treesPlanted: 450,
    leaderName: 'Moses Kato',
    leaderPhone: '+256 702 449 811',
  },
  {
    id: 'ENG-ENT-003',
    name: 'Katabi Green Youth Briquette Makers',
    division: 'Katabi Town Council',
    location: 'Kashenyi Road, Katabi',
    memberCount: 95,
    womenPercentage: 62,
    trade: 'Eco-Briquettes & Waste-to-Energy',
    stage: 'Formalized & Banked',
    bankAccount: 'EcoBank UG #80429302',
    treesPlanted: 1400,
    leaderName: 'Grace Nalubega',
    leaderPhone: '+256 788 332 901',
  },
  {
    id: 'ENG-ENT-004',
    name: 'Lugonjo Youth Metal Fabricators',
    division: 'Entebbe Division B',
    location: 'Lugonjo Commercial Strip',
    memberCount: 110,
    womenPercentage: 20,
    trade: 'Metal Fabrication & Welding',
    stage: 'Formalized & Banked',
    bankAccount: 'EcoBank UG #80429411',
    treesPlanted: 310,
    leaderName: 'David Ssempijja',
    leaderPhone: '+256 774 819 023',
  },
  {
    id: 'ENG-ENT-005',
    name: 'Bugonga Women & Youth Tailoring Cluster',
    division: 'Entebbe Division A',
    location: 'Bugonga Catholic Parish Area',
    memberCount: 78,
    womenPercentage: 88,
    trade: 'Apparel & Uniform Manufacturing',
    stage: 'Formalized & Banked',
    bankAccount: 'EcoBank UG #80429520',
    treesPlanted: 520,
    leaderName: 'Sarah Babirye',
    leaderPhone: '+256 750 293 841',
  },
  {
    id: 'ENG-ENT-006',
    name: 'Nkumba Urban Farmers & Seedling Nursery',
    division: 'Katabi Town Council',
    location: 'Nkumba University Road',
    memberCount: 88,
    womenPercentage: 55,
    trade: 'Indigenous Tree Nursery & Horticulture',
    stage: 'Formalized & Banked',
    bankAccount: 'EcoBank UG #80429640',
    treesPlanted: 3800,
    leaderName: 'Ronald Kigozi',
    leaderPhone: '+256 776 592 104',
  },
  {
    id: 'ENG-ENT-007',
    name: 'Abayita Ababiri Digital Youth Hub',
    division: 'Katabi Town Council',
    location: 'Abayita Ababiri Central',
    memberCount: 65,
    womenPercentage: 45,
    trade: 'Hardware Repair & Digital Services',
    stage: 'In Incubation',
    bankAccount: 'Relworx Merchant Wallet #RWX-091',
    treesPlanted: 240,
    leaderName: 'Brian Okello',
    leaderPhone: '+256 701 928 374',
  },
  {
    id: 'ENG-ENT-008',
    name: 'Nakiwogo Market Youth Produce Wholesale',
    division: 'Entebbe Division A',
    location: 'Nakiwogo Landing & Ferry Gate',
    memberCount: 135,
    womenPercentage: 70,
    trade: 'Food Processing & Bulk Produce Trading',
    stage: 'Formalized & Banked',
    bankAccount: 'EcoBank UG #80429715',
    treesPlanted: 410,
    leaderName: 'Hellen Namutebi',
    leaderPhone: '+256 773 892 419',
  },
  {
    id: 'ENG-ENT-009',
    name: 'Kasenyi Eco-Tourism & Shoreline Guides',
    division: 'Katabi Town Council',
    location: 'Kasenyi Fish Landing & Beach',
    memberCount: 72,
    womenPercentage: 40,
    trade: 'Eco-Tourism & Lake Conservation',
    stage: 'In Incubation',
    bankAccount: 'EcoBank UG #80429802',
    treesPlanted: 890,
    leaderName: 'Paul Mugerwa',
    leaderPhone: '+256 782 119 403',
  },
  {
    id: 'ENG-ENT-010',
    name: 'Lunyo Central Auto Mechanics Syndicate',
    division: 'Entebbe Division B',
    location: 'Lunyo Main Junction',
    memberCount: 94,
    womenPercentage: 12,
    trade: 'Vehicle & Motorcycle Diagnostics',
    stage: 'Formalized & Banked',
    bankAccount: 'EcoBank UG #80429910',
    treesPlanted: 330,
    leaderName: 'Geoffrey Wasswa',
    leaderPhone: '+256 772 881 290',
  },
  {
    id: 'ENG-ENT-011',
    name: 'Entebbe Municipality Green Tree Guardians',
    division: 'Entebbe Division A',
    location: 'Manyago Municipal Corridor',
    memberCount: 115,
    womenPercentage: 58,
    trade: 'Urban Reforestation & Parks Maintenance',
    stage: 'Formalized & Banked',
    bankAccount: 'EcoBank UG #80430018',
    treesPlanted: 5400,
    leaderName: 'Patricia Nakato',
    leaderPhone: '+256 752 443 219',
  },
  {
    id: 'ENG-ENT-012',
    name: 'Katabi Sustainable Bamboo & Joinery',
    division: 'Katabi Town Council',
    location: 'Mpala Village',
    memberCount: 82,
    womenPercentage: 35,
    trade: 'Bamboo Processing & Furniture',
    stage: 'In Incubation',
    bankAccount: 'EcoBank UG #80430125',
    treesPlanted: 1650,
    leaderName: 'Samuel Lule',
    leaderPhone: '+256 781 602 918',
  },
  {
    id: 'ENG-ENT-013',
    name: 'Kigungu Clean Solar Fish Drying Co-op',
    division: 'Entebbe Division A',
    location: 'Kigungu Beach North',
    memberCount: 96,
    womenPercentage: 82,
    trade: 'Solar Fish Dehydration & Export',
    stage: 'Formalized & Banked',
    bankAccount: 'EcoBank UG #80430239',
    treesPlanted: 710,
    leaderName: 'Rosemary Namazzi',
    leaderPhone: '+256 775 332 198',
  },
  {
    id: 'ENG-ENT-014',
    name: 'Kitoro Electronics & Solar Technicians',
    division: 'Entebbe Division B',
    location: 'Kitoro Shopping Arcade',
    memberCount: 64,
    womenPercentage: 30,
    trade: 'Solar Power Installation & Repair',
    stage: 'In Incubation',
    bankAccount: 'EcoBank UG #80430342',
    treesPlanted: 290,
    leaderName: 'Charles Othieno',
    leaderPhone: '+256 703 118 729',
  },
  {
    id: 'ENG-ENT-015',
    name: 'Nkumba Interlocking Brick & Masonry Guild',
    division: 'Katabi Town Council',
    location: 'Nkumba Central Quarry Road',
    memberCount: 120,
    womenPercentage: 22,
    trade: 'Eco-Brickmaking & Green Construction',
    stage: 'Formalized & Banked',
    bankAccount: 'EcoBank UG #80430455',
    treesPlanted: 680,
    leaderName: 'Simon Peter Kazibwe',
    leaderPhone: '+256 777 901 234',
  },
  {
    id: 'ENG-ENT-016',
    name: 'Bwebajja Agro-Milling & Value Addition',
    division: 'Katabi Town Council',
    location: 'Bwebajja Corridor',
    memberCount: 84,
    womenPercentage: 64,
    trade: 'Agro-processing & Packaging',
    stage: 'In Incubation',
    bankAccount: 'EcoBank UG #80430561',
    treesPlanted: 920,
    leaderName: 'Florence Akello',
    leaderPhone: '+256 789 221 445',
  },
  {
    id: 'ENG-ENT-017',
    name: 'Lugonjo Artisan Leather & Footwear',
    division: 'Entebbe Division B',
    location: 'Lugonjo Craft Centre',
    memberCount: 76,
    womenPercentage: 42,
    trade: 'Leather Tanning & School Shoes',
    stage: 'In Incubation',
    bankAccount: 'EcoBank UG #80430678',
    treesPlanted: 340,
    leaderName: 'Denis Kisekka',
    leaderPhone: '+256 754 112 809',
  },
  {
    id: 'ENG-ENT-018',
    name: 'Manyago Youth Plastic Recovery Depot',
    division: 'Entebbe Division A',
    location: 'Manyago Environmental Yard',
    memberCount: 105,
    womenPercentage: 60,
    trade: 'Municipal Plastic Sorting & Flaking',
    stage: 'Formalized & Banked',
    bankAccount: 'EcoBank UG #80430784',
    treesPlanted: 2100,
    leaderName: 'Harriet Nabirye',
    leaderPhone: '+256 779 403 912',
  },
  {
    id: 'ENG-ENT-019',
    name: 'Kitoro Creative Signage & Digital Media',
    division: 'Entebbe Division B',
    location: 'Airport Road Plaza',
    memberCount: 58,
    womenPercentage: 48,
    trade: 'Screen Printing & Commercial Branding',
    stage: 'Skilling Phase',
    bankAccount: 'Pending EcoBank KYB',
    treesPlanted: 180,
    leaderName: 'Andrew Sserwadda',
    leaderPhone: '+256 706 554 120',
  },
  {
    id: 'ENG-ENT-020',
    name: 'Kitubulu Lakefront Organic Greenhouse Growers',
    division: 'Entebbe Division A',
    location: 'Kitubulu Lakeshore Road',
    memberCount: 90,
    womenPercentage: 72,
    trade: 'Smart Horticulture & Drip Greenhouses',
    stage: 'Formalized & Banked',
    bankAccount: 'EcoBank UG #80430890',
    treesPlanted: 1540,
    leaderName: 'Scovia Ainembabazi',
    leaderPhone: '+256 784 776 219',
  },
  {
    id: 'ENG-ENT-021',
    name: 'Entebbe Express Youth Transit & Logistics Pool',
    division: 'Entebbe Division B',
    location: 'Expressway Interchange',
    memberCount: 151,
    womenPercentage: 18,
    trade: 'Light Haulage & Shared Spare Parts Pool',
    stage: 'Formalized & Banked',
    bankAccount: 'EcoBank UG #80430999',
    treesPlanted: 690,
    leaderName: 'Patrick Byaruhanga',
    leaderPhone: '+256 772 334 509',
  },
];

let youthGroups: YouthGroup[] = [...initialGroups];

// In-memory payment transactions log
interface PaymentRecord {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  provider: 'MTN' | 'AIRTEL';
  phoneNumber: string;
  donorName: string;
  purpose: string;
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
  createdAt: string;
  treesSponsored?: number;
  relworxBatchId: string;
}

const paymentRecords: PaymentRecord[] = [
  {
    id: 'TXN-901',
    reference: 'RWX-UG-2026-8812',
    amount: 50000,
    currency: 'UGX',
    provider: 'MTN',
    phoneNumber: '+256 772 400 123',
    donorName: 'Dr. Arthur Ssekandi',
    purpose: 'Sponsor 5 Indigenous Shoreline Trees',
    status: 'SUCCESSFUL',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    treesSponsored: 5,
    relworxBatchId: 'REL-BCH-4491',
  },
  {
    id: 'TXN-902',
    reference: 'RWX-UG-2026-8813',
    amount: 150000,
    currency: 'UGX',
    provider: 'AIRTEL',
    phoneNumber: '+256 701 889 004',
    donorName: 'Entebbe Business Club',
    purpose: 'Youth Tooling Grant (Metal Fabrication)',
    status: 'SUCCESSFUL',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    treesSponsored: 0,
    relworxBatchId: 'REL-BCH-4492',
  },
];

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API: Get Pilot Groups
  app.get('/api/groups', (req, res) => {
    const { division, trade, query } = req.query;
    let filtered = [...youthGroups];

    if (division && division !== 'all') {
      filtered = filtered.filter((g) => g.division.toLowerCase() === String(division).toLowerCase());
    }

    if (trade && trade !== 'all') {
      filtered = filtered.filter((g) => g.trade.toLowerCase().includes(String(trade).toLowerCase()));
    }

    if (query) {
      const q = String(query).toLowerCase();
      filtered = filtered.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.location.toLowerCase().includes(q) ||
          g.trade.toLowerCase().includes(q) ||
          g.leaderName.toLowerCase().includes(q)
      );
    }

    // Totals for top statistics
    const totalMembers = filtered.reduce((acc, g) => acc + g.memberCount, 0);
    const totalTrees = filtered.reduce((acc, g) => acc + g.treesPlanted, 0);
    const formalizedCount = filtered.filter((g) => g.stage === 'Formalized & Banked').length;

    res.json({
      groups: filtered,
      stats: {
        totalGroups: filtered.length,
        totalMembers,
        totalTrees,
        formalizedCount,
        allPilotTotalMembers: youthGroups.reduce((a, b) => a + b.memberCount, 0),
        allPilotTotalTrees: youthGroups.reduce((a, b) => a + b.treesPlanted, 0),
      },
    });
  });

  // API: Register Group (Onboarding flow)
  app.post('/api/groups/register', (req, res) => {
    const {
      name,
      division,
      location,
      memberCount,
      trade,
      womenPercentage,
      leaderName,
      leaderPhone,
      leaderEmail,
      saccoIntent,
      ecobankAccountNeeded,
    } = req.body;

    if (!name || !division || !location || !leaderName || !leaderPhone) {
      return res.status(400).json({ error: 'Missing required group details' });
    }

    const newId = `ENG-ENT-0${youthGroups.length + 1}`;
    const newGroup: YouthGroup = {
      id: newId,
      name,
      division,
      location,
      memberCount: Number(memberCount) || 25,
      womenPercentage: Number(womenPercentage) || 40,
      trade: trade || 'Vocational Artisan',
      stage: 'In Incubation',
      bankAccount: ecobankAccountNeeded ? 'EcoBank Application Queued' : 'Self-Financed',
      treesPlanted: 0,
      leaderName,
      leaderPhone,
    };

    youthGroups.unshift(newGroup);

    res.status(201).json({
      message: 'Group registered successfully into Enganda Incubation Cohort',
      group: newGroup,
      registrationCode: `REG-UG-${Date.now().toString().slice(-6)}`,
      smsNotificationPreview: `Mwebale kwegatta ku Enganda! Ekibiina ${name} kiwandiikiddwa. Olukalala lw'okutendekebwa n'okuggulawo akawunti mu EcoBank lunasindikibwa ku ${leaderPhone}.`,
    });
  });

  // API: Admin Update Group
  app.put('/api/groups/:id', (req, res) => {
    const { id } = req.params;
    const index = youthGroups.findIndex((g) => g.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const updated = {
      ...youthGroups[index],
      ...req.body,
      memberCount: req.body.memberCount !== undefined ? Number(req.body.memberCount) : youthGroups[index].memberCount,
      treesPlanted: req.body.treesPlanted !== undefined ? Number(req.body.treesPlanted) : youthGroups[index].treesPlanted,
      womenPercentage: req.body.womenPercentage !== undefined ? Number(req.body.womenPercentage) : youthGroups[index].womenPercentage,
    };

    youthGroups[index] = updated;
    res.json({ success: true, group: updated });
  });

  // API: Admin Delete Group
  app.delete('/api/groups/:id', (req, res) => {
    const { id } = req.params;
    const prevLen = youthGroups.length;
    youthGroups = youthGroups.filter((g) => g.id !== id);
    if (youthGroups.length === prevLen) {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.json({ success: true, message: 'Group deleted successfully' });
  });

  // Global Site Settings for Admin control
  let siteSettings = {
    intakeOpen: true,
    intakeBatchName: '2026 Q2 Greater Entebbe & Wakiso Cohort',
    bannerNoticeEn: 'Active Intake: 21 Greater Entebbe pilot groups now banked with EcoBank Uganda. 2026 Greater Kampala cohort enrollment is open.',
    bannerNoticeLg: 'Olukalala Olukola: Ebibiina 21 mu Ntebbe bimaze okufuna akawunti mu EcoBank Uganda. Okwewandiisa kw’e Kampala kutandise.',
    nationalTargetYouth: 2000000,
    contactHotline: '+256 772 109 231',
    relworxGatewayActive: true,
  };

  app.get('/api/settings', (req, res) => {
    res.json(siteSettings);
  });

  app.post('/api/settings', (req, res) => {
    siteSettings = { ...siteSettings, ...req.body };
    res.json({ success: true, settings: siteSettings });
  });

  // API: Municipalities Data for Interactive Map
  app.get('/api/municipalities', (req, res) => {
    const municipalities = [
      {
        id: 'entebbe',
        name: 'Greater Entebbe Zone',
        region: 'Central / Wakiso Sub-District',
        coordinates: { lat: 0.0512, lng: 32.4637 },
        status: 'Active Benchmark Pilot',
        statusKey: 'active',
        activeGroupsCount: youthGroups.filter((g) => g.division.includes('Entebbe') || g.division.includes('Katabi')).length,
        totalMembers: youthGroups.reduce((acc, g) => acc + g.memberCount, 0),
        treesPlanted: youthGroups.reduce((acc, g) => acc + g.treesPlanted, 0),
        bankingPartner: 'EcoBank Entebbe Branch & Relworx *217#',
        readinessScore: 100,
        subDivisions: ['Entebbe Division A', 'Entebbe Division B', 'Katabi Town Council'],
        notableClusters: ['Kigungu Lake Artisans', 'Kitoro Boda Syndicate', 'Katabi Briquette Makers'],
        color: '#0F5132',
      },
      {
        id: 'kampala',
        name: 'Greater Kampala Metropolitan',
        region: 'Central District',
        coordinates: { lat: 0.3476, lng: 32.5825 },
        status: 'Scaling Cohort (2026–2027)',
        statusKey: 'scaling',
        activeGroupsCount: 14,
        totalMembers: 1850,
        treesPlanted: 4200,
        bankingPartner: 'EcoBank Parliament Ave & Relworx HQ',
        readinessScore: 88,
        subDivisions: ['Kawempe', 'Nakawa', 'Makindye', 'Rubaga', 'Central'],
        notableClusters: ['Katwe Metalworks', 'Kalerwe Agro-Traders', 'Bwaise Briquette Hub', 'Nateete Woodworks'],
        color: '#10B981',
      },
      {
        id: 'jinja',
        name: 'Jinja & Eastern Industrial Corridor',
        region: 'Busoga / Eastern',
        coordinates: { lat: 0.4479, lng: 33.2026 },
        status: 'Expansion Planned (2028)',
        statusKey: 'planned',
        activeGroupsCount: 4,
        totalMembers: 420,
        treesPlanted: 1100,
        bankingPartner: 'EcoBank Jinja Main',
        readinessScore: 74,
        subDivisions: ['Walukuba', 'Masese', 'Bugembe', 'Kakira Industrial Belt'],
        notableClusters: ['Walukuba Light Engineering', 'Masese Lakeshore Fish Processing', 'Bugembe Mechanics'],
        color: '#D97706',
      },
      {
        id: 'mbarara',
        name: 'Mbarara & South-Western Corridor',
        region: 'Ankole / Western',
        coordinates: { lat: -0.6072, lng: 30.6545 },
        status: 'Expansion Planned (2030)',
        statusKey: 'planned',
        activeGroupsCount: 2,
        totalMembers: 210,
        treesPlanted: 650,
        bankingPartner: 'EcoBank Mbarara High St',
        readinessScore: 65,
        subDivisions: ['Kakoba', 'Kamukuzi', 'Nyamitanga', 'Biharwe Corridor'],
        notableClusters: ['Kakoba Metal Artisans', 'Kamukuzi Dairy Value Addition', 'Ruti Timber Association'],
        color: '#C55A11',
      },
      {
        id: 'gulu',
        name: 'Gulu & Northern Albertine Basin',
        region: 'Acholi / Northern',
        coordinates: { lat: 2.7747, lng: 32.2990 },
        status: 'National Scale Horizon (2032)',
        statusKey: 'horizon',
        activeGroupsCount: 1,
        totalMembers: 115,
        treesPlanted: 300,
        bankingPartner: 'EcoBank Gulu Branch',
        readinessScore: 58,
        subDivisions: ['Layibi', 'Pece', 'Bardege', 'Laroo'],
        notableClusters: ['Layibi Heavy Fabrication', 'Pece Solar Electricians', 'Bardege Grain Value Addition'],
        color: '#64748B',
      },
    ];

    res.json({ municipalities });
  });

  // API: Relworx Mobile Money Simulator
  app.post('/api/momo/simulate', (req, res) => {
    const { provider, phoneNumber, amount, purpose, donorName } = req.body;

    if (!phoneNumber || !amount || !provider) {
      return res.status(400).json({ error: 'Phone number, amount, and provider (MTN or Airtel) are required.' });
    }

    const cleanPhone = String(phoneNumber).replace(/\s+/g, '');
    const reference = `RWX-UG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const batchId = `REL-BCH-${Math.floor(4000 + Math.random() * 5000)}`;

    const treesSponsored = purpose?.toLowerCase().includes('tree')
      ? Math.max(1, Math.floor(Number(amount) / 10000))
      : 0;

    const record: PaymentRecord = {
      id: `TXN-${Date.now().toString().slice(-4)}`,
      reference,
      amount: Number(amount),
      currency: 'UGX',
      provider: provider.toUpperCase() === 'AIRTEL' ? 'AIRTEL' : 'MTN',
      phoneNumber: cleanPhone,
      donorName: donorName || 'Enganda Supporter',
      purpose: purpose || 'Youth Group General Support',
      status: 'SUCCESSFUL',
      createdAt: new Date().toISOString(),
      treesSponsored,
      relworxBatchId: batchId,
    };

    paymentRecords.unshift(record);

    res.json({
      success: true,
      transaction: record,
      promptSent: `USSD Push delivered to ${cleanPhone} (${provider}) for UGX ${Number(amount).toLocaleString()}`,
      relworxResponse: {
        code: '00',
        message: 'Transaction Approved via Relworx MoMo Gateway',
        bankClearingPartner: 'EcoBank Uganda Limited',
        feesDeductedUgx: Math.round(Number(amount) * 0.015),
        settlementStatus: 'INSTANT_SETTLEMENT',
      },
    });
  });

  // API: Get recent payment transactions
  app.get('/api/momo/history', (req, res) => {
    res.json({
      transactions: paymentRecords.slice(0, 10),
      totalDonatedUgx: paymentRecords.reduce((acc, t) => acc + t.amount, 0),
      totalTreesSponsored: paymentRecords.reduce((acc, t) => acc + (t.treesSponsored || 0), 0),
    });
  });

  // API: Enganda Omubeezi - Gemini AI Youth & Enterprise Advisor
  app.post('/api/advisor/chat', async (req, res) => {
    try {
      const { message, language = 'en', conversationHistory = [] } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message prompt is required.' });
      }

      const systemPrompt = `
You are "Enganda Omubeezi" (The Enganda Guide & Economic Advisor), an intelligent, deeply knowledgeable consultant for informal sector youth, cooperative leaders, and municipal partners in Uganda.
Your mission is to support Enganda's goal: transitioning 2,000,000 informal sector youth ("ghetto workers") under 30 in Uganda into structured, formalized, bankable economic units.

Key institutional knowledge:
1. Enganda Leadership: Founded by Mugisa Solomon Byakutaaga (vision, operational strategy, grassroots mobilization) and Ronnie Tumusiime (co-founder, strategic partnerships, program design, EU/banking governance).
2. Institutional Partners:
   - EcoBank Uganda: Provides formal group bank accounts, financial literacy, and group loan facilities without onerous physical collateral.
   - Entebbe Municipal Council: Grants municipal tree-planting concessions, urban clean-up contracts, and local tax formalization support.
   - Relworx: The fintech gateway enabling instant MTN and Airtel Mobile Money collection, automated dues splitting, and micro-savings for informal youth who lack debit cards.
   - European Union (EU): Strategic development governance, youth employment grants, and vocational standards accreditation.
3. The 3 Core Pillars:
   - Skilling & Technical Capacity (hands-on vocational apprenticeships, toolkits, safety, digital bookkeeping).
   - Business Development & Incubation (URSB legal registration as SACCOs or Companies Limited by Guarantee, EcoBank account opening, Relworx MoMo payments).
   - Mindset Transformation & Community Action (Greening Entebbe through tree planting, municipal waste cleanups, mutual health insurance pools).
4. Language Policy:
   - If user asks in Luganda or requests Luganda, answer with natural, respectful, encouraging Luganda (mixing common Ugandan business terms where appropriate).
   - If user asks in English, answer in clear, inspiring, practical English with concrete steps.
5. Keep answers practical, structured (bullet points), encouraging, and free of vague buzzwords. Mention real Ugandan institutions (URSB, EcoBank, Entebbe Municipal Council, Relworx, KCCA, Ministry of Gender, Labour & Social Development).
`;

      const previousTurns = (Array.isArray(conversationHistory) ? conversationHistory : [])
        .slice(-10)
        .map((item: any) => ({
          role: item.role === 'assistant' || item.sender === 'assistant' ? 'model' : 'user',
          parts: [{ text: String(item.text || item.content || '') }],
        }));

      const contents = [
        ...previousTurns,
        { role: 'user', parts: [{ text: `User Question (${language.toUpperCase()}): ${message}` }] },
      ];

      // Call Gemini 3.8 Flash with multi-turn conversation and system instruction
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: systemPrompt,
        },
      });

      const replyText = response.text || 'Enganda is standing by to assist your youth group. Please reach out to our Entebbe Municipal office.';

      res.json({
        reply: replyText,
        model: 'gemini-3.8-flash',
      });
    } catch (error: any) {
      console.error('Advisor error:', error);
      res.status(500).json({
        error: 'Unable to process advisor query at this moment.',
        details: error?.message || String(error),
      });
    }
  });

  // API: Partner Inquiries
  app.post('/api/partner/inquiry', (req, res) => {
    const { organizationName, contactPerson, email, phone, partnershipType, message } = req.body;
    res.json({
      success: true,
      message: 'Thank you for your commitment to Uganda youth economic transformation. The Enganda executive team will review your partnership proposal within 48 business hours.',
      inquiryId: `PRT-UG-${Math.floor(1000 + Math.random() * 9000)}`,
    });
  });

  // API: Mock JSON feed for 21 Pilot Groups Impact Stories
  app.get('/api/impact-stories', (req, res) => {
    const { trade } = req.query;
    const stories = [
      {
        id: 'story-1',
        groupId: 'ENG-ENT-004',
        groupName: 'Lugonjo Youth Metal Fabricators',
        trade: 'Metal Fabrication & Welding',
        tradeCategory: 'metal',
        location: 'Lugonjo Commercial Strip, Entebbe Division B',
        leader: 'David Ssempijja',
        role: 'Cooperative Master Welder',
        membersCount: 110,
        quoteEn: 'Before Enganda, loan sharks charged us 30% monthly just to buy steel pipes. With our EcoBank group account, we acquired our own arc welders and now supply window grilles for municipal school contracts.',
        quoteLg: 'Enganda tebannatuuka, ab’amabanja batunyaganga 30% buli mwezi okugula ebyuma. Kati oluvannyuma lw’okufuna akawunti mu EcoBank, tugula ebyuma byaffe era tufunye amakontulakiti g’amatendekero g’ekibuga.',
        beforeEarningsUgx: 180000,
        afterEarningsUgx: 650000,
        growthPercentage: 260,
        bankStatus: 'EcoBank UG #80429411',
        treesPlanted: 310,
        image: '/src/assets/images/impact_metal_fabrication_1792555422747.jpg',
        badge: 'Top Artisan Cluster 2025',
      },
      {
        id: 'story-2',
        groupId: 'ENG-ENT-005',
        groupName: 'Bugonga Women & Youth Tailoring Cluster',
        trade: 'Apparel & Uniform Manufacturing',
        tradeCategory: 'tailoring',
        location: 'Bugonga Catholic Parish Area, Entebbe Division A',
        leader: 'Flavia Namubiru',
        role: 'Lead Garment Designer & Trainer',
        membersCount: 78,
        quoteEn: 'Our 78 young mothers were operating hand sewing machines at home in isolation. Enganda pooled us into a registered SACCO with 25 industrial Juki machines. We now supply school uniforms across Wakiso.',
        quoteLg: 'Abakyala abavubuka 78 twakoleranga awaka buli omu ku lulwe. Enganda yatugatta wamu nga SACCO n’ebyuma eby’omulembe 25. Kati tukola yunifoomu z’amasomero ag’omu Wakiso yonna.',
        beforeEarningsUgx: 120000,
        afterEarningsUgx: 520000,
        growthPercentage: 330,
        bankStatus: 'EcoBank UG #80429520',
        treesPlanted: 520,
        image: '/src/assets/images/impact_women_tailoring_1792555423895.jpg',
        badge: 'Women Economic Dignity Award',
      },
      {
        id: 'story-3',
        groupId: 'ENG-ENT-003',
        groupName: 'Katabi Green Youth Briquette Makers',
        trade: 'Eco-Briquettes & Waste Recovery',
        tradeCategory: 'clean-energy',
        location: 'Kashenyi Road, Katabi Town Council',
        leader: 'Grace Nalubega',
        role: 'Environmental Co-op Director',
        membersCount: 95,
        quoteEn: 'We convert municipal market banana peels and charcoal dust into smokeless fuel briquettes. We have saved over 800 indigenous trees from being cut for firewood in Entebbe while earning sustainable daily income.',
        quoteLg: 'Tukozesa ebisusunku by’amatooke n’ebisasiro by’omu katale okukola amanda agatafumita. Tutaasizza emiti egisoba mu 800 obutatemebwa mu Ntebbe ng’abavubuka bafuna ensente buli lunaku.',
        beforeEarningsUgx: 150000,
        afterEarningsUgx: 480000,
        growthPercentage: 220,
        bankStatus: 'EcoBank UG #80429302',
        treesPlanted: 1400,
        image: '/src/assets/images/impact_briquette_clean_energy_1792555423381.jpg',
        badge: 'Lake Victoria Green Champion',
      },
      {
        id: 'story-4',
        groupId: 'ENG-ENT-001',
        groupName: 'Kigungu Fisherfolk & Boat Artisans',
        trade: 'Boat Building & Cold Storage',
        tradeCategory: 'fisherfolk',
        location: 'Kigungu Landing Site, Entebbe Division A',
        leader: 'Ivan Mukasa',
        role: 'Boatyard Master Artisan',
        membersCount: 142,
        quoteEn: 'Fish spoiling before market was our biggest loss. Enganda helped us secure solar cold storage and establish a certified timber boat workshop. Our members now access emergency loans through Relworx.',
        quoteLg: 'Ebyennyanja byononekanga mangu nga tetunnaba kubitunda. Enganda yatuyamba okufuna ebyuma eby’amasannyalaze ag’enjuba ebikuuma emmere. Bammemba kati beewola n’ensente ku ssimu.',
        beforeEarningsUgx: 210000,
        afterEarningsUgx: 780000,
        growthPercentage: 270,
        bankStatus: 'EcoBank UG #80429104',
        treesPlanted: 620,
        image: '/src/assets/images/hero_youth_artisan_uganda_1792553825150.jpg',
        badge: 'Premier Marine Cluster',
      },
      {
        id: 'story-5',
        groupId: 'ENG-ENT-011',
        groupName: 'Entebbe Municipality Green Tree Guardians',
        trade: 'Urban Reforestation & Parks Maintenance',
        tradeCategory: 'reforestation',
        location: 'Manyago Municipal Corridor, Entebbe Division A',
        leader: 'Patricia Nakato',
        role: 'Reforestation Team Lead',
        membersCount: 115,
        quoteEn: 'Planting over 5,400 trees along the Lake Victoria buffer transformed our youth from stigmatized street youth into respected civic leaders contracted by Entebbe Municipal Council.',
        quoteLg: 'Okusimba emiti egisoba mu 5,400 ku lubalama lwa Nalubaale kyakyusa erinnya ly’abavubuka okuva mu kwenyinyalwa okufuuka abakulembeze abeesigika mu kibuga kyonna.',
        beforeEarningsUgx: 100000,
        afterEarningsUgx: 410000,
        growthPercentage: 310,
        bankStatus: 'EcoBank UG #80430018',
        treesPlanted: 5400,
        image: '/src/assets/images/pillar_community_tree_planting_1792553825337.jpg',
        badge: 'Municipal Stewardship Award',
      },
    ];

    if (trade && trade !== 'all') {
      const filtered = stories.filter((s) => s.tradeCategory === trade || s.trade.toLowerCase().includes(String(trade).toLowerCase()));
      return res.json({ stories: filtered });
    }

    res.json({ stories });
  });

  // API: Investment Pledge / Commitment
  app.post('/api/invest/commit', (req, res) => {
    const { investorName, investorType, email, phone, targetGroup, commitmentAmount, currency } = req.body;
    res.json({
      success: true,
      message: 'Investment commitment logged. The Enganda executive blended finance team and EcoBank credit committee will review your capital allocation dossier within 48 hours.',
      investmentRef: `INV-UG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      projectedImpact: {
        youthJobsFormalized: Math.max(15, Math.round((Number(commitmentAmount) || 5000000) / 350000)),
        treesDedicated: Math.max(25, Math.round((Number(commitmentAmount) || 5000000) / 50000)),
        ecoBankMatchedRatio: '1 : 1.5 Commercial Facility',
      },
    });
  });

  // Serve Frontend
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Enganda] Application server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Enganda] Fatal server startup error:', err);
  process.exit(1);
});
