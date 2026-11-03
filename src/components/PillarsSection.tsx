import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TREE_PLANTING_IMAGE } from '../data/content';
import { Wrench, Briefcase, HeartHandshake, Check, ArrowRight, Sprout } from 'lucide-react';

interface PillarsSectionProps {
  onOpenRegisterModal: () => void;
  onOpenPaymentModal: () => void;
}

export const PillarsSection: React.FC<PillarsSectionProps> = ({
  onOpenRegisterModal,
  onOpenPaymentModal,
}) => {
  const { t, language } = useLanguage();
  const pillarsT = t.pillars;
  const [activeTabId, setActiveTabId] = useState<string>('skilling');

  const activePillar = pillarsT.tabs.find((tab) => tab.id === activeTabId) || pillarsT.tabs[0];

  const pillarIcons: Record<string, React.ReactNode> = {
    skilling: <Wrench className="w-5 h-5 text-emerald-700" />,
    incubation: <Briefcase className="w-5 h-5 text-emerald-700" />,
    mindset: <HeartHandshake className="w-5 h-5 text-emerald-700" />,
  };

  return (
    <section id="pillars" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
            {pillarsT.kicker}
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            {pillarsT.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {pillarsT.description}
          </p>
        </div>

        {/* Tab Selector: Interactive Segmented Buttons */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-xl max-w-3xl mb-10 border border-slate-200/80">
          {pillarsT.tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTabId(tab.id)}
                className={`flex-1 min-w-[200px] flex items-center justify-center gap-2.5 py-3 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <span className="font-mono text-emerald-700 font-bold">{tab.number}</span>
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Deep Dive Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: Details & Concrete Deliverables */}
          <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-7 sm:p-10 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-100/80 flex items-center justify-center">
                  {pillarIcons[activePillar.id]}
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">
                    {language === 'lg' ? `Empagi ${activePillar.number}` : `Pillar ${activePillar.number}`}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {activePillar.name}
                  </h3>
                </div>
              </div>

              <div className="text-xs sm:text-sm font-medium text-amber-800 bg-amber-50/80 border border-amber-200/60 rounded-lg px-3.5 py-2 mb-6">
                {activePillar.tagline}
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                {activePillar.summary}
              </p>

              <div className="space-y-3.5 mb-8">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {language === 'lg' ? 'Ebikolebwa mu Mpagi Eno' : 'Key Operational Deliverables'}
                </h4>
                {activePillar.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">
                  {language === 'lg' ? 'Obukakafu mu Ntebbe' : 'Pilot Proof in Greater Entebbe'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-800 font-mono">
                  {activePillar.pilotMetric}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {activePillar.id === 'incubation' ? (
                  <button
                    onClick={onOpenRegisterModal}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <span>{language === 'lg' ? 'Wandiisa Ekibiina' : 'Register Informal Group'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : activePillar.id === 'mindset' ? (
                  <button
                    onClick={onOpenPaymentModal}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors border border-amber-300"
                  >
                    <Sprout className="w-3.5 h-3.5 text-amber-700" />
                    <span>{language === 'lg' ? 'Simbisa Emiti mu Ntebbe' : 'Sponsor Trees in Entebbe'}</span>
                  </button>
                ) : (
                  <button
                    onClick={onOpenRegisterModal}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <span>{language === 'lg' ? 'Saba Enteekateeka y’Okubangula' : 'Request Skilling Curriculum'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Visual Case Illustration */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative h-full rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-900 min-h-[340px] flex flex-col justify-end">
              <img
                src={TREE_PLANTING_IMAGE}
                alt="Young Ugandan youth community members planting trees along the Lake Victoria shoreline in Entebbe"
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

              <div className="relative z-10 p-6 sm:p-8 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  {language === 'lg' ? 'Okusimba Emiti mu Ntebbe' : 'Entebbe Civic Reforestation'}
                </span>
                <h4 className="text-lg sm:text-xl font-bold mt-1 mb-2">
                  {language === 'lg'
                    ? 'Endagaano n’Olukiiko lw’Ekibuga & Ennyanja Nalubaale'
                    : 'Municipal Concessions & Lake Victoria Conservation'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                  {language === 'lg'
                    ? 'Buli kibiina kya Enganda kissaako essira ku kulongoosa ekibuga, okusimba emiti egy’ekinnansi, n’okukuuma olubalama lw’ennyanja.'
                    : 'Every Enganda youth cohort undertakes civic restoration—planting indigenous trees, cleaning municipal drainage, and transforming youth reputation from restive to civic leadership.'}
                </p>

                <div className="flex items-center gap-4 text-xs font-mono text-emerald-300 pt-3 border-t border-white/10">
                  <span>24,250+ Trees Planted</span>
                  <span>·</span>
                  <span>100% Youth Maintained</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
