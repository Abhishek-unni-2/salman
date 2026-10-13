import React, { useState } from 'react';
import { Calculator, Check, Plus, Minus, MessageCircle, Sparkles, Shield, Clock, Users, ArrowRight } from 'lucide-react';

interface PricingCalculatorProps {
  onOpenBookingWithDetails: (details: { hours: number; extraStaff: number; totalCost: number }) => void;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({ onOpenBookingWithDetails }) => {
  const [hours, setHours] = useState<number>(4); // Base 4 hours
  const [extraStaffPairs, setExtraStaffPairs] = useState<number>(0); // 0 pairs = 2 staff, +1 pair = +2 staff (+₹8,000)

  const BASE_PRICE = 60000;
  const BASE_HOURS = 4;
  const HOURLY_RATE = 10000;
  const EXTRA_STAFF_PAIR_RATE = 8000;

  const extraHours = Math.max(0, hours - BASE_HOURS);
  const overtimeCost = extraHours * HOURLY_RATE;
  const extraStaffCost = extraStaffPairs * EXTRA_STAFF_PAIR_RATE;
  const totalCost = BASE_PRICE + overtimeCost + extraStaffCost;

  const totalAttarStaff = 2 + extraStaffPairs * 2;
  const totalBukhoorStaff = 2;
  const totalStaffCount = totalAttarStaff + totalBukhoorStaff;

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Salman Perfumes!\n\nI would like to book the *Royal Premium Wedding Fragrance Experience*:\n` +
      `• Total Duration: ${hours} Hours (${extraHours > 0 ? `${extraHours} extra hrs` : 'Base package'})\n` +
      `• Attar Application Staff: ${totalAttarStaff} (in Arabic attire)\n` +
      `• Bukhoor Specialists: 2 (dedicated)\n` +
      `• 4 Acrylic Display Stands: Included\n` +
      `• Handcrafted In-House Bukhoor & Attar Collection: Included\n` +
      `• 1 Cinematic Highlight Video: Included\n` +
      `• Travel Expenses: Included\n` +
      `• Estimated Investment: ${formatINR(totalCost)}\n\n` +
      `Please let me know if my wedding date is available!`
  );

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-royal-dark/95 relative arabesque-pattern border-t border-gold-500/20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-950/70 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Investment Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-tight">
            Transparent <span className="gold-text-gradient">Package & Rates</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-300 font-serif italic">
            Tailor the fragrance experience duration and attendant capacity according to your wedding celebration scale.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 luxury-card rounded-3xl p-6 sm:p-8 border border-gold-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
                <div>
                  <h3 className="text-xl font-display font-bold text-white">
                    Royal Base Package
                  </h3>
                  <p className="text-xs text-gold-400 font-sans mt-0.5">
                    Standard 4-Hour Complete Wedding Ambience
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-display font-extrabold text-gold-400">
                    ₹60,000
                  </span>
                  <span className="block text-[10px] text-gray-400 font-mono">
                    Travel Included
                  </span>
                </div>
              </div>

              {/* Slider 1: Duration in Hours */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gold-400" />
                    <span>Service Duration</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold font-mono text-white">
                      {hours} Hours
                    </span>
                    {extraHours > 0 && (
                      <span className="text-xs bg-gold-500/20 text-gold-300 px-2 py-0.5 rounded border border-gold-500/30">
                        +{extraHours} hr extra (+{formatINR(overtimeCost)})
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setHours(Math.max(4, hours - 1))}
                    disabled={hours <= 4}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gold-500/20 hover:border-gold-500 transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <input
                    type="range"
                    min="4"
                    max="10"
                    step="1"
                    value={hours}
                    onChange={(e) => setHours(parseInt(e.target.value))}
                    className="flex-1 accent-gold-500 h-2 bg-gray-800 rounded-lg cursor-pointer"
                  />

                  <button
                    onClick={() => setHours(Math.min(10, hours + 1))}
                    disabled={hours >= 10}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gold-500/20 hover:border-gold-500 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex justify-between text-[11px] text-gray-400 mt-2 font-mono">
                  <span>4 hrs (Included)</span>
                  <span>Additional: ₹10,000 / hour</span>
                  <span>10 hrs (Max)</span>
                </div>
              </div>

              {/* Control 2: Additional Attar Application Staff */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                      <Users className="w-4 h-4 text-gold-400" />
                      <span>Fragrance Staff in Arabic Attire</span>
                    </label>
                    <span className="text-xs text-gray-400 block mt-0.5">
                      For large wedding receptions with 500+ guests
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold font-mono text-white">
                      {totalAttarStaff} Staff
                    </span>
                    {extraStaffPairs > 0 && (
                      <span className="block text-[10px] text-gold-400 font-mono">
                        +{extraStaffPairs * 2} extra (+{formatINR(extraStaffCost)})
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((pairs) => (
                    <button
                      key={pairs}
                      onClick={() => setExtraStaffPairs(pairs)}
                      className={`py-3 px-3 rounded-xl border text-center transition-all ${
                        extraStaffPairs === pairs
                          ? 'bg-gold-500 text-royal-black font-bold border-gold-400 shadow-md'
                          : 'bg-royal-card/60 border-white/10 text-gray-300 hover:border-gold-500/30'
                      }`}
                    >
                      <span className="block text-xs uppercase font-sans">
                        {pairs === 0 ? '2 Staff (Included)' : `+${pairs * 2} Staff (+₹${pairs * 8},000)`}
                      </span>
                      <span className="block text-[10px] opacity-75 font-mono mt-0.5">
                        Total {2 + pairs * 2} Staff
                      </span>
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-gray-400 block mt-2">
                  ₹8,000/- per 2 additional staff for personalized attar applying.
                </span>
              </div>
            </div>

            {/* Inclusions Checklist */}
            <div className="pt-6 border-t border-white/10">
              <h4 className="text-xs uppercase tracking-widest text-gold-400 font-semibold mb-3">
                All Included in Total:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>2 Bukhoor burning specialists</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Handcrafted In-House Bukhoor</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>4 Acrylic branded display stands</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Premium concentrated Attars</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>1 Cinematic 4K Highlight Video</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>All travel & transport expenses</span>
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary Card (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#181B28] to-[#0E0F16] border-2 border-gold-500/50 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            {/* Decorative background glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/15 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold font-mono">
                  Investment Summary
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-medium border border-emerald-500/30">
                  Fixed Pricing
                </span>
              </div>

              <h3 className="text-2xl font-display font-bold text-white mb-6">
                Your Custom Experience
              </h3>

              {/* Line items */}
              <div className="space-y-3.5 text-sm pb-6 border-b border-white/10 font-sans">
                <div className="flex justify-between text-gray-300">
                  <span>Base Package (4 hrs, 4 staff, 4 stands)</span>
                  <span className="font-mono text-white">{formatINR(BASE_PRICE)}</span>
                </div>

                {extraHours > 0 && (
                  <div className="flex justify-between text-gold-300">
                    <span>Extra Service: +{extraHours} hr ({extraHours} × ₹10,000)</span>
                    <span className="font-mono">+{formatINR(overtimeCost)}</span>
                  </div>
                )}

                {extraStaffPairs > 0 && (
                  <div className="flex justify-between text-gold-300">
                    <span>Extra Attar Staff: +{extraStaffPairs * 2} staff</span>
                    <span className="font-mono">+{formatINR(extraStaffCost)}</span>
                  </div>
                )}

                <div className="flex justify-between text-emerald-400 text-xs">
                  <span>Travel & Logistics</span>
                  <span className="uppercase font-semibold">Included (₹0)</span>
                </div>
                <div className="flex justify-between text-emerald-400 text-xs">
                  <span>Cinematic Highlight Reel</span>
                  <span className="uppercase font-semibold">Included (₹0)</span>
                </div>
              </div>

              {/* Total Display */}
              <div className="pt-6">
                <span className="text-xs uppercase tracking-wider text-gray-400 block font-mono">
                  Total Package Cost
                </span>
                <div className="text-4xl sm:text-5xl font-display font-extrabold gold-text-gradient mt-1">
                  {formatINR(totalCost)}
                </div>
                <span className="text-[11px] text-gray-400 block mt-1">
                  Total team: {totalStaffCount} Professionals ({totalAttarStaff} Attar Specialists + {totalBukhoorStaff} Bukhoor Curators)
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 space-y-3">
              <button
                onClick={() =>
                  onOpenBookingWithDetails({
                    hours,
                    extraStaff: extraStaffPairs * 2,
                    totalCost,
                  })
                }
                className="w-full py-4 rounded-xl bg-gold-gradient text-royal-black font-display font-bold text-sm tracking-wider uppercase shadow-xl hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Reserve Custom Package</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/919876543210?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 hover:bg-emerald-900/60 text-emerald-300 font-sans text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Instant Confirmation on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
