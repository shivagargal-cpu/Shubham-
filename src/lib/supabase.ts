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

  if (!isSupabaseLive() || !supabase) {
    // Graceful fallback to data URL when Supabase Storage is not yet provisioned
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          url: reader.result as string,
          path: filePath,
        });
      };
      reader.onerror = () => {
        resolve({
          url: '',
          path: '',
          error: 'Failed to process local image file.',
        });
      };
      reader.readAsDataURL(file);
    });
  }

  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.warn('Supabase storage upload returned error, falling back to data URL:', error.message);
      // Fallback to data URL if bucket doesn't exist yet so admin workflow isn't blocked
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            url: reader.result as string,
            path: filePath,
            error: `Storage bucket '${STORAGE_BUCKET}' not created yet. Image loaded locally. (Supabase msg: ${error.message})`,
          });
        };
        reader.readAsDataURL(file);
      });
    }

    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path);

    return {
      url: publicUrlData.publicUrl,
      path: data.path,
    };
  } catch (err: any) {
    return {
      url: '',
      path: '',
      error: err.message || 'Error occurred during image upload.',
    };
  }
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
