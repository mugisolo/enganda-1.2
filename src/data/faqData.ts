export interface FAQItem {
  id: string;
  category: 'registration' | 'savings' | 'tree-planting';
  questionEn: string;
  questionLg: string;
  answerEn: string;
  answerLg: string;
  tags: string[];
}

export const FAQ_DATA: FAQItem[] = [
  // 1. GROUP REGISTRATION
  {
    id: 'reg-1',
    category: 'registration',
    questionEn: 'What are the criteria for an informal youth group to join Enganda?',
    questionLg: 'Biki ebisaanyizo ebyetaagisa ekibiina ky’abavubuka okwegatta ku Enganda?',
    answerEn: 'To qualify for Enganda formalization:\n• Minimum of 15 members operating in the informal economy (e.g. metal fabrication, boda boda transport, tailoring, carpentering, agro-processing, market trade).\n• Over 70% of members must be under 30 years old.\n• Established leadership structure (Chairperson, General Secretary, and Treasurer).\n• Physical base within Greater Entebbe (Entebbe Division A, Division B, or Katabi Town Council) for the current pilot phase.\n• Commitment to participate in monthly civic action, including municipal tree planting along Lake Victoria.',
    answerLg: 'Okusobola okuyingira mu Enganda:\n• Ekibiina kirina okubaamu bammemba abatali wansi wa 15 abakola mu mirimu egy’ebweru (ng’okubaza ebyuma, boda boda, okutunga, okubaza embaawo, obulimi, oba obusuubuzi bw’omu katale).\n• Bammemba abasoba mu 70% balina okuba nga bali wansi w’emyaka 30.\n• Ekibiina kirina okuba n’abakulembeze: Ssentebe, Omuwandiisi, n’Omuwanika.\n• Ekifo ky’emirimu kirina okuba mu Greater Entebbe (Entebbe Division A, Division B, oba Katabi Town Council).\n• Okukkiriza okwetaba mu kusimba emiti ku lusegere lwa Nnalubaale n’okulongoosa ekibuga.',
    tags: ['requirements', 'eligibility', 'age limit', 'membership', 'ebisaanyizo'],
  },
  {
    id: 'reg-2',
    category: 'registration',
    questionEn: 'How does the URSB legal registration and formalization process work?',
    questionLg: 'Enkola y’okuwandiisa ekibiina mu mateeka ga URSB etambula etya?',
    answerEn: 'Enganda covers legal documentation and coordinates directly with the Uganda Registration Services Bureau (URSB) and local municipal authorities:\n1. Name Reservation & Bylaw Formulation: We assist the group in drafting a constitution tailored to youth economic clusters.\n2. Local Council Endorsement: Recommendation letters obtained from LC1, LC3, and Entebbe Municipal Community Development Office.\n3. Legal Incorporation: Registration as a Cooperative Society / SACCO or Company Limited by Guarantee.\n4. TIN Registration: Tax Identification Number obtained from Uganda Revenue Authority (URA) with zero preliminary audit burden for new informal groups.\nThis process takes 10 to 14 business days with full legal mentorship.',
    answerLg: 'Enganda ekwatagana butereevu ne kitongole kya gavumenti ekya URSB wamu n’olukiiko lw’ekibuga ky’e Ntebbe:\n1. Okukuuma erinnya n’amateeka: Tuyamba ekibiina okuwandiika ssemateeka n’amateeka amakakafu.\n2. Ebbaluwa z’ebyalo: Ebiwandiiko bya LC1, LC3, n’omukungu w’ekibuga akola ku nkulaakulana y’abantu (CDO).\n3. Okuwandiisa SACCO oba Kkampuni etalina magoba ga bammemba ku bwa nnakyewa.\n4. Okufuna TIN number okuva mu URA awatali kusasula misolo gya maanyi.\nOmulimu guno gutwala ennaku 10 okutuuka ku 14 ng’Enganda ekwasizza abakugu mu mateeka.',
    tags: ['URSB', 'legal', 'registration', 'constitution', 'SACCO', 'TIN', 'amateeka'],
  },
  {
    id: 'reg-3',
    category: 'registration',
    questionEn: 'Does registration require any upfront registration fee from youth?',
    questionLg: 'Okwewandiisa kwetaagisa ensente ez’amangu okuva mu bavubuka?',
    answerEn: 'No upfront capital is required from informal youth. Registration fees, constitution printing, and legal verification filing with URSB are underwritten by Enganda through partnerships with the European Union (EU) and municipal enterprise transition grants. The group only needs active members and genuine artisan or trading operations.',
    answerLg: 'Nedda! Abavubuka tebasasula nsimbi za kusooka. Ensente zonna ez’okufuna ebiwandiiko bya URSB, ssemateeka, n’eby’amateeka zisasulwa Enganda ng’ekolagana n’omukago gwa Bulaaya (EU) wamu n’olukiiko lw’ekibuga ky’e Ntebbe. Ekibiina kyetaagisa bammemba abakola abajjudde.',
    tags: ['fees', 'costs', 'free', 'funding', 'bwereere', 'ssente'],
  },

  // 2. SAVINGS & BANKING (ECOBANK & RELWORX)
  {
    id: 'sav-1',
    category: 'savings',
    questionEn: 'How does opening an EcoBank commercial group account work?',
    questionLg: 'Okuggulawo akawunti y’ekibiina mu EcoBank kutegekebwa kutya?',
    answerEn: 'Under our tripartite master agreement with EcoBank Uganda:\n• Zero Minimum Balance: Groups are exempt from standard commercial opening balance requirements.\n• Multi-Signatory Protection: Accounts require 3 authorized youth signatories (Chairperson, Secretary, Treasurer) ensuring no single person can withdraw funds alone.\n• Mobile Banking Integration: Account links directly to Relworx fintech rails for automated daily and weekly member micro-savings.\n• Account Opening Location: Processed at the EcoBank Entebbe Branch or on-site through mobile bankers visiting the group workshop.',
    answerLg: 'Wansi w’endagaano ey’omukago wakati w’Enganda ne EcoBank Uganda:\n• Tewali Nsimbi za Kusooka (Zero Minimum Balance): Ebibiina tebyetaagisa kusooka kuteekayo nsimbi za kafubo.\n• Obukuumi obw’Abantu Abasatu: Okuggyayo ensente kyetaagisa emikono gy’abakulembeze basatu (Ssentebe, Omuwandiisi, n’Omuwanika) okuziyiza obubbi.\n• Okugatta ku Ssimu: Akawunti egattibwa ku Relworx Mobile Money bammemba okutereka buli lunaku oba buli wiiki.\n• Wofiisi ya EcoBank mu Ntebbe: Bbanka ejja butereevu mu kibiina oba bammemba bagenda ku ttabi ly’e Ntebbe.',
    tags: ['EcoBank', 'bank account', 'savings', 'signatories', 'akawunti', 'bbanka'],
  },
  {
    id: 'sav-2',
    category: 'savings',
    questionEn: 'How does Relworx *217# collect daily member savings and dues?',
    questionLg: 'Enkola ya Relworx *217# ekola etya okukung’aanya amaterekero ku Mobile Money?',
    answerEn: 'Relworx provides a low-data and offline USSD payment gateway:\n1. Member dials *217# on any basic feature phone (no smartphone or internet required).\n2. Enters their 6-digit Enganda Group ID (e.g., 202601 for Kigungu Boat Artisans).\n3. Chooses option 1 (Daily Savings) or option 2 (Emergency Mutual Health Fund).\n4. Selects amount (e.g. UGX 2,000, UGX 5,000, or UGX 10,000).\n5. Enters MTN MoMo or Airtel Money PIN to authorize payment.\n6. Funds are instantly credited to the group’s verified EcoBank account, and both member and treasurer receive instant SMS confirmation receipts.',
    answerLg: 'Relworx ewa enkola ya USSD ekoleddwa ku ssimu eza bulijjo awatali yintaneeti:\n1. Bammemba bakuba *217# ku ssimu yaabwe (MTN oba Airtel).\n2. Oteekamu ennamba y’ekibiina ey’enjawulo (Group ID).\n3. Olondawo 1 (Okutereka okwa Buli Lunaku) oba 2 (Ensente z’Obulamu).\n4. Oteekamu omuwendo gw’ensente (ng’ekyokulabirako UGX 2,000 oba UGX 5,000).\n5. Oteekamu PIN yo eya Mobile Money okukakasa.\n6. Ensente zituukirawo ku akawunti ya EcoBank ey’ekibiina, era ffeena tufuna SMS ekakasa.',
    tags: ['Relworx', 'USSD', '*217#', 'mobile money', 'MTN', 'Airtel', 'sms'],
  },
  {
    id: 'sav-3',
    category: 'savings',
    questionEn: 'Can our youth group access commercial loans without land title collateral?',
    questionLg: 'Ekibiina kyaffe kisobola okufuna ebyewolo mu bbanka awatali kuteekaayo bbaluwa za ttaka?',
    answerEn: 'Yes! Enganda eliminates the requirement for physical land titles or motor vehicle logbooks:\n• Alternative Cash-Flow Scoring: EcoBank reviews verified transaction history generated through daily Relworx Mobile Money savings over 90 days.\n• Group Mutual Guarantee: Group members cross-guarantee each other under cooperative bylaws.\n• Blended Credit Fund: Subsidized interest rates (8% to 12% p.a. vs 30% per month charged by informal street loan sharks).\n• Capital Deployment: Funds are wired directly to purchase bulk materials (timber, steel, sewing machinery) or working capital.',
    answerLg: 'Yeeko, ddala ddala! Enganda yaggyawo obwetaavu bw’okuleeta ebyapa by’ettaka oba kaada z’emmotoka:\n• Okukebera Entambula y’Ensimbi: EcoBank ekebera ensente eziyingira ku Relworx mu nnaku 90 okusalawo obusobozi bw’ekibiina.\n• Okwesigalirako Bammemba: Bammemba bayimiriraganawo bokka na bokka wansi w’amateeka ga SACCO.\n• Amagoba Agatono: Amagoba ga bbanka matono (8%–12% ku mwaka) okusinziira ku babbi b’omu luguudo abajja 30% buli mwezi.\n• Ensente zikozesebwa butereevu okugula ebyuma, embaawo, ebyuma by’okutunga, oba ebyuma by’okuzimba.',
    tags: ['loans', 'credit', 'collateral', 'interest', 'ebyewolo', 'amabanja'],
  },

  // 3. TREE-PLANTING & ENVIRONMENTAL INITIATIVES
  {
    id: 'tree-1',
    category: 'tree-planting',
    questionEn: 'What is the partnership with Entebbe Municipal Council for tree planting?',
    questionLg: 'Enkolagana n’olukiiko lw’ekibuga ky’e Ntebbe ku by’okusimba emiti etambula etya?',
    answerEn: 'Enganda holds an official municipal green concession with Entebbe Municipal Council:\n• Designated Shoreline Zones: Youth groups are allocated specific conservation belts along the Lake Victoria buffer zone (e.g., Kigungu, Manyago, Bugonga, Kasenyi corridors).\n• Municipal Seedling Nurseries: Council provides indigenous seedlings and nursery space for groups specializing in urban forestry (like Nkumba Urban Farmers).\n• Civic Pride & Income: Youth are paid municipal green care stipends for maintaining and protecting growing trees, transforming street youth into recognized environmental stewards.',
    answerLg: 'Enganda erina endagaano ey’omutendo n’olukiiko lw’ekibuga ky’e Ntebbe:\n• Ebifo Eby’enjawulo ku Nnalubaale: Ebibiina biweebwa ettaka ly’olubalama lwa Lake Victoria okusimbako emiti (Kigungu, Manyago, Bugonga, ne Kasenyi).\n• Amatendekero g’Emiti: Olukiiko luwa ensigo z’emiti n’ebifo eby’okukuulira emiti ng’abavubuka b’e Nkumba bwe bakola.\n• Ensente n’Ekitiibwa: Abavubuka bafuna ensente z’okulabirira emiti gino okuva mu lukiiko lw’ekibuga, ne kikyusa erinnya lyabwe mu bantu.',
    tags: ['Entebbe Council', 'Lake Victoria', 'shoreline', 'concession', 'olukiiko', 'ekibuga'],
  },
  {
    id: 'tree-2',
    category: 'tree-planting',
    questionEn: 'How does the UGX 10,000 tree sponsorship mechanism work?',
    questionLg: 'Enteekateeka ey’okusasulira omuti ku UGX 10,000 ekola etya?',
    answerEn: 'When a citizen, diaspora donor, or corporate partner sponsors a tree for UGX 10,000:\n1. UGX 4,000 procures a certified indigenous sapling (Musizi, Mahogany, Prunus Africana, or fruit species) from a youth-run nursery.\n2. UGX 4,000 provides direct labor stipends to local youth groups for planting, mulching, fencing, and 12-month watering.\n3. UGX 2,000 is deposited into the youth cooperative’s mutual emergency health and welfare reserve in EcoBank.\nEvery sponsored tree is geotagged with GPS coordinates and tracked on the Enganda public dashboard.',
    answerLg: 'Omuntu, Munnayuganda ali ebweru, oba kkampuni bw’asasula UGX 10,000 okusimba omuti:\n1. UGX 4,000 zigula endokwa y’omuti ogw’ekinnansi (Musizi, Mahogany, oba emiti gy’ebibala) okuva mu bavubuka abagikuula.\n2. UGX 4,000 zisasulwa abavubuka abasimba, abasiba enkomera, n’okufukirira omuti okumala omwaka mulamba.\n3. UGX 2,000 ziteekebwa mu akawunti ya EcoBank ey’ekibiina ng’ensente z’obulamu n’okuyambagana mu bizibu.\nBuli muti gukubibwako ennamba ya GPS okumanya we guli ku mpewo za Enganda.',
    tags: ['sponsorship', 'tree cost', 'UGX 10000', 'stipend', 'GPS', 'simbisa omuti'],
  },
  {
    id: 'tree-3',
    category: 'tree-planting',
    questionEn: 'What indigenous tree species are approved for planting in Greater Entebbe?',
    questionLg: 'Miti ki egy’ekinnansi egikkirizibwa okusimbibwa mu kibuga ky’e Ntebbe?',
    answerEn: 'Approved species are selected in consultation with the National Forestry Authority (NFA) and Entebbe Municipal Environment Office:\n• Indigenous Canopy Trees: Maesopsis eminii (Musizi), Khaya anthotheca (African Mahogany), Cordia africana (Mukebu), and Prunus africana.\n• Soil Stabilizers & Lakeshore Wetlands: Syzygium cordatum (Water Berry) and Bamboo species for lake buffer stabilization.\n• Nutritional & Agroforestry: Avocado, Mango, Jackfruit (Fene), and Guava for community urban food security.\nInvasive and water-depleting species (like eucalyptus near lake wetlands) are strictly prohibited.',
    answerLg: 'Emiti egikkirizibwa gyalondeddwa wamu ne kitongole kya NFA n’abakugu b’ekibuga ky’e Ntebbe:\n• Emiti gya Wano: Musizi, Mahogany, Mukebu, n’emiti emitonotono egy’omutindo.\n• Emiti Gy’Ettaka ku Nnalubaale: Emiti egy’amazzi (Water berry) n’ebiko goongolo okuziyiza ettaka okukulukuta mu nnyanja.\n• Emiti gy’Ebibala: Ovacado, Muyembe, Fene, n’Amapera okuliisa abantu mu byalo.\nEmiti egyonona amazzi ng’ebikalitusi tebikkirizibwa kumpi na mazzi ga Nnalubaale.',
    tags: ['species', 'indigenous', 'mahogany', 'musizi', 'NFA', 'emiti', 'ebibala'],
  },
];

