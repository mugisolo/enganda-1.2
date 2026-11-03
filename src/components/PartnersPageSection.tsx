import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Check, ShieldCheck, Download, ExternalLink, ArrowRight } from 'lucide-react';

interface PartnerDetails {
  id: string;
  name: string;
  category: string;
  role: string;
  mouStatus: string;
  duration: string;
  descriptionEn: string;
  descriptionLg: string;
  deliverables: string[];
  logoSvg: React.ReactNode;
}

interface PartnersPageSectionProps {
  onOpenPartnerModal: () => void;
}

export const PartnersPageSection: React.FC<PartnersPageSectionProps> = ({
  onOpenPartnerModal,
}) => {
  const { language } = useLanguage();

  const fullPartners: PartnerDetails[] = [
    {
      id: 'ecobank',
      name: 'EcoBank Uganda Limited',
      category: 'Tier-1 Commercial Banking Partner',
      role: 'Group Account Custody & Micro-Credit Facilities',
      mouStatus: 'Signed Master Tripartite Agreement',
      duration: '2024 – 2027 Active',
      descriptionEn:
        'Underwrites zero-minimum-balance group commercial checking accounts, financial literacy clinics, and cash-flow backed collective credit facilities for Enganda’s formalized youth SACCOs.',
      descriptionLg:
        'Ewa ebibiina by’abavubuka akawunti za bbanka ezitalina nsimbi z’akafubo, n’okuwa amabanja agasinziira ku nsimbi ezitambula ku ssimu.',
      deliverables: [
        'Zero-minimum balance cooperative checking accounts',
        'Multi-signatory governance for youth leadership',
        'Automated cash-flow credit scoring matching Relworx data',
        'Direct ATM & digital branch support in Entebbe',
      ],
      logoSvg: (
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white flex items-center justify-center font-black text-sm tracking-tighter shadow-sm border border-emerald-700/60">
          <span>eco</span>
        </div>
      ),
    },
    {
      id: 'entebbe-council',
      name: 'Entebbe Municipal Council',
      category: 'Local Government Authority',
      role: 'Shoreline Tree Concessions & Municipal Waste Pacts',
      mouStatus: 'Official Municipal Concession Agreement',
      duration: '10-Year Lakeshore Pact',
      descriptionEn:
        'Grants formal municipal tree-planting concessions along the Lake Victoria shoreline, provides green municipal cleanup contracts, and streamlines local market trade licenses for youth.',
      descriptionLg:
        'Ewa endagaano z’okusimba emiti ku lubaalama lw’ennyanja Nalubaale, emirimu gy’okulongoosa ekibuga, n’ebiwandiiko by’obusuubuzi.',
      deliverables: [
        '10-Year Lake Victoria shoreline reforestation concession',
        'Municipal waste collection depot concessions in Manyago',
        'Streamlined trading licenses across Division A & B',
        'Mayor’s Office civic endorsement and coordination',
      ],
      logoSvg: (
        <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs tracking-wider border border-amber-600 shadow-sm text-center leading-tight">
          <span>EMC<br/><span className="text-[8px] font-normal">UGANDA</span></span>
        </div>
      ),
    },
    {
      id: 'relworx',
      name: 'Relworx Fintech Gateway',
      category: 'Fintech Payments & USSD Infrastructure',
      role: 'Automated Mobile Money Deductions & USSD (*217#)',
      mouStatus: 'Strategic Technology Partnership',
      duration: 'Full National Integration',
      descriptionEn:
        'Powers Enganda’s USSD shortcut (*217#) and web checkout, facilitating instant MTN Mobile Money and Airtel Money automated member dues collection, micro-savings, and tree sponsorships.',
      descriptionLg:
        'Kkampuni ey’ebyuma ekolera ku ssimu zonna ez’amasimu (*217#) ne webusayiti, eyanguyiza abavubuka okukung’aanya ensente zaabwe ku MTN ne Airtel.',
      deliverables: [
        'Offline USSD (*217#) access for basic non-smartphones',
        'Direct settlement for MTN Mobile Money & Airtel Money',
        'Automated split ledger between SACCO savings and tree funds',
        'Instant SMS confirmation delivered to youth leaders',
      ],
      logoSvg: (
        <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-mono font-black text-base border border-slate-700 shadow-sm">
          <span>RWX</span>
        </div>
      ),
    },
    {
      id: 'eu',
      name: 'European Union (EU)',
      category: 'Multilateral Development Partner',
      role: 'Vocational Standards & Youth Employment Grant Co-Financing',
      mouStatus: 'Bilateral Grant Facility',
      duration: 'Multi-Year Co-Funding Framework',
      descriptionEn:
        'Provides strategic development standards, vocational training benchmarks, and grant co-financing for youth formalization and green economic transformation in Uganda.',
      descriptionLg:
        'Abawa obuyambi bw’ensente z’enkulaakulana, emitindo gy’okusomesa abavubuka emikono, n’okukuuma enkola ey’amazima.',
      deliverables: [
        'Vocational training accreditation and master artisan standards',
        'Third-party impact auditing and ESG governance metrics',
        'Co-funding matching grants for group capital toolbanks',
        'Lake Victoria environmental protection alignment',
      ],
      logoSvg: (
        <div className="w-12 h-12 rounded-xl bg-blue-900 text-amber-300 flex items-center justify-center font-serif text-lg font-bold border border-blue-700 shadow-sm">
          <span>★EU★</span>
        </div>
      ),
    },
    {
      id: 'ursb',
      name: 'Uganda Registration Services Bureau (URSB)',
      category: 'Statutory Regulatory Authority',
      role: 'Legal Cooperative Formalization & Entity Registration',
      mouStatus: 'Fast-Track Group Registration Desk',
      duration: 'Permanent Regulatory Partner',
      descriptionEn:
        'Provides streamlined fast-track business and SACCO registration for informal youth groups, establishing legal identity and certificate of incorporation.',
      descriptionLg:
        'Ekitongole kya gavumenti ekiwandiisa ebibiina mu mateeka, ekitongole eky’amazima ekizimba obwannanyini.',
      deliverables: [
        'Fast-track SACCO registration and entity documentation',
        'Name reservation and legal constitution drafting clinics',
        'Official certificate of incorporation for commercial banking',
      ],
      logoSvg: (
        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs border border-slate-300 shadow-sm text-center">
          <span>URSB<br/><span className="text-[7px] text-slate-500 font-mono">GOV.UG</span></span>
        </div>
      ),
    },
    {
      id: 'mglsd',
      name: 'Ministry of Gender, Labour & Social Development',
      category: 'Government Line Ministry',
      role: 'National Youth Economic Policy & Labor Standards',
      mouStatus: 'Policy Alignment & Youth Apprenticeship Framework',
      duration: 'National Policy Alignment',
      descriptionEn:
        'Aligns Enganda’s informal youth transition model with the National Youth Policy, occupational safety guidelines, and master artisan accreditation.',
      descriptionLg:
        'Minisitule y’ekikula ky’abantu n’emirimu ekolagana ne Enganda okutegeka abavubuka mu ggwanga lyonna.',
      deliverables: [
        'Official recognition of informal master artisan apprenticeships',
        'Workplace occupational safety standards compliance',
        'National youth employment data integration',
      ],
      logoSvg: (
        <div className="w-12 h-12 rounded-xl bg-emerald-950 text-white flex items-center justify-center font-bold text-[10px] border border-emerald-800 shadow-sm text-center">
          <span>MGLSD<br/><span className="text-[7px] text-amber-400">UGANDA</span></span>
        </div>
      ),
    },
  ];

  return (
    <section id="partners-page" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
              {language === 'lg' ? 'Bannamikago b’Ebyenfuna' : 'Institutional Ecosystem'}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              {language === 'lg' ? 'Bannamikago b’Omusingi gwa Enganda' : 'Official Institutional Partners & Alliances'}
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              {language === 'lg'
                ? 'Enganda ekolagana butereevu ne Bbanka ez’amaanyi, obukiiko bw’ebibuga, kkampuni z’amasimu, gavumenti ey’awakati, n’Omukago gwa Bulaaya.'
                : 'Enganda bridges grassroots youth directly to tier-one commercial banks, municipal city councils, fintech payment infrastructure, statutory regulators, and international development funders.'}
            </p>
          </div>

          <button
            onClick={onOpenPartnerModal}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs whitespace-nowrap self-start md:self-auto shrink-0"
          >
            <span>{language === 'lg' ? 'Kola Naffe nga Partner' : 'Become an Institutional Partner'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 6-Partner Grid with Official Logos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fullPartners.map((partner) => (
            <div
              key={partner.id}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Logo & Category Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  {partner.logoSvg}
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 font-mono block">
                      {partner.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {partner.duration}
                    </span>
                  </div>
                </div>

                {/* Partner Name & Role */}
                <h3 className="text-lg font-bold text-slate-900 mb-1 leading-snug">
                  {partner.name}
                </h3>
                <div className="text-xs font-semibold text-amber-800 mb-3">
                  {partner.role}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {language === 'lg' ? partner.descriptionLg : partner.descriptionEn}
                </p>

                {/* Deliverables Checklist */}
                <div className="space-y-2 pt-3 border-t border-slate-200/80 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Key Deliverables Under MoU
                  </span>
                  {partner.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Footer */}
              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>{partner.mouStatus}</span>
                <button
                  onClick={() => alert(`Partnership MoU with ${partner.name} downloaded.`)}
                  className="text-emerald-800 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>MoU</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Institutional Charter Download Bar */}
        <div className="mt-12 p-6 sm:p-8 bg-slate-900 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-bold mb-1">
              Download the Enganda Institutional Governance Charter
            </h4>
            <p className="text-xs text-slate-300 max-w-xl">
              Complete tripartite operating agreement between Enganda, EcoBank Uganda, and Entebbe Municipal Council establishing the formalization legal protocol.
            </p>
          </div>

          <button
            onClick={() => alert('Official Enganda Tripartite Institutional Charter (2024–2027) downloaded.')}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download Tripartite Charter (PDF)</span>
          </button>
        </div>

      </div>
    </section>
  );
};
