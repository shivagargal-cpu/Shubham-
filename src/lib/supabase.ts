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
 * Upload an image file directly to Supabase Storage bucket `restaurant-assets`.
 * If Supabase is not configured, converts to a persistent data URL or local object URL.
 */
export const uploadImageToStorage = async (
  file: File,
  folder = 'general'
): Promise<{ url: string; path: string; error?: string }> => {
  // Validate file size (< 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { url: '', path: '', error: 'File size exceeds maximum limit of 5MB.' };
  }

  // Validate mime type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
  if (!allowedTypes.includes(file.type)) {
    return { url: '', path: '', error: 'Invalid file format. Please upload JPG, PNG, or WebP.' };
  }

  // Generate safe sanitized filename
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  const filePath = `${folder}/${Date.now()}_${cleanName.slice(0, 20)}.${ext}`;

  // Convert file to base64 for server-authoritative upload
  const base64Data: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // 1. Always attempt server-authoritative upload so all users on any device can access it
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
        .upload(filePath, file, {
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

  // Return server URL or data URL fallback
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
