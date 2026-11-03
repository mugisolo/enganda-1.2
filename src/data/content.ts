import { Founder, InstitutionalPartner, YouthGroup } from '../types';

export const GANDA_LOGO = '/assets/aistudio/Ganda_Logo_a85ad846.png';
export const FAVICON_LOGO = '/assets/aistudio/favicon_b3fa93cd.png';
export const HERO_IMAGE = '/src/assets/images/hero_youth_artisan_uganda_1792553825150.jpg';
export const TREE_PLANTING_IMAGE = '/src/assets/images/pillar_community_tree_planting_1792553825337.jpg';
export const FOUNDER_MUGISA_IMAGE = '/src/assets/images/founder_mugisa_solomon_1792553824917.jpg';
export const FOUNDER_RONNIE_IMAGE = '/src/assets/images/founder_ronnie_tumusiime_1792553825367.jpg';

export const TRANSLATIONS = {
  en: {
    brandTagline: 'Uganda Youth Economic Formalization',
    protocolSubtitle: 'Indigenous Trust Protocol · Entebbe',
    nav: {
      home: 'Home',
      about: 'About Us',
      pillars: 'The 3 Pillars',
      pilot: 'Pilot & Scale',
      impact: 'Impact Stories',
      invest: 'Invest',
      founders: 'Leadership',
      partners: 'Partners',
      userPortal: 'User Portal',
      adminPortal: 'Admin Portal',
      partnerCta: 'Partner With Us',
      registerGroup: 'Register Your Group',
      sponsorTree: 'Sponsor a Tree / Support',
      ussdPrompt: 'Dial *217# for basic phones',
      whatsappCta: 'Chat on WhatsApp',
    },
    hero: {
      kicker: 'Social Enterprise for Youth Economic Transformation',
      headline: 'Organizing the Informal. Powering Uganda’s Youth Economy.',
      subheadline:
        'Transforming 2 million informal youth under 30 from overlooked workers into structured, bankable, and impact-driven market leaders.',
      ctaPrimary: 'Partner With Us',
      ctaSecondary: 'Register Your Group',
      ctaTertiary: 'Sponsor a Tree (UGX 10k)',
      metrics: [
        { label: 'Youth Formalized', value: '2,200+', detail: 'Entebbe Pilot Phase' },
        { label: 'Active Pilot Groups', value: '21', detail: 'Greater Entebbe Zone' },
        { label: 'Core Pillars Executed', value: '3', detail: 'Skills, Capital, Action' },
        { label: 'National Target', value: '2,000,000', detail: 'By 2032 Nationwide' },
      ],
    },
    problem: {
      kicker: 'The Macroeconomic Imperative',
      title: 'Bridging Uganda’s Informal Sector Divide',
      description:
        'Over 80% of young Ugandan workers operate outside formal financial systems—lacking legal identity, credit histories, and social security. Enganda builds the structural bridge.',
      cards: [
        {
          title: 'Unstructured Informal Reality',
          stat: '$2.8B Lost Annual Output',
          description:
            'Fragmented youth artisans, boda operators, and fabricators cannot access commercial bank loans, public tenders, or social health insurance.',
          traits: [
            'No corporate or cooperative legal registration (URSB)',
            'Predatory money lenders charging 20% to 50% monthly interest',
            'Zero collective bargaining power or structured apprenticeships',
            'No environmental contribution or municipal alignment',
          ],
        },
        {
          title: 'The Enganda Structured Unit',
          stat: '100% Bankable & Credit-Ready',
          description:
            'Informal youth groups are incorporated into legal entities, linked to EcoBank accounts, and run on Relworx automated mobile money treasury systems.',
          traits: [
            'URSB registered cooperative society or entity',
            'Commercial EcoBank group checking and micro-credit facility',
            'Transparent automated Relworx USSD payment gateway (*217#)',
            'Active municipal tree-planting concessions and civic leadership',
          ],
        },
      ],
    },
    pillars: {
      kicker: 'Our Three Operating Anchors',
      title: 'The Enganda Transformation Flywheel',
      description:
        'A sequential intervention transforming vulnerable informal workers into disciplined, scalable, credit-ready business clusters.',
      tabs: [
        {
          id: 'skilling',
          number: '01',
          name: 'Skilling & Technical Capacity',
          tagline: 'Vocational mastery, tool mastery & digital bookkeeping',
          summary:
            'Equipping informal youth artisans with modern fabrication, eco-construction, solar mechanics, and digital shopkeeping tools to multiply product value.',
          deliverables: [
            'Certified modular vocational apprenticeships with regional master artisans',
            'Safety standard gear and high-efficiency shared tooling pools',
            'Digital transaction tracking and basic enterprise accounting',
            'Product standardization for institutional and government procurement',
          ],
          pilotMetric: '1,480 youth completed master artisan certifications in Entebbe',
        },
        {
          id: 'incubation',
          number: '02',
          name: 'Business Development & Incubation',
          tagline: 'Legal formalization, EcoBank accounts & Relworx gateway',
          summary:
            'Transitioning loose groups into registered legal entities with commercial banking access and automated mobile money treasury operations.',
          deliverables: [
            'URSB legal registration as SACCOs or Companies Limited by Guarantee',
            'Opening dedicated EcoBank Uganda group commercial bank accounts',
            'Relworx USSD gateway integration for member dues and customer collections',
            'Alternative credit scoring built from real daily Mobile Money cash flows',
          ],
          pilotMetric: '18 of 21 pilot groups fully banked with EcoBank accounts',
        },
        {
          id: 'mindset',
          number: '03',
          name: 'Mindset Transformation & Civic Action',
          tagline: 'Tree planting, lakeshore conservation & community ownership',
          summary:
            'Instilling collective discipline and environmental guardianship through municipal tree planting, sanitation drives, and mutual solidarity funds.',
          deliverables: [
            'Mandatory group tree-planting concessions with Entebbe Municipal Council',
            'Lake Victoria shoreline restoration and municipal waste-to-energy projects',
            'Internal group emergency health funds and mutual peer support',
            'Civic leadership and non-violent youth empowerment dialogues',
          ],
          pilotMetric: '24,250+ indigenous trees planted across Greater Entebbe',
        },
      ],
    },
    pilot: {
      kicker: 'Greater Entebbe Operational Benchmark',
      title: 'The 21-Group Pilot: Proof of Concept at Work',
      description:
        'Across Entebbe Division A, Division B, and Katabi Town Council, Enganda has mobilized and structured 2,206 informal workers across 21 economic units.',
      filterAll: 'All Divisions',
      filterTrade: 'All Trades',
      statusBanked: 'Formalized & Banked',
      statusIncubation: 'In Incubation',
      statusSkilling: 'Skilling Phase',
      viewDirectory: 'Group Directory',
      viewRoadmap: 'National Roadmap',
      viewMap: 'Interactive Uganda Map',
    },
    mapSection: {
      kicker: 'Interactive Geographical Expansion',
      title: 'Uganda Municipalities & Pilot Grid',
      description:
        'Explore the active Greater Entebbe pilot benchmark and interactive scalability data across Greater Kampala, Jinja, Mbarara, and Gulu.',
      activeZoneTag: 'Active Benchmark',
      scalingZoneTag: 'Scaling Cohort',
      plannedZoneTag: 'Expansion Planned',
      horizonZoneTag: 'National Horizon',
      readiness: 'Readiness Score',
      youthEnrolled: 'Youth Enrolled',
      treesPlanted: 'Trees Planted',
      clustersHeader: 'Key Artisan Clusters',
      subDivisionsHeader: 'Sub-Divisions Covered',
      bankingBadge: 'Financial Gateway',
      switchMunicipality: 'Select Municipality',
    },
    roadmap: {
      kicker: 'Scale Pathway to 2,000,000 Youth',
      title: 'Our Phased Nationwide Expansion Plan',
      phases: [
        {
          phase: 'Phase 1 (2024–2025)',
          region: 'Greater Entebbe Benchmark',
          target: '2,200 Youth · 21 Groups',
          status: 'Active & Validated',
          description:
            'Tested municipal partnership with Entebbe Municipal Council, integrated EcoBank banking, and deployed Relworx MoMo collection.',
        },
        {
          phase: 'Phase 2 (2026–2027)',
          region: 'Greater Kampala Metropolitan',
          target: '50,000 Youth · 450 Groups',
          status: 'Scaling Cohort',
          description:
            'Expanding across Kawempe, Nakawa, Makindye, Rubaga, and Central divisions through local artisan hubs.',
        },
        {
          phase: 'Phase 3 (2028–2029)',
          region: 'Eastern & Industrial Belt (Jinja, Mbale, Tororo)',
          target: '250,000 Youth · 2,200 Groups',
          status: 'Planned',
          description:
            'Focusing on agro-processing value addition, light industrial supply chains, and Lake Victoria fisheries.',
        },
        {
          phase: 'Phase 4 (2030–2031)',
          region: 'Western & South-Western Corridor (Mbarara, Fort Portal, Kasese)',
          target: '750,000 Youth · 6,500 Groups',
          status: 'Planned',
          description:
            'Mobilizing rural-urban youth cooperatives in dairy processing, horticulture, and artisanal fabrication.',
        },
        {
          phase: 'Phase 5 (2032+)',
          region: 'Northern & Albertine Basin (Gulu, Lira, Arua, Hoima)',
          target: '2,000,000 Youth · 18,000 Groups',
          status: 'National Scale Horizon',
          description:
            'Full national saturation, establishing a permanent economic springboard for East Africa’s largest youth cohort.',
        },
      ],
    },
    founders: {
      kicker: 'Executive Leadership & Ground Mobilizers',
      title: 'The Architects Behind Enganda',
      subtitle:
        'Combining frontline community credibility in Uganda with institutional strategy and financial architecture.',
    },
    partners: {
      kicker: 'Institutional Alignment',
      title: 'Strategic Governance & Commercial Partners',
      subtitle:
        'Enganda operates through institutional bridges connecting grassroots youth groups to tier-one commercial banks, municipal governments, and international development funders.',
    },
    adminPortal: {
      title: 'Enganda Command & Administration Portal',
      subtitle: 'Central operations console for monitoring and updating every part of the Enganda platform.',
      tabs: {
        overview: 'System Overview',
        groups: 'Manage Youth Groups',
        payments: 'Relworx MoMo Ledger',
        settings: 'Site Announcements & Intake',
      },
      addNewGroupBtn: 'Add New Youth Group',
      editGroupBtn: 'Edit Group',
      deleteGroupBtn: 'Delete',
      saveChanges: 'Save Changes',
      cancel: 'Cancel',
      syncSuccess: 'Settings synchronized across live platform.',
    },
    userPortal: {
      title: 'Enganda Role Portal',
      subtitle: 'Select your stakeholder role to access tailored tools, real-time ledgers, and governance resources.',
      roles: {
        donor: 'Donor / Tree Sponsor',
        partner: 'Institutional Partner',
        member: 'Youth Group Leader / Member',
      },
      donor: {
        title: 'Tree Sponsor & Supporter Portfolio',
        treesPlantedNotice: 'Your contributions directly fund indigenous tree planting along Lake Victoria shoreline.',
        gpsBadge: 'GPS Verified Concessions',
        taxReceiptBtn: 'Download Impact Tax Certificate',
        recurringSponsorship: 'Recurring Relworx MoMo Sponsorship',
      },
      partner: {
        title: 'Institutional Partner & Bank Portal',
        subtitle: 'EcoBank, Entebbe Municipal Council, Relworx & EU Compliance Console',
        kycStatus: 'KYB / KYC Group Approvals',
        grantTracking: 'EU / Development Co-Financing Tranches',
        downloadMoU: 'Download Signed Municipal MoU',
      },
      member: {
        title: 'Youth Group Cooperative Workspace',
        subtitle: 'Manage legal registration, EcoBank accounts, and daily Relworx dues.',
        legalStatus: 'URSB Cooperative Status',
        ecobankLedger: 'EcoBank Group Commercial Account',
        momoDues: 'Daily Relworx Member Dues (*217#)',
        orderCertificate: 'Request Master Artisan Apprenticeship Cert',
      },
    },
  },
  lg: {
    brandTagline: 'Okutegeka Ebyenfuna by’Abavubuka mu Uganda',
    protocolSubtitle: 'Enkola ey’Obwesige ey’Ekinnansi · Entebbe',
    nav: {
      home: 'Awaka',
      about: 'Ebikwata ku Ffe',
      pillars: 'Empagi Essatu',
      pilot: 'Ebikolebwa mu Ntebbe',
      impact: 'Ebibala n’Engero',
      invest: 'Teeka Ensimbi (Invest)',
      founders: 'Abakulembeze',
      partners: 'Bannamikago',
      userPortal: 'Wofiisi y’Abakozesa',
      adminPortal: 'Wofiisi y’Abakungu (Admin)',
      partnerCta: 'Kola Naffe',
      registerGroup: 'Wandiisa Ekibiina Kyo',
      sponsorTree: 'Simbisa Omuti / Yamba',
      ussdPrompt: 'Kozesa *217# ku ssimu eyabulijjo',
      whatsappCta: 'Chat ku WhatsApp',
    },
    hero: {
      kicker: 'Enkulaakulana y’Ebyenfuna by’Abavubuka',
      headline: 'Okutegeka Abakozi b’Ebweru. Okunyweza Ebyenfuna by’Uganda.',
      subheadline:
        'Tukyuusa abavubuka obukadde bubiri (2M) wansi w’emyaka 30 okuva mu bakozi abatabalibwa okufuuka ebibiina ebitegeke, ebyewola era ebitwala ebyenfuna mu maaso.',
      ctaPrimary: 'Kola Naffe nga Partner',
      ctaSecondary: 'Wandiisa Ekibiina Kyo',
      ctaTertiary: 'Simbisa Omuti (UGX 10k)',
      metrics: [
        { label: 'Abavubuka Abawandiikiddwa', value: '2,200+', detail: 'Omulimu gw’e Ntebbe' },
        { label: 'Ebibiina Ebikola', value: '21', detail: 'Mu Ntebbe ne Katabi' },
        { label: 'Empagi Ezikola', value: '3', detail: 'Obukugu, Ensente, n’Ebikolwa' },
        { label: 'Ekigendererwa mu Ggwanga', value: '2,000,000', detail: 'Okutuuka mu 2032' },
      ],
    },
    problem: {
      kicker: 'Obuzibu bw’Ebyenfuna mu Uganda',
      title: 'Okugatta Abakozi b’omu Ghetto ku Nsente Ez’amazima',
      description:
        'Ebitundu ebisoba mu 80% ku bavubuka abakola mu Uganda tebabalibwa mu bbanka, tebalina biwandiiko bya mateeka era tebasobola kwewola. Enganda ye lutindo olugatta ensonga zino.',
      cards: [
        {
          title: 'Obulamu bw’Omukozi atali mu Mateeka',
          stat: 'Doola Obuwumbi $2.8 Ezibulankanyizibwa',
          description:
            'Abavubuka abasiba amabaati, abakanika, n’aba boda boda tebasobola kufuna kyeeyo kya bbanka oba bwesige mu bitongole.',
          traits: [
            'Tewali biwandiiko bya mateeka okuva mu URSB',
            'Ab’ebbanja abanyaga amagoba agawera 20% okutuuka 50% buli mwezi',
            'Tewali mutindo gwa mirimu gukakasiddwa',
            'Tewali nkolagana n’olukiiko lw’ekibuga mu kulongoosa ebyalo',
          ],
        },
        {
          title: 'Ekibiina Ekitegekeddwa Enganda',
          stat: '100% Ekyewola era Ekiterekebwa',
          description:
            'Ebibiina by’abavubuka biwandiikibwa mu mateeka, bifebwa akawunti mu EcoBank, era bikolera ku sisitemu ya Relworx ey’amasimu.',
          traits: [
            'Olukalala lwa SACCO olwawandiikibwa mu URSB',
            'Akawunti ya Bbanka mu EcoBank Uganda ewa ebyewolo ebitono',
            'Relworx USSD (*217#) okukung’aanya omusolo gw’ekibiina ku Mobile Money',
            'Okwongera okulongoosa Entebbe nga basimba emiti',
          ],
        },
      ],
    },
    pillars: {
      kicker: 'Empagi Zaffe Essatu',
      title: 'Enkola y’Okukyusa Abavubuka',
      description:
        'Empagi zino zikola awamu okuzimba abavubuka okuva mu bwavu okutuuka ku ddaala ly’okubeera n’emirimu egituufu.',
      tabs: [
        {
          id: 'skilling',
          number: '01',
          name: 'Okubangula n’Obukugu mu Mirimu',
          tagline: 'Okukanika, okubaza ebyuma, n’okubala ensente ku ssimu',
          summary:
            'Okusomesa abavubuka obukugu obutuufu mu kukanika emmotoka, okubaza embaawo, okuzimba, n’okukola amanda ag’obusa ku mutindo ogw’ensi yonna.',
          deliverables: [
            'Okutendekebwa n’abakugu abamanyiddwa mu kitundu',
            'Ebyuma n’eby’okwerinda ebiri ku mutindo omutuufu',
            'Okutegeka ebitabo by’ensente n’okwekebejja amagoba',
            'Okukola ebyamaguzi ebisobola okugulibwa gavumenti ne bbanka',
          ],
          pilotMetric: 'Abavubuka 1,480 bamaze okufuna satifikeeti mu Ntebbe',
        },
        {
          id: 'incubation',
          number: '02',
          name: 'Okutandika n’Okukuza Ebibiina',
          tagline: 'Ebiwandiiko bya URSB, Akawunti za EcoBank, ne Relworx',
          summary:
            'Okufuula ebibiina by’abavubuka ebitongole mu mateeka nga birina akawunti mu bbanka n’enkola y’okusasulirako ku Mobile Money.',
          deliverables: [
            'Okubiwandiisa mu URSB nga SACCO oba kkampuni y’obwannanyini',
            'Okuggulawo akawunti z’ekibiina mu EcoBank Uganda',
            'Okussaako enkola ya Relworx USSD (*217#) okukung’aanya ensente',
            'Okufuna ebbanja ery’amagoba amatono nga basinziira ku Mobile Money',
          ],
          pilotMetric: 'Ebibiina 18 ku 21 bifiiriddwa akawunti za EcoBank',
        },
        {
          id: 'mindset',
          number: '03',
          name: 'Okukyusa Endowooza n’Okukolera Awamu',
          tagline: 'Okusimba emiti, okulongoosa ennyanja, n’obuyambi bw’obulamu',
          summary:
            'Okugatta abavubuka okubeera abasaale mu kukuuma obutonde, okusimba emiti mu Ntebbe, n’okwerwanako mu bulwadde.',
          deliverables: [
            'Endagaano n’olukiiko lw’ekibuga ky’e Ntebbe okusimba emiti',
            'Okulongoosa olubalama lw’ennyanja Nalubaale (Lake Victoria)',
            'Ensente z’obulwadde ez’ekibiina (Emergency Health Funds)',
            'Enteeseganya z’emirembe n’obukulembeze obulungi mu bavubuka',
          ],
          pilotMetric: 'Emiti 24,250+ gisimbiddwa mu Ntebbe ne Katabi',
        },
      ],
    },
    pilot: {
      kicker: 'Omusingi gw’Ebikolebwa mu Ntebbe',
      title: 'Ebibiina 21 Eby’Omusingi: Obukakafu Obukola',
      description:
        'Mu Ntebbe Division A, Division B, ne Katabi Town Council, Enganda eteese abavubuka 2,206 mu bibiina 21 eby’enjawulo.',
      filterAll: 'Ebitundu Byonna',
      filterTrade: 'Emirimu Gyonna',
      statusBanked: 'Biwandiise & Byakawunti',
      statusIncubation: 'Biri mu Kutendekebwa',
      statusSkilling: 'Bikyaliko Obukugu',
      viewDirectory: 'Olukalala lw’Ebibiina',
      viewRoadmap: 'Enteekateeka y’Eggwanga',
      viewMap: 'Mmaapu y’Uganda Ey’amasanyu',
    },
    mapSection: {
      kicker: 'Mmaapu n’Enkulaakulana y’Ebitundu',
      title: 'Obukiiko bw’Ebibuga n’Ebibiina by’Abavubuka',
      description:
        'Kebera ebibiina 21 ebiri mu Ntebbe n’enteekateeka y’okugaziya mu Kampala, Jinja, Mbarara, ne Gulu.',
      activeZoneTag: 'Ekitundu Ekikola',
      scalingZoneTag: 'Ekigaziya',
      plannedZoneTag: 'Ekyategekebwa',
      horizonZoneTag: 'Ekigendererwa Ekikulu',
      readiness: 'Okwetegeka kw’Ekitundu',
      youthEnrolled: 'Abavubuka Abali mu Bibiina',
      treesPlanted: 'Emiti Egisimbiddwa',
      clustersHeader: 'Emirimu Egikolebwa mu Kitundu',
      subDivisionsHeader: 'Ebitundu Ebitwaliddwa',
      bankingBadge: 'Enkola ya Bbanka n’Amasimu',
      switchMunicipality: 'Londa Ekibuga',
    },
    roadmap: {
      kicker: 'Engeri gye Tuligaziyaamu mu Ggwanga',
      title: 'Enteekateeka y’Okutuuka ku Bavubuka 2,000,000',
      phases: [
        {
          phase: 'Phase 1 (2024–2025)',
          region: 'Entebbe ne Katabi',
          target: 'Abavubuka 2,200 · Ebibiina 21',
          status: 'Bikoleddwa & Bikakasiddwa',
          description:
            'Enkolagana n’olukiiko lw’ekibuga ky’e Ntebbe, bbanka ya EcoBank, ne Relworx MoMo gateway.',
        },
        {
          phase: 'Phase 2 (2026–2027)',
          region: 'Kampala n’Emikalo (Greater Kampala)',
          target: 'Abavubuka 50,000 · Ebibiina 450',
          status: 'Tubitandise',
          description:
            'Okugaziya mu Kawempe, Nakawa, Makindye, Rubaga, ne Central Division.',
        },
        {
          phase: 'Phase 3 (2028–2029)',
          region: 'Ebuvanjuba (Jinja, Mbale, Tororo)',
          target: 'Abavubuka 250,000 · Ebibiina 2,200',
          status: 'Kitegekeddwa',
          description:
            'Okukolera ku by’obulimi, eby’ebyennyanja mu Nnalubaale, n’ebyuma eby’omulembe.',
        },
        {
          phase: 'Phase 4 (2030–2031)',
          region: 'Ebugwanjuba (Mbarara, Fort Portal, Kasese)',
          target: 'Abavubuka 750,000 · Ebibiina 6,500',
          status: 'Kitegekeddwa',
          description:
            'Amata, ebibala, n’ebibiina by’abakanisi b’ebyamaguzi eby’omu byalo.',
        },
        {
          phase: 'Phase 5 (2032+)',
          region: 'Obukiikakkono n’Enkingizo za Albertine (Gulu, Lira, Arua, Hoima)',
          target: 'Abavubuka 2,000,000 · Ebibiina 18,000',
          status: 'Ekigendererwa Ekikulu',
          description:
            'Eggwanga lyonna okuba n’abavubuka abakola mu bibiina ebitegeke era ebiwola.',
        },
      ],
    },
    founders: {
      kicker: 'Abakulembeze Abatandisi',
      title: 'Abatandisi b’Omusingi gwa Enganda',
      subtitle:
        'Bwe bwegassi bw’obukugu obw’omu bavubuka n’enteekateeka z’ebyenfuna eby’amazima mu bbanka.',
    },
    partners: {
      kicker: 'Bannamikago b’Ebyenfuna',
      title: 'Bbanka, Gavumenti z’Ebitundu, ne Banna-Kibiina',
      subtitle:
        'Enganda ekola ne bbanka ez’amaanyi, obukiiko bw’ebibuga, ne kkampuni z’amasimu okutwala abavubuka mu maaso.',
    },
    adminPortal: {
      title: 'Wofiisi y’Abakungu ne Bammemba (Admin Console)',
      subtitle: 'Enfo y’okulondoola n’okukyusa buli kitundu ku webusayiti ya Enganda.',
      tabs: {
        overview: 'Ebikwata ku Sisitemu',
        groups: 'Kyusa Ebibiina by’Abavubuka',
        payments: 'Ebitabo bya Relworx MoMo',
        settings: 'Ebitegeezo n’Okwewandiisa',
      },
      addNewGroupBtn: 'Gattako Ekibiina Ekipya',
      editGroupBtn: 'Kyusa Ekibiina',
      deleteGroupBtn: 'Ggyawo',
      saveChanges: 'Kaza Enkyukakyuka',
      cancel: 'Sazaamu',
      syncSuccess: 'Enkyukakyuka zikaziddwa ku webusayiti yonna.',
    },
    userPortal: {
      title: 'Wofiisi y’Abakozesa Sisitemu (User Roles)',
      subtitle: 'Londa ekifo kyo okufuna ebikwata ku ssente, ebiwandiiko bya bbanka, oba okusimba emiti.',
      roles: {
        donor: 'Awaayo / Asimbisa Emiti (Donor)',
        partner: 'Munamukago (EcoBank / EU / Council)',
        member: 'Omukulembeze w’Ekibiina / Mmemba',
      },
      donor: {
        title: 'Ebiwandiiko by’Asimbisa Emiti n’Omuwi w’Obuyambi',
        treesPlantedNotice: 'Ssente zo zikozesebwa butereevu okusimba emiti ku lubalama lw’ennyanja Nalubaale.',
        gpsBadge: 'Emiti Giri ku GPS',
        taxReceiptBtn: 'Funa Satifikeeti y’Obuyambi',
        recurringSponsorship: 'Simbisa Emiti buli Mwezi ku Relworx',
      },
      partner: {
        title: 'Wofiisi ya Bannamikago n’Ebitongole',
        subtitle: 'EcoBank, Entebbe Municipal Council, Relworx & EU Console',
        kycStatus: 'Okukakasa Ebibiina mu Bbanka',
        grantTracking: 'Ensimbi z’Enkulaakulana eziva mu EU',
        downloadMoU: 'Koppa Endagaano y’Enkolagana (MoU)',
      },
      member: {
        title: 'Wofiisi y’Ekibiina ky’Abavubuka',
        subtitle: 'Laba ebiwandiiko bya URSB, akawunti ya EcoBank, n’okusasula ku Relworx.',
        legalStatus: 'Ebiwandiiko bya SACCO mu URSB',
        ecobankLedger: 'Akawunti y’Ekibiina mu EcoBank',
        momoDues: 'Omusolo gw’Ekibiina buli Lunaku (*217#)',
        orderCertificate: 'Saba Satifikeeti y’Obukugu',
      },
    },
  },
};

