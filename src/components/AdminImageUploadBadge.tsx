import React, { useRef, useState } from 'react';
import { Upload, RefreshCw } from 'lucide-react';
import { uploadImageToStorage } from '../lib/supabase';
import { useRestaurant } from '../context/RestaurantContext';

interface AdminImageUploadBadgeProps {
  folder?: string;
  onUploaded: (url: string) => void | Promise<void>;
  compact?: boolean;
  label?: string;
  title?: string;
  className?: string;
}

/**
 * Top-left corner image upload button exclusively for the Admin Panel.
 * Allows instant direct-from-device uploads to Supabase Storage.
 */
export const AdminImageUploadBadge: React.FC<AdminImageUploadBadgeProps> = ({
  folder = 'general',
  onUploaded,
  compact = false,
  label = 'Upload',
  title = 'Click to upload and replace image from your device',
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { showToast } = useRestaurant();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so re-selecting same file triggers change
    e.target.value = '';

    setIsUploading(true);
    try {
      const res = await uploadImageToStorage(file, folder);
      if (res.error && !res.url) {
        showToast(res.error);
      } else if (res.url) {
        await onUploaded(res.url);
        showToast(`Image uploaded & updated successfully.`);
      }
    } catch (err: any) {
      showToast(`Upload failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`absolute top-1.5 left-1.5 z-20 ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
        disabled={isUploading}
        title={title}
        aria-label={title}
        className={`bg-[#060a10]/90 hover:bg-[#c5a880] text-[#c5a880] hover:text-[#070d14] border border-[#c5a880]/70 rounded-xs shadow-xl transition-all duration-200 backdrop-blur-sm cursor-pointer flex items-center gap-1 active:scale-95 ${
          compact
            ? 'p-1 hover:scale-105'
            : 'px-2 py-1 text-[10px] font-cinzel font-bold uppercase tracking-wider'
        }`}
      >
        {isUploading ? (
          <RefreshCw className="w-3 h-3 animate-spin text-[#c5a880]" />
        ) : (
          <Upload className="w-3 h-3" />
        )}
        {!compact && (
          <span className="hidden sm:inline">
            {isUploading ? 'Uploading...' : label}
          </span>
        )}
      </button>
    </div>
  );
};
