import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { INSTITUTIONAL_PARTNERS } from '../data/content';
import { Check, ArrowUpRight } from 'lucide-react';

interface PartnersSectionProps {
  onOpenPartnerModal: () => void;
}

export const PartnersSection: React.FC<PartnersSectionProps> = ({
  onOpenPartnerModal,
}) => {
  const { t, language } = useLanguage();
  const partnersT = t.partners;

  return (
    <section id="partners" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
              {partnersT.kicker}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              {partnersT.title}
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              {partnersT.subtitle}
            </p>
          </div>

          <button
            onClick={onOpenPartnerModal}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs whitespace-nowrap self-start md:self-auto shrink-0"
          >
            <span>{language === 'lg' ? 'Saba Enkolagana y’Ebitongole' : 'Institutional Inquiry'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4-Partner Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {INSTITUTIONAL_PARTNERS.map((partner, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-7 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all"
            >
              <div>
                {/* Header: Partner Name and Badge */}
                <div className="flex items-center justify-between gap-4 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono">
                    {partner.badge}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                  {partner.name}
                </h3>

                <div className="text-xs font-semibold text-amber-800 mb-4">
                  {partner.role}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {language === 'lg' ? partner.descriptionLg : partner.descriptionEn}
                </p>

                {/* Deliverables Checklist */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    {language === 'lg' ? 'Emirimu Gy’ebitongole Bino' : 'Operational Contribution'}
                  </div>
                  {partner.deliverables.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Formalized Tripartite MoU</span>
                <span>Active 2024–2027</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
