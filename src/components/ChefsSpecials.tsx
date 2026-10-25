import React from 'react';
import { Star, Plus, Wine, ArrowUpRight } from 'lucide-react';
import { MenuItem } from '../types';
import { useRestaurant } from '../context/RestaurantContext';
import { AdminImageUploadBadge } from './AdminImageUploadBadge';

interface ChefsSpecialsProps {
  onAddToCart: (item: MenuItem, quantity: number) => void;
  onReserveTable: () => void;
}

export const ChefsSpecials: React.FC<ChefsSpecialsProps> = ({ onAddToCart, onReserveTable }) => {
  const { menuItems, handleUpdateMenuItem } = useRestaurant();

  const specials: (MenuItem & { accolades: string })[] = [
    {
      id: 'main-1',
      name: 'Imperial A5 Wagyu Tenderloin',
      category: 'Main Course',
      description: 'Miyazaki A5 beef tenderloin seared with binchotan charcoal, rich Perigord black truffle jus, and Robuchon-style buttered potato velvet.',
      price: 95,
      imageUrl: '/src/assets/images/food_wagyu_steak_1792868333122.jpg',
      isVegetarian: false,
      isChefSpecial: true,
      rating: 5.0,
      pairing: 'Château Margaux Premier Grand Cru 2015',
      accolades: 'Golden Fork Distinction 2026',
      available: true
    },
    {
      id: 'ita-1',
      name: 'Maine Lobster Tagliolini',
      category: 'Italian',
      description: 'Squid ink ribbons folded with butter-poached Maine lobster tail medallions in a fragrant saffron fumet emulsion with micro greens.',
      price: 64,
      imageUrl: '/src/assets/images/food_lobster_pasta_1792868334911.jpg',
      isVegetarian: false,
      isChefSpecial: true,
      rating: 5.0,
      pairing: 'Gavi di Gavi La Scolca Black Label',
      accolades: 'Signature Masterpiece Award',
      available: true
    },
    {
      id: 'des-1',
      name: '24K Gold Royal Chocolate Sphere',
      category: 'Desserts',
      description: 'Grand Cru dark chocolate sphere veiled with 24K edible gold, warm poured wild blackberry coulis, hazelnut praline core, and Madagascar vanilla.',
      price: 32,
      imageUrl: '/src/assets/images/food_royal_dessert_1792868334735.jpg',
      isVegetarian: true,
      isChefSpecial: true,
      rating: 5.0,
      pairing: 'Château d’Yquem Sauternes 2011',
      accolades: 'Patisserie of the Year',
      available: true
    }
  ];

  return (
    <section id="specials" className="relative bg-[#05090f] py-24 border-b border-[#c5a880]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-[0.25em] text-[#c5a880] uppercase font-bold mb-2">
              <span>✦</span>
              <span>The Crown Selections</span>
            </div>
            <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5efeb] tracking-[0.08em] uppercase">
              CHEF'S SIGNATURE SPECIALS
            </h2>
          </div>
          <button
            onClick={onReserveTable}
            className="self-start md:self-auto px-5 py-2.5 border border-[#c5a880]/40 hover:border-[#c5a880] text-[#c5a880] hover:text-[#f8f5f0] text-xs font-cinzel font-bold tracking-[0.18em] uppercase rounded-sm flex items-center gap-2 transition-all active:scale-95"
          >
            <span>Reserve For Degustation</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Special Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {specials.map((dish) => {
            const liveDish = menuItems.find((m) => m.id === dish.id) || dish;
            return (
              <div
                key={dish.id}
                className="bg-[#080e16] border border-[#c5a880]/25 rounded-sm overflow-hidden flex flex-col justify-between group hover:border-[#c5a880] transition-all duration-300 shadow-xl"
              >
                {/* Image Frame */}
                <div className="relative h-72 overflow-hidden">
                  <AdminImageUploadBadge
                    folder="menu"
                    label="Change Photo"
                    title={`Admin: Replace photo for ${liveDish.name}`}
                    onUploaded={async (newUrl) => {
                      await handleUpdateMenuItem(dish.id, { imageUrl: newUrl });
                    }}
                  />
                  <img
                    src={liveDish.imageUrl}
                    alt={liveDish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080e16] via-transparent to-transparent opacity-90" />
                  
                  {/* Accolade ribbon */}
                  <div className="absolute bottom-4 left-4 bg-[#c5a880] text-[#070d14] text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm shadow-md">
                    {dish.accolades}
                  </div>

                  {/* Rating */}
                  <div className="absolute top-4 right-4 bg-[#070d14]/85 backdrop-blur-md border border-[#c5a880]/30 px-2 py-0.5 rounded-sm flex items-center gap-1 text-[11px] text-[#e8c794]">
                    <Star className="w-3 h-3 fill-[#c5a880] text-[#c5a880]" />
                    <span className="font-bold tabular-nums">5.0</span>
                  </div>
                </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-[11px] uppercase tracking-wider text-[#c5a880] font-semibold mb-1">
                  {dish.category}
                </div>
                <h3 className="font-cinzel text-xl font-bold text-[#f8f5f0] mb-3 group-hover:text-[#c5a880] transition-colors">
                  {dish.name}
                </h3>
                <p className="text-xs text-[#a89b8d] leading-relaxed mb-4 flex-grow">
                  {dish.description}
                </p>

                {/* Wine Pairing */}
                <div className="mb-6 p-2.5 rounded-sm bg-[#c5a880]/10 border border-[#c5a880]/20 text-[11px] text-[#ded6cc] flex items-center gap-2">
                  <Wine className="w-4 h-4 text-[#c5a880] shrink-0" />
                  <span className="truncate">Pairing: {dish.pairing}</span>
                </div>

                {/* Footer with Price and Order Button */}
                <div className="pt-4 border-t border-[#c5a880]/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-[#8e8275] tracking-wider block">Price</span>
                    <span className="font-cinzel text-2xl font-bold text-[#f5efeb] tabular-nums">
                      ${dish.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => onAddToCart(dish, 1)}
                    className="px-4 py-2.5 bg-[#c5a880] hover:bg-[#b89b74] active:scale-95 text-[#070d14] text-xs font-bold tracking-widest uppercase rounded-sm transition-all flex items-center gap-2 shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Order Now</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      </div>
    </section>
  );
};
