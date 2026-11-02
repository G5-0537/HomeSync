import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Sparkles, RotateCcw, UserCheck, ShieldCheck } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { user, switchDemoUser, resetDemoData } = useAuth();
  const { success } = useToast();

  const handleSwitch = (key: 'aanya' | 'vikram' | 'riya' | 'mehak' | 'arjun') => {
    switchDemoUser(key);
    success(`Switched active persona to ${key === 'vikram' ? 'Landlord Vikram Singh' : key.charAt(0).toUpperCase() + key.slice(1)}`);
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo data (expenses, chores, agreements) to initial state?')) {
      resetDemoData();
      success('Demo data restored to pristine Chandigarh 3BHK state!');
    }
  };

  return (
    <div className="bg-charcoal-900 text-ivory-100 text-xs py-2 px-4 border-b border-charcoal-800 flex flex-wrap items-center justify-between gap-3 select-none">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 bg-sage-500/20 text-sage-300 border border-sage-500/40 px-2 py-0.5 rounded-full font-semibold">
          <Sparkles className="w-3 h-3 text-sage-400" />
          DEMO MODE
        </span>
        <span className="hidden sm:inline text-charcoal-400">|</span>
        <span className="hidden md:inline text-charcoal-300">
          The Ivory Heights 3BHK, Sector 35, Chandigarh
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-charcoal-400 text-[11px] hidden lg:inline">Switch Persona:</span>
        <div className="flex items-center gap-1 bg-charcoal-800 p-0.5 rounded-lg border border-charcoal-700">
          <button
            onClick={() => handleSwitch('aanya')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
              user?.uid === 'user-aanya' 
                ? 'bg-sage-600 text-white shadow-xs font-semibold' 
                : 'text-charcoal-300 hover:text-white'
            }`}
          >
            Aanya (Lead)
          </button>
          <button
            onClick={() => handleSwitch('vikram')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
              user?.uid === 'landlord-vikram' 
                ? 'bg-lavender-600 text-white shadow-xs font-semibold' 
                : 'text-charcoal-300 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            Landlord Vikram
          </button>
          <button
            onClick={() => handleSwitch('riya')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-all hidden sm:inline ${
              user?.uid === 'user-riya' 
                ? 'bg-sage-600 text-white font-semibold' 
                : 'text-charcoal-300 hover:text-white'
            }`}
          >
            Riya
          </button>
          <button
            onClick={() => handleSwitch('mehak')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-all hidden sm:inline ${
              user?.uid === 'user-mehak' 
                ? 'bg-sage-600 text-white font-semibold' 
                : 'text-charcoal-300 hover:text-white'
            }`}
          >
            Mehak
          </button>
          <button
            onClick={() => handleSwitch('arjun')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-all hidden sm:inline ${
              user?.uid === 'user-arjun' 
                ? 'bg-sage-600 text-white font-semibold' 
                : 'text-charcoal-300 hover:text-white'
            }`}
          >
            Arjun
          </button>
        </div>

        <button
          onClick={handleReset}
          title="Reset demo state"
          className="flex items-center gap-1 text-[11px] text-charcoal-400 hover:text-charcoal-200 px-2 py-1 rounded hover:bg-charcoal-800 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden md:inline">Reset</span>
        </button>
      </div>
    </div>
  );
};
