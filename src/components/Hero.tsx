import React, { useState } from 'react';
import { ArrowUpRight, Award, Utensils, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

import { useRestaurant } from '../context/RestaurantContext';

interface HeroProps {
  onExploreMenu: () => void;
  onReserveTable: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreMenu, onReserveTable }) => {
  const { settings } = useRestaurant();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      image: settings.heroImageUrl || '/src/assets/images/hero_dining_interior_1792868333053.jpg',
      subtitle: settings.heroSubtitle || 'Welcome to Our Restaurant',
      title: settings.heroTitle || 'TASTE ROYALE CUISINE',
      desc: settings.heroDescription || 'An unparalleled fine dining sanctuary where centuries-old royal Awadhi heritage meets modern artisanal Italian culinary mastery and rare vintage cellaring.'
    },
    {
      image: '/public/assets/aistudio/Broso_-_Restaurants___Cafes_WordPress_Theme_53af6de3.jpeg',
      subtitle: 'Michelin Starred Philosophy',
      title: 'CULINARY ARTISTRY',
      desc: 'Handcrafted seasonal menus, Perigord black truffles, line-caught seafood, and aged A5 Miyazaki Wagyu executed with immaculate precision.'
    }
  ];

  const slide = heroSlides[currentSlide];

  return (
    <section id="home" className="relative min-h-[95vh] md:min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">
      {/* Background Image with Slow Zoom & Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={slide.image}
          alt="Broso Luxury Dining Interior"
          className="w-full h-full object-cover object-center scale-105 transition-all duration-1000 ease-out brightness-[0.45] contrast-[1.1]"
          referrerPolicy="no-referrer"
        />
        {/* Measured dark scrim gradient to guarantee WCAG AA contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070d14] via-[#070d14]/65 to-[#070d14]/75" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#070d14]/30 to-[#070d14]/90" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* Welcome Script Subtitle */}
        <div className="flex items-center gap-3 mb-2 animate-in fade-in slide-in-from-bottom-3 duration-700">
          <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#c5a880]" />
          <p className="font-script text-3xl sm:text-4xl md:text-5xl text-[#e8c794] tracking-wide select-none drop-shadow">
            {slide.subtitle}
          </p>
          <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#c5a880]" />
        </div>

        {/* Large Editorial Headline */}
        <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[0.08em] uppercase text-[#fdfbf7] max-w-4xl leading-[1.08] text-balance mb-6 drop-shadow-2xl">
          {slide.title}
        </h1>

        {/* Supporting Narrative */}
        <p className="text-sm sm:text-base md:text-lg text-[#cdc1b4] max-w-2xl font-normal leading-relaxed mb-10 text-balance">
          {slide.desc}
        </p>

        {/* Dual CTA Buttons inspired by reference */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
          {/* Primary Gold CTA */}
          <button
            onClick={onExploreMenu}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#e5c07b] hover:bg-[#d8b067] active:scale-95 text-[#070d14] font-cinzel text-xs sm:text-sm font-bold tracking-[0.2em] uppercase transition-all duration-200 flex items-center justify-center gap-2 rounded-sm shadow-xl shadow-[#e5c07b]/20 group"
          >
            <span>DISCOVER MENU</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          {/* Secondary Ivory / Border CTA */}
          <button
            onClick={onReserveTable}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#f8f5f0] hover:bg-white text-[#070d14] font-cinzel text-xs sm:text-sm font-bold tracking-[0.2em] uppercase transition-all duration-200 flex items-center justify-center gap-2 rounded-sm shadow-lg active:scale-95 group"
          >
            <span>BOOK A TABLE</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Subtle Slide Switcher */}
        <div className="flex items-center gap-4 mt-14">
          <button
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? 1 : 0))}
            className="p-1.5 text-[#a49688] hover:text-[#c5a880] transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1 transition-all rounded-full ${
                  currentSlide === idx ? 'w-8 bg-[#c5a880]' : 'w-2 bg-[#423930]'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? 1 : 0))}
            className="p-1.5 text-[#a49688] hover:text-[#c5a880] transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Decorative Bottom Diamond */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 text-[#c5a880]/40">
        <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#c5a880]/30" />
        <span className="text-xs">◆</span>
        <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#c5a880]/30" />
      </div>
    </section>
  );
};
