export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
}

export type MenuCategory = 
  | 'All'
  | 'Starters'
  | 'Main Course'
  | 'Indian'
  | 'Italian'
  | 'Desserts'
  | 'Beverages';

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  description: string;
  price: number;
  imageUrl: string;
  isVegetarian: boolean;
  isBestseller?: boolean;
  isChefSpecial?: boolean;
  calories?: number;
  prepTime?: string;
  rating?: number;
  ingredients?: string[];
  pairing?: string;
  available: boolean;
}

export interface CartItem {
  dish: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type DiningType = 'dine_in' | 'pickup' | 'delivery';
export type PaymentMethod = 'card' | 'digital_wallet' | 'cod';

export interface Order {
  id: string;
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
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery?: string;
}

export type SeatingArea = 'Main Royal Hall' | 'Private Wine Vault' | 'Skyline Terrace' | "Chef's Counter";
export type ReservationStatus = 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled';

export interface Reservation {
  id: string;
  code: string;
  userId?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  date: string;
  time: string;
  guests: number;
  seatingArea: SeatingArea;
  specialRequests?: string;
  occasion?: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userRole?: string;
  rating: number;
  title: string;
  comment: string;
  dishRecommended?: string;
  visitDate: string;
  isVerifiedVisit: boolean;
  status: 'approved' | 'pending' | 'rejected';
  isFeatured?: boolean;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Dining Room' | 'Dishes' | 'Culinary Art' | 'Wine & Cocktails';
  imageUrl: string;
  description: string;
  displayOrder?: number;
}

export interface RestaurantSettings {
  id: string;
  restaurantName: string;
  brandName: string;
  tagline: string;
  phone: string;
  contactPhone: string;
  email: string;
  contactEmail: string;
  address: string;
  openingHoursWeekday: string;
  openingHoursWeekend: string;
  openingHoursSunday: string;
  openingHours: {
    weekdays: string;
    weekends: string;
    closedDays: string;
  };
  heroSubtitle: string;
  heroTitle: string;
  heroDescription: string;
  heroImageUrl: string;
  heroImage: string;
  aboutTitle: string;
  aboutStory: string;
  aboutSecondaryStory: string;
  aboutImageUrl: string;
  aboutImage: string;
  yearsHeritage: string;
  experienceYears: string;
  patronsServed: string;
  happyCustomers: string;
  signatureRecipesCount: string;
  signatureDishesCount: string;
  cellarBottlesCount: string;
  masterChefsCount: string;
  socialInstagram: string;
  socialFacebook: string;
  socialTripadvisor: string;
  footerText: string;
  logoUrl?: string;
  updatedAt: string;
}
