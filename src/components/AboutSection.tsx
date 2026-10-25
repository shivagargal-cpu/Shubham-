import React from 'react';
import { ArrowUpRight, Award, Compass, HeartHandshake, Sparkles } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { AdminImageUploadBadge } from './AdminImageUploadBadge';

interface AboutSectionProps {
  onDiscoverMore: () => void;
  onReserveTable: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onDiscoverMore, onReserveTable }) => {
  const { settings, handleUpdateSettings } = useRestaurant();

  return (
    <section id="about" className="relative bg-[#070d14] py-24 border-b border-[#c5a880]/15 overflow-hidden">
      
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#c5a880]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Atmospheric Image Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-sm overflow-hidden border border-[#c5a880]/30 shadow-2xl group">
              <AdminImageUploadBadge
                folder="about"
                label="Change Story Photo"
                title="Admin: Upload & replace about story photo"
                onUploaded={async (newUrl) => {
                  await handleUpdateSettings({ aboutImageUrl: newUrl, aboutImage: newUrl });
                }}
              />
              <img
                src={settings.aboutImageUrl || "/src/assets/images/chef_plating_dish_1792868334890.jpg"}
                alt="Executive Chef Plating Fine Dining Creation"
                className="w-full h-[460px] sm:h-[540px] object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070d14] via-transparent to-transparent opacity-80" />
              
              {/* Floating Heritage Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#0a111a]/95 backdrop-blur-md border border-[#c5a880]/40 rounded-sm shadow-xl flex items-center justify-between">
                <div>
                  <p className="font-script text-2xl text-[#e8c794] -mb-1">Culinary Excellence</p>
                  <p className="font-cinzel text-xs tracking-widest text-[#f5efeb] font-semibold uppercase">
                    Since 2008 · Metropolitan Haute Cuisine
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#c5a880]/20 text-[#c5a880] flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Editorial Story & Metrics */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            <div className="flex items-center gap-2 text-xs tracking-[0.25em] text-[#c5a880] uppercase font-bold mb-3">
              <span>✦</span>
              <span>Our Royal Legacy</span>
            </div>

            <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f5efeb] tracking-[0.06em] leading-tight mb-6">
              {settings.aboutTitle || 'THE NOBLE PURSUIT OF GASTRONOMY'}
            </h2>

            <p className="text-sm sm:text-base text-[#b8ab9e] leading-relaxed mb-6 font-normal">
              {settings.aboutStory || 'Founded under the patronage of connoisseurs who sought the timeless elegance of Awadhi royal banquets combined with the technical finesse of Italian alta cucina, BROSO is more than a restaurant—it is an ode to gastronomic aristocracy.'}
            </p>

            <p className="text-xs sm:text-sm text-[#9f9184] leading-relaxed mb-8 font-normal">
              {settings.aboutSecondaryStory || 'Every reduction simmered for 36 hours, every A5 Miyazaki Wagyu grain inspected, and every truffle shaved tableside reflects our uncompromising devotion.'}
            </p>

            {/* Heritage Quantitative Proof Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-[#c5a880]/20 mb-8">
              <div>
                <p className="font-cinzel text-2xl sm:text-3xl font-bold text-[#c5a880] tabular-nums">
                  {settings.yearsHeritage || '18+'}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-[#9f9184] mt-0.5">Years Heritage</p>
              </div>
              <div>
                <p className="font-cinzel text-2xl sm:text-3xl font-bold text-[#c5a880] tabular-nums">
                  {settings.patronsServed || '45K+'}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-[#9f9184] mt-0.5">Royal Patrons</p>
              </div>
              <div>
                <p className="font-cinzel text-2xl sm:text-3xl font-bold text-[#c5a880] tabular-nums">
                  {settings.signatureRecipesCount || '68'}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-[#9f9184] mt-0.5">Signature Recipes</p>
              </div>
              <div>
                <p className="font-cinzel text-2xl sm:text-3xl font-bold text-[#c5a880] tabular-nums">
                  {settings.cellarBottlesCount || '1,200+'}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-[#9f9184] mt-0.5">Vintage Cellars</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onReserveTable}
                className="px-6 py-3 bg-[#c5a880] hover:bg-[#b59870] text-[#070d14] font-cinzel text-xs font-bold tracking-[0.18em] uppercase transition-all rounded-sm flex items-center gap-2 active:scale-95"
              >
                <span>Reserve an Evening</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={onDiscoverMore}
                className="px-6 py-3 border border-[#c5a880]/40 hover:border-[#c5a880] text-[#ded6cc] hover:text-[#f8f5f0] font-cinzel text-xs font-semibold tracking-[0.18em] uppercase transition-all rounded-sm active:scale-95"
              >
                Explore Menu
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
