import React, { useState } from 'react';
import { 
  Package, 
  Heart, 
  MapPin, 
  CreditCard, 
  Settings, 
  Truck, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ShoppingBag, 
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { Order, Product, SavedAddress, SavedPaymentMethod } from '../types';

interface UserDashboardProps {
  orders: Order[];
  wishlist: Product[];
  savedAddresses: SavedAddress[];
  savedPayments: SavedPaymentMethod[];
  onTrackOrder: (orderId: string) => void;
  onAddToCart: (product: Product) => void;
  onRemoveWishlist: (productId: string) => void;
  onAddAddress: (address: SavedAddress) => void;
  onDeleteAddress: (addressId: string) => void;
  onSetDefaultAddress: (addressId: string) => void;
  onAddPayment: (payment: SavedPaymentMethod) => void;
  onDeletePayment: (paymentId: string) => void;
  onExploreCatalog: () => void;
  onOpenExporter?: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  orders,
  wishlist,
  savedAddresses,
  savedPayments,
  onTrackOrder,
  onAddToCart,
  onRemoveWishlist,
  onAddAddress,
  onDeleteAddress,
  onSetDefaultAddress,
  onAddPayment,
  onDeletePayment,
  onExploreCatalog,
  onOpenExporter,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'payments' | 'profile'>('orders');

  // New Address Form State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newLabel, setNewLabel] = useState<'Home' | 'Office' | 'Studio'>('Office');
  const [newFullName, setNewFullName] = useState('Alex Morgan');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newZip, setNewZip] = useState('');
  const [newPhone, setNewPhone] = useState('+1 (415) 883-2901');

  // New Card Form State
  const [showCardModal, setShowCardModal] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardBrand, setNewCardBrand] = useState<'visa' | 'mastercard' | 'amex'>('visa');
  const [newCardExpMonth, setNewCardExpMonth] = useState('09');
  const [newCardExpYear, setNewCardExpYear] = useState('29');

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newZip) return;
    const address: SavedAddress = {
      id: `addr-${Date.now()}`,
      isDefault: savedAddresses.length === 0,
      label: newLabel,
      fullName: newFullName,
      street: newStreet,
      city: newCity,
      state: newState || 'CA',
      postalCode: newZip,
      country: 'United States',
      phone: newPhone,
    };
    onAddAddress(address);
    setShowAddressModal(false);
    setNewStreet('');
    setNewCity('');
    setNewZip('');
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const last4 = newCardNumber.replace(/\D/g, '').slice(-4) || '9921';
    const payment: SavedPaymentMethod = {
      id: `pay-${Date.now()}`,
      brand: newCardBrand,
      last4,
      expMonth: newCardExpMonth,
      expYear: newCardExpYear,
      holderName: 'Alex Morgan',
      isDefault: savedPayments.length === 0,
    };
    onAddPayment(payment);
    setShowCardModal(false);
    setNewCardNumber('');
  };

  return (
    <div className="max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 py-10 space-y-8">
      {/* Sleek User Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-18 h-18 rounded-2xl bg-slate-950 text-white flex items-center justify-center text-2xl font-black font-mono tracking-tight shrink-0 shadow-md">
            AM
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950">Alex Morgan</h1>
              <span className="text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Client</span>
              </span>
            </div>
            <div className="text-sm text-slate-500 font-mono font-medium">
              alex.morgan@example.com · Client ID: VRV-USR-9104
            </div>
          </div>
        </div>

        {/* Metric Quick Stats */}
        <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-slate-200 pt-5 md:pt-0 md:pl-8 text-sm">
          <div>
            <div className="text-slate-500 uppercase tracking-wider text-xs font-extrabold">Total Orders</div>
            <div className="text-2xl font-black text-slate-950 font-mono tabular-nums">{orders.length}</div>
          </div>
          <div>
            <div className="text-slate-500 uppercase tracking-wider text-xs font-extrabold">Wishlist</div>
            <div className="text-2xl font-black text-slate-950 font-mono tabular-nums">{wishlist.length}</div>
          </div>
          <div>
            <div className="text-slate-500 uppercase tracking-wider text-xs font-extrabold">Addresses</div>
            <div className="text-2xl font-black text-slate-950 font-mono tabular-nums">{savedAddresses.length}</div>
          </div>
          {onOpenExporter && (
            <div className="pl-3 border-l border-slate-200">
              <button
                onClick={onOpenExporter}
                className="px-4 py-2.5 bg-slate-950 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
              >
                <span>Image & Code Studio</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Nav Segmented Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-3 overflow-x-auto scrollbar-none pb-px">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2.5 px-5 py-3.5 text-sm sm:text-base font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'orders'
              ? 'border-slate-950 text-slate-950 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Package className="w-5 h-5" />
          <span>My Orders & Delivery Status</span>
          <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-xs font-mono font-bold">
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex items-center gap-2.5 px-5 py-3.5 text-sm sm:text-base font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'wishlist'
              ? 'border-slate-950 text-slate-950 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span>Wishlist</span>
          <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-xs font-mono font-bold">
            {wishlist.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'addresses'
              ? 'border-slate-950 text-slate-950'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Address Book</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'payments'
              ? 'border-slate-950 text-slate-950'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payment Methods</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'profile'
              ? 'border-slate-950 text-slate-950'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Account Preferences</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-white border border-slate-200 rounded-xl space-y-3">
                <Package className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-semibold text-slate-900">No purchase records yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Browse our catalog and experience rapid dispatch with real-time waypoint tracking.
                </p>
                <button
                  onClick={onExploreCatalog}
                  className="mt-2 px-4 py-2 bg-slate-950 text-white text-xs font-semibold rounded-md hover:bg-slate-800 transition-colors"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                  {/* Order Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-950 text-sm">{order.id}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500">{order.createdAt}</span>
                      </div>
                      <div className="text-slate-500 text-[11px] font-mono">
                        Waybill: {order.trackingNumber} · Carrier: {order.courier.name}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider border ${
                        order.status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : order.status === 'in_transit' || order.status === 'out_for_delivery'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-800 border-slate-200'
                      }`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>

                      <button
                        onClick={() => onTrackOrder(order.id)}
                        className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track Delivery</span>
                      </button>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 bg-slate-50/70 rounded-md border border-slate-100">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded bg-white border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-900 truncate">{item.product.name}</div>
                          <div className="text-[11px] text-slate-500">Qty: {item.quantity} · ${item.product.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
                    <div>
                      Ship to: <span className="text-slate-800 font-medium">{order.shippingAddress.street}, {order.shippingAddress.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Total:</span>
                      <span className="text-sm font-bold text-slate-950 font-mono tabular-nums">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlist.length === 0 ? (
              <div className="text-center py-16 bg-white border border-slate-200 rounded-xl space-y-3">
                <Heart className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-semibold text-slate-900">Your wishlist is empty</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the heart icon on any product card in the catalog to bookmark items for later review.
                </p>
                <button
                  onClick={onExploreCatalog}
                  className="mt-2 px-4 py-2 bg-slate-950 text-white text-xs font-semibold rounded-md hover:bg-slate-800 transition-colors"
                >
                  Discover Objects
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((product) => (
                  <div key={product.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col justify-between shadow-xs">
                    <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => onRemoveWishlist(product.id)}
                        className="absolute top-3 right-3 p-1.5 bg-white/90 hover:bg-white text-rose-600 rounded-full shadow-xs"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          {product.brand}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{product.name}</h4>
                        <div className="text-xs font-bold text-slate-950 font-mono mt-1">${product.price}</div>
                      </div>

                      <button
                        onClick={() => {
                          onAddToCart(product);
                          onRemoveWishlist(product.id);
                        }}
                        className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold rounded transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Address Book */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-xs text-slate-600">
                Manage your primary shipping destinations and delivery instructions.
              </div>
              <button
                onClick={() => setShowAddressModal(true)}
                className="px-3.5 py-1.5 bg-slate-950 text-white text-xs font-semibold rounded-md hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`bg-white border rounded-xl p-5 shadow-xs space-y-3 relative ${
                    addr.isDefault ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-950 uppercase tracking-wider">
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        Default Destination
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-700 space-y-0.5">
                    <div className="font-semibold text-slate-900">{addr.fullName}</div>
                    <div>{addr.street}</div>
                    <div>{addr.city}, {addr.state} {addr.postalCode}</div>
                    <div className="text-slate-500 font-mono pt-1">{addr.phone}</div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    {!addr.isDefault ? (
                      <button
                        onClick={() => onSetDefaultAddress(addr.id)}
                        className="text-slate-600 hover:text-slate-900 font-medium underline"
                      >
                        Set as Default
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-medium">Active Address</span>
                    )}

                    {savedAddresses.length > 1 && (
                      <button
                        onClick={() => onDeleteAddress(addr.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Delete address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Address Modal */}
            {showAddressModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
                <form
                  onSubmit={handleSaveAddress}
                  className="bg-white rounded-xl border border-slate-200 p-6 max-w-md w-full space-y-4 shadow-xl text-xs"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h4 className="font-bold text-slate-950 text-sm">Add New Delivery Address</h4>
                    <button type="button" onClick={() => setShowAddressModal(false)} className="text-slate-400 hover:text-slate-900">
                      ✕
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-slate-600 mb-1">Address Label</label>
                      <select
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value as any)}
                        className="w-full border border-slate-200 rounded px-3 py-1.5 bg-white"
                      >
                        <option value="Home">Home</option>
                        <option value="Office">Office</option>
                        <option value="Studio">Studio</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={newFullName}
                        onChange={(e) => setNewFullName(e.target.value)}
                        className="w-full border border-slate-200 rounded px-3 py-1.5"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Street Address</label>
                      <input
                        type="text"
                        value={newStreet}
                        onChange={(e) => setNewStreet(e.target.value)}
                        placeholder="e.g. 100 Howard St, Floor 5"
                        className="w-full border border-slate-200 rounded px-3 py-1.5"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-600 mb-1">City</label>
                        <input
                          type="text"
                          value={newCity}
                          onChange={(e) => setNewCity(e.target.value)}
                          placeholder="San Francisco"
                          className="w-full border border-slate-200 rounded px-3 py-1.5"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">Postal Code</label>
                        <input
                          type="text"
                          value={newZip}
                          onChange={(e) => setNewZip(e.target.value)}
                          placeholder="94105"
                          className="w-full border border-slate-200 rounded px-3 py-1.5 font-mono"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        className="w-full border border-slate-200 rounded px-3 py-1.5 font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowAddressModal(false)}
                      className="px-3 py-1.5 border border-slate-200 rounded text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-slate-950 text-white font-semibold rounded hover:bg-slate-800"
                    >
                      Save Destination
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Payment Methods */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-xs text-slate-600">
                Encrypted payment instruments for 1-click accelerated checkout.
              </div>
              <button
                onClick={() => setShowCardModal(true)}
                className="px-3.5 py-1.5 bg-slate-950 text-white text-xs font-semibold rounded-md hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Payment Method</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedPayments.map((card) => (
                <div
                  key={card.id}
                  className={`bg-white border rounded-xl p-5 shadow-xs space-y-3 ${
                    card.isDefault ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-slate-900" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-950">
                        {card.brand}
                      </span>
                    </div>
                    {card.isDefault && (
                      <span className="text-[10px] font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>

                  <div className="font-mono text-sm tracking-wider font-semibold text-slate-800">
                    •••• •••• •••• {card.last4}
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div>Expires {card.expMonth}/{card.expYear}</div>
                    {savedPayments.length > 1 && (
                      <button
                        onClick={() => onDeletePayment(card.id)}
                        className="text-slate-400 hover:text-rose-600"
                        title="Remove card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Card Modal */}
            {showCardModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
                <form
                  onSubmit={handleSavePayment}
                  className="bg-white rounded-xl border border-slate-200 p-6 max-w-md w-full space-y-4 shadow-xl text-xs"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h4 className="font-bold text-slate-950 text-sm">Link New Card</h4>
                    <button type="button" onClick={() => setShowCardModal(false)} className="text-slate-400 hover:text-slate-900">
                      ✕
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-slate-600 mb-1">Network Brand</label>
                      <select
                        value={newCardBrand}
                        onChange={(e) => setNewCardBrand(e.target.value as any)}
                        className="w-full border border-slate-200 rounded px-3 py-1.5 bg-white uppercase font-semibold"
                      >
                        <option value="visa">Visa</option>
                        <option value="mastercard">Mastercard</option>
                        <option value="amex">American Express</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Card Number (Last 4 Digits for Tokenization)</label>
                      <input
                        type="text"
                        value={newCardNumber}
                        onChange={(e) => setNewCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• 9921"
                        maxLength={19}
                        className="w-full border border-slate-200 rounded px-3 py-1.5 font-mono"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-600 mb-1">Exp Month</label>
                        <input
                          type="text"
                          value={newCardExpMonth}
                          onChange={(e) => setNewCardExpMonth(e.target.value)}
                          placeholder="09"
                          maxLength={2}
                          className="w-full border border-slate-200 rounded px-3 py-1.5 font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">Exp Year</label>
                        <input
                          type="text"
                          value={newCardExpYear}
                          onChange={(e) => setNewCardExpYear(e.target.value)}
                          placeholder="29"
                          maxLength={2}
                          className="w-full border border-slate-200 rounded px-3 py-1.5 font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowCardModal(false)}
                      className="px-3 py-1.5 border border-slate-200 rounded text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-slate-950 text-white font-semibold rounded hover:bg-slate-800"
                    >
                      Save Card Token
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Account Preferences */}
        {activeTab === 'profile' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs max-w-2xl space-y-6 text-xs">
            <h3 className="text-sm font-bold text-slate-950 pb-2 border-b border-slate-100">
              Notification & Delivery Preferences
            </h3>

            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 text-slate-900 mt-0.5"
                />
                <div>
                  <div className="font-semibold text-slate-900">Real-Time Courier SMS Alerts</div>
                  <div className="text-slate-500">Receive SMS notifications when courier driver is 15 minutes away.</div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 text-slate-900 mt-0.5"
                />
                <div>
                  <div className="font-semibold text-slate-900">Electronic Proof of Delivery & PDF Receipts</div>
                  <div className="text-slate-500">Instant email delivery of doorstep signature and invoice.</div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 text-slate-900 mt-0.5"
                />
                <div>
                  <div className="font-semibold text-slate-900">Priority Back-in-Stock Alerts</div>
                  <div className="text-slate-500">First-access alerts when sold-out mechanical watches or studio gear restock.</div>
                </div>
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Escrow Security ID: 8942-AM-SEC</span>
              <button
                type="button"
                onClick={() => alert('Preferences updated successfully.')}
                className="px-4 py-2 bg-slate-900 text-white rounded font-medium hover:bg-slate-800 transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
