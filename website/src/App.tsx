import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroCinematic } from './components/HeroCinematic';
import { VideoReelsGallery } from './components/VideoReelsGallery';
import { ExperienceOverview } from './components/ExperienceOverview';
import { Showcase3D } from './components/Showcase3D';
import { Reveal } from './components/Reveal';
import { ServicesSection } from './components/ServicesSection';
import { GallerySection } from './components/GallerySection';
import { PricingCalculator } from './components/PricingCalculator';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { MobileBottomBar } from './components/MobileBottomBar';
import { MessageCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    hours: 4,
    extraStaff: 0,
    totalCost: 60000,
  });

  const handleOpenBooking = () => {
    setBookingDetails({
      hours: 4,
      extraStaff: 0,
      totalCost: 60000,
    });
    setIsBookingOpen(true);
  };

  const handleOpenBookingWithDetails = (details: {
    hours: number;
    extraStaff: number;
    totalCost: number;
  }) => {
    setBookingDetails(details);
    setIsBookingOpen(true);
  };

  const handleExplore3D = () => {
    const el = document.getElementById('3d-model');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen grain bg-[#050506] text-ivory flex flex-col selection:bg-gold-500 selection:text-royal-black pb-16 md:pb-0">
      {/* Sticky Top Navigation */}
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* Hero Section with Live Video Prominently Front & Center */}
      <HeroCinematic
        onOpenBooking={handleOpenBooking}
        onExplore3D={handleExplore3D}
      />

      {/* The 8 Real Wedding Video Reels Gallery */}
      <VideoReelsGallery onOpenBooking={handleOpenBooking} />

      {/* Experience Overview & Royal Heritage */}
      <ExperienceOverview />

      {/* Scroll-driven cinematic 3D showcase */}
      <Showcase3D />

      {/* Scent profile */}
      <section className="border-t border-ivory/10 px-6 py-28 sm:px-10">
        <div className="mx-auto grid max-w-[1500px] gap-px bg-ivory/10 md:grid-cols-3">
          {[
            ['Top', 'Taif rose & saffron', 'Bright florals and Iranian saffron greet guests on arrival.', 'First 30 minutes'],
            ['Heart', 'Handcrafted bukhoor', 'Cambodian agarwood, ambergris and sweet resins in slow, smooth clouds.', 'The entire celebration'],
            ['Base', 'Aged oud & white musk', 'Pure oils on pulse points that linger on fabric for a full day.', '24+ hours'],
          ].map(([k, t, d, m]) => (
            <Reveal key={k} className="bg-[#050506]">
              <div className="flex h-full flex-col justify-between p-10">
                <div>
                  <span className="eyebrow">{k} notes</span>
                  <h4 className="mt-6 font-serif text-3xl font-light text-ivory">{t}</h4>
                  <p className="mt-4 text-sm font-light leading-[1.8] text-ivory/60">{d}</p>
                </div>
                <div className="mt-10 border-t border-ivory/10 pt-4 text-[11px] uppercase tracking-[0.22em] text-gold-300/80">{m}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Services Included Section (₹60,000 Package) */}
      <ServicesSection onOpenBooking={handleOpenBooking} />

      {/* Curated Photo Gallery */}
      <GallerySection />

      {/* Pricing Calculator & WhatsApp Customizer */}
      <PricingCalculator onOpenBookingWithDetails={handleOpenBookingWithDetails} />

      {/* Footer & FAQ */}
      <Footer onOpenBooking={handleOpenBooking} />

      {/* Interactive Reservation Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialHours={bookingDetails.hours}
        initialExtraStaff={bookingDetails.extraStaff}
        initialTotalCost={bookingDetails.totalCost}
      />

      {/* Native Mobile Bottom Navigation */}
      <MobileBottomBar onOpenBooking={handleOpenBooking} />

      {/* Floating WhatsApp Quick Action Button for Desktop */}
      <a
        href="https://wa.me/919876543210?text=Hello%20Salman%20Perfumes%2C%20I%20would%20like%20to%20inquire%20about%20booking%20the%20Royal%20Wedding%20Fragrance%20Experience."
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex fixed bottom-6 right-6 z-40 h-12 px-4 bg-black/60 backdrop-blur border border-gold-300/40 text-gold-300 hover:bg-gold-300 hover:text-black transition-all items-center gap-2 group"
        title="Chat with Salman Perfumes"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold font-sans uppercase tracking-wider pr-1">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
};

export default App;
