import React from 'react';
import { Film, Flame, Sparkles, Calculator, MessageCircle } from 'lucide-react';

interface MobileBottomBarProps {
  onOpenBooking: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ onOpenBooking }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-royal-black/95 backdrop-blur-xl border-t border-gold-500/30 px-3 py-2 flex items-center justify-between shadow-2xl">
      <a
        href="#reels"
        className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-gold-400 py-1 px-2"
      >
        <Film className="w-4 h-4 text-gold-400" />
        <span className="text-[10px] font-sans font-medium uppercase tracking-wider">Reels</span>
      </a>

      <a
        href="#3d-model"
        className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-gold-400 py-1 px-2"
      >
        <Flame className="w-4 h-4 text-gold-400" />
        <span className="text-[10px] font-sans font-medium uppercase tracking-wider">3D View</span>
      </a>

      <a
        href="#services"
        className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-gold-400 py-1 px-2"
      >
        <Sparkles className="w-4 h-4 text-gold-400" />
        <span className="text-[10px] font-sans font-medium uppercase tracking-wider">Services</span>
      </a>

      <a
        href="#pricing"
        className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-gold-400 py-1 px-2"
      >
        <Calculator className="w-4 h-4 text-gold-400" />
        <span className="text-[10px] font-sans font-medium uppercase tracking-wider">Rates</span>
      </a>

      <button
        onClick={onOpenBooking}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-gradient text-royal-black font-display font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-transform"
      >
        <span>Book ₹60K</span>
      </button>
    </div>
  );
};
