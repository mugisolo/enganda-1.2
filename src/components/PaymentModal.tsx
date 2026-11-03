import React, { useState } from 'react';
import { X, Smartphone, CheckCircle, ShieldCheck, Sprout, ArrowRight, RefreshCw, Download } from 'lucide-react';
import { saveTransactionToFirestore } from '../services/firebase';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const [provider, setProvider] = useState<'MTN' | 'AIRTEL'>('MTN');
  const [presetTier, setPresetTier] = useState<string>('trees_5');
  const [amount, setAmount] = useState<number>(50000);
  const [phoneNumber, setPhoneNumber] = useState<string>('0772 109 231');
  const [donorName, setDonorName] = useState<string>('');
  const [status, setStatus] = useState<'INPUT' | 'PROMPTING' | 'CONFIRMED'>('INPUT');
  const [loading, setLoading] = useState<boolean>(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  if (!isOpen) return null;

  const handleTierSelect = (tierKey: string, amt: number) => {
    setPresetTier(tierKey);
    setAmount(amt);
  };

  const handleSimulatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      return;
    }

    try {
      setLoading(true);
      setStatus('PROMPTING');

      // Call Relworx simulator API
      const res = await fetch('/api/momo/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          phoneNumber,
          amount,
          donorName: donorName || 'Enganda Contributor',
          purpose: presetTier.includes('trees')
            ? `Sponsor ${Math.max(1, Math.floor(amount / 10000))} Entebbe Trees`
            : 'Youth Cooperative Support',
        }),
      });

      if (!res.ok) {
        throw new Error('Payment simulation rejected');
      }

      const data = await res.json();
      if (data.transaction) {
        await saveTransactionToFirestore(data.transaction).catch((err) =>
          console.warn('Firestore transaction sync note:', err)
        );
      }
      setReceiptData(data);

      // Short delay to simulate the USSD push approval delay on user's phone
      setTimeout(() => {
        setStatus('CONFIRMED');
        setLoading(false);
        if (onPaymentSuccess) onPaymentSuccess();
      }, 2400);
    } catch (err: any) {
      console.error('Transaction error:', err);
      setStatus('INPUT');
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStatus('INPUT');
    setReceiptData(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            <Smartphone className="w-4 h-4 text-emerald-700" />
            <span>Relworx Mobile Money Gateway</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            Sponsor a Tree / Support a Youth Group
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Directly powers tree planting in Entebbe, vocational artisan toolkits, and micro-savings funds.
          </p>
        </div>

        {status === 'INPUT' && (
          <form onSubmit={handleSimulatePayment} className="space-y-5">
            
            {/* Contribution Purpose Tiers */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Select Contribution Package
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleTierSelect('trees_1', 10000)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    presetTier === 'trees_1'
                      ? 'border-emerald-700 bg-emerald-50/70 ring-1 ring-emerald-700'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-xs font-bold text-slate-900">1 Shoreline Tree</span>
                  <span className="block text-sm font-mono font-extrabold text-emerald-800">UGX 10,000</span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">Entebbe Lakeshore</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTierSelect('trees_5', 50000)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    presetTier === 'trees_5'
                      ? 'border-emerald-700 bg-emerald-50/70 ring-1 ring-emerald-700'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-xs font-bold text-slate-900">5 Trees + Maintenance</span>
                  <span className="block text-sm font-mono font-extrabold text-emerald-800">UGX 50,000</span>
                  <span className="block text-[10px] text-emerald-700 font-medium mt-0.5">Most Popular</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTierSelect('health_pool', 25000)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    presetTier === 'health_pool'
                      ? 'border-emerald-700 bg-emerald-50/70 ring-1 ring-emerald-700'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-xs font-bold text-slate-900">Youth Health Mutual</span>
                  <span className="block text-sm font-mono font-extrabold text-emerald-800">UGX 25,000</span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">Clinic Emergency Fund</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTierSelect('tools_pool', 100000)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    presetTier === 'tools_pool'
                      ? 'border-emerald-700 bg-emerald-50/70 ring-1 ring-emerald-700'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-xs font-bold text-slate-900">Artisan Tooling Share</span>
                  <span className="block text-sm font-mono font-extrabold text-emerald-800">UGX 100,000</span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">Heavy Fabrication Gear</span>
                </button>
              </div>
            </div>

            {/* Network Provider Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Mobile Money Network
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setProvider('MTN')}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    provider === 'MTN'
                      ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center font-black text-[10px] text-slate-900 shrink-0">
                    MTN
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-bold text-slate-900">MTN MoMo</span>
                    <span className="text-[10px] text-slate-500">077 / 078 / 076</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider('AIRTEL')}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    provider === 'AIRTEL'
                      ? 'border-rose-500 bg-rose-50/60 ring-1 ring-rose-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-rose-600 flex items-center justify-center font-black text-[10px] text-white shrink-0">
                    AIR
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-bold text-slate-900">Airtel Money</span>
                    <span className="text-[10px] text-slate-500">070 / 075 / 074</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Contributor Name & Phone Number */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Contributor Name (Optional)
                </label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g., Mugisha Davis"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Money Phone Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0772 123 456"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white font-mono text-slate-800"
                    required
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 font-mono">
                    UG (+256)
                  </span>
                </div>
              </div>
            </div>

            {/* Total and Submit */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 uppercase font-semibold">Total Debit</span>
                <div className="text-xl font-extrabold text-slate-900 font-mono">
                  UGX {amount.toLocaleString()}
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 rounded-lg transition-colors shadow-xs"
              >
                <span>Initiate USSD Push</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Secured by Relworx Fintech Gateway & EcoBank Settlement</span>
            </div>
          </form>
        )}

        {/* Prompting State: Simulated USSD Push on Phone */}
        {status === 'PROMPTING' && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto animate-pulse">
              <Smartphone className="w-8 h-8" />
            </div>

            <h4 className="text-xl font-bold text-slate-900">
              Prompt Sent to Your Phone!
            </h4>

            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
              A USSD payment prompt has been pushed to <strong className="font-mono text-slate-900">{phoneNumber}</strong> ({provider}).
            </p>

            <div className="bg-slate-900 text-amber-400 p-4 rounded-xl max-w-xs mx-auto font-mono text-xs text-left shadow-inner space-y-1">
              <div className="text-[10px] text-slate-400 font-sans uppercase">Phone Screen:</div>
              <div>Enganda / Relworx Pay</div>
              <div>Amount: UGX {amount.toLocaleString()}</div>
              <div>Ref: RWX-UG-2026</div>
              <div className="text-emerald-400 text-[11px] pt-1 font-bold">
                Enter Mobile Money PIN: ****
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Waiting for Telco clearing confirmation...</span>
            </div>
          </div>
        )}

        {/* Confirmed State: Official Receipt */}
        {status === 'CONFIRMED' && receiptData && (
          <div className="py-4 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h4 className="text-xl font-bold text-slate-900">
              Payment Successful!
            </h4>

            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Your contribution has been settled via Relworx into the Enganda Youth Economic Transformation Account at EcoBank.
            </p>

            {/* Official Digital Receipt Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left max-w-sm mx-auto space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-sans">Transaction Ref:</span>
                <span className="font-bold text-slate-900">{receiptData.transaction.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Amount Paid:</span>
                <span className="font-bold text-emerald-800">UGX {amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Payment Method:</span>
                <span>{receiptData.transaction.provider} Mobile Money</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Clearing Bank:</span>
                <span>{receiptData.relworxResponse.bankClearingPartner}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-500 font-sans">Trees Sponsored:</span>
                <span className="font-bold text-emerald-700">{receiptData.transaction.treesSponsored || 0} Trees</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5 max-w-sm mx-auto">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                Close & Return
              </button>
              <button
                onClick={resetForm}
                className="py-2.5 px-4 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Make Another Contribution
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
