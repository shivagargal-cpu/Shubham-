import React, { useState, useRef } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext';
import { 
  LayoutDashboard, 
  Utensils, 
  Calendar, 
  ShoppingBag, 
  MessageSquare, 
  DollarSign, 
  ChefHat, 
  Plus, 
  Trash2, 
  Sparkles, 
  ShieldAlert, 
  Clock,
  ArrowLeft,
  FileText,
  Image as ImageIcon,
  Database,
  Upload,
  Check,
  Copy,
  ExternalLink,
  Edit2,
  Search,
  Filter,
  Save,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { MenuCategory, MenuItem, GalleryItem, RestaurantSettings } from '../types';
import { uploadImageToStorage, getSupabaseConfig, STORAGE_BUCKET } from '../lib/supabase';
import { AdminImageUploadBadge } from '../components/AdminImageUploadBadge';
import { apiService } from '../services/apiService';

type AdminTab = 'overview' | 'content' | 'menu' | 'images' | 'reservations' | 'orders' | 'reviews' | 'database';

export const AdminPage: React.FC = () => {
  const { 
    currentUser, 
    settings,
    menuItems, 
    gallery,
    reservations, 
    orders, 
    reviews, 
    isLiveSupabase,
    showToast,
    handleAddMenuItem, 
    handleUpdateMenuItem, 
    handleDeleteMenuItem, 
    handleUpdateSettings,
    handleAddGalleryItem,
    handleUpdateGalleryItem,
    handleDeleteGalleryItem,
    handleUpdateReservationStatus, 
    handleUpdateOrderStatus, 
    handleUpdateReviewStatus,
    handleSeedSupabase
  } = useRestaurant();

  const location = useLocation();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Website Content Management State (cloned from current settings)
  const [contentForm, setContentForm] = useState<RestaurantSettings>(settings);
  const [isSavingContent, setIsSavingContent] = useState(false);

  // Menu Search & Filter
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCategoryFilter, setMenuCategoryFilter] = useState<string>('All');

  // Add / Edit Dish Modal State
  const [showDishModal, setShowDishModal] = useState(false);
  const [editingDishId, setEditingDishId] = useState<string | null>(null);
  const [dishName, setDishName] = useState('');
  const [dishCategory, setDishCategory] = useState<MenuCategory>('Main Course');
  const [dishPrice, setDishPrice] = useState('45');
  const [dishDesc, setDishDesc] = useState('');
  const [dishImage, setDishImage] = useState('/src/assets/images/food_wagyu_steak_1792868333122.jpg');
  const [dishIsVeg, setDishIsVeg] = useState(false);
  const [dishIsSpecial, setDishIsSpecial] = useState(false);
  const [dishIsBestseller, setDishIsBestseller] = useState(false);
  const [dishUploading, setDishUploading] = useState(false);

  // Filter States
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [resFilter, setResFilter] = useState<string>('all');
  const [reviewFilter, setReviewFilter] = useState<string>('all');

  // Image Upload Tab State
  const [uploadFolder, setUploadFolder] = useState<string>('dishes');
  const [isUploadingAsset, setIsUploadingAsset] = useState(false);
  const [recentUploads, setRecentUploads] = useState<Array<{ name: string; url: string; time: string }>>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Gallery Add Item Modal
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryCategory, setGalleryCategory] = useState<GalleryItem['category']>('Dining Room');
  const [galleryUrl, setGalleryUrl] = useState('');
  const [galleryDesc, setGalleryDesc] = useState('');

  // Supabase Configuration Form
  const currentConfig = getSupabaseConfig();
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(currentConfig.url);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(currentConfig.anonKey);
  const [isSeeding, setIsSeeding] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Authentication & Authorization check
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (currentUser.role !== 'admin') {
    return (
      <div className="py-24 text-center bg-[#070d14] min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 bg-[#0a111a] border border-rose-500/30 rounded-sm space-y-4 shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="font-cinzel text-xl font-bold text-[#f5efeb]">UNAUTHORIZED ACCESS</h2>
          <p className="text-xs text-[#8e8275] leading-relaxed">
            The Executive Operations Suite requires administrative credentials. You are currently logged in as a Royal Patron ({currentUser.email}).
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/account"
              className="px-5 py-2 bg-[#c5a880] text-[#070d14] font-cinzel text-xs font-bold uppercase rounded-sm"
            >
              Patron Account
            </Link>
            <Link
              to="/login"
              className="px-5 py-2 border border-[#c5a880]/40 text-[#c5a880] font-cinzel text-xs font-bold uppercase rounded-sm hover:border-[#c5a880]"
            >
              Sign In as Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const activeOrdersCount = orders.filter((o) => o.status === 'received' || o.status === 'preparing').length;
  const activeReservationsCount = reservations.filter((r) => r.status === 'confirmed' || r.status === 'pending').length;
  const pendingReviewsCount = reviews.filter((r) => r.status === 'pending').length;

  // Handle Saving Website Content
  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingContent(true);
    try {
      await handleUpdateSettings(contentForm);
      showToast('Website content published and synchronized across all pages.');
    } catch (err: any) {
      showToast(`Error publishing content: ${err.message}`);
    } finally {
      setIsSavingContent(false);
    }
  };

  // Dish Creation / Editing
  const openNewDishModal = () => {
    setEditingDishId(null);
    setDishName('');
    setDishCategory('Main Course');
    setDishPrice('45');
    setDishDesc('');
    setDishImage('/src/assets/images/food_wagyu_steak_1792868333122.jpg');
    setDishIsVeg(false);
    setDishIsSpecial(false);
    setDishIsBestseller(false);
    setShowDishModal(true);
  };

  const openEditDishModal = (dish: MenuItem) => {
    setEditingDishId(dish.id);
    setDishName(dish.name);
    setDishCategory(dish.category);
    setDishPrice(dish.price.toString());
    setDishDesc(dish.description);
    setDishImage(dish.imageUrl);
    setDishIsVeg(Boolean(dish.isVegetarian));
    setDishIsSpecial(Boolean(dish.isChefSpecial));
    setDishIsBestseller(Boolean(dish.isBestseller));
    setShowDishModal(true);
  };

  const handleSaveDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim() || !dishPrice) return;

    if (editingDishId) {
      await handleUpdateMenuItem(editingDishId, {
        name: dishName.trim(),
        category: dishCategory,
        price: parseFloat(dishPrice) || 30,
        description: dishDesc.trim(),
        imageUrl: dishImage,
        isVegetarian: dishIsVeg,
        isChefSpecial: dishIsSpecial,
        isBestseller: dishIsBestseller,
      });
      showToast(`Updated "${dishName.trim()}"`);
    } else {
      await handleAddMenuItem({
        name: dishName.trim(),
        category: dishCategory,
        description: dishDesc.trim() || 'A signature royal culinary preparation crafted with the finest ingredients.',
        price: parseFloat(dishPrice) || 30,
        imageUrl: dishImage,
        isVegetarian: dishIsVeg,
        isChefSpecial: dishIsSpecial,
        isBestseller: dishIsBestseller,
        available: true,
      });
      showToast(`Added new dish "${dishName.trim()}"`);
    }

    setShowDishModal(false);
  };

  // Dish Image File Picker Upload
  const handleDishImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDishUploading(true);
    const res = await uploadImageToStorage(file, 'dishes');
    setDishUploading(false);

    if (res.error && !res.url) {
      showToast(res.error);
    } else if (res.url) {
      setDishImage(res.url);
      showToast('Dish photograph uploaded successfully.');
    }
  };

  // Generic Image Uploader
  const handleAssetUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAsset(true);
    const res = await uploadImageToStorage(file, uploadFolder);
    setIsUploadingAsset(false);

    if (res.error && !res.url) {
      showToast(res.error);
    } else if (res.url) {
      setRecentUploads((prev) => [
        { name: file.name, url: res.url, time: new Date().toLocaleTimeString() },
        ...prev.slice(0, 9),
      ]);
      showToast(`Uploaded ${file.name} to '${uploadFolder}' folder.`);
    }
  };

  // Add Gallery Item
  const handleCreateGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryTitle.trim() || !galleryUrl.trim()) return;

    await handleAddGalleryItem({
      title: galleryTitle.trim(),
      category: galleryCategory,
      imageUrl: galleryUrl.trim(),
      description: galleryDesc.trim() || 'Exclusive haute cuisine and dining visual.',
      displayOrder: gallery.length + 1,
    });

    setShowGalleryModal(false);
    setGalleryTitle('');
    setGalleryUrl('');
    setGalleryDesc('');
    showToast('Gallery image saved and live on the gallery page.');
  };

  // Copy text to clipboard helper
  const copyToClipboard = (text: string, type: 'url' | 'sql') => {
    navigator.clipboard.writeText(text);
    if (type === 'url') {
      setCopiedUrl(text);
      setTimeout(() => setCopiedUrl(null), 2500);
      showToast('Image URL copied to clipboard.');
    } else {
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
      showToast('SQL migration schema copied to clipboard.');
    }
  };

  // Seed Supabase Database
  const triggerSeedDatabase = async () => {
    setIsSeeding(true);
    const res = await handleSeedSupabase();
    setIsSeeding(false);
    showToast(res.message);
  };

  // Save Supabase Credentials (Saved both to server store for all visitors and locally)
  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = supabaseUrlInput.trim();
    const anonKey = supabaseKeyInput.trim();
    await apiService.saveSupabaseConfig(url, anonKey);
    if (typeof window !== 'undefined') {
      localStorage.setItem('broso_supabase_url', url);
      localStorage.setItem('broso_supabase_anon_key', anonKey);
      showToast('Supabase connection credentials broadcast to all users! Reloading...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  // Filtered Menu Items
  const filteredMenuItems = menuItems.filter((dish) => {
    const matchesSearch = dish.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      dish.description.toLowerCase().includes(menuSearch.toLowerCase());
    const matchesCategory = menuCategoryFilter === 'All' || dish.category === menuCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  // Filtered Reservations
  const filteredReservations = reservations.filter((r) => {
    if (resFilter === 'all') return true;
    return r.status === resFilter;
  });

  // Filtered Reviews
  const filteredReviews = reviews.filter((rev) => {
    if (reviewFilter === 'all') return true;
    return rev.status === reviewFilter;
  });

  return (
    <div className="py-8 bg-[#070d14] min-h-[92vh] text-[#ded6cc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* HEADER BAR */}
        <div className="bg-[#0a111a] border border-[#c5a880]/30 rounded-sm p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#c5a880]/15 border border-[#c5a880] flex items-center justify-center text-[#c5a880] shrink-0">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-cinzel text-xl sm:text-2xl font-bold text-[#f5efeb] uppercase tracking-wider">
                  EXECUTIVE OPERATIONS SUITE
                </h1>
                {isLiveSupabase ? (
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold uppercase rounded-full flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Supabase Live Sync
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold uppercase rounded-full flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Local Storage (Offline)
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8e8275] mt-1">
                Admin Officer: <span className="text-[#ded6cc] font-medium">{currentUser.name}</span> ({currentUser.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('database')}
              className="px-3 py-1.5 text-xs bg-[#070d14] hover:bg-[#070d14]/80 border border-[#c5a880]/30 text-[#c5a880] rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Database Hub</span>
            </button>
            <Link
              to="/"
              className="px-3.5 py-1.5 text-xs bg-[#c5a880] hover:bg-[#b89b74] text-[#070d14] font-cinzel font-bold uppercase tracking-wider rounded-sm transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </Link>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex border-b border-[#c5a880]/20 bg-[#0a111a] px-4 rounded-t-sm overflow-x-auto scrollbar-thin">
          {[
            { id: 'overview', name: 'Dashboard', icon: LayoutDashboard },
            { id: 'content', name: 'Website Content', icon: FileText },
            { id: 'menu', name: `Menu (${menuItems.length})`, icon: Utensils },
            { id: 'images', name: `Images & Gallery (${gallery.length})`, icon: ImageIcon },
            { id: 'orders', name: `Orders (${orders.length})`, icon: ShoppingBag, badge: activeOrdersCount },
            { id: 'reservations', name: `Reservations (${reservations.length})`, icon: Calendar, badge: activeReservationsCount },
            { id: 'reviews', name: `Reviews (${reviews.length})`, icon: MessageSquare, badge: pendingReviewsCount },
            { id: 'database', name: 'Supabase Hub', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 py-3.5 px-4 text-xs font-cinzel font-bold tracking-wider uppercase transition-colors whitespace-nowrap relative cursor-pointer ${
                  isActive ? 'text-[#c5a880]' : 'text-[#8e8275] hover:text-[#ded6cc]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
                {tab.badge && tab.badge > 0 ? (
                  <span className="px-1.5 py-0.2 bg-[#c5a880] text-[#070d14] text-[10px] rounded-full font-mono font-bold">
                    {tab.badge}
                  </span>
                ) : null}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c5a880]" />
                )}
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: OVERVIEW / DASHBOARD */}
        {/* ============================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top 4 Metrics Cards */}
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
                  {orders.length} total customer orders
                </span>
              </div>

              <div className="p-5 bg-[#0a111a] border border-[#c5a880]/20 rounded-sm">
                <div className="flex items-center justify-between text-[#8e8275] mb-2 text-xs">
                  <span>Active Kitchen Orders</span>
                  <ChefHat className="w-4 h-4 text-[#c5a880]" />
                </div>
                <p className="font-cinzel text-2xl font-bold text-[#c5a880] font-mono tabular-nums">
                  {activeOrdersCount}
                </p>
                <span className="text-[10px] text-[#8e8275]">
                  Received / in preparation
                </span>
              </div>

              <div className="p-5 bg-[#0a111a] border border-[#c5a880]/20 rounded-sm">
                <div className="flex items-center justify-between text-[#8e8275] mb-2 text-xs">
                  <span>Table Reservations</span>
                  <Calendar className="w-4 h-4 text-[#c5a880]" />
                </div>
                <p className="font-cinzel text-2xl font-bold text-[#f5efeb] font-mono tabular-nums">
                  {activeReservationsCount}
                </p>
                <span className="text-[10px] text-[#8e8275]">
                  {reservations.length} lifetime bookings
                </span>
              </div>

              <div className="p-5 bg-[#0a111a] border border-[#c5a880]/20 rounded-sm">
                <div className="flex items-center justify-between text-[#8e8275] mb-2 text-xs">
                  <span>Menu Dishes</span>
                  <Utensils className="w-4 h-4 text-[#c5a880]" />
                </div>
                <p className="font-cinzel text-2xl font-bold text-[#e5c07b] font-mono tabular-nums">
                  {menuItems.length}
                </p>
                <span className="text-[10px] text-emerald-400">
                  {menuItems.filter((i) => i.available).length} active in catalog
                </span>
              </div>
            </div>

            {/* Quick Activity Feeds */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-[#0a111a] border border-[#c5a880]/20 p-5 rounded-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-cinzel text-sm font-bold text-[#f8f5f0] uppercase tracking-wider">
                    Recent Kitchen Dispatches
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#c5a880] hover:underline cursor-pointer"
                  >
                    View All Orders →
                  </button>
                </div>
                <div className="space-y-3">
                  {orders.length === 0 ? (
                    <p className="text-xs text-[#8e8275] py-4 text-center">No orders recorded yet.</p>
                  ) : (
                    orders.slice(0, 4).map((ord) => (
                      <div key={ord.id} className="p-3 bg-[#070d14] border border-[#c5a880]/15 rounded-sm flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-[#f5efeb]">{ord.id} · {ord.userName}</p>
                          <p className="text-[11px] text-[#8e8275]">
                            {ord.items.length} dishes · ${ord.total.toFixed(2)} · {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${
                          ord.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                          ord.status === 'ready' ? 'bg-cyan-500/20 text-cyan-400' :
                          ord.status === 'preparing' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Reservations */}
              <div className="bg-[#0a111a] border border-[#c5a880]/20 p-5 rounded-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-cinzel text-sm font-bold text-[#f8f5f0] uppercase tracking-wider">
                    Upcoming Table Reservations
                  </h3>
                  <button
                    onClick={() => setActiveTab('reservations')}
                    className="text-xs text-[#c5a880] hover:underline cursor-pointer"
                  >
                    View All Bookings →
                  </button>
                </div>
                <div className="space-y-3">
                  {reservations.length === 0 ? (
                    <p className="text-xs text-[#8e8275] py-4 text-center">No bookings recorded yet.</p>
                  ) : (
                    reservations.slice(0, 4).map((res) => (
                      <div key={res.id} className="p-3 bg-[#070d14] border border-[#c5a880]/15 rounded-sm flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-[#f5efeb]">{res.guestName} ({res.guests} Guests)</p>
                          <p className="text-[11px] text-[#8e8275]">{res.date} at {res.time} · {res.seatingArea}</p>
                        </div>
                        <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${
                          res.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                          res.status === 'seated' ? 'bg-blue-500/20 text-blue-400' :
                          res.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {res.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: WEBSITE CONTENT MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-cinzel text-lg font-bold text-[#f5efeb] uppercase tracking-wider">
                  Live Website Content Editor
                </h2>
                <p className="text-xs text-[#8e8275]">
                  Edit headings, hero photography, about narratives, and contact details. Published changes propagate in real-time.
                </p>
              </div>

              <button
                onClick={handleSaveContent}
                disabled={isSavingContent}
                className="px-6 py-2.5 bg-[#c5a880] hover:bg-[#b89b74] text-[#070d14] font-cinzel text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
              >
                {isSavingContent ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isSavingContent ? 'Publishing...' : 'Publish Content'}</span>
              </button>
            </div>

            <form onSubmit={handleSaveContent} className="space-y-6">
              
              {/* Brand & Identity */}
              <div className="bg-[#0a111a] border border-[#c5a880]/20 p-6 rounded-sm space-y-4">
                <h3 className="font-cinzel text-sm font-bold text-[#c5a880] uppercase tracking-wider border-b border-[#c5a880]/15 pb-2">
                  1. Brand Identity & Header
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                      Restaurant Brand Name
                    </label>
                    <input
                      type="text"
                      value={contentForm.brandName}
                      onChange={(e) => setContentForm({ ...contentForm, brandName: e.target.value })}
                      className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                      Brand Tagline
                    </label>
                    <input
                      type="text"
                      value={contentForm.tagline}
                      onChange={(e) => setContentForm({ ...contentForm, tagline: e.target.value })}
                      className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                      Logo Image & Asset
                    </label>
                    <div className="flex gap-3 items-center">
                      <div className="relative group shrink-0 w-14 h-14 rounded-sm overflow-hidden border border-[#c5a880]/40 bg-[#070d14] flex items-center justify-center">
                        {contentForm.logoUrl ? (
                          <img
                            src={contentForm.logoUrl}
                            alt="Brand Logo"
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <span className="font-cinzel text-xs font-bold text-[#c5a880]">BROSO</span>
                        )}
                        <AdminImageUploadBadge
                          folder="general"
                          onUploaded={async (newUrl) => {
                            setContentForm((prev) => ({ ...prev, logoUrl: newUrl }));
                            await handleUpdateSettings({ logoUrl: newUrl });
                          }}
                          compact
                          title="Upload brand logo from device"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={contentForm.logoUrl || ''}
                          onChange={(e) => setContentForm({ ...contentForm, logoUrl: e.target.value })}
                          placeholder="Upload from top-left or enter URL"
                          className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                      Direct Concierge Phone
                    </label>
                    <input
                      type="text"
                      value={contentForm.contactPhone}
                      onChange={(e) => setContentForm({ ...contentForm, contactPhone: e.target.value })}
                      className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Section */}
              <div className="bg-[#0a111a] border border-[#c5a880]/20 p-6 rounded-sm space-y-4">
                <h3 className="font-cinzel text-sm font-bold text-[#c5a880] uppercase tracking-wider border-b border-[#c5a880]/15 pb-2">
                  2. Homepage Hero Showcase
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                      Hero Subtitle
                    </label>
                    <input
                      type="text"
                      value={contentForm.heroSubtitle}
                      onChange={(e) => setContentForm({ ...contentForm, heroSubtitle: e.target.value })}
                      className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                      Hero Large Heading
                    </label>
                    <input
                      type="text"
                      value={contentForm.heroTitle}
                      onChange={(e) => setContentForm({ ...contentForm, heroTitle: e.target.value })}
                      className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                    Hero Narrative Description
                  </label>
                  <textarea
                    rows={2}
                    value={contentForm.heroDescription}
                    onChange={(e) => setContentForm({ ...contentForm, heroDescription: e.target.value })}
                    className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                    Hero Background Photography
                  </label>
                  <div className="relative group w-full h-44 rounded-sm overflow-hidden border border-[#c5a880]/40 bg-[#070d14]">
                    {contentForm.heroImage ? (
                      <img
                        src={contentForm.heroImage}
                        alt="Hero Showcase Preview"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-[#8e8275]">
                        No hero background chosen
                      </div>
                    )}
                    <AdminImageUploadBadge
                      folder="hero"
                      onUploaded={async (newUrl) => {
                        setContentForm((prev) => ({ ...prev, heroImage: newUrl, heroImageUrl: newUrl }));
                        await handleUpdateSettings({ heroImage: newUrl, heroImageUrl: newUrl });
                      }}
                      label="Upload Hero Image"
                      title="Upload hero background from device"
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-[#060a10]/90 backdrop-blur-sm p-2 rounded-sm border border-[#c5a880]/30 flex items-center gap-2">
                      <span className="text-[10px] text-[#c5a880] uppercase font-bold shrink-0">URL:</span>
                      <input
                        type="text"
                        value={contentForm.heroImage}
                        onChange={(e) =>
                          setContentForm({ ...contentForm, heroImage: e.target.value, heroImageUrl: e.target.value })
                        }
                        placeholder="Hero image URL or upload from top-left"
                        className="w-full bg-transparent text-xs text-[#f8f5f0] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="bg-[#0a111a] border border-[#c5a880]/20 p-6 rounded-sm space-y-4">
                <h3 className="font-cinzel text-sm font-bold text-[#c5a880] uppercase tracking-wider border-b border-[#c5a880]/15 pb-2">
                  3. About & Heritage Story
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                      About Section Title
                    </label>
                    <input
                      type="text"
                      value={contentForm.aboutTitle}
                      onChange={(e) => setContentForm({ ...contentForm, aboutTitle: e.target.value })}
                      className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                      Years of Culinary Heritage
                    </label>
                    <input
                      type="text"
                      value={contentForm.experienceYears}
                      onChange={(e) => setContentForm({ ...contentForm, experienceYears: e.target.value })}
                      className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                    Primary Story Paragraph
                  </label>
                  <textarea
                    rows={3}
                    value={contentForm.aboutStory}
                    onChange={(e) => setContentForm({ ...contentForm, aboutStory: e.target.value })}
                    className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                    Secondary Story Paragraph
                  </label>
                  <textarea
                    rows={2}
                    value={contentForm.aboutSecondaryStory}
                    onChange={(e) => setContentForm({ ...contentForm, aboutSecondaryStory: e.target.value })}
                    className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                      Patrons Served
                    </label>
                    <input
                      type="text"
                      value={contentForm.happyCustomers}
                      onChange={(e) => setContentForm({ ...contentForm, happyCustomers: e.target.value })}
                      className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                      Signature Dishes Count
                    </label>
                    <input
                      type="text"
                      value={contentForm.signatureDishesCount}
                      onChange={(e) => setContentForm({ ...contentForm, signatureDishesCount: e.target.value })}
                      className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                      Master Chefs Count
                    </label>
                    <input
                      type="text"
                      value={contentForm.masterChefsCount}
                      onChange={(e) => setContentForm({ ...contentForm, masterChefsCount: e.target.value })}
                      className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                    About Heritage Story Photography
                  </label>
                  <div className="relative group w-full h-44 rounded-sm overflow-hidden border border-[#c5a880]/40 bg-[#070d14]">
                    <img
                      src={contentForm.aboutImage || '/src/assets/images/culinary_wine_cellar_1792868412693.jpg'}
                      alt="About Heritage Preview"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <AdminImageUploadBadge
                      folder="general"
                      onUploaded={async (newUrl) => {
                        setContentForm((prev) => ({ ...prev, aboutImage: newUrl, aboutImageUrl: newUrl }));
                        await handleUpdateSettings({ aboutImage: newUrl, aboutImageUrl: newUrl });
                      }}
                      label="Upload About Image"
                      title="Upload about section photo from device"
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-[#060a10]/90 backdrop-blur-sm p-2 rounded-sm border border-[#c5a880]/30 flex items-center gap-2">
                      <span className="text-[10px] text-[#c5a880] uppercase font-bold shrink-0">URL:</span>
                      <input
                        type="text"
                        value={contentForm.aboutImage || ''}
                        onChange={(e) =>
                          setContentForm({ ...contentForm, aboutImage: e.target.value, aboutImageUrl: e.target.value })
                        }
                        placeholder="About image URL or upload from top-left"
                        className="w-full bg-transparent text-xs text-[#f8f5f0] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Details & Hours */}
              <div className="bg-[#0a111a] border border-[#c5a880]/20 p-6 rounded-sm space-y-4">
                <h3 className="font-cinzel text-sm font-bold text-[#c5a880] uppercase tracking-wider border-b border-[#c5a880]/15 pb-2">
                  4. Location, Concierge & Service Hours
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                      Restaurant Address
                    </label>
                    <input
                      type="text"
                      value={contentForm.address}
                      onChange={(e) => setContentForm({ ...contentForm, address: e.target.value })}
                      className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                      Concierge Email
                    </label>
                    <input
                      type="email"
                      value={contentForm.contactEmail}
                      onChange={(e) => setContentForm({ ...contentForm, contactEmail: e.target.value })}
                      className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                      Weekday Hours
                    </label>
                    <input
                      type="text"
                      value={contentForm.openingHours.weekdays}
                      onChange={(e) => setContentForm({
                        ...contentForm,
                        openingHours: { ...contentForm.openingHours, weekdays: e.target.value }
                      })}
                      className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                      Weekend Hours
                    </label>
                    <input
                      type="text"
                      value={contentForm.openingHours.weekends}
                      onChange={(e) => setContentForm({
                        ...contentForm,
                        openingHours: { ...contentForm.openingHours, weekends: e.target.value }
                      })}
                      className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                      Special Days / Closed
                    </label>
                    <input
                      type="text"
                      value={contentForm.openingHours.closedDays}
                      onChange={(e) => setContentForm({
                        ...contentForm,
                        openingHours: { ...contentForm.openingHours, closedDays: e.target.value }
                      })}
                      className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                    Footer Statement
                  </label>
                  <textarea
                    rows={2}
                    value={contentForm.footerText}
                    onChange={(e) => setContentForm({ ...contentForm, footerText: e.target.value })}
                    className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSavingContent}
                  className="px-8 py-3 bg-[#c5a880] hover:bg-[#b89b74] text-[#070d14] font-cinzel text-xs font-bold uppercase tracking-widest rounded-sm shadow-xl active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingContent ? 'Saving & Broadcasting...' : 'Save & Broadcast Live'}</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: MENU MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-cinzel text-base sm:text-lg font-bold text-[#f5efeb] uppercase tracking-wider">
                  Artisanal Menu Portfolio ({menuItems.length} Dishes)
                </h2>
                <p className="text-xs text-[#8e8275]">
                  Manage culinary items, prices, dietary flags, and image photography.
                </p>
              </div>

              <button
                onClick={openNewDishModal}
                className="px-4 py-2 bg-[#c5a880] hover:bg-[#b89b74] text-[#070d14] font-cinzel text-xs font-bold uppercase rounded-sm flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Dish</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-[#0a111a] border border-[#c5a880]/20 p-3 rounded-sm flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#8e8275]" />
                <input
                  type="text"
                  placeholder="Search recipes or ingredients..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="w-full bg-[#070d14] border border-[#c5a880]/20 rounded-sm pl-8 pr-3 py-1.5 text-xs text-[#f8f5f0] placeholder-[#6e6357] focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                {['All', 'Starters', 'Main Course', 'Indian', 'Italian', 'Desserts', 'Beverages'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setMenuCategoryFilter(cat)}
                    className={`px-3 py-1 text-[11px] font-semibold uppercase rounded-sm whitespace-nowrap transition-colors cursor-pointer ${
                      menuCategoryFilter === cat
                        ? 'bg-[#c5a880] text-[#070d14]'
                        : 'bg-[#070d14] text-[#8e8275] hover:text-[#ded6cc] border border-[#c5a880]/15'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Dishes Table */}
            <div className="bg-[#0a111a] border border-[#c5a880]/20 rounded-sm overflow-x-auto shadow-2xl">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-[#080e16] text-[#8e8275] uppercase text-[10px] tracking-wider border-b border-[#c5a880]/20">
                  <tr>
                    <th className="py-3 px-4">Dish Details</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock Status</th>
                    <th className="py-3 px-4">Special & Bestseller</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c5a880]/10">
                  {filteredMenuItems.map((dish) => (
                    <tr key={dish.id} className="hover:bg-[#070d14]/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative group shrink-0 w-14 h-14 rounded-sm overflow-hidden border border-[#c5a880]/30 bg-[#070d14]">
                            <img
                              src={dish.imageUrl}
                              alt={dish.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <AdminImageUploadBadge
                              folder="dishes"
                              onUploaded={async (newUrl) => {
                                await handleUpdateMenuItem(dish.id, { imageUrl: newUrl });
                              }}
                              compact
                              title={`Upload / Replace image for ${dish.name}`}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-cinzel font-bold text-[#f8f5f0]">{dish.name}</p>
                              {dish.isVegetarian && (
                                <span className="w-2 h-2 rounded-full bg-emerald-400" title="Vegetarian" />
                              )}
                            </div>
                            <p className="text-[11px] text-[#8e8275] truncate max-w-sm">{dish.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#c5a880] font-medium">{dish.category}</td>
                      <td className="py-3 px-4 font-mono font-bold text-[#ded6cc] tabular-nums">
                        ${dish.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleUpdateMenuItem(dish.id, { available: !dish.available })}
                          className={`flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                            dish.available ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${dish.available ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <span>{dish.available ? 'Available' : 'Sold Out'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 space-x-1">
                        {dish.isChefSpecial && (
                          <span className="px-2 py-0.5 bg-[#c5a880]/20 text-[#c5a880] rounded text-[10px] font-bold uppercase">
                            Chef Special
                          </span>
                        )}
                        {dish.isBestseller && (
                          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[10px] font-bold uppercase">
                            Bestseller
                          </span>
                        )}
                        {!dish.isChefSpecial && !dish.isBestseller && (
                          <span className="text-[#6e6357]">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditDishModal(dish)}
                          className="p-1.5 text-[#ded6cc] hover:text-[#c5a880] transition-colors cursor-pointer inline-block"
                          title="Edit recipe"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMenuItem(dish.id)}
                          className="p-1.5 text-[#8e8275] hover:text-rose-400 transition-colors cursor-pointer inline-block"
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

        {/* ============================================================== */}
        {/* TAB 4: IMAGE MANAGEMENT & GALLERY */}
        {/* ============================================================== */}
        {activeTab === 'images' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-cinzel text-lg font-bold text-[#f5efeb] uppercase tracking-wider">
                  Asset & Media Storage Hub
                </h2>
                <p className="text-xs text-[#8e8275]">
                  Upload high-resolution photography directly to Supabase Storage bucket ('{STORAGE_BUCKET}').
                </p>
              </div>

              <button
                onClick={() => setShowGalleryModal(true)}
                className="px-4 py-2 bg-[#c5a880] hover:bg-[#b89b74] text-[#070d14] font-cinzel text-xs font-bold uppercase rounded-sm flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Gallery Grid</span>
              </button>
            </div>

            {/* Direct Device File Uploader Card */}
            <div className="bg-[#0a111a] border border-[#c5a880]/30 p-6 rounded-sm space-y-4">
              <h3 className="font-cinzel text-sm font-bold text-[#c5a880] uppercase tracking-wider">
                Upload New Image from Device
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                <div className="sm:col-span-4 text-xs">
                  <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                    Select Target Folder / Category
                  </label>
                  <select
                    value={uploadFolder}
                    onChange={(e) => setUploadFolder(e.target.value)}
                    className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2.5 text-xs text-[#f8f5f0]"
                  >
                    <option value="dishes">Food & Dishes (dishes/)</option>
                    <option value="gallery">Atmospheric Gallery (gallery/)</option>
                    <option value="hero">Hero & Banners (hero/)</option>
                    <option value="general">Logos & General Assets (general/)</option>
                  </select>
                </div>

                <div className="sm:col-span-8">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    onChange={handleAssetUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingAsset}
                    className="w-full py-4 border-2 border-dashed border-[#c5a880]/40 hover:border-[#c5a880] bg-[#070d14]/70 hover:bg-[#070d14] rounded-sm flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    {isUploadingAsset ? (
                      <RefreshCw className="w-6 h-6 text-[#c5a880] animate-spin" />
                    ) : (
                      <Upload className="w-6 h-6 text-[#c5a880]" />
                    )}
                    <span className="text-xs font-semibold text-[#f8f5f0]">
                      {isUploadingAsset ? 'Uploading to Supabase Storage...' : 'Click to Pick Image from Computer / Device'}
                    </span>
                    <span className="text-[10px] text-[#8e8275]">
                      Supported formats: JPG, PNG, WebP (Max size: 5MB)
                    </span>
                  </button>
                </div>
              </div>

              {/* Recent Uploads List with Copy URL button */}
              {recentUploads.length > 0 && (
                <div className="pt-4 border-t border-[#c5a880]/15 space-y-2">
                  <h4 className="text-xs font-bold text-[#c5a880] uppercase tracking-wider">
                    Recently Uploaded to Supabase Storage:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {recentUploads.map((up, idx) => (
                      <div key={idx} className="p-2.5 bg-[#070d14] border border-[#c5a880]/20 rounded-sm flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="relative group shrink-0 w-10 h-10 rounded-sm overflow-hidden border border-[#c5a880]/30 bg-[#070d14]">
                            <img src={up.url} alt={up.name} className="w-full h-full object-cover" />
                            <AdminImageUploadBadge
                              folder={uploadFolder}
                              onUploaded={(newUrl) => {
                                setRecentUploads((prev) => [
                                  { name: 'Updated image', url: newUrl, time: new Date().toLocaleTimeString() },
                                  ...prev.slice(0, 9),
                                ]);
                              }}
                              compact
                              title="Upload and replace this image"
                            />
                          </div>
                          <div className="truncate">
                            <p className="font-semibold text-[#f8f5f0] truncate">{up.name}</p>
                            <p className="text-[10px] text-[#8e8275]">{up.time}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => copyToClipboard(up.url, 'url')}
                          className="px-2.5 py-1 text-[11px] bg-[#c5a880]/15 hover:bg-[#c5a880]/30 text-[#c5a880] rounded font-semibold cursor-pointer shrink-0 flex items-center gap-1"
                        >
                          {copiedUrl === up.url ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedUrl === up.url ? 'Copied' : 'Copy URL'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Live Gallery Items Grid */}
            <div className="space-y-4">
              <h3 className="font-cinzel text-sm font-bold text-[#f5efeb] uppercase tracking-wider">
                Current Gallery Portfolio ({gallery.length} Images)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {gallery.map((item) => (
                  <div key={item.id} className="bg-[#0a111a] border border-[#c5a880]/20 rounded-sm overflow-hidden flex flex-col justify-between group">
                    <div className="relative h-48 overflow-hidden bg-[#070d14]">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <AdminImageUploadBadge
                        folder="gallery"
                        onUploaded={async (newUrl) => {
                          await handleUpdateGalleryItem(item.id, { imageUrl: newUrl });
                        }}
                        label="Replace Image"
                        title={`Upload / Replace image for "${item.title}"`}
                      />
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-[#060a10]/85 border border-[#c5a880]/30 text-[10px] text-[#c5a880] font-bold uppercase rounded z-10">
                        {item.category}
                      </span>
                    </div>

                    <div className="p-3.5 space-y-2">
                      <h4 className="font-cinzel text-xs font-bold text-[#f8f5f0] truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-[#8e8275] line-clamp-2">
                        {item.description}
                      </p>

                      <div className="pt-2 flex items-center justify-between border-t border-[#c5a880]/15">
                        <button
                          onClick={() => copyToClipboard(item.imageUrl, 'url')}
                          className="text-[11px] text-[#c5a880] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy URL</span>
                        </button>

                        <button
                          onClick={() => handleDeleteGalleryItem(item.id)}
                          className="p-1 text-[#8e8275] hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete image from gallery"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: KITCHEN ORDERS */}
        {/* ============================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-cinzel text-base sm:text-lg font-bold text-[#f5efeb] uppercase tracking-wider">
                  Live Kitchen Dispatch Pipeline ({orders.length} Orders)
                </h2>
                <p className="text-xs text-[#8e8275]">
                  Real-time synchronization with dining room and takeaway patrons.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {['all', 'received', 'preparing', 'ready', 'completed', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1 text-[11px] font-semibold uppercase rounded-sm whitespace-nowrap cursor-pointer ${
                      orderFilter === st
                        ? 'bg-[#c5a880] text-[#070d14]'
                        : 'bg-[#0a111a] text-[#8e8275] hover:text-[#ded6cc] border border-[#c5a880]/20'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.length === 0 ? (
                <div className="col-span-full py-12 text-center bg-[#0a111a] border border-[#c5a880]/20 rounded-sm">
                  <p className="text-xs text-[#8e8275]">No orders match the selected filter.</p>
                </div>
              ) : (
                filteredOrders.map((ord) => (
                  <div key={ord.id} className="bg-[#0a111a] border border-[#c5a880]/25 p-5 rounded-sm flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-[#c5a880]/15">
                        <span className="font-mono text-sm font-bold text-[#c5a880]">{ord.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ord.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                          ord.status === 'ready' ? 'bg-cyan-500/20 text-cyan-400' :
                          ord.status === 'preparing' ? 'bg-amber-500/20 text-amber-400' :
                          ord.status === 'cancelled' ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {ord.status}
                        </span>
                      </div>

                      <div className="py-2">
                        <p className="font-bold text-xs text-[#f5efeb]">{ord.userName}</p>
                        <p className="text-[11px] text-[#8e8275]">
                          Type: <span className="uppercase text-[#c5a880]">{ord.diningType}</span>
                          {ord.tableNumber && ` · Table ${ord.tableNumber}`}
                        </p>
                        {ord.deliveryAddress && (
                          <p className="text-[10px] text-[#8e8275] truncate">Dest: {ord.deliveryAddress}</p>
                        )}
                        <p className="text-[10px] text-[#6e6357] mt-0.5 font-mono">
                          {new Date(ord.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="space-y-1.5 py-2 text-xs border-y border-[#c5a880]/10 max-h-36 overflow-y-auto">
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
                        <span>Grand Total:</span>
                        <span className="font-mono text-[#c5a880]">${ord.total.toFixed(2)}</span>
                      </div>

                      <div className="grid grid-cols-4 gap-1">
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'preparing')}
                          className="py-1 text-[10px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-bold rounded cursor-pointer text-center"
                        >
                          Kitchen
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'ready')}
                          className="py-1 text-[10px] bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-bold rounded cursor-pointer text-center"
                        >
                          Ready
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'completed')}
                          className="py-1 text-[10px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold rounded cursor-pointer text-center"
                        >
                          Served
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'cancelled')}
                          className="py-1 text-[10px] bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-bold rounded cursor-pointer text-center"
                        >
                          Void
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: TABLE RESERVATIONS */}
        {/* ============================================================== */}
        {activeTab === 'reservations' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-cinzel text-base sm:text-lg font-bold text-[#f5efeb] uppercase tracking-wider">
                  Table Reservation Ledger ({reservations.length} Bookings)
                </h2>
                <p className="text-xs text-[#8e8275]">
                  Manage table seatings, private salon buyouts, and guest accommodations.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {['all', 'pending', 'confirmed', 'seated', 'completed', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setResFilter(st)}
                    className={`px-3 py-1 text-[11px] font-semibold uppercase rounded-sm whitespace-nowrap cursor-pointer ${
                      resFilter === st
                        ? 'bg-[#c5a880] text-[#070d14]'
                        : 'bg-[#0a111a] text-[#8e8275] hover:text-[#ded6cc] border border-[#c5a880]/20'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-[#0a111a] border border-[#c5a880]/20 rounded-sm overflow-x-auto shadow-2xl">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-[#080e16] text-[#8e8275] uppercase text-[10px] tracking-wider border-b border-[#c5a880]/20">
                  <tr>
                    <th className="py-3 px-4">Reservation Code</th>
                    <th className="py-3 px-4">Guest Information</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Party Size</th>
                    <th className="py-3 px-4">Seating Zone</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c5a880]/10">
                  {filteredReservations.map((res) => (
                    <tr key={res.id} className="hover:bg-[#070d14]/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#c5a880]">{res.code}</td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-[#f5efeb]">{res.guestName}</p>
                        <p className="text-[10px] text-[#8e8275]">{res.guestEmail} · {res.guestPhone}</p>
                        {res.specialRequests && (
                          <p className="text-[10px] text-[#c5a880] italic mt-0.5">Req: {res.specialRequests}</p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[#ded6cc]">{res.date} at {res.time}</td>
                      <td className="py-3 px-4 font-mono">{res.guests} Guests</td>
                      <td className="py-3 px-4 text-[#c5a880] font-medium">{res.seatingArea}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          res.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                          res.status === 'seated' ? 'bg-blue-500/20 text-blue-400' :
                          res.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => handleUpdateReservationStatus(res.id, 'confirmed')}
                          className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded text-[10px] font-semibold cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleUpdateReservationStatus(res.id, 'seated')}
                          className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-[10px] font-semibold cursor-pointer"
                        >
                          Seat
                        </button>
                        <button
                          onClick={() => handleUpdateReservationStatus(res.id, 'completed')}
                          className="px-2 py-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 rounded text-[10px] font-semibold cursor-pointer"
                        >
                          Done
                        </button>
                        <button
                          onClick={() => handleUpdateReservationStatus(res.id, 'cancelled')}
                          className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded text-[10px] font-semibold cursor-pointer"
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

        {/* ============================================================== */}
        {/* TAB 7: PATRON REVIEWS MODERATION */}
        {/* ============================================================== */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-cinzel text-base sm:text-lg font-bold text-[#f5efeb] uppercase tracking-wider">
                  Patron Review Moderation ({reviews.length} Total)
                </h2>
                <p className="text-xs text-[#8e8275]">
                  Only approved reviews are published onto the public restaurant homepage.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {['all', 'pending', 'approved', 'rejected'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setReviewFilter(st)}
                    className={`px-3 py-1 text-[11px] font-semibold uppercase rounded-sm whitespace-nowrap cursor-pointer ${
                      reviewFilter === st
                        ? 'bg-[#c5a880] text-[#070d14]'
                        : 'bg-[#0a111a] text-[#8e8275] hover:text-[#ded6cc] border border-[#c5a880]/20'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredReviews.length === 0 ? (
                <div className="py-12 text-center bg-[#0a111a] border border-[#c5a880]/20 rounded-sm">
                  <p className="text-xs text-[#8e8275]">No reviews match current status.</p>
                </div>
              ) : (
                filteredReviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-[#0a111a] border border-[#c5a880]/20 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-[#f5efeb]">{rev.userName}</span>
                        <div className="flex text-[#c5a880] text-xs">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          rev.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                          rev.status === 'rejected' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {rev.status}
                        </span>
                        {rev.isFeatured && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#c5a880]/20 text-[#c5a880]">
                            Featured on Homepage
                          </span>
                        )}
                        <span className="text-[10px] text-[#6e6357]">· Visit: {rev.visitDate}</span>
                      </div>
                      
                      <p className="font-cinzel text-xs font-bold text-[#c5a880]">"{rev.title}"</p>
                      <p className="text-xs text-[#a89b8d] leading-relaxed">{rev.comment}</p>
                      {rev.dishRecommended && (
                        <p className="text-[11px] text-[#ded6cc]">
                          Recommended: <span className="text-[#c5a880] font-medium">{rev.dishRecommended}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                      <button
                        onClick={() => handleUpdateReviewStatus(rev.id, 'approved', !rev.isFeatured)}
                        className="px-3 py-1.5 text-xs bg-[#c5a880]/15 hover:bg-[#c5a880]/25 text-[#c5a880] rounded font-medium cursor-pointer"
                      >
                        {rev.isFeatured ? 'Unfeature' : 'Feature'}
                      </button>
                      {rev.status !== 'approved' && (
                        <button
                          onClick={() => handleUpdateReviewStatus(rev.id, 'approved')}
                          className="px-3 py-1.5 text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded font-medium cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                      {rev.status !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateReviewStatus(rev.id, 'rejected')}
                          className="px-3 py-1.5 text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded font-medium cursor-pointer"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 8: SUPABASE INTEGRATION HUB */}
        {/* ============================================================== */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <div className="bg-[#0a111a] border border-[#c5a880]/30 p-6 rounded-sm space-y-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="font-cinzel text-lg font-bold text-[#f5efeb] uppercase tracking-wider flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#c5a880]" />
                    <span>Supabase Backend Integration Center</span>
                  </h2>
                  <p className="text-xs text-[#8e8275] mt-1">
                    Connect your real Supabase project, initialize tables & storage, and inspect SQL migrations.
                  </p>
                </div>

                {isLiveSupabase ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/40 rounded text-emerald-400 text-xs font-bold">
                    <CheckCircle className="w-4 h-4" />
                    <span>Live Supabase Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/15 border border-amber-500/40 rounded text-amber-400 text-xs font-bold">
                    <AlertCircle className="w-4 h-4" />
                    <span>Local Fallback Mode Active</span>
                  </div>
                )}
              </div>

              {/* Quick Actions Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  type="button"
                  onClick={triggerSeedDatabase}
                  disabled={isSeeding}
                  className="p-4 bg-[#070d14] border border-[#c5a880]/30 hover:border-[#c5a880] rounded-sm text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[#c5a880] mb-1">
                    <span className="font-cinzel font-bold text-xs uppercase tracking-wider">
                      Seed Supabase Initial Data
                    </span>
                    <RefreshCw className={`w-4 h-4 ${isSeeding ? 'animate-spin' : 'group-hover:rotate-180 transition-transform'}`} />
                  </div>
                  <p className="text-[11px] text-[#8e8275] leading-relaxed">
                    Instantly writes all {menuItems.length} dishes, default settings, gallery photos, and sample reviews into your Supabase database.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSqlModal(true)}
                  className="p-4 bg-[#070d14] border border-[#c5a880]/30 hover:border-[#c5a880] rounded-sm text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[#c5a880] mb-1">
                    <span className="font-cinzel font-bold text-xs uppercase tracking-wider">
                      View & Copy SQL Migration
                    </span>
                    <Copy className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] text-[#8e8275] leading-relaxed">
                    View the complete PostgreSQL migration script to execute in Supabase SQL Editor for tables, RLS policies, and storage bucket.
                  </p>
                </button>
              </div>

              {/* Supabase Connection Form */}
              <form onSubmit={handleSaveCredentials} className="pt-4 border-t border-[#c5a880]/15 space-y-4">
                <h3 className="font-cinzel text-xs font-bold text-[#c5a880] uppercase tracking-wider">
                  Supabase Project Credentials Configuration
                </h3>
                <p className="text-[11px] text-[#8e8275]">
                  You can specify your Supabase Project URL and Anon/Public Key here. These values are saved locally and immediately initialize the live Supabase client.
                </p>

                <div className="grid grid-cols-1 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                      Project URL (e.g. https://your-project-id.supabase.co)
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://xyzcompany.supabase.co"
                      value={supabaseUrlInput}
                      onChange={(e) => setSupabaseUrlInput(e.target.value)}
                      className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0] font-mono focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                      Project Anon / Public API Key
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={supabaseKeyInput}
                      onChange={(e) => setSupabaseKeyInput(e.target.value)}
                      className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0] font-mono focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#c5a880] hover:bg-[#b89b74] text-[#070d14] font-cinzel text-xs font-bold uppercase tracking-wider rounded-sm cursor-pointer shadow-md"
                  >
                    Save & Test Connection
                  </button>
                </div>
              </form>

              {/* Instructions Box */}
              <div className="p-4 bg-[#070d14] border border-[#c5a880]/20 rounded-sm text-xs space-y-2">
                <h4 className="font-cinzel text-xs font-bold text-[#f8f5f0] uppercase tracking-wider">
                  Quick Supabase 2-Step Activation Checklist:
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-[#8e8275] text-[11px]">
                  <li>
                    Open your Supabase Project &gt; <strong className="text-[#ded6cc]">SQL Editor</strong> &gt; click <strong className="text-[#ded6cc]">New Query</strong> &gt; paste the provided SQL script &gt; click <strong className="text-[#c5a880]">Run</strong>.
                  </li>
                  <li>
                    In Supabase &gt; <strong className="text-[#ded6cc]">Storage</strong> &gt; verify the bucket <strong className="text-[#c5a880]">{STORAGE_BUCKET}</strong> exists and is set to <strong className="text-[#ded6cc]">Public</strong>.
                  </li>
                  <li>
                    Click <strong className="text-[#c5a880]">Seed Supabase Initial Data</strong> above to populate all tables in one click!
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* MODAL 1: ADD / EDIT DISH */}
      {/* ============================================================== */}
      {showDishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a111a] border border-[#c5a880] rounded-sm max-w-lg w-full p-6 shadow-2xl relative text-[#ded6cc] max-h-[90vh] overflow-y-auto">
            <h3 className="font-cinzel text-lg font-bold text-[#f5efeb] mb-4 uppercase">
              {editingDishId ? 'Refine Culinary Dish' : 'Introduce Culinary Dish'}
            </h3>

            <form onSubmit={handleSaveDish} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                  Dish Name *
                </label>
                <input
                  type="text"
                  required
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
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
                    value={dishCategory}
                    onChange={(e) => setDishCategory(e.target.value as MenuCategory)}
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
                    value={dishPrice}
                    onChange={(e) => setDishPrice(e.target.value)}
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
                  value={dishDesc}
                  onChange={(e) => setDishDesc(e.target.value)}
                  placeholder="Artisanal preparation, reductions, pairings..."
                  className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0]"
                />
              </div>

              {/* Image Picker */}
              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                  Dish Photograph
                </label>
                <div className="flex gap-3 items-center">
                  <div className="relative group shrink-0 w-16 h-16 rounded-sm overflow-hidden border border-[#c5a880]/40 bg-[#070d14]">
                    <img
                      src={dishImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <AdminImageUploadBadge
                      folder="dishes"
                      onUploaded={(newUrl) => setDishImage(newUrl)}
                      compact
                      title="Upload dish photo from device"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={dishImage}
                      onChange={(e) => setDishImage(e.target.value)}
                      placeholder="Image URL or local asset"
                      className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3 py-1.5 text-xs text-[#f8f5f0]"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#070d14] border border-[#c5a880]/40 hover:border-[#c5a880] text-[#c5a880] text-[11px] rounded-sm cursor-pointer transition-colors">
                      <Upload className="w-3 h-3" />
                      <span>{dishUploading ? 'Uploading to Supabase...' : 'Upload from Device'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleDishImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dishIsVeg}
                    onChange={(e) => setDishIsVeg(e.target.checked)}
                    className="rounded border-[#c5a880]/40 bg-[#070d14] text-[#c5a880]"
                  />
                  <span>Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dishIsSpecial}
                    onChange={(e) => setDishIsSpecial(e.target.checked)}
                    className="rounded border-[#c5a880]/40 bg-[#070d14] text-[#c5a880]"
                  />
                  <span>Chef's Special</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dishIsBestseller}
                    onChange={(e) => setDishIsBestseller(e.target.checked)}
                    className="rounded border-[#c5a880]/40 bg-[#070d14] text-[#c5a880]"
                  />
                  <span>Bestseller</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#c5a880]/20">
                <button
                  type="button"
                  onClick={() => setShowDishModal(false)}
                  className="px-4 py-2 text-[#8e8275] hover:text-[#f8f5f0] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#c5a880] hover:bg-[#b89b74] text-[#070d14] font-cinzel text-xs font-bold uppercase tracking-wider rounded-sm cursor-pointer"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: ADD GALLERY ITEM */}
      {/* ============================================================== */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a111a] border border-[#c5a880] rounded-sm max-w-md w-full p-6 shadow-2xl relative text-[#ded6cc]">
            <h3 className="font-cinzel text-lg font-bold text-[#f5efeb] mb-4 uppercase">
              Add Photo to Gallery
            </h3>

            <form onSubmit={handleCreateGalleryItem} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={galleryTitle}
                  onChange={(e) => setGalleryTitle(e.target.value)}
                  placeholder="e.g. The Grand Crystal Dining Salon"
                  className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                  Category *
                </label>
                <select
                  value={galleryCategory}
                  onChange={(e) => setGalleryCategory(e.target.value as GalleryItem['category'])}
                  className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3 py-2 text-xs text-[#f8f5f0]"
                >
                  <option value="Dining Room">Dining Room</option>
                  <option value="Dishes">Dishes</option>
                  <option value="Culinary Art">Culinary Art</option>
                  <option value="Wine & Cocktails">Wine & Cocktails</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                  Image URL or Direct Upload *
                </label>
                <div className="flex gap-3 items-center">
                  <div className="relative group shrink-0 w-14 h-14 rounded-sm overflow-hidden border border-[#c5a880]/40 bg-[#070d14] flex items-center justify-center">
                    {galleryUrl ? (
                      <img src={galleryUrl} alt="Gallery Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-[#8e8275]" />
                    )}
                    <AdminImageUploadBadge
                      folder="gallery"
                      onUploaded={(newUrl) => setGalleryUrl(newUrl)}
                      compact
                      title="Upload photo from device"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      required
                      value={galleryUrl}
                      onChange={(e) => setGalleryUrl(e.target.value)}
                      placeholder="Upload via top-left or enter URL/path"
                      className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#ded6cc] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={galleryDesc}
                  onChange={(e) => setGalleryDesc(e.target.value)}
                  placeholder="Atmosphere, sommelier note, architecture..."
                  className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#c5a880]/20">
                <button
                  type="button"
                  onClick={() => setShowGalleryModal(false)}
                  className="px-4 py-2 text-[#8e8275] hover:text-[#f8f5f0] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#c5a880] hover:bg-[#b89b74] text-[#070d14] font-cinzel text-xs font-bold uppercase tracking-wider rounded-sm cursor-pointer"
                >
                  Save to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: SQL SCHEMA VIEWER */}
      {/* ============================================================== */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a111a] border border-[#c5a880] rounded-sm max-w-3xl w-full p-6 shadow-2xl relative text-[#ded6cc] max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#c5a880]/20">
              <div>
                <h3 className="font-cinzel text-base font-bold text-[#f5efeb] uppercase">
                  Supabase PostgreSQL Migration Script
                </h3>
                <p className="text-xs text-[#8e8275]">
                  Execute this SQL in Supabase Dashboard &gt; SQL Editor &gt; New Query.
                </p>
              </div>

              <button
                onClick={() => copyToClipboard(SQL_SCHEMA_PREVIEW, 'sql')}
                className="px-4 py-1.5 bg-[#c5a880] hover:bg-[#b89b74] text-[#070d14] font-cinzel text-xs font-bold uppercase rounded-sm flex items-center gap-1.5 cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-950" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied Script!' : 'Copy Entire SQL'}</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <pre className="p-4 bg-[#070d14] border border-[#c5a880]/20 rounded text-[11px] font-mono text-[#a89b8d] whitespace-pre-wrap select-all">
                {SQL_SCHEMA_PREVIEW}
              </pre>
            </div>

            <div className="pt-3 border-t border-[#c5a880]/20 flex justify-end">
              <button
                onClick={() => setShowSqlModal(false)}
                className="px-5 py-2 border border-[#c5a880]/40 text-[#c5a880] font-cinzel text-xs font-bold uppercase rounded-sm cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// SQL Preview Constant for the in-app modal
const SQL_SCHEMA_PREVIEW = `-- ==============================================================================
-- BROSO LUXURY RESTAURANT - COMPLETE SUPABASE SCHEMA & RLS MIGRATION
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles & User Roles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = check_user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Restaurant Settings
CREATE TABLE IF NOT EXISTS public.restaurant_settings (
  id TEXT PRIMARY KEY DEFAULT 'settings_default',
  restaurant_name TEXT NOT NULL DEFAULT 'BROSO',
  tagline TEXT DEFAULT 'Taste Royale Cuisine',
  phone TEXT DEFAULT '+1 (877) 485-0700',
  email TEXT DEFAULT 'concierge@broso.com',
  address TEXT DEFAULT '450 Royale Boulevard, Penthouse Pavilion, Metropolitan Arts District, NY 10019',
  opening_hours_weekday TEXT DEFAULT 'Tue – Thu: 12:00 PM – 10:30 PM',
  opening_hours_weekend TEXT DEFAULT 'Fri – Sat: 12:00 PM – 11:30 PM',
  opening_hours_sunday TEXT DEFAULT 'Sun: 1:00 PM – 10:00 PM (Mon: Private Buyouts)',
  hero_subtitle TEXT DEFAULT 'Welcome to Our Restaurant',
  hero_title TEXT DEFAULT 'TASTE ROYALE CUISINE',
  hero_description TEXT DEFAULT 'An unparalleled fine dining sanctuary where centuries-old royal Awadhi heritage meets modern artisanal Italian culinary mastery.',
  hero_image_url TEXT,
  about_title TEXT DEFAULT 'THE NOBLE PURSUIT OF GASTRONOMY',
  about_story TEXT,
  about_secondary_story TEXT,
  about_image_url TEXT,
  years_heritage TEXT DEFAULT '18+',
  patrons_served TEXT DEFAULT '45K+',
  signature_recipes_count TEXT DEFAULT '68',
  master_chefs_count TEXT DEFAULT '12',
  instagram_url TEXT,
  facebook_url TEXT,
  tripadvisor_url TEXT,
  footer_text TEXT,
  logo_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu Categories & Items
CREATE TABLE IF NOT EXISTS public.menu_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.menu_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  is_vegetarian BOOLEAN DEFAULT FALSE,
  is_chef_special BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders & Order Items
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  user_name TEXT NOT NULL,
  user_email TEXT,
  user_phone TEXT,
  dining_type TEXT NOT NULL,
  table_number TEXT,
  delivery_address TEXT,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  subtotal NUMERIC(10, 2) NOT NULL,
  tax NUMERIC(10, 2) NOT NULL,
  discount NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'received',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  dish_id TEXT,
  dish_name TEXT NOT NULL,
  dish_price NUMERIC(10, 2) NOT NULL,
  quantity INT NOT NULL,
  instructions TEXT
);

-- Reservations
CREATE TABLE IF NOT EXISTS public.reservations (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  user_id TEXT,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  guests INT NOT NULL,
  seating_area TEXT NOT NULL,
  special_requests TEXT,
  occasion TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  user_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  dish_recommended TEXT,
  visit_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Realtime Publications
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.restaurant_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery_images;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;

-- Storage Bucket setup for restaurant-assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('restaurant-assets', 'restaurant-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;
`;
