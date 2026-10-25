import { 
  MenuItem, 
  GalleryItem, 
  RestaurantSettings, 
  Reservation, 
  Order, 
  Review 
} from '../types';

export interface FullDataResponse {
  settings: RestaurantSettings;
  menuItems: MenuItem[];
  gallery: GalleryItem[];
  reservations: Reservation[];
  orders: Order[];
  reviews: Review[];
  supabaseConfig?: {
    url: string;
    anonKey: string;
  };
}

export const apiService = {
  /**
   * Fetch full shared data from server
   */
  async getData(): Promise<FullDataResponse | null> {
    try {
      const res = await fetch('/api/data');
      if (!res.ok) return null;
      const json = await res.json();
      return json.data || null;
    } catch {
      return null;
    }
  },

  /**
   * Update shared website settings
   */
  async updateSettings(settings: Partial<RestaurantSettings>): Promise<RestaurantSettings | null> {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.settings || null;
    } catch {
      return null;
    }
  },

  /**
   * Add menu item to server
   */
  async addMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem | null> {
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.item || null;
    } catch {
      return null;
    }
  },

  /**
   * Update menu item on server
   */
  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | null> {
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.item || null;
    } catch {
      return null;
    }
  },

  /**
   * Delete menu item from server
   */
  async deleteMenuItem(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Add gallery photo to server
   */
  async addGalleryItem(item: Omit<GalleryItem, 'id'>): Promise<GalleryItem | null> {
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.item || null;
    } catch {
      return null;
    }
  },

  /**
   * Update gallery photo on server
   */
  async updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<GalleryItem | null> {
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.item || null;
    } catch {
      return null;
    }
  },

  /**
   * Delete gallery photo from server
   */
  async deleteGalleryItem(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Save shared Supabase config to server
   */
  async saveSupabaseConfig(url: string, anonKey: string): Promise<boolean> {
    try {
      const res = await fetch('/api/supabase-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, anonKey }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Upload image to server disk
   */
  async uploadImage(fileData: string, fileName: string, folder = 'general'): Promise<{ url: string; path: string } | null> {
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileData, fileName, folder }),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return { url: json.url, path: json.path };
    } catch {
      return null;
    }
  },

  /**
   * Book table reservation on server
   */
  async createReservation(data: any): Promise<Reservation | null> {
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.reservation || null;
    } catch {
      return null;
    }
  },

  /**
   * Update reservation status on server
   */
  async updateReservationStatus(id: string, status: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Place order on server
   */
  async createOrder(data: any): Promise<Order | null> {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.order || null;
    } catch {
      return null;
    }
  },

  /**
   * Update order status on server
   */
  async updateOrderStatus(id: string, status: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Submit review on server
   */
  async createReview(data: any): Promise<Review | null> {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.review || null;
    } catch {
      return null;
    }
  },

  /**
   * Update review status on server
   */
  async updateReviewStatus(id: string, status: string, isFeatured?: boolean): Promise<boolean> {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, isFeatured }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};
