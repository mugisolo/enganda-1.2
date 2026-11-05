import React, { useState } from 'react';
import {
  ExternalLink,
  ShieldCheck,
  Lock,
  ArrowUpRight,
  MapPin,
  Mail,
  CheckCircle2,
  AlertCircle,
  History,
} from 'lucide-react';
import { EngandaLogo } from './EngandaLogo';
import { SupportEnquiryPreset } from '../types';
import { saveNewsletterSubscriptionToFirestore } from '../services/firebase';

interface FooterProps {
  onOpenSupportModal: (preset?: SupportEnquiryPreset) => void;
  onOpenAdminModal: () => void;
  onOpenTransitionModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSupportModal,
  onOpenAdminModal,
  onOpenTransitionModal,
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successRef, setSuccessRef] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!consent) {
      setErrorMsg('Please confirm your consent to receive the quarterly ENGANDA Impact Newsletter.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          name: name.trim(),
          organisation: organisation.trim(),
          consent: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to save subscription.');
        setSubmitting(false);
        return;
      }

      const subRecord = data.subscription;
      if (subRecord?.id) {
        await saveNewsletterSubscriptionToFirestore({
          id: subRecord.id,
          reference: subRecord.reference,
          email: subRecord.email,
          name: subRecord.name,
          organisation: subRecord.organisation,
          consent: true,
        });
      }

      setSuccessRef(data.reference || 'NEWS-00001');
      setEmail('');
      setName('');
      setOrganisation('');
      setConsent(false);
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setErrorMsg('Network error while saving subscription. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#071D14] text-emerald-100 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 space-y-10">
        {/* Quarterly ENGANDA Impact Newsletter Subscription Banner */}
        <div className="rounded-2xl bg-[#0B2B1E] border border-emerald-800/80 p-5 sm:p-6 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-900 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider">
                <Mail className="w-3.5 h-3.5" />
                <span>Quarterly Partner Dispatch</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white font-['Plus_Jakarta_Sans',sans-serif]">
                ENGANDA Impact Newsletter
              </h3>
              <p className="text-xs text-emerald-100/85 leading-relaxed">
                Receive quarterly verified progress briefings on the 690 Entebbe member cohort,
                SACCO formalisation milestones, and institutional partnerships advancing toward the{' '}
                <strong className="text-amber-300">2,000,000 youth transition goal</strong>.
              </p>
            </div>

            <div className="lg:col-span-7">
              {successRef ? (
                <div className="rounded-xl bg-emerald-950/90 border border-emerald-700 p-4 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-extrabold text-white">
                        Subscribed to the Quarterly ENGANDA Impact Newsletter
                      </div>
                      <p className="text-xs text-emerald-200/90 mt-0.5">
                        Your subscription and consent have been stored in the database (Ref:{' '}
                        <span className="font-mono font-bold text-amber-300">{successRef}</span>).
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSuccessRef('')}
                    className="text-xs font-bold text-amber-300 hover:underline shrink-0 cursor-pointer"
                  >
                    Add another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label htmlFor="newsletter-name" className="sr-only">
                        Your Name (Optional)
                      </label>
                      <input
                        id="newsletter-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name (optional)"
                        className="w-full px-3 py-2 rounded-lg bg-emerald-950/90 border border-emerald-800 text-xs text-white placeholder:text-emerald-300/50 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label htmlFor="newsletter-org" className="sr-only">
                        Organisation (Optional)
                      </label>
                      <input
                        id="newsletter-org"
                        type="text"
                        value={organisation}
                        onChange={(e) => setOrganisation(e.target.value)}
                        placeholder="Organisation (optional)"
                        className="w-full px-3 py-2 rounded-lg bg-emerald-950/90 border border-emerald-800 text-xs text-white placeholder:text-emerald-300/50 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label htmlFor="newsletter-email" className="sr-only">
                        Work or Partner Email Address
                      </label>
                      <input
                        id="newsletter-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Partner email address *"
                        className="w-full px-3 py-2 rounded-lg bg-emerald-950/90 border border-emerald-800 text-xs text-white placeholder:text-emerald-300/50 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <label className="inline-flex items-start gap-2 text-[11px] text-emerald-100/90 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 rounded border-emerald-700 text-amber-500 focus:ring-amber-400"
                      />
                      <span>
                        I consent to ENGANDA storing my contact details to send quarterly updates on
                        the 2,000,000 youth transition goal.
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-extrabold transition-colors shrink-0 cursor-pointer"
                    >
                      <span>{submitting ? 'Saving...' : 'Subscribe Quarterly'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {errorMsg && (
                    <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-semibold">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-emerald-900/80">
          {/* Brand Column (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <EngandaLogo variant="light" size="md" showSubtitle={false} />
            <p className="text-xs text-emerald-200/80 leading-relaxed max-w-sm">
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
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              ENGANDA Platform
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100/85">
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
                <a href="#impact-metrics" className="hover:text-white transition-colors">
                  Impact Metrics & Entebbe Map
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
            </ul>
          </div>

          {/* Connected Programmes & External Links (3 cols) */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              Network Programme Portals
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100/85">
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
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              Governance
            </h4>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() =>
                  onOpenSupportModal({
                    groupId: 'grp-siz-academy',
                    groupName: 'SIZ Football Academy',
                    supportType: 'Sponsor',
                  })
                }
                className="inline-flex items-center justify-between px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-colors cursor-pointer"
              >
                <span>Submit Enquiry</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onOpenTransitionModal}
                className="inline-flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-950/90 hover:bg-emerald-800 text-amber-300 border border-emerald-800 text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Transition Log</span>
                <History className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onOpenAdminModal}
                className="inline-flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Member Admin</span>
                <Lock className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Privacy Assurance */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-emerald-300/75">
          <div>
            &copy; {new Date().getFullYear()} ENGANDA. All rights reserved. Connecting informal
            youth and community groups to formal opportunity.
          </div>
          <div className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Server-side member privacy & Firestore rules enforced • No online payments processed
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
