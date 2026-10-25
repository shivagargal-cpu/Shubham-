import { 
  User, 
  MenuItem, 
  Reservation, 
  Order, 
  Review, 
  CartItem, 
  DiningType, 
  PaymentMethod,
  SeatingArea,
  RestaurantSettings,
  GalleryItem
} from '../types';
import { 
  INITIAL_MENU_ITEMS, 
  INITIAL_REVIEWS, 
  INITIAL_RESERVATIONS, 
  INITIAL_ORDERS,
  INITIAL_GALLERY,
  DEFAULT_RESTAURANT_SETTINGS
} from '../data/initialData';

const STORAGE_KEYS = {
  CURRENT_USER: 'broso_current_user',
  USERS: 'broso_users',
  MENU_ITEMS: 'broso_menu_items',
  RESERVATIONS: 'broso_reservations',
  ORDERS: 'broso_orders',
  REVIEWS: 'broso_reviews',
  CART: 'broso_cart',
  SETTINGS: 'broso_settings',
  GALLERY: 'broso_gallery',
};

// Seed initial users if not present
const DEFAULT_USERS: (User & { passwordHash: string })[] = [
  {
    id: 'user-admin',
    name: 'Executive Chef Alessandro',
    email: 'admin@broso.com',
    passwordHash: 'admin123',
    role: 'admin',
    phone: '+1 (555) 789-0123',
    avatarUrl: '/src/assets/images/chef_plating_dish_1792868334890.jpg',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'user-customer',
    name: 'Lady Vivienne Westwood',
    email: 'guest@broso.com',
    passwordHash: 'guest123',
    role: 'customer',
    phone: '+1 (555) 456-7890',
    avatarUrl: '',
    createdAt: '2026-03-15T00:00:00Z',
  }
];

