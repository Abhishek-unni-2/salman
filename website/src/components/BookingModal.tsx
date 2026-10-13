import React, { useState } from 'react';
import { X, Sparkles, Calendar, MapPin, Users, Phone, User, MessageCircle, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialHours?: number;
  initialExtraStaff?: number;
  initialTotalCost?: number;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialHours = 4,
  initialExtraStaff = 0,
  initialTotalCost = 60000,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    weddingDate: '',
    venueCity: '',
    eventType: 'Wedding Reception & Nikah',
    guestCount: '300 - 600 Guests',
    notes: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Fire golden royal confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FFF2B2', '#059669', '#E67E22'],
      });
    } catch (_) {}

    // Prepare WhatsApp URL
    const message = encodeURIComponent(
      `*ROYAL WEDDING FRAGRANCE BOOKING ENQUIRY*\n` +
        `• Client Name: ${formData.name}\n` +
        `• Contact Phone: ${formData.phone}\n` +
        `• Event Date: ${formData.weddingDate}\n` +
        `• Event City / Venue: ${formData.venueCity}\n` +
        `• Event Type: ${formData.eventType}\n` +
        `• Estimated Guests: ${formData.guestCount}\n` +
        `• Selected Service Hours: ${initialHours} Hours\n` +
        `• Extra Attar Staff: ${initialExtraStaff}\n` +
        `• Estimated Total: ₹${initialTotalCost.toLocaleString('en-IN')}\n` +
        (formData.notes ? `• Special Notes: ${formData.notes}\n` : '') +
        `\nPlease check availability and revert back. Thank you!`
    );

    window.open(`https://wa.me/919876543210?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div
        className="relative w-full max-w-xl my-8 rounded-3xl bg-gradient-to-b from-[#161825] to-[#0A0B10] border border-gold-500/40 p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-gold-500 hover:text-royal-black text-gray-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <>
            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-950/80 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Salman Perfumes Exclusive Reservation</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-white uppercase">
                Book Royal Fragrance Experience
              </h3>
              <p className="text-xs text-gray-400 font-sans mt-1">
                Selected configuration: {initialHours} Hours • {2 + initialExtraStaff} Fragrance Staff • 2 Bukhoor Specialists • ₹{initialTotalCost.toLocaleString('en-IN')}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-300 block mb-1">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gold-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Salman Ahmed"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-300 block mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gold-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-300 block mb-1">
                    Event Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-gold-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      required
                      value={formData.weddingDate}
                      onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-300 block mb-1">
                    City / Venue Location *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gold-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Calicut / Kochi / Bangalore"
                      value={formData.venueCity}
                      onChange={(e) => setFormData({ ...formData, venueCity: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-300 block mb-1">
                    Event Type
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
                  >
                    <option value="Nikah & Wedding Reception">Nikah & Wedding Reception</option>
                    <option value="Pre-Wedding Sangeet / Mehendi">Pre-Wedding Sangeet / Mehendi</option>
                    <option value="Royal Family Banquet">Royal Family Banquet</option>
                    <option value="Grand Corporate Gala">Grand Corporate Gala</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-300 block mb-1">
                    Expected Guests
                  </label>
                  <select
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
                  >
                    <option value="Up to 300 Guests">Up to 300 Guests</option>
                    <option value="300 - 600 Guests">300 - 600 Guests</option>
                    <option value="600 - 1200 Guests">600 - 1,200 Guests</option>
                    <option value="1200+ Royal Scale">1,200+ Royal Scale</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-300 block mb-1">
                  Special Notes or Fragrance Requests (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Any custom Oud notes, venue layout details, or timing preferences..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gold-gradient text-royal-black font-display font-bold text-sm tracking-widest uppercase shadow-xl hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 mt-4"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm & Send Enquiry via WhatsApp</span>
              </button>
            </form>
          </>
        ) : (
          /* Confirmation State */
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white uppercase">
              Reservation Transmitted
            </h3>
            <p className="mt-3 text-sm text-gray-300 font-serif italic max-w-md mx-auto">
              Thank you for considering Salman Perfumes for your special occasion. We look forward to being a part of your celebration and making your wedding experience truly fragrant and unforgettable.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-gold-gradient text-royal-black text-xs font-bold uppercase tracking-wider"
              >
                Back to Showcase
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
