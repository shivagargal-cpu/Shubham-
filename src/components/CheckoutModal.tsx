import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Wallet, 
  Banknote, 
  CheckCircle2, 
  UtensilsCrossed, 
  ChefHat, 
  BellRing, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CartItem, DiningType, PaymentMethod, Order, User } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  diningType: DiningType;
  discount: number;
  currentUser: User | null;
  onPlaceOrder: (orderData: {
    userId: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    items: CartItem[];
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    diningType: DiningType;
    tableNumber?: string;
    deliveryAddress?: string;
    paymentMethod: PaymentMethod;
  }) => Order;
  onViewOrders: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  diningType,
  discount,
  currentUser,
  onPlaceOrder,
  onViewOrders
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'tracker'>('details');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Form Details
  const [name, setName] = useState(currentUser?.name || 'Lord Alistair Sterling');
  const [email, setEmail] = useState(currentUser?.email || 'sterling@heritage.co.uk');
  const [phone, setPhone] = useState(currentUser?.phone || '+1 (555) 902-3341');
  const [tableNumber, setTableNumber] = useState('Royal Booth 7');
  const [deliveryAddress, setDeliveryAddress] = useState('740 Park Avenue, Apt 14B, New York, NY');
  
  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const tax = (subtotal - discount) * 0.08;
  const serviceCharge = (subtotal - discount) * 0.05;
  const total = subtotal - discount + tax + serviceCharge;

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder = onPlaceOrder({
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0a111a] border border-[#c5a880]/50 rounded-sm max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-[#ded6cc]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8e8275] hover:text-[#f8f5f0]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: DETAILS */}
        {step === 'details' && (
          <div>
            <div className="flex items-center gap-2 text-xs tracking-widest text-[#c5a880] uppercase font-bold mb-1">
              <span>Step 1 of 2</span>
              <span>·</span>
              <span>Dining Particulars</span>
            </div>
            <h3 className="font-cinzel text-xl font-bold text-[#f5efeb] mb-6">
              ORDER SPECIFICATIONS
            </h3>

            <form onSubmit={handleDetailsSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>

              {diningType === 'dine_in' && (
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1">
                    Table / Salon Booth Identifier *
                  </label>
                  <input
                    type="text"
                    required
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="e.g. Table 12, Booth 4, Terrace 2"
                    className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              )}

              {diningType === 'delivery' && (
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1">
                    White-Glove Delivery Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              )}

              <div className="pt-4 flex items-center justify-between border-t border-[#c5a880]/20">
                <span className="font-cinzel text-sm font-bold text-[#c5a880]">
                  Total: ${total.toFixed(2)}
                </span>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#c5a880] hover:bg-[#b59870] text-[#070d14] font-cinzel text-xs font-bold tracking-widest uppercase rounded-sm flex items-center gap-1.5"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: PAYMENT */}
        {step === 'payment' && (
          <div>
            <div className="flex items-center gap-2 text-xs tracking-widest text-[#c5a880] uppercase font-bold mb-1">
              <span>Step 2 of 2</span>
              <span>·</span>
              <span>Settlement</span>
            </div>
            <h3 className="font-cinzel text-xl font-bold text-[#f5efeb] mb-6">
              SELECT PAYMENT METHOD
            </h3>

            {/* Payment method tabs */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 text-center rounded-sm border transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[#c5a880] bg-[#c5a880]/15 text-[#f8f5f0]'
                    : 'border-[#c5a880]/20 bg-[#070d14] text-[#8e8275]'
                }`}
              >
                <CreditCard className="w-5 h-5 mx-auto mb-1 text-[#c5a880]" />
                <span className="text-[11px] font-semibold block">Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('digital_wallet')}
                className={`p-3 text-center rounded-sm border transition-all ${
                  paymentMethod === 'digital_wallet'
                    ? 'border-[#c5a880] bg-[#c5a880]/15 text-[#f8f5f0]'
                    : 'border-[#c5a880]/20 bg-[#070d14] text-[#8e8275]'
                }`}
              >
                <Wallet className="w-5 h-5 mx-auto mb-1 text-[#c5a880]" />
                <span className="text-[11px] font-semibold block">Apple / Google</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 text-center rounded-sm border transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#c5a880] bg-[#c5a880]/15 text-[#f8f5f0]'
                    : 'border-[#c5a880]/20 bg-[#070d14] text-[#8e8275]'
                }`}
              >
                <Banknote className="w-5 h-5 mx-auto mb-1 text-[#c5a880]" />
                <span className="text-[11px] font-semibold block">Pay at Table</span>
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
              {paymentMethod === 'card' && (
                <div className="p-4 bg-[#070d14] border border-[#c5a880]/30 rounded-sm space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#8e8275] mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-[#0a111a] border border-[#c5a880]/20 rounded-sm px-3 py-1.5 text-xs text-[#f8f5f0] font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#8e8275] mb-1">
                        Expiry
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-[#0a111a] border border-[#c5a880]/20 rounded-sm px-3 py-1.5 text-xs text-[#f8f5f0] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#8e8275] mb-1">
                        Security CVV
                      </label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-[#0a111a] border border-[#c5a880]/20 rounded-sm px-3 py-1.5 text-xs text-[#f8f5f0] font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'digital_wallet' && (
                <div className="p-5 text-center bg-[#070d14] border border-[#c5a880]/30 rounded-sm">
                  <p className="text-xs text-[#ded6cc] mb-1 font-semibold">Biometric Pay Ready</p>
                  <p className="text-[11px] text-[#8e8275]">
                    Clicking Authorize will prompt your device's biometric authentication token.
                  </p>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-5 text-center bg-[#070d14] border border-[#c5a880]/30 rounded-sm">
                  <p className="text-xs text-[#ded6cc] mb-1 font-semibold">Concierge Post-Service Settlement</p>
                  <p className="text-[11px] text-[#8e8275]">
                    Our maître d’hôtel will present the ceremonial leather folio at your table or upon delivery.
                  </p>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between border-t border-[#c5a880]/20">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="text-xs text-[#8e8275] hover:text-[#f8f5f0]"
                >
                  ← Back to Details
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#d4af37] via-[#c5a880] to-[#b39369] text-[#070d14] font-cinzel text-xs font-bold tracking-widest uppercase rounded-sm shadow-xl active:scale-95 transition-all"
                >
                  Authorize ${total.toFixed(2)}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: LIVE ORDER TRACKER */}
        {step === 'tracker' && placedOrder && (
          <div className="text-center py-2">
            <div className="w-14 h-14 rounded-full bg-[#c5a880]/20 text-[#c5a880] flex items-center justify-center mx-auto mb-4 border border-[#c5a880]">
              <Sparkles className="w-7 h-7" />
            </div>

            <p className="text-[10px] uppercase tracking-[0.25em] text-[#c5a880] font-bold">
              Order Dispatched To Kitchen
            </p>
            <h3 className="font-cinzel text-2xl font-bold text-[#f5efeb] mb-1">
              {placedOrder.id}
            </h3>
            <p className="text-xs text-[#8e8275] mb-6">
              Estimated preparation: <span className="text-[#c5a880] font-semibold">{placedOrder.estimatedDelivery}</span>
            </p>

            {/* Live Status Pipeline */}
            <div className="relative py-4 my-4 border-y border-[#c5a880]/20">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#c5a880] text-[#070d14] flex items-center justify-center font-bold text-xs mb-1 shadow">
                    ✓
                  </div>
                  <span className="text-[10px] font-bold text-[#f5efeb]">Received</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#c5a880]/30 border border-[#c5a880] text-[#c5a880] flex items-center justify-center font-bold text-xs mb-1 animate-pulse">
                    <ChefHat className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-[#c5a880]">In Kitchen</span>
                </div>

                <div className="flex flex-col items-center opacity-40">
                  <div className="w-8 h-8 rounded-full bg-[#070d14] border border-[#8e8275] text-[#8e8275] flex items-center justify-center font-bold text-xs mb-1">
                    <UtensilsCrossed className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-[#8e8275]">Plated</span>
                </div>

                <div className="flex flex-col items-center opacity-40">
                  <div className="w-8 h-8 rounded-full bg-[#070d14] border border-[#8e8275] text-[#8e8275] flex items-center justify-center font-bold text-xs mb-1">
                    <BellRing className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-[#8e8275]">Served</span>
                </div>
              </div>
            </div>

            {/* Summary List */}
            <div className="text-left bg-[#070d14] p-3 rounded-sm border border-[#c5a880]/15 my-4 space-y-1 text-xs">
              {placedOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-[#a89b8d]">
                  <span>{it.quantity}x {it.dish.name}</span>
                  <span className="font-mono tabular-nums text-[#ded6cc]">
                    ${(it.dish.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t border-[#c5a880]/20 flex justify-between font-bold text-[#f8f5f0]">
                <span>Total Amount</span>
                <span className="font-mono text-[#c5a880]">${placedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-[#c5a880] hover:bg-[#b89b74] text-[#070d14] font-cinzel text-xs font-bold tracking-widest uppercase rounded-sm transition-all"
              >
                Done
              </button>
              <button
                onClick={() => {
                  onClose();
                  onViewOrders();
                }}
                className="px-5 py-2.5 border border-[#c5a880]/40 text-[#c5a880] hover:text-[#f8f5f0] font-cinzel text-xs font-semibold tracking-widest uppercase rounded-sm transition-all"
              >
                Track in Profile
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
