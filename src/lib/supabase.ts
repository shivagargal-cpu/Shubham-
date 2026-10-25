import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get Supabase credentials from Vite environment or localStorage override
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('broso_supabase_url') : null;
  const localAnonKey = typeof window !== 'undefined' ? localStorage.getItem('broso_supabase_anon_key') : null;

  const url = (localUrl && localUrl.trim()) || (envUrl && envUrl.trim()) || '';
  const anonKey = (localAnonKey && localAnonKey.trim()) || (envAnonKey && envAnonKey.trim()) || '';

  const isConfigured = Boolean(url && anonKey && url.startsWith('http') && !url.includes('placeholder'));

  return { url, anonKey, isConfigured };
};

const config = getSupabaseConfig();

// Singleton Supabase client instance
export const supabase: SupabaseClient | null = config.isConfigured
  ? createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

/**
 * Check if active live connection to Supabase is enabled
 */
export const isSupabaseLive = (): boolean => {
  return Boolean(supabase && getSupabaseConfig().isConfigured);
};

export const STORAGE_BUCKET = 'restaurant-assets';

/**
 * Compress and downscale large image files from mobile cameras
 */
const compressImageFile = async (file: File): Promise<{ base64: string; blob: Blob }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const MAX_DIM = 1600;
        let { width, height } = img;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas context not available'));
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const base64 = canvas.toDataURL(mime, 0.85);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ base64, blob });
            } else {
              resolve({ base64, blob: file });
            }
          },
          mime,
          0.85
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Upload an image file directly to Supabase Storage bucket `restaurant-assets` and server store.
 * Supports large mobile camera photos by automatically optimizing them.
 */
export const uploadImageToStorage = async (
  file: File,
  folder = 'general'
): Promise<{ url: string; path: string; error?: string }> => {
  // Validate mime type
  const allowedPrefixes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
  if (!allowedPrefixes.some((t) => file.type.startsWith(t))) {
    return { url: '', path: '', error: 'Invalid format. Please select a JPG, PNG, or WebP photo.' };
  }

  // Compress and prepare image data
  let base64Data = '';
  let uploadBlob: Blob = file;

  try {
    const optimized = await compressImageFile(file);
    base64Data = optimized.base64;
    uploadBlob = optimized.blob;
  } catch {
    base64Data = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  const filePath = `${folder}/${Date.now()}_${cleanName.slice(0, 20)}.${ext}`;

  // 1. First upload to server backend so all devices can fetch it
  let serverUrl = '';
  try {
    const serverRes = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileData: base64Data,
        fileName: file.name,
        folder,
      }),
    });
    if (serverRes.ok) {
      const serverJson = await serverRes.json();
      if (serverJson.url) {
        serverUrl = serverJson.url;
      }
    }
  } catch (err) {
    console.warn('Server upload fallback:', err);
  }

  // 2. If Supabase Storage is active, also upload to Supabase bucket
  if (isSupabaseLive() && supabase) {
    try {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, uploadBlob, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(data.path);

        return {
          url: publicUrlData.publicUrl,
          path: data.path,
        };
      }
    } catch (err) {
      console.warn('Supabase storage upload error, utilizing server URL:', err);
    }
  }

  // Return server URL or high-fidelity base64 data URL
  return {
    url: serverUrl || base64Data,
    path: filePath,
  };
};

/**
 * Remove an image file from Supabase Storage bucket
 */
export const deleteImageFromStorage = async (filePath: string): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseLive() || !supabase || !filePath || filePath.startsWith('data:') || filePath.startsWith('/')) {
    return { success: true };
  }

  try {
    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};
