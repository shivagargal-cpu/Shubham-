import React from 'react';
import { ContactSection } from '../components/ContactSection';

export const ContactPage: React.FC = () => {
  return (
    <div className="py-12 bg-[#05090f]">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="border-b border-[#c5a880]/20 pb-8 text-center max-w-3xl mx-auto">
          <span className="text-xs tracking-[0.25em] text-[#c5a880] uppercase font-bold block mb-2">
            ✦ Inquiries & Salon Location ✦
          </span>
          <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold text-[#f5efeb] tracking-[0.06em] uppercase">
            CONTACT & CONCIERGE
          </h1>
          <p className="text-xs sm:text-sm text-[#a89b8d] mt-3 leading-relaxed">
            Our Head Concierge and Maître d’Hôtel are at your service for reservations, private tastings, press inquiries, and bespoke gala planning.
          </p>
        </div>
      </div>

      {/* Main Contact Section with map, hours, and message form */}
      <ContactSection />
    </div>
  );
};
