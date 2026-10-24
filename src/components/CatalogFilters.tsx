import React from 'react';
import { Filter, RotateCcw, Check, SlidersHorizontal } from 'lucide-react';
import { FilterState, ProductCategory } from '../types';

interface CatalogFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  availableBrands: string[];
  totalResults: number;
  onReset: () => void;
}

const CATEGORIES: ProductCategory[] = [
  'All',
  'Audio & Acoustics',
  'Horology & Watches',
  'Home & Coffee',
  'Everyday Carry',
];

export const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  filters,
  setFilters,
  availableBrands,
  totalResults,
  onReset,
}) => {
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);

  const activeFilterCount =
    (filters.category !== 'All' ? 1 : 0) +
    (filters.brand !== 'All' ? 1 : 0) +
    (filters.minPrice > 0 || filters.maxPrice < 1500 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.freeShippingOnly ? 1 : 0) +
    (filters.searchQuery.trim() !== '' ? 1 : 0);

  return (
    <div className="space-y-5">
      {/* Horizontal Category Segmented Buttons */}
      <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilters((prev) => ({ ...prev, category: cat }))}
              className={`px-5 py-2.5 text-sm sm:text-base font-bold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                filters.category === cat
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Mobile Filter Sheet Button */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-bold rounded-lg border border-slate-300"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-slate-950 text-white rounded-full text-xs flex items-center justify-center font-mono font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2.5 text-sm sm:text-base text-slate-700 font-semibold">
            <span className="hidden sm:inline">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))
              }
              className="bg-white border border-slate-300 text-slate-950 text-sm sm:text-base font-bold rounded-lg px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-slate-950 shadow-2xs"
            >
              <option value="featured">Featured Curations</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Secondary Filter Bar (Desktop inline strip / Mobile drawer) */}
      <div
        className={`${
          mobileFilterOpen ? 'block' : 'hidden'
        } md:block bg-slate-50 border border-slate-200 rounded-xl p-5 transition-all shadow-xs`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 items-center">
          {/* Brand Filter */}
          <div>
            <label className="block text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
              Brand / Atelier
            </label>
            <select
              value={filters.brand}
              onChange={(e) => setFilters((prev) => ({ ...prev, brand: e.target.value }))}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm sm:text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950 shadow-2xs"
            >
              <option value="All">All Brands</option>
              {availableBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex justify-between text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
              <span>Max Price</span>
              <span className="text-slate-950 font-mono font-bold">${filters.maxPrice}</span>
            </div>
            <input
              type="range"
              min="50"
              max="1500"
              step="50"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
              }
              className="w-full accent-slate-950 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
              Customer Rating
            </label>
            <select
              value={filters.minRating}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, minRating: Number(e.target.value) }))
              }
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm sm:text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950 shadow-2xs"
            >
              <option value="0">All Ratings</option>
              <option value="4.5">4.5 Stars & Above</option>
              <option value="4.7">4.7 Stars & Above</option>
              <option value="4.9">4.9 Stars (Top Rated)</option>
            </select>
          </div>

          {/* Toggles: Free Shipping & In Stock */}
          <div className="flex flex-col gap-2.5 justify-center">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.freeShippingOnly}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, freeShippingOnly: e.target.checked }))
                }
                className="rounded border-slate-300 text-slate-950 focus:ring-slate-950 h-4 w-4"
              />
              <span className="text-sm text-slate-800 font-bold">Free Express Shipping</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))
                }
                className="rounded border-slate-300 text-slate-950 focus:ring-slate-950 h-4 w-4"
              />
              <span className="text-sm text-slate-800 font-bold">In Stock Only</span>
            </label>
          </div>

          {/* Reset Action & Counter */}
          <div className="flex items-center justify-between sm:justify-end gap-3.5 pt-2 sm:pt-0">
            <span className="text-sm text-slate-600 font-mono">
              <strong className="text-slate-950 font-bold text-base">{totalResults}</strong> items
            </span>
            {activeFilterCount > 0 && (
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-rose-700 hover:text-rose-950 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
