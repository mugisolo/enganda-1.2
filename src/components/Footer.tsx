import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { GANDA_LOGO, FAVICON_LOGO } from '../data/content';
import { MapPin, Mail, Phone, FileText, UserCheck, Shield } from 'lucide-react';

interface FooterProps {
  onOpenPartnerModal: () => void;
  onOpenRegisterModal: () => void;
  onOpenUssdModal: () => void;
  onOpenAdvisorModal: () => void;
  onOpenAdminPortal: () => void;
  onOpenUserPortal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPartnerModal,
  onOpenRegisterModal,
  onOpenUssdModal,
  onOpenAdvisorModal,
  onOpenAdminPortal,
  onOpenUserPortal,
}) => {
  const { t, language } = useLanguage();
  const navT = t.nav;

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1 & 2: Brand & Official Trust Protocol Emblem */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center p-1.5 shrink-0">
                <img
                  src={FAVICON_LOGO}
                  alt="Enganda Trust Protocol"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={GANDA_LOGO}
                  alt="ENGANDA"
                  className="h-8 w-auto object-contain brightness-110"
                />
                <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono tracking-wider border-l border-slate-800 pl-2">
                  {t.protocolSubtitle || 'Indigenous Trust Protocol · Entebbe'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {language === 'lg'
                ? 'Kibiina eky’obwannakyewa ekitegeka abavubuka obukadde bubiri (2,000,000) wansi w’emyaka 30 okufuuka ebibiina ebiwandiise mu mateeka, ebyewola, era ebitegeke mu by’enfuna.'
                : 'Ugandan social enterprise dedicated to transitioning 2,000,000 informal sector youth under 30 into formalized, bankable, and structured economic units.'}
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Entebbe Municipality, Division A, Lake Victoria Basin, Uganda</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Executive Office: +256 772 109 231 / +256 702 449 811</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Official Inquiries: info@enganda.ug · partnerships@enganda.ug</span>
              </div>
            </div>
          </div>

          {/* Col 3: Core Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              {language === 'lg' ? 'Eby’Okulondako' : 'Platform Navigation'}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="#about" className="hover:text-emerald-400 transition-colors">
                  {navT.about}
                </a>
              </li>
              <li>
                <a href="#pillars" className="hover:text-emerald-400 transition-colors">
                  {navT.pillars}
                </a>
              </li>
              <li>
                <a href="#pilot" className="hover:text-emerald-400 transition-colors">
                  {navT.pilot}
                </a>
              </li>
              <li>
                <a href="#impact" className="hover:text-emerald-400 transition-colors text-emerald-300 font-medium">
                  {navT.impact}
                </a>
              </li>
              <li>
                <a href="#invest" className="hover:text-amber-400 transition-colors text-amber-300 font-medium">
                  {navT.invest}
                </a>
              </li>
              <li>
                <a href="#partners" className="hover:text-emerald-400 transition-colors">
                  {navT.partners}
                </a>
              </li>
              <li>
                <a href="#founders" className="hover:text-emerald-400 transition-colors">
                  {navT.founders}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Operations & Tooling */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              {language === 'lg' ? 'Ebyuma n’Enkola' : 'Field & Digital Tools'}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={onOpenRegisterModal}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  {navT.registerGroup}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenUssdModal}
                  className="hover:text-amber-400 transition-colors text-left font-mono"
                >
                  Offline USSD (*217#)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdvisorModal}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Enganda Omubeezi (AI Advisor)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenUserPortal}
                  className="hover:text-emerald-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{navT.userPortal}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdminPortal}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-500" />
                  <span>{navT.adminPortal}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Governance & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              {language === 'lg' ? 'Enkola n’Emitindo' : 'Governance & Standards'}
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <span className="block font-semibold text-white text-[11px] mb-1">
                  EU & Municipal Oversight
                </span>
                <p className="text-[10px] text-slate-300 leading-normal">
                  {language === 'lg'
                    ? 'Ebibiina byonna bya URSB, bikolera ku bbanka ya EcoBank, era bisimba emiti n’olukiiko lw’ekibuga ky’e Ntebbe.'
                    : 'All youth cohorts adhere to audited URSB governance, EcoBank multi-signatory protocols, and Entebbe Municipal Council environmental bylaws.'}
                </p>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <FileText className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <a href="#pilot" className="hover:text-white underline">
                  {language === 'lg' ? 'Ebibala by’e Ntebbe (2024–2025)' : 'Audited Pilot Results (2024–2025)'}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Quiet Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Enganda Social Enterprise Ltd. Incorporated in the Republic of Uganda.
          </div>
          <div className="flex items-center gap-6">
            <span>Entebbe Pilot Benchmark</span>
            <span>·</span>
            <span>Relworx MoMo Gateway</span>
            <span>·</span>
            <span>EcoBank Uganda</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
