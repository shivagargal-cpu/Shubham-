import { supabase, isSupabaseLive } from '../lib/supabase';
import { 
  MenuItem, 
  RestaurantSettings, 
  Reservation, 
  Order, 
  Review, 
  GalleryItem 
} from '../types';
import { 
  INITIAL_MENU_ITEMS, 
  INITIAL_GALLERY, 
  INITIAL_REVIEWS, 
  DEFAULT_RESTAURANT_SETTINGS 
} from '../data/initialData';
import { storage } from './storage';

export const supabaseService = {
  // ==========================================
  // RESTAURANT SETTINGS & HOMEPAGE CONTENT
  // ==========================================
  async getSettings(): Promise<RestaurantSettings | null> {
    if (!isSupabaseLive() || !supabase) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('restaurant_settings')
        .select('*')
        .eq('id', 'settings_default')
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      const restName = data.restaurant_name || 'BROSO';
      const ph = data.phone || '+1 (877) 485-0700';
      const em = data.email || 'concierge@broso.com';
      const heroImg = data.hero_image_url || DEFAULT_RESTAURANT_SETTINGS.heroImageUrl;
      const abtImg = data.about_image_url || DEFAULT_RESTAURANT_SETTINGS.aboutImageUrl;

      return {
        id: data.id,
        restaurantName: restName,
        brandName: restName,
        tagline: data.tagline || 'Taste Royale Cuisine',
        phone: ph,
        contactPhone: ph,
        email: em,
        contactEmail: em,
        address: data.address || DEFAULT_RESTAURANT_SETTINGS.address,
        openingHoursWeekday: data.opening_hours_weekday || 'Tue – Thu: 12:00 PM – 10:30 PM',
        openingHoursWeekend: data.opening_hours_weekend || 'Fri – Sat: 12:00 PM – 11:30 PM',
        openingHoursSunday: data.opening_hours_sunday || 'Sun: 1:00 PM – 10:00 PM',
        openingHours: {
          weekdays: data.opening_hours_weekday || '12:00 PM – 10:30 PM',
          weekends: data.opening_hours_weekend || '12:00 PM – 11:30 PM',
          closedDays: 'Private Buyouts & Masterclasses'
        },
        heroSubtitle: data.hero_subtitle || 'Welcome to Our Restaurant',
        heroTitle: data.hero_title || 'TASTE ROYALE CUISINE',
        heroDescription: data.hero_description || DEFAULT_RESTAURANT_SETTINGS.heroDescription,
        heroImageUrl: heroImg,
        heroImage: heroImg,
        aboutTitle: data.about_title || DEFAULT_RESTAURANT_SETTINGS.aboutTitle,
        aboutStory: data.about_story || DEFAULT_RESTAURANT_SETTINGS.aboutStory,
        aboutSecondaryStory: data.about_secondary_story || DEFAULT_RESTAURANT_SETTINGS.aboutSecondaryStory,
        aboutImageUrl: abtImg,
        aboutImage: abtImg,
        yearsHeritage: data.years_heritage || '18+',
        experienceYears: data.years_heritage || '18+',
        patronsServed: data.patrons_served || '45K+',
        happyCustomers: data.patrons_served || '45K+',
        signatureRecipesCount: data.signature_recipes_count || '68',
        signatureDishesCount: data.signature_recipes_count || '68',
        cellarBottlesCount: data.cellar_bottles_count || '1,200+',
        masterChefsCount: '12',
        socialInstagram: data.social_instagram || '',
        socialFacebook: data.social_facebook || '',
        socialTripadvisor: data.social_tripadvisor || '',
        footerText: data.footer_text || DEFAULT_RESTAURANT_SETTINGS.footerText,
        logoUrl: data.logo_url || '',
        updatedAt: data.updated_at || new Date().toISOString(),
      };
    } catch {
      return null;
    }
  },

  async updateSettings(settings: Partial<RestaurantSettings>): Promise<RestaurantSettings> {
    const current = (await this.getSettings()) || storage.getSettings();
    const merged = { ...current, ...settings, updatedAt: new Date().toISOString() };

    // Save to local storage for instant responsiveness
    storage.saveSettings(merged);

    if (isSupabaseLive() && supabase) {
      try {
        await supabase
          .from('restaurant_settings')
          .upsert({
            id: 'settings_default',
            restaurant_name: merged.restaurantName,
            tagline: merged.tagline,
            phone: merged.phone,
            email: merged.email,
            address: merged.address,
            opening_hours_weekday: merged.openingHoursWeekday,
            opening_hours_weekend: merged.openingHoursWeekend,
            opening_hours_sunday: merged.openingHoursSunday,
            hero_subtitle: merged.heroSubtitle,
            hero_title: merged.heroTitle,
            hero_description: merged.heroDescription,
            hero_image_url: merged.heroImageUrl,
            about_title: merged.aboutTitle,
            about_story: merged.aboutStory,
            about_secondary_story: merged.aboutSecondaryStory,
            about_image_url: merged.aboutImageUrl,
            years_heritage: merged.yearsHeritage,
            patrons_served: merged.patronsServed,
            signature_recipes_count: merged.signatureRecipesCount,
            cellar_bottles_count: merged.cellarBottlesCount,
            social_instagram: merged.socialInstagram,
            social_facebook: merged.socialFacebook,
            social_tripadvisor: merged.socialTripadvisor,
            updated_at: merged.updatedAt,
          });
      } catch (err) {
        console.warn('Failed to upsert settings to Supabase, saved locally:', err);
      }
    }

    return merged;
  },

  // ==========================================
  // MENU ITEMS
  // ==========================================
  async getMenuItems(): Promise<MenuItem[] | null> {
    if (!isSupabaseLive() || !supabase) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true });

      if (error || !data || data.length === 0) {
        return null;
      }

      return data.map((d: any) => ({
        id: d.id,
        name: d.name,
        category: d.category,
        description: d.description || '',
        price: parseFloat(d.price),
        imageUrl: d.image_url || '/src/assets/images/food_wagyu_steak_1792868333122.jpg',
        isVegetarian: Boolean(d.is_vegetarian),
        isBestseller: Boolean(d.is_bestseller),
        isChefSpecial: Boolean(d.is_chef_special),
        available: d.available !== false,
        calories: d.calories,
        prepTime: d.prep_time,
        ingredients: d.ingredients || [],
        pairing: d.pairing,
        rating: 5.0,
      }));
    } catch {
      return null;
    }
  },

  async addMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    const newItem = storage.addMenuItem(item);

    if (isSupabaseLive() && supabase) {
      try {
        await supabase.from('menu_items').insert({
          id: newItem.id,
          name: newItem.name,
          category: newItem.category,
          description: newItem.description,
          price: newItem.price,
          image_url: newItem.imageUrl,
          is_vegetarian: newItem.isVegetarian,
          is_bestseller: newItem.isBestseller || false,
          is_chef_special: newItem.isChefSpecial || false,
          available: newItem.available,
          calories: newItem.calories || null,
          prep_time: newItem.prepTime || null,
          ingredients: newItem.ingredients || [],
          pairing: newItem.pairing || null,
        });
      } catch (err) {
        console.warn('Supabase menu item insert fallback to local:', err);
      }
    }

    return newItem;
  },

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | null> {
    const updated = storage.updateMenuItem(id, updates);

    if (isSupabaseLive() && supabase) {
      try {
        const payload: any = { updated_at: new Date().toISOString() };
        if (updates.name !== undefined) payload.name = updates.name;
        if (updates.category !== undefined) payload.category = updates.category;
        if (updates.description !== undefined) payload.description = updates.description;
        if (updates.price !== undefined) payload.price = updates.price;
        if (updates.imageUrl !== undefined) payload.image_url = updates.imageUrl;
        if (updates.isVegetarian !== undefined) payload.is_vegetarian = updates.isVegetarian;
        if (updates.isBestseller !== undefined) payload.is_bestseller = updates.isBestseller;
        if (updates.isChefSpecial !== undefined) payload.is_chef_special = updates.isChefSpecial;
        if (updates.available !== undefined) payload.available = updates.available;
        if (updates.pairing !== undefined) payload.pairing = updates.pairing;

        await supabase.from('menu_items').update(payload).eq('id', id);
      } catch (err) {
        console.warn('Supabase menu item update fallback to local:', err);
      }
    }

    return updated;
  },

  async deleteMenuItem(id: string): Promise<void> {
    storage.deleteMenuItem(id);

    if (isSupabaseLive() && supabase) {
      try {
        await supabase.from('menu_items').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase menu item delete fallback to local:', err);
      }
    }
  },

  // ==========================================
  // GALLERY IMAGES
  // ==========================================
  async getGallery(): Promise<GalleryItem[] | null> {
    if (!isSupabaseLive() || !supabase) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return null;
      }

      return data.map((d: any) => ({
        id: d.id,
        title: d.title,
        category: d.category,
        imageUrl: d.image_url,
        description: d.description || '',
        displayOrder: d.display_order || 0,
      }));
    } catch {
      return null;
    }
  },

  async addGalleryItem(item: Omit<GalleryItem, 'id'>): Promise<GalleryItem> {
    const newItem = storage.addGalleryItem(item);

    if (isSupabaseLive() && supabase) {
      try {
        await supabase.from('gallery_images').insert({
          id: newItem.id,
          title: newItem.title,
          category: newItem.category,
          image_url: newItem.imageUrl,
          description: newItem.description,
          display_order: newItem.displayOrder || 0,
        });
      } catch (err) {
        console.warn('Supabase gallery insert fallback to local:', err);
      }
    }

    return newItem;
  },

  async deleteGalleryItem(id: string): Promise<void> {
    storage.deleteGalleryItem(id);

    if (isSupabaseLive() && supabase) {
      try {
        await supabase.from('gallery_images').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase gallery delete fallback to local:', err);
      }
    }
  },

  async updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<GalleryItem | null> {
    const updated = storage.updateGalleryItem(id, updates);

    if (isSupabaseLive() && supabase) {
      try {
        const payload: any = {};
        if (updates.title !== undefined) payload.title = updates.title;
        if (updates.category !== undefined) payload.category = updates.category;
        if (updates.imageUrl !== undefined) payload.image_url = updates.imageUrl;
        if (updates.description !== undefined) payload.description = updates.description;
        if (updates.displayOrder !== undefined) payload.display_order = updates.displayOrder;

        await supabase.from('gallery_images').update(payload).eq('id', id);
      } catch (err) {
        console.warn('Supabase gallery update fallback to local:', err);
      }
    }

    return updated;
  },

  // ==========================================
  // RESERVATIONS
  // ==========================================
  async getReservations(): Promise<Reservation[]> {
    if (!isSupabaseLive() || !supabase) {
      return storage.getReservations();
    }

    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) {
        return storage.getReservations();
      }

      return data.map((r: any) => ({
        id: r.id,
        code: r.code,
        userId: r.user_id,
        guestName: r.guest_name,
        guestEmail: r.guest_email,
        guestPhone: r.guest_phone,
        date: r.date,
        time: r.time,
        guests: r.guests,
        seatingArea: r.seating_area,
        specialRequests: r.special_requests,
        occasion: r.occasion,
        status: r.status,
        createdAt: r.created_at,
      }));
    } catch {
      return storage.getReservations();
    }
  },

  async createReservation(data: Parameters<typeof storage.createReservation>[0]): Promise<Reservation> {
    const newRes = storage.createReservation(data);

    if (isSupabaseLive() && supabase) {
      try {
        await supabase.from('reservations').insert({
          id: newRes.id,
          code: newRes.code,
          guest_name: newRes.guestName,
          guest_email: newRes.guestEmail,
          guest_phone: newRes.guestPhone,
          date: newRes.date,
          time: newRes.time,
          guests: newRes.guests,
          seating_area: newRes.seatingArea,
          special_requests: newRes.specialRequests || null,
          occasion: newRes.occasion || null,
          status: newRes.status,
        });
      } catch (err) {
        console.warn('Supabase reservation insert fallback to local:', err);
      }
    }

    return newRes;
  },

  async updateReservationStatus(id: string, status: Reservation['status']): Promise<void> {
    storage.updateReservationStatus(id, status);

    if (isSupabaseLive() && supabase) {
      try {
        await supabase.from('reservations').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
      } catch (err) {
        console.warn('Supabase reservation update fallback to local:', err);
      }
    }
  },

  // ==========================================
  // ORDERS
  // ==========================================
  async getOrders(): Promise<Order[]> {
    if (!isSupabaseLive() || !supabase) {
      return storage.getOrders();
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error || !data) {
        return storage.getOrders();
      }

      return data.map((o: any) => ({
        id: o.id,
        userId: o.user_id,
        userName: o.user_name,
        userEmail: o.user_email,
        userPhone: o.user_phone,
        subtotal: parseFloat(o.subtotal),
        tax: parseFloat(o.tax),
        discount: parseFloat(o.discount || 0),
        total: parseFloat(o.total),
        diningType: o.dining_type,
        tableNumber: o.table_number,
        deliveryAddress: o.delivery_address,
        paymentMethod: o.payment_method,
        status: o.status,
        createdAt: o.created_at,
        estimatedDelivery: o.dining_type === 'dine_in' ? '20-25 mins' : '35-45 mins',
        items: (o.order_items || []).map((it: any) => ({
          dish: {
            id: it.dish_id,
            name: it.dish_name,
            price: parseFloat(it.price),
            category: 'Main Course',
            description: '',
            imageUrl: '/src/assets/images/food_wagyu_steak_1792868333122.jpg',
            isVegetarian: false,
            available: true,
          },
          quantity: it.quantity,
          specialInstructions: it.special_instructions,
        })),
      }));
    } catch {
      return storage.getOrders();
    }
  },

  async createOrder(data: Parameters<typeof storage.createOrder>[0]): Promise<Order> {
    const newOrder = storage.createOrder(data);

    if (isSupabaseLive() && supabase) {
      try {
        await supabase.from('orders').insert({
          id: newOrder.id,
          user_name: newOrder.userName,
          user_email: newOrder.userEmail,
          user_phone: newOrder.userPhone,
          subtotal: newOrder.subtotal,
          tax: newOrder.tax,
          discount: newOrder.discount,
          total: newOrder.total,
          dining_type: newOrder.diningType,
          table_number: newOrder.tableNumber || null,
          delivery_address: newOrder.deliveryAddress || null,
          payment_method: newOrder.paymentMethod,
          status: newOrder.status,
        });

        // Insert order items
        const itemsPayload = newOrder.items.map((it) => ({
          order_id: newOrder.id,
          dish_id: it.dish.id,
          dish_name: it.dish.name,
          price: it.dish.price,
          quantity: it.quantity,
          special_instructions: it.specialInstructions || null,
        }));

        await supabase.from('order_items').insert(itemsPayload);
      } catch (err) {
        console.warn('Supabase order insert fallback to local:', err);
      }
    }

    return newOrder;
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<void> {
    storage.updateOrderStatus(id, status);

    if (isSupabaseLive() && supabase) {
      try {
        await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
      } catch (err) {
        console.warn('Supabase order status update fallback to local:', err);
      }
    }
  },

  // ==========================================
  // REVIEWS
  // ==========================================
  async getReviews(): Promise<Review[]> {
    if (!isSupabaseLive() || !supabase) {
      return storage.getReviews();
    }

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) {
        return storage.getReviews();
      }

      return data.map((r: any) => ({
        id: r.id,
        userId: r.user_id || 'guest',
        userName: r.user_name,
        userRole: r.user_role,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        dishRecommended: r.dish_recommended,
        visitDate: r.visit_date,
        isVerifiedVisit: Boolean(r.is_verified_visit),
        status: r.status,
        isFeatured: Boolean(r.is_featured),
        createdAt: r.created_at,
      }));
    } catch {
      return storage.getReviews();
    }
  },

  async createReview(data: Parameters<typeof storage.createReview>[0]): Promise<Review> {
    const newRev = storage.createReview(data);

    if (isSupabaseLive() && supabase) {
      try {
        await supabase.from('reviews').insert({
          id: newRev.id,
          user_name: newRev.userName,
          user_role: newRev.userRole || null,
          rating: newRev.rating,
          title: newRev.title,
          comment: newRev.comment,
          dish_recommended: newRev.dishRecommended || null,
          visit_date: newRev.visitDate,
          is_verified_visit: newRev.isVerifiedVisit,
          status: newRev.status,
          is_featured: newRev.isFeatured || false,
        });
      } catch (err) {
        console.warn('Supabase review insert fallback to local:', err);
      }
    }

    return newRev;
  },

  async updateReviewStatus(id: string, status: Review['status'], isFeatured?: boolean): Promise<void> {
    storage.updateReviewStatus(id, status, isFeatured);

    if (isSupabaseLive() && supabase) {
      try {
        const payload: any = { status };
        if (isFeatured !== undefined) payload.is_featured = isFeatured;
        await supabase.from('reviews').update(payload).eq('id', id);
      } catch (err) {
        console.warn('Supabase review update fallback to local:', err);
      }
    }
  },

  // ==========================================
  // DATABASE SEEDING UTILITY FOR SUPABASE
  // ==========================================
  async seedSupabaseDatabase(): Promise<{ success: boolean; message: string; details?: any }> {
    if (!isSupabaseLive() || !supabase) {
      return {
        success: false,
        message: 'Supabase is not configured yet. Please provide your Supabase URL & Anon Key.',
      };
    }

    try {
      // 1. Seed Settings
      await supabase.from('restaurant_settings').upsert({
        id: 'settings_default',
        restaurant_name: DEFAULT_RESTAURANT_SETTINGS.restaurantName,
        tagline: DEFAULT_RESTAURANT_SETTINGS.tagline,
        phone: DEFAULT_RESTAURANT_SETTINGS.phone,
        email: DEFAULT_RESTAURANT_SETTINGS.email,
        address: DEFAULT_RESTAURANT_SETTINGS.address,
        opening_hours_weekday: DEFAULT_RESTAURANT_SETTINGS.openingHoursWeekday,
        opening_hours_weekend: DEFAULT_RESTAURANT_SETTINGS.openingHoursWeekend,
        opening_hours_sunday: DEFAULT_RESTAURANT_SETTINGS.openingHoursSunday,
        hero_subtitle: DEFAULT_RESTAURANT_SETTINGS.heroSubtitle,
        hero_title: DEFAULT_RESTAURANT_SETTINGS.heroTitle,
        hero_description: DEFAULT_RESTAURANT_SETTINGS.heroDescription,
        hero_image_url: DEFAULT_RESTAURANT_SETTINGS.heroImageUrl,
        about_title: DEFAULT_RESTAURANT_SETTINGS.aboutTitle,
        about_story: DEFAULT_RESTAURANT_SETTINGS.aboutStory,
        about_secondary_story: DEFAULT_RESTAURANT_SETTINGS.aboutSecondaryStory,
        about_image_url: DEFAULT_RESTAURANT_SETTINGS.aboutImageUrl,
        years_heritage: DEFAULT_RESTAURANT_SETTINGS.yearsHeritage,
        patrons_served: DEFAULT_RESTAURANT_SETTINGS.patronsServed,
        signature_recipes_count: DEFAULT_RESTAURANT_SETTINGS.signatureRecipesCount,
        cellar_bottles_count: DEFAULT_RESTAURANT_SETTINGS.cellarBottlesCount,
        social_instagram: DEFAULT_RESTAURANT_SETTINGS.socialInstagram,
        social_facebook: DEFAULT_RESTAURANT_SETTINGS.socialFacebook,
        social_tripadvisor: DEFAULT_RESTAURANT_SETTINGS.socialTripadvisor,
      });

      // 2. Seed Menu Items
      const menuPayload = INITIAL_MENU_ITEMS.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        description: item.description,
        price: item.price,
        image_url: item.imageUrl,
        is_vegetarian: item.isVegetarian,
        is_bestseller: item.isBestseller || false,
        is_chef_special: item.isChefSpecial || false,
        available: item.available,
        calories: item.calories || null,
        prep_time: item.prepTime || null,
        ingredients: item.ingredients || [],
        pairing: item.pairing || null,
      }));
      await supabase.from('menu_items').upsert(menuPayload, { onConflict: 'id' });

      // 3. Seed Gallery
      const galleryPayload = INITIAL_GALLERY.map((g, idx) => ({
        id: g.id,
        title: g.title,
        category: g.category,
        image_url: g.imageUrl,
        description: g.description,
        display_order: idx + 1,
      }));
      await supabase.from('gallery_images').upsert(galleryPayload, { onConflict: 'id' });

      // 4. Seed Reviews
      const reviewsPayload = INITIAL_REVIEWS.map((r) => ({
        id: r.id,
        user_name: r.userName,
        user_role: r.userRole || null,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        dish_recommended: r.dishRecommended || null,
        visit_date: r.visitDate,
        is_verified_visit: r.isVerifiedVisit,
        status: r.status,
        is_featured: r.isFeatured || false,
      }));
      await supabase.from('reviews').upsert(reviewsPayload, { onConflict: 'id' });

      return {
        success: true,
        message: 'Successfully seeded restaurant settings, menu dishes, gallery, and reviews into Supabase!',
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Seeding error: ${err.message || 'Check if tables exist in Supabase.'}`,
      };
    }
  },
};
