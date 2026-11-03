import React, { useState } from 'react';
import { X, CheckCircle, ArrowRight, ArrowLeft, Building2, Users, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { saveGroupToFirestore } from '../services/firebase';

interface GroupRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRegistered: () => void;
}

export const GroupRegistrationModal: React.FC<GroupRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccessRegistered,
}) => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    division: 'Entebbe Division A',
    location: '',
    memberCount: '25',
    trade: 'Metal Fabrication & Welding',
    womenPercentage: '40',
    leaderName: '',
    leaderPhone: '',
    leaderEmail: '',
    saccoIntent: true,
    ecobankAccountNeeded: true,
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name.trim() || !formData.location.trim()) {
        return;
      }
    }
    if (step === 2) {
      if (!formData.memberCount || Number(formData.memberCount) <= 0) {
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.leaderName.trim() || !formData.leaderPhone.trim()) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/groups/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Registration failed');
      }

      const data = await res.json();
      if (data.group) {
        await saveGroupToFirestore(data.group).catch((err) =>
          console.warn('Firestore group registration note:', err)
        );
      }
      setResult(data);
      setStep(4);
      onSuccessRegistered();
    } catch (err: any) {
      console.error('Error registering group:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            Enganda Incubation Portal
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            Register Your Youth Group
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Begin the pathway to legal formalization, EcoBank commercial banking, and Relworx USSD payment integration.
          </p>
        </div>

        {/* Stepper Indicator */}
        {step < 4 && (
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex flex-col gap-1">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    step >= s ? 'bg-emerald-700' : 'bg-slate-200'
                  }`}
                />
                <span className="text-[10px] font-bold text-slate-500">
                  {s === 1 ? '1. Location' : s === 2 ? '2. Trade & Scale' : '3. Banking & Lead'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Location & Group Identity */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Group / Association Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Kigungu Metal & Solar Artisans"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Municipality / Division *
                </label>
                <select
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="Entebbe Division A">Entebbe Division A</option>
                  <option value="Entebbe Division B">Entebbe Division B</option>
                  <option value="Katabi Town Council">Katabi Town Council</option>
                  <option value="Greater Kampala Corridor">Greater Kampala Corridor</option>
                  <option value="Wakiso District (Other)">Wakiso District (Other)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Specific Ward / Street / Landing Site *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Kitoro Taxi Park Stage 3"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <span>Continue to Trade Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Trade & Demographics */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Primary Trade Cluster *
              </label>
              <select
                name="trade"
                value={formData.trade}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="Metal Fabrication & Welding">Metal Fabrication & Welding</option>
                <option value="Boat Carpentry & Lake Logistics">Boat Carpentry & Lake Logistics</option>
                <option value="Boda Boda Transport Syndicate">Boda Boda Transport Syndicate</option>
                <option value="Eco-Briquettes & Waste Recovery">Eco-Briquettes & Waste Recovery</option>
                <option value="Garment & Apparel Manufacturing">Garment & Apparel Manufacturing</option>
                <option value="Seedling Nursery & Urban Agriculture">Seedling Nursery & Urban Agriculture</option>
                <option value="Leatherwork & Footwear Craft">Leatherwork & Footwear Craft</option>
                <option value="Solar Maintenance & Hardware Repair">Solar Maintenance & Hardware Repair</option>
                <option value="Food Processing & Value Addition">Food Processing & Value Addition</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Youth Member Count (under 30) *
                </label>
                <input
                  type="number"
                  name="memberCount"
                  min="5"
                  max="500"
                  value={formData.memberCount}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Female Participation (%) *
                </label>
                <input
                  type="number"
                  name="womenPercentage"
                  min="0"
                  max="100"
                  value={formData.womenPercentage}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white font-mono"
                  required
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <span>Continue to Leadership</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Leadership & Banking */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Lead Coordinator / Chairperson Name *
                </label>
                <input
                  type="text"
                  name="leaderName"
                  value={formData.leaderName}
                  onChange={handleChange}
                  placeholder="e.g., Samuel Mukasa"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Money Phone Number *
                </label>
                <input
                  type="tel"
                  name="leaderPhone"
                  value={formData.leaderPhone}
                  onChange={handleChange}
                  placeholder="e.g., 0772 123 456"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white font-mono"
                  required
                />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="ecobankAccountNeeded"
                  checked={formData.ecobankAccountNeeded}
                  onChange={handleChange}
                  className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-700"
                />
                <span className="text-xs text-slate-700">
                  <strong>Open EcoBank Commercial Group Account:</strong> Connect our group to an institutional checking account with zero minimum balance and group overdraft potential.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="saccoIntent"
                  checked={formData.saccoIntent}
                  onChange={handleChange}
                  className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-700"
                />
                <span className="text-xs text-slate-700">
                  <strong>URSB Formal Legal Registration:</strong> Assist our group in drafting constitution bylaws and registering as a legal cooperative entity.
                </span>
              </label>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                <span>{loading ? 'Submitting...' : 'Complete Group Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Success Confirmation */}
        {step === 4 && result && (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h4 className="text-xl font-bold text-slate-900">
              Registration Confirmed!
            </h4>

            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Your group <strong className="text-slate-900">{formData.name}</strong> has been enrolled into the Enganda Entebbe incubation queue.
            </p>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left max-w-md mx-auto space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Group ID:</span>
                <span className="font-mono font-bold text-slate-900">{result.group?.id}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Registration Code:</span>
                <span className="font-mono font-bold text-emerald-800">{result.registrationCode}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">EcoBank Queue:</span>
                <span className="font-semibold text-slate-800">Priority Processing</span>
              </div>
            </div>

            {/* Simulated SMS receipt */}
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-left max-w-md mx-auto">
              <span className="block text-[10px] font-bold uppercase text-amber-800 mb-1">
                Relworx SMS Confirmation Delivered to {formData.leaderPhone}
              </span>
              <p className="text-xs text-amber-900 font-mono">
                {result.smsNotificationPreview}
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="w-full py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                Close & View Pilot Directory
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
