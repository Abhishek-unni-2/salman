import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface HeroCinematicProps {
  onOpenBooking: () => void;
  onExplore3D: () => void;
}

interface HeroVideo {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  poster: string;
  duration: string;
}

export const HeroCinematic: React.FC<HeroCinematicProps> = ({ onOpenBooking, onExplore3D }) => {
  const videoList: HeroVideo[] = [
    {
      id: 'highlight',
      title: 'Full Event Highlight',
      subtitle: 'Attar application, burning charcoal & grand ambience',
      src: '/assets/videos/video_full_highlight.mp4',
      poster: '/assets/images/attar_guest_service.jpg',
      duration: '1:00',
    },
    {
      id: 'attar',
      title: 'Arabic Attire Attar Service',
      subtitle: 'Fragrance specialists personally applying pure attar',
      src: '/assets/videos/video_arabic_attar_ritual.mp4',
      poster: '/assets/images/arabic_attar_application.jpg',
      duration: '0:16',
    },
    {
      id: 'entrance',
      title: 'Entrance Mabkhara Ambience',
      subtitle: 'Sacred smoke welcoming guests at the floral gate',
      src: '/assets/videos/video_entrance_mabkhara.mp4',
      poster: '/assets/images/entrance_bukhoor_burner.jpg',
      duration: '0:28',
    },
    {
      id: 'stands',
      title: '4 Display Pedestals',
      subtitle: 'Signature Salman acrylic stands under glowing arches',
      src: '/assets/videos/video_four_stands_arches.mp4',
      poster: '/assets/images/four_stands_display.jpg',
      duration: '0:16',
    },
    {
      id: 'fleet',
      title: 'Rolls Royce & Fleet Arrival',
      subtitle: 'Luxury convoy arrival at the royal celebration',
      src: '/assets/videos/video_rolls_royce_fleet.mp4',
      poster: '/assets/images/rolls_royce_arrival.jpg',
      duration: '0:39',
    },
    {
      id: 'couple',
      title: 'Royal Couple Ceremony',
      subtitle: 'Blessings surrounded by lingering luxury aroma',
      src: '/assets/videos/video_royal_wedding_couple.mp4',
      poster: '/assets/images/royal_bride_groom.jpg',
      duration: '0:13',
    },
  ];

  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentVideo = videoList[activeIdx];

  const handleSelectVideo = (idx: number) => {
    setActiveIdx(idx);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

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

  return (
    <section className="luxury-bg relative flex min-h-screen items-center overflow-hidden px-6 pb-16 pt-32 sm:px-10">
      <div className="mx-auto grid w-full max-w-[1500px] items-center gap-14 lg:grid-cols-12">
        {/* Copy */}
        <div className="lg:col-span-7">
          <span className="eyebrow">عطور سلمان &nbsp;·&nbsp; Royal Wedding Fragrance</span>
          <h1 className="mt-8 font-serif text-[clamp(3.2rem,8.2vw,8.5rem)] font-light leading-[0.92] tracking-[-0.02em] text-ivory">
            The scent of<br />
            <em className="gold-text-gradient pr-2 font-light italic">arrival.</em>
          </h1>
          <p className="mt-9 max-w-xl text-[15px] font-light leading-[1.8] text-ivory/65">
            Hand-blended Oud bukhoor, pure attar applied by staff in traditional Arabic attire, and four signature
            black-and-gold stands — composed to turn your wedding entrance into a memory people can smell.
          </p>

          <div className="mt-11 flex flex-col gap-4 sm:flex-row">
            <button onClick={onOpenBooking} className="btn-gold">Reserve · ₹60,000</button>
            <button onClick={onExplore3D} className="btn-ghost">Enter the 3D showcase</button>
          </div>

          <dl className="mt-16 grid max-w-xl grid-cols-2 gap-px border border-ivory/10 bg-ivory/10 sm:grid-cols-4">
            {[
              ['4 hrs', 'Included'],
              ['2', 'Attar staff'],
              ['2', 'Bukhoor artists'],
              ['4', 'Signature stands'],
            ].map(([n, l]) => (
              <div key={l} className="bg-[#050506] px-4 py-5">
                <dt className="font-serif text-3xl font-light text-gold-300">{n}</dt>
                <dd className="mt-1 text-[10px] uppercase tracking-[0.22em] text-ivory/50">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Video */}
        <div className="lg:col-span-5">
          <div className="relative mx-auto w-full max-w-[420px]">
            <div className="absolute -inset-px bg-gradient-to-b from-gold-300/50 via-transparent to-gold-300/20" />
            <div className="relative aspect-[9/16] max-h-[78vh] w-full overflow-hidden bg-black">
              <video
                ref={videoRef}
                src={currentVideo.src}
                poster={currentVideo.poster}
                autoPlay playsInline loop muted={isMuted}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40" />

              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
                <span className="eyebrow !text-ivory/80">Live · {String(activeIdx + 1).padStart(2, '0')} / {String(videoList.length).padStart(2, '0')}</span>
                <button onClick={toggleMute} aria-label="Toggle sound" className="text-ivory/80 transition hover:text-gold-300">
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-serif text-2xl font-light text-ivory">{currentVideo.title}</h3>
                <p className="mt-1 text-xs text-ivory/60">{currentVideo.subtitle}</p>
                <div className="mt-5 flex items-center gap-4">
                  <button onClick={togglePlay} aria-label="Play or pause" className="grid h-10 w-10 place-items-center border border-ivory/40 text-ivory transition hover:border-gold-300 hover:text-gold-300">
                    {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  </button>
                  <div className="flex flex-1 gap-1.5">
                    {videoList.map((v, i) => (
                      <button key={v.id} onClick={() => handleSelectVideo(i)} aria-label={v.title} className="group flex-1 py-2">
                        <span className={`block h-px transition-all ${i === activeIdx ? 'bg-gold-300' : 'bg-ivory/30 group-hover:bg-ivory/70'}`} style={{ height: i === activeIdx ? 2 : 1 }} />
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] tracking-[0.2em] text-ivory/50">{currentVideo.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
