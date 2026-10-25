import React from 'react';
import { Sparkles, ShieldCheck, Utensils, Award, Clock, HeartHandshake } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const pillars = [
    {
      number: '01',
      title: 'Pristine Organic Sourcing',
      desc: 'We cultivate direct partnerships with biodynamic micro-farms in the valleys and certified sustainable seafood divers for day-zero freshness.'
    },
    {
      number: '02',
      title: 'Master Culinary Artists',
      desc: 'Our culinary brigadiers hold decades of combined mastery under European triple-star mentors and historic Awadhi royal lineage.'
    },
    {
      number: '03',
      title: 'Surgical Hygiene & Precision',
      desc: 'Pristine open theater kitchens operating under pharmaceutical-grade cleanliness standards and continuous temperature integrity.'
    },
    {
      number: '04',
      title: 'Atmospheric Royal Sanctuaries',
      desc: 'Acoustically tuned velvet booths, hand-blown crystal decanters, ambient crystal chandeliers, and discreet royal butler service.'
    },
    {
      number: '05',
      title: 'Prompt Concierge Fulfillment',
      desc: 'From table course pacing calibrated to your personal cadence to white-glove packaging for private residence degustation.'
    }
  ];

  return (
    <section className="relative bg-[#070d14] py-24 border-b border-[#c5a880]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-playfair italic text-sm text-[#c5a880] tracking-widest mb-2">
            The Broso Standard of Excellence
          </p>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5efeb] tracking-[0.08em] uppercase">
            WHY DINE WITH US
          </h2>
          <div className="w-16 h-[2px] bg-[#c5a880] mx-auto mt-4" />
        </div>

        {/* 5 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => (
            <div 
              key={idx}
              className={`bg-[#0a111a] border border-[#c5a880]/20 p-8 rounded-sm hover:border-[#c5a880]/60 transition-all duration-300 group ${
                idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-cinzel text-2xl font-bold text-[#c5a880] group-hover:scale-110 transition-transform">
                  {pillar.number}
                </span>
                <span className="w-8 h-[1px] bg-[#c5a880]/30" />
              </div>
              <h3 className="font-cinzel text-lg font-bold text-[#f8f5f0] mb-3 group-hover:text-[#c5a880] transition-colors">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#a89b8d] leading-relaxed font-normal">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
