import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Users, MapPin, CheckCircle2, Sparkles, X } from 'lucide-react';
import { SeatingArea, Reservation, User } from '../types';

interface TableReservationProps {
  currentUser: User | null;
  onBookReservation: (data: {
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    date: string;
    time: string;
    guests: number;
    seatingArea: SeatingArea;
    specialRequests?: string;
    occasion?: string;
  }) => Reservation | Promise<Reservation>;
  onViewReservations: () => void;
}

export const TableReservation: React.FC<TableReservationProps> = ({
  currentUser,
  onBookReservation,
  onViewReservations
}) => {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [date, setDate] = useState(tomorrow);
  const [time, setTime] = useState('19:30');
  const [guests, setGuests] = useState(2);
  const [seatingArea, setSeatingArea] = useState<SeatingArea>('Main Royal Hall');
  const [occasion, setOccasion] = useState('Fine Dining & Degustation');
  const [specialRequests, setSpecialRequests] = useState('');
  
  const [guestName, setGuestName] = useState(currentUser?.name || '');
  const [guestEmail, setGuestEmail] = useState(currentUser?.email || '');
  const [guestPhone, setGuestPhone] = useState(currentUser?.phone || '+1 (555) 019-2834');

  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  const seatingAreas: { name: SeatingArea; desc: string }[] = [
    { name: 'Main Royal Hall', desc: 'Dramatic chandeliers & velvet banquettes' },
    { name: 'Private Wine Vault', desc: 'Secluded cellar table for intimate dining' },
    { name: 'Skyline Terrace', desc: 'Panoramic night views & heated pergola' },
    { name: "Chef's Counter", desc: 'Front-row view of the open culinary pass' }
  ];

  const timeSlots = [
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
  ];

  const occasions = [
    'Fine Dining & Degustation',
    'Romantic Anniversary',
    'Birthday Celebration',
    'Executive Business Dinner',
    'Proposal & Engagement',
    'Private Family Gathering'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestEmail || !guestPhone) return;

    const res = await onBookReservation({
      guestName,
      guestEmail,
      guestPhone,
      date,
      time,
      guests,
      seatingArea,
      specialRequests: specialRequests.trim() || undefined,
      occasion
    });

    setConfirmedReservation(res);
  };

  return (
    <section id="reservation" className="relative bg-[#070d14] py-24 border-b border-[#c5a880]/15">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="font-playfair italic text-sm text-[#c5a880] tracking-widest mb-1.5">
            Bespoke Table Reservations
          </p>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5efeb] tracking-[0.08em] uppercase">
            RESERVE A ROYAL EVENING
          </h2>
          <div className="w-16 h-[2px] bg-[#c5a880] mx-auto mt-4 mb-4" />
          <p className="text-xs sm:text-sm text-[#a89b8d] leading-relaxed">
            Please reserve your table in advance. For parties exceeding 8 guests or bespoke private buyouts, our maître d’hôtel will coordinate directly.
          </p>
        </div>

        {/* Main Reservation Card Form */}
        <div className="bg-[#0a111a] border border-[#c5a880]/30 rounded-sm p-6 sm:p-10 shadow-2xl relative">
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Row 1: Date, Time, Guests */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Date */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-2 flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>Date of Seating</span>
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2.5 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>Seating Time</span>
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2.5 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>Party Size</span>
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2.5 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Row 2: Seating Area Selector */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-2.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>Preferred Dining Zone</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {seatingAreas.map((area) => (
                  <button
                    type="button"
                    key={area.name}
                    onClick={() => setSeatingArea(area.name)}
                    className={`p-3 text-left rounded-sm border transition-all ${
                      seatingArea === area.name
                        ? 'border-[#c5a880] bg-[#c5a880]/10 text-[#f8f5f0]'
                        : 'border-[#c5a880]/20 bg-[#070d14] text-[#a89b8d] hover:border-[#c5a880]/40'
                    }`}
                  >
                    <p className="text-xs font-bold font-cinzel text-[#f8f5f0]">{area.name}</p>
                    <p className="text-[10px] text-[#8e8275] mt-1 leading-snug">{area.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Row 3: Occasion & Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1">
                  Primary Guest Name *
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Alexander Hamilton"
                  className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2.5 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1">
                  Email Confirmation *
                </label>
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="name@luxurymail.com"
                  className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2.5 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1">
                  Concierge Contact Number *
                </label>
                <input
                  type="tel"
                  required
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2.5 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                />
              </div>

            </div>

            {/* Row 4: Occasion & Special Requests */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1">
                  Dining Occasion
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2.5 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                >
                  {occasions.map((occ) => (
                    <option key={occ} value={occ}>
                      {occ}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1">
                  Dietary Restrictions / Special Requests
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Quiet booth, anniversary champagne on arrival, nut allergy"
                  className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2.5 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                />
              </div>
            </div>

            {/* Submission CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#c5a880]/20">
              <div className="text-[11px] text-[#8e8275]">
                <span>Dress code: Elegant Smart Casual. </span>
                <span className="text-[#c5a880]">Complimentary Valet Parking included.</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#d4af37] via-[#c5a880] to-[#b39369] text-[#070d14] font-cinzel text-xs font-bold tracking-[0.2em] uppercase rounded-sm shadow-xl shadow-[#c5a880]/20 hover:brightness-110 active:scale-95 transition-all"
              >
                Confirm Table Reservation
              </button>
            </div>

          </form>

        </div>

      </div>

      {/* CONFIRMATION MODAL */}
      {confirmedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0a111a] border border-[#c5a880] rounded-sm max-w-md w-full p-8 shadow-2xl relative text-center">
            
            <button
              onClick={() => setConfirmedReservation(null)}
              className="absolute top-4 right-4 text-[#8e8275] hover:text-[#f8f5f0]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-[#c5a880]/20 text-[#c5a880] flex items-center justify-center mx-auto mb-4 border border-[#c5a880]/50">
              <Sparkles className="w-7 h-7" />
            </div>

            <p className="text-[11px] tracking-[0.25em] text-[#c5a880] uppercase font-bold mb-1">
              Reservation Confirmed
            </p>
            <h3 className="font-cinzel text-2xl font-bold text-[#f5efeb] mb-2">
              WE AWAIT YOUR ARRIVAL
            </h3>

            <div className="my-6 p-4 bg-[#070d14] border border-[#c5a880]/30 rounded-sm text-left space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#c5a880]/15">
                <span className="text-[#8e8275] uppercase text-[10px]">Booking Code</span>
                <span className="font-mono text-sm font-bold text-[#c5a880] tracking-wider">
                  {confirmedReservation.code}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8e8275]">Guest:</span>
                <span className="font-medium text-[#ded6cc]">{confirmedReservation.guestName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8e8275]">Date & Time:</span>
                <span className="font-medium text-[#ded6cc]">
                  {confirmedReservation.date} at {confirmedReservation.time}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8e8275]">Party:</span>
                <span className="font-medium text-[#ded6cc]">
                  {confirmedReservation.guests} {confirmedReservation.guests === 1 ? 'Guest' : 'Guests'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8e8275]">Zone:</span>
                <span className="font-medium text-[#c5a880]">{confirmedReservation.seatingArea}</span>
              </div>
            </div>

            <p className="text-[11px] text-[#a89b8d] mb-6">
              A formal confirmation has been registered. You can review and manage this reservation anytime in your guest profile.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setConfirmedReservation(null)}
                className="px-5 py-2.5 bg-[#c5a880] hover:bg-[#b89b74] text-[#070d14] font-cinzel text-xs font-bold tracking-widest uppercase rounded-sm transition-all"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setConfirmedReservation(null);
                  onViewReservations();
                }}
                className="px-5 py-2.5 border border-[#c5a880]/40 text-[#c5a880] hover:text-[#f8f5f0] font-cinzel text-xs font-semibold tracking-widest uppercase rounded-sm transition-all"
              >
                View in Profile
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
