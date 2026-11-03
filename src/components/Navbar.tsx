import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { GANDA_LOGO, FAVICON_LOGO } from '../data/content';
import { MessageSquare, PhoneCall, Menu, X, ArrowUpRight, UserCheck, Shield } from 'lucide-react';

interface NavbarProps {
  onOpenPartnerModal: () => void;
  onOpenRegisterModal: () => void;
  onOpenUssdModal: () => void;
  onOpenAdvisorModal: () => void;
  onOpenAdminPortal: () => void;
  onOpenUserPortal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPartnerModal,
  onOpenRegisterModal,
  onOpenUssdModal,
  onOpenAdvisorModal,
  onOpenAdminPortal,
  onOpenUserPortal,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const navT = t.nav;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Offline USSD & WhatsApp Utility Ribbon */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenUssdModal}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors text-left"
              title="Test USSD *217# offline demo"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="font-mono text-amber-400 font-semibold">*217#</span>
              <span className="hidden sm:inline text-slate-400">· {navT.ussdPrompt}</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={onOpenAdvisorModal}
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span>Enganda Omubeezi (AI Guide)</span>
            </button>
            <span className="text-slate-700 hidden md:inline">|</span>
            <button
              onClick={onOpenUserPortal}
              className="hidden md:flex items-center gap-1 text-slate-300 hover:text-emerald-300 transition-colors font-medium"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{navT.userPortal}</span>
            </button>
            <span className="text-slate-700 hidden md:inline">|</span>
            <button
              onClick={onOpenAdminPortal}
              className="hidden md:flex items-center gap-1 text-slate-400 hover:text-amber-300 transition-colors font-mono text-[11px]"
            >
              <Shield className="w-3 h-3 text-amber-500" />
              <span>{navT.adminPortal}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar adhering strictly to the Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-8">
          
          {/* Zone 1: Brand wordmark incorporating user's official Ganda Trust Protocol logo and emblem */}
          <a href="#" className="flex items-center gap-3 text-slate-900 whitespace-nowrap shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center p-1.5 shadow-xs group-hover:border-emerald-600 transition-colors shrink-0">
              <img
                src={FAVICON_LOGO}
                alt="Ganda Indigenous Trust Protocol Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex items-center gap-2">
              <img
                src={GANDA_LOGO}
                alt="ENGANDA"
                className="h-8 sm:h-9 w-auto object-contain max-w-[130px]"
              />
              <div className="hidden sm:flex flex-col border-l border-slate-200 pl-2">
                <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200/60 inline-block w-fit">
                  ENTEBBE
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500">
                  {t.protocolSubtitle || 'Indigenous Trust Protocol'}
                </span>
              </div>
            </div>
          </a>

          {/* Zone 2: Comprehensive navigation links */}
          <nav className="hidden lg:flex items-center gap-5 text-xs xl:text-sm font-medium text-slate-600">
            <a href="#about" className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0">
              {navT.about}
            </a>
            <a href="#pillars" className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0">
              {navT.pillars}
            </a>
            <a href="#pilot" className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0">
              {navT.pilot}
            </a>
            <a href="#impact" className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 font-semibold text-emerald-900">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              {navT.impact}
            </a>
            <a href="#invest" className="hover:text-amber-700 transition-colors whitespace-nowrap shrink-0 font-semibold text-amber-900">
              {navT.invest}
            </a>
            <a href="#partners" className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0">
              {navT.partners}
            </a>
            <a href="#founders" className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0">
              {navT.founders}
            </a>
          </nav>

          {/* Zone 3: Primary Action, User Portal, & Language Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Dynamic Bilingual Language Switcher (EN / LG) */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/80">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  language === 'en'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('lg')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  language === 'lg'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Kyusa okudda mu Luganda"
              >
                LG
              </button>
            </div>

            {/* Portal shortcut buttons */}
            <button
              onClick={onOpenUserPortal}
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>{navT.userPortal}</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenPartnerModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-700 active:bg-emerald-900 transition-colors shadow-xs whitespace-nowrap shrink-0"
            >
              <span>{navT.partnerCta}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg">
            <nav className="flex flex-col space-y-3 text-sm font-medium text-slate-700">
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-emerald-800 border-b border-slate-100"
              >
                {navT.about}
              </a>
              <a
                href="#pillars"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-emerald-800 border-b border-slate-100"
              >
                {navT.pillars}
              </a>
              <a
                href="#pilot"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-emerald-800 border-b border-slate-100"
              >
                {navT.pilot}
              </a>
              <a
                href="#impact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-emerald-800 border-b border-slate-100 font-semibold text-emerald-900"
              >
                {navT.impact}
              </a>
              <a
                href="#invest"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-amber-700 border-b border-slate-100 font-semibold text-amber-900"
              >
                {navT.invest}
              </a>
              <a
                href="#partners"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-emerald-800 border-b border-slate-100"
              >
                {navT.partners}
              </a>
              <a
                href="#founders"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-emerald-800 border-b border-slate-100"
              >
                {navT.founders}
              </a>
            </nav>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenUserPortal();
                }}
                className="w-full py-2.5 px-4 text-center text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-emerald-700" />
                <span>{navT.userPortal}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminPortal();
                }}
                className="w-full py-2.5 px-4 text-center text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 hover:bg-amber-100 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4 text-amber-700" />
                <span>{navT.adminPortal}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRegisterModal();
                }}
                className="w-full py-2.5 px-4 text-center text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                {navT.registerGroup}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
