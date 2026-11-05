import React, { useState } from 'react';
import { Menu, X, ShieldCheck, ArrowUpRight, Lock } from 'lucide-react';
import { EngandaLogo } from './EngandaLogo';
import { useAuth } from '../context/AuthContext';
import { SupportEnquiryPreset } from '../types';

interface NavbarProps {
  onOpenSupportModal: (preset?: SupportEnquiryPreset) => void;
  onOpenAdminModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSupportModal,
  onOpenAdminModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isGlobalAdmin, assignedGroupIds } = useAuth();

  const navLinks = [
    { label: 'Overview', href: '#home' },
    { label: 'About & Network Model', href: '#about-network' },
    { label: 'Flagship Programmes', href: '#programmes' },
    { label: 'Group Directory (15)', href: '#directory' },
    { label: 'Leadership', href: '#leadership' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF9F6]/95 backdrop-blur-md border-b border-slate-200/80">
      {/* Top Institutional Bar */}
      <div className="bg-[#0B2B1E] text-emerald-100 text-xs border-b border-emerald-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <span className="font-medium text-emerald-100/90 truncate">
              ENGANDA Umbrella Network • Entebbe, Uganda • 15 Active Profiles & 690 Reconciled Member Records
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={onOpenAdminModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/60 font-semibold transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {user
                  ? isGlobalAdmin
                    ? 'Global Admin Console'
                    : assignedGroupIds.length > 0
                    ? `Group Admin (${assignedGroupIds.length})`
                    : 'Member Admin Portal'
                  : 'Member Administration'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[74px] flex items-center justify-between gap-4">
        <a
          href="#home"
          className="focus:outline-none focus:ring-2 focus:ring-emerald-700 rounded-lg shrink-0"
        >
          <EngandaLogo variant="dark" size="md" showSubtitle={true} />
        </a>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-slate-700 hover:text-[#0F5132] transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAdminModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors cursor-pointer min-h-[40px]"
          >
            <ShieldCheck className="w-4 h-4 text-[#0F5132]" />
            <span>Admin & Registry</span>
          </button>

          <button
            onClick={() =>
              onOpenSupportModal({
                groupId: 'grp-siz-academy',
                groupName: 'SIZ Football Academy',
                supportType: 'Partner',
              })
            }
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#0F5132] hover:bg-emerald-900 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer min-h-[40px]"
          >
            <span>Partner or Sponsor</span>
            <ArrowUpRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden inline-flex items-center justify-center p-2.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl max-h-[calc(100dvh-4rem)] overflow-y-auto">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-bold text-slate-800 hover:bg-emerald-50 hover:text-[#0F5132] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminModal();
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 text-xs font-bold"
            >
              <ShieldCheck className="w-4 h-4 text-[#0F5132]" />
              <span>Member Administration & Registry</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSupportModal({
                  groupId: 'grp-siz-academy',
                  groupName: 'SIZ Football Academy',
                  supportType: 'Partner',
                });
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#0F5132] text-white text-xs font-bold shadow-sm"
            >
              <span>Partner, Sponsor or Invest</span>
              <ArrowUpRight className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
