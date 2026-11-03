import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  ChevronLeft,
  ChevronRight,
  Quote,
  TrendingUp,
  Building,
  Users,
  Award,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface ImpactStory {
  id: string;
  groupId: string;
  groupName: string;
  trade: string;
  tradeCategory: string;
  location: string;
  leader: string;
  role: string;
  membersCount: number;
  quoteEn: string;
  quoteLg: string;
  beforeEarningsUgx: number;
  afterEarningsUgx: number;
  growthPercentage: number;
  bankStatus: string;
  treesPlanted: number;
  image: string;
  badge: string;
}

interface FormalizationMonthPoint {
  monthEn: string;
  monthLg: string;
  formalizedYouth: number;
  registeredEnterprises: number;
  ecoBankVolumeUgxM: number;
}

const BASE_12M_FORMALIZATION_DATA: FormalizationMonthPoint[] = [
  { monthEn: "Apr '24", monthLg: "Kaf '24", formalizedYouth: 185, registeredEnterprises: 18, ecoBankVolumeUgxM: 24 },
  { monthEn: "May '24", monthLg: "Muz '24", formalizedYouth: 290, registeredEnterprises: 29, ecoBankVolumeUgxM: 38 },
  { monthEn: "Jun '24", monthLg: "Sse '24", formalizedYouth: 430, registeredEnterprises: 42, ecoBankVolumeUgxM: 56 },
  { monthEn: "Jul '24", monthLg: "Kas '24", formalizedYouth: 590, registeredEnterprises: 58, ecoBankVolumeUgxM: 79 },
  { monthEn: "Aug '24", monthLg: "Muw '24", formalizedYouth: 760, registeredEnterprises: 74, ecoBankVolumeUgxM: 105 },
  { monthEn: "Sep '24", monthLg: "Mut '24", formalizedYouth: 945, registeredEnterprises: 91, ecoBankVolumeUgxM: 134 },
  { monthEn: "Oct '24", monthLg: "Muk '24", formalizedYouth: 1150, registeredEnterprises: 112, ecoBankVolumeUgxM: 168 },
  { monthEn: "Nov '24", monthLg: "Mus '24", formalizedYouth: 1380, registeredEnterprises: 135, ecoBankVolumeUgxM: 204 },
  { monthEn: "Dec '24", monthLg: "Nte '24", formalizedYouth: 1590, registeredEnterprises: 156, ecoBankVolumeUgxM: 242 },
  { monthEn: "Jan '25", monthLg: "Gae '25", formalizedYouth: 1795, registeredEnterprises: 178, ecoBankVolumeUgxM: 285 },
  { monthEn: "Feb '25", monthLg: "Muk '25", formalizedYouth: 1970, registeredEnterprises: 196, ecoBankVolumeUgxM: 332 },
  { monthEn: "Mar '25", monthLg: "Mug '25", formalizedYouth: 2140, registeredEnterprises: 215, ecoBankVolumeUgxM: 384 },
];

const TRADE_SCALE_FACTORS: Record<string, { share: number; labelEn: string; labelLg: string }> = {
  all: {
    share: 1,
    labelEn: 'All 21 Pilot SACCOs & Artisan Clusters',
    labelLg: 'Ebibiina byonna 21 ebya SACCO mu Ntebbe',
  },
  metal: {
    share: 0.26,
    labelEn: 'Metal Fabrication & Welding Clusters',
    labelLg: 'Ebibiina by’Ababazzi b’Ebyuma n’Okusiba',
  },
  tailoring: {
    share: 0.24,
    labelEn: 'Women & Youth Tailoring Cooperatives',
    labelLg: 'Ebibiina by’Abatunzi b’Engoye n’Yunifoomu',
  },
  'clean-energy': {
    share: 0.22,
    labelEn: 'Eco-Briquettes & Waste Recovery Units',
    labelLg: 'Abakola Amanda ag’Ebisasiro n’Okukuuma Obutonde',
  },
  fisherfolk: {
    share: 0.28,
    labelEn: 'Landing Site Fisherfolk & Boat Artisans',
    labelLg: 'Abavubi n’Ababazzi b’Amaato ku Mwalo',
  },
};

