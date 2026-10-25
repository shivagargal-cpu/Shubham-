import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext';
import { DiningType } from '../types';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  ArrowRight, 
  Utensils, 
  ChevronLeft 
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cart, handleUpdateQuantity, handleRemoveItem, handleClearCart } = useRestaurant();
  const navigate = useNavigate();

  const [diningType, setDiningType] = useState<DiningType>('dine_in');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const discountRate = promoApplied ? 0.20 : 0;
  const discount = subtotal * discountRate;
  const tax = (subtotal - discount) * 0.08;
  const serviceCharge = (subtotal - discount) * 0.05;
  const total = subtotal - discount + tax + serviceCharge;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'ROYALE20') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try "ROYALE20" for 20% privilege.');
    }
  };

  const handleProceed = () => {
    navigate('/checkout', {
      state: {
        diningType,
        discount,
        promoCode: promoApplied ? 'ROYALE20' : ''
      }
    });
  };

  return (
    <div className="py-12 bg-[#070d14] min-h-[85vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="border-b border-[#c5a880]/20 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs tracking-[0.25em] text-[#c5a880] uppercase font-bold block mb-1">
              ✦ Degustation Order ✦
            </span>
            <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#f5efeb] tracking-[0.06em] uppercase">
              YOUR SHOPPING CART
            </h1>
          </div>

          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-xs text-[#c5a880] hover:text-[#f8f5f0] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Continue Exploring Menu</span>
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-[#0a111a] border border-[#c5a880]/20 rounded-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#c5a880]/15 border border-[#c5a880]/30 text-[#c5a880] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-cinzel text-xl font-bold text-[#f5efeb]">YOUR CART IS CURRENTLY EMPTY</h3>
            <p className="text-xs text-[#8e8275] max-w-sm mx-auto">
              You haven't selected any culinary dishes yet. Explore our artisanal mains, starters, and cellared wines.
            </p>
            <div className="pt-2">
              <Link
                to="/menu"
                className="px-6 py-3 bg-[#c5a880] hover:bg-[#b89b74] text-[#070d14] font-cinzel text-xs font-bold uppercase tracking-widest rounded-sm inline-flex items-center gap-2 shadow"
              >
                <span>Browse Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT 8 COLS: CART ITEMS */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Dining Mode Selector Bar */}
              <div className="p-4 bg-[#0a111a] border border-[#c5a880]/25 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#ded6cc]">
                  Dining Experience:
                </span>
                <div className="grid grid-cols-3 gap-2 p-1 bg-[#070d14] rounded-sm border border-[#c5a880]/20 text-xs">
                  <button
                    onClick={() => setDiningType('dine_in')}
                    className={`py-1.5 px-3 font-medium rounded-sm transition-all cursor-pointer ${
                      diningType === 'dine_in'
                        ? 'bg-[#c5a880] text-[#070d14] font-bold shadow'
                        : 'text-[#8e8275] hover:text-[#ded6cc]'
                    }`}
                  >
                    Dine-In
                  </button>
                  <button
                    onClick={() => setDiningType('pickup')}
                    className={`py-1.5 px-3 font-medium rounded-sm transition-all cursor-pointer ${
                      diningType === 'pickup'
                        ? 'bg-[#c5a880] text-[#070d14] font-bold shadow'
                        : 'text-[#8e8275] hover:text-[#ded6cc]'
                    }`}
                  >
                    VIP Pickup
                  </button>
                  <button
                    onClick={() => setDiningType('delivery')}
                    className={`py-1.5 px-3 font-medium rounded-sm transition-all cursor-pointer ${
                      diningType === 'delivery'
                        ? 'bg-[#c5a880] text-[#070d14] font-bold shadow'
                        : 'text-[#8e8275] hover:text-[#ded6cc]'
                    }`}
                  >
                    White-Glove
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-[#0a111a] border border-[#c5a880]/20 rounded-sm divide-y divide-[#c5a880]/15">
                {cart.map((item) => (
                  <div key={item.dish.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 group">
                    <img
                      src={item.dish.imageUrl}
                      alt={item.dish.name}
                      className="w-20 h-20 rounded-sm object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#c5a880]">
                            {item.dish.category}
                          </span>
                          <h4 className="font-cinzel text-base font-bold text-[#f8f5f0]">
                            {item.dish.name}
                          </h4>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.dish.id)}
                          className="text-[#665e55] hover:text-rose-400 p-1 transition-colors cursor-pointer"
                          title="Remove dish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.specialInstructions && (
                        <p className="text-[11px] text-[#c5a880] italic mt-1">
                          Chef note: "{item.specialInstructions}"
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-[#c5a880]/30 rounded-sm bg-[#070d14]">
                          <button
                            onClick={() => handleUpdateQuantity(item.dish.id, item.quantity - 1)}
                            className="px-2.5 py-1 text-[#8e8275] hover:text-[#f8f5f0] cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold font-mono text-[#ded6cc] tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.dish.id, item.quantity + 1)}
                            className="px-2.5 py-1 text-[#8e8275] hover:text-[#f8f5f0] cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-cinzel text-lg font-bold text-[#f5efeb] font-mono tabular-nums">
                          ${(item.dish.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleClearCart}
                  className="text-xs text-[#8e8275] hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Entire Cart</span>
                </button>
              </div>

            </div>

            {/* RIGHT 4 COLS: ORDER SUMMARY */}
            <div className="lg:col-span-4 bg-[#0a111a] border border-[#c5a880]/30 p-6 rounded-sm space-y-6 shadow-xl">
              <h3 className="font-cinzel text-base font-bold text-[#f5efeb] uppercase tracking-wider pb-3 border-b border-[#c5a880]/20">
                Order Financial Ledger
              </h3>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="space-y-1.5">
                <label className="text-[11px] uppercase font-bold text-[#8e8275] tracking-wider block">
                  Privilege Promo Voucher
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-[#8e8275] absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="e.g. ROYALE20"
                      className="w-full bg-[#070d14] border border-[#c5a880]/25 rounded-sm pl-8 pr-3 py-2 text-xs text-[#f8f5f0] uppercase tracking-wider focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-[#c5a880]/20 border border-[#c5a880]/40 hover:bg-[#c5a880] hover:text-[#070d14] text-[#c5a880] text-xs font-bold rounded-sm transition-all cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-[11px] text-emerald-400 font-medium">
                    ✓ Promo ROYALE20 Applied (20% Off)
                  </p>
                )}
                {promoError && (
                  <p className="text-[11px] text-rose-400 font-medium">{promoError}</p>
                )}
              </form>

              {/* Cost Breakdown */}
              <div className="space-y-2 text-xs pt-2 border-t border-[#c5a880]/15">
                <div className="flex justify-between text-[#8e8275]">
                  <span>Items Subtotal</span>
                  <span className="font-mono text-[#ded6cc] tabular-nums">${subtotal.toFixed(2)}</span>
                </div>

                {promoApplied && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Royal Privilege (20%)</span>
                    <span className="font-mono tabular-nums">-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#8e8275]">
                  <span>Hospitality Service (5%)</span>
                  <span className="font-mono text-[#ded6cc] tabular-nums">${serviceCharge.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-[#8e8275]">
                  <span>Metropolitan Culinary Tax (8%)</span>
                  <span className="font-mono text-[#ded6cc] tabular-nums">${tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between pt-3 border-t border-[#c5a880]/20 text-sm font-bold text-[#f5efeb]">
                  <span className="font-cinzel">Total Settlement</span>
                  <span className="font-cinzel text-xl text-[#c5a880] font-mono tabular-nums">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceed}
                className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] via-[#c5a880] to-[#b39369] text-[#070d14] font-cinzel text-xs font-bold tracking-[0.2em] uppercase rounded-sm flex items-center justify-center gap-2 shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
