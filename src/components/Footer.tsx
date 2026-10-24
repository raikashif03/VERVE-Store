import React, { useState } from 'react';
import { ShieldCheck, Truck, ArrowRight, Check } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'catalog' | 'tracking' | 'dashboard') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 text-sm border-t border-slate-800">
      <div className="max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-14">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-5">
            <div className="text-white font-black text-2xl tracking-tight uppercase flex items-center gap-2.5">
              <span className="w-3 h-3 bg-white rotate-45 inline-block"></span>
              <span>VERVE</span>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed text-sm sm:text-base">
              A modern digital marketplace delivering curated design objects, precision horology, and acoustics directly to your door with real-time waypoint telemetry.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2.5 pt-2">
              <div className="text-white text-sm font-bold">Join the Dispatch Journal</div>
              <div className="flex max-w-md gap-2.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white text-sm"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-white text-slate-950 hover:bg-slate-200 font-bold rounded-lg transition-colors whitespace-nowrap text-sm"
                >
                  {subscribed ? <Check className="w-4 h-4 text-emerald-600" /> : 'Subscribe'}
                </button>
              </div>
              {subscribed && (
                <div className="text-emerald-400 text-xs sm:text-sm font-semibold">
                  Thank you. You will receive private previews of limited releases.
                </div>
              )}
            </form>
          </div>

          {/* Quick Nav */}
          <div className="space-y-4">
            <div className="text-white font-bold uppercase tracking-wider text-xs sm:text-sm">Collections</div>
            <ul className="space-y-2.5 text-sm sm:text-base">
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">
                  Audio & Acoustics
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">
                  Horology & Watches
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">
                  Home & Coffee
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">
                  Everyday Carry
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <div className="text-white font-bold uppercase tracking-wider text-xs sm:text-sm">Logistics & Support</div>
            <ul className="space-y-2.5 text-sm sm:text-base">
              <li>
                <button onClick={() => onNavigate('tracking')} className="hover:text-white transition-colors">
                  Live Courier Tracking
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
                  Client Dashboard
                </button>
              </li>
              <li>
                <a href="#returns" onClick={(e) => { e.preventDefault(); alert('Complimentary 30-day returns with prepaid shipping label included in every box.'); }} className="hover:text-white transition-colors">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Cash on Delivery (COD) and 256-Bit Escrow payment terms verified.'); }} className="hover:text-white transition-colors">
                  Payment Verification Terms
                </a>
              </li>
            </ul>
          </div>

          {/* Trust & Guarantee */}
          <div className="space-y-4">
            <div className="text-white font-bold uppercase tracking-wider text-xs sm:text-sm">Standards</div>
            <div className="space-y-3 text-slate-300 text-sm sm:text-base">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>256-Bit SSL Encrypted Escrow</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-amber-400 shrink-0" />
                <span>GPS Courier Waypoints</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 pt-2 font-mono">
                San Francisco · Tokyo · Zurich
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs sm:text-sm text-slate-500">
          <div>
            © 2026 VERVE Market, Inc. Built for GitHub & Production Deployment.
          </div>
          <div className="flex items-center gap-5">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>American Express</span>
            <span>Cash on Delivery</span>
            <span>Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
