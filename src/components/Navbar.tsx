import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Menu as MenuIcon, 
  X, 
  Phone, 
  LogOut, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  User as UserIcon,
  UtensilsCrossed 
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { AdminImageUploadBadge } from './AdminImageUploadBadge';

export const Navbar: React.FC = () => {
  const { currentUser, cart, handleLogout, settings, handleUpdateSettings } = useRestaurant();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Menu', path: '/menu' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Reservations', path: '/reservations' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#060a10]/95 backdrop-blur-md border-b border-[#c5a880]/20 shadow-2xl py-3.5' 
          : 'bg-gradient-to-b from-[#060a10]/80 via-[#060a10]/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          
          {/* ZONE 1: BRAND LOGO */}
          <div className="relative flex items-center shrink-0">
            <AdminImageUploadBadge
              folder="brand"
              label="Logo"
              compact
              className="-top-1 -left-2"
              title="Admin: Upload & replace brand logo"
              onUploaded={async (newUrl) => {
                await handleUpdateSettings({ logoUrl: newUrl });
              }}
            />
            <Link to="/" className="flex items-center gap-3 group">
              {/* Elegant Circular Monogram or Custom Logo */}
              {settings.logoUrl ? (
                <img 
                  src={settings.logoUrl} 
                  alt={settings.brandName} 
                  className="w-10 h-10 rounded-full object-cover border border-[#c5a880]/60 shadow-inner" 
                />
              ) : (
                <div className="w-10 h-10 rounded-full border border-[#c5a880]/60 flex items-center justify-center bg-[#070d14]/80 group-hover:border-[#c5a880] transition-colors shadow-inner">
                  <span className="font-cinzel text-sm font-semibold tracking-widest text-[#c5a880]">
                    {settings.brandName.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-cinzel text-xl md:text-2xl font-bold tracking-[0.25em] text-[#f8f5f0] group-hover:text-[#c5a880] transition-colors whitespace-nowrap">
                  {settings.brandName}
                </span>
                <span className="text-[9px] tracking-[0.3em] uppercase text-[#c5a880]/80 font-medium -mt-1 hidden sm:block">
                  Taste Royale
                </span>
              </div>
            </Link>
          </div>

          {/* ZONE 2: DESKTOP NAV LINKS (Real React Router Links) */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] tracking-wider uppercase font-medium text-[#c4b5a5]">
            {navLinks.map((link) => (
              <NavLink 
                key={link.name} 
                to={link.path}
                className={({ isActive }) => 
                  `transition-colors relative py-1 hover:text-[#c5a880] whitespace-nowrap ${
                    isActive 
                      ? 'text-[#c5a880] font-semibold after:w-full after:h-[1px] after:bg-[#c5a880] after:absolute after:bottom-0 after:left-0' 
                      : 'hover:after:w-full after:w-0 after:h-[1px] after:bg-[#c5a880] after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* ZONE 3: ACTIONS & AUTH */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Phone Concierge */}
            <a 
              href={`tel:${settings.contactPhone.replace(/[^0-9+]/g, '')}`} 
              className="hidden xl:flex items-center gap-2 text-xs text-[#c5a880] hover:text-[#e5c07b] font-medium tracking-wider transition-colors pr-2 border-r border-[#c5a880]/20"
            >
              <Phone className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>{settings.contactPhone}</span>
            </a>

            {/* Cart Icon -> /cart */}
            <Link
              to="/cart"
              className="relative p-2.5 text-[#ded6cc] hover:text-[#c5a880] hover:bg-[#c5a880]/10 rounded-full transition-colors"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#c5a880] text-[#070d14] text-[11px] font-bold rounded-full flex items-center justify-center font-mono animate-bounce shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Book a Table Button -> /reservations */}
            <Link
              to="/reservations"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold tracking-widest uppercase text-[#070d14] bg-gradient-to-r from-[#d4af37] via-[#c5a880] to-[#b39369] hover:brightness-110 active:scale-95 transition-all duration-200 shadow-lg shadow-[#c5a880]/20 rounded-sm whitespace-nowrap"
            >
              Book a Table
            </Link>

            {/* User Profile or Login */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full border border-[#c5a880]/40 hover:border-[#c5a880] bg-[#0d1722]/80 transition-all cursor-pointer"
                  aria-label="User Profile Menu"
                >
                  {currentUser.avatarUrl ? (
                    <img 
                      src={currentUser.avatarUrl} 
                      alt={currentUser.name} 
                      className="w-7 h-7 rounded-full object-cover" 
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#c5a880]/20 text-[#c5a880] flex items-center justify-center text-xs font-semibold">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden md:inline text-xs font-medium text-[#ded6cc] max-w-[100px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-[#0a111a] border border-[#c5a880]/30 rounded-md shadow-2xl py-2 z-50 text-xs divide-y divide-[#c5a880]/15 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-3">
                      <p className="font-semibold text-[#f8f5f0] text-sm truncate">{currentUser.name}</p>
                      <p className="text-[#a09488] truncate text-[11px]">{currentUser.email}</p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-[#c5a880]/15 text-[#c5a880]">
                        {currentUser.role === 'admin' ? 'Executive Admin' : 'Royal Patron'}
                      </span>
                    </div>

                    <div className="py-1">
                      {currentUser.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="w-full text-left px-4 py-2 hover:bg-[#c5a880]/10 text-[#e5c07b] flex items-center gap-2 font-medium"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#e5c07b]" />
                          <span>Admin Control Center</span>
                        </Link>
                      )}

                      <Link
                        to="/account"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="w-full text-left px-4 py-2 hover:bg-[#c5a880]/10 text-[#ded6cc] flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4 text-[#c5a880]" />
                        <span>My Account & History</span>
                      </Link>

                      <Link
                        to="/account?tab=reservations"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="w-full text-left px-4 py-2 hover:bg-[#c5a880]/10 text-[#ded6cc] flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4 text-[#c5a880]" />
                        <span>My Reservations</span>
                      </Link>

                      <Link
                        to="/account?tab=orders"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="w-full text-left px-4 py-2 hover:bg-[#c5a880]/10 text-[#ded6cc] flex items-center gap-2"
                      >
                        <Clock className="w-4 h-4 text-[#c5a880]" />
                        <span>My Order History</span>
                      </Link>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          handleLogout();
                          navigate('/');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-rose-500/10 text-rose-400 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold tracking-wider uppercase text-[#c5a880] hover:text-[#f8f5f0] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="hidden sm:inline-flex px-3 py-1.5 text-xs font-semibold tracking-wider uppercase text-[#f8f5f0] border border-[#c5a880]/40 hover:border-[#c5a880] rounded-sm transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#ded6cc] hover:text-[#c5a880] transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-[#c5a880]/20 bg-[#070d14]/98 rounded-lg p-5 shadow-2xl animate-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-sm uppercase tracking-wider py-2 border-b border-[#c5a880]/10 ${
                      isActive ? 'text-[#c5a880] font-bold' : 'text-[#ded6cc] hover:text-[#c5a880]'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm uppercase tracking-wider text-[#ded6cc] hover:text-[#c5a880] py-2 border-b border-[#c5a880]/10 flex items-center justify-between"
              >
                <span>Shopping Cart</span>
                {cartCount > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-[#c5a880] text-[#070d14] rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {currentUser && (
                <Link
                  to="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm uppercase tracking-wider text-[#ded6cc] hover:text-[#c5a880] py-2 border-b border-[#c5a880]/10"
                >
                  My Account Profile
                </Link>
              )}

              {currentUser?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm uppercase tracking-wider text-[#e5c07b] py-2 border-b border-[#c5a880]/10"
                >
                  Admin Dashboard
                </Link>
              )}

              <div className="pt-2 flex flex-col gap-3">
                <Link
                  to="/reservations"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-[#d4af37] via-[#c5a880] to-[#b39369] text-[#070d14] rounded-sm text-center"
                >
                  Book a Table
                </Link>

                {!currentUser ? (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2 text-xs font-bold uppercase tracking-wider text-center text-[#c5a880] border border-[#c5a880]/40 rounded-sm"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2 text-xs font-bold uppercase tracking-wider text-center text-[#070d14] bg-[#ded6cc] rounded-sm"
                    >
                      Register
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                      navigate('/');
                    }}
                    className="w-full py-2 text-xs font-bold uppercase tracking-wider text-center text-rose-400 border border-rose-500/30 rounded-sm"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
