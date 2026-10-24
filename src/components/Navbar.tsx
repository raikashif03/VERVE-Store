import React from 'react';
import { ShoppingBag, Heart, Search, Truck, User } from 'lucide-react';

interface NavbarProps {
  activeView: 'catalog' | 'tracking' | 'dashboard';
  setActiveView: (view: 'catalog' | 'tracking' | 'dashboard') => void;
  cartCount: number;
  wishlistCount: number;
  openCart: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenSearch?: () => void;
  onOpenExporter: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  cartCount,
  wishlistCount,
  openCart,
  searchQuery,
  setSearchQuery,
  onOpenExporter,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors shadow-xs">
      {/* Slim Top Announcement / Trust Marker */}
      <div className="bg-slate-900 text-slate-100 text-xs sm:text-sm font-semibold tracking-wide py-2 px-4 text-center">
        <span className="opacity-95">COMPLIMENTARY GLOBAL EXPRESS ON ORDERS OVER $150</span>
        <span className="mx-2.5 opacity-40">·</span>
        <span className="text-amber-300 font-bold">CODE: WELCOME10 FOR 10% OFF</span>
        <span className="mx-2.5 opacity-40">·</span>
        <span className="opacity-85">30-DAY SIGNATURE RETURNS</span>
      </div>

      {/* Main Top Bar (Fluid Expansive Layout) */}
      <div className="max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element Brand Wordmark */}
        <button
          onClick={() => setActiveView('catalog')}
          className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 uppercase hover:opacity-85 transition-opacity whitespace-nowrap shrink-0 flex items-center gap-2.5"
        >
          <span className="w-3.5 h-3.5 bg-slate-950 rotate-45 inline-block"></span>
          <span>VERVE</span>
        </button>

        {/* Zone 2: 4 Concise Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-sm sm:text-base font-bold text-slate-600">
          <button
            onClick={() => setActiveView('catalog')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-950 ${
              activeView === 'catalog' ? 'text-slate-950 font-extrabold border-b-2 border-slate-950 py-1.5' : ''
            }`}
          >
            Catalog & Collections
          </button>
          <button
            onClick={() => setActiveView('tracking')}
            className={`flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 hover:text-slate-950 ${
              activeView === 'tracking' ? 'text-slate-950 font-extrabold border-b-2 border-slate-950 py-1.5' : ''
            }`}
          >
            <Truck className="w-4 h-4 text-slate-600" />
            <span>Live Tracking</span>
          </button>
          <button
            onClick={() => setActiveView('dashboard')}
            className={`flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 hover:text-slate-950 ${
              activeView === 'dashboard' ? 'text-slate-950 font-extrabold border-b-2 border-slate-950 py-1.5' : ''
            }`}
          >
            <User className="w-4 h-4 text-slate-600" />
            <span>Customer Dashboard</span>
          </button>
          <button
            onClick={onOpenExporter}
            className="flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 text-slate-600 hover:text-slate-950 hover:border-b-2 hover:border-slate-300 py-1.5"
            title="Select project images and export code"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Asset Studio & Code Export</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action & Utilities */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Quick Search Input */}
          <div className="relative hidden sm:block w-56 lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeView !== 'catalog') setActiveView('catalog');
              }}
              placeholder="Search products, brands..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Wishlist Shortcut */}
          <button
            onClick={() => setActiveView('dashboard')}
            title="View Wishlist"
            className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white rounded-full text-xs font-bold flex items-center justify-center font-mono tabular-nums">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Bag Primary Action */}
          <button
            onClick={openCart}
            className="flex items-center gap-2.5 px-4.5 py-2.5 bg-slate-950 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Bag</span>
            <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded text-xs font-mono font-bold tabular-nums">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
