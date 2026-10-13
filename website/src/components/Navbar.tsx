import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
}

const WA = 'https://wa.me/919876543210?text=Hello%20Salman%20Perfumes%2C%20I%20am%20interested%20in%20the%20Royal%20Premium%20Wedding%20Fragrance%20Experience.';

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { name: 'Experience', href: '#experience' },
    { name: '3D Showcase', href: '#3d-model' },
    { name: 'Services', href: '#services' },
    { name: 'Reels', href: '#reels' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Rates', href: '#pricing' },
  ];

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled || open ? 'glass-nav py-3' : 'py-6'}`}>
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 sm:px-10">
        <a href="#" aria-label="Salman Perfumes">
          <img src="/assets/images/salman_logo_site.png" alt="Salman Perfumes" className="h-11 w-auto object-contain sm:h-12" />
        </a>

        <div className="hidden items-center gap-9 lg:flex">
          {links.map((l) => (
            <a key={l.name} href={l.href} className="group relative text-[11px] uppercase tracking-[0.24em] text-ivory/70 transition-colors hover:text-ivory">
              {l.name}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold-300 transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-6 sm:flex">
          <a href={WA} target="_blank" rel="noopener noreferrer" className="text-[11px] uppercase tracking-[0.24em] text-ivory/70 hover:text-gold-300">WhatsApp</a>
          <button onClick={onOpenBooking} className="btn-gold !px-6 !py-3">Reserve</button>
        </div>

        <button onClick={() => setOpen(!open)} className="p-2 text-ivory lg:hidden" aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ivory/10 px-6 pb-8 pt-6 lg:hidden">
          <div className="flex flex-col gap-5">
            {links.map((l) => (
              <a key={l.name} href={l.href} onClick={() => setOpen(false)} className="font-serif text-3xl font-light text-ivory">{l.name}</a>
            ))}
          </div>
          <button onClick={() => { setOpen(false); onOpenBooking(); }} className="btn-gold mt-8 w-full">Reserve your date</button>
        </div>
      )}
    </nav>
  );
};
