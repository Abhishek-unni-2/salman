import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, X, ChevronLeft, ChevronRight, Sparkles, MessageCircle, Heart, Share2, Film } from 'lucide-react';

interface ReelItem {
  id: number;
  title: string;
  tag: string;
  description: string;
  videoSrc: string;
  poster: string;
  duration: string;
}

export const VideoReelsGallery: React.FC<{ onOpenBooking: () => void }> = ({ onOpenBooking }) => {
  const reels: ReelItem[] = [
    {
      id: 1,
      title: 'Full Wedding Fragrance Highlight',
      tag: 'Master Reel',
      description: 'The complete royal experience: attar application, live charcoal burning & joyful guests.',
      videoSrc: '/assets/videos/video_full_highlight.mp4',
      poster: '/assets/images/attar_guest_service.jpg',
      duration: '1:00',
    },
    {
      id: 2,
      title: 'Personalized Attar Application',
      tag: 'Arabic Attire Service',
      description: 'Our fragrance specialist in Ghutra & Thobe personally applying pure concentrated attar.',
      videoSrc: '/assets/videos/video_arabic_attar_ritual.mp4',
      poster: '/assets/images/arabic_attar_application.jpg',
      duration: '0:16',
    },
    {
      id: 3,
      title: 'Grand Entrance Mabkhara Ambience',
      tag: 'Aromatic Cloud',
      description: 'Sacred Bukhoor smoke wafting beside the floral wedding entrance archway.',
      videoSrc: '/assets/videos/video_entrance_mabkhara.mp4',
      poster: '/assets/images/entrance_bukhoor_burner.jpg',
      duration: '0:28',
    },
    {
      id: 4,
      title: 'The 4 Signature Display Pedestals',
      tag: 'Stage & Gates',
      description: 'Four custom acrylic and brass stands aligned under grand wedding arch illumination.',
      videoSrc: '/assets/videos/video_four_stands_arches.mp4',
      poster: '/assets/images/four_stands_display.jpg',
      duration: '0:16',
    },
    {
      id: 5,
      title: 'Rolls Royce & VIP Convoy Arrival',
      tag: 'Luxury Fleet',
      description: 'Rolls Royce and Salman Perfumes dedicated event vehicle arriving in style.',
      videoSrc: '/assets/videos/video_rolls_royce_fleet.mp4',
      poster: '/assets/images/rolls_royce_arrival.jpg',
      duration: '0:39',
    },
    {
      id: 6,
      title: 'Royal Couple Romantic Ceremony',
      tag: 'Nikah Stage',
      description: 'Bride and groom encircled by the delicate fragrance of royal Oud.',
      videoSrc: '/assets/videos/video_royal_wedding_couple.mp4',
      poster: '/assets/images/royal_bride_groom.jpg',
      duration: '0:13',
    },
    {
      id: 7,
      title: 'Guest Smiles & Fragrance Joy',
      tag: 'Celebration',
      description: 'Honored guests and children delighted by the authentic Arabic incense mist.',
      videoSrc: '/assets/videos/video_guests_celebration.mp4',
      poster: '/assets/images/guests_fragrance_joy.jpg',
      duration: '0:27',
    },
    {
      id: 8,
      title: 'Grand Palace Portico Setup',
      tag: 'Venue Grandeur',
      description: 'Majestic wedding palace entrance receiving our fragrance specialists.',
      videoSrc: '/assets/videos/video_grand_venue_arrival.mp4',
      poster: '/assets/images/grand_venue_setup.jpg',
      duration: '0:29',
    },
  ];

  const [activeModalReel, setActiveModalReel] = useState<ReelItem | null>(null);
  const [isModalMuted, setIsModalMuted] = useState<boolean>(false);
  const [isModalPlaying, setIsModalPlaying] = useState<boolean>(true);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const openReel = (reel: ReelItem) => {
    setActiveModalReel(reel);
    setIsModalPlaying(true);
    setIsModalMuted(false);
  };

  const closeReel = () => {
    setActiveModalReel(null);
  };

  const nextReel = () => {
    if (!activeModalReel) return;
    const currentIdx = reels.findIndex((r) => r.id === activeModalReel.id);
    const nextIdx = (currentIdx + 1) % reels.length;
    setActiveModalReel(reels[nextIdx]);
    setIsModalPlaying(true);
  };

  const prevReel = () => {
    if (!activeModalReel) return;
    const currentIdx = reels.findIndex((r) => r.id === activeModalReel.id);
    const prevIdx = (currentIdx - 1 + reels.length) % reels.length;
    setActiveModalReel(reels[prevIdx]);
    setIsModalPlaying(true);
  };

  const toggleModalPlay = () => {
    if (!modalVideoRef.current) return;
    if (modalVideoRef.current.paused) {
      modalVideoRef.current.play();
      setIsModalPlaying(true);
    } else {
      modalVideoRef.current.pause();
      setIsModalPlaying(false);
    }
  };

  const toggleModalMute = () => {
    if (!modalVideoRef.current) return;
    modalVideoRef.current.muted = !modalVideoRef.current.muted;
    setIsModalMuted(modalVideoRef.current.muted);
  };

  return (
    <section id="reels" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#07080D] relative border-t border-gold-500/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-950/70 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-3">
              <Film className="w-3.5 h-3.5" />
              <span>Real Live Wedding Footage</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-tight">
              The Wedding <span className="gold-text-gradient">Reels Gallery</span>
            </h2>
            <p className="mt-2 text-sm text-gray-300 font-serif italic max-w-xl">
              Tap any reel to watch high-definition video of our staff, the smoking Bukhoor pedestals, and guests enjoying the royal fragrance ambience.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gold-400 font-mono hidden sm:inline">
              8 Real Event Videos Available
            </span>
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-full bg-gold-gradient text-royal-black text-xs font-bold uppercase tracking-wider shadow-lg hover:brightness-110 transition-all"
            >
              Book Royal Experience
            </button>
          </div>
        </div>

        {/* Reels Grid (Mobile Horizontal Swiper & Desktop Multi-column Grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {reels.map((reel) => (
            <div
              key={reel.id}
              onClick={() => openReel(reel)}
              className="group relative rounded-2xl overflow-hidden aspect-[9/16] bg-black border border-gold-500/25 hover:border-gold-500 shadow-xl cursor-pointer hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Background Poster Image */}
              <img
                src={reel.poster}
                alt={reel.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-85"
                loading="lazy"
              />

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/60 pointer-events-none" />

              {/* Top Tag & Duration */}
              <div className="relative p-3 sm:p-4 flex items-center justify-between z-10">
                <span className="text-[10px] uppercase font-mono tracking-wider text-gold-300 bg-black/70 px-2 py-0.5 rounded-full border border-gold-500/30">
                  {reel.tag}
                </span>
                <span className="text-[10px] font-mono text-gray-300 bg-black/70 px-1.5 py-0.5 rounded">
                  {reel.duration}
                </span>
              </div>

              {/* Center Play Button Icon on Hover */}
              <div className="relative self-center z-10 w-12 h-12 rounded-full bg-gold-500/90 text-royal-black flex items-center justify-center shadow-2xl opacity-90 group-hover:scale-110 group-hover:opacity-100 transition-all">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>

              {/* Bottom Information */}
              <div className="relative p-3 sm:p-4 z-10">
                <h4 className="text-sm font-display font-bold text-white group-hover:text-gold-300 transition-colors line-clamp-1">
                  {reel.title}
                </h4>
                <p className="text-[11px] text-gray-300 line-clamp-2 mt-1 font-sans">
                  {reel.description}
                </p>
                <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-gold-400 font-semibold uppercase tracking-wider">
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Tap to watch reel</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Reel Viewer Modal */}
      {activeModalReel && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-6 animate-in fade-in"
          onClick={closeReel}
        >
          {/* Close Button */}
          <button
            onClick={closeReel}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 rounded-full bg-white/10 text-white hover:bg-gold-500 hover:text-royal-black transition-colors z-50"
            aria-label="Close reel"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev / Next Arrows (Desktop) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevReel();
            }}
            className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/60 border border-white/20 text-white hover:border-gold-500 hover:text-gold-400 transition-all z-40"
            aria-label="Previous reel"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextReel();
            }}
            className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/60 border border-white/20 text-white hover:border-gold-500 hover:text-gold-400 transition-all z-40"
            aria-label="Next reel"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Reel Frame */}
          <div
            className="relative w-full max-w-sm sm:max-w-md aspect-[9/16] max-h-[88vh] rounded-3xl overflow-hidden border-2 border-gold-500/50 shadow-2xl bg-black flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* The Video Element */}
            <video
              ref={modalVideoRef}
              src={activeModalReel.videoSrc}
              poster={activeModalReel.poster}
              autoPlay
              playsInline
              loop
              muted={isModalMuted}
              onPlay={() => setIsModalPlaying(true)}
              onPause={() => setIsModalPlaying(false)}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/60 pointer-events-none" />

            {/* Top Bar inside modal reel */}
            <div className="relative p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/images/salman_logo_transparent.png"
                  alt="Salman Perfumes"
                  className="w-7 h-7 object-contain"
                />
                <span className="text-xs font-display font-bold text-white tracking-widest uppercase">
                  Salman Perfumes
                </span>
              </div>

              {/* Sound Toggle */}
              <button
                onClick={toggleModalMute}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 border border-gold-500/40 text-gold-300 text-xs font-mono"
              >
                {isModalMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-gold-400" />}
                <span>{isModalMuted ? 'Muted' : 'Sound ON'}</span>
              </button>
            </div>

            {/* Bottom Details & Booking Action */}
            <div className="relative p-5 z-10 space-y-3">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-gold-400 block mb-0.5">
                  {activeModalReel.tag} • Live Footage
                </span>
                <h3 className="text-lg font-display font-bold text-white">
                  {activeModalReel.title}
                </h3>
                <p className="text-xs text-gray-200 font-sans mt-1">
                  {activeModalReel.description}
                </p>
              </div>

              {/* Controls & Book Button */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  onClick={toggleModalPlay}
                  className="p-2 rounded-xl bg-white/10 text-white hover:bg-gold-500 hover:text-royal-black transition-colors"
                >
                  {isModalPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>

                <button
                  onClick={() => {
                    closeReel();
                    onOpenBooking();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gold-gradient text-royal-black text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Book This Experience (₹60,000)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
