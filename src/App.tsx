import React, { useState, useEffect, useMemo } from 'react';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_ADDRESSES, 
  INITIAL_SAVED_PAYMENTS,
  HERO_BANNER_IMAGE
} from './data/mockData';
import { 
  Product, 
  CartItem, 
  Order, 
  SavedAddress, 
  SavedPaymentMethod, 
  FilterState 
} from './types';

// Components
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { CatalogFilters } from './components/CatalogFilters';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingView } from './components/OrderTrackingView';
import { UserDashboard } from './components/UserDashboard';
import { CodeAndAssetExporterModal } from './components/CodeAndAssetExporterModal';
import { Footer } from './components/Footer';

// Icons
import { Check, ShoppingBag, Heart, ArrowUpRight } from 'lucide-react';

const STORAGE_KEYS = {
  PRODUCTS: 'verve_products_v1',
  HERO: 'verve_hero_v1',
  CART: 'verve_cart_v1',
  WISHLIST: 'verve_wishlist_v1',
  ORDERS: 'verve_orders_v1',
  ADDRESSES: 'verve_addresses_v1',
  PAYMENTS: 'verve_payments_v1',
  PROMO: 'verve_promo_v1',
};

export default function App() {
  // Navigation State
  const [activeView, setActiveView] = useState<'catalog' | 'tracking' | 'dashboard'>('catalog');
  const [trackingTargetOrderId, setTrackingTargetOrderId] = useState<string | undefined>(undefined);
  const [isExporterOpen, setIsExporterOpen] = useState(false);

  // Hero Image State
  const [heroImage, setHeroImage] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.HERO) || HERO_BANNER_IMAGE;
    } catch {
      return HERO_BANNER_IMAGE;
    }
  });

  // Data State with LocalStorage Fallback
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });
  
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [
        { product: INITIAL_PRODUCTS[0], quantity: 1, selectedColor: 'Matte Obsidian' }
      ];
    } catch {
      return [{ product: INITIAL_PRODUCTS[0], quantity: 1, selectedColor: 'Matte Obsidian' }];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return saved ? JSON.parse(saved) : [INITIAL_PRODUCTS[1]];
    } catch {
      return [INITIAL_PRODUCTS[1]];
    }
  });

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADDRESSES);
      return saved ? JSON.parse(saved) : INITIAL_ADDRESSES;
    } catch {
      return INITIAL_ADDRESSES;
    }
  });

  const [savedPayments, setSavedPayments] = useState<SavedPaymentMethod[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      return saved ? JSON.parse(saved) : INITIAL_SAVED_PAYMENTS;
    } catch {
      return INITIAL_SAVED_PAYMENTS;
    }
  });

  // UI Drawer / Modal States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.PROMO) || 'WELCOME10';
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'All',
    brand: 'All',
    minPrice: 0,
    maxPrice: 1500,
    minRating: 0,
    inStockOnly: false,
    freeShippingOnly: false,
    sortBy: 'featured',
  });

  // Persist State Changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(savedAddresses));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [savedAddresses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(savedPayments));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [savedPayments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HERO, heroImage);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [heroImage]);

  // Image Customization Handlers
  const handleUpdateProductImage = (productId: string, newImageUrl: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedGallery = [newImageUrl, ...(p.gallery.filter((g) => g !== newImageUrl))];
          return { ...p, image: newImageUrl, gallery: updatedGallery };
        }
        return p;
      })
    );
    showToast('Product image updated across catalog and detail views.');
  };

  const handleUpdateHeroImage = (newHeroUrl: string) => {
    setHeroImage(newHeroUrl);
    showToast('Hero showcase banner updated.');
  };

  const handleResetAllImages = () => {
    setHeroImage(HERO_BANNER_IMAGE);
    setProducts(INITIAL_PRODUCTS);
    try {
      localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
      localStorage.removeItem(STORAGE_KEYS.HERO);
    } catch (e) {
      console.warn(e);
    }
    showToast('Reset all assets to default studio photography.');
  };

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = appliedPromo ? Number((cartSubtotal * 0.1).toFixed(2)) : 0;
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Cart Handlers
  const handleAddToCart = (
    product: Product, 
    quantity: number = 1, 
    color?: string, 
    size?: string
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.product.id === product.id && i.selectedColor === color && i.selectedSize === size
      );
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      }
      return [...prev, { product, quantity, selectedColor: color, selectedSize: size }];
    });
    showToast(`Added "${product.name}" to shopping bag.`);
  };

  const handleUpdateCartQuantity = (
    productId: string, 
    quantity: number, 
    color?: string, 
    size?: string
  ) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId, color, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.selectedColor === color && item.selectedSize === size) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const handleRemoveCartItem = (productId: string, color?: string, size?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedColor === color && item.selectedSize === size)
      )
    );
  };

  // Instant Buy Now Flow
  const handleBuyNow = (product: Product, quantity: number, color?: string, size?: string) => {
    handleAddToCart(product, quantity, color, size);
    setIsCheckoutOpen(true);
  };

  // Wishlist Handlers
  const handleToggleWishlist = (productId: string) => {
    const exists = wishlist.some((p) => p.id === productId);
    if (exists) {
      setWishlist((prev) => prev.filter((p) => p.id !== productId));
      showToast('Removed from saved wishlist.');
    } else {
      const prod = products.find((p) => p.id === productId);
      if (prod) {
        setWishlist((prev) => [...prev, prod]);
        showToast(`Saved "${prod.name}" to wishlist.`);
      }
    }
  };

  // Address Handlers
  const handleAddAddress = (address: SavedAddress) => {
    setSavedAddresses((prev) => [...prev, address]);
    showToast('Delivery destination added.');
  };

  const handleDeleteAddress = (id: string) => {
    setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefaultAddress = (id: string) => {
    setSavedAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  // Payment Handlers
  const handleAddPayment = (payment: SavedPaymentMethod) => {
    setSavedPayments((prev) => [...prev, payment]);
    showToast('Payment card tokenized.');
  };

  const handleDeletePayment = (id: string) => {
    setSavedPayments((prev) => prev.filter((p) => p.id !== id));
  };

  // Order Handlers
  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]); // Clear cart upon successful order
    setTrackingTargetOrderId(newOrder.id);
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
  };

  const handleTrackSpecificOrder = (orderId: string) => {
    setTrackingTargetOrderId(orderId);
    setActiveView('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter Catalog Computation
  const availableBrands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand)));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchCat) return false;
        }

        // Category
        if (filters.category !== 'All' && p.category !== filters.category) {
          return false;
        }

        // Brand
        if (filters.brand !== 'All' && p.brand !== filters.brand) {
          return false;
        }

        // Price
        if (p.price > filters.maxPrice) {
          return false;
        }

        // Rating
        if (filters.minRating > 0 && p.rating < filters.minRating) {
          return false;
        }

        // In Stock
        if (filters.inStockOnly && !p.inStock) {
          return false;
        }

        // Free shipping
        if (filters.freeShippingOnly && !p.freeShipping) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'price_low':
            return a.price - b.price;
          case 'price_high':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'newest':
            return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
          default:
            return 0; // 'featured' retains curated order
        }
      });
  }, [products, filters]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeView={activeView}
        setActiveView={(v) => {
          setActiveView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cartItemCount}
        wishlistCount={wishlist.length}
        openCart={() => setIsCartOpen(true)}
        searchQuery={filters.searchQuery}
        setSearchQuery={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
        onOpenExporter={() => setIsExporterOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1">
        {activeView === 'catalog' && (
          <div>
            {/* Storefront Hero Section */}
            <HeroBanner
              heroImage={heroImage}
              onExploreClick={() => {
                const el = document.getElementById('catalog-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onTrackClick={() => {
                setTrackingTargetOrderId(orders[0]?.id);
                setActiveView('tracking');
              }}
              onOpenImageSelector={() => setIsExporterOpen(true)}
            />

            {/* Catalog & Faceted Filters Section */}
            <div id="catalog-grid" className="max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 py-12 space-y-8">
              {/* Header Title & Filters */}
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
                  Curated Catalog & Atelier Editions
                </h2>
                <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
                  Engineered with strict zero-compromise materials. Filter by acoustics, horology, hardware, or price.
                </p>
              </div>

              {/* Advanced Filter Strip */}
              <CatalogFilters
                filters={filters}
                setFilters={setFilters}
                availableBrands={availableBrands}
                totalResults={filteredProducts.length}
                onReset={() =>
                  setFilters({
                    searchQuery: '',
                    category: 'All',
                    brand: 'All',
                    minPrice: 0,
                    maxPrice: 1500,
                    minRating: 0,
                    inStockOnly: false,
                    freeShippingOnly: false,
                    sortBy: 'featured',
                  })
                }
              />

              {/* Product Grid (3-column desktop / 2-column tablet) */}
              {filteredProducts.length === 0 ? (
                <div className="py-20 text-center bg-white border border-slate-200 rounded-xl space-y-3">
                  <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="text-sm font-semibold text-slate-900">No items match your filter criteria</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try adjusting the price range, clearing the brand selection, or search query.
                  </p>
                  <button
                    onClick={() =>
                      setFilters({
                        searchQuery: '',
                        category: 'All',
                        brand: 'All',
                        minPrice: 0,
                        maxPrice: 1500,
                        minRating: 0,
                        inStockOnly: false,
                        freeShippingOnly: false,
                        sortBy: 'featured',
                      })
                    }
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-md hover:bg-slate-800 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={(prod) => setSelectedProduct(prod)}
                      onAddToCart={(prod) => handleAddToCart(prod, 1)}
                      isWishlisted={wishlist.some((w) => w.id === product.id)}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Real-Time Order Tracking View */}
        {activeView === 'tracking' && (
          <OrderTrackingView
            orders={orders}
            onUpdateOrder={handleUpdateOrder}
            initialSelectedOrderId={trackingTargetOrderId}
            onNavigateToCatalog={() => setActiveView('catalog')}
          />
        )}

        {/* User Dashboard View */}
        {activeView === 'dashboard' && (
          <UserDashboard
            orders={orders}
            wishlist={wishlist}
            savedAddresses={savedAddresses}
            savedPayments={savedPayments}
            onTrackOrder={handleTrackSpecificOrder}
            onAddToCart={(prod) => handleAddToCart(prod, 1)}
            onRemoveWishlist={handleToggleWishlist}
            onAddAddress={handleAddAddress}
            onDeleteAddress={handleDeleteAddress}
            onSetDefaultAddress={handleSetDefaultAddress}
            onAddPayment={handleAddPayment}
            onDeletePayment={handleDeletePayment}
            onExploreCatalog={() => setActiveView('catalog')}
            onOpenExporter={() => setIsExporterOpen(true)}
          />
        )}
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        appliedPromo={appliedPromo}
        setAppliedPromo={setAppliedPromo}
        discountAmount={discountAmount}
      />

      {/* Secure Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        discountAmount={discountAmount}
        appliedPromo={appliedPromo}
        savedAddresses={savedAddresses}
        savedPayments={savedPayments}
        onOrderPlaced={handleOrderPlaced}
        onTrackOrder={handleTrackSpecificOrder}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isWishlisted={selectedProduct ? wishlist.some((w) => w.id === selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onOpenExporter={() => setIsExporterOpen(true)}
      />

      {/* Code & Asset Exporter Studio Modal */}
      <CodeAndAssetExporterModal
        isOpen={isExporterOpen}
        onClose={() => setIsExporterOpen(false)}
        products={products}
        onUpdateProductImage={handleUpdateProductImage}
        heroImage={heroImage}
        onUpdateHeroImage={handleUpdateHeroImage}
        onResetAllImages={handleResetAllImages}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white text-sm font-bold px-5 py-3.5 rounded-xl shadow-2xl border border-slate-800 flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <Footer onNavigate={(v) => {
        setActiveView(v);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />
    </div>
  );
}
