import React from 'react';
import { Sparkles, Users, Flame, Award, Video, Clock, CheckCircle2, HeartHandshake, Eye } from 'lucide-react';

export const ServicesSection: React.FC<{ onOpenBooking: () => void }> = ({ onOpenBooking }) => {
  const services = [
    {
      id: 1,
      title: '2 Professional Fragrance Staff',
      subtitle: 'Traditional Arabic Attire & Attar Ritual',
      description:
        'Dressed in authentic Arabic attire (Ghutra & Thobe/Bisht), our trained fragrance connoisseurs personally welcome your guests, applying artisanal royal attar directly to their pulse points with grace and bespoke hospitality.',
      image: '/assets/images/arabic_attar_application.jpg',
      badge: 'Bespoke Hospitality',
      icon: Users,
    },
    {
      id: 2,
      title: '2 Bukhoor Specialists',
      subtitle: 'Continuous Sacred Incense Presentation',
      description:
        'Dedicated specialists managing the burning embers and sacred braziers throughout your celebration, wafting aromatic clouds of natural incense across the venue entrance and reception halls.',
      image: '/assets/images/bukhoor_specialist_charcoal.jpg',
      badge: 'Live Aromatics',
      icon: Flame,
    },
    {
      id: 3,
      title: 'Premium In-House Bukhoor',
      subtitle: 'Handcrafted Natural Oud & Rare Resins',
      description:
        'Our exclusive house blend formulated with rare agarwood (Oud), aged ambergris, sandalwood, and botanical florals. Hand-blended for a non-choking, long-lasting aristocratic sillage that lingers pleasantly.',
      image: '/assets/images/attar_guest_service.jpg',
      badge: 'Exclusive Blend',
      icon: Sparkles,
    },
    {
      id: 4,
      title: 'Curated Royal Attar Collection',
      subtitle: 'Pure Concentrated Perfume Oils',
      description:
        'An opulent selection of long-lasting, alcohol-free pure perfume oils presented in crystal decanters. Formulated for all-day endurance, leaving an indelible luxury impression on your guests.',
      image: '/assets/images/royal_bride_groom.jpg',
      badge: 'Pure Concentrates',
      icon: Award,
    },
    {
      id: 5,
      title: '4 Large Acrylic Display Pedestals',
      subtitle: 'Signature Salman Black & Gold Stands',
      description:
        'Four custom architectural stands featuring high-gloss acrylic finishes, polished brass support pillars, and the golden Salman emblem. Strategically placed at the main gates and banquet entrances.',
      image: '/assets/images/four_stands_display.jpg',
      badge: 'Royal Décor',
      icon: Eye,
    },
    {
      id: 6,
      title: '1 Cinematic Event Highlight Video',
      subtitle: 'Professionally Captured 4K Memory Reel',
      description:
        'A dedicated videographer captures the mystical fragrance moments, guest smiles, smoke swirls, and royal entrance setup, delivering an edited high-definition social highlight reel.',
      image: '/assets/images/grand_venue_setup.jpg',
      badge: '4K Production',
      icon: Video,
    },
    {
      id: 7,
      title: 'Arabic-Themed Royal Presentation',
      subtitle: 'Complementing the Grandeur of Luxury Weddings',
      description:
        'Every visual touchpoint—from our golden trays and antique tongs to traditional dress and vehicle fleet arrival—is harmonized to elevate your wedding to palace-grade majesty.',
      image: '/assets/images/rolls_royce_arrival.jpg',
      badge: 'Grand Aesthetic',
      icon: HeartHandshake,
    },
  ];

  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 bg-royal-dark/60 relative arabesque-pattern border-t border-gold-500/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-950/70 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Inclusive Luxury Offerings</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-tight">
            Services <span className="gold-text-gradient">Included</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-300 font-serif italic">
            Every element of our Royal Premium Fragrance Package is meticulously orchestrated to guarantee an enchanting sensory experience for bride, groom, and wedding guests.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className={`luxury-card rounded-2xl overflow-hidden border border-gold-500/25 hover:border-gold-500/70 transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1 hover:shadow-2xl ${
                  index === 0 ? 'lg:col-span-2' : ''
                }`}
              >
                {/* Image Container with Luxury Overlay */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-card via-royal-card/30 to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute top-3 left-3 bg-royal-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-gold-500/40 text-[10px] sm:text-xs font-semibold text-gold-300 font-mono">
                    {service.badge}
                  </div>

                  {/* Icon */}
                  <div className="absolute bottom-3 right-3 w-10 h-10 rounded-xl bg-gold-gradient text-royal-black flex items-center justify-center shadow-lg">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-gold-400 font-medium uppercase tracking-wider block mb-1">
                      {service.subtitle}
                    </span>
                    <h3 className="text-xl font-display font-bold text-white mb-3">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gold-300/80">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Included in Base Package
                    </span>
                    <span className="text-gray-400 font-mono">0{service.id}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Duration & Overtime Notice Banner */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-royal-card via-gold-950/40 to-royal-card border border-gold-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h4 className="text-lg font-display font-bold text-white uppercase tracking-wider">
                Event Duration & Extra Time Policy
              </h4>
              <p className="text-xs sm:text-sm text-gray-300 font-sans mt-1">
                <strong className="text-gold-400">4 Hours</strong> included service time. Need more time? Additional service beyond 4 hours is charged at <strong className="text-white">₹10,000/- per hour</strong>, and additional 2 fragrance staff for attar application at <strong className="text-white">₹8,000/-</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenBooking}
            className="shrink-0 px-6 py-3 rounded-full bg-gold-gradient text-royal-black text-xs font-bold uppercase tracking-wider font-sans hover:brightness-110 active:scale-95 transition-all shadow-lg"
          >
            Customize Event Timeline
          </button>
        </div>
      </div>
    </section>
  );
};
