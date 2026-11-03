import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { updateUserRoleInFirestore } from '../services/firebase';
import { GANDA_LOGO, TREE_PLANTING_IMAGE } from '../data/content';
import {
  X,
  Heart,
  Landmark,
  Users,
  Sprout,
  ShieldCheck,
  FileCheck,
  Download,
  CreditCard,
  Building,
  CheckCircle2,
  Calendar,
  ExternalLink,
  MapPin,
  Clock,
  Award,
  LogIn,
  LogOut,
} from 'lucide-react';

interface RoleUserPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPaymentModal: () => void;
}

export const RoleUserPortalModal: React.FC<RoleUserPortalModalProps> = ({
  isOpen,
  onClose,
  onOpenPaymentModal,
}) => {
  const { t, language } = useLanguage();
  const { user, profile, signIn, signOut } = useAuth();
  const portalT = t.userPortal;

  const [activeRole, setActiveRole] = useState<'donor' | 'partner' | 'member'>('donor');
  const [authError, setAuthError] = useState<string>('');

  useEffect(() => {
    if (profile?.role) {
      setActiveRole(profile.role);
    }
  }, [profile]);

  const handleRoleChange = async (role: 'donor' | 'partner' | 'member') => {
    setActiveRole(role);
    if (user) {
      try {
        await updateUserRoleInFirestore(role);
      } catch (err) {
        console.error('Role update error:', err);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full h-[88vh] shadow-2xl border border-slate-200 flex flex-col relative overflow-hidden">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-emerald-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={GANDA_LOGO}
              alt="Enganda Trust Protocol"
              className="w-8 h-8 object-contain"
            />
            <div>
              <h3 className="text-sm font-bold tracking-tight">{portalT.title}</h3>
              <p className="text-[11px] text-emerald-300">{portalT.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user && (
              <div className="hidden sm:flex items-center gap-2 bg-emerald-900/80 border border-emerald-800 px-3 py-1 rounded-lg text-xs">
                <span className="text-emerald-200 truncate max-w-[140px]">
                  {user.displayName || user.email}
                </span>
                <button
                  type="button"
                  onClick={signOut}
                  className="text-amber-300 hover:text-white flex items-center gap-1 font-semibold ml-1"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-900 transition-colors"
              aria-label="Close user portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Authentication Banner / Sign-In Prompt for Protected Firestore Sync */}
        {!user && (
          <div className="px-6 py-3 bg-amber-50 border-b border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                {language === 'lg'
                  ? 'Yingira ne Google okutereka ebikukwatako n’ebiwandiiko byo mu Cloud Firestore.'
                  : 'Sign in with Google to sync your personal donor receipts, KYB dossiers, and SACCO records with Cloud Firestore.'}
              </span>
            </div>
            <button
              type="button"
              onClick={async () => {
                try {
                  setAuthError('');
                  await signIn();
                } catch (err: any) {
                  setAuthError(err?.message || 'Sign-in cancelled');
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors shrink-0 shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign in with Google</span>
            </button>
          </div>
        )}
        {authError && (
          <div className="px-6 py-1.5 bg-rose-50 text-rose-700 text-[11px] border-b border-rose-200">
            {authError}
          </div>
        )}

        {/* Role Selector Tabs */}
        <div className="px-6 border-b border-slate-200 bg-slate-50 flex gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => handleRoleChange('donor')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeRole === 'donor'
                ? 'border-emerald-800 text-emerald-900 bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>{portalT.roles.donor}</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('partner')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeRole === 'partner'
                ? 'border-emerald-800 text-emerald-900 bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Landmark className="w-4 h-4 text-amber-600" />
            <span>{portalT.roles.partner}</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('member')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeRole === 'member'
                ? 'border-emerald-800 text-emerald-900 bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>{portalT.roles.member}</span>
          </button>
        </div>

        {/* Role Workspace Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          
          {/* ROLE 1: DONOR / TREE SPONSOR */}
          {activeRole === 'donor' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    {portalT.donor.title}
                  </span>
                  <h4 className="text-2xl font-black text-slate-900 mt-1">
                    5 Indigenous Shoreline Trees Active
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg leading-relaxed">
                    {portalT.donor.treesPlantedNotice}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
                  <button
                    onClick={() => {
                      alert('Impact Tax Exemption Dossier ENG-2026-TAX-0918 downloaded.');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{portalT.donor.taxReceiptBtn}</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenPaymentModal();
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors"
                  >
                    <Sprout className="w-3.5 h-3.5 text-amber-300" />
                    <span>Sponsor Additional Trees</span>
                  </button>
                </div>
              </div>

              {/* Verified Tree Planting GPS Coordinates Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-1">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span>Lakeshore Concession Plot A</span>
                  </div>
                  <span className="font-mono text-xs text-slate-500 block">GPS: 0.0512° N, 32.4637° E</span>
                  <span className="text-xs font-bold text-emerald-800 mt-2 block">Kigungu Landing Shoreline</span>
                  <span className="text-[10px] text-slate-400">Planted by Kigungu Artisans · Oct 2024</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-1">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span>Lakeshore Concession Plot B</span>
                  </div>
                  <span className="font-mono text-xs text-slate-500 block">GPS: 0.0620° N, 32.4810° E</span>
                  <span className="text-xs font-bold text-emerald-800 mt-2 block">Kasenyi Beach Buffer</span>
                  <span className="text-[10px] text-slate-400">Planted by Kasenyi Eco-Guides · Jan 2025</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-1">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span>Lakeshore Concession Plot C</span>
                  </div>
                  <span className="font-mono text-xs text-slate-500 block">GPS: 0.0489° N, 32.4590° E</span>
                  <span className="text-xs font-bold text-emerald-800 mt-2 block">Bugonga Catholic Buffer</span>
                  <span className="text-[10px] text-slate-400">Planted by Green Guardians · Mar 2025</span>
                </div>
              </div>

              {/* Tree Photo Verification */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-6 items-center">
                <img
                  src={TREE_PLANTING_IMAGE}
                  alt="Entebbe community reforestation"
                  className="w-full md:w-56 h-36 object-cover rounded-xl border border-slate-200"
                />
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Community Stewardship Audit
                  </span>
                  <h5 className="text-base font-bold text-slate-900">
                    100% Youth-Maintained Shoreline Nursery
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Under agreement with Entebbe Municipal Council, our youth cohorts provide weekly watering, weeding, and digital geotag monitoring for all 24,250+ seedlings planted along the lakeshore.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ROLE 2: INSTITUTIONAL PARTNER (EcoBank, EU, Council) */}
          {activeRole === 'partner' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  {portalT.partner.title}
                </span>
                <h4 className="text-xl font-bold text-slate-900 mt-1">
                  EcoBank, Entebbe Municipal Council & EU Governance Console
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
                  {portalT.partner.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* EcoBank KYB Fast Track Card */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      EcoBank Group KYB Verification
                    </span>
                    <span className="font-mono text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                      18 / 21 Approved
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Informal groups undergo peer verification, council recommendation letters, and constitutional multi-signatory setup to eliminate individual default risk.
                  </p>

                  <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Pending Review:</span>
                      <strong className="text-slate-800">3 Groups (Katabi & Kitoro)</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Average Daily Turnover:</span>
                      <strong className="font-mono text-emerald-800">UGX 420,000 / group</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => alert('EcoBank KYB Validation Package exported.')}
                    className="w-full py-2 text-center text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
                  >
                    Download EcoBank Cohort KYB Batch Dossier
                  </button>
                </div>

                {/* EU Grant Compliance & Monitoring */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      EU Youth Employment Grant Facility
                    </span>
                    <span className="font-mono text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold">
                      Audited & Compliant
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Vocational apprenticeship standards, safety tool gear distribution, and third-party accounting logs validated for EU co-funding tranches.
                  </p>

                  <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Grant Tranche 1 (2024):</span>
                      <strong className="font-mono text-slate-800">100% Reconciled</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Grant Tranche 2 (2025):</span>
                      <strong className="font-mono text-emerald-800">Disbursed · Active in Entebbe</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => alert('EU Governance & Audited Financial Statements downloaded.')}
                    className="w-full py-2 text-center text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Download Signed EU Grant Governance Dossier
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* ROLE 3: YOUTH GROUP LEADER / MEMBER */}
          {activeRole === 'member' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    {portalT.member.title}
                  </span>
                  <h4 className="text-xl font-bold text-slate-900 mt-1">
                    Kitoro Boda Boda Savings Syndicate (ENG-ENT-002)
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg">
                    {portalT.member.subtitle}
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 shrink-0 text-right">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">EcoBank Commercial Account</span>
                  <span className="font-mono text-sm font-extrabold text-slate-900">#80429188</span>
                  <span className="text-[11px] text-emerald-700 block font-medium">Status: Active & Credit-Ready</span>
                </div>
              </div>

              {/* Group Workspace Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Card 1: Legal Registration */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <FileCheck className="w-4 h-4 text-emerald-700" />
                    <span>URSB Cooperative Status</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Legal Name:</span>
                      <strong className="text-slate-800">Kitoro Youth SACCO Ltd</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Registration ID:</span>
                      <strong className="font-mono text-slate-800">URSB-SACCO-49102</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Signatories:</span>
                      <strong className="text-slate-800">3 Joint Multi-Sign</strong>
                    </div>
                  </div>
                </div>

                {/* Card 2: Relworx Dues Ledger */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <CreditCard className="w-4 h-4 text-emerald-700" />
                    <span>Daily Relworx Dues (*217#)</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Daily Member Due:</span>
                      <strong className="font-mono text-slate-800">UGX 2,000 / day</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">This Month Collected:</span>
                      <strong className="font-mono text-emerald-800">UGX 8,420,000</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Default Rate:</span>
                      <strong className="font-mono text-emerald-700">0.8% (Peer Guarantee)</strong>
                    </div>
                  </div>
                </div>

                {/* Card 3: Artisan Apprenticeships */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Skilling & Tooling Pool</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Certified Apprentices:</span>
                      <strong className="font-mono text-slate-800">42 Members</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Shared Tooling Kit:</span>
                      <strong className="text-slate-800">Diagnostics & Spares Pool</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Trees Planted:</span>
                      <strong className="font-mono text-emerald-700">450 Trees</strong>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons for Group Leaders */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-slate-600">
                  Need to add new youth members or request a tooling grant from EcoBank?
                </span>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => alert('Certificate request submitted to Enganda vocational directorate.')}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    {portalT.member.orderCertificate}
                  </button>
                  <button
                    onClick={() => alert('New member onboarding request queued for EcoBank KYC verification.')}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors"
                  >
                    Add Group Member
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
