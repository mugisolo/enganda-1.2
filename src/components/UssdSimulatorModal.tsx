import React, { useState } from 'react';
import { X, PhoneCall, RotateCcw } from 'lucide-react';

interface UssdSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UssdSimulatorModal: React.FC<UssdSimulatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [screenText, setScreenText] = useState<string>(
    'ENGANDA YOUTH *217#\n\n1. Wandiisa Ekibiina (Register Group)\n2. Sasula Akakiiko (Pay Group Dues)\n3. Simbisa Omuti (Sponsor Shoreline Tree)\n4. EcoBank & URSB Status\n5. Entebbe Office Contact\n\nFuna namba yo oddemu:'
  );
  const [userInput, setUserInput] = useState<string>('');
  const [step, setStep] = useState<string>('root');

  if (!isOpen) return null;

  const handleDial = (e: React.FormEvent) => {
    e.preventDefault();
    const val = userInput.trim();
    setUserInput('');

    if (step === 'root') {
      if (val === '1') {
        setStep('register_name');
        setScreenText(
          'WANDIISA EKIBIINA\n\nYingiza erinnya ly’ekibiina kyammwe (e.g. Kigungu Welders):\n\n0. Ddayo mabega'
        );
      } else if (val === '2') {
        setStep('dues_amount');
        setScreenText(
          'SASULA AKAKIIKO (Relworx)\n\n1. UGX 2,000 (Bulijjo)\n2. UGX 5,000 (Sande)\n3. UGX 20,000 (Mwezi)\n\nLonda engeri:'
        );
      } else if (val === '3') {
        setStep('tree_amount');
        setScreenText(
          'SIMBISA OMUTI MU NTEBBE\n\n1. Omuti 1 (UGX 10,000)\n2. Emiti 5 (UGX 50,000)\n3. Emiti 10 (UGX 100,000)\n\nLonda omuwendo:'
        );
      } else if (val === '4') {
        setStep('ecobank_status');
        setScreenText(
          'ECOBANK & URSB STATUS\n\nEbibiina 21 bimaze okuggyibwako obukwakkulizo bwa bbanka mu Ntebbe.\n\nSsinga oyagala kwegattako, kyalira wofiisi yaffe ku Entebbe Municipal Council.\n\n0. Ddayo'
        );
      } else if (val === '5') {
        setStep('contact');
        setScreenText(
          'ENGANDA EXECUTIVE OFFICE\n\nEntebbe Municipality, Division A.\nTel: +256 772 109 231\nEmail: info@enganda.ug\n\n0. Ddayo'
        );
      } else {
        setScreenText('Ennamba eyo tetondekeddwa. Ddamu olonde 1 okutuusa ku 5.\n\n0. Ddayo');
      }
    } else if (step === 'register_name') {
      if (val === '0') {
        resetUssd();
      } else {
        setStep('register_done');
        setScreenText(
          `WEBALE NNYO!\n\nEkibiina "${val}" Kiwandiikiddwa mu sisitemu ya Enganda.\n\nOlukalala lwa EcoBank lunasindikibwa ku ssimu yo luno ku SMS.\n\nEnganda - Organizing the Informal.`
        );
      }
    } else if (step === 'dues_amount' || step === 'tree_amount') {
      setStep('done');
      setScreenText(
        'RELWORX USSD PUSH SENT!\n\nCheck your phone for Mobile Money PIN prompt.\n\nEcoBank clearing reference: RWX-UG-2026-OK\n\nMwebale okutegeka ebyenfuna byaffe!'
      );
    } else {
      resetUssd();
    }
  };

  const resetUssd = () => {
    setStep('root');
    setUserInput('');
    setScreenText(
      'ENGANDA YOUTH *217#\n\n1. Wandiisa Ekibiina (Register Group)\n2. Sasula Akakiiko (Pay Group Dues)\n3. Simbisa Omuti (Sponsor Shoreline Tree)\n4. EcoBank & URSB Status\n5. Entebbe Office Contact\n\nFuna namba yo oddemu:'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <PhoneCall className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            USSD *217# Offline Engine
          </h3>
        </div>

        {/* Feature Phone Display Mockup */}
        <div className="bg-slate-900 rounded-xl p-4 border-4 border-slate-800 shadow-inner mb-4">
          <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1 mb-2 font-mono">
            <span>MTN-UG / Airtel</span>
            <span>*217# Active</span>
          </div>

          <pre className="text-emerald-400 font-mono text-xs whitespace-pre-wrap leading-relaxed min-h-[160px]">
            {screenText}
          </pre>
        </div>

        {/* Dialpad Input */}
        <form onSubmit={handleDial} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter number or text..."
              autoFocus
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono text-slate-800"
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors"
            >
              Send
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={resetUssd}
              className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset *217#</span>
            </button>

            <span className="text-[10px] text-slate-400">Works on all non-smartphones</span>
          </div>
        </form>

      </div>
    </div>
  );
};
