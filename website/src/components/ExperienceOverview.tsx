import React from 'react';
import { Reveal } from './Reveal';

const pillars = [
  { n: '01', title: 'The sacred welcome', desc: 'Guests walk through clouds of hand-blended Oud and resin — the oldest gesture of Arabian hospitality.' },
  { n: '02', title: 'Attar, personally', desc: 'Staff in ghutra and thobe present crystal flacons and apply pure attar with a courteous touch.' },
  { n: '03', title: 'Palace atmosphere', desc: 'Four acrylic-and-brass stands, living braziers and warm light set a tone of quiet grandeur.' },
];

export const ExperienceOverview: React.FC = () => (
  <section id="experience" className="relative border-t border-ivory/10 px-6 py-32 sm:px-10 sm:py-44">
    <div className="mx-auto max-w-[1500px]">
      <div className="grid gap-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <span className="eyebrow">The Experience</span>
          <h2 className="mt-8 font-serif text-5xl font-light leading-[1.02] tracking-[-0.01em] text-ivory sm:text-7xl">
            A wedding you can<br /><em className="gold-text-gradient font-light italic">breathe in.</em>
          </h2>
        </Reveal>
        <Reveal className="lg:col-span-5 lg:pt-6" delay={150}>
          <p className="text-[15px] font-light leading-[1.9] text-ivory/65">
            In Arabic royal tradition no reception is complete without bukhoor and noble attar. Salman Perfumes brings the
            full protocol to your celebration — so every guest leaves carrying the scent of your day.
          </p>
          <div className="mt-10 flex gap-12">
            <div><div className="font-serif text-5xl font-light text-gold-300">100%</div><div className="eyebrow mt-2 !text-ivory/50">Natural Oud</div></div>
            <div><div className="font-serif text-5xl font-light text-gold-300">24h+</div><div className="eyebrow mt-2 !text-ivory/50">Lingering sillage</div></div>
          </div>
        </Reveal>
      </div>

      <div className="mt-24 grid items-center gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <figure className="relative mx-auto max-w-[460px]">
            <div className="absolute -inset-px bg-gradient-to-b from-gold-300/50 via-transparent to-gold-300/20" />
            <img src="/assets/images/four_stands_display.jpg" alt="The 4 signature Salman pedestals under grand wedding illumination" loading="lazy" className="relative aspect-[9/16] w-full object-cover" />
            <figcaption className="mt-5 text-center">
              <span className="eyebrow">The 4 Signature Salman Pedestals</span>
              <span className="mt-2 block font-serif text-lg font-light italic text-ivory/70">Four high-gloss acrylic burner stands aligned under grand wedding illumination.</span>
            </figcaption>
          </figure>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={150}>
          <span className="eyebrow">Package &amp; Extras</span>
          <h3 className="mt-6 font-serif text-4xl font-light leading-tight text-ivory sm:text-5xl">
            ₹60,000, all-inclusive.
          </h3>
          <p className="mt-5 max-w-lg text-[15px] font-light leading-[1.9] text-ivory/65">
            Four hours of service, two attar staff, two bukhoor specialists, four stands, a highlight video and travel are
            included. Need more? Extend it simply:
          </p>
          <div className="mt-10 grid gap-px border border-ivory/10 bg-ivory/10 sm:grid-cols-2">
            {[
              ['₹10,000', 'per additional hour', 'Beyond the included 4 hours'],
              ['₹8,000', 'for additional 2 staff', 'Extra attar applicators for larger crowds'],
            ].map(([price, unit, note]) => (
              <div key={unit} className="bg-[#050506] p-8">
                <div className="font-serif text-5xl font-light text-gold-300">{price}</div>
                <div className="mt-3 text-[11px] uppercase tracking-[0.24em] text-ivory">{unit}</div>
                <div className="mt-2 text-sm font-light text-ivory/50">{note}</div>
              </div>
            ))}
          </div>
          <a href="#pricing" className="btn-ghost mt-8">Open the rate calculator</a>
        </Reveal>
      </div>

      <div className="mt-24 grid gap-px border-y border-ivory/10 bg-ivory/10 md:grid-cols-3">
        {pillars.map((p, i) => (
          <Reveal key={p.n} delay={i * 120} className="bg-[#050506]">
            <div className="p-10 transition-colors duration-500 hover:bg-[#0a0907]">
              <span className="font-serif text-lg italic text-gold-300">{p.n}</span>
              <h3 className="mt-6 font-serif text-3xl font-light text-ivory">{p.title}</h3>
              <p className="mt-4 text-sm font-light leading-[1.8] text-ivory/60">{p.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
