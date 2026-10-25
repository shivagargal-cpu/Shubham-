import React from 'react';
import { TableReservation } from '../components/TableReservation';
import { useRestaurant } from '../context/RestaurantContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Phone, Clock, UserCheck } from 'lucide-react';

export const ReservationsPage: React.FC = () => {
  const { currentUser, handleBookReservation } = useRestaurant();
  const navigate = useNavigate();

  return (
    <div className="py-12 bg-[#070d14]">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="border-b border-[#c5a880]/20 pb-8 text-center max-w-3xl mx-auto">
          <span className="text-xs tracking-[0.25em] text-[#c5a880] uppercase font-bold block mb-2">
            ✦ Bespoke Hospitality ✦
          </span>
          <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold text-[#f5efeb] tracking-[0.06em] uppercase">
            TABLE RESERVATIONS
          </h1>
          <p className="text-xs sm:text-sm text-[#a89b8d] mt-3 leading-relaxed">
            Reserve your intimate alcove or festive banquet table in advance. Confirmed bookings are immediately registered in your royal account.
          </p>
        </div>
      </div>

      {/* Trust & Policy Highlights */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-[#0a111a] border border-[#c5a880]/20 rounded-sm">
            <Clock className="w-5 h-5 text-[#c5a880] mx-auto mb-2" />
            <h4 className="font-cinzel text-xs font-bold text-[#f5efeb] uppercase">Punctuality & Hold</h4>
            <p className="text-[11px] text-[#8e8275] mt-1">Tables held for 20 minutes from confirmed booking time.</p>
          </div>

          <div className="p-4 bg-[#0a111a] border border-[#c5a880]/20 rounded-sm">
            <ShieldCheck className="w-5 h-5 text-[#c5a880] mx-auto mb-2" />
            <h4 className="font-cinzel text-xs font-bold text-[#f5efeb] uppercase">Dress Etiquette</h4>
            <p className="text-[11px] text-[#8e8275] mt-1">Smart elegant attire requested. Jackets recommended for gentlemen.</p>
          </div>

          <div className="p-4 bg-[#0a111a] border border-[#c5a880]/20 rounded-sm">
            <UserCheck className="w-5 h-5 text-[#c5a880] mx-auto mb-2" />
            <h4 className="font-cinzel text-xs font-bold text-[#f5efeb] uppercase">Complimentary Valet</h4>
            <p className="text-[11px] text-[#8e8275] mt-1">Dedicated valet service at our Porte-Cochère upon arrival.</p>
          </div>
        </div>
      </div>

      {/* Main Reservation Component */}
      <TableReservation
        currentUser={currentUser}
        onBookReservation={handleBookReservation}
        onViewReservations={() => navigate('/account?tab=reservations')}
      />

      {/* Private Gala & Concierge Callout */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="p-6 bg-[#0a111a] border border-[#c5a880]/25 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <h4 className="font-cinzel text-sm font-bold text-[#f8f5f0] uppercase">
              Parties Exceeding 12 Guests or Full Dining Room Buyout?
            </h4>
            <p className="text-[#a89b8d] mt-1">
              Our Head Concierge orchestrates customized tasting menus and private cellar seating.
            </p>
          </div>
          <a
            href="tel:+18774850700"
            className="px-5 py-2.5 bg-[#c5a880]/15 hover:bg-[#c5a880] hover:text-[#070d14] text-[#c5a880] border border-[#c5a880]/40 rounded-sm font-cinzel text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap flex items-center gap-2"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Speak to Concierge</span>
          </a>
        </div>
      </div>
    </div>
  );
};
