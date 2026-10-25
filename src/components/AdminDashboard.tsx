import React, { useState } from 'react';
import { 
  X, 
  LayoutDashboard, 
  Utensils, 
  Calendar, 
  ShoppingBag, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Check, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  ChefHat, 
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { MenuItem, Reservation, Order, Review, MenuCategory } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  reservations: Reservation[];
  orders: Order[];
  reviews: Review[];
  onAddMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  onUpdateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  onDeleteMenuItem: (id: string) => void;
  onUpdateReservationStatus: (id: string, status: Reservation['status']) => void;
  onUpdateOrderStatus: (id: string, status: Order['status']) => void;
  onUpdateReviewStatus: (id: string, status: Review['status'], isFeatured?: boolean) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  menuItems,
  reservations,
  orders,
  reviews,
  onAddMenuItem,
  onUpdateMenuItem,
  onDeleteMenuItem,
  onUpdateReservationStatus,
  onUpdateOrderStatus,
  onUpdateReviewStatus
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'reservations' | 'orders' | 'reviews'>('overview');
  
  // Add dish form state
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState<MenuCategory>('Main Course');
  const [newDishPrice, setNewDishPrice] = useState('45');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishImage, setNewDishImage] = useState('/src/assets/images/food_wagyu_steak_1792868333122.jpg');
  const [newDishIsVeg, setNewDishIsVeg] = useState(false);
  const [newDishIsSpecial, setNewDishIsSpecial] = useState(false);

  if (!isOpen) return null;

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const activeOrdersCount = orders.filter((o) => o.status === 'received' || o.status === 'preparing').length;
  const activeReservationsCount = reservations.filter((r) => r.status === 'confirmed' || r.status === 'pending').length;

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim() || !newDishPrice) return;

    onAddMenuItem({
      name: newDishName.trim(),
      category: newDishCategory,
      description: newDishDesc.trim() || 'A signature culinary masterpiece crafted with finest ingredients.',
      price: parseFloat(newDishPrice) || 30,
      imageUrl: newDishImage,
      isVegetarian: newDishIsVeg,
      isChefSpecial: newDishIsSpecial,
      available: true
    });

    setShowAddDishModal(false);
    setNewDishName('');
    setNewDishDesc('');
    setNewDishPrice('45');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0a111a] border border-[#c5a880]/50 rounded-sm max-w-6xl w-full h-[92vh] shadow-2xl flex flex-col text-[#ded6cc] overflow-hidden">
        
        {/* Top Bar Header */}
        <div className="p-5 border-b border-[#c5a880]/20 flex items-center justify-between bg-[#070d14]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#c5a880]/20 border border-[#c5a880] flex items-center justify-center text-[#c5a880]">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg font-bold text-[#f5efeb] uppercase tracking-wider">
                BROSO EXECUTIVE ADMIN SUITE
              </h2>
              <p className="text-[10px] text-[#c5a880] tracking-widest uppercase">
                Fine Dining Management & Operations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8e8275] hover:text-[#f8f5f0] border border-transparent hover:border-[#c5a880]/30 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#c5a880]/20 bg-[#080e16] px-4 overflow-x-auto">
          {[
            { id: 'overview', name: 'Overview', icon: LayoutDashboard },
            { id: 'menu', name: `Menu Items (${menuItems.length})`, icon: Utensils },
            { id: 'reservations', name: `Reservations (${reservations.length})`, icon: Calendar },
            { id: 'orders', name: `Kitchen Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'reviews', name: `Reviews (${reviews.length})`, icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3.5 px-4 text-xs font-cinzel font-bold tracking-wider uppercase transition-colors whitespace-nowrap relative ${
                  activeTab === tab.id ? 'text-[#c5a880]' : 'text-[#8e8275] hover:text-[#ded6cc]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c5a880]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Content Pane */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#070d14]">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-[#0a111a] border border-[#c5a880]/20 rounded-sm">
                  <div className="flex items-center justify-between text-[#8e8275] mb-2 text-xs">
                    <span>Gross Sales Volume</span>
                    <DollarSign className="w-4 h-4 text-[#c5a880]" />
                  </div>
                  <p className="font-cinzel text-2xl font-bold text-[#f5efeb] font-mono tabular-nums">
                    ${totalRevenue.toFixed(2)}
                  </p>
                  <span className="text-[10px] text-emerald-400 font-medium">
                    +18% from last evening
                  </span>
                </div>

                <div className="p-5 bg-[#0a111a] border border-[#c5a880]/20 rounded-sm">
                  <div className="flex items-center justify-between text-[#8e8275] mb-2 text-xs">
                    <span>Active Orders in Prep</span>
                    <ChefHat className="w-4 h-4 text-[#c5a880]" />
                  </div>
                  <p className="font-cinzel text-2xl font-bold text-[#c5a880] font-mono tabular-nums">
                    {activeOrdersCount}
                  </p>
                  <span className="text-[10px] text-[#8e8275]">
                    Current kitchen throughput
                  </span>
                </div>

                <div className="p-5 bg-[#0a111a] border border-[#c5a880]/20 rounded-sm">
                  <div className="flex items-center justify-between text-[#8e8275] mb-2 text-xs">
                    <span>Upcoming Bookings</span>
                    <Calendar className="w-4 h-4 text-[#c5a880]" />
                  </div>
                  <p className="font-cinzel text-2xl font-bold text-[#f5efeb] font-mono tabular-nums">
                    {activeReservationsCount}
                  </p>
                  <span className="text-[10px] text-[#8e8275]">
                    Tonight & weekend seatings
                  </span>
                </div>

                <div className="p-5 bg-[#0a111a] border border-[#c5a880]/20 rounded-sm">
                  <div className="flex items-center justify-between text-[#8e8275] mb-2 text-xs">
                    <span>Patron Satisfaction</span>
                    <Sparkles className="w-4 h-4 text-[#c5a880]" />
                  </div>
                  <p className="font-cinzel text-2xl font-bold text-[#e5c07b] font-mono tabular-nums">
                    4.9 / 5.0
                  </p>
                  <span className="text-[10px] text-emerald-400">
                    100% verified table reviews
                  </span>
                </div>
              </div>

              {/* Quick Status Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Pending Kitchen Orders */}
                <div className="bg-[#0a111a] border border-[#c5a880]/20 p-5 rounded-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-cinzel text-sm font-bold text-[#f8f5f0] uppercase tracking-wider">
                      Live Kitchen Pass
                    </h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-[#c5a880] hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {orders.slice(0, 3).map((ord) => (
                      <div key={ord.id} className="p-3 bg-[#070d14] border border-[#c5a880]/15 rounded-sm flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-[#f5efeb]">{ord.id} · {ord.userName}</p>
                          <p className="text-[11px] text-[#8e8275]">
                            {ord.items.length} dishes · ${ord.total.toFixed(2)}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${
                          ord.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Latest Reservations */}
                <div className="bg-[#0a111a] border border-[#c5a880]/20 p-5 rounded-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-cinzel text-sm font-bold text-[#f8f5f0] uppercase tracking-wider">
                      Upcoming Table Bookings
                    </h3>
                    <button
                      onClick={() => setActiveTab('reservations')}
                      className="text-xs text-[#c5a880] hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {reservations.slice(0, 3).map((res) => (
                      <div key={res.id} className="p-3 bg-[#070d14] border border-[#c5a880]/15 rounded-sm flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-[#f5efeb]">{res.guestName} ({res.guests} Guests)</p>
                          <p className="text-[11px] text-[#8e8275]">{res.date} at {res.time} · {res.seatingArea}</p>
                        </div>
                        <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${
                          res.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {res.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: MENU MANAGEMENT */}
          {activeTab === 'menu' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-cinzel text-base font-bold text-[#f5efeb]">
                    Menu Portfolio Control
                  </h3>
                  <p className="text-xs text-[#8e8275]">
                    Manage dishes, adjust pricing, toggle availability, or introduce seasonal creations.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddDishModal(true)}
                  className="px-4 py-2 bg-[#c5a880] hover:bg-[#b89b74] text-[#070d14] font-cinzel text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Dish</span>
                </button>
              </div>

              {/* Menu Table */}
              <div className="bg-[#0a111a] border border-[#c5a880]/20 rounded-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#080e16] text-[#8e8275] uppercase text-[10px] tracking-wider border-b border-[#c5a880]/20">
                    <tr>
                      <th className="py-3 px-4">Dish</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Availability</th>
                      <th className="py-3 px-4">Special</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c5a880]/10">
                    {menuItems.map((dish) => (
                      <tr key={dish.id} className="hover:bg-[#070d14]/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={dish.imageUrl}
                              alt={dish.name}
                              className="w-10 h-10 rounded-sm object-cover shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p className="font-cinzel font-bold text-[#f8f5f0]">{dish.name}</p>
                              <p className="text-[10px] text-[#8e8275] truncate max-w-xs">{dish.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[#c5a880] font-medium">{dish.category}</td>
                        <td className="py-3 px-4 font-mono font-bold text-[#ded6cc] tabular-nums">
                          ${dish.price.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => onUpdateMenuItem(dish.id, { available: !dish.available })}
                            className={`flex items-center gap-1.5 text-xs font-semibold ${
                              dish.available ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {dish.available ? (
                              <>
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span>In Stock</span>
                              </>
                            ) : (
                              <>
                                <span className="w-2 h-2 rounded-full bg-rose-500" />
                                <span>Sold Out</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          {dish.isChefSpecial ? (
                            <span className="px-2 py-0.5 bg-[#c5a880]/20 text-[#c5a880] rounded text-[10px] font-bold uppercase">
                              Special
                            </span>
                          ) : (
                            <span className="text-[#8e8275]">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => onDeleteMenuItem(dish.id)}
                            className="p-1.5 text-[#8e8275] hover:text-rose-400 transition-colors"
                            title="Delete dish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: RESERVATIONS */}
          {activeTab === 'reservations' && (
            <div className="space-y-4">
              <h3 className="font-cinzel text-base font-bold text-[#f5efeb]">
                Table Reservation Ledger
              </h3>
              
              <div className="bg-[#0a111a] border border-[#c5a880]/20 rounded-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#080e16] text-[#8e8275] uppercase text-[10px] tracking-wider border-b border-[#c5a880]/20">
                    <tr>
                      <th className="py-3 px-4">Code</th>
                      <th className="py-3 px-4">Guest</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Guests</th>
                      <th className="py-3 px-4">Seating Area</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Manage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c5a880]/10">
                    {reservations.map((res) => (
                      <tr key={res.id} className="hover:bg-[#070d14]/60 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#c5a880]">{res.code}</td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-[#f5efeb]">{res.guestName}</p>
                          <p className="text-[10px] text-[#8e8275]">{res.guestEmail}</p>
                        </td>
                        <td className="py-3 px-4 text-[#ded6cc]">{res.date} at {res.time}</td>
                        <td className="py-3 px-4 font-mono">{res.guests} Guests</td>
                        <td className="py-3 px-4 text-[#c5a880]">{res.seatingArea}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            res.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                            res.status === 'seated' ? 'bg-blue-500/20 text-blue-400' :
                            res.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {res.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() => onUpdateReservationStatus(res.id, 'confirmed')}
                            className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded text-[10px] font-semibold"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => onUpdateReservationStatus(res.id, 'seated')}
                            className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-[10px] font-semibold"
                          >
                            Seat
                          </button>
                          <button
                            onClick={() => onUpdateReservationStatus(res.id, 'cancelled')}
                            className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded text-[10px] font-semibold"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="font-cinzel text-base font-bold text-[#f5efeb]">
                Live Kitchen Dispatch Board
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.map((ord) => (
                  <div key={ord.id} className="bg-[#0a111a] border border-[#c5a880]/25 p-5 rounded-sm flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-[#c5a880]/15">
                        <span className="font-mono text-sm font-bold text-[#c5a880]">{ord.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ord.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                          ord.status === 'ready' ? 'bg-cyan-500/20 text-cyan-400' :
                          ord.status === 'preparing' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {ord.status}
                        </span>
                      </div>

                      <div className="py-2">
                        <p className="font-bold text-xs text-[#f5efeb]">{ord.userName}</p>
                        <p className="text-[11px] text-[#8e8275]">
                          Type: <span className="uppercase text-[#c5a880]">{ord.diningType}</span>
                          {ord.tableNumber && ` · ${ord.tableNumber}`}
                        </p>
                      </div>

                      <div className="space-y-1.5 py-2 text-xs border-y border-[#c5a880]/10">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-[#ded6cc]">
                            <span>{it.quantity}x {it.dish.name}</span>
                            <span className="font-mono text-[#8e8275]">${(it.dish.price * it.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs font-bold text-[#f8f5f0] mb-3">
                        <span>Total:</span>
                        <span className="font-mono text-[#c5a880]">${ord.total.toFixed(2)}</span>
                      </div>

                      {/* Advance Pipeline Status */}
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          onClick={() => onUpdateOrderStatus(ord.id, 'preparing')}
                          className="py-1 text-[10px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-bold rounded"
                        >
                          → In Kitchen
                        </button>
                        <button
                          onClick={() => onUpdateOrderStatus(ord.id, 'ready')}
                          className="py-1 text-[10px] bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-bold rounded"
                        >
                          → Plated Ready
                        </button>
                        <button
                          onClick={() => onUpdateOrderStatus(ord.id, 'completed')}
                          className="py-1 text-[10px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold rounded"
                        >
                          ✓ Served
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: REVIEWS MODERATION */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <h3 className="font-cinzel text-base font-bold text-[#f5efeb]">
                Patron Review Moderation
              </h3>

              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-[#0a111a] border border-[#c5a880]/20 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-xs text-[#f5efeb]">{rev.userName}</span>
                        <span className="text-xs text-[#8e8275]">({rev.rating} ★)</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          rev.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {rev.status}
                        </span>
                        {rev.isFeatured && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#c5a880]/20 text-[#c5a880]">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="font-cinzel text-xs font-bold text-[#c5a880]">"{rev.title}"</p>
                      <p className="text-xs text-[#a89b8d] mt-1">{rev.comment}</p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        onClick={() => onUpdateReviewStatus(rev.id, 'approved', !rev.isFeatured)}
                        className="px-3 py-1.5 text-xs bg-[#c5a880]/20 hover:bg-[#c5a880]/30 text-[#c5a880] rounded font-medium"
                      >
                        {rev.isFeatured ? 'Unfeature' : 'Feature on Home'}
                      </button>
                      {rev.status !== 'approved' && (
                        <button
                          onClick={() => onUpdateReviewStatus(rev.id, 'approved')}
                          className="px-3 py-1.5 text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded font-medium"
                        >
                          Approve
                        </button>
                      )}
                      {rev.status !== 'rejected' && (
                        <button
                          onClick={() => onUpdateReviewStatus(rev.id, 'rejected')}
                          className="px-3 py-1.5 text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded font-medium"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ADD DISH MODAL */}
      {showAddDishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a111a] border border-[#c5a880] rounded-sm max-w-lg w-full p-6 shadow-2xl relative text-[#ded6cc]">
            <button
              onClick={() => setShowAddDishModal(false)}
              className="absolute top-4 right-4 text-[#8e8275] hover:text-[#f8f5f0]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-cinzel text-lg font-bold text-[#f5efeb] mb-4 uppercase">
              Introduce Culinary Dish
            </h3>

            <form onSubmit={handleCreateDish} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                  Dish Name *
                </label>
                <input
                  type="text"
                  required
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  placeholder="e.g. Saffron Chilean Sea Bass"
                  className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                    Category *
                  </label>
                  <select
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value as MenuCategory)}
                    className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3 py-2 text-xs text-[#f8f5f0]"
                  >
                    <option value="Starters">Starters</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Indian">Indian</option>
                    <option value="Italian">Italian</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(e.target.value)}
                    className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newDishDesc}
                  onChange={(e) => setNewDishDesc(e.target.value)}
                  placeholder="Artisanal preparation, reductions, pairings..."
                  className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDishIsVeg}
                    onChange={(e) => setNewDishIsVeg(e.target.checked)}
                    className="rounded border-[#c5a880]/40 bg-[#070d14] text-[#c5a880]"
                  />
                  <span>Vegetarian Recipe</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDishIsSpecial}
                    onChange={(e) => setNewDishIsSpecial(e.target.checked)}
                    className="rounded border-[#c5a880]/40 bg-[#070d14] text-[#c5a880]"
                  />
                  <span>Chef's Special Badge</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#c5a880]/20">
                <button
                  type="button"
                  onClick={() => setShowAddDishModal(false)}
                  className="px-4 py-2 text-[#8e8275] hover:text-[#f8f5f0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#c5a880] hover:bg-[#b89b74] text-[#070d14] font-cinzel text-xs font-bold uppercase tracking-wider rounded-sm"
                >
                  Save Dish to Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
