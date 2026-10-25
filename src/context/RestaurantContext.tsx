import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase, isSupabaseLive } from '../lib/supabase';
import { supabaseService } from '../services/supabaseService';
import { apiService } from '../services/apiService';
import { storage } from '../services/storage';
import { 
  User, 
  MenuItem, 
  CartItem, 
  Reservation, 
  Order, 
  Review, 
  GalleryItem,
  RestaurantSettings,
  DiningType,
  PaymentMethod,
  SeatingArea
} from '../types';
import { DEFAULT_RESTAURANT_SETTINGS, INITIAL_GALLERY } from '../data/initialData';

interface RestaurantContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  settings: RestaurantSettings;
  menuItems: MenuItem[];
  gallery: GalleryItem[];
  cart: CartItem[];
  reservations: Reservation[];
  orders: Order[];
  reviews: Review[];
  toastMessage: string | null;
  isLiveSupabase: boolean;
  showToast: (msg: string) => void;
  handleAddToCart: (dish: MenuItem, quantity?: number, instructions?: string) => void;
  handleUpdateQuantity: (dishId: string, quantity: number) => void;
  handleRemoveItem: (dishId: string) => void;
  handleClearCart: () => void;
  handleBookReservation: (data: {
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    date: string;
    time: string;
    guests: number;
    seatingArea: SeatingArea;
    specialRequests?: string;
    occasion?: string;
  }) => Promise<Reservation>;
  handleCancelReservation: (resId: string) => Promise<void>;
  handleSubmitReview: (data: {
    rating: number;
    title: string;
    comment: string;
    dishRecommended?: string;
    visitDate: string;
  }) => Promise<void>;
  handlePlaceOrder: (orderData: {
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
  }) => Promise<Order>;
  handleLogout: () => void;
  handleAddMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  handleUpdateMenuItem: (id: string, updates: Partial<MenuItem>) => Promise<void>;
  handleDeleteMenuItem: (id: string) => Promise<void>;
  handleUpdateSettings: (updates: Partial<RestaurantSettings>) => Promise<void>;
  handleAddGalleryItem: (item: Omit<GalleryItem, 'id'>) => Promise<void>;
  handleUpdateGalleryItem: (id: string, updates: Partial<GalleryItem>) => Promise<void>;
  handleDeleteGalleryItem: (id: string) => Promise<void>;
  handleUpdateReservationStatus: (id: string, status: Reservation['status']) => Promise<void>;
  handleUpdateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  handleUpdateReviewStatus: (id: string, status: Review['status'], isFeatured?: boolean) => Promise<void>;
  handleSeedSupabase: () => Promise<{ success: boolean; message: string }>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => storage.getCurrentUser());
  const [settings, setSettings] = useState<RestaurantSettings>(() => storage.getSettings());
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => storage.getMenuItems());
  const [gallery, setGallery] = useState<GalleryItem[]>(() => storage.getGallery());
  const [cart, setCart] = useState<CartItem[]>(() => storage.getCart());
  const [reservations, setReservations] = useState<Reservation[]>(() => storage.getReservations());
  const [orders, setOrders] = useState<Order[]>(() => storage.getOrders());
  const [reviews, setReviews] = useState<Review[]>(() => storage.getReviews());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isLiveSupabase = isSupabaseLive();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // Initial load & sync from Server (apiService) + Supabase
  const refreshData = useCallback(async () => {
    try {
      // 1. First fetch server-authoritative shared store
      const serverData = await apiService.getData();
      if (serverData) {
        if (serverData.settings) {
          setSettings(serverData.settings);
          storage.saveSettings(serverData.settings);
        }
        if (serverData.menuItems && serverData.menuItems.length > 0) {
          setMenuItems(serverData.menuItems);
          storage.saveMenuItems(serverData.menuItems);
        }
        if (serverData.gallery && serverData.gallery.length > 0) {
          setGallery(serverData.gallery);
          storage.saveGallery(serverData.gallery);
        }
        if (serverData.reservations) {
          setReservations(serverData.reservations);
          storage.saveReservations(serverData.reservations);
        }
        if (serverData.orders) {
          setOrders(serverData.orders);
          storage.saveOrders(serverData.orders);
        }
        if (serverData.reviews) {
          setReviews(serverData.reviews);
          storage.saveReviews(serverData.reviews);
        }
      }

      // 2. If Supabase is live, also query Supabase
      if (isLiveSupabase) {
        const [fetchedSettings, fetchedMenu, fetchedGallery, fetchedRes, fetchedOrders, fetchedReviews] = await Promise.all([
          supabaseService.getSettings(),
          supabaseService.getMenuItems(),
          supabaseService.getGallery(),
          supabaseService.getReservations(),
          supabaseService.getOrders(),
          supabaseService.getReviews(),
        ]);

        if (fetchedSettings) setSettings(fetchedSettings);
        if (fetchedMenu && fetchedMenu.length > 0) setMenuItems(fetchedMenu);
        if (fetchedGallery && fetchedGallery.length > 0) setGallery(fetchedGallery);
        if (fetchedRes) setReservations(fetchedRes);
        if (fetchedOrders) setOrders(fetchedOrders);
        if (fetchedReviews) setReviews(fetchedReviews);
      }
    } catch (err) {
      console.warn('Data refresh caught error, utilizing cached local state:', err);
    }
  }, [isLiveSupabase]);

  useEffect(() => {
    refreshData();

    // Live background polling every 4 seconds to sync changes to ALL visitors across all devices
    const pollInterval = setInterval(async () => {
      try {
        const serverData = await apiService.getData();
        if (serverData) {
          if (serverData.settings) setSettings(serverData.settings);
          if (serverData.menuItems) setMenuItems(serverData.menuItems);
          if (serverData.gallery) setGallery(serverData.gallery);
          if (serverData.reservations) setReservations(serverData.reservations);
          if (serverData.orders) setOrders(serverData.orders);
          if (serverData.reviews) setReviews(serverData.reviews);
        }
      } catch {
        // quiet fallback
      }
    }, 4000);

    return () => clearInterval(pollInterval);
  }, [refreshData]);

  // Local storage events synchronization
  useEffect(() => {
    const handleAuthChange = () => setCurrentUser(storage.getCurrentUser());
    const handleMenuChange = () => setMenuItems(storage.getMenuItems());
    const handleSettingsChange = () => setSettings(storage.getSettings());
    const handleGalleryChange = () => setGallery(storage.getGallery());
    const handleCartChange = () => setCart(storage.getCart());
    const handleReservationsChange = () => setReservations(storage.getReservations());
    const handleOrdersChange = () => setOrders(storage.getOrders());
    const handleReviewsChange = () => setReviews(storage.getReviews());

    window.addEventListener('broso_auth_change', handleAuthChange);
    window.addEventListener('broso_menu_change', handleMenuChange);
    window.addEventListener('broso_settings_change', handleSettingsChange);
    window.addEventListener('broso_gallery_change', handleGalleryChange);
    window.addEventListener('broso_cart_change', handleCartChange);
    window.addEventListener('broso_reservations_change', handleReservationsChange);
    window.addEventListener('broso_orders_change', handleOrdersChange);
    window.addEventListener('broso_reviews_change', handleReviewsChange);

    return () => {
      window.removeEventListener('broso_auth_change', handleAuthChange);
      window.removeEventListener('broso_menu_change', handleMenuChange);
      window.removeEventListener('broso_settings_change', handleSettingsChange);
      window.removeEventListener('broso_gallery_change', handleGalleryChange);
      window.removeEventListener('broso_cart_change', handleCartChange);
      window.removeEventListener('broso_reservations_change', handleReservationsChange);
      window.removeEventListener('broso_orders_change', handleOrdersChange);
      window.removeEventListener('broso_reviews_change', handleReviewsChange);
    };
  }, []);

  // Real-time Supabase Synchronizations
  useEffect(() => {
    if (!isLiveSupabase || !supabase) return;

    // Subscriptions on live database changes
    const menuChannel = supabase
      .channel('realtime_menu')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, async () => {
        const updated = await supabaseService.getMenuItems();
        setMenuItems(updated);
      })
      .subscribe();

    const settingsChannel = supabase
      .channel('realtime_settings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'restaurant_settings' }, async () => {
        const updated = await supabaseService.getSettings();
        setSettings(updated);
      })
      .subscribe();

    const galleryChannel = supabase
      .channel('realtime_gallery')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, async () => {
        const updated = await supabaseService.getGallery();
        setGallery(updated);
      })
      .subscribe();

    const reservationsChannel = supabase
      .channel('realtime_reservations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, async () => {
        const updated = await supabaseService.getReservations();
        setReservations(updated);
      })
      .subscribe();

    const ordersChannel = supabase
      .channel('realtime_orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, async () => {
        const updated = await supabaseService.getOrders();
        setOrders(updated);
      })
      .subscribe();

    const reviewsChannel = supabase
      .channel('realtime_reviews')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, async () => {
        const updated = await supabaseService.getReviews();
        setReviews(updated);
      })
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(menuChannel);
        supabase.removeChannel(settingsChannel);
        supabase.removeChannel(galleryChannel);
        supabase.removeChannel(reservationsChannel);
        supabase.removeChannel(ordersChannel);
        supabase.removeChannel(reviewsChannel);
      }
    };
  }, [isLiveSupabase]);

  // Cart operations
  const handleAddToCart = (dish: MenuItem, quantity = 1, instructions?: string) => {
    const existingIdx = cart.findIndex((item) => item.dish.id === dish.id);
    let updated: CartItem[];

    if (existingIdx > -1) {
      updated = [...cart];
      updated[existingIdx].quantity += quantity;
      if (instructions) {
        updated[existingIdx].specialInstructions = instructions;
      }
    } else {
      updated = [...cart, { dish, quantity, specialInstructions: instructions }];
    }

    setCart(updated);
    storage.saveCart(updated);
    showToast(`Added ${quantity > 1 ? `${quantity}x ` : ''}${dish.name} to your order.`);
  };

  const handleUpdateQuantity = (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(dishId);
      return;
    }
    const updated = cart.map((item) => 
      item.dish.id === dishId ? { ...item, quantity } : item
    );
    setCart(updated);
    storage.saveCart(updated);
  };

  const handleRemoveItem = (dishId: string) => {
    const updated = cart.filter((item) => item.dish.id !== dishId);
    setCart(updated);
    storage.saveCart(updated);
  };

  const handleClearCart = () => {
    setCart([]);
    storage.saveCart([]);
  };

  // Database mutations with dual-sync (Server + Supabase)
  const handleBookReservation = async (data: Parameters<typeof storage.createReservation>[0]) => {
    const payload = {
      ...data,
      userId: currentUser?.id,
    };
    const [_, res] = await Promise.all([
      apiService.createReservation(payload),
      supabaseService.createReservation(payload),
    ]);
    setReservations(storage.getReservations());
    return res;
  };

  const handleCancelReservation = async (resId: string) => {
    await Promise.all([
      apiService.updateReservationStatus(resId, 'cancelled'),
      supabaseService.updateReservationStatus(resId, 'cancelled'),
    ]);
    setReservations(storage.getReservations());
    showToast('Reservation cancelled.');
  };

  const handleSubmitReview = async (data: {
    rating: number;
    title: string;
    comment: string;
    dishRecommended?: string;
    visitDate: string;
  }) => {
    const payload = {
      ...data,
      userId: currentUser?.id || 'guest-' + Date.now(),
      userName: currentUser?.name || 'Verified Patron',
      userRole: currentUser?.role === 'admin' ? 'Executive Sommelier' : 'Verified Patron',
      isVerifiedVisit: true,
    };
    await Promise.all([
      apiService.createReview(payload),
      supabaseService.createReview(payload),
    ]);
    setReviews(storage.getReviews());
    showToast('Your verified impression has been submitted.');
  };

  const handlePlaceOrder = async (orderData: Parameters<typeof storage.createOrder>[0]) => {
    const [_, created] = await Promise.all([
      apiService.createOrder(orderData),
      supabaseService.createOrder(orderData),
    ]);
    handleClearCart();
    setOrders(storage.getOrders());
    return created;
  };

  const handleLogout = () => {
    storage.logout();
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    setCurrentUser(null);
    showToast('Signed out of royal membership.');
  };

  const handleAddMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    await Promise.all([
      apiService.addMenuItem(item),
      supabaseService.addMenuItem(item),
    ]);
    setMenuItems(storage.getMenuItems());
    showToast('New culinary dish added to menu.');
  };

  const handleUpdateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    await Promise.all([
      apiService.updateMenuItem(id, updates),
      supabaseService.updateMenuItem(id, updates),
    ]);
    setMenuItems(storage.getMenuItems());
    showToast('Dish details updated.');
  };

  const handleDeleteMenuItem = async (id: string) => {
    await Promise.all([
      apiService.deleteMenuItem(id),
      supabaseService.deleteMenuItem(id),
    ]);
    setMenuItems(storage.getMenuItems());
    showToast('Dish removed from menu.');
  };

  const handleUpdateSettings = async (updates: Partial<RestaurantSettings>) => {
    const [serverRes, updated] = await Promise.all([
      apiService.updateSettings(updates),
      supabaseService.updateSettings(updates),
    ]);
    const finalSettings = serverRes || updated;
    setSettings(finalSettings);
    storage.saveSettings(finalSettings);
    showToast('Website content published.');
  };

  const handleAddGalleryItem = async (item: Omit<GalleryItem, 'id'>) => {
    await Promise.all([
      apiService.addGalleryItem(item),
      supabaseService.addGalleryItem(item),
    ]);
    setGallery(storage.getGallery());
    showToast('New visual asset published to gallery.');
  };

  const handleDeleteGalleryItem = async (id: string) => {
    await Promise.all([
      apiService.deleteGalleryItem(id),
      supabaseService.deleteGalleryItem(id),
    ]);
    setGallery(storage.getGallery());
    showToast('Visual asset removed from gallery.');
  };

  const handleUpdateGalleryItem = async (id: string, updates: Partial<GalleryItem>) => {
    await Promise.all([
      apiService.updateGalleryItem(id, updates),
      supabaseService.updateGalleryItem(id, updates),
    ]);
    setGallery(storage.getGallery());
    showToast('Gallery image updated.');
  };

  const handleUpdateReservationStatus = async (id: string, status: Reservation['status']) => {
    await Promise.all([
      apiService.updateReservationStatus(id, status),
      supabaseService.updateReservationStatus(id, status),
    ]);
    setReservations(storage.getReservations());
  };

  const handleUpdateOrderStatus = async (id: string, status: Order['status']) => {
    await Promise.all([
      apiService.updateOrderStatus(id, status),
      supabaseService.updateOrderStatus(id, status),
    ]);
    setOrders(storage.getOrders());
  };

  const handleUpdateReviewStatus = async (id: string, status: Review['status'], isFeatured?: boolean) => {
    await Promise.all([
      apiService.updateReviewStatus(id, status, isFeatured),
      supabaseService.updateReviewStatus(id, status, isFeatured),
    ]);
    setReviews(storage.getReviews());
  };

  const handleSeedSupabase = async () => {
    const res = await supabaseService.seedSupabaseDatabase();
    if (res.success) {
      await refreshData();
    }
    showToast(res.message);
    return res;
  };

  return (
    <RestaurantContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        settings,
        menuItems,
        gallery,
        cart,
        reservations,
        orders,
        reviews,
        toastMessage,
        isLiveSupabase,
        showToast,
        handleAddToCart,
        handleUpdateQuantity,
        handleRemoveItem,
        handleClearCart,
        handleBookReservation,
        handleCancelReservation,
        handleSubmitReview,
        handlePlaceOrder,
        handleLogout,
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
        handleSeedSupabase,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
