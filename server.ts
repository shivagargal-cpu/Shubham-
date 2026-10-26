import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { 
  DEFAULT_RESTAURANT_SETTINGS, 
  INITIAL_MENU_ITEMS, 
  INITIAL_GALLERY, 
  INITIAL_RESERVATIONS, 
  INITIAL_ORDERS, 
  INITIAL_REVIEWS 
} from './src/data/initialData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// High body limit for base64 / image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure data and uploads directories exist
const dataDir = path.resolve(__dirname, 'data');
const storeFilePath = path.join(dataDir, 'store.json');
const uploadsDir = path.resolve(__dirname, 'public', 'uploads');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Persistent Central Store
interface ServerStore {
  settings: any;
  menuItems: any[];
  gallery: any[];
  orders: any[];
  reservations: any[];
  reviews: any[];
  supabaseConfig: {
    url: string;
    anonKey: string;
  };
}

const getInitialStore = (): ServerStore => ({
  settings: DEFAULT_RESTAURANT_SETTINGS,
  menuItems: INITIAL_MENU_ITEMS,
  gallery: INITIAL_GALLERY,
  orders: INITIAL_ORDERS,
  reservations: INITIAL_RESERVATIONS,
  reviews: INITIAL_REVIEWS,
  supabaseConfig: {
    url: process.env.VITE_SUPABASE_URL || '',
    anonKey: process.env.VITE_SUPABASE_ANON_KEY || '',
  },
});

let store: ServerStore = getInitialStore();

// Load existing store from disk if present
if (fs.existsSync(storeFilePath)) {
  try {
    const raw = fs.readFileSync(storeFilePath, 'utf-8');
    const parsed = JSON.parse(raw);
    store = {
      ...getInitialStore(),
      ...parsed,
      settings: { ...DEFAULT_RESTAURANT_SETTINGS, ...(parsed.settings || {}) },
      supabaseConfig: {
        url: (process.env.VITE_SUPABASE_URL || parsed.supabaseConfig?.url || '').replace('.supabase.com', '.supabase.co'),
        anonKey: process.env.VITE_SUPABASE_ANON_KEY || parsed.supabaseConfig?.anonKey || '',
      },
    };
  } catch (err) {
    console.warn('Failed to parse existing store.json, using defaults:', err);
  }
} else {
  try {
    fs.writeFileSync(storeFilePath, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not initialize store.json on disk:', err);
  }
}

const saveStore = () => {
  try {
    fs.writeFileSync(storeFilePath, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing store.json:', err);
  }
};

// Serve static uploads
app.use('/uploads', express.static(uploadsDir));

// ==============================================================================
// REST API ENDPOINTS (Shared by ALL visitors and admin across all devices)
// ==============================================================================

// 1. Full Shared Data Snapshot
app.get('/api/data', (_req, res) => {
  res.json({
    success: true,
    data: store,
  });
});

// 2. Supabase Configuration (Shared across all users)
app.get('/api/supabase-config', (_req, res) => {
  res.json({
    success: true,
    config: store.supabaseConfig,
  });
});

app.post('/api/supabase-config', (req, res) => {
  const { url, anonKey } = req.body;
  store.supabaseConfig = {
    url: (url || '').trim().replace('.supabase.com', '.supabase.co'),
    anonKey: (anonKey || '').trim(),
  };
  saveStore();
  res.json({ success: true, config: store.supabaseConfig });
});

// 3. Website Content & Settings
app.post('/api/settings', (req, res) => {
  const updates = req.body;
  store.settings = {
    ...store.settings,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveStore();
  res.json({ success: true, settings: store.settings });
});

// 4. Menu Items CRUD
app.post('/api/menu', (req, res) => {
  const item = req.body;
  const newItem = {
    ...item,
    id: item.id || `dish-${Date.now().toString(36)}`,
    available: item.available !== false,
  };
  store.menuItems.unshift(newItem);
  saveStore();
  res.json({ success: true, item: newItem });
});

app.put('/api/menu/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const idx = store.menuItems.findIndex((m) => m.id === id);
  if (idx !== -1) {
    store.menuItems[idx] = { ...store.menuItems[idx], ...updates };
    saveStore();
    res.json({ success: true, item: store.menuItems[idx] });
  } else {
    res.status(404).json({ success: false, message: 'Item not found' });
  }
});

app.delete('/api/menu/:id', (req, res) => {
  const { id } = req.params;
  store.menuItems = store.menuItems.filter((m) => m.id !== id);
  saveStore();
  res.json({ success: true, id });
});

// 5. Gallery Items CRUD
app.post('/api/gallery', (req, res) => {
  const item = req.body;
  const newItem = {
    ...item,
    id: item.id || `gal-${Date.now().toString(36)}`,
    displayOrder: store.gallery.length + 1,
  };
  store.gallery.unshift(newItem);
  saveStore();
  res.json({ success: true, item: newItem });
});

app.put('/api/gallery/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const idx = store.gallery.findIndex((g) => g.id === id);
  if (idx !== -1) {
    store.gallery[idx] = { ...store.gallery[idx], ...updates };
    saveStore();
    res.json({ success: true, item: store.gallery[idx] });
  } else {
    res.status(404).json({ success: false, message: 'Gallery item not found' });
  }
});

app.delete('/api/gallery/:id', (req, res) => {
  const { id } = req.params;
  store.gallery = store.gallery.filter((g) => g.id !== id);
  saveStore();
  res.json({ success: true, id });
});

// 6. Table Reservations
app.post('/api/reservations', (req, res) => {
  const data = req.body;
  const code = 'BRS-' + Math.floor(1000 + Math.random() * 9000);
  const newRes = {
    ...data,
    id: data.id || `res-${Date.now().toString(36)}`,
    code,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
  store.reservations.unshift(newRes);
  saveStore();
  res.json({ success: true, reservation: newRes });
});

app.put('/api/reservations/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const idx = store.reservations.findIndex((r) => r.id === id);
  if (idx !== -1) {
    store.reservations[idx].status = status;
    saveStore();
    res.json({ success: true, reservation: store.reservations[idx] });
  } else {
    res.status(404).json({ success: false, message: 'Reservation not found' });
  }
});

// 7. Orders Pipeline
app.post('/api/orders', (req, res) => {
  const data = req.body;
  const newOrder = {
    ...data,
    id: data.id || `ORD-${Date.now().toString(36).toUpperCase()}`,
    status: 'received',
    createdAt: new Date().toISOString(),
  };
  store.orders.unshift(newOrder);
  saveStore();
  res.json({ success: true, order: newOrder });
});

app.put('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const idx = store.orders.findIndex((o) => o.id === id);
  if (idx !== -1) {
    store.orders[idx].status = status;
    saveStore();
    res.json({ success: true, order: store.orders[idx] });
  } else {
    res.status(404).json({ success: false, message: 'Order not found' });
  }
});