export const FOUNDERS: Founder[] = [
  {
    name: 'Mugisa Solomon Byakutaaga',
    role: 'Founder & Executive Director',
    title: 'Grassroots Systems Architect & Community Mobilizer',
    bioEn:
      'Mugisa is a dedicated social entrepreneur with deep operational roots across Uganda’s urban informal communities. Having mobilized over 2,200 informal artisans and boda operators in Greater Entebbe, Mugisa bridges the cultural trust gap between ghetto youth and formal institutions, championing legal registration, peer accountability, and municipal tree planting.',
    bioLg:
      'Mugisa mukulembeze omutandisi alina obukugu mu kutabaganya n’okutegeka abavubuka mu bibiina by’ebweru w’enkola. Asomesezza n’okugatta abavubuka abasoba mu 2,200 mu Ntebbe, ng’ateeka essira ku buwandiike bw’amateeka, okwesiga kw’abavubuka, n’okusimba emiti.',
    focus: [
      'Grassroots Community Mobilization & Governance',
      'Informal Cluster Organizing (Artisans, Boda Boda, Mechanics)',
      'Municipal Concessions & Tree Planting Leadership',
      'Peer-Accountability & Youth Mindset Transformation',
    ],
    image: FOUNDER_MUGISA_IMAGE,
    quote:
      '"Uganda’s informal youth do not need charity handouts; they need structural organization, legal identity, and bankable trust bridges."',
  },
  {
    name: 'Ronnie Tumusiime',
    role: 'Co-Founder & Head of Strategy',
    title: 'Financial Systems Architect & Partnerships Lead',
    bioEn:
      'Ronnie leads strategic institutional alignment, commercial banking partnerships with EcoBank, fintech integration with Relworx, and European Union (EU) development governance. With extensive experience in African fintech frameworks and blended-finance architecture, Ronnie structures informal youth cash flows into investment-ready balance sheets.',
    bioLg:
      'Ronnie akulembera enteekateeka z’enkolagana n’ebitongole ebinene, omuli bbanka ya EcoBank, kkampuni ya Relworx ey’amasimu, n’ebitongole by’Omukago gwa Bulaaya (EU). Alina obukugu mu by’ensente n’okutegeka amagoba g’abavubuka gasobole okukolera mu bbanka.',
    focus: [
      'Commercial Banking Architecture (EcoBank Group Credit)',
      'Relworx USSD & Mobile Money Automated Reconciliation',
      'International Development & EU Compliance Standards',
      'Impact Measurement & National Scale Engineering',
    ],
    image: FOUNDER_RONNIE_IMAGE,
    quote:
      '"When we convert cash under mattresses into automated Mobile Money ledger histories, informal workers suddenly become prime commercial bank clients."',
  },
];

