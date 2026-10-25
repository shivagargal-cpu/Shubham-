import React from 'react';
import { GallerySection } from '../components/GallerySection';
import { Link } from 'react-router-dom';
import { Camera, Calendar } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  return (
    <div className="py-12 bg-[#05090f]">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="border-b border-[#c5a880]/20 pb-8 text-center max-w-3xl mx-auto">
          <span className="text-xs tracking-[0.25em] text-[#c5a880] uppercase font-bold block mb-2">
            ✦ Visual Salon ✦
          </span>
          <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold text-[#f5efeb] tracking-[0.06em] uppercase">
            RESTAURANT & CULINARY GALLERY
          </h1>
          <p className="text-xs sm:text-sm text-[#a89b8d] mt-3 leading-relaxed">
            A window into the architectural splendour of our Grand Imperial Hall, the artistry of our plating pass, and rare bottles resting in our private vintage vault.
          </p>
        </div>
      </div>

      {/* Responsive Gallery with Category Filters & Lightbox */}
      <GallerySection />

      {/* Bottom CTA */}
      <div className="py-16 bg-[#070d14] text-center border-t border-[#c5a880]/15">
        <div className="max-w-md mx-auto px-4 space-y-4">
          <p className="font-cinzel text-xl font-bold text-[#f5efeb]">
            SEE THE GRANDEUR WITH YOUR OWN EYES
          </p>
          <p className="text-xs text-[#a89b8d]">
            Reserve an evening table in our Main Hall, Private Wine Vault, or Skyline Terrace.
          </p>
          <div className="pt-2">
            <Link
              to="/reservations"
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#c5a880] hover:bg-[#b59870] text-[#070d14] font-cinzel text-xs font-bold tracking-widest uppercase rounded-sm transition-all shadow-lg"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Table Seating</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
