import React from 'react';
import { AboutSection } from '../components/AboutSection';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { useNavigate, Link } from 'react-router-dom';
import { Award, Utensils, Star, ArrowUpRight, Wine, Sparkles } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { AdminImageUploadBadge } from '../components/AdminImageUploadBadge';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings, handleUpdateSettings } = useRestaurant();

  const chefs = [
    {
      name: 'Chef Alessandro Rossi',
      role: 'Executive Chef & Culinary Director',
      bio: 'Trained in Modena and San Sebastián, Alessandro brings three decades of haute cuisine discipline, harmonizing European precision with antique spice traditions.',
      image: (settings as any).chef1Image || '/src/assets/images/chef_plating_dish_1792868334890.jpg',
      accolades: 'Michelin Star Alum · 3 Stars Mentorship'
    },
    {
      name: 'Ustad Tariq Qureshi',
      role: 'Master of Awadhi Imperial Heritage',
      bio: 'Seventh-generation descendant of royal court khansamas of Lucknow, Tariq curates our 36-hour slow-cooked gravies, handi dum techniques, and potli herbal reductions.',
      image: (settings as any).chef2Image || '/src/assets/images/food_wagyu_steak_1792868333122.jpg',
      accolades: 'Golden Handi Distinction · Royal Spicery Guardian'
    }
  ];

  return (
    <div className="py-12 bg-[#070d14]">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="border-b border-[#c5a880]/20 pb-8 text-center max-w-3xl mx-auto">
          <span className="text-xs tracking-[0.25em] text-[#c5a880] uppercase font-bold block mb-2">
            ✦ Heritage & Philosophy ✦
          </span>
          <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold text-[#f5efeb] tracking-[0.06em] uppercase">
            ABOUT BROSO
          </h1>
          <p className="text-xs sm:text-sm text-[#a89b8d] mt-3 leading-relaxed">
            The confluence of royal court banquets, Michelin-inspired craftsmanship, and unyielding culinary dedication.
          </p>
        </div>
      </div>

      {/* Main About Story Section */}
      <AboutSection
        onDiscoverMore={() => navigate('/menu')}
        onReserveTable={() => navigate('/reservations')}
      />

      {/* Culinary Brigadiers / Chefs Section */}
      <section className="py-20 bg-[#05090f] border-b border-[#c5a880]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs tracking-[0.25em] text-[#c5a880] uppercase font-bold block mb-2">
              ✦ The Culinary Masters ✦
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#f5efeb] tracking-[0.08em] uppercase">
              MEET OUR EXECUTIVE CHEFS
            </h2>
            <div className="w-16 h-[2px] bg-[#c5a880] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {chefs.map((chef, idx) => (
              <div 
                key={idx}
                className="bg-[#0a111a] border border-[#c5a880]/20 rounded-sm overflow-hidden flex flex-col sm:flex-row group hover:border-[#c5a880]/60 transition-all duration-300"
              >
                <div className="sm:w-1/2 h-64 sm:h-auto overflow-hidden relative">
                  <AdminImageUploadBadge
                    folder="chefs"
                    label="Change Photo"
                    title={`Admin: Replace portrait for ${chef.name}`}
                    onUploaded={async (newUrl) => {
                      if (idx === 0) {
                        await handleUpdateSettings({ chef1Image: newUrl } as any);
                      } else {
                        await handleUpdateSettings({ chef2Image: newUrl } as any);
                      }
                    }}
                  />
                  <img
                    src={chef.image}
                    alt={chef.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#0a111a] via-transparent to-transparent opacity-70" />
                </div>
                <div className="sm:w-1/2 p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#c5a880] block mb-1">
                      {chef.accolades}
                    </span>
                    <h3 className="font-cinzel text-xl font-bold text-[#f8f5f0]">
                      {chef.name}
                    </h3>
                    <p className="text-xs text-[#ded6cc] font-medium mt-0.5">
                      {chef.role}
                    </p>
                    <p className="text-xs text-[#a89b8d] leading-relaxed mt-3">
                      {chef.bio}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#c5a880]/15 flex items-center gap-1.5 text-xs text-[#c5a880]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Master Class & Degustation Mentor</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Pillars */}
      <WhyChooseUs />

      {/* Bottom Reservation CTA */}
      <div className="py-16 bg-[#070d14] text-center">
        <div className="max-w-xl mx-auto px-4 space-y-4">
          <h3 className="font-cinzel text-2xl font-bold text-[#f5efeb]">
            EXPERIENCE THE HERITAGE IN PERSON
          </h3>
          <p className="text-xs text-[#a89b8d]">
            Tables are curated with private sommelier pairings and personalized dietary preparations.
          </p>
          <div className="pt-2">
            <Link
              to="/reservations"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#c5a880] text-[#070d14] font-cinzel text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#b89b74] transition-all shadow-lg"
            >
              <span>Reserve a Table</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
