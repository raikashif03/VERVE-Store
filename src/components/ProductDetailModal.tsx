import React, { useState } from 'react';
import { X, Star, ShieldCheck, Truck, RotateCcw, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedColor?: string, selectedSize?: string) => void;
  onBuyNow: (product: Product, quantity: number, selectedColor?: string, selectedSize?: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onOpenExporter?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
  onOpenExporter,
}) => {
  if (!product) return null;

  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews'>('overview');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[94vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-600 uppercase tracking-wider font-extrabold">
            <span>{product.brand}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{product.category}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-200/80 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body: Gallery Left + Contiguous Purchase Module Right */}
        <div className="p-7 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
            {/* Gallery Column (5 cols) */}
            <div className="md:col-span-6 space-y-4">
              <div className="bg-slate-100 rounded-xl overflow-hidden aspect-[4/3] border border-slate-200 shadow-xs">
                <img
                  src={activeImage}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Gallery Thumbnails */}
              {product.gallery.length > 1 && (
                <div className="flex gap-2.5">
                  {product.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === img ? 'border-slate-950 ring-2 ring-slate-950/30' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Quick Image Customization & Export Trigger */}
              {onOpenExporter && (
                <div className="pt-2">
                  <button
                    onClick={() => onOpenExporter(product)}
                    className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs sm:text-sm font-bold rounded-lg border border-slate-300 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Swap Image / Export Product Code</span>
                  </button>
                </div>
              )}

              {/* Verified Trust Markers */}
              <div className="pt-5 border-t border-slate-100 space-y-3 text-xs sm:text-sm text-slate-700 font-medium">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-5 h-5 text-slate-950 shrink-0" />
                  <span>Complimentary express transit with live doorstep tracking</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-slate-950 shrink-0" />
                  <span>2-Year International Manufacturer Warranty</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="w-5 h-5 text-slate-950 shrink-0" />
                  <span>30-Day Hassle-Free Returns with pre-printed return slip</span>
                </div>
              </div>
            </div>

            {/* Contiguous Purchase Module (6 cols) */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
                  {product.name}
                </h2>

                {/* Rating & Review Counter */}
                <div className="flex items-center gap-2 text-sm text-slate-600 font-semibold">
                  <div className="flex items-center gap-1.5 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-950 font-mono tabular-nums">{product.rating}</span>
                  </div>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500">{product.reviewsCount} verified reviews</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-emerald-700 font-bold">In Stock ({product.stockCount} available)</span>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 pt-2">
                  <span className="text-3xl sm:text-4xl font-black text-slate-950 font-mono tabular-nums">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-base text-slate-400 line-through font-mono tabular-nums">
                      ${product.originalPrice}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="text-xs sm:text-sm text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Save ${(product.originalPrice - product.price).toFixed(0)}
                    </span>
                  )}
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  {product.description}
                </p>

                {/* Color Selector */}
                {product.colors && product.colors.length > 0 && (
                  <div className="pt-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-2">
                      Finish: <span className="font-medium text-slate-600">{selectedColor}</span>
                    </label>
                    <div className="flex items-center gap-2.5">
                      {product.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                            selectedColor === c.name ? 'border-slate-950 ring-2 ring-slate-950/40 scale-105' : 'border-slate-300'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        >
                          {selectedColor === c.name && (
                            <Check className={`w-4 h-4 ${c.hex === '#f4f1ea' || c.hex === '#f8fafc' || c.hex === '#e2e0db' ? 'text-slate-900' : 'text-white'}`} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="pt-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-2">
                      Dimension / Sizing
                    </label>
                    <div className="flex gap-2.5">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg border transition-colors ${
                            selectedSize === s
                              ? 'bg-slate-950 text-white border-slate-950 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-950'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Stepper */}
                <div className="pt-3 flex items-center gap-3">
                  <label className="text-xs sm:text-sm font-bold text-slate-900">Quantity:</label>
                  <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-1.5 text-slate-700 hover:text-slate-950 text-base font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-sm font-mono font-bold text-slate-900 tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                      className="px-3.5 py-1.5 text-slate-700 hover:text-slate-950 text-base font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Purchase Action Buttons */}
              <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row gap-3.5">
                <button
                  onClick={() => {
                    onAddToCart(product, quantity, selectedColor, selectedSize);
                    onClose();
                  }}
                  className="flex-1 py-3.5 px-5 bg-slate-950 text-white text-sm sm:text-base font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2.5 shadow-md"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Bag (${(product.price * quantity).toFixed(0)})</span>
                </button>
                <button
                  onClick={() => {
                    onBuyNow(product, quantity, selectedColor, selectedSize);
                    onClose();
                  }}
                  className="py-3.5 px-6 bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm sm:text-base font-black rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-sm"
                >
                  <span>Instant Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabbed Secondary Information: Specs & Verified Reviews */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex gap-6 border-b border-slate-200 pb-2 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'text-slate-950 border-b-2 border-slate-950 -mb-2.5 font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Key Engineering Highlights
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2 transition-colors ${
                  activeTab === 'specs'
                    ? 'text-slate-950 border-b-2 border-slate-950 -mb-2.5 font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Technical Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2 transition-colors ${
                  activeTab === 'reviews'
                    ? 'text-slate-950 border-b-2 border-slate-950 -mb-2.5 font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Verified Reviews ({product.reviews.length})
              </button>
            </div>

            <div className="pt-4 text-xs sm:text-sm text-slate-600">
              {activeTab === 'overview' && (
                <ul className="space-y-2">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'specs' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 font-mono text-xs">
                  {Object.entries(product.specs).map(([label, val]) => (
                    <div key={label} className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">{label}:</span>
                      <span className="text-slate-900 font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {product.reviews.map((r) => (
                    <div key={r.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-900">{r.author}</span>
                        <span className="text-slate-400 font-mono">{r.date}</span>
                      </div>
                      <div className="flex items-center gap-1 my-1">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
