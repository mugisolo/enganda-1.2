import React, { useState } from 'react';
import { X, Building2, CheckCircle2, ArrowRight } from 'lucide-react';

interface PartnerInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartnerInquiryModal: React.FC<PartnerInquiryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [inquiryCode, setInquiryCode] = useState<string>('');

  const [form, setForm] = useState({
    organizationName: '',
    contactPerson: '',
    email: '',
    phone: '',
    partnershipType: 'Commercial Banking / Credit Facility',
    message: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/partner/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      const code = data.inquiryId || 'PRT-UG-7721';
      const { savePartnerInquiryToFirestore } = await import('../services/firebase');
      await savePartnerInquiryToFirestore({
        id: code,
        ...form,
      }).catch((err) => console.warn('Firestore inquiry sync note:', err));

      setInquiryCode(code);
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting inquiry:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <>
            <div className="mb-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
                Institutional Partnership Portal
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Partner with Enganda
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                For commercial banks, development agencies, the European Union, and philanthropic co-financiers.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Institution / Organization *
                </label>
                <input
                  type="text"
                  required
                  value={form.organizationName}
                  onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
                  placeholder="e.g. EU Delegation to Uganda / Development Bank"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.contactPerson}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                    placeholder="Full Name"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="partner@org.int"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Partnership Domain *
                </label>
                <select
                  value={form.partnershipType}
                  onChange={(e) => setForm({ ...form, partnershipType: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 text-slate-700 font-medium"
                >
                  <option value="Commercial Banking / Credit Facility">Commercial Banking / Credit Facility</option>
                  <option value="EU / Multilateral Development Grant">EU / Multilateral Development Grant</option>
                  <option value="Municipal Government Alignment">Municipal Government Alignment</option>
                  <option value="Fintech & Payment Systems">Fintech & Payment Systems</option>
                  <option value="Vocational Curriculum & Certification">Vocational Curriculum & Certification</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Strategic Scope & Intent
                </label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Outline your strategic objectives or co-financing scope..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 text-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 rounded-lg transition-colors shadow-xs"
                >
                  <span>{loading ? 'Submitting...' : 'Submit Partnership Dossier'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h4 className="text-xl font-bold text-slate-900">
              Inquiry Dossier Received
            </h4>

            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
              Thank you for supporting Uganda’s youth economic transformation. The office of Ronnie Tumusiime (Co-Founder & Head of Strategy) will review and respond within 48 business hours.
            </p>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 max-w-xs mx-auto text-xs font-mono">
              <span className="text-slate-500">Inquiry Tracking ID: </span>
              <strong className="text-emerald-800">{inquiryCode}</strong>
            </div>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="w-full py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                Close & Return to Platform
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