// 8. Reviews
app.post('/api/reviews', (req, res) => {
  const review = req.body;
  const newReview = {
    ...review,
    id: review.id || `rev-${Date.now().toString(36)}`,
    status: 'approved',
    createdAt: new Date().toISOString(),
  };
  store.reviews.unshift(newReview);
  saveStore();
  res.json({ success: true, review: newReview });
});

app.put('/api/reviews/:id', (req, res) => {
  const { id } = req.params;
  const { status, isFeatured } = req.body;
  const idx = store.reviews.findIndex((r) => r.id === id);
  if (idx !== -1) {
    if (status !== undefined) store.reviews[idx].status = status;
    if (isFeatured !== undefined) store.reviews[idx].isFeatured = isFeatured;
    saveStore();
    res.json({ success: true, review: store.reviews[idx] });
  } else {
    res.status(404).json({ success: false, message: 'Review not found' });
  }
});

// 9. Server File Image Upload (Base64 / Data URL to Server Disk)
app.post('/api/upload', (req, res) => {
  try {
    const { fileData, fileName, folder = 'general' } = req.body;
    if (!fileData) {
      return res.status(400).json({ success: false, message: 'Missing file data' });
    }

    const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer: Buffer;
    let ext = 'jpg';

    if (matches && matches.length === 3) {
      const mime = matches[1];
      ext = mime.split('/')[1] || 'jpg';
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(fileData, 'base64');
    }

    const targetFolder = path.join(uploadsDir, folder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const safeName = (fileName || 'image')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .toLowerCase();
    const finalFilename = `${Date.now()}_${safeName.slice(0, 20)}.${ext}`;
    const filePath = path.join(targetFolder, finalFilename);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${folder}/${finalFilename}`;
    res.json({
      success: true,
      url: publicUrl,
      path: `${folder}/${finalFilename}`,
    });
  } catch (err: any) {
    console.error('Server upload error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==============================================================================
// VITE DEV SERVER OR PRODUCTION STATIC SERVING + SPA REWRITE (PREVENTS 404 ON REFRESH)
// ==============================================================================

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const distDir = path.resolve(__dirname, 'dist');

  if (!isProd && !fs.existsSync(path.join(distDir, 'index.html'))) {
    // Development Mode with Vite Middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa', // Automatically handles SPA fallback for all HTML requests
    });

    app.use(vite.middlewares);
  } else {
    // Production Mode: Serve built dist files + SPA Wildcard rewrite
    app.use(express.static(distDir));
    app.use(express.static(path.resolve(__dirname, 'public')));

    // SPA Wildcard fallback: guarantees direct refreshes on /menu, /about, /admin, etc. NEVER 404
    app.get('*', (_req, res) => {
      const indexPath = path.join(distDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(200).send('BROSO Luxury Fine Dining Application Initializing...');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BROSO Suite] Running at http://0.0.0.0:${PORT} in ${isProd ? 'production' : 'development'} mode.`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
