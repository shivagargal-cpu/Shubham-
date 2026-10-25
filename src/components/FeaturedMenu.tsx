import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Sparkles, 
  Flame, 
  Clock, 
  Info, 
  Check, 
  Wine,
  X
} from 'lucide-react';
import { MenuItem, MenuCategory } from '../types';
import { useRestaurant } from '../context/RestaurantContext';
import { AdminImageUploadBadge } from './AdminImageUploadBadge';

interface FeaturedMenuProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem, quantity: number, instructions?: string) => void;
  onOpenDishModal?: (item: MenuItem) => void;
}

export const FeaturedMenu: React.FC<FeaturedMenuProps> = ({ menuItems, onAddToCart }) => {
  const { handleUpdateMenuItem } = useRestaurant();
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('All');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg' | 'specials'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDishModal, setSelectedDishModal] = useState<MenuItem | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [modalInstructions, setModalInstructions] = useState('');
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const categories: MenuCategory[] = [
    'All',
    'Starters',
    'Main Course',
    'Indian',
    'Italian',
    'Desserts',
    'Beverages'
  ];

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // Dietary filter
      if (dietaryFilter === 'veg' && !item.isVegetarian) return false;
      if (dietaryFilter === 'non-veg' && item.isVegetarian) return false;
      if (dietaryFilter === 'specials' && !item.isChefSpecial && !item.isBestseller) return false;
      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchIng = item.ingredients?.some(i => i.toLowerCase().includes(query));
        if (!matchName && !matchDesc && !matchIng) return false;
      }
      return true;
    });
  }, [menuItems, selectedCategory, dietaryFilter, searchQuery]);

  const handleQuickAdd = (dish: MenuItem) => {
    onAddToCart(dish, 1);
    setAddedToast(`Added ${dish.name} to cart`);
    setTimeout(() => setAddedToast(null), 2500);
  };

  const handleOpenModal = (dish: MenuItem) => {
    setSelectedDishModal(dish);
    setModalQuantity(1);
    setModalInstructions('');
  };

  const handleModalAdd = () => {
    if (selectedDishModal) {
      onAddToCart(selectedDishModal, modalQuantity, modalInstructions.trim() || undefined);
      setAddedToast(`Added ${modalQuantity}x ${selectedDishModal.name} to cart`);
      setSelectedDishModal(null);
      setTimeout(() => setAddedToast(null), 2500);
    }
  };

  return (
    <section id="menu" className="relative bg-[#070d14] py-24 border-b border-[#c5a880]/15">
      
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0a111a] border border-[#c5a880] text-[#f8f5f0] px-4 py-3 rounded-md shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200">
          <div className="w-6 h-6 rounded-full bg-[#c5a880] text-[#070d14] flex items-center justify-center font-bold text-xs">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-medium tracking-wide">{addedToast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="font-playfair italic text-sm text-[#c5a880] tracking-widest mb-1.5">
            Artisanal Culinary Portfolio
          </p>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5efeb] tracking-[0.08em] uppercase">
            OUR ROYAL GASTRONOMY
          </h2>
          <div className="w-16 h-[2px] bg-[#c5a880] mx-auto mt-4" />
        </div>

        {/* CONTROLS: Category Tabs & Search Bar */}
        <div className="flex flex-col gap-6 mb-12">
          
          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all rounded-sm whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#c5a880] text-[#070d14] shadow-md shadow-[#c5a880]/20'
                    : 'bg-[#0a111a] border border-[#c5a880]/20 text-[#a89b8d] hover:text-[#f8f5f0] hover:border-[#c5a880]/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Secondary Filters & Search Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
            
            {/* Dietary Filter Segmented Control */}
            <div className="flex items-center gap-1.5 p-1 bg-[#0a111a] border border-[#c5a880]/20 rounded-sm">
              <button
                onClick={() => setDietaryFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                  dietaryFilter === 'all' ? 'bg-[#c5a880]/20 text-[#c5a880]' : 'text-[#8e8275] hover:text-[#ded6cc]'
                }`}
              >
                All Dishes
              </button>
              <button
                onClick={() => setDietaryFilter('veg')}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors flex items-center gap-1.5 ${
                  dietaryFilter === 'veg' ? 'bg-[#c5a880]/20 text-[#c5a880]' : 'text-[#8e8275] hover:text-[#ded6cc]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Vegetarian</span>
              </button>
              <button
                onClick={() => setDietaryFilter('non-veg')}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors flex items-center gap-1.5 ${
                  dietaryFilter === 'non-veg' ? 'bg-[#c5a880]/20 text-[#c5a880]' : 'text-[#8e8275] hover:text-[#ded6cc]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <span>Non-Veg</span>
              </button>
              <button
                onClick={() => setDietaryFilter('specials')}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors flex items-center gap-1 ${
                  dietaryFilter === 'specials' ? 'bg-[#c5a880]/20 text-[#c5a880]' : 'text-[#8e8275] hover:text-[#ded6cc]'
                }`}
              >
                <Sparkles className="w-3 h-3 text-[#c5a880]" />
                <span>Chef Specials</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#8e8275] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Wagyu, Lobster, Truffle..."
                className="w-full bg-[#0a111a] border border-[#c5a880]/20 rounded-sm pl-9 pr-8 py-2 text-xs text-[#f8f5f0] placeholder-[#665e55] focus:outline-none focus:border-[#c5a880] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8e8275] hover:text-[#f8f5f0]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>

        </div>

        {/* DISH GRID */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-[#0a111a]/40 border border-[#c5a880]/10 rounded-sm">
            <p className="text-sm text-[#8e8275] font-medium">No dishes match your selected filter or search.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setDietaryFilter('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-[#c5a880] underline underline-offset-4 hover:text-[#f8f5f0]"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((dish) => (
              <div 
                key={dish.id}
                className="group bg-[#0a111a] border border-[#c5a880]/20 hover:border-[#c5a880]/60 rounded-sm overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-[#c5a880]/5"
              >
                {/* Image Slot with Fallback */}
                <div className="relative h-60 overflow-hidden cursor-pointer" onClick={() => handleOpenModal(dish)}>
                  <AdminImageUploadBadge
                    folder="menu"
                    label="Change Photo"
                    compact
                    title={`Admin: Replace image for ${dish.name}`}
                    onUploaded={async (newUrl) => {
                      await handleUpdateMenuItem(dish.id, { imageUrl: newUrl });
                    }}
                  />
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-95"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a111a] via-transparent to-transparent opacity-80" />

                  {/* Dietary Indicator Badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-[#070d14]/85 backdrop-blur-md rounded-sm border border-[#c5a880]/30 text-[10px] uppercase tracking-wider font-semibold">
                    <span 
                      className={`w-2 h-2 rounded-full ${
                        dish.isVegetarian ? 'bg-emerald-500' : 'bg-amber-600'
                      }`} 
                    />
                    <span className="text-[#ded6cc]">{dish.isVegetarian ? 'Veg' : 'Non-Veg'}</span>
                  </div>

                  {/* Badges: Bestseller / Chef Special */}
                  <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                    {dish.isChefSpecial && (
                      <span className="px-2 py-0.5 bg-[#c5a880] text-[#070d14] text-[10px] font-bold tracking-widest uppercase rounded-sm shadow">
                        Chef's Choice
                      </span>
                    )}
                    {dish.isBestseller && !dish.isChefSpecial && (
                      <span className="px-2 py-0.5 bg-[#182330] text-[#e8c794] border border-[#c5a880]/40 text-[10px] font-bold tracking-widest uppercase rounded-sm">
                        Bestseller
                      </span>
                    )}
                  </div>
                </div>

                {/* Dish Info Body */}
                <div className="p-5 flex flex-col flex-grow">
                  
                  {/* Category & Prep Time */}
                  <div className="flex items-center justify-between text-[11px] text-[#8e8275] mb-2 uppercase tracking-wider font-medium">
                    <span>{dish.category}</span>
                    {dish.prepTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#c5a880]" />
                        <span>{dish.prepTime}</span>
                      </span>
                    )}
                  </div>

                  {/* Dish Name */}
                  <h3 
                    onClick={() => handleOpenModal(dish)}
                    className="font-cinzel text-lg font-bold text-[#f8f5f0] group-hover:text-[#c5a880] transition-colors mb-2 cursor-pointer"
                  >
                    {dish.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#a89b8d] leading-relaxed line-clamp-2 mb-4 font-normal flex-grow">
                    {dish.description}
                  </p>

                  {/* Sommelier Pairing Note */}
                  {dish.pairing && (
                    <div className="flex items-center gap-1.5 text-[11px] text-[#c5a880] mb-4 bg-[#c5a880]/5 px-2.5 py-1.5 rounded-sm border border-[#c5a880]/15">
                      <Wine className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Pairing: {dish.pairing}</span>
                    </div>
                  )}

                  {/* Price & Action Button */}
                  <div className="pt-4 border-t border-[#c5a880]/15 flex items-center justify-between gap-3 mt-auto">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#8e8275] block">Price</span>
                      <span className="font-cinzel text-xl font-bold text-[#f5efeb] tabular-nums">
                        ${dish.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenModal(dish)}
                        className="p-2 border border-[#c5a880]/30 hover:border-[#c5a880] text-[#a89b8d] hover:text-[#f8f5f0] rounded-sm transition-colors"
                        title="View ingredients & customize"
                      >
                        <Info className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleQuickAdd(dish)}
                        className="px-3.5 py-2 bg-[#c5a880] hover:bg-[#b89b74] active:scale-95 text-[#070d14] text-xs font-bold tracking-wider uppercase rounded-sm transition-all duration-150 flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* DISH DETAIL & CUSTOMIZE MODAL */}
      {selectedDishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a111a] border border-[#c5a880]/50 rounded-sm max-w-lg w-full overflow-hidden shadow-2xl relative text-left">
            
            <button
              onClick={() => setSelectedDishModal(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[#070d14]/80 text-[#ded6cc] hover:text-[#c5a880] flex items-center justify-center border border-[#c5a880]/30"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative h-56">
              <AdminImageUploadBadge
                folder="menu"
                label="Replace Photo"
                title={`Admin: Replace photo for ${selectedDishModal.name}`}
                onUploaded={async (newUrl) => {
                  await handleUpdateMenuItem(selectedDishModal.id, { imageUrl: newUrl });
                  setSelectedDishModal((prev) => (prev ? { ...prev, imageUrl: newUrl } : null));
                }}
              />
              <img
                src={selectedDishModal.imageUrl}
                alt={selectedDishModal.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a111a] via-transparent to-transparent" />
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] uppercase tracking-wider text-[#c5a880] font-semibold">
                  {selectedDishModal.category}
                </span>
                <span className="font-cinzel text-xl font-bold text-[#f5efeb] tabular-nums">
                  ${selectedDishModal.price.toFixed(2)}
                </span>
              </div>

              <h3 className="font-cinzel text-xl font-bold text-[#f8f5f0] mb-3">
                {selectedDishModal.name}
              </h3>

              <p className="text-xs text-[#a89b8d] leading-relaxed mb-4">
                {selectedDishModal.description}
              </p>

              {/* Ingredients List */}
              {selectedDishModal.ingredients && selectedDishModal.ingredients.length > 0 && (
                <div className="mb-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1.5">
                    Artisanal Ingredients:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDishModal.ingredients.map((ing, i) => (
                      <span key={i} className="text-[11px] text-[#c5a880] bg-[#c5a880]/10 px-2 py-0.5 rounded-sm border border-[#c5a880]/20">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Wine Pairing */}
              {selectedDishModal.pairing && (
                <div className="mb-4 p-2.5 bg-[#c5a880]/10 border border-[#c5a880]/20 rounded-sm text-xs text-[#ded6cc] flex items-center gap-2">
                  <Wine className="w-4 h-4 text-[#c5a880] shrink-0" />
                  <span><strong>Sommelier Recommendation:</strong> {selectedDishModal.pairing}</span>
                </div>
              )}

              {/* Special Chef Instructions */}
              <div className="mb-5">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1">
                  Special Culinary Notes / Allergies:
                </label>
                <input
                  type="text"
                  value={modalInstructions}
                  onChange={(e) => setModalInstructions(e.target.value)}
                  placeholder="e.g. Medium rare, gluten sensitivity, sauce on side"
                  className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3 py-2 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              {/* Quantity Stepper & Add Button */}
              <div className="flex items-center justify-between gap-4 pt-3 border-t border-[#c5a880]/20">
                <div className="flex items-center border border-[#c5a880]/30 rounded-sm bg-[#070d14]">
                  <button
                    onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                    className="p-2 text-[#a89b8d] hover:text-[#f8f5f0] transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-[#f5efeb] font-mono tabular-nums">
                    {modalQuantity}
                  </span>
                  <button
                    onClick={() => setModalQuantity(modalQuantity + 1)}
                    className="p-2 text-[#a89b8d] hover:text-[#f8f5f0] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleModalAdd}
                  className="flex-1 py-2.5 bg-[#c5a880] hover:bg-[#b89b74] text-[#070d14] font-cinzel text-xs font-bold tracking-widest uppercase rounded-sm transition-all shadow-lg active:scale-95"
                >
                  Add To Order · ${(selectedDishModal.price * modalQuantity).toFixed(2)}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
};
