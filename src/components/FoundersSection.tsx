import React from 'react';
import { Award, CheckCircle2, Quote, Camera } from 'lucide-react';
import {
  LEADERSHIP_PROFILES,
  FISHERIES_COOP_IMAGE,
  CARPENTRY_FARMING_IMAGE,
} from '../data/content';
import { SiteMediaSettings } from '../types';

interface FoundersSectionProps {
  siteMedia: SiteMediaSettings;
  onOpenPhotoReplacer: () => void;
}

export const FoundersSection: React.FC<FoundersSectionProps> = ({
  siteMedia,
  onOpenPhotoReplacer,
}) => {
  return (
    <section id="leadership" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
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

          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <div className="relative h-32 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900">
              <img
                src={siteMedia.growStageImage || FISHERIES_COOP_IMAGE}
                alt="Lakeshore Fisheries and Cooperative Stewardship"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-[11px] font-bold text-white">Lakeshore Cooperatives</span>
              </div>
            </div>
            <div className="relative h-32 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900">
              <img
                src={siteMedia.organiseStageImage || CARPENTRY_FARMING_IMAGE}
                alt="Youth Artisans and Vocational Workshops"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-between p-3">
                <span className="text-[11px] font-bold text-amber-300">Youth Artisans</span>
                <button
                  type="button"
                  onClick={onOpenPhotoReplacer}
                  className="p-1 rounded bg-slate-950/80 text-white hover:text-amber-300 cursor-pointer"
                  title="Admin: Replace Leadership & Section Photos"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {LEADERSHIP_PROFILES.map((leader) => {
            const portraitUrl = siteMedia[leader.mediaKey] || leader.image;
            return (
              <div
                key={leader.name}
                className="bg-[#FAF9F6] rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between p-6 sm:p-8"
              >
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                      <img
                        src={portraitUrl}
                        alt={leader.name}
                        referrerPolicy="no-referrer"
                        className="w-24 h-24 rounded-2xl object-cover border-2 border-[#0F5132]/30 shrink-0 bg-slate-900"
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

                    <button
                      type="button"
                      onClick={onOpenPhotoReplacer}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold self-start sm:self-center shrink-0 cursor-pointer"
                      title="Admin: Replace Portrait Photo"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#0F5132]" />
                      <span>Replace Photo</span>
                    </button>
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
            );
          })}
        </div>
      </div>
    </section>
  );
};