export const INSTITUTIONAL_PARTNERS: InstitutionalPartner[] = [
  {
    name: 'EcoBank Uganda',
    role: 'Commercial Banking & Micro-Credit Partner',
    badge: 'Tier-1 Commercial Bank',
    descriptionEn:
      'Underwrites zero-minimum-balance group commercial checking accounts, financial literacy clinics, and cash-flow backed collective credit facilities for Enganda’s formalized youth SACCOs.',
    descriptionLg:
      'Ewa ebibiina by’abavubuka akawunti za bbanka ezitalina nsimbi z’akafubo, n’okuwa amabanja agasinziira ku nsimbi ezitambula ku ssimu.',
    deliverables: [
      'Customized Group SACCO accounts with multi-signatory governance',
      'Overdraft & equipment asset-financing facilities',
      'Direct KYC-verification fast track for informal entrepreneurs',
    ],
  },
  {
    name: 'Entebbe Municipal Council',
    role: 'Local Government & Environmental Concessions',
    badge: 'Municipal Authority',
    descriptionEn:
      'Grants formal municipal tree-planting concessions along the Lake Victoria shoreline, provides green municipal cleanup contracts, and streamlines local market trade licenses.',
    descriptionLg:
      'Ewa endagaano z’okusimba emiti ku lubaalama lw’ennyanja Nalubaale, emirimu gy’okulongoosa ekibuga, n’ebiwandiiko by’obusuubuzi eby’omu kitundu.',
    deliverables: [
      '10-Year lakeshore reforestation and municipal tree-planting concessions',
      'Prioritized municipal waste collection and recycling procurement',
      'Dedicated artisan stalls and work spaces across Division A & B',
    ],
  },
  {
    name: 'Relworx Fintech Gateway',
    role: 'USSD & Mobile Money Payment Infrastructure',
    badge: 'Fintech Payments Partner',
    descriptionEn:
      'Powers Enganda’s USSD shortcut (*217#) and web checkout, facilitating instant MTN Mobile Money and Airtel Money automated member dues collection, micro-savings, and tree sponsorships.',
    descriptionLg:
      'Kkampuni ey’ebyuma ekolera ku ssimu zonna ez’amasimu (*217#) ne webusayiti, eyanguyiza abavubuka okukung’aanya ensente zaabwe ku MTN ne Airtel.',
    deliverables: [
      'Direct USSD (*217#) integration for low-tier non-smartphone users',
      'Instant settlement for MTN Mobile Money and Airtel Money transactions',
      'Automated group dues ledger and SMS confirmation receipts',
    ],
  },
  {
    name: 'European Union (EU)',
    role: 'Governance, Youth Employment & Grant Framework',
    badge: 'International Development Partner',
    descriptionEn:
      'Provides strategic development standards, vocational training benchmarks, and grant co-financing for youth formalization and green economic transformation in Uganda.',
    descriptionLg:
      'Abawa obuyambi bw’ensente z’enkulaakulana, emitindo gy’okusomesa abavubuka emikono, n’okukuuma enkola ey’amazima.',
    deliverables: [
      'Vocational training accreditation and master artisan certification standards',
      'Third-party impact auditing and transparency monitoring',
      'Co-funding matching grants for youth cooperative capital assets',
    ],
  },
];
