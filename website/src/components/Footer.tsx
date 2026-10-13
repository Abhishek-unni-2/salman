import React, { useState } from 'react';
import { Sparkles, MessageCircle, Phone, MapPin, ChevronDown, Heart, Shield } from 'lucide-react';

export const Footer: React.FC<{ onOpenBooking: () => void }> = ({ onOpenBooking }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'What is included in the ₹60,000 Royal Premium Package?',
      a: 'The all-inclusive package includes: 4 hours of event service, 2 fragrance staff in traditional Arabic attire to apply attar, 2 Bukhoor specialists dedicated to burning and presenting in-house Bukhoor, handcrafted premium Oud Bukhoor, curated Attar collection, 4 large acrylic display pedestals, 1 professionally filmed highlight video, and all travel expenses.',
    },
    {
      q: 'How does the attar application ceremony work for wedding guests?',
      a: 'Our fragrance staff, dressed in traditional Arabic Ghutra and Thobe/Bisht, greet guests upon arrival or in the banquet hall, using crystal decanter wands to respectfully dab pure concentrated attar onto their wrists or garments.',
    },
    {
      q: 'Is the Bukhoor smoke gentle and safe for indoor banquet halls?',
      a: 'Yes, absolutely. Our In-House Bukhoor is specially handcrafted using selected natural fragrance ingredients and genuine Oud-based materials. It produces a soft, pleasant, non-choking aromatic scent that dissipates gracefully while leaving a lingering luxury ambience.',
    },
    {
      q: 'What are the charges for events exceeding 4 hours?',
      a: 'Any additional service time beyond the included 4 hours is billed at ₹10,000/- per additional hour. If you require 2 additional fragrance staff for applying attar to larger crowds, it is ₹8,000/-.',
    },
    {
      q: 'Are travel and transportation expenses included?',
      a: 'Yes, travel expenses are completely included within the ₹60,000 total package cost across our service region.',
    },
  ];

  return (
    <footer className="bg-royal-black text-gray-300 pt-20 pb-12 border-t border-gold-500/30 relative arabesque-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* FAQs Accordion */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
              Frequently Asked Questions
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1 uppercase">
              Everything You Need To Know
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="luxury-card rounded-xl border border-white/10 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:text-gold-400 transition-colors"
                >
                  <span className="text-sm sm:text-base font-display font-semibold text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gold-400 shrink-0 transition-transform ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-5 pt-1 sm:px-5 text-xs sm:text-sm text-gray-300 font-sans leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Closing Warm Message Quote Box */}
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-gold-950/40 via-royal-card to-gold-950/40 border border-gold-500/40 text-center mb-16 shadow-2xl">
          <Sparkles className="w-8 h-8 text-gold-400 mx-auto mb-4" />
          <h4 className="text-xl sm:text-2xl md:text-3xl font-serif italic text-gold-200 max-w-3xl mx-auto leading-relaxed">
            &ldquo;We look forward to being a part of your special celebration and making your wedding experience truly fragrant, elegant, and unforgettable.&rdquo;
          </h4>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenBooking}
              className="px-8 py-3.5 rounded-full bg-gold-gradient text-royal-black text-xs font-bold uppercase tracking-widest font-sans shadow-xl hover:brightness-110 active:scale-95 transition-all"
            >
              Reserve for Your Celebration
            </button>
            <a
              href="https://wa.me/919876543210?text=Hello%20Salman%20Perfumes%2C%20I%20would%20like%20to%20enquire%20about%20booking%20the%20wedding%20fragrance%20experience."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-full border border-emerald-500/40 bg-emerald-950/50 text-emerald-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-emerald-900/50 transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Direct WhatsApp Inquiry</span>
            </a>
          </div>
        </div>

        {/* Footer Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10 text-xs text-gray-400">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <img
                src="/assets/images/salman_logo_transparent.png"
                alt="Salman Perfumes Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="font-display tracking-[0.2em] text-base font-bold text-white">
                SALMAN PERFUMES
              </span>
            </div>
            <p className="font-serif italic text-gray-300 max-w-sm text-sm">
              Bringing centuries of royal Arabian fragrance tradition, sacred Oud Bukhoor, and bespoke attar application to distinguished wedding celebrations.
            </p>
          </div>

          <div>
            <h5 className="text-white font-display font-semibold uppercase tracking-wider mb-3">
              Included In Package
            </h5>
            <ul className="space-y-1.5 font-sans">
              <li>• 2 Arabic Attire Attar Staff</li>
              <li>• 2 Bukhoor Specialists</li>
              <li>• Handcrafted In-House Bukhoor</li>
              <li>• 4 Acrylic Display Pedestals</li>
              <li>• 1 Cinematic Highlight Video</li>
              <li>• ₹60,000 All-Inclusive (Travel Inc.)</li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-display font-semibold uppercase tracking-wider mb-3">
              Contact & Booking
            </h5>
            <ul className="space-y-2 font-sans">
              <li className="flex items-center gap-2 text-gray-300">
                <Phone className="w-3.5 h-3.5 text-gold-400" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp: +91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-3.5 h-3.5 text-gold-400" />
                <span>Available Across Kerala & South India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Salman Perfumes. All Rights Reserved. Royal Premium Wedding Experience.</p>
          <p className="flex items-center gap-1 font-sans">
            Crafted with royal passion & fine fragrance heritage <Heart className="w-3 h-3 text-red-500 fill-current" />
          </p>
        </div>
      </div>
    </footer>
  );
};
