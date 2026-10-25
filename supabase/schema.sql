-- ==============================================================================
-- BROSO LUXURY RESTAURANT - COMPLETE SUPABASE SCHEMA & RLS MIGRATION
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER PROFILES & ROLES
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

-- Helper function to check if current authenticated user has the 'admin' role
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = check_user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. RESTAURANT SETTINGS & HOMEPAGE CONTENT
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
  hero_description TEXT DEFAULT 'An unparalleled fine dining sanctuary where centuries-old royal Awadhi heritage meets modern artisanal Italian culinary mastery and rare vintage cellaring.',
  hero_image_url TEXT,
  about_title TEXT DEFAULT 'THE NOBLE PURSUIT OF GASTRONOMY',
  about_story TEXT,
  about_secondary_story TEXT,
  about_image_url TEXT,
  years_heritage TEXT DEFAULT '18+',
  patrons_served TEXT DEFAULT '45K+',
  signature_recipes_count TEXT DEFAULT '68',
  cellar_bottles_count TEXT DEFAULT '1,200+',
  social_instagram TEXT DEFAULT 'https://instagram.com/broso.royale',
  social_facebook TEXT DEFAULT 'https://facebook.com/broso.royale',
  social_tripadvisor TEXT DEFAULT 'https://tripadvisor.com',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MENU CATEGORIES & ITEMS
CREATE TABLE IF NOT EXISTS public.menu_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.menu_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  image_url TEXT,
  is_vegetarian BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  is_chef_special BOOLEAN DEFAULT FALSE,
  available BOOLEAN DEFAULT TRUE,
  calories INT,
  prep_time TEXT,
  ingredients TEXT[],
  pairing TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for category searches & price filters
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON public.menu_items(available);

-- 5. GALLERY IMAGES
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDERS & ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT,
  subtotal NUMERIC(10,2) NOT NULL,
  tax NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  discount NUMERIC(10,2) DEFAULT 0.00,
  total NUMERIC(10,2) NOT NULL,
  dining_type TEXT NOT NULL CHECK (dining_type IN ('dine_in', 'pickup', 'delivery')),
  table_number TEXT,
  delivery_address TEXT,
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'preparing', 'ready', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  dish_id TEXT NOT NULL,
  dish_name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  special_instructions TEXT
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- 7. RESERVATIONS
CREATE TABLE IF NOT EXISTS public.reservations (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  guests INT NOT NULL DEFAULT 2,
  seating_area TEXT NOT NULL,
  special_requests TEXT,
  occasion TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'seated', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON public.reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON public.reservations(date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations(status);

-- 8. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_role TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  dish_recommended TEXT,
  visit_date DATE NOT NULL,
  is_verified_visit BOOLEAN DEFAULT TRUE,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'rejected')),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_is_featured ON public.reviews(is_featured);

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- PROFILES
DROP POLICY IF EXISTS "Public can view basic profiles" ON public.profiles;
CREATE POLICY "Public can view basic profiles" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- USER ROLES
DROP POLICY IF EXISTS "Users can read own role" ON public.user_roles;
CREATE POLICY "Users can read own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.is_admin());

-- RESTAURANT SETTINGS (Public read, admin write)
DROP POLICY IF EXISTS "Public can view restaurant settings" ON public.restaurant_settings;
CREATE POLICY "Public can view restaurant settings" ON public.restaurant_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can update restaurant settings" ON public.restaurant_settings;
CREATE POLICY "Admins can update restaurant settings" ON public.restaurant_settings
  FOR ALL USING (public.is_admin());

-- MENU ITEMS (Public read, admin write)
DROP POLICY IF EXISTS "Public can view menu items" ON public.menu_items;
CREATE POLICY "Public can view menu items" ON public.menu_items
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage menu items" ON public.menu_items;
CREATE POLICY "Admins can manage menu items" ON public.menu_items
  FOR ALL USING (public.is_admin());

