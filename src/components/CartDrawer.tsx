import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  onRemoveItem: (productId: string, color?: string, size?: string) => void;
  onProceedToCheckout: () => void;
  appliedPromo: string;
  setAppliedPromo: (code: string) => void;
  discountAmount: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedPromo,
  setAppliedPromo,
  discountAmount,
}) => {
  if (!isOpen) return null;

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 150;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    if (code === 'WELCOME10' || code === 'VERVE2026') {
      setAppliedPromo(code);
      setPromoInput('');
    } else {
      setPromoError('Invalid code. Try "WELCOME10" for 10% off.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white border-l border-slate-200 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-6 h-6 text-slate-950" />
              <h2 className="text-lg font-extrabold text-slate-950">Shopping Bag</h2>
              <span className="text-sm text-slate-500 font-mono font-bold tabular-nums">
                ({items.reduce((acc, i) => acc + i.quantity, 0)} items)
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="bg-slate-50 p-4 border-b border-slate-200 text-xs sm:text-sm">
            {subtotal >= freeShippingThreshold ? (
              <div className="text-emerald-800 font-bold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span>You unlocked Complimentary Express Global Shipping!</span>
              </div>
            ) : (
              <div className="space-y-2 text-slate-700">
                <div className="flex justify-between font-semibold">
                  <span>Add ${(freeShippingThreshold - subtotal).toFixed(0)} more for Free Express Delivery</span>
                  <span className="font-mono font-bold">{Math.round(progressToFreeShipping)}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-slate-950 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">Your bag is currently empty</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                  Explore our curated objects, acoustics, and timepieces to add your first selection.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 bg-slate-950 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${idx}`} className="pt-5 first:pt-0 flex gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg border border-slate-200 bg-slate-100 shrink-0 shadow-2xs"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm sm:text-base font-bold text-slate-950 line-clamp-2">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id, item.selectedColor, item.selectedSize)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Variant metadata */}
                      <div className="mt-1 text-xs text-slate-500 font-medium flex items-center gap-2">
                        {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                        {item.selectedColor && item.selectedSize && <span>·</span>}
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      </div>
                    </div>

                    {/* Quantity Stepper & Price */}
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                      <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1, item.selectedColor, item.selectedSize)}
                          className="px-2.5 py-1 text-sm font-bold text-slate-700 hover:text-slate-950"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-mono font-bold text-slate-950">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize)}
                          className="px-2.5 py-1 text-sm font-bold text-slate-700 hover:text-slate-950"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm sm:text-base font-bold font-mono text-slate-950 tabular-nums">
                        ${(item.product.price * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with Promo & Subtotal */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50/70 space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (e.g. WELCOME10)"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-950 uppercase font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 text-xs sm:text-sm font-bold rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <div className="text-xs text-emerald-800 font-bold flex items-center justify-between">
                    <span>Applied code: {appliedPromo} (-10%)</span>
                    <button
                      type="button"
                      onClick={() => setAppliedPromo('')}
                      className="text-slate-400 hover:text-slate-700 underline text-xs"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {promoError && (
                  <div className="text-xs text-rose-600 font-bold">{promoError}</div>
                )}
              </form>

              {/* Subtotal Calculation */}
              <div className="space-y-2 text-xs sm:text-sm pt-2.5 border-t border-slate-200">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums font-bold text-slate-950">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Promotion Discount</span>
                    <span className="font-mono tabular-nums font-bold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Estimated Shipping</span>
                  <span className="font-mono tabular-nums font-bold text-slate-950">
                    {subtotal >= freeShippingThreshold ? 'FREE' : '$15.00'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-950 pt-2.5 border-t border-slate-200">
                  <span>Estimated Total</span>
                  <span className="font-mono tabular-nums text-lg">
                    ${(subtotal - discountAmount + (subtotal >= freeShippingThreshold ? 0 : 15)).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 bg-slate-950 hover:bg-slate-800 text-white text-sm sm:text-base font-bold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2.5"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-Bit SSL Encrypted Escrow · Money-Back Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