const fallbackStories: ImpactStory[] = [
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

interface ImpactStoriesCarouselProps {
  onInvestInGroup?: (groupId: string, groupName: string) => void;
}

export const ImpactStoriesCarousel: React.FC<ImpactStoriesCarouselProps> = ({
  onInvestInGroup,
}) => {
  const { language } = useLanguage();
  const [stories, setStories] = useState<ImpactStory[]>(fallbackStories);
  const [tradeFilter, setTradeFilter] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [chartView, setChartView] = useState<'both' | 'youth' | 'enterprises'>('both');

  useEffect(() => {
    async function fetchStories() {
      try {
        setLoading(true);
        const url = tradeFilter === 'all' ? '/api/impact-stories' : `/api/impact-stories?trade=${tradeFilter}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.stories && data.stories.length > 0) {
            setStories(data.stories);
            setCurrentIndex(0);
          }
        }
      } catch (err) {
        console.error('Stories fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStories();
  }, [tradeFilter]);

  const activeScale = TRADE_SCALE_FACTORS[tradeFilter] || TRADE_SCALE_FACTORS.all;

  const chartData = useMemo(() => {
    return BASE_12M_FORMALIZATION_DATA.map((pt) => ({
      month: language === 'lg' ? pt.monthLg : pt.monthEn,
      formalizedYouth: Math.round(pt.formalizedYouth * activeScale.share),
      registeredEnterprises: Math.max(1, Math.round(pt.registeredEnterprises * activeScale.share)),
      ecoBankVolumeUgxM: Math.round(pt.ecoBankVolumeUgxM * activeScale.share),
    }));
  }, [language, activeScale.share]);

  const firstMonth = chartData[0];
  const latestMonth = chartData[chartData.length - 1];
  const twelveMonthGrowthPct = firstMonth.formalizedYouth > 0
    ? Math.round(((latestMonth.formalizedYouth - firstMonth.formalizedYouth) / firstMonth.formalizedYouth) * 100)
    : 0;

  const current = stories[currentIndex] || fallbackStories[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? stories.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="impact" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
              {language === 'lg' ? 'Ebibala n’Engero z’Abavubuka' : 'Evidence & Field Transformation'}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              {language === 'lg' ? 'Engero z’Obuwanguzi mu Bibiina 21' : 'Impact Stories: Voices from the 21 Pilot Groups'}
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              {language === 'lg'
                ? 'Laba engeri abavubuka b’e Ntebbe gye bakyuusizza obulamu bwabwe okuva mu kwenyinyalwa okutuuka ku ddaala ly’okubeera abasuubuzi abawandiise era abasimba emiti.'
                : 'Verified case evidence detailing how informal youth artisans in Greater Entebbe multiplied daily earnings, established formal EcoBank accounts, and undertook environmental stewardship.'}
            </p>
          </div>

          {/* Trade Filter Segmented Control */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80 overflow-x-auto self-start md:self-auto shrink-0 max-w-full">
            <button
              onClick={() => setTradeFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                tradeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'lg' ? 'Emirimu Gyonna' : 'All Trades'}
            </button>
            <button
              onClick={() => setTradeFilter('metal')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                tradeFilter === 'metal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'lg' ? 'Ebyuma n’Okusiba' : 'Metal & Welding'}
            </button>
            <button
              onClick={() => setTradeFilter('tailoring')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                tradeFilter === 'tailoring' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'lg' ? 'Okutunga Engoye' : 'Tailoring & Garments'}
            </button>
            <button
              onClick={() => setTradeFilter('clean-energy')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                tradeFilter === 'clean-energy' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'lg' ? 'Amanda ag’Ebisasiro' : 'Eco-Briquettes'}
            </button>
            <button
              onClick={() => setTradeFilter('fisherfolk')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                tradeFilter === 'fisherfolk' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'lg' ? 'Abavubi' : 'Fisherfolk'}
            </button>
          </div>
        </div>

        {/* Carousel Card Presentation */}
        <div className="relative bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[480px]">
            
            {/* Left Column: Documentary Project Success Photo */}
            <div className="lg:col-span-5 relative overflow-hidden bg-slate-900 min-h-[300px] lg:min-h-full">
              <img
                src={current.image}
                alt={current.groupName}
                className="w-full h-full object-cover transition-opacity duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              {/* Award Badge */}
              <div className="absolute top-4 left-4 bg-emerald-900/90 text-white backdrop-blur-md px-3 py-1 rounded-lg border border-emerald-700/80 text-[11px] font-bold flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>{current.badge}</span>
              </div>

              {/* Bottom Photo Overlay */}
              <div className="absolute bottom-4 inset-x-4 text-white">
                <span className="text-[11px] font-mono text-emerald-400 block font-bold">
                  {current.groupId} · {current.location}
                </span>
                <span className="text-sm font-bold block">{current.groupName}</span>
              </div>
            </div>

            {/* Right Column: Verified Impact & Leader Testimonial */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                {/* Clean unboxed metadata header */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    {current.trade}
                  </span>
                  <span className="font-mono text-slate-400 tabular-nums">
                    {loading
                      ? language === 'lg' ? 'ukeberebwa...' : 'Syncing...'
                      : `Case ${currentIndex + 1} of ${stories.length}`}
                  </span>
                </div>

                {/* Testimonial Quote */}
                <div className="relative mb-6">
                  <Quote className="w-8 h-8 text-emerald-800/20 absolute -top-2 -left-2 -z-0" />
                  <p className="text-base sm:text-lg font-medium text-slate-800 italic relative z-10 leading-relaxed">
                    "{language === 'lg' ? current.quoteLg : current.quoteEn}"
                  </p>
                </div>

                {/* Attributable Leader Identity */}
                <div className="mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-800 text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {current.leader.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{current.leader}</h4>
                    <span className="text-xs text-slate-500">{current.role} · {current.groupName}</span>
                  </div>
                </div>

                {/* Quantitative Impact Before vs After */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-white rounded-2xl border border-slate-200/90 mb-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {language === 'lg' ? 'Enfuna Ey’edda' : 'Baseline Income'}
                    </span>
                    <span className="font-mono text-xs text-slate-500 line-through tabular-nums">
                      UGX {current.beforeEarningsUgx.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {language === 'lg' ? 'buli mwezi' : 'per month'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                      {language === 'lg' ? 'Enfuna Empya' : 'Formalized Income'}
                    </span>
                    <span className="font-mono text-sm sm:text-base font-extrabold text-emerald-700 tabular-nums">
                      UGX {current.afterEarningsUgx.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 block tabular-nums">
                      +{current.growthPercentage}%
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {language === 'lg' ? 'Bammemba' : 'Members'}
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                      {current.membersCount} {language === 'lg' ? 'Abavubuka' : 'Youth'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {language === 'lg' ? 'Wansi w’emyaka 30' : 'Under 30'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {language === 'lg' ? 'Emiti ku Nnyanja' : 'Lakeshore Trees'}
                    </span>
                    <span className="font-mono text-sm font-bold text-emerald-700 tabular-nums">
                      {current.treesPlanted} {language === 'lg' ? 'Gyasimbibwa' : 'Planted'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {language === 'lg' ? 'Endagaano ya Munisipaali' : 'Municipal Pact'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Controls & Invest Action */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                
                {/* Prev / Next Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                    aria-label="Previous story"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                    aria-label="Next story"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1.5 ml-2">
                    {stories.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => setCurrentIndex(dotIdx)}
                        className={`h-1.5 rounded-full transition-all ${
                          dotIdx === currentIndex ? 'w-6 bg-emerald-800' : 'w-1.5 bg-slate-300'
                        }`}
                        aria-label={`Go to slide ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Direct Invest in this Specific Group Button */}
                <a
                  href="#invest"
                  onClick={() => {
                    if (onInvestInGroup) onInvestInGroup(current.groupId, current.groupName);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-xs"
                >
                  <span>{language === 'lg' ? 'Siga Ensimbi mu Kibiina Kino' : 'Invest in this Group'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>

          </div>
        </div>

        {/* 12-Month Youth Business Formalization Line Chart Section */}
        <div className="mt-10 bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                <span>
                  {language === 'lg'
                    ? 'Okukula kw’Ebibiina Ebikakasiddwa mu Myezi 12'
                    : '12-Month Youth Business Formalization Trajectory'}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {language === 'lg'
                  ? 'Omuwendo gw’Abavubuka n’Emirimu Emiwandiise (Apr 2024 – Mar 2025)'
                  : 'Verified Transition from Informal Street Trade to Bankable Units'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {language === 'lg' ? activeScale.labelLg : activeScale.labelEn} —{' '}
                {language === 'lg'
                  ? 'Okulondoola abavubuka abafunye akawunti mu EcoBank ne URSB/SACCO.'
                  : 'Audited monthly progression of youth KYC onboarding, URSB/SACCO registration, and EcoBank group ledger activation.'}
              </p>
            </div>

            {/* Chart Series Filter Controls */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 self-start lg:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setChartView('both')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  chartView === 'both'
                    ? 'bg-emerald-800 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {language === 'lg' ? 'Byonna Wamu' : 'Combined View'}
              </button>
              <button
                type="button"
                onClick={() => setChartView('youth')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  chartView === 'youth'
                    ? 'bg-emerald-800 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {language === 'lg' ? 'Abavubuka Abawandiise' : 'Formalized Youth'}
              </button>
              <button
                type="button"
                onClick={() => setChartView('enterprises')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  chartView === 'enterprises'
                    ? 'bg-emerald-800 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {language === 'lg' ? ' Bizinensi Eziwandiise' : 'Registered Enterprises'}
              </button>
            </div>
          </div>

          {/* Summary KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  {language === 'lg' ? 'Abavubuka Abawandiise (Mar \'25)' : 'Formalized Youth Artisans (Mar \'25)'}
                </span>
                <span className="font-mono text-2xl font-extrabold text-slate-900 tabular-nums mt-1 block">
                  {latestMonth.formalizedYouth.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-emerald-700 font-mono tabular-nums mt-0.5 block">
                  +{twelveMonthGrowthPct}% {language === 'lg' ? 'mu myezi 12' : 'over 12 months'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  {language === 'lg' ? 'Bizinensi n’Obubiina Obukakasiddwa' : 'Formalized Business Sub-Units'}
                </span>
                <span className="font-mono text-2xl font-extrabold text-slate-900 tabular-nums mt-1 block">
                  {latestMonth.registeredEnterprises.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-mono tabular-nums mt-0.5 block">
                  {language === 'lg'
                    ? `Okuva ku ${firstMonth.registeredEnterprises} mu Apr '24`
                    : `Up from ${firstMonth.registeredEnterprises} in Apr '24`}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/60">
                <Building className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  {language === 'lg' ? 'Ensimbi mu EcoBank (UGX)' : 'Cumulative EcoBank Savings & Trade'}
                </span>
                <span className="font-mono text-2xl font-extrabold text-emerald-700 tabular-nums mt-1 block">
                  UGX {latestMonth.ecoBankVolumeUgxM}M
                </span>
                <span className="text-xs text-slate-500 font-mono tabular-nums mt-0.5 block">
                  {language === 'lg' ? 'Relworx + EcoBank Ledger' : 'Audited Relworx + EcoBank Ledger'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Recharts Responsive Line Chart */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6">
            <div className="h-[320px] sm:h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 12, right: 20, left: 4, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#475569', fontSize: 12, fontFamily: 'ui-monospace, monospace' }}
                    axisLine={{ stroke: '#CBD5E1' }}
                    tickLine={false}
                    dy={8}
                  />
                  {(chartView === 'both' || chartView === 'youth') && (
                    <YAxis
                      yAxisId="left"
                      tick={{ fill: '#0F5132', fontSize: 12, fontFamily: 'ui-monospace, monospace' }}
                      axisLine={false}
                      tickLine={false}
                      width={48}
                    />
                  )}
                  {(chartView === 'both' || chartView === 'enterprises') && (
                    <YAxis
                      yAxisId="right"
                      orientation={chartView === 'enterprises' ? 'left' : 'right'}
                      tick={{ fill: '#D97706', fontSize: 12, fontFamily: 'ui-monospace, monospace' }}
                      axisLine={false}
                      tickLine={false}
                      width={44}
                    />
                  )}
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#1E293B',
                      borderRadius: '12px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                      fontFamily: 'ui-monospace, monospace',
                    }}
                    itemStyle={{ color: '#F8FAFC', paddingTop: '2px', paddingBottom: '2px' }}
                    labelStyle={{ color: '#94A3B8', fontWeight: 700, marginBottom: '4px' }}
                    formatter={(value: any, name: any) => {
                      if (name === 'formalizedYouth') {
                        return [
                          `${Number(value).toLocaleString()} ${language === 'lg' ? 'Abavubuka' : 'Youth Artisans'}`,
                          language === 'lg' ? 'Abavubuka Abawandiise' : 'Formalized Youth (KYC & Banked)',
                        ];
                      }
                      return [
                        `${Number(value).toLocaleString()} ${language === 'lg' ? 'Bizinensi' : 'Units'}`,
                        language === 'lg' ? 'Bizinensi Eziwandiise' : 'Registered Business Units',
                      ];
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    formatter={(value: string) => {
                      if (value === 'formalizedYouth') {
                        return (
                          <span className="text-xs font-semibold text-slate-700">
                            {language === 'lg'
                              ? 'Abavubuka Abawandiise mu EcoBank (Left Axis)'
                              : 'Formalized Youth Artisans (Banked & KYC)'}
                          </span>
                        );
                      }
                      return (
                        <span className="text-xs font-semibold text-slate-700">
                          {language === 'lg'
                            ? 'Bizinensi n’Obubiina Ebiwandiise (Right Axis)'
                            : 'Registered Youth Enterprises & SACCO Units'}
                        </span>
                      );
                    }}
                  />
                  {(chartView === 'both' || chartView === 'youth') && (
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="formalizedYouth"
                      stroke="#0F5132"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#0F5132', strokeWidth: 2, stroke: '#FFFFFF' }}
                      activeDot={{ r: 6, fill: '#10B981', stroke: '#0F5132', strokeWidth: 2 }}
                    />
                  )}
                  {(chartView === 'both' || chartView === 'enterprises') && (
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="registeredEnterprises"
                      stroke="#D97706"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#D97706', strokeWidth: 2, stroke: '#FFFFFF' }}
                      activeDot={{ r: 6, fill: '#F59E0B', stroke: '#D97706', strokeWidth: 2 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

