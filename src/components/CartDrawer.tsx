import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Tag, 
  Utensils 
} from 'lucide-react';
import { CartItem, DiningType } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (dishId: string, quantity: number) => void;
  onRemoveItem: (dishId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: (diningType: DiningType, promoDiscount: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout
}) => {
  const [diningType, setDiningType] = useState<DiningType>('dine_in');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

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
      setPromoError('Invalid code. Try "ROYALE20" for 20% off.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0a111a] border-l border-[#c5a880]/30 shadow-2xl flex flex-col text-[#ded6cc]">
          
          {/* Header */}
          <div className="p-6 border-b border-[#c5a880]/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#c5a880]" />
              <h3 className="font-cinzel text-lg font-bold text-[#f8f5f0] uppercase tracking-wider">
                Your Royal Order
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#8e8275] hover:text-[#f8f5f0] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dining Type Segmented Selector */}
          <div className="p-4 bg-[#070d14] border-b border-[#c5a880]/15">
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#8e8275] mb-2">
              Select Dining Mode:
            </p>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#0a111a] rounded-sm border border-[#c5a880]/20 text-xs">
              <button
                onClick={() => setDiningType('dine_in')}
                className={`py-1.5 font-medium rounded-sm transition-all ${
                  diningType === 'dine_in'
                    ? 'bg-[#c5a880] text-[#070d14] font-bold shadow'
                    : 'text-[#8e8275] hover:text-[#ded6cc]'
                }`}
              >
                Dine-In
              </button>
              <button
                onClick={() => setDiningType('pickup')}
                className={`py-1.5 font-medium rounded-sm transition-all ${
                  diningType === 'pickup'
                    ? 'bg-[#c5a880] text-[#070d14] font-bold shadow'
                    : 'text-[#8e8275] hover:text-[#ded6cc]'
                }`}
              >
                VIP Pickup
              </button>
              <button
                onClick={() => setDiningType('delivery')}
                className={`py-1.5 font-medium rounded-sm transition-all ${
                  diningType === 'delivery'
                    ? 'bg-[#c5a880] text-[#070d14] font-bold shadow'
                    : 'text-[#8e8275] hover:text-[#ded6cc]'
                }`}
              >
                White Glove
              </button>
            </div>
          </div>

          {/* Itemized List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#c5a880]/10 border border-[#c5a880]/20 text-[#c5a880] flex items-center justify-center">
                  <Utensils className="w-7 h-7" />
                </div>
                <h4 className="font-cinzel text-base font-bold text-[#f5efeb]">Your Order is Empty</h4>
                <p className="text-xs text-[#8e8275] max-w-xs leading-relaxed">
                  Explore our artisanal starters, slow-cooked mains, and handcrafted sweets to begin.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.dish.id}
                  className="p-3 bg-[#070d14] border border-[#c5a880]/20 rounded-sm flex gap-3 group"
                >
                  <img
                    src={item.dish.imageUrl}
                    alt={item.dish.name}
                    className="w-16 h-16 rounded-sm object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-cinzel text-xs font-bold text-[#f8f5f0] truncate">
                        {item.dish.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.dish.id)}
                        className="text-[#665e55] hover:text-rose-400 p-0.5 transition-colors"
                        title="Remove dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.specialInstructions && (
                      <p className="text-[10px] text-[#c5a880] italic truncate">
                        Note: {item.specialInstructions}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-bold font-mono text-[#ded6cc] tabular-nums">
                        ${(item.dish.price * item.quantity).toFixed(2)}
                      </span>

                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#c5a880]/30 rounded-sm bg-[#0a111a]">
                        <button
                          onClick={() => onUpdateQuantity(item.dish.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-[#8e8275] hover:text-[#f8f5f0]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold font-mono text-[#ded6cc] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.dish.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-[#8e8275] hover:text-[#f8f5f0]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Breakdown */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#070d14] border-t border-[#c5a880]/20 space-y-4">
              
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-[#8e8275] absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo code (e.g. ROYALE20)"
                      className="w-full bg-[#0a111a] border border-[#c5a880]/25 rounded-sm pl-8 pr-3 py-1.5 text-xs text-[#f8f5f0] uppercase tracking-wider focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#c5a880]/20 border border-[#c5a880]/40 hover:bg-[#c5a880] hover:text-[#070d14] text-[#c5a880] text-xs font-bold rounded-sm transition-all"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-[10px] text-emerald-400 font-medium">
                    ✓ Promo ROYALE20 applied! (20% Off)
                  </p>
                )}
                {promoError && (
                  <p className="text-[10px] text-rose-400 font-medium">{promoError}</p>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs pt-1 border-t border-[#c5a880]/10">
                <div className="flex justify-between text-[#8e8275]">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-[#ded6cc]">${subtotal.toFixed(2)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Royal Privilege (20%)</span>
                    <span className="font-mono tabular-nums">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#8e8275]">
                  <span>Hospitality Service (5%)</span>
                  <span className="font-mono tabular-nums text-[#ded6cc]">${serviceCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#8e8275]">
                  <span>Metropolitan Tax (8%)</span>
                  <span className="font-mono tabular-nums text-[#ded6cc]">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#c5a880]/20 text-sm font-bold text-[#f5efeb]">
                  <span className="font-cinzel">Total Amount</span>
                  <span className="font-cinzel text-lg text-[#c5a880] font-mono tabular-nums">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => onProceedToCheckout(diningType, discount)}
                className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] via-[#c5a880] to-[#b39369] text-[#070d14] font-cinzel text-xs font-bold tracking-[0.2em] uppercase rounded-sm flex items-center justify-center gap-2 shadow-xl hover:brightness-110 active:scale-95 transition-all"
              >
                <span>Proceed to Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
