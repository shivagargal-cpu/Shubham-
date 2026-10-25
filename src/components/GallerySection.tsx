import React, { useState } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { GalleryItem } from '../types';
import { useRestaurant } from '../context/RestaurantContext';
import { AdminImageUploadBadge } from './AdminImageUploadBadge';

export const GallerySection: React.FC = () => {
  const { gallery, handleUpdateGalleryItem } = useRestaurant();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const categories = ['All', 'Dining Room', 'Dishes', 'Culinary Art', 'Wine & Cocktails'];

  const filteredGallery = selectedCategory === 'All'
    ? gallery
    : gallery.filter((item) => item.category === selectedCategory);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + filteredGallery.length) % filteredGallery.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % filteredGallery.length);
    }
  };

  return (
    <section id="gallery" className="relative bg-[#05090f] py-24 border-b border-[#c5a880]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="font-playfair italic text-sm text-[#c5a880] tracking-widest mb-1.5">
            Atmospheric Visual Showcase
          </p>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5efeb] tracking-[0.08em] uppercase">
            RESTAURANT & CULINARY GALLERY
          </h2>
          <div className="w-16 h-[2px] bg-[#c5a880] mx-auto mt-4" />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-sm transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#c5a880] text-[#070d14] shadow-md shadow-[#c5a880]/20'
                  : 'bg-[#0a111a] border border-[#c5a880]/20 text-[#a89b8d] hover:text-[#f8f5f0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setActiveLightboxIndex(idx)}
              className="relative h-72 rounded-sm overflow-hidden border border-[#c5a880]/20 group cursor-pointer shadow-lg bg-[#0a111a]"
            >
              <AdminImageUploadBadge
                folder="gallery"
                label="Change"
                compact
                title={`Admin: Replace gallery photo (${item.title})`}
                onUploaded={async (newUrl) => {
                  await handleUpdateGalleryItem(item.id, { imageUrl: newUrl });
                }}
              />
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060a10]/90 via-[#060a10]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#c5a880] mb-1">
                  {item.category}
                </span>
                <h4 className="font-cinzel text-base font-bold text-[#f8f5f0]">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#ded6cc] line-clamp-2 mt-1">
                  {item.description}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-[#c5a880] font-medium">
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Larger</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* FULL-SCREEN LIGHTBOX MODAL */}
      {activeLightboxIndex !== null && (
        <div 
          onClick={() => setActiveLightboxIndex(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          {/* Close Button */}
          <button
            onClick={() => setActiveLightboxIndex(null)}
            className="absolute top-6 right-6 z-50 p-2 text-[#ded6cc] hover:text-[#c5a880] bg-[#0a111a]/80 border border-[#c5a880]/30 rounded-full transition-colors"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev Button */}
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 z-50 p-3 text-[#ded6cc] hover:text-[#c5a880] bg-[#0a111a]/80 border border-[#c5a880]/30 rounded-full transition-colors"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Image & Caption */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full flex flex-col items-center"
          >
            <div className="relative max-h-[75vh] overflow-hidden rounded-sm border border-[#c5a880]/40 shadow-2xl">
              <AdminImageUploadBadge
                folder="gallery"
                label="Replace Photo"
                title={`Admin: Replace photo for ${filteredGallery[activeLightboxIndex].title}`}
                onUploaded={async (newUrl) => {
                  await handleUpdateGalleryItem(filteredGallery[activeLightboxIndex].id, { imageUrl: newUrl });
                }}
              />
              <img
                src={filteredGallery[activeLightboxIndex].imageUrl}
                alt={filteredGallery[activeLightboxIndex].title}
                className="w-full h-full max-h-[75vh] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="text-center mt-5">
              <span className="text-xs uppercase tracking-widest text-[#c5a880] font-semibold">
                {filteredGallery[activeLightboxIndex].category}
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#f8f5f0] mt-1">
                {filteredGallery[activeLightboxIndex].title}
              </h3>
              <p className="text-xs sm:text-sm text-[#a89b8d] max-w-lg mx-auto mt-2">
                {filteredGallery[activeLightboxIndex].description}
              </p>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-8 z-50 p-3 text-[#ded6cc] hover:text-[#c5a880] bg-[#0a111a]/80 border border-[#c5a880]/30 rounded-full transition-colors"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

    </section>
  );
};
