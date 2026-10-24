import React from 'react';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  return (
    <div className="group relative bg-white border border-slate-200/90 rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      {/* Top Image Container */}
      <div 
        onClick={() => onSelect(product)}
        className="relative bg-slate-100 aspect-[4/3] overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Fallback image background in case load delays */}
        <div className="absolute inset-0 bg-slate-100 -z-10 flex items-center justify-center text-slate-400 text-sm font-semibold">
          {product.brand}
        </div>

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3.5 right-3.5 p-2.5 rounded-full transition-all ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-md'
              : 'bg-white/95 text-slate-700 hover:text-slate-950 hover:bg-white shadow-md'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* Subdued Status Kicker (Top Left) */}
        {product.isNew && (
          <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-xs text-slate-950 text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
            New Edition
          </div>
        )}
        {!product.isNew && product.stockCount <= 10 && (
          <div className="absolute top-3.5 left-3.5 bg-amber-500 text-white text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
            Only {product.stockCount} left
          </div>
        )}

        {/* Hover Quick View Overlay Bar */}
        <div className="absolute inset-x-3.5 bottom-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="w-full py-2.5 bg-white/95 backdrop-blur-xs text-slate-950 text-sm font-bold rounded-lg shadow-md hover:bg-white flex items-center justify-center gap-2 transition-colors"
          >
            <Eye className="w-4 h-4 text-slate-800" />
            <span>Quick Specs & Details</span>
          </button>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Brand & Category (Unboxed Text with Separator) */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">
            <span>{product.brand}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{product.category}</span>
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => onSelect(product)}
            className="mt-2 text-base sm:text-lg font-bold text-slate-950 group-hover:text-slate-700 transition-colors cursor-pointer line-clamp-1"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Ratings & Reviews unboxed */}
          <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-600">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-bold text-slate-950 font-mono tabular-nums">{product.rating}</span>
            <span className="text-slate-500">({product.reviewsCount})</span>
            {product.freeShipping && (
              <>
                <span className="text-slate-300">·</span>
                <span className="text-xs sm:text-sm text-emerald-700 font-bold">Free Delivery</span>
              </>
            )}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-slate-950 font-mono tabular-nums">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-slate-400 line-through font-mono tabular-nums">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              In Stock · Dispatched in 24h
            </div>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="px-4 py-2.5 bg-slate-950 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 shadow-sm active:scale-95"
            title="Add to shopping bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
