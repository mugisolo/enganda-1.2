import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FOUNDERS } from '../data/content';

export const FoundersSection: React.FC = () => {
  const { t, language } = useLanguage();
  const foundersT = t.founders;

  return (
    <section id="founders" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
            {foundersT.kicker}
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            {foundersT.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {foundersT.subtitle}
          </p>
        </div>

        {/* Founders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          {FOUNDERS.map((founder, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-2xl p-7 sm:p-9 border border-slate-200/90 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-emerald-800/20 shadow-xs shrink-0 bg-slate-200">
                    <img
                      src={founder.image}
                      alt={`Portrait of ${founder.name}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      {founder.role}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                      {founder.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-amber-800 mt-1">
                      {founder.title}
                    </p>
                  </div>
                </div>

                {/* Quote Box */}
                <div className="bg-white rounded-xl p-4 border border-slate-200/70 mb-6 text-xs sm:text-sm italic text-slate-700 leading-relaxed">
                  {founder.quote}
                </div>

                {/* Bio Prose */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {language === 'lg' ? founder.bioLg : founder.bioEn}
                </p>

                {/* Focus Areas */}
                <div className="space-y-2 mb-6">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    {language === 'lg' ? 'Enteekateeka z’Omukulembeze' : 'Strategic Mandate'}
                  </div>
                  {founder.focus.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-center gap-2 text-xs text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Connect */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium text-slate-700">Enganda Executive Office</span>
                <span className="text-emerald-800 font-semibold">Entebbe, Uganda</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
