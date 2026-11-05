import React from 'react';
import { ExternalLink, ShieldCheck, Lock, ArrowUpRight, MapPin } from 'lucide-react';
import { EngandaLogo } from './EngandaLogo';
import { SupportEnquiryPreset } from '../types';

interface FooterProps {
  onOpenSupportModal: (preset?: SupportEnquiryPreset) => void;
  onOpenAdminModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSupportModal,
  onOpenAdminModal,
}) => {
  return (
    <footer className="bg-[#071D14] text-emerald-100 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-emerald-900/80">
          {/* Brand Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <EngandaLogo variant="light" size="md" showSubtitle={true} />
            <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed max-w-sm">
              ENGANDA is an umbrella organisation in Entebbe, Uganda connecting informal youth and
              community groups to skills, formal economic structure, finance, visibility, and
              responsible partnerships.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-300/90">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Greater Entebbe, Uganda</span>
            </div>
          </div>

          {/* Navigation Column (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              ENGANDA Platform
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-emerald-100/85">
              <li>
                <a href="#home" className="hover:text-white transition-colors">
                  Overview
                </a>
              </li>
              <li>
                <a href="#about-network" className="hover:text-white transition-colors">
                  About & Operating Model
                </a>
              </li>
              <li>
                <a href="#programmes" className="hover:text-white transition-colors">
                  Flagship Programmes (SIZ, EGYA, LeoLeo)
                </a>
              </li>
              <li>
                <a href="#directory" className="hover:text-white transition-colors">
                  Complete Group Directory (15 Profiles)
                </a>
              </li>
              <li>
                <a href="#leadership" className="hover:text-white transition-colors">
                  Executive Leadership
                </a>
              </li>
            </ul>
          </div>

          {/* Connected Programmes & External Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              Network Programme Portals
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-emerald-100/85">
              <li>
                <a
                  href="https://siz-football-academy-erp.ai.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors"
                >
                  <span>SIZ Football Academy Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://leo-leo.ai.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors"
                >
                  <span>LeoLeo Programme Platform</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                </a>
              </li>
              <li>
                <a href="#programmes" className="hover:text-white transition-colors">
                  EGYA Association (Entebbe)
                </a>
              </li>
            </ul>
          </div>

          {/* Administration & Partnership Actions (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              Actions & Governance
            </h4>
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() =>
                  onOpenSupportModal({
                    groupId: 'grp-siz-academy',
                    groupName: 'SIZ Football Academy',
                    supportType: 'Sponsor',
                  })
                }
                className="inline-flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-colors cursor-pointer"
              >
                <span>Submit Enquiry</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onOpenAdminModal}
                className="inline-flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Member Admin</span>
                <Lock className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Privacy Assurance */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-emerald-300/75">
          <div>
            &copy; {new Date().getFullYear()} ENGANDA. All rights reserved. Connecting informal
            youth and community groups to formal opportunity.
          </div>
          <div className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Server-side member privacy enforced • No online payments processed on this site
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
