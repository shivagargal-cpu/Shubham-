import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Check, ArrowUp } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const Footer: React.FC = () => {
  const { settings } = useRestaurant();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 4000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#04070b] text-[#ded6cc] border-t border-[#c5a880]/20 pt-16 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-[#c5a880]/15">
          
          {/* Col 1: Brand & Philosophy (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full border border-[#c5a880] flex items-center justify-center bg-[#070d14]">
                <span className="font-cinzel text-sm font-semibold tracking-widest text-[#c5a880]">
                  {settings.brandName.charAt(0)}
                </span>
              </div>
              <span className="font-cinzel text-2xl font-bold tracking-[0.25em] text-[#f8f5f0] group-hover:text-[#c5a880] transition-colors">
                {settings.brandName}
              </span>
            </Link>
            
            <p className="text-xs text-[#a89b8d] leading-relaxed max-w-sm">
              {settings.footerText || 'A Michelin-inspired gastronomic sanctuary honoring regal culinary traditions and pure artisanal elegance.'}
            </p>

            <div className="pt-2 text-[11px] text-[#c5a880] tracking-wider uppercase font-semibold">
              ✦ Michelin Guide Featured · 2026 ✦
            </div>
          </div>

          {/* Col 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-[0.2em] text-[#f5efeb]">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#a89b8d]">
              <li><Link to="/" className="hover:text-[#c5a880] transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-[#c5a880] transition-colors">About Us</Link></li>
              <li><Link to="/menu" className="hover:text-[#c5a880] transition-colors">Artisanal Menu</Link></li>
              <li><Link to="/gallery" className="hover:text-[#c5a880] transition-colors">Visual Gallery</Link></li>
              <li><Link to="/reservations" className="hover:text-[#c5a880] transition-colors">Reservations</Link></li>
              <li><Link to="/contact" className="hover:text-[#c5a880] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Col 3: Dining Hours (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-[0.2em] text-[#f5efeb]">
              Service Hours
            </h4>
            <div className="space-y-2 text-xs text-[#a89b8d]">
              <div>
                <span className="text-[#ded6cc] font-medium block">Weekdays:</span>
                <span>{settings.openingHours.weekdays}</span>
              </div>
              <div>
                <span className="text-[#ded6cc] font-medium block">Weekends:</span>
                <span>{settings.openingHours.weekends}</span>
              </div>
              <div>
                <span className="text-[#c5a880] font-medium block">Special Service:</span>
                <span>{settings.openingHours.closedDays}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Newsletter Subscription (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-[0.2em] text-[#f5efeb]">
              The Royale Gazette
            </h4>
            <p className="text-xs text-[#a89b8d] leading-relaxed">
              Subscribe for exclusive seasonal degustation invites and rare vintage cellar releases.
            </p>

            {subscribed ? (
              <div className="p-2.5 bg-[#c5a880]/15 border border-[#c5a880] rounded-sm text-xs text-[#c5a880] flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>You have been inscribed in the Gazette.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-[#0a111a] border border-[#c5a880]/30 rounded-sm px-3 py-2 text-xs text-[#f8f5f0] placeholder-[#6b6257] focus:outline-none focus:border-[#c5a880]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-[#c5a880] hover:bg-[#b59870] text-[#070d14] rounded-sm flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Subscribe to newsletter"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
                <span className="text-[10px] text-[#6b6257] block">
                  Strictly confidential. Never shared with third parties.
                </span>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8e8275]">
          <p>© {new Date().getFullYear()} BROSO Haute Cuisine. All Rights Reserved.</p>
          
          <div className="flex items-center gap-6 text-[11px]">
            <Link to="/reservations" className="hover:text-[#c5a880] transition-colors">Reservations Policy</Link>
            <span>·</span>
            <Link to="/contact" className="hover:text-[#c5a880] transition-colors">Private Events</Link>
            <span>·</span>
            <Link to="/contact" className="hover:text-[#c5a880] transition-colors">Privacy & Terms</Link>
            <span>·</span>
            <Link to="/account" className="hover:text-[#c5a880] transition-colors">Patron Account</Link>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-full border border-[#c5a880]/30 hover:border-[#c5a880] text-[#c5a880] hover:text-[#f8f5f0] transition-all cursor-pointer"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};
