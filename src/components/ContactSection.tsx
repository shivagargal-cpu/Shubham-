import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, ExternalLink, Compass } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const ContactSection: React.FC = () => {
  const { settings } = useRestaurant();
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('Table Inquiry & Private Events');
  const [formMessage, setFormMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [mapMode, setMapMode] = useState<'stylized' | 'satellite'>('stylized');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formMessage.trim()) return;

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormName('');
      setFormEmail('');
      setFormMessage('');
    }, 4500);
  };

  return (
    <section id="contact" className="relative bg-[#05090f] py-24 border-b border-[#c5a880]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-playfair italic text-sm text-[#c5a880] tracking-widest mb-1.5">
            Concierge & Location
          </p>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5efeb] tracking-[0.08em] uppercase">
            FIND & CONNECT WITH US
          </h2>
          <div className="w-16 h-[2px] bg-[#c5a880] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT 5 COLS: Details, Hours & Interactive Map */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Contact Details Card */}
            <div className="bg-[#0a111a] border border-[#c5a880]/20 p-6 rounded-sm space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-[#c5a880]/10 border border-[#c5a880]/30 text-[#c5a880] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-cinzel text-sm font-bold text-[#f8f5f0] uppercase tracking-wider">
                    Location & Valet
                  </h4>
                  <p className="text-xs text-[#a89b8d] mt-1 leading-relaxed">
                    {settings.address}
                  </p>
                  <span className="text-[11px] text-[#c5a880] font-medium mt-1 inline-block">
                    Complimentary Valet at Porte-Cochère
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-[#c5a880]/15">
                <div className="w-10 h-10 rounded-sm bg-[#c5a880]/10 border border-[#c5a880]/30 text-[#c5a880] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-cinzel text-sm font-bold text-[#f8f5f0] uppercase tracking-wider">
                    Direct Concierge
                  </h4>
                  <p className="text-xs text-[#ded6cc] mt-1 font-mono">
                    {settings.contactPhone}
                  </p>
                  <p className="text-[11px] text-[#8e8275]">
                    Available daily from 10:00 AM to 11:00 PM EST
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-[#c5a880]/15">
                <div className="w-10 h-10 rounded-sm bg-[#c5a880]/10 border border-[#c5a880]/30 text-[#c5a880] flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-cinzel text-sm font-bold text-[#f8f5f0] uppercase tracking-wider">
                    Private Enquiries & Press
                  </h4>
                  <p className="text-xs text-[#ded6cc] mt-1">
                    {settings.contactEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Opening Hours Card */}
            <div className="bg-[#0a111a] border border-[#c5a880]/20 p-6 rounded-sm">
              <div className="flex items-center gap-2 mb-4 text-[#c5a880]">
                <Clock className="w-4 h-4" />
                <h4 className="font-cinzel text-xs font-bold tracking-widest uppercase text-[#f8f5f0]">
                  Dining Salon Hours
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-[#c5a880]/10">
                  <span className="text-[#a89b8d]">Tuesday – Thursday</span>
                  <span className="font-medium text-[#ded6cc] text-right">{settings.openingHours.weekdays}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#c5a880]/10">
                  <span className="text-[#a89b8d]">Friday – Saturday</span>
                  <span className="font-medium text-[#c5a880] text-right">{settings.openingHours.weekends}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#c5a880]/10">
                  <span className="text-[#a89b8d]">Sunday</span>
                  <span className="font-medium text-[#ded6cc] text-right">1:00 PM – 10:00 PM</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[#8e8275]">Monday</span>
                  <span className="text-[11px] text-[#c5a880] italic">{settings.openingHours.closedDays}</span>
                </div>
              </div>
            </div>

            {/* Interactive Map Visual */}
            <div className="bg-[#0a111a] border border-[#c5a880]/20 rounded-sm overflow-hidden relative">
              <div className="flex items-center justify-between p-3 bg-[#070d14] border-b border-[#c5a880]/15 text-xs">
                <div className="flex items-center gap-1.5 text-[#ded6cc]">
                  <Compass className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span className="font-semibold">Interactive Venue Map</span>
                </div>
                <div className="flex items-center gap-1 bg-[#0a111a] p-0.5 rounded border border-[#c5a880]/20 text-[10px]">
                  <button
                    onClick={() => setMapMode('stylized')}
                    className={`px-2 py-0.5 rounded ${mapMode === 'stylized' ? 'bg-[#c5a880] text-[#070d14] font-bold' : 'text-[#8e8275]'}`}
                  >
                    Dark Architectural
                  </button>
                  <button
                    onClick={() => setMapMode('satellite')}
                    className={`px-2 py-0.5 rounded ${mapMode === 'satellite' ? 'bg-[#c5a880] text-[#070d14] font-bold' : 'text-[#8e8275]'}`}
                  >
                    Aerial
                  </button>
                </div>
              </div>

              <div className="h-52 relative bg-[#0d141e] flex items-center justify-center overflow-hidden">
                {/* Simulated Dark Luxury Cartography */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* Map Grid Roads */}
                <div className="absolute inset-x-0 top-1/2 h-1 bg-[#c5a880]/20" />
                <div className="absolute inset-y-0 left-1/2 w-1 bg-[#c5a880]/20" />
                <div className="absolute inset-x-0 top-1/3 h-0.5 bg-[#c5a880]/10" />
                <div className="absolute inset-y-0 left-1/3 w-0.5 bg-[#c5a880]/10" />

                {/* Pin Landmark */}
                <div className="relative z-10 flex flex-col items-center animate-bounce">
                  <div className="w-8 h-8 rounded-full bg-[#c5a880] text-[#070d14] flex items-center justify-center font-bold shadow-2xl">
                    <MapPin className="w-5 h-5 fill-current" />
                  </div>
                  <div className="mt-1 px-2.5 py-1 bg-[#060a10] border border-[#c5a880] rounded-sm text-[10px] font-cinzel font-bold text-[#f5efeb] shadow-xl whitespace-nowrap">
                    BROSO RESTAURANT
                  </div>
                </div>

                <div className="absolute bottom-2 left-3 text-[10px] text-[#8e8275] bg-[#070d14]/80 px-2 py-0.5 rounded">
                  40.7614° N, 73.9776° W · Midtown Haute Quadrant
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT 7 COLS: Direct Contact / Inquiry Form */}
          <div className="lg:col-span-7 bg-[#0a111a] border border-[#c5a880]/30 p-8 sm:p-10 rounded-sm shadow-2xl relative">
            
            <h3 className="font-cinzel text-2xl font-bold text-[#f5efeb] mb-2 uppercase tracking-wider">
              MESSAGE OUR MAÎTRE D’HÔTEL
            </h3>
            <p className="text-xs text-[#a89b8d] mb-8 leading-relaxed">
              For private dining room inquiries, sommelier cellar consultations, media requests, or custom culinary requests, please furnish details below.
            </p>

            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-[#c5a880] mx-auto animate-bounce" />
                <h4 className="font-cinzel text-xl font-bold text-[#f8f5f0]">
                  INQUIRY RECEIVED IN COURTESY
                </h4>
                <p className="text-xs text-[#a89b8d] max-w-md mx-auto">
                  Our Head Concierge has received your missive and will respond within two hours during service.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Lord Charles Montgomery"
                      className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2.5 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2.5 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1.5">
                    Subject of Inquiry
                  </label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2.5 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                  >
                    <option value="Table Inquiry & Private Events">Table Inquiry & Private Events</option>
                    <option value="Wine Cellar Tasting Consultation">Wine Cellar Tasting Consultation</option>
                    <option value="Corporate Banquet & Gala Buyout">Corporate Banquet & Gala Buyout</option>
                    <option value="Dietary Protocol & Chef Direct Request">Dietary Protocol & Chef Direct Request</option>
                    <option value="Press & Media Accreditation">Press & Media Accreditation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Provide details regarding date, expected guest count, or bespoke culinary preferences..."
                    className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2.5 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 bg-[#c5a880] hover:bg-[#b59870] text-[#070d14] font-cinzel text-xs font-bold tracking-[0.2em] uppercase rounded-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
                  >
                    <span>Transmit Message</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
