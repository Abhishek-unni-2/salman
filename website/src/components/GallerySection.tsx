import React, { useState } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, Eye, Sparkles } from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  category: 'bukhoor' | 'attar' | 'wedding' | 'setup';
  image: string;
  caption: string;
}

export const GallerySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      title: 'Entrance Floral Welcome with Mabkhara',
      category: 'bukhoor',
      image: '/assets/images/entrance_bukhoor_burner.jpg',
      caption: 'Aromatic clouds wafting at the floral archway of the Nikah ceremony.',
    },
    {
      id: 2,
      title: 'Traditional Arabic Attar Service',
      category: 'attar',
      image: '/assets/images/arabic_attar_application.jpg',
      caption: 'Attire specialist in Ghutra & Thobe personally decanting royal perfume for guests.',
    },
    {
      id: 3,
      title: 'The 4 Signature Salman Pedestals',
      category: 'setup',
      image: '/assets/images/four_stands_display.jpg',
      caption: 'Four high-gloss acrylic burner stands aligned under grand wedding illumination.',
    },
    {
      id: 4,
      title: 'Sacred Charcoal & Natural Oud Placement',
      category: 'bukhoor',
      image: '/assets/images/bukhoor_specialist_charcoal.jpg',
      caption: 'Bukhoor specialist tending to glowing embers and handcrafted agarwood chips.',
    },
    {
      id: 5,
      title: 'Royal Couple Grand Ceremony',
      category: 'wedding',
      image: '/assets/images/royal_bride_groom.jpg',
      caption: 'A blessed wedding moment embraced in the lingering aroma of royal attar.',
    },
    {
      id: 6,
      title: 'Signature Stand in Floral Setting',
      category: 'setup',
      image: '/assets/images/stand_floral_smoke.jpg',
      caption: 'A Salman black-and-gold stand sending Oud smoke through a florally dressed entrance.',
    },
    {
      id: 7,
      title: 'Guest Joy & Sensory Celebration',
      category: 'attar',
      image: '/assets/images/guests_fragrance_joy.jpg',
      caption: 'Guests and children delighted by the authentic Arabic incense fragrance.',
    },
    {
      id: 8,
      title: 'Grand Palace Portico Setup',
      category: 'setup',
      image: '/assets/images/grand_venue_setup.jpg',
      caption: 'Majestic venue entrance welcoming dignitaries and family members.',
    },
    {
      id: 9,
      title: 'Salman Signature Branding Showcase',
      category: 'setup',
      image: '/assets/images/brand_poster.png',
      caption: 'The official presentation of Salman Perfumes Royal Premium Wedding Experience.',
    },
  ];

  const filteredItems =
    activeCategory === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="py-24 px-4 sm:px-6 lg:px-8 bg-royal-dark relative arabesque-pattern border-t border-gold-500/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-950/70 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>Captured Elegance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-tight">
            Event <span className="gold-text-gradient">Gallery</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-300 font-serif italic">
            Visual testimony from actual luxury weddings and celebrations adorned with our royal Arabic fragrance ambience.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {[
              { id: 'all', label: 'All Photographs' },
              { id: 'bukhoor', label: 'Bukhoor & Smoke' },
              { id: 'attar', label: 'Attar Service' },
              { id: 'setup', label: 'Pedestals & Fleet' },
              { id: 'wedding', label: 'Ceremony' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeCategory === tab.id
                    ? 'bg-gold-500 text-royal-black font-bold shadow-lg'
                    : 'bg-royal-card/80 border border-white/10 text-gray-300 hover:border-gold-500/40 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group relative rounded-2xl overflow-hidden border border-gold-500/25 bg-black cursor-pointer shadow-lg hover:border-gold-500 hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-[4/5] w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                />
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-royal-black via-royal-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-gold-400" />
                  <span className="text-[10px] uppercase font-mono tracking-widest text-gold-400">
                    {item.category}
                  </span>
                </div>
                <h4 className="text-base font-display font-bold text-white mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-300 font-serif italic">
                  {item.caption}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-gold-300 font-semibold">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Click to view full photo</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-gold-500 hover:text-royal-black transition-colors z-50"
            aria-label="Close photo"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="max-h-[75vh] w-auto rounded-xl object-contain shadow-2xl border border-gold-500/40"
            />
            <div className="mt-4 text-center">
              <h3 className="text-lg sm:text-xl font-display font-bold text-white">
                {selectedImage.title}
              </h3>
              <p className="text-xs sm:text-sm text-gold-300 font-serif italic mt-1">
                {selectedImage.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
