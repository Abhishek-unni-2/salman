import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, Film, CheckCircle2 } from 'lucide-react';

export const VideoHighlightReel: React.FC = () => {
  const [activeVideoIdx, setActiveVideoIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const reels = [
    {
      id: 0,
      title: 'Cinematic Event Highlight Video',
      tag: 'Official Wedding Reel',
      desc: 'Professionally captured highlight of the fragrance experience, aromatic ambience, and guest joy.',
      src: '/assets/videos/highlight_experience.mp4',
      poster: '/assets/images/attar_guest_service.jpg',
      duration: '0:45',
    },
    {
      id: 1,
      title: 'Arabic Staff & Attar Application',
      tag: 'Bespoke Guest Service',
      desc: 'Traditional Arabic attire specialists applying artisanal attar directly from crystal flacons.',
      src: '/assets/videos/arabic_staff_attar.mp4',
      poster: '/assets/images/arabic_attar_application.jpg',
      duration: '0:16',
    },
    {
      id: 2,
      title: 'Grand Entrance & Mabkhara Ambience',
      tag: 'Aromatic Cloud',
      desc: 'Sacred Oud smoke welcoming arriving guests at the floral entrance gate.',
      src: '/assets/videos/entrance_ambience.mp4',
      poster: '/assets/images/entrance_bukhoor_burner.jpg',
      duration: '0:20',
    },
    {
      id: 3,
      title: 'The 4 Signature Display Pedestals',
      tag: 'Palace Stage Setup',
      desc: 'The Salman Perfumes 4-stand acrylic and brass presentation aligned at venue entrance.',
      src: '/assets/videos/royal_stands_display.mp4',
      poster: '/assets/images/four_stands_display.jpg',
      duration: '0:16',
    },
  ];

  const currentReel = reels[activeVideoIdx];

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const selectVideo = (idx: number) => {
    setActiveVideoIdx(idx);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <section id="reels" className="py-24 px-4 sm:px-6 lg:px-8 bg-royal-black relative arabesque-pattern border-t border-gold-500/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-950/70 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-3">
            <Film className="w-3.5 h-3.5" />
            <span>Event Highlights Video Reel</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-tight">
            Witness the <span className="gold-text-gradient">Ambience</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-300 font-serif italic">
            Experience the sensory magic through our live captured event footage—from the billows of Oud incense to the radiant smiles of greeted guests.
          </p>
        </div>

        {/* Video Player & Selection Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Video Reel Player (7 cols) */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="relative w-full max-w-md sm:max-w-lg aspect-[9/16] rounded-3xl overflow-hidden border-2 border-gold-500/40 shadow-2xl bg-black group">
              <video
                ref={videoRef}
                src={currentReel.src}
                poster={currentReel.poster}
                autoPlay
                playsInline
                loop
                muted={isMuted}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full object-cover"
              />

              {/* Top Video Overlay Bar */}
              <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between z-10 pointer-events-none">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[11px] font-mono uppercase tracking-widest text-gold-400 font-bold">
                    Salman Live Capture
                  </span>
                </div>
                <span className="text-xs bg-black/60 px-2.5 py-1 rounded-full border border-white/20 text-gray-200">
                  {currentReel.tag}
                </span>
              </div>

              {/* Bottom Playback Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10 flex flex-col gap-2">
                <div>
                  <h4 className="text-base font-display font-bold text-white">
                    {currentReel.title}
                  </h4>
                  <p className="text-xs text-gray-300 font-sans line-clamp-2">
                    {currentReel.desc}
                  </p>
                </div>

                {/* Control Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="p-2 rounded-full bg-gold-gradient text-royal-black hover:scale-110 active:scale-95 transition-transform"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-royal-black" /> : <Play className="w-4 h-4 fill-royal-black" />}
                    </button>

                    <button
                      onClick={toggleMute}
                      className="p-2 rounded-full bg-black/60 border border-white/20 text-gold-400 hover:text-white transition-colors"
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <span className="text-[11px] text-gray-400">{isMuted ? 'Muted' : 'Sound ON'}</span>
                  </div>

                  <button
                    onClick={handleFullscreen}
                    className="p-2 rounded-full bg-black/60 border border-white/20 text-gray-300 hover:text-white transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Video List & Details (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="mb-2">
              <span className="text-xs uppercase tracking-widest text-gold-400 font-mono">
                Select Footage To Inspect
              </span>
              <h3 className="text-2xl font-display font-bold text-white mt-1">
                Real Wedding Reels Collection
              </h3>
            </div>

            {reels.map((reel, idx) => (
              <div
                key={reel.id}
                onClick={() => selectVideo(idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-4 ${
                  activeVideoIdx === idx
                    ? 'bg-gold-950/40 border-gold-500 shadow-xl'
                    : 'bg-royal-card/60 border-white/10 hover:border-gold-500/40 hover:bg-white/5'
                }`}
              >
                {/* Thumbnail with duration badge */}
                <div className="relative w-20 h-24 rounded-lg overflow-hidden shrink-0 border border-gold-500/30">
                  <img
                    src={reel.poster}
                    alt={reel.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    {activeVideoIdx === idx ? (
                      <div className="w-6 h-6 rounded-full bg-gold-500 text-royal-black flex items-center justify-center">
                        <Play className="w-3 h-3 fill-current" />
                      </div>
                    ) : (
                      <Play className="w-4 h-4 text-white fill-white/80" />
                    )}
                  </div>
                  <span className="absolute bottom-1 right-1 text-[9px] bg-black/80 px-1 rounded text-gray-300 font-mono">
                    {reel.duration}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-gold-400 font-mono uppercase tracking-wider block">
                    {reel.tag}
                  </span>
                  <h4 className="text-sm font-display font-bold text-white truncate mt-0.5">
                    {reel.title}
                  </h4>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-1 font-sans">
                    {reel.desc}
                  </p>
                </div>
              </div>
            ))}

            {/* Note on video highlight included */}
            <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center gap-3 mt-2">
              <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />
              <p className="text-xs text-gray-300 font-sans">
                <strong className="text-gold-300">Package Guarantee:</strong> 1 professionally filmed and edited event highlight video is fully included in the ₹60,000 package.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
