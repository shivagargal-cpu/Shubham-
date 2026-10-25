import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { RestaurantHighlights } from '../components/RestaurantHighlights';
import { ChefsSpecials } from '../components/ChefsSpecials';
import { useRestaurant } from '../context/RestaurantContext';
import { ArrowUpRight, Award, Star, Quote, ChevronRight, ShieldCheck } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { handleAddToCart, reviews } = useRestaurant();

  const featuredReviews = reviews.filter((r) => r.isFeatured || r.rating === 5).slice(0, 3);

  return (
    <div className="space-y-0">
      {/* A. Hero Section */}
      <Hero
        onExploreMenu={() => navigate('/menu')}
        onReserveTable={() => navigate('/reservations')}
      />

      {/* B. Restaurant Highlights (3 Cards & Food Menus Header from reference) */}
      <RestaurantHighlights />

      {/* C. Short Introduction & Story Preview */}
      <section className="py-20 bg-[#070d14] border-b border-[#c5a880]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 relative">
              <div className="rounded-sm overflow-hidden border border-[#c5a880]/30 shadow-2xl relative group">
                <img
                  src="/src/assets/images/chef_plating_dish_1792868334890.jpg"
                  alt="Executive Chef Plating"
                  className="w-full h-[400px] object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070d14] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-[#0a111a]/90 backdrop-blur-md border border-[#c5a880]/30 rounded-sm flex items-center justify-between">
                  <div>
                    <p className="font-script text-2xl text-[#e8c794] -mb-1">Culinary Mastery</p>
                    <p className="font-cinzel text-xs text-[#f5efeb] tracking-widest uppercase">Since 2008</p>
                  </div>
                  <Award className="w-6 h-6 text-[#c5a880]" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-5">
              <div className="flex items-center gap-2 text-xs tracking-[0.25em] text-[#c5a880] uppercase font-bold">
                <span>✦</span>
                <span>The Royal Philosophy</span>
              </div>
              <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#f5efeb] tracking-[0.06em] leading-tight">
                A SANCTUARY OF ARISTOCRATIC DINING
              </h2>
              <p className="text-sm text-[#b8ab9e] leading-relaxed">
                Founded under the patronage of connoisseurs who sought the timeless elegance of Awadhi royal banquets combined with the technical finesse of Italian alta cucina, BROSO is an ode to gastronomic aristocracy.
              </p>
              <p className="text-xs text-[#9f9184] leading-relaxed">
                Every reduction simmered for 36 hours, every A5 Miyazaki Wagyu grain inspected, and every truffle shaved tableside reflects our uncompromising devotion.
              </p>
              
              <div className="pt-2 flex items-center gap-4">
                <Link
                  to="/about"
                  className="px-6 py-3 bg-[#c5a880] hover:bg-[#b59870] text-[#070d14] font-cinzel text-xs font-bold tracking-[0.18em] uppercase rounded-sm flex items-center gap-2 transition-all active:scale-95"
                >
                  <span>Discover Our Heritage</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/menu"
                  className="px-6 py-3 border border-[#c5a880]/40 hover:border-[#c5a880] text-[#ded6cc] hover:text-[#f8f5f0] font-cinzel text-xs font-semibold tracking-[0.18em] uppercase rounded-sm transition-all"
                >
                  Explore Food Menu
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* D. Featured Dishes / Chef's Specials */}
      <ChefsSpecials
        onAddToCart={(dish) => handleAddToCart(dish, 1)}
        onReserveTable={() => navigate('/reservations')}
      />

      {/* E. Selected Highlights / Patron Reviews Preview */}
      <section className="py-20 bg-[#070d14] border-b border-[#c5a880]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="font-playfair italic text-sm text-[#c5a880] tracking-widest mb-1.5">
              Patron Accolades
            </p>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#f5efeb] tracking-[0.08em] uppercase">
              DISTINGUISHED WORDS
            </h2>
            <div className="w-16 h-[2px] bg-[#c5a880] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#0a111a] border border-[#c5a880]/20 p-8 rounded-sm relative flex flex-col justify-between hover:border-[#c5a880]/50 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#c5a880] text-[#c5a880]" />
                      ))}
                    </div>
                    {rev.isVerifiedVisit && (
                      <span className="flex items-center gap-1 text-[10px] text-[#c5a880] uppercase tracking-wider font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>
                  <Quote className="w-8 h-8 text-[#c5a880]/20 mb-3" />
                  <h3 className="font-cinzel text-base font-bold text-[#f8f5f0] mb-2">
                    "{rev.title}"
                  </h3>
                  <p className="text-xs text-[#a89b8d] leading-relaxed mb-6">
                    {rev.comment}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#c5a880]/15 text-xs">
                  <p className="font-semibold text-[#ded6cc]">{rev.userName}</p>
                  <p className="text-[10px] text-[#8e8275]">{rev.userRole || 'Distinguished Patron'}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Reservation Banner CTA */}
          <div className="mt-16 p-8 sm:p-12 bg-gradient-to-r from-[#0a111a] via-[#0d1622] to-[#0a111a] border border-[#c5a880]/30 rounded-sm text-center relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#c5a880]">
                Private Seating & Degustation
              </span>
              <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#f5efeb] uppercase">
                RESERVE YOUR BESPOKE TABLE
              </h3>
              <p className="text-xs sm:text-sm text-[#a89b8d]">
                Experience our intimate vaulted cellars, skyline terrace, or chef’s counter. Tables booked in advance receive dedicated sommelier pairings.
              </p>
              <div className="pt-2">
                <Link
                  to="/reservations"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#d4af37] via-[#c5a880] to-[#b39369] text-[#070d14] font-cinzel text-xs font-bold tracking-[0.2em] uppercase rounded-sm shadow-xl hover:brightness-110 transition-all"
                >
                  <span>Book a Table Now</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
