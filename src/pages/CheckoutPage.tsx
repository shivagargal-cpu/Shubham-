import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext';
import { DiningType, PaymentMethod, Order } from '../types';
import { 
  CreditCard, 
  Wallet, 
  Banknote, 
  CheckCircle2, 
  ChefHat, 
  UtensilsCrossed, 
  BellRing, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  ShoppingBag
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, currentUser, handlePlaceOrder } = useRestaurant();
  const location = useLocation();
  const navigate = useNavigate();

  const passedState = location.state as { diningType?: DiningType; discount?: number } | null;
  const diningType = passedState?.diningType || 'dine_in';
  const discount = passedState?.discount || 0;

  const [step, setStep] = useState<'details' | 'payment' | 'tracker'>('details');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Form Details
  const [name, setName] = useState(currentUser?.name || 'Lord Alistair Sterling');
  const [email, setEmail] = useState(currentUser?.email || 'sterling@heritage.co.uk');
  const [phone, setPhone] = useState(currentUser?.phone || '+1 (555) 902-3341');
  const [tableNumber, setTableNumber] = useState('Royal Booth 7');
  const [deliveryAddress, setDeliveryAddress] = useState('740 Park Avenue, Apt 14B, New York, NY');
  
  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  const subtotal = cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const tax = (subtotal - discount) * 0.08;
  const serviceCharge = (subtotal - discount) * 0.05;
  const total = subtotal - discount + tax + serviceCharge;

  if (cart.length === 0 && !placedOrder) {
    return (
      <div className="py-20 text-center bg-[#070d14]">
        <div className="max-w-md mx-auto p-8 bg-[#0a111a] border border-[#c5a880]/20 rounded-sm space-y-4">
          <ShoppingBag className="w-12 h-12 text-[#c5a880] mx-auto" />
          <h2 className="font-cinzel text-xl font-bold text-[#f5efeb]">NO ITEMS TO CHECKOUT</h2>
          <p className="text-xs text-[#8e8275]">Your cart is empty. Please select dishes from our menu.</p>
          <Link
            to="/menu"
            className="px-6 py-2.5 bg-[#c5a880] text-[#070d14] font-cinzel text-xs font-bold uppercase rounded-sm inline-block"
          >
            Explore Menu
          </Link>
        </div>
      </div>
    );
  }

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder = await handlePlaceOrder({
      userId: currentUser?.id || 'guest-' + Date.now(),
      userName: name,
      userEmail: email,
      userPhone: phone,
      items: [...cart],
      subtotal,
      tax: tax + serviceCharge,
      discount,
      total,
      diningType,
      tableNumber: diningType === 'dine_in' ? tableNumber : undefined,
      deliveryAddress: diningType === 'delivery' ? deliveryAddress : undefined,
      paymentMethod
    });

    setPlacedOrder(newOrder);
    setStep('tracker');
  };

  return (
    <div className="py-12 bg-[#070d14] min-h-[85vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="border-b border-[#c5a880]/20 pb-6 mb-8 text-center">
          <span className="text-xs tracking-[0.25em] text-[#c5a880] uppercase font-bold block mb-1">
            ✦ Degustation Settlement ✦
          </span>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#f5efeb] tracking-[0.06em] uppercase">
            ROYALE CHECKOUT
          </h1>
        </div>

        {/* STEP 1: DETAILS */}
        {step === 'details' && (
          <div className="bg-[#0a111a] border border-[#c5a880]/30 rounded-sm p-6 sm:p-10 shadow-2xl">
            <div className="flex items-center gap-2 text-xs tracking-widest text-[#c5a880] uppercase font-bold mb-2">
              <span>Step 1 of 2</span>
              <span>·</span>
              <span>Dining Particulars</span>
            </div>
            <h2 className="font-cinzel text-xl font-bold text-[#f5efeb] mb-6">
              RECIPIENT & LOCATION DETAILS
            </h2>

            <form onSubmit={handleDetailsSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1.5">
                  Guest Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2.5 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1.5">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2.5 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1.5">
                    Concierge Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2.5 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>

              {diningType === 'dine_in' && (
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1.5">
                    Dining Room Table / Salon Booth *
                  </label>
                  <input
                    type="text"
                    required
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="e.g. Royal Booth 7, Terrace Table 3"
                    className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2.5 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              )}

              {diningType === 'delivery' && (
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1.5">
                    White-Glove Delivery Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2.5 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              )}

              <div className="pt-6 border-t border-[#c5a880]/20 flex items-center justify-between">
                <Link
                  to="/cart"
                  className="inline-flex items-center gap-1.5 text-xs text-[#8e8275] hover:text-[#f8f5f0]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Cart</span>
                </Link>

                <button
                  type="submit"
                  className="px-8 py-3 bg-[#c5a880] hover:bg-[#b59870] text-[#070d14] font-cinzel text-xs font-bold tracking-widest uppercase rounded-sm flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Select Payment Method</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: PAYMENT */}
        {step === 'payment' && (
          <div className="bg-[#0a111a] border border-[#c5a880]/30 rounded-sm p-6 sm:p-10 shadow-2xl">
            <div className="flex items-center gap-2 text-xs tracking-widest text-[#c5a880] uppercase font-bold mb-2">
              <span>Step 2 of 2</span>
              <span>·</span>
              <span>Settlement Method</span>
            </div>
            <h2 className="font-cinzel text-xl font-bold text-[#f5efeb] mb-6">
              PAYMENT CONFIGURATION
            </h2>

            {/* Method selection tabs */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 text-center rounded-sm border transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-[#c5a880] bg-[#c5a880]/15 text-[#f8f5f0]'
                    : 'border-[#c5a880]/20 bg-[#070d14] text-[#8e8275]'
                }`}
              >
                <CreditCard className="w-6 h-6 mx-auto mb-1.5 text-[#c5a880]" />
                <span className="text-xs font-semibold block">Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('digital_wallet')}
                className={`p-4 text-center rounded-sm border transition-all cursor-pointer ${
                  paymentMethod === 'digital_wallet'
                    ? 'border-[#c5a880] bg-[#c5a880]/15 text-[#f8f5f0]'
                    : 'border-[#c5a880]/20 bg-[#070d14] text-[#8e8275]'
                }`}
              >
                <Wallet className="w-6 h-6 mx-auto mb-1.5 text-[#c5a880]" />
                <span className="text-xs font-semibold block">Apple / Google</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 text-center rounded-sm border transition-all cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'border-[#c5a880] bg-[#c5a880]/15 text-[#f8f5f0]'
                    : 'border-[#c5a880]/20 bg-[#070d14] text-[#8e8275]'
                }`}
              >
                <Banknote className="w-6 h-6 mx-auto mb-1.5 text-[#c5a880]" />
                <span className="text-xs font-semibold block">Pay at Table</span>
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
              {paymentMethod === 'card' && (
                <div className="p-5 bg-[#070d14] border border-[#c5a880]/30 rounded-sm space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#8e8275] mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-[#0a111a] border border-[#c5a880]/20 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0] font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#8e8275] mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-[#0a111a] border border-[#c5a880]/20 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#8e8275] mb-1">
                        CVV Code
                      </label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-[#0a111a] border border-[#c5a880]/20 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0] font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'digital_wallet' && (
                <div className="p-6 text-center bg-[#070d14] border border-[#c5a880]/30 rounded-sm">
                  <p className="text-sm font-semibold text-[#f8f5f0]">Biometric Token Authorization Ready</p>
                  <p className="text-xs text-[#8e8275] mt-1">
                    Settlement will be routed through your configured device token.
                  </p>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-6 text-center bg-[#070d14] border border-[#c5a880]/30 rounded-sm">
                  <p className="text-sm font-semibold text-[#f8f5f0]">Concierge Post-Dining Presentation</p>
                  <p className="text-xs text-[#8e8275] mt-1">
                    Our maître d’hôtel will present the ceremonial leather folio at your table.
                  </p>
                </div>
              )}

              <div className="pt-6 border-t border-[#c5a880]/20 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="text-xs text-[#8e8275] hover:text-[#f8f5f0] cursor-pointer"
                >
                  ← Back to Details
                </button>

                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-[#d4af37] via-[#c5a880] to-[#b39369] text-[#070d14] font-cinzel text-xs font-bold tracking-widest uppercase rounded-sm shadow-xl active:scale-95 transition-all cursor-pointer"
                >
                  Authorize Settlement · ${total.toFixed(2)}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: LIVE TRACKER */}
        {step === 'tracker' && placedOrder && (
          <div className="bg-[#0a111a] border border-[#c5a880] rounded-sm p-8 sm:p-12 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#c5a880]/20 text-[#c5a880] flex items-center justify-center mx-auto border border-[#c5a880]">
              <Sparkles className="w-8 h-8" />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#c5a880] font-bold">
                Order In Kitchen Pipeline
              </p>
              <h2 className="font-cinzel text-3xl font-bold text-[#f5efeb] mt-1">
                {placedOrder.id}
              </h2>
              <p className="text-xs text-[#8e8275] mt-1">
                Estimated preparation: <span className="text-[#c5a880] font-bold">{placedOrder.estimatedDelivery}</span>
              </p>
            </div>

            {/* Pipeline progress milestone */}
            <div className="py-6 border-y border-[#c5a880]/20 my-6">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#c5a880] text-[#070d14] flex items-center justify-center font-bold text-sm mb-1.5 shadow">
                    ✓
                  </div>
                  <span className="text-[11px] font-bold text-[#f5efeb]">Received</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#c5a880]/30 border-2 border-[#c5a880] text-[#c5a880] flex items-center justify-center font-bold text-sm mb-1.5 animate-pulse">
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-[#c5a880]">In Kitchen</span>
                </div>

                <div className="flex flex-col items-center opacity-40">
                  <div className="w-10 h-10 rounded-full bg-[#070d14] border border-[#8e8275] text-[#8e8275] flex items-center justify-center font-bold text-sm mb-1.5">
                    <UtensilsCrossed className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] text-[#8e8275]">Plated Ready</span>
                </div>

                <div className="flex flex-col items-center opacity-40">
                  <div className="w-10 h-10 rounded-full bg-[#070d14] border border-[#8e8275] text-[#8e8275] flex items-center justify-center font-bold text-sm mb-1.5">
                    <BellRing className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] text-[#8e8275]">Served</span>
                </div>
              </div>
            </div>

            {/* Summary List */}
            <div className="max-w-md mx-auto text-left bg-[#070d14] p-4 rounded-sm border border-[#c5a880]/20 space-y-1.5 text-xs">
              {placedOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-[#a89b8d]">
                  <span>{it.quantity}x {it.dish.name}</span>
                  <span className="font-mono text-[#ded6cc]">${(it.dish.price * it.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-[#c5a880]/20 flex justify-between font-bold text-[#f8f5f0]">
                <span>Total Amount</span>
                <span className="font-mono text-[#c5a880] text-sm">${placedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-center gap-4">
              <Link
                to="/account?tab=orders"
                className="px-6 py-3 bg-[#c5a880] hover:bg-[#b89b74] text-[#070d14] font-cinzel text-xs font-bold uppercase tracking-widest rounded-sm shadow"
              >
                View in Order History
              </Link>
              <Link
                to="/menu"
                className="px-6 py-3 border border-[#c5a880]/40 text-[#c5a880] hover:text-[#f8f5f0] font-cinzel text-xs font-bold uppercase tracking-widest rounded-sm"
              >
                Back to Menu
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
