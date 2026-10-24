import React from 'react';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Clock } from 'lucide-react';
import { HERO_BANNER_IMAGE } from '../data/mockData';

interface HeroBannerProps {
  heroImage: string;
  onExploreClick: () => void;
  onTrackClick: () => void;
  onOpenImageSelector?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ 
  heroImage, 
  onExploreClick, 
  onTrackClick,
  onOpenImageSelector,
}) => {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Editorial Proposition & Actions */}
          <div className="lg:col-span-6 space-y-7">
            <div className="text-xs sm:text-sm uppercase tracking-wider text-slate-500 font-bold">
              Curated Direct-to-Consumer Goods · Autumn/Winter 2026
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-[1.1]" style={{ textWrap: 'balance' }}>
              Precision tools and objects for intentional living.
            </h1>

            <p className="text-slate-600 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl">
              From titanium chronometers and planar acoustics to artisanal pour-over gear, every item is rigorously engineered, tested, and shipped directly with live doorstep tracking.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="px-7 py-4 bg-slate-950 text-white text-sm sm:text-base font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2.5 whitespace-nowrap shadow-md hover:shadow-lg"
              >
                <span>Browse Curated Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={onTrackClick}
                className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-950 text-sm sm:text-base font-bold rounded-lg transition-colors flex items-center gap-2.5 whitespace-nowrap border border-slate-300 shadow-xs"
              >
                <Truck className="w-4 h-4 text-slate-800" />
                <span>Track Active Order (Live GPS)</span>
              </button>
            </div>

            {/* Quick Unboxed Metadata Guarantee */}
            <div className="pt-5 border-t border-slate-100 flex items-center gap-5 text-sm sm:text-base text-slate-600 font-semibold">
              <span>99.4% On-Time Fulfillment</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Direct Factory Warranty</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Carbon-Neutral Transit</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Anchor */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-lg bg-slate-100 aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] group">
              <img
                src={heroImage}
                alt="VERVE curated objects showcase featuring acoustics, lighting, and horology"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white text-sm sm:text-base">
                <span className="font-bold drop-shadow-md">Atelier Collection — Limited Editions</span>
                {onOpenImageSelector && (
                  <button
                    onClick={onOpenImageSelector}
                    className="px-3.5 py-1.5 bg-white/95 hover:bg-white text-slate-950 rounded-lg text-xs sm:text-sm font-bold transition-colors shadow-sm"
                  >
                    Change Hero Image
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Full-width 4-Point Guarantee Strip */}
        <div className="mt-14 pt-10 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-8 text-slate-900">
          <div className="flex items-start gap-4">
            <Truck className="w-6 h-6 text-slate-950 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-950">Free Express Delivery</div>
              <div className="text-xs sm:text-sm text-slate-600 font-medium mt-1">Complimentary 2-day on orders over $150</div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-slate-950 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-950">256-Bit Escrow Security</div>
              <div className="text-xs sm:text-sm text-slate-600 font-medium mt-1">Encrypted Stripe, Visa, and COD protection</div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <RotateCcw className="w-6 h-6 text-slate-950 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-950">30-Day Effortless Returns</div>
              <div className="text-xs sm:text-sm text-slate-600 font-medium mt-1">Prepaid return labels in every package</div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Clock className="w-6 h-6 text-slate-950 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-950">Live Step Telemetry</div>
              <div className="text-xs sm:text-sm text-slate-600 font-medium mt-1">Courier vehicle tracking from hub to door</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
