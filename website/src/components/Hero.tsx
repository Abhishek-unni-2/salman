import React from 'react';
import { Sparkles, Play, ShieldCheck, Clock, Users, Flame, Award, ChevronDown } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onExplore3D: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onExplore3D }) => {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden arabesque-pattern">
      {/* Background Lighting Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-emerald-600/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto w-full flex flex-col items-center text-center z-10">
        {/* Royal Crest / Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-950/60 border border-gold-500/40 text-gold-300 text-xs md:text-sm font-medium tracking-widest uppercase mb-6 shadow-inner animate-pulse-slow">
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span>The Sovereign Royal Fragrance Protocol</span>
          <Sparkles className="w-4 h-4 text-gold-400" />
        </div>

        {/* Main Royal Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight uppercase leading-[1.15] mb-6">
          <span className="block text-gray-100">Royal Premium Wedding</span>
          <span className="block gold-text-gradient mt-1">Fragrance Experience</span>
        </h1>

        {/* Subtitle / Description from the User */}
        <p className="max-w-3xl text-sm sm:text-base md:text-lg text-gray-300 font-serif leading-relaxed mb-8 italic">
          &ldquo;Specially curated to bring an elegant and luxurious Arabic fragrance ambience to your wedding celebration.
          A timeless sensory symphony of handcrafted In-House Bukhoor, pure royal attar decanting, and authentic Arabian hospitality.&rdquo;
        </p>

        {/* Package Cost & Feature Highlights Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-4xl mb-10">
          <div className="luxury-card p-3 rounded-xl border border-gold-500/30 text-center flex flex-col items-center justify-center">
            <span className="text-[10px] sm:text-xs text-gold-400 font-mono uppercase tracking-wider">Total Package</span>
            <span className="text-lg sm:text-2xl font-bold font-display text-white mt-0.5">₹60,000</span>
            <span className="text-[9px] text-gray-400">Travel Included</span>
          </div>

          <div className="luxury-card p-3 rounded-xl border border-gold-500/30 text-center flex flex-col items-center justify-center">
            <Clock className="w-4 h-4 text-gold-400 mb-1" />
            <span className="text-sm sm:text-base font-bold text-gray-100">4 Hours</span>
            <span className="text-[10px] text-gray-400">Full Event Coverage</span>
          </div>

          <div className="luxury-card p-3 rounded-xl border border-gold-500/30 text-center flex flex-col items-center justify-center">
            <Users className="w-4 h-4 text-gold-400 mb-1" />
            <span className="text-sm sm:text-base font-bold text-gray-100">4 Specialists</span>
            <span className="text-[10px] text-gray-400">Arabic Attire Staff</span>
          </div>

          <div className="luxury-card p-3 rounded-xl border border-gold-500/30 text-center flex flex-col items-center justify-center">
            <Flame className="w-4 h-4 text-gold-400 mb-1" />
            <span className="text-sm sm:text-base font-bold text-gray-100">4 Pedestals</span>
            <span className="text-[10px] text-gray-400">Acrylic Display Stands</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gold-gradient text-royal-black font-display font-bold text-sm tracking-widest uppercase shadow-2xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Book Experience • ₹60,000</span>
          </button>

          <button
            onClick={onExplore3D}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-royal-card border border-gold-500/50 hover:border-gold-400 text-gold-300 hover:text-white font-sans text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 group"
          >
            <Flame className="w-4 h-4 text-gold-400 group-hover:scale-110 transition-transform" />
            <span>Interact with 3D Model</span>
          </button>

          <a
            href="#reels"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-black/40 border border-white/10 hover:border-white/30 text-gray-300 hover:text-white font-sans text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
            <span>Watch Live Footage</span>
          </a>
        </div>

        {/* Real Live Wedding Snapshot Preview Banner */}
        <div className="mt-14 w-full max-w-5xl rounded-2xl p-1 bg-gradient-to-r from-gold-500/20 via-gold-400/40 to-gold-500/20 shadow-2xl">
          <div className="relative rounded-xl overflow-hidden bg-royal-dark aspect-[16/9] sm:aspect-[21/9]">
            <img
              src="/assets/images/entrance_bukhoor_burner.jpg"
              alt="Salman Perfumes Wedding Ambience Setup"
              className="w-full h-full object-cover object-center brightness-75 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-royal-black via-royal-black/40 to-transparent flex flex-col justify-end p-4 sm:p-8 text-left">
              <span className="text-[10px] sm:text-xs text-gold-400 font-mono tracking-widest uppercase">
                Captured Live at Luxury Wedding
              </span>
              <p className="text-sm sm:text-xl font-display font-bold text-white">
                Salman Perfumes Signature Mabkhara Setup with Aromatic Smoke
              </p>
              <p className="text-xs sm:text-sm text-gray-300 font-serif italic hidden sm:block">
                Welcoming honored guests with sacred Oud Bukhoor and personalized royal attar application.
              </p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <a
          href="#experience"
          className="mt-10 inline-flex flex-col items-center gap-1 text-[11px] text-gray-400 hover:text-gold-400 transition-colors uppercase tracking-widest"
        >
          <span>Discover The Royal Journey</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-gold-400" />
        </a>
      </div>
    </section>
  );
};