-- MENU CATEGORIES
DROP POLICY IF EXISTS "Public can view menu categories" ON public.menu_categories;
CREATE POLICY "Public can view menu categories" ON public.menu_categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage menu categories" ON public.menu_categories;
CREATE POLICY "Admins can manage menu categories" ON public.menu_categories
  FOR ALL USING (public.is_admin());

-- GALLERY IMAGES
DROP POLICY IF EXISTS "Public can view gallery images" ON public.gallery_images;
CREATE POLICY "Public can view gallery images" ON public.gallery_images
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage gallery images" ON public.gallery_images;
CREATE POLICY "Admins can manage gallery images" ON public.gallery_images
  FOR ALL USING (public.is_admin());

-- REVIEWS (Public can see approved, authenticated can insert, admins can manage)
DROP POLICY IF EXISTS "Public can view approved reviews" ON public.reviews;
CREATE POLICY "Public can view approved reviews" ON public.reviews
  FOR SELECT USING (status = 'approved' OR public.is_admin());

DROP POLICY IF EXISTS "Authenticated can insert reviews" ON public.reviews;
CREATE POLICY "Authenticated can insert reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admins can manage reviews" ON public.reviews;
CREATE POLICY "Admins can manage reviews" ON public.reviews
  FOR ALL USING (public.is_admin());

-- RESERVATIONS (Guests can create, view their own; admins can manage all)
DROP POLICY IF EXISTS "Guests can create reservations" ON public.reservations;
CREATE POLICY "Guests can create reservations" ON public.reservations
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own reservations" ON public.reservations;
CREATE POLICY "Users can view own reservations" ON public.reservations
  FOR SELECT USING (
    auth.uid() = user_id 
    OR (auth.jwt() ->> 'email' = guest_email)
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Admins can manage reservations" ON public.reservations;
CREATE POLICY "Admins can manage reservations" ON public.reservations
  FOR ALL USING (public.is_admin());

-- ORDERS & ORDER ITEMS
DROP POLICY IF EXISTS "Guests and users can create orders" ON public.orders;
CREATE POLICY "Guests and users can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (
    auth.uid() = user_id 
    OR (auth.jwt() ->> 'email' = user_email)
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Admins can manage orders" ON public.orders;
CREATE POLICY "Admins can manage orders" ON public.orders
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Users can insert order items" ON public.order_items;
CREATE POLICY "Users can insert order items" ON public.order_items
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users and admins can view order items" ON public.order_items;
CREATE POLICY "Users and admins can view order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

-- ==============================================================================
-- 10. REALTIME CONFIGURATION
-- ==============================================================================
-- Enable publication replication for instant live updates across visitors
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.restaurant_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery_images;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;

-- ==============================================================================
-- 11. SUPABASE STORAGE BUCKET CONFIGURATION
-- ==============================================================================
-- Insert the public assets bucket if not existing
INSERT INTO storage.buckets (id, name, public)
VALUES ('restaurant-assets', 'restaurant-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Public can view images from the restaurant-assets bucket
DROP POLICY IF EXISTS "Public can view restaurant assets" ON storage.objects;
CREATE POLICY "Public can view restaurant assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'restaurant-assets');

-- Admins can upload, update, and delete files in restaurant-assets bucket
DROP POLICY IF EXISTS "Admins can upload restaurant assets" ON storage.objects;
CREATE POLICY "Admins can upload restaurant assets" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'restaurant-assets'
    AND (public.is_admin() OR auth.role() = 'authenticated')
  );

DROP POLICY IF EXISTS "Admins can delete restaurant assets" ON storage.objects;
CREATE POLICY "Admins can delete restaurant assets" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'restaurant-assets'
    AND (public.is_admin() OR auth.role() = 'authenticated')
  );

-- ==============================================================================
-- 12. INITIAL ADMIN USER HELPER
-- Replace 'YOUR_USER_UUID_HERE' with your actual Supabase auth.users ID
-- or execute: INSERT INTO public.user_roles (user_id, role) VALUES ('<id>', 'admin');
-- ==============================================================================
