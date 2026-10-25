import React from 'react';
import { Leaf, Award, Sparkles, ChefHat, Wine, ShieldCheck } from 'lucide-react';

export const RestaurantHighlights: React.FC = () => {
  const highlights = [
    {
      icon: (
        <svg className="w-12 h-12 text-[#c5a880] mx-auto stroke-[1.5]" viewBox="0 0 48 48" fill="none" stroke="currentColor">
          <path d="M12 28C12 36 18 40 24 40C30 40 36 36 36 28H12Z" />
          <path d="M18 20C18 15 21 11 24 11C27 11 30 15 30 20" />
          <path d="M24 11V6" />
          <path d="M14 24C14 24 18 22 24 22C30 22 34 24 34 24" />
          <circle cx="20" cy="18" r="1.5" fill="currentColor" />
          <circle cx="28" cy="18" r="1.5" fill="currentColor" />
        </svg>
      ),
      title: 'FRESH PRODUCTS',
      description: 'Handpicked daily from organic bio-dynamic heritage micro-farms and pristine deep-sea waters.'
    },
    {
      icon: (
        <svg className="w-12 h-12 text-[#c5a880] mx-auto stroke-[1.5]" viewBox="0 0 48 48" fill="none" stroke="currentColor">
          <path d="M14 36H34M16 40H32" />
          <path d="M14 36V28C14 28 12 27 12 23C12 18 16 16 18 16C18 13 20 10 24 10C28 10 30 13 30 16C32 16 36 18 36 23C36 27 34 28 34 28V36H14Z" />
          <path d="M20 24H28" />
        </svg>
      ),
      title: 'SKILLED CHEFS',
      description: 'Culinary visionaries trained across European Michelin temples and royal imperial palaces.'
    },
    {
      icon: (
        <svg className="w-12 h-12 text-[#c5a880] mx-auto stroke-[1.5]" viewBox="0 0 48 48" fill="none" stroke="currentColor">
          <path d="M18 14H30M24 14V6M20 6H28" />
          <path d="M16 18H32L35 38C35 40 33 42 30 42H18C15 42 13 40 13 38L16 18Z" />
          <circle cx="24" cy="28" r="4" strokeDasharray="2 2" />
          <path d="M34 24L38 28" />
        </svg>
      ),
      title: 'UNIQUE RECIPES',
      description: 'Centuries-old royal court secret formulas harmonized with contemporary molecular alchemy.'
    }
  ];

  return (
    <section id="highlights" className="relative bg-[#070d14] pt-20 pb-16 border-b border-[#c5a880]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 3 HIGHLIGHT CARDS (Directly inspired by reference screenshot) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 text-center">
          {highlights.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center group">
              <div className="mb-5 p-3 rounded-full bg-[#0a111a] border border-[#c5a880]/20 group-hover:border-[#c5a880] group-hover:scale-105 transition-all duration-300">
                {item.icon}
              </div>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold tracking-[0.2em] text-[#f8f5f0] mb-3 group-hover:text-[#c5a880] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#a89b8d] font-normal leading-relaxed max-w-xs">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Elegant Diamond Hairline Divider */}
        <div className="my-20 flex items-center justify-center gap-4 text-[#c5a880]">
          <span className="w-32 md:w-48 h-[1px] bg-gradient-to-r from-transparent to-[#c5a880]/40" />
          <span className="text-sm tracking-widest text-[#c5a880]">◆</span>
          <span className="w-32 md:w-48 h-[1px] bg-gradient-to-l from-transparent to-[#c5a880]/40" />
        </div>

        {/* SECTION BANNER: SEASONAL & DELICIOUS FOOD MENUS */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="font-playfair italic text-sm sm:text-base text-[#c5a880] tracking-widest mb-2">
            ✦ Why Choose Us ✦
          </p>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5efeb] tracking-[0.1em] uppercase mb-5 leading-tight">
            SEASONAL & DELICIOUS FOOD MENUS
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#a89b8d] leading-relaxed font-normal">
            Every season heralds a sensory awakening. We honor earth’s purest cycles by elevating peak-harvest organic truffles, prized Japanese Wagyu, and rare heritage botanicals into an indelible culinary tapestry.
          </p>
        </div>

      </div>
    </section>
  );
};
