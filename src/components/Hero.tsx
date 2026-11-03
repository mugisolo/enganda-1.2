import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HERO_IMAGE, GANDA_LOGO } from '../data/content';
import { ArrowRight, Sprout, Building2, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onOpenPartnerModal: () => void;
  onOpenRegisterModal: () => void;
  onOpenPaymentModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenPartnerModal,
  onOpenRegisterModal,
  onOpenPaymentModal,
}) => {
  const { t, language } = useLanguage();
  const heroT = t.hero;

  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200 pt-8 pb-12 sm:pt-14 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Split Hero: Two-column layout with equal height stretch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Proposition, Value, Action */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Clean unboxed editorial kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-3">
              <span>{heroT.kicker}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-amber-700">
                {language === 'lg' ? 'Omulimu gw’e Ntebbe Gukola' : 'Entebbe Pilot Active'}
              </span>
            </div>

            {/* Dominant Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12] mb-6">
              {heroT.headline}
            </h1>

            {/* Subheadline with measure 65-75ch */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mb-8">
              {heroT.subheadline}
            </p>

            {/* Action Group */}
            <div className="flex flex-wrap items-center gap-3.5 mb-10">
              <button
                onClick={onOpenPartnerModal}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-700 active:bg-emerald-900 transition-all shadow-sm"
              >
                <span>{heroT.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenRegisterModal}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
              >
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>{heroT.ctaSecondary}</span>
              </button>

              <button
                onClick={onOpenPaymentModal}
                className="inline-flex items-center gap-2 px-4 py-3.5 text-sm font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
              >
                <Sprout className="w-4 h-4 text-amber-600" />
                <span>{heroT.ctaTertiary}</span>
              </button>
            </div>

            {/* Trust Signals & Institutional Anchor */}
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                EcoBank Commercial Accounts
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Relworx MTN & Airtel MoMo Gateway</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Entebbe Municipal Council Concession</span>
            </div>
          </div>

          {/* Right Column: High-Impact Photography Carrier with Official Protocol Badge */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-md bg-slate-900 group">
              <img
                src={HERO_IMAGE}
                alt="Young Ugandan youth craft and leather artisans working collaboratively with tools and digital tablets in Entebbe"
                className="w-full h-[380px] sm:h-[440px] lg:h-[480px] object-cover transition-transform duration-500 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
              
              {/* Overlay Protocol Stamp */}
              <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md rounded-xl p-2 border border-slate-700 flex items-center gap-2">
                <img
                  src={GANDA_LOGO}
                  alt="Ganda Trust Protocol"
                  className="w-7 h-7 object-contain"
                />
                <div className="text-left">
                  <span className="text-[10px] font-bold text-white block leading-tight">GANDA PROTOCOL</span>
                  <span className="text-[9px] text-emerald-300 block font-mono">Entebbe Anchor</span>
                </div>
              </div>

              <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-1">
                  Entebbe Youth Craft & Tech Hub
                </div>
                <p className="text-sm font-medium text-slate-200">
                  {language === 'lg'
                    ? 'Kitoro ne Kigungu · Ebibiina ebiwandiikiddwa mu mateeka nga birina akawunti mu EcoBank.'
                    : 'Kitoro & Kigungu Artisan Cluster · Structured into legal cooperatives with EcoBank savings ledgers.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Metric Ribbon: 4-column KPI strip below hero split */}
        <div className="mt-14 pt-10 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {heroT.metrics.map((metric, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
                {metric.value}
              </span>
              <span className="text-sm font-semibold text-emerald-800 mt-1">
                {metric.label}
              </span>
              <span className="text-xs text-slate-500 mt-0.5">
                {metric.detail}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
