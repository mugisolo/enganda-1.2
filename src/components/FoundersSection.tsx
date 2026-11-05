import React from 'react';
import { Award, CheckCircle2, Quote } from 'lucide-react';
import { LEADERSHIP_PROFILES } from '../data/content';

export const FoundersSection: React.FC = () => {
  return (
    <section id="leadership" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#0F5132] mb-3">
            <Award className="w-4 h-4" />
            <span>Executive Leadership & Network Stewardship</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            The Leadership Behind ENGANDA
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Combining frontline community trust across Greater Entebbe with structured enterprise
            coordination and institutional accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {LEADERSHIP_PROFILES.map((leader) => (
            <div
              key={leader.name}
              className="bg-[#FAF9F6] rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between p-6 sm:p-8"
            >
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-[#0F5132]/30 shrink-0"
                  />
                  <div>
                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-[#0F5132] text-xs font-extrabold uppercase tracking-wider">
                      {leader.role}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2 font-['Plus_Jakarta_Sans',sans-serif]">
                      {leader.name}
                    </h3>
                    <p className="text-xs font-semibold text-amber-700 mt-0.5">{leader.title}</p>
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-[1.7]">{leader.bio}</p>

                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 space-y-2">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Core Areas of Responsibility
                  </div>
                  <ul className="space-y-1.5">
                    {leader.focus.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-[#0F5132] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-200 flex items-start gap-3">
                <Quote className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm italic text-slate-700 leading-relaxed">
                  {leader.quote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
