import React, { useState } from 'react';
import { Menu, X, ShieldCheck, ArrowUpRight, Lock, History } from 'lucide-react';
import { EngandaLogo } from './EngandaLogo';
import { useAuth } from '../context/AuthContext';
import { SupportEnquiryPreset } from '../types';

interface NavbarProps {
  onOpenSupportModal: (preset?: SupportEnquiryPreset) => void;
  onOpenAdminModal: () => void;
  onOpenTransitionModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSupportModal,
  onOpenAdminModal,
  onOpenTransitionModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isGlobalAdmin, assignedGroupIds } = useAuth();

  const navLinks = [
    { label: 'Overview', href: '#home' },
    { label: 'About', href: '#about-network' },
    { label: 'Impact & Map', href: '#impact-metrics' },
    { label: 'Programmes', href: '#programmes' },
    { label: 'Directory (15)', href: '#directory' },
    { label: 'Leadership', href: '#leadership' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF9F6]/95 backdrop-blur-md border-b border-slate-200/80">
      {/* Top Institutional Bar */}
      <div className="bg-[#0B2B1E] text-emerald-100 text-[11px] border-b border-emerald-900/60">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            <span className="font-medium text-emerald-100/90 truncate">
              ENGANDA • Entebbe, Uganda • 15 Public Profiles & 690 Reconciled Member Records
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <button
              type="button"
              onClick={onOpenTransitionModal}
              className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/90 hover:bg-emerald-800 text-amber-300 border border-emerald-700/60 font-semibold transition-colors cursor-pointer"
            >
              <History className="w-3 h-3" />
              <span>Transition Log</span>
            </button>
            <button
              type="button"
              onClick={onOpenAdminModal}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/60 font-semibold transition-colors cursor-pointer"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>
                {user
                  ? isGlobalAdmin
                    ? 'Global Admin'
                    : assignedGroupIds.length > 0
                    ? `Group Admin (${assignedGroupIds.length})`
                    : 'Admin Portal'
                  : 'Member Admin'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Row - Compact & Zero Overflow */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        <a
          href="#home"
          className="focus:outline-none focus:ring-2 focus:ring-emerald-700 rounded-lg shrink-0"
        >
          <EngandaLogo variant="dark" size="sm" showSubtitle={false} />
        </a>

        {/* Desktop Links */}
        <nav
          className="hidden lg:flex items-center gap-4 xl:gap-6 min-w-0"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs xl:text-[13px] font-semibold text-slate-700 hover:text-[#0F5132] transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs - Sized compactly to stay comfortably within margins */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenAdminModal}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-[11px] font-bold transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#0F5132] shrink-0" />
            <span className="whitespace-nowrap">Registry</span>
          </button>

          <button
            type="button"
            onClick={() =>
              onOpenSupportModal({
                groupId: 'grp-siz-academy',
                groupName: 'SIZ Football Academy',
                supportType: 'Partner',
              })
            }
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0F5132] hover:bg-emerald-900 text-white text-[11px] font-bold shadow-sm transition-colors cursor-pointer"
          >
            <span className="whitespace-nowrap">Partner or Sponsor</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-2.5 pb-5 space-y-2.5 shadow-xl max-h-[calc(100dvh-3.5rem)] overflow-y-auto">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-[#0F5132] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2.5 border-t border-slate-200 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTransitionModal();
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-950 text-xs font-bold"
            >
              <History className="w-3.5 h-3.5 text-amber-700" />
              <span>View Transition History Log</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminModal();
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 text-xs font-bold"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#0F5132]" />
              <span>Member Administration & Registry</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSupportModal({
                  groupId: 'grp-siz-academy',
                  groupName: 'SIZ Football Academy',
                  supportType: 'Partner',
                });
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#0F5132] text-white text-xs font-bold shadow-sm"
            >
              <span>Partner, Sponsor or Invest</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-300" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
