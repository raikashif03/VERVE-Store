import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Phone, 
  ShieldCheck, 
  Package, 
  Navigation,
  FastForward,
  Printer,
  ChevronRight
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderTrackingViewProps {
  orders: Order[];
  onUpdateOrder: (updatedOrder: Order) => void;
  initialSelectedOrderId?: string;
  onNavigateToCatalog: () => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  orders,
  onUpdateOrder,
  initialSelectedOrderId,
  onNavigateToCatalog,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSelectedOrderId || (orders[0]?.id ?? ''));
  const [selectedOrder, setSelectedOrder] = useState<Order>(
    orders.find((o) => o.id === initialSelectedOrderId) || orders[0]
  );
  const [searchFeedback, setSearchFeedback] = useState<string>('');

  useEffect(() => {
    if (initialSelectedOrderId) {
      const match = orders.find((o) => o.id === initialSelectedOrderId);
      if (match) {
        setSelectedOrder(match);
        setSearchQuery(match.id);
        setSearchFeedback('');
      }
    } else if (orders.length > 0 && !selectedOrder) {
      setSelectedOrder(orders[0]);
      setSearchQuery(orders[0].id);
    }
  }, [initialSelectedOrderId, orders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toUpperCase();
    const found = orders.find(
      (o) => o.id.toUpperCase() === query || o.trackingNumber.toUpperCase() === query
    );
    if (found) {
      setSelectedOrder(found);
      setSearchFeedback('');
    } else {
      setSearchFeedback(`No order found matching "${query}". Try testing with sample order: ${orders[0]?.id}`);
    }
  };

  // Real-time Courier Status Simulation
  const handleAdvanceSimulation = () => {
    if (!selectedOrder) return;
    const stages: OrderStatus[] = ['confirmed', 'packed', 'in_transit', 'out_for_delivery', 'delivered'];
    const currentIndex = stages.indexOf(selectedOrder.status);
    
    if (currentIndex < stages.length - 1) {
      const nextStatus = stages[currentIndex + 1];
      const timeNow = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      
      const updatedHistory = selectedOrder.trackingHistory.map((step, idx) => {
        if (idx <= currentIndex + 1) {
          return {
            ...step,
            completed: true,
            timestamp: step.timestamp.startsWith('Expected') ? `Today, ${timeNow}` : step.timestamp,
          };
        }
        return step;
      });

      const updatedOrder: Order = {
        ...selectedOrder,
        status: nextStatus,
        trackingHistory: updatedHistory,
        courier: {
          ...selectedOrder.courier,
          currentCoords: {
            ...selectedOrder.courier.currentCoords,
            progressPct: Math.min(100, Math.round(((currentIndex + 2) / stages.length) * 100)),
          },
          estimatedDelivery: nextStatus === 'delivered' ? 'Delivered Just Now' : selectedOrder.courier.estimatedDelivery,
        },
      };

      setSelectedOrder(updatedOrder);
      onUpdateOrder(updatedOrder);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed':
        return { label: 'Order Confirmed', color: 'text-slate-800 bg-slate-100 border-slate-200' };
      case 'packed':
        return { label: 'Packaged & Inspected', color: 'text-blue-800 bg-blue-50 border-blue-200' };
      case 'in_transit':
        return { label: 'In Transit With Courier', color: 'text-amber-800 bg-amber-50 border-amber-200' };
      case 'out_for_delivery':
        return { label: 'Out for Doorstep Delivery', color: 'text-indigo-800 bg-indigo-50 border-indigo-200' };
      case 'delivered':
        return { label: 'Delivered & Signed', color: 'text-emerald-800 bg-emerald-50 border-emerald-200' };
      default:
        return { label: status, color: 'text-slate-800 bg-slate-100 border-slate-200' };
    }
  };

  const currentBadge = selectedOrder ? getStatusBadge(selectedOrder.status) : null;

  return (
    <div className="max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 py-10 space-y-8">
      {/* View Header & Quick Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="text-xs sm:text-sm uppercase font-extrabold tracking-wider text-slate-500">Live Logistics & Telemetry</div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 mt-1.5">Real-Time Order & Courier Tracking</h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Direct connection to warehouse scanners, GPS vehicle telemetry, and doorstep proof of delivery.
            </p>
          </div>

          {/* Quick Order Search */}
          <form onSubmit={handleSearch} className="flex gap-2.5 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Order ID (e.g. VRV-89421) or TRK#"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-950 focus:bg-white font-mono uppercase font-bold"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-950 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shadow-sm"
            >
              Locate Order
            </button>
          </form>
        </div>

        {/* Quick Sample Orders Selector */}
        <div className="mt-5 pt-5 border-t border-slate-100 flex items-center gap-2.5 flex-wrap text-sm text-slate-600">
          <span className="font-bold text-slate-900">Quick Test Orders:</span>
          {orders.map((o) => (
            <button
              key={o.id}
              onClick={() => {
                setSelectedOrder(o);
                setSearchQuery(o.id);
                setSearchFeedback('');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold transition-colors border ${
                selectedOrder?.id === o.id
                  ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {o.id} ({o.status})
            </button>
          ))}
        </div>

        {searchFeedback && (
          <div className="mt-3 p-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded">
            {searchFeedback}
          </div>
        )}
      </div>

      {selectedOrder ? (
        <div className="space-y-8">
          {/* Active Order Overview Bar */}
          <div className="bg-slate-950 text-white rounded-xl p-6 shadow-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold font-mono tracking-tight">{selectedOrder.id}</span>
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold border ${currentBadge?.color}`}>
                    {currentBadge?.label}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Waybill / Tracking: <span className="text-white font-semibold">{selectedOrder.trackingNumber}</span> · Placed on {selectedOrder.createdAt}
                </div>
              </div>

              {/* Delivery ETA & Action */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="bg-slate-900 px-4 py-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Estimated Doorstep Drop</div>
                  <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">
                    {selectedOrder.courier.estimatedDelivery}
                  </div>
                </div>

                {/* Advance Simulation Button (For User Demonstration) */}
                {selectedOrder.status !== 'delivered' && (
                  <button
                    onClick={handleAdvanceSimulation}
                    title="Simulate courier vehicle advancing to next waypoint"
                    className="px-3.5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <FastForward className="w-4 h-4" />
                    <span>Advance Courier Stage (Demo)</span>
                  </button>
                )}

                <button
                  onClick={() => window.print()}
                  className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                {selectedOrder.trackingHistory.map((step, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="relative flex items-center justify-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                        step.completed
                          ? 'bg-emerald-500 text-slate-950 shadow-sm'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}>
                        {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                    </div>
                    <div className={`text-[11px] font-semibold ${step.completed ? 'text-white' : 'text-slate-500'}`}>
                      {step.title.split('—')[0]}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {step.timestamp.split('·')[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2-Column Split: Interactive Simulated Map & Courier Left + Waypoint Log Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Simulated Interactive Route Map (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-slate-900" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-950">
                      Live Courier GPS Telemetry
                    </h3>
                  </div>
                  <div className="text-xs font-mono text-slate-500">
                    Carrier: <strong className="text-slate-900">{selectedOrder.courier.name}</strong>
                  </div>
                </div>

                {/* Stylized Simulated Route Graphic (High-definition SVG with animated vehicle position) */}
                <div className="relative bg-slate-950 p-6 h-64 flex items-center justify-center overflow-hidden">
                  {/* Subtle Grid Lines */}
                  <div 
                    className="absolute inset-0 opacity-15"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
                      backgroundSize: '24px 24px'
                    }}
                  />

                  {/* SVG Transit Route */}
                  <svg className="w-full h-full" viewBox="0 0 600 200" fill="none">
                    {/* Background Transit Highway */}
                    <path
                      d="M 50 140 C 180 140, 240 60, 380 60 C 470 60, 500 130, 550 130"
                      stroke="#334155"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    {/* Active Traveled Path */}
                    <path
                      d="M 50 140 C 180 140, 240 60, 380 60 C 470 60, 500 130, 550 130"
                      stroke="#f59e0b"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray="600"
                      strokeDashoffset={`${600 - (600 * (selectedOrder.courier.currentCoords.progressPct / 100))}`}
                      className="transition-all duration-700"
                    />

                    {/* Origin Logistics Node (SF Hub) */}
                    <circle cx="50" cy="140" r="8" fill="#10b981" />
                    <text x="50" y="170" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
                      Fulfillment Hub
                    </text>

                    {/* Intermediate Sorting Hub */}
                    <circle cx="280" cy="90" r="6" fill="#64748b" />
                    <text x="280" y="115" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
                      Freight Transit Center
                    </text>

                    {/* Final Delivery Destination (Recipient Address) */}
                    <circle cx="550" cy="130" r="8" fill="#ef4444" />
                    <text x="550" y="160" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
                      {selectedOrder.shippingAddress.city}
                    </text>
                  </svg>

                  {/* Dynamic Courier Pin Overlay */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 p-2 bg-amber-400 text-slate-950 rounded-full shadow-lg border-2 border-slate-950 flex items-center justify-center transition-all duration-700"
                    style={{
                      left: `calc(10% + (${selectedOrder.courier.currentCoords.progressPct}% * 0.75))`,
                    }}
                  >
                    <Truck className="w-4 h-4" />
                  </div>

                  {/* Status Overlay Tag */}
                  <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-xs border border-slate-800 text-slate-300 text-[11px] font-mono px-3 py-1 rounded">
                    Progress: <strong className="text-amber-400">{selectedOrder.courier.currentCoords.progressPct}%</strong>
                  </div>
                </div>

                {/* Courier Dispatch Card */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Assigned Courier</span>
                    <span className="font-semibold text-slate-900">{selectedOrder.courier.driverName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Vehicle Plate</span>
                    <span className="font-mono text-slate-900">{selectedOrder.courier.vehiclePlate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(`Connecting securely to courier dispatch: ${selectedOrder.courier.driverPhone}`)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Contact Dispatch</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Items Breakdown */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-950">
                  Consignment Contents ({selectedOrder.items.length} items)
                </h3>
                <div className="divide-y divide-slate-100">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-14 h-14 object-cover rounded border border-slate-200 bg-slate-100 shrink-0"
                        />
                        <div>
                          <div className="text-xs font-semibold text-slate-900">{item.product.name}</div>
                          <div className="text-[11px] text-slate-500">
                            Qty: {item.quantity} {item.selectedColor ? `· Finish: ${item.selectedColor}` : ''}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-mono font-bold text-slate-950 tabular-nums">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Waypoint Log & Address Details (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Detailed Waypoint Event Log */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-950 pb-2 border-b border-slate-100">
                  Detailed Logistics Timeline
                </h3>

                <div className="space-y-6 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200">
                  {selectedOrder.trackingHistory.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-3.5 pl-1">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 ${
                        step.completed
                          ? 'bg-emerald-600 text-white ring-4 ring-white'
                          : 'bg-slate-200 text-slate-500 ring-4 ring-white'
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className={`font-semibold ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                            {step.title}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {step.timestamp}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{step.location}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                          {step.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Destination & Payment Summary */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs text-xs space-y-3">
                <h3 className="font-bold uppercase tracking-wider text-slate-950 pb-2 border-b border-slate-100">
                  Destination & Payment Dossier
                </h3>
                
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Recipient</span>
                  <span className="font-semibold text-slate-900">{selectedOrder.shippingAddress.fullName}</span>
                  <div className="text-slate-600">
                    {selectedOrder.shippingAddress.street}
                    {selectedOrder.shippingAddress.apartment ? `, ${selectedOrder.shippingAddress.apartment}` : ''}
                  </div>
                  <div className="text-slate-600">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                  </div>
                  <div className="text-slate-500 font-mono mt-0.5">{selectedOrder.shippingAddress.phone}</div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between">
                  <span className="text-slate-500">Payment Channel:</span>
                  <span className="font-medium text-slate-900">{selectedOrder.paymentDetails.provider}</span>
                </div>

                <div className="flex justify-between font-bold text-sm text-slate-950 pt-1 border-t border-slate-100">
                  <span>Total Settled:</span>
                  <span className="font-mono tabular-nums">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-xl space-y-3">
          <Truck className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-900">No active tracking record selected</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Please enter your order ID or tracking code above to monitor live transit updates.
          </p>
          <button
            onClick={onNavigateToCatalog}
            className="mt-2 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-md hover:bg-slate-800 transition-colors"
          >
            Return to Catalog
          </button>
        </div>
      )}
    </div>
  );
};
