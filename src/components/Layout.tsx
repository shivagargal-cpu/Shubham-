import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';
import { useRestaurant } from '../context/RestaurantContext';
import { Check } from 'lucide-react';

export const Layout: React.FC = () => {
  const { toastMessage } = useRestaurant();

  return (
    <div className="min-h-screen bg-[#070d14] text-[#ded6cc] selection:bg-[#c5a880]/30 selection:text-[#f8f5f0] flex flex-col font-sans">
      <ScrollToTop />
      <Navbar />

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0a111a] border border-[#c5a880] text-[#f8f5f0] px-4 py-3 rounded-md shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200">
          <div className="w-6 h-6 rounded-full bg-[#c5a880] text-[#070d14] flex items-center justify-center font-bold text-xs">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-medium tracking-wide">{toastMessage}</span>
        </div>
      )}

      <main className="flex-grow pt-20">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
