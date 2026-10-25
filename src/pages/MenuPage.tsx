import React from 'react';
import { FeaturedMenu } from '../components/FeaturedMenu';
import { useRestaurant } from '../context/RestaurantContext';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const MenuPage: React.FC = () => {
  const { menuItems, handleAddToCart, cart } = useRestaurant();
  const cartCount = cart.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="py-12 bg-[#070d14]">
      {/* Editorial Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="border-b border-[#c5a880]/20 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs tracking-[0.25em] text-[#c5a880] uppercase font-bold block mb-2">
              ✦ Gastronomic Catalog ✦
            </span>
            <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold text-[#f5efeb] tracking-[0.06em] uppercase">
              ARTISANAL FOOD MENU
            </h1>
            <p className="text-xs sm:text-sm text-[#a89b8d] max-w-2xl mt-2 leading-relaxed">
              Explore our full curation of Awadhi royal dishes, hand-rolled pastas, Wagyu prime cuts, and gold-leafed desserts crafted fresh for table degustation or delivery.
            </p>
          </div>

          {cartCount > 0 && (
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c5a880] text-[#070d14] font-cinzel text-xs font-bold uppercase tracking-wider rounded-sm shadow-lg hover:bg-[#b89b74] transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View Cart ({cartCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Complete Menu with Filters, Categories, Search, Detail Modal & Add to Cart */}
      <FeaturedMenu
        menuItems={menuItems}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};
