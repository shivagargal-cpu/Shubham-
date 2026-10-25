import React, { useState } from 'react';
import { Navigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext';
import { 
  User as UserIcon, 
  Calendar, 
  ShoppingBag, 
  Star, 
  LogOut, 
  ShieldCheck, 
  Plus, 
  Clock, 
  MapPin, 
  ChefHat 
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { 
    currentUser, 
    reservations, 
    orders, 
    reviews, 
    handleCancelReservation, 
    handleLogout 
  } = useRestaurant();

  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentTab = (searchParams.get('tab') as 'reservations' | 'orders' | 'reviews') || 'reservations';

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userReservations = reservations.filter(
    (r) => r.userId === currentUser.id || r.guestEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  const userOrders = orders.filter(
    (o) => o.userId === currentUser.id || o.userEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  const userReviews = reviews.filter(
    (rev) => rev.userId === currentUser.id || rev.userName.toLowerCase() === currentUser.name.toLowerCase()
  );

  const setTab = (tab: 'reservations' | 'orders' | 'reviews') => {
    setSearchParams({ tab });
  };

  return (
    <div className="py-12 bg-[#070d14]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* User Identity Header Card */}
        <div className="bg-[#0a111a] border border-[#c5a880]/30 rounded-sm p-6 sm:p-8 shadow-2xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#c5a880]"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#c5a880]/20 text-[#c5a880] flex items-center justify-center text-2xl font-bold font-cinzel border border-[#c5a880]/40">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-cinzel text-2xl font-bold text-[#f5efeb]">
                  {currentUser.name}
                </h1>
                <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-[#c5a880]/20 text-[#c5a880] border border-[#c5a880]/30">
                  {currentUser.role === 'admin' ? 'Executive Chef / Admin' : 'Royal Patron'}
                </span>
              </div>
              <p className="text-xs text-[#a89b8d] mt-1">{currentUser.email}</p>
              {currentUser.phone && (
                <p className="text-[11px] text-[#8e8275]">{currentUser.phone}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser.role === 'admin' && (
              <Link
                to="/admin"
                className="px-4 py-2 bg-[#c5a880]/20 hover:bg-[#c5a880] hover:text-[#070d14] text-[#c5a880] text-xs font-semibold rounded-sm transition-all flex items-center gap-1.5 border border-[#c5a880]/40"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Suite</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#c5a880]/20 mb-6 bg-[#0a111a] px-4 rounded-t-sm">
          <button
            onClick={() => setTab('reservations')}
            className={`py-3.5 px-5 text-xs font-cinzel font-bold tracking-widest uppercase transition-colors relative flex items-center gap-2 cursor-pointer ${
              currentTab === 'reservations' ? 'text-[#c5a880]' : 'text-[#8e8275] hover:text-[#ded6cc]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Table Reservations ({userReservations.length})</span>
            {currentTab === 'reservations' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c5a880]" />
            )}
          </button>

          <button
            onClick={() => setTab('orders')}
            className={`py-3.5 px-5 text-xs font-cinzel font-bold tracking-widest uppercase transition-colors relative flex items-center gap-2 cursor-pointer ${
              currentTab === 'orders' ? 'text-[#c5a880]' : 'text-[#8e8275] hover:text-[#ded6cc]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order History ({userOrders.length})</span>
            {currentTab === 'orders' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c5a880]" />
            )}
          </button>

          <button
            onClick={() => setTab('reviews')}
            className={`py-3.5 px-5 text-xs font-cinzel font-bold tracking-widest uppercase transition-colors relative flex items-center gap-2 cursor-pointer ${
              currentTab === 'reviews' ? 'text-[#c5a880]' : 'text-[#8e8275] hover:text-[#ded6cc]'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>My Reviews ({userReviews.length})</span>
            {currentTab === 'reviews' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c5a880]" />
            )}
          </button>
        </div>

        {/* TAB 1: RESERVATIONS */}
        {currentTab === 'reservations' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-[#f5efeb]">
                  Registered Table Seatings
                </h3>
                <p className="text-xs text-[#8e8275]">
                  Review your upcoming bookings or modify requirements with the maître d’hôtel.
                </p>
              </div>

              <Link
                to="/reservations"
                className="px-4 py-2 bg-[#c5a880] hover:bg-[#b89b74] text-[#070d14] font-cinzel text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5 shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Book New Table</span>
              </Link>
            </div>

            {userReservations.length === 0 ? (
              <div className="text-center py-16 bg-[#0a111a] border border-[#c5a880]/20 rounded-sm">
                <Calendar className="w-10 h-10 text-[#c5a880]/40 mx-auto mb-3" />
                <p className="text-sm text-[#ded6cc] font-medium">No reservations in your portfolio.</p>
                <p className="text-xs text-[#8e8275] mt-1 mb-4">You have not booked any table seatings yet.</p>
                <Link
                  to="/reservations"
                  className="px-5 py-2.5 bg-[#c5a880] text-[#070d14] font-cinzel text-xs font-bold uppercase rounded-sm inline-block"
                >
                  Reserve a Table Now
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userReservations.map((res) => (
                  <div
                    key={res.id}
                    className="p-5 bg-[#0a111a] border border-[#c5a880]/25 rounded-sm flex flex-col justify-between space-y-4 shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-[#c5a880]/15">
                        <span className="font-mono text-sm font-bold text-[#c5a880]">
                          {res.code}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          res.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                          res.status === 'seated' ? 'bg-blue-500/20 text-blue-400' :
                          res.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {res.status}
                        </span>
                      </div>

                      <div className="py-2 space-y-1 text-xs">
                        <p className="text-[#f5efeb] font-semibold text-sm">{res.seatingArea}</p>
                        <p className="text-[#ded6cc]">
                          Date: <strong>{res.date}</strong> at <strong>{res.time}</strong>
                        </p>
                        <p className="text-[#a89b8d]">Party Size: {res.guests} Guests</p>
                        {res.occasion && (
                          <p className="text-[11px] text-[#c5a880]">Occasion: {res.occasion}</p>
                        )}
                        {res.specialRequests && (
                          <p className="text-[11px] text-[#8e8275] italic">"{res.specialRequests}"</p>
                        )}
                      </div>
                    </div>

                    {res.status !== 'cancelled' && (
                      <div className="pt-2 border-t border-[#c5a880]/15 flex justify-end">
                        <button
                          onClick={() => handleCancelReservation(res.id)}
                          className="px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 rounded-sm transition-colors cursor-pointer"
                        >
                          Cancel Reservation
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ORDERS */}
        {currentTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-[#f5efeb]">
                  Culinary Order History
                </h3>
                <p className="text-xs text-[#8e8275]">
                  Track active dining dishes or review previous banquets.
                </p>
              </div>

              <Link
                to="/menu"
                className="px-4 py-2 bg-[#c5a880] hover:bg-[#b89b74] text-[#070d14] font-cinzel text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5 shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Explore Menu</span>
              </Link>
            </div>

            {userOrders.length === 0 ? (
              <div className="text-center py-16 bg-[#0a111a] border border-[#c5a880]/20 rounded-sm">
                <ShoppingBag className="w-10 h-10 text-[#c5a880]/40 mx-auto mb-3" />
                <p className="text-sm text-[#ded6cc] font-medium">No dining orders recorded.</p>
                <p className="text-xs text-[#8e8275] mt-1 mb-4">Treat yourself to our signature A5 Wagyu or Maine Lobster.</p>
                <Link
                  to="/menu"
                  className="px-5 py-2.5 bg-[#c5a880] text-[#070d14] font-cinzel text-xs font-bold uppercase rounded-sm inline-block"
                >
                  Browse Menu & Order
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 bg-[#0a111a] border border-[#c5a880]/25 rounded-sm space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#c5a880]/15">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-[#c5a880]">{ord.id}</span>
                        <span className="text-[10px] uppercase font-bold text-[#8e8275]">
                          ({ord.diningType.replace('_', ' ')})
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ord.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                        ord.status === 'ready' ? 'bg-cyan-500/20 text-cyan-400' :
                        ord.status === 'preparing' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {ord.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between p-2 bg-[#070d14] rounded border border-[#c5a880]/10">
                          <span>{it.quantity}x {it.dish.name}</span>
                          <span className="font-mono tabular-nums text-[#c5a880]">
                            ${(it.dish.price * it.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-[#c5a880]/10 flex items-center justify-between text-xs">
                      <span className="text-[#8e8275]">
                        {new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <div className="font-bold text-[#f5efeb]">
                        <span>Total Paid: </span>
                        <span className="font-mono text-[#c5a880] text-sm tabular-nums">${ord.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REVIEWS */}
        {currentTab === 'reviews' && (
          <div className="space-y-4">
            <h3 className="font-cinzel text-lg font-bold text-[#f5efeb]">
              Your Published Impressions
            </h3>

            {userReviews.length === 0 ? (
              <div className="text-center py-16 bg-[#0a111a] border border-[#c5a880]/20 rounded-sm">
                <Star className="w-10 h-10 text-[#c5a880]/40 mx-auto mb-3" />
                <p className="text-sm text-[#ded6cc] font-medium">No reviews submitted yet.</p>
                <p className="text-xs text-[#8e8275] mt-1">Leave your impressions on the homepage after dining.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userReviews.map((rev) => (
                  <div key={rev.id} className="p-5 bg-[#0a111a] border border-[#c5a880]/20 rounded-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#c5a880] text-[#c5a880]" />
                        ))}
                      </div>
                      <span className="text-[10px] text-[#8e8275]">{rev.visitDate}</span>
                    </div>
                    <h4 className="font-cinzel text-sm font-bold text-[#f5efeb]">"{rev.title}"</h4>
                    <p className="text-xs text-[#a89b8d] leading-relaxed">{rev.comment}</p>
                    {rev.dishRecommended && (
                      <p className="text-[11px] text-[#c5a880] pt-1">
                        Recommended: {rev.dishRecommended}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