export const storage = {
  // --- USERS & AUTH ---
  getUsers(): (User & { passwordHash: string })[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_USERS;
    }
  },

  getCurrentUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    window.dispatchEvent(new Event('broso_auth_change'));
  },

  register(name: string, email: string, password: string,phone?: string): { success: boolean; error?: string; user?: User } {
    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const newUser: User & { passwordHash: string } = {
      id: 'usr-' + Date.now().toString(36),
      name,
      email,
      passwordHash: password,
      role: email.toLowerCase().includes('admin') ? 'admin' : 'customer',
      phone: phone || '',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const { passwordHash: _, ...publicUser } = newUser;
    this.setCurrentUser(publicUser);
    return { success: true, user: publicUser };
  },

  login(email: string, password: string): { success: boolean; error?: string; user?: User } {
    const users = this.getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!found) {
      return { success: false, error: 'No account registered with this email.' };
    }

    if (found.passwordHash !== password) {
      return { success: false, error: 'Invalid password. Please check your credentials.' };
    }

    const { passwordHash: _, ...publicUser } = found;
    this.setCurrentUser(publicUser);
    return { success: true, user: publicUser };
  },

  loginGoogle(profile: { name: string; email: string }): User {
    const users = this.getUsers();
    let found = users.find(u => u.email.toLowerCase() === profile.email.toLowerCase());

    if (!found) {
      found = {
        id: 'usr-g-' + Date.now().toString(36),
        name: profile.name,
        email: profile.email,
        passwordHash: 'google_oauth_authorized',
        role: profile.email.toLowerCase().includes('admin') ? 'admin' : 'customer',
        createdAt: new Date().toISOString()
      };
      users.push(found);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    const { passwordHash: _, ...publicUser } = found;
    this.setCurrentUser(publicUser);
    return publicUser;
  },

  logout() {
    this.setCurrentUser(null);
  },

  // --- MENU ITEMS ---
  getMenuItems(): MenuItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.MENU_ITEMS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(INITIAL_MENU_ITEMS));
      return INITIAL_MENU_ITEMS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_MENU_ITEMS;
    }
  },

  saveMenuItems(items: MenuItem[]) {
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));
    window.dispatchEvent(new Event('broso_menu_change'));
  },

  addMenuItem(item: Omit<MenuItem, 'id'>): MenuItem {
    const items = this.getMenuItems();
    const newItem: MenuItem = {
      ...item,
      id: 'dish-' + Date.now().toString(36)
    };
    items.unshift(newItem);
    this.saveMenuItems(items);
    return newItem;
  },

  updateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem | null {
    const items = this.getMenuItems();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...updates };
    this.saveMenuItems(items);
    return items[idx];
  },

  deleteMenuItem(id: string) {
    const items = this.getMenuItems().filter(i => i.id !== id);
    this.saveMenuItems(items);
  },

  // --- RESERVATIONS ---
  getReservations(): Reservation[] {
    const data = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(INITIAL_RESERVATIONS));
      return INITIAL_RESERVATIONS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_RESERVATIONS;
    }
  },

  saveReservations(reservations: Reservation[]) {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
    window.dispatchEvent(new Event('broso_reservations_change'));
  },

  createReservation(data: {
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    date: string;
    time: string;
    guests: number;
    seatingArea: SeatingArea;
    specialRequests?: string;
    occasion?: string;
    userId?: string;
  }): Reservation {
    const reservations = this.getReservations();
    const code = 'BRS-' + Math.floor(1000 + Math.random() * 9000);
    const newRes: Reservation = {
      id: 'res-' + Date.now().toString(36),
      code,
      ...data,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    reservations.unshift(newRes);
    this.saveReservations(reservations);
    return newRes;
  },

  updateReservationStatus(id: string, status: Reservation['status']): Reservation | null {
    const list = this.getReservations();
    const idx = list.findIndex(r => r.id === id);
    if (idx === -1) return null;
    list[idx].status = status;
    this.saveReservations(list);
    return list[idx];
  },

  // --- ORDERS ---
  getOrders(): Order[] {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_ORDERS;
    }
  },

  saveOrders(orders: Order[]) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new Event('broso_orders_change'));
  },

  createOrder(data: {
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
  }): Order {
    const orders = this.getOrders();
    const newOrder: Order = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      ...data,
      status: 'received',
      createdAt: new Date().toISOString(),
      estimatedDelivery: data.diningType === 'dine_in' ? '20-25 mins' : '35-45 mins'
    };
    orders.unshift(newOrder);
    this.saveOrders(orders);
    return newOrder;
  },

  updateOrderStatus(id: string, status: Order['status']): Order | null {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === id);
    if (idx === -1) return null;
    orders[idx].status = status;
    this.saveOrders(orders);
    return orders[idx];
  },

  // --- REVIEWS ---
  getReviews(): Review[] {
    const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_REVIEWS;
    }
  },

  saveReviews(reviews: Review[]) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    window.dispatchEvent(new Event('broso_reviews_change'));
  },

  createReview(review: Omit<Review, 'id' | 'createdAt' | 'status'>): Review {
    const reviews = this.getReviews();
    const newReview: Review = {
      ...review,
      id: 'rev-' + Date.now().toString(36),
      status: 'approved', // Auto-approved for verified dining patrons, can be toggled in admin
      createdAt: new Date().toISOString()
    };
    reviews.unshift(newReview);
    this.saveReviews(reviews);
    return newReview;
  },

  updateReviewStatus(id: string, status: Review['status'], isFeatured?: boolean) {
    const reviews = this.getReviews();
    const idx = reviews.findIndex(r => r.id === id);
    if (idx === -1) return;
    reviews[idx].status = status;
    if (isFeatured !== undefined) {
      reviews[idx].isFeatured = isFeatured;
    }
    this.saveReviews(reviews);
  },

  // --- CART ---
  getCart(): CartItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.CART);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveCart(cart: CartItem[]) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    window.dispatchEvent(new Event('broso_cart_change'));
  },

  // --- RESTAURANT SETTINGS ---
  getSettings(): RestaurantSettings {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_RESTAURANT_SETTINGS));
      return DEFAULT_RESTAURANT_SETTINGS;
    }
    try {
      return { ...DEFAULT_RESTAURANT_SETTINGS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_RESTAURANT_SETTINGS;
    }
  },

  saveSettings(settings: RestaurantSettings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    window.dispatchEvent(new Event('broso_settings_change'));
  },

  // --- GALLERY ---
  getGallery(): GalleryItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.GALLERY);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(INITIAL_GALLERY));
      return INITIAL_GALLERY;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_GALLERY;
    }
  },

  saveGallery(gallery: GalleryItem[]) {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
    window.dispatchEvent(new Event('broso_gallery_change'));
  },

  addGalleryItem(item: Omit<GalleryItem, 'id'>): GalleryItem {
    const gallery = this.getGallery();
    const newItem: GalleryItem = {
      ...item,
      id: 'gal-' + Date.now().toString(36),
    };
    gallery.unshift(newItem);
    this.saveGallery(gallery);
    return newItem;
  },

  deleteGalleryItem(id: string) {
    const gallery = this.getGallery().filter((g) => g.id !== id);
    this.saveGallery(gallery);
  },

  updateGalleryItem(id: string, updates: Partial<GalleryItem>): GalleryItem | null {
    const gallery = this.getGallery();
    const idx = gallery.findIndex((g) => g.id === id);
    if (idx === -1) return null;
    gallery[idx] = { ...gallery[idx], ...updates };
    this.saveGallery(gallery);
    return gallery[idx];
  }
};

