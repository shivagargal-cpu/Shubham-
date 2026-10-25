import React, { useState } from 'react';
import { 
  X, 
  User as UserIcon, 
  Calendar, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Clock, 
  ChefHat, 
  Trash2, 
  LogOut 
} from 'lucide-react';
import { User, Reservation, Order, Review } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  reservations: Reservation[];
  orders: Order[];
  reviews: Review[];
  initialTab?: 'reservations' | 'orders' | 'reviews';
  onCancelReservation: (resId: string) => void;
  onOpenAdmin?: () => void;
  onLogout: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  reservations,
  orders,
  reviews,
  initialTab = 'reservations',
  onCancelReservation,
  onOpenAdmin,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'reservations' | 'orders' | 'reviews'>(initialTab);

  if (!isOpen) return null;

  // Filter reservations and orders for current user
  const userReservations = reservations.filter(
    (r) => r.userId === currentUser.id || r.guestEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  const userOrders = orders.filter(
    (o) => o.userId === currentUser.id || o.userEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  const userReviews = reviews.filter(
    (rev) => rev.userId === currentUser.id || rev.userName.toLowerCase() === currentUser.name.toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0a111a] border border-[#c5a880]/40 rounded-sm max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-[#ded6cc] max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8e8275] hover:text-[#f8f5f0]"
          aria-label="Close profile"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Identity Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#c5a880]/20 gap-4">
          <div className="flex items-center gap-4">
            {currentUser.avatarUrl ? (
              <img 
                src={currentUser.avatarUrl} 
                alt={currentUser.name} 
                className="w-14 h-14 rounded-full object-cover border border-[#c5a880]/50" 
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#c5a880]/20 text-[#c5a880] flex items-center justify-center text-xl font-bold font-cinzel border border-[#c5a880]/40">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-xl font-bold text-[#f5efeb]">
                  {currentUser.name}
                </h3>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-[#c5a880]/20 text-[#c5a880]">
                  {currentUser.role === 'admin' ? 'Executive Chef / Admin' : 'Royal Patron'}
                </span>
              </div>
              <p className="text-xs text-[#8e8275] mt-0.5">{currentUser.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser.role === 'admin' && onOpenAdmin && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAdmin();
                }}
                className="px-3.5 py-1.5 bg-[#c5a880]/20 hover:bg-[#c5a880] hover:text-[#070d14] text-[#c5a880] text-xs font-semibold rounded-sm transition-all flex items-center gap-1.5 border border-[#c5a880]/40"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Suite</span>
              </button>
            )}
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="p-2 text-[#8e8275] hover:text-rose-400 border border-[#c5a880]/20 rounded-sm hover:border-rose-400/40 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#c5a880]/20 pt-4">
          <button
            onClick={() => setActiveTab('reservations')}
            className={`pb-3 px-4 text-xs font-cinzel font-bold tracking-widest uppercase transition-colors relative flex items-center gap-2 ${
              activeTab === 'reservations' ? 'text-[#c5a880]' : 'text-[#8e8275] hover:text-[#ded6cc]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Reservations ({userReservations.length})</span>
            {activeTab === 'reservations' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c5a880]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-4 text-xs font-cinzel font-bold tracking-widest uppercase transition-colors relative flex items-center gap-2 ${
              activeTab === 'orders' ? 'text-[#c5a880]' : 'text-[#8e8275] hover:text-[#ded6cc]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders ({userOrders.length})</span>
            {activeTab === 'orders' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c5a880]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 px-4 text-xs font-cinzel font-bold tracking-widest uppercase transition-colors relative flex items-center gap-2 ${
              activeTab === 'reviews' ? 'text-[#c5a880]' : 'text-[#8e8275] hover:text-[#ded6cc]'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Reviews ({userReviews.length})</span>
            {activeTab === 'reviews' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c5a880]" />
            )}
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          
          {/* TAB 1: RESERVATIONS */}
          {activeTab === 'reservations' && (
            <div className="space-y-3">
              {userReservations.length === 0 ? (
                <div className="text-center py-12 text-[#8e8275]">
                  <p className="text-sm">No table reservations recorded yet.</p>
                  <p className="text-xs text-[#665e55] mt-1">Book an evening in the reservation salon below.</p>
                </div>
              ) : (
                userReservations.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 bg-[#070d14] border border-[#c5a880]/20 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-[#c5a880] tracking-wider">
                          {res.code}
                        </span>
                        <span className="text-xs text-[#8e8275]">·</span>
                        <span className="font-semibold text-xs text-[#f5efeb]">
                          {res.seatingArea}
                        </span>
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                          res.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                          res.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                          res.status === 'seated' ? 'bg-blue-500/20 text-blue-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {res.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#a89b8d]">
                        Date: <strong className="text-[#ded6cc]">{res.date}</strong> at <strong className="text-[#ded6cc]">{res.time}</strong> ({res.guests} Guests)
                      </p>
                      {res.specialRequests && (
                        <p className="text-[11px] text-[#8e8275] italic mt-0.5">
                          Request: "{res.specialRequests}"
                        </p>
                      )}
                    </div>

                    {res.status !== 'cancelled' && (
                      <button
                        onClick={() => onCancelReservation(res.id)}
                        className="self-start sm:self-auto px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 rounded-sm transition-colors"
                      >
                        Cancel Reservation
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {userOrders.length === 0 ? (
                <div className="text-center py-12 text-[#8e8275]">
                  <p className="text-sm">No dining orders recorded.</p>
                </div>
              ) : (
                userOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 bg-[#070d14] border border-[#c5a880]/20 rounded-sm space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#c5a880]/15">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#c5a880]">{ord.id}</span>
                        <span className="text-[10px] text-[#8e8275] uppercase tracking-wider">
                          ({ord.diningType.replace('_', ' ')})
                        </span>
                      </div>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        ord.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                        ord.status === 'ready' ? 'bg-cyan-500/20 text-cyan-400' :
                        ord.status === 'preparing' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {ord.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-[#a89b8d]">
                          <span>{item.quantity}x {item.dish.name}</span>
                          <span className="font-mono tabular-nums text-[#ded6cc]">
                            ${(item.dish.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-[#c5a880]/10 flex items-center justify-between text-xs">
                      <span className="text-[#8e8275]">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                      <div className="font-bold text-[#f5efeb]">
                        <span>Total: </span>
                        <span className="font-mono text-[#c5a880] tabular-nums">${ord.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-3">
              {userReviews.length === 0 ? (
                <div className="text-center py-12 text-[#8e8275]">
                  <p className="text-sm">You haven't left any public reviews yet.</p>
                </div>
              ) : (
                userReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 bg-[#070d14] border border-[#c5a880]/20 rounded-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#c5a880] text-[#c5a880]" />
                        ))}
                      </div>
                      <span className="text-[10px] text-[#8e8275]">{rev.visitDate}</span>
                    </div>
                    <h4 className="font-cinzel text-sm font-bold text-[#f5efeb] mb-1">
                      {rev.title}
                    </h4>
                    <p className="text-xs text-[#a89b8d] leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
