import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Info, ShieldCheck, Send } from 'lucide-react';
import { PublicGroupProfile, SupportEnquiryPreset, SupportType } from '../types';
import { syncEnquiryToFirestore } from '../services/firebase';

interface SupportEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: PublicGroupProfile[];
  preset: SupportEnquiryPreset | null;
}

export const SupportEnquiryModal: React.FC<SupportEnquiryModalProps> = ({
  isOpen,
  onClose,
  profiles,
  preset,
}) => {
  const [groupId, setGroupId] = useState<string>('grp-siz-academy');
  const [supportType, setSupportType] = useState<SupportType>('Sponsor');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [packageName, setPackageName] = useState('General Support');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] = useState<{
    reference: string;
    groupName: string;
    supportType: string;
    packageName: string;
    notice: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSubmittedResult(null);
      setErrorMsg(null);
      if (preset) {
        setGroupId(preset.groupId || 'grp-siz-academy');
        setSupportType(preset.supportType || 'Sponsor');
        if (preset.packageName) {
          setPackageName(preset.packageName);
        } else if (preset.groupId === 'grp-siz-academy') {
          setPackageName('Eco-Captain (UGX 15,000,000)');
        } else {
          setPackageName('General Programme / Group Support');
        }
      }
    }
  }, [isOpen, preset]);

  if (!isOpen) return null;

  const selectedProfile = profiles.find((p) => p.id === groupId);
  const isSizSelected = groupId === 'grp-siz-academy';

  const packageOptions = isSizSelected
    ? [
        'Eco-Captain (UGX 15,000,000)',
        'Playmaker (UGX 8,000,000)',
        'Green Striker (UGX 3,000,000)',
        'Grassroots In-Kind (Custom pledge)',
        'Plant a Tree, Plant a Player — Tree Sponsorship',
      ]
    : [
        'General Programme / Group Support',
        'Working Capital / SACCO Co-Investment',
        'Vocational Equipment & Tooling Grant',
        'Technical Skills & Mentorship Partnership',
        'Custom Institutional Partnership',
      ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!contactName.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please complete your name, email address, and enquiry message.');
      return;
    }

    if (!consent) {
      setErrorMsg('Please confirm consent to store your enquiry for ENGANDA follow-up.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupId,
          supportType,
          contactName: contactName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          organisation: organisation.trim(),
          packageName,
          message: message.trim(),
          consent,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Could not submit enquiry. Please check your entries.');
      } else {
        await syncEnquiryToFirestore({
          id: data.reference,
          reference: data.reference,
          groupId,
          groupName: data.enquiry?.groupName || selectedProfile?.name || 'ENGANDA Network',
          supportType,
          contactName: contactName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          organisation: organisation.trim(),
          packageName,
          message: message.trim(),
        }).catch(() => {});

        setSubmittedResult({
          reference: data.reference,
          groupName: data.enquiry?.groupName || selectedProfile?.name || 'ENGANDA Network',
          supportType,
          packageName,
          notice: data.notice,
        });
      }
    } catch (err) {
      console.error('Enquiry submit error:', err);
      setErrorMsg('Network error while recording enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92dvh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#0B2B1E] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-emerald-800 sticky top-0 z-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 block">
              ENGANDA Network Partnership & Support Desk
            </span>
            <h3 className="text-base sm:text-lg font-extrabold tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              Submit Sponsorship, Investment or Partnership Enquiry
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-2 rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Mandatory Transparent Non-Payment Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-amber-950">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Important Notice:</strong> No payment or investment transaction occurs on this
              website. Submitting this form records an official enquiry in the ENGANDA registry and
              returns a tracking reference (e.g. <code className="font-mono font-bold">ENG-00001</code>)
              for direct follow-up by our secretariat.
            </div>
          </div>

          {submittedResult ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#0F5132] text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-amber-300" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#0F5132]">
                  Enquiry Persistently Recorded
                </span>
                <h4 className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
                  Reference: {submittedResult.reference}
                </h4>
              </div>

              <div className="bg-white rounded-xl p-4 border border-emerald-200 text-left text-xs space-y-1.5 max-w-md mx-auto">
                <div>
                  <span className="text-slate-500">Selected Group / Programme:</span>{' '}
                  <strong className="text-slate-900">{submittedResult.groupName}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Pathway Type:</span>{' '}
                  <strong className="text-slate-900">{submittedResult.supportType}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Selected Package / Focus:</span>{' '}
                  <strong className="text-slate-900">{submittedResult.packageName}</strong>
                </div>
              </div>

              <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                {submittedResult.notice}
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#0F5132] hover:bg-emerald-900 text-white text-xs font-bold cursor-pointer"
                >
                  Done & Return to Directory
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Selected Group or Programme *
                  </label>
                  <select
                    value={groupId}
                    onChange={(e) => {
                      const nextId = e.target.value;
                      setGroupId(nextId);
                      if (nextId === 'grp-siz-academy') {
                        setPackageName('Eco-Captain (UGX 15,000,000)');
                      } else {
                        setPackageName('General Programme / Group Support');
                      }
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white text-slate-900 font-semibold"
                  >
                    {profiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.location})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Support Pathway Type *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Sponsor', 'Invest', 'Partner'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSupportType(t)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          supportType === t
                            ? 'bg-[#0F5132] text-white border-[#0F5132]'
                            : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Package or Support Focus *
                </label>
                <select
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white text-slate-900"
                >
                  {packageOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@organisation.org"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+256 772 000 000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Organisation / Institution (Optional)
                  </label>
                  <input
                    type="text"
                    value={organisation}
                    onChange={(e) => setOrganisation(e.target.value)}
                    placeholder="Company, Foundation, or Individual"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enquiry Details / Proposed Collaboration *
                </label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your proposed sponsorship, investment interest, or partnership goals..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#0F5132] focus:ring-[#0F5132]"
                />
                <span className="text-xs text-slate-700 leading-relaxed">
                  I consent to ENGANDA storing this enquiry so that authorised ENGANDA
                  administrators can review and contact me regarding this partnership or support
                  request. I understand that no online payment or financial transaction is processed
                  here.
                </span>
              </label>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F5132] hover:bg-emerald-900 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  <span>{submitting ? 'Recording Enquiry...' : 'Submit Official Enquiry'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
