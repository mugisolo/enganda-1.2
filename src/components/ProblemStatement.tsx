import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2, XCircle } from 'lucide-react';

export const ProblemStatement: React.FC = () => {
  const { t, language } = useLanguage();
  const problemT = t.problem;

  return (
    <section id="about" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
            {problemT.kicker}
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            {problemT.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {problemT.description}
          </p>
        </div>

        {/* Comparative 2-Card Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Unstructured Informal Sector */}
          <div className="bg-white rounded-2xl p-7 sm:p-9 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                  {language === 'lg' ? 'Ebiriwo Kuno' : 'Current Status Quo'}
                </span>
                <span className="font-mono text-sm font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded">
                  {language === 'lg' ? 'Kabi K' : 'High Risk'}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                {problemT.cards[0].title}
              </h3>

              <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 font-mono tracking-tight tabular-nums mb-3">
                {problemT.cards[0].stat}
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {problemT.cards[0].description}
              </p>

              <div className="space-y-3 pt-6 border-t border-slate-100">
                {problemT.cards[0].traits.map((trait, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{trait}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 text-xs text-slate-500">
              {language === 'lg'
                ? 'Okunoonyereza kw’Ebitongole: Uganda Bureau of Statistics (UBOS) n’Ebitongole by’Emirimu (ILO).'
                : 'Data: Uganda Bureau of Statistics (UBOS) informal labor assessments & ILO East Africa Youth Briefs.'}
            </div>
          </div>

          {/* Card 2: Enganda Structured Economic Unit */}
          <div className="bg-white rounded-2xl p-7 sm:p-9 border border-emerald-300 shadow-sm flex flex-col justify-between ring-1 ring-emerald-500/10">
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  {language === 'lg' ? 'Enkola ya Enganda' : 'Enganda Operating Model'}
                </span>
                <span className="font-mono text-sm font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
                  {language === 'lg' ? 'Kikakasiddwa mu Ntebbe' : 'Validated in Entebbe'}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                {problemT.cards[1].title}
              </h3>

              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono tracking-tight tabular-nums mb-3">
                {problemT.cards[1].stat}
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {problemT.cards[1].description}
              </p>

              <div className="space-y-3 pt-6 border-t border-slate-100">
                {problemT.cards[1].traits.map((trait, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{trait}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-800 font-medium">
              <span>{language === 'lg' ? 'Bbanka ya EcoBank ne Relworx' : 'Backed by EcoBank & Relworx Systems'}</span>
              <span className="text-slate-400">·</span>
              <span>100% Audit Track</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
