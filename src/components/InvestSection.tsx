import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  TrendingUp,
  Coins,
  ShieldCheck,
  Building,
  Users,
  Sprout,
  ArrowRight,
  Globe,
  Briefcase,
  CheckCircle2,
  FileText,
  DollarSign,
  Calculator,
} from 'lucide-react';

interface InvestSectionProps {
  onCommitInvestment?: (details: any) => void;
  targetGroupPreset?: { id: string; name: string } | null;
}

export const InvestSection: React.FC<InvestSectionProps> = ({
  onCommitInvestment,
  targetGroupPreset,
}) => {
  const { language } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState<string>('direct-fund');
  const [investmentCurrency, setInvestmentCurrency] = useState<'UGX' | 'USD'>('UGX');
  const [amount, setAmount] = useState<number>(10000000); // 10M UGX default (~$2,700)
  const [selectedGroup, setSelectedGroup] = useState<string>(
    targetGroupPreset ? targetGroupPreset.name : 'All 21 Greater Entebbe Groups (Blended Pool)'
  );

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [investorName, setInvestorName] = useState<string>('');
  const [investorEmail, setInvestorEmail] = useState<string>('');
  const [investorPhone, setInvestorPhone] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [committedResult, setCommittedResult] = useState<any>(null);

  const categories = [
    {
      id: 'direct-fund',
      title: 'Direct Fund Investment',
      tagline: 'Revolving Credit & Working Capital',
      badge: 'Commercial & Returnable',
      icon: <Coins className="w-5 h-5 text-emerald-700" />,
      descriptionEn:
        'Co-invest revolving credit alongside EcoBank Uganda into formalized youth cooperative checking accounts. Repayments are automated daily through the Relworx USSD (*217#) payment infrastructure.',
      descriptionLg:
        'Teeka ensente mu bibiina by’abavubuka ng’okozesa akawunti za EcoBank. Bammemba basasula ensente buli lunaku nga basinziira ku Relworx Mobile Money.',
      targetReturn: '8% – 12% p.a. Projected Yield',
      tenor: '12 – 24 Months Revolving',
      minimum: 'UGX 10,000,000 (~$2,700)',
      security: 'EcoBank Group Mutual Guarantee & Relworx Cash-Flow Deduction',
    },
    {
      id: 'impact-investor',
      title: 'Impact Investors & Blended Finance',
      tagline: 'Patient Capital & Scale Facilities',
      badge: 'ESG & High Impact',
      icon: <TrendingUp className="w-5 h-5 text-emerald-700" />,
      descriptionEn:
        'Subordinated debt and equity-like patient instruments backing Enganda’s expansion to 2,000,000 youth. Structured to meet European Union and DFI developmental benchmarks.',
      descriptionLg:
        'Ensimbi z’enkulaakulana ez’ekiseera ekiwanvu eziteekebwa mu kugaziya Enganda mu ggwanga lyonna okutuuka ku bavubuka obukadde bubiri.',
      targetReturn: 'Blended Social Return + 4%–6% Coupon',
      tenor: '3 – 5 Years Patient Capital',
      minimum: 'UGX 50,000,000 (~$13,500)',
      security: 'Audited URSB SACCO Assets & EU-Aligned Impact Verification',
    },
    {
      id: 'grants',
      title: 'Grants & Philanthropic Capital',
      tagline: 'Catalytic Toolkits & Skilling Pools',
      badge: '100% Tax Deductible',
      icon: <Briefcase className="w-5 h-5 text-emerald-700" />,
      descriptionEn:
        'Non-repayable grants funding master artisan apprenticeships, shared workshop tooling pools, and environmental tree concessions along the Lake Victoria shoreline.',
      descriptionLg:
        'Obuyambi obutazzibwayo obugula ebyuma eby’omulembe, okusomesa abavubuka, n’okusimba emiti ku lubaalama lwa Nalubaale.',
      targetReturn: '100% Social Multiplier & Job Creation',
      tenor: 'Immediate Field Deployment',
      minimum: 'UGX 1,000,000 (~$270)',
      security: 'Quarterly Audited Financial Statements & GPS Geotagged Proof',
    },
    {
      id: 'diaspora',
      title: 'Uganda Diaspora Syndicate',
      tagline: 'Hometown Cooperative Direct Sponsorship',
      badge: 'Direct Hometown Impact',
      icon: <Globe className="w-5 h-5 text-emerald-700" />,
      descriptionEn:
        'Ugandans abroad sponsoring specific artisan groups in their home districts (Entebbe, Katabi, Kampala, Jinja) with real-time WhatsApp & Relworx transaction audit feeds.',
      descriptionLg:
        'Bannayuganda abali ebweru w’eggwanga abayamba ebibiina by’omu bitundu gye baava nga balaba buli kikolebwa ku ssimu.',
      targetReturn: 'Family & Community Economic Independence',
      tenor: 'Flexible / Monthly Standing Order',
      minimum: 'UGX 500,000 (~$135)',
      security: 'Real-Time WhatsApp & Relworx SMS Ledger Access',
    },
    {
      id: 'corporate-esg',
      title: 'Corporate ESG Sponsorship',
      tagline: 'Municipal Lakeshore Concessions',
      badge: 'Brand Alignment',
      icon: <Building className="w-5 h-5 text-emerald-700" />,
      descriptionEn:
        'Corporate sustainability programs sponsoring dedicated kilometer-stretches of Lake Victoria reforestation and youth municipal cleanup brigades with verified carbon credits.',
      descriptionLg:
        'Kkampuni ez’amanyi ezisponsori emiti n’okulongoosa ekibuga ky’e Ntebbe ng’abavubuka be bakikola.',
      targetReturn: 'Verified Carbon Offsets & Corporate Brand Impact',
      tenor: 'Annual Partnership Agreement',
      minimum: 'UGX 25,000,000 (~$6,800)',
      security: 'Joint Concession Certificate with Entebbe Municipal Council',
    },
  ];

  const activeCategory = categories.find((c) => c.id === selectedCategory) || categories[0];

  // Impact Projection calculations based on amount
  const normalizedUgx = investmentCurrency === 'USD' ? amount * 3700 : amount;
  const projectedJobs = Math.max(5, Math.round(normalizedUgx / 350000));
  const projectedTrees = Math.max(10, Math.round(normalizedUgx / 50000));
  const projectedCreditMatchingUgx = Math.round(normalizedUgx * 1.5);

  const handleCommitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!investorName.trim() || !investorEmail.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/invest/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investorName,
          email: investorEmail,
          phone: investorPhone,
          investorType: activeCategory.title,
          targetGroup: selectedGroup,
          commitmentAmount: normalizedUgx,
          currency: investmentCurrency,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const { saveInvestmentToFirestore } = await import('../services/firebase');
        await saveInvestmentToFirestore({
          id: data.investmentRef || `INV-${Date.now()}`,
          investmentRef: data.investmentRef || `INV-${Date.now()}`,
          investorName,
          email: investorEmail,
          phone: investorPhone,
          investorType: activeCategory.title,
          targetGroup: selectedGroup,
          commitmentAmount: normalizedUgx,
          currency: investmentCurrency,
        }).catch((err) => console.warn('Firestore investment sync note:', err));

        setCommittedResult(data);
        if (onCommitInvestment) onCommitInvestment(data);
      }
    } catch (err) {
      console.error('Error submitting investment commitment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="invest" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
            {language === 'lg' ? 'Okuteeka Ensimbi mu Bibiina' : 'Capital Allocation & Blended Finance'}
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            {language === 'lg' ? 'Teeka Ensimbi mu Bavubuka ba Uganda' : 'Invest in Uganda’s Youth Economic Engine'}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {language === 'lg'
              ? 'Londa enkola ekugwanidde: ebyewolo ebiriko amagoba, obuyambi obutazzibwayo, Bannayuganda abali ebweru, oba kkampuni ezisponsori obutonde.'
              : 'Direct capital into structured, legal, and bankable youth cooperatives. We offer structured debt facilities, ESG blended finance, philanthropic tooling grants, and diaspora hometown syndicates.'}
          </p>
        </div>

        {/* 5 Investor Categories Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {categories.map((cat) => {
            const isSelected = cat.id === selectedCategory;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-700 bg-white shadow-sm ring-2 ring-emerald-700/20'
                    : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-3">
                    {cat.icon}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug mb-1">
                    {cat.title}
                  </h4>
                  <span className="text-[10px] text-slate-500 block leading-tight">
                    {cat.tagline}
                  </span>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-mono font-semibold text-emerald-800">
                    {cat.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Category Breakdown & Interactive Allocation Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Investor Category Profile */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono">
                  {activeCategory.badge}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Min: {activeCategory.minimum}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {activeCategory.title}
              </h3>
              <p className="text-sm font-medium text-amber-800 mb-4">
                {activeCategory.tagline}
              </p>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {language === 'lg' ? activeCategory.descriptionLg : activeCategory.descriptionEn}
              </p>

              {/* Term Sheet Highlights */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 mb-6 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Financial Return / Target</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{activeCategory.targetReturn}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Capital Tenor</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{activeCategory.tenor}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-200/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Security & Settlement Mechanism</span>
                  <span className="text-slate-700 mt-0.5 block">{activeCategory.security}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Backed by EcoBank Uganda Tripartite Custody
              </span>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
              >
                <span>Commit Capital to this Channel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Impact & Allocation Estimator */}
          <div className="lg:col-span-5 bg-emerald-950 text-white rounded-3xl p-7 sm:p-8 flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
                <Calculator className="w-4 h-4" />
                <span>Impact & Capital Estimator</span>
              </div>

              <h4 className="text-xl font-bold mb-1">
                Projected Impact Simulator
              </h4>
              <p className="text-xs text-emerald-200 leading-relaxed mb-6">
                Adjust your capital allocation to model the tangible field transformation generated across the 21 pilot groups.
              </p>

              {/* Target Group Selector */}
              <div className="mb-4">
                <label className="block text-[11px] font-semibold text-emerald-200 uppercase mb-1">
                  Target Group or Cluster
                </label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-emerald-900 border border-emerald-800 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="All 21 Greater Entebbe Groups (Blended Pool)">All 21 Greater Entebbe Groups (Blended Pool)</option>
                  <option value="Lugonjo Youth Metal Fabricators (ENG-ENT-004)">Lugonjo Youth Metal Fabricators (ENG-ENT-004)</option>
                  <option value="Bugonga Women & Youth Tailors (ENG-ENT-005)">Bugonga Women & Youth Tailors (ENG-ENT-005)</option>
                  <option value="Katabi Green Youth Briquette Makers (ENG-ENT-003)">Katabi Green Youth Briquette Makers (ENG-ENT-003)</option>
                  <option value="Kigungu Fisherfolk & Boat Artisans (ENG-ENT-001)">Kigungu Fisherfolk & Boat Artisans (ENG-ENT-001)</option>
                  <option value="Nkumba Interlocking Brick Guild (ENG-ENT-015)">Nkumba Interlocking Brick Guild (ENG-ENT-015)</option>
                </select>
              </div>

              {/* Currency & Amount Input */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-emerald-200 uppercase">
                    Investment Amount
                  </label>
                  <div className="flex items-center text-[10px] font-mono bg-emerald-900 rounded p-0.5 border border-emerald-800">
                    <button
                      type="button"
                      onClick={() => {
                        setInvestmentCurrency('UGX');
                        setAmount(10000000);
                      }}
                      className={`px-2 py-0.5 rounded ${
                        investmentCurrency === 'UGX' ? 'bg-amber-400 text-slate-900 font-bold' : 'text-emerald-200'
                      }`}
                    >
                      UGX
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInvestmentCurrency('USD');
                        setAmount(3000);
                      }}
                      className={`px-2 py-0.5 rounded ${
                        investmentCurrency === 'USD' ? 'bg-amber-400 text-slate-900 font-bold' : 'text-emerald-200'
                      }`}
                    >
                      USD
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    step={investmentCurrency === 'USD' ? 500 : 1000000}
                    min={100}
                    className="w-full px-4 py-2.5 text-base font-mono font-bold bg-emerald-900 border border-emerald-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-emerald-300 font-bold">
                    {investmentCurrency}
                  </span>
                </div>
              </div>

              {/* Dynamic Projection Results */}
              <div className="space-y-3 p-4 bg-emerald-900/80 rounded-2xl border border-emerald-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-200">Youth Formalized & Banked:</span>
                  <strong className="font-mono text-sm text-white font-black">{projectedJobs} Artisans</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-200">Lake Victoria Trees Dedicated:</span>
                  <strong className="font-mono text-sm text-amber-300 font-black">{projectedTrees} Shoreline Trees</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-200">EcoBank Matched Credit Facility:</span>
                  <strong className="font-mono text-xs text-emerald-300">
                    UGX {projectedCreditMatchingUgx.toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-900">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3 text-center text-xs font-bold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-xs"
              >
                Proceed to Investment Dossier
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Commitment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setCommittedResult(null);
              }}
              className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              &times;
            </button>

            {!committedResult ? (
              <form onSubmit={handleCommitSubmit} className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Capital Allocation Form
                  </span>
                  <h4 className="text-xl font-bold text-slate-900 mt-1">
                    Commit to {activeCategory.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Target: <strong className="text-slate-800">{selectedGroup}</strong> · {investmentCurrency} {amount.toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Investor / Entity Name *</label>
                  <input
                    type="text"
                    required
                    value={investorName}
                    onChange={(e) => setInvestorName(e.target.value)}
                    placeholder="e.g. Blue Lake Capital / Dr. Patrick Kato"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email *</label>
                    <input
                      type="email"
                      required
                      value={investorEmail}
                      onChange={(e) => setInvestorEmail(e.target.value)}
                      placeholder="investor@fund.com"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      value={investorPhone}
                      onChange={(e) => setInvestorPhone(e.target.value)}
                      placeholder="+256 ... or +1 ..."
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                  <span>Settlement Route: </span>
                  <strong className="text-slate-800">
                    EcoBank Commercial Wire or Relworx Mobile Money Gateway
                  </strong>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors"
                  >
                    {submitting ? 'Registering Pledge...' : 'Submit Capital Commitment'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <h4 className="text-xl font-bold text-slate-900">
                  Investment Commitment Registered!
                </h4>

                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Thank you, <strong className="text-slate-900">{investorName}</strong>. Your commitment dossier has been transmitted to Ronnie Tumusiime (Head of Strategy) and the EcoBank Uganda Credit Desk.
                </p>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left max-w-sm mx-auto text-xs font-mono space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dossier Reference:</span>
                    <strong className="text-emerald-800">{committedResult.investmentRef}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Youth Formalized:</span>
                    <strong className="text-slate-900">{committedResult.projectedImpact?.youthJobsFormalized} Artisans</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Trees Dedicated:</span>
                    <strong className="text-emerald-700">{committedResult.projectedImpact?.treesDedicated} Shoreline Trees</strong>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setCommittedResult(null);
                  }}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors"
                >
                  Close & View Portfolio
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </section>
  );
};