// Helper to automatically detect language based on input text
export function detectLanguageFromText(text: string): 'en' | 'lg' {
  if (!text || text.trim().length === 0) return 'en';
  
  const lower = text.toLowerCase();
  
  // High-confidence Luganda linguistic indicators and common words
  const lugandaKeywords = [
    'otya', 'nze', 'ffe', 'gwe', 'bano', 'ebibiina', 'ekibiina', 'ssente', 'emiti', 'simba',
    'omuti', 'kola', 'mirimu', 'bavubuka', 'ntebbe', 'mukwano', 'webale', 'mwebale', 'kiki',
    'ani', 'wa', 'lwaki', 'tulina', 'tuyambe', 'bangi', 'mu', 'ku', 'buli', 'nnyo', 'kyusa',
    'awaka', 'amateeka', 'bbanka', 'amagoba', 'luno', 'bano', 'ebweru', 'kufuna', 'bagamba',
    'katono', 'olunaku', 'obulamu', 'enkulaakulana', 'katale', 'mpozzi', 'ng’', 'nga'
  ];

  let lugandaScore = 0;
  for (const kw of lugandaKeywords) {
    // Check whole word match or strong substring
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    if (regex.test(lower)) {
      lugandaScore += 2;
    }
  }

  // Common english keywords
  const englishKeywords = [
    'how', 'what', 'when', 'where', 'why', 'can', 'is', 'the', 'does', 'group', 'register',
    'savings', 'tree', 'account', 'bank', 'ecobank', 'relworx', 'planting', 'loan', 'cost'
  ];
  let englishScore = 0;
  for (const kw of englishKeywords) {
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    if (regex.test(lower)) {
      englishScore += 1;
    }
  }

  return lugandaScore > englishScore ? 'lg' : 'en';
}
