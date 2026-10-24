import React, { useState } from 'react';
import { X, ShieldCheck, Lock, CreditCard, Truck, CheckCircle2, ChevronRight, AlertCircle, Smartphone } from 'lucide-react';
import { CartItem, Order, PaymentMethodType, ShippingAddress, SavedAddress, SavedPaymentMethod } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  discountAmount: number;
  appliedPromo: string;
  savedAddresses: SavedAddress[];
  savedPayments: SavedPaymentMethod[];
  onOrderPlaced: (order: Order) => void;
  onTrackOrder?: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  discountAmount,
  appliedPromo,
  savedAddresses,
  savedPayments,
  onOrderPlaced,
  onTrackOrder,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const shippingFee = shippingMethod === 'express' ? 15 : (subtotal >= 150 ? 0 : 15);
  const tax = Number(((subtotal - discountAmount) * 0.08).toFixed(2));
  const total = Number((subtotal - discountAmount + shippingFee + tax).toFixed(2));

  // Address State
  const defaultAddr = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];
  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddr?.id || 'new');
  const [addressForm, setAddressForm] = useState<ShippingAddress>({
    fullName: defaultAddr?.fullName || 'Alex Morgan',
    street: defaultAddr?.street || '742 Montgomery St, Suite 400',
    apartment: defaultAddr?.label === 'Home' ? 'Apt 4B' : '',
    city: defaultAddr?.city || 'San Francisco',
    state: defaultAddr?.state || 'CA',
    postalCode: defaultAddr?.postalCode || '94111',
    country: 'United States',
    phone: defaultAddr?.phone || '+1 (415) 883-2901',
  });

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('credit_card');
  const [selectedSavedCard, setSelectedSavedCard] = useState<string>(savedPayments[0]?.id || 'new');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('892');
  const [cardHolder, setCardHolder] = useState('Alex Morgan');
  
  // COD OTP State
  const [codOtpSent, setCodOtpSent] = useState(false);
  const [codOtp, setCodOtp] = useState('');
  const [codVerified, setCodVerified] = useState(false);

  // Processing & Confirmation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Format Card input
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const detectBrand = (num: string) => {
    if (num.startsWith('4')) return 'Visa';
    if (num.startsWith('5')) return 'Mastercard';
    if (num.startsWith('3')) return 'Amex';
    return 'Credit Card';
  };

  const handleExecutePayment = () => {
    setIsProcessing(true);
    setProcessingStage('Encrypting payload with 256-Bit SSL...');

    setTimeout(() => {
      setProcessingStage('Contacting payment gateway & authorizing funds...');
    }, 900);

    setTimeout(() => {
      setProcessingStage('Generating order manifest & dispatch ticket...');
    }, 1800);

    setTimeout(() => {
      const orderId = `VRV-${Math.floor(10000 + Math.random() * 90000)}`;
      const trackingNumber = `TRK-${Math.floor(100000 + Math.random() * 900000)}-APX`;
      const dateString = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      const timeString = new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });

      const newOrder: Order = {
        id: orderId,
        trackingNumber: trackingNumber,
        createdAt: `${dateString} · ${timeString}`,
        status: 'confirmed',
        items: [...items],
        subtotal,
        discount: discountAmount,
        shippingFee,
        tax,
        total,
        shippingAddress: { ...addressForm },
        shippingMethod,
        paymentMethod,
        paymentDetails: {
          cardBrand: paymentMethod === 'credit_card' ? detectBrand(cardNumber) : undefined,
          last4: paymentMethod === 'credit_card' ? cardNumber.slice(-4) : undefined,
          isPaid: paymentMethod !== 'cod',
          provider: paymentMethod === 'cod' ? 'Cash on Delivery (Verified)' : 'Stripe 256-Bit Escrow',
        },
        courier: {
          name: 'Apex Priority Express',
          trackingUrl: `https://apex-express.mock/track/${trackingNumber}`,
          driverName: 'Fulfillment Dispatch Team',
          driverPhone: '+1 (800) 555-0182',
          vehiclePlate: 'APX-CARGO-7',
          estimatedDelivery: 'In 2 Business Days',
          currentCoords: {
            lat: 37.7749,
            lng: -122.4194,
            progressPct: 15,
          },
        },
        trackingHistory: [
          {
            status: 'confirmed',
            title: 'Order Verified & Authorized',
            location: 'VERVE Central Hub · San Francisco, CA',
            timestamp: `${dateString}, ${timeString}`,
            completed: true,
            detail: `Authorized via ${paymentMethod === 'cod' ? 'Cash on Delivery phone verification' : '256-Bit Escrow Gateway'}.`,
          },
          {
            status: 'packed',
            title: 'Assigned to Packing & Inspection Annex',
            location: 'West Coast Logistics Center',
            timestamp: 'Pending queue dispatch',
            completed: false,
            detail: 'Products queued for barcode scanning and precision foam nesting.',
          },
          {
            status: 'in_transit',
            title: 'Regional Express Freight Transfer',
            location: 'Bay Area Transit Corridor',
            timestamp: 'Scheduled tomorrow morning',
            completed: false,
            detail: 'Scheduled for line-haul freight transfer.',
          },
          {
            status: 'out_for_delivery',
            title: 'Local Last-Mile Delivery Van',
            location: `${addressForm.city}, ${addressForm.state}`,
            timestamp: 'Estimated Day 2',
            completed: false,
            detail: 'Courier will message 15 minutes before arrival.',
          },
          {
            status: 'delivered',
            title: 'Delivered to Recipient Door',
            location: `${addressForm.street}, ${addressForm.city}`,
            timestamp: 'Signature required',
            completed: false,
            detail: 'Doorstep package release or recipient sign-off.',
          },
        ],
      };

      setIsProcessing(false);
      setCompletedOrder(newOrder);
      onOrderPlaced(newOrder);
    }, 2600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-7 py-4.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-extrabold text-slate-950 uppercase tracking-wide">
              Secure Checkout · 256-Bit Encrypted
            </h3>
          </div>
          {!completedOrder && !isProcessing && (
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-900 rounded hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto">
          {completedOrder ? (
            /* Order Placed Success View */
            <div className="py-6 text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">Payment & Verification Confirmed</div>
                <h2 className="text-2xl font-extrabold text-slate-950">Thank you, {completedOrder.shippingAddress.fullName}!</h2>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your order <span className="font-mono font-bold text-slate-900">{completedOrder.id}</span> has been logged into the logistics network.
                </p>
              </div>

              {/* Order Receipt Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-left max-w-lg mx-auto text-xs space-y-3">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Tracking Code:</span>
                  <span className="font-mono font-bold text-slate-900">{completedOrder.trackingNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Delivery Address:</span>
                  <span className="text-slate-800 text-right">
                    {completedOrder.shippingAddress.street}, {completedOrder.shippingAddress.city}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Payment Method:</span>
                  <span className="font-medium text-slate-900">
                    {completedOrder.paymentMethod === 'credit_card'
                      ? `${completedOrder.paymentDetails.cardBrand} ending in ${completedOrder.paymentDetails.last4}`
                      : completedOrder.paymentMethod === 'cod'
                      ? 'Cash on Delivery (Phone Verified)'
                      : 'Digital Wallet'}
                  </span>
                </div>
                <div className="flex justify-between pt-1 font-bold text-sm text-slate-950">
                  <span>Grand Total Paid:</span>
                  <span className="font-mono tabular-nums">${completedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 max-w-md mx-auto">
                <button
                  onClick={() => {
                    onClose();
                    if (onTrackOrder) {
                      onTrackOrder(completedOrder.id);
                    }
                  }}
                  className="flex-1 py-3 px-5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold rounded-md transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  <span>Track Live Order Telemetry</span>
                </button>
                <button
                  onClick={onClose}
                  className="py-3 px-4 border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-medium rounded-md transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : isProcessing ? (
            /* Processing State with Security Verification Visual */
            <div className="py-16 text-center space-y-5">
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-950 rounded-full animate-spin" />
                <Lock className="w-6 h-6 text-slate-900 absolute inset-0 m-auto" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-950">Processing Secure Transaction</h4>
                <p className="text-xs font-mono text-slate-500">{processingStage}</p>
              </div>
              <div className="text-[11px] text-slate-400">
                Please do not refresh or close this transaction tab.
              </div>
            </div>
          ) : (
            /* Multi-step Checkout Form */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Left Column: Details (7 cols) */}
              <div className="md:col-span-7 space-y-6">
                {/* 1. Shipping Address */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-mono">1</span>
                      <span>Shipping Destination</span>
                    </h4>
                  </div>

                  {/* Saved Address Pill Selection */}
                  {savedAddresses.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {savedAddresses.map((addr) => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => {
                            setSelectedAddressId(addr.id);
                            setAddressForm({
                              fullName: addr.fullName,
                              street: addr.street,
                              city: addr.city,
                              state: addr.state,
                              postalCode: addr.postalCode,
                              country: addr.country,
                              phone: addr.phone,
                            });
                          }}
                          className={`flex-1 p-2.5 rounded border text-left text-xs transition-colors ${
                            selectedAddressId === addr.id
                              ? 'border-slate-950 bg-slate-50 ring-1 ring-slate-950'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="font-semibold text-slate-900">{addr.label}</div>
                          <div className="text-slate-500 truncate text-[11px]">{addr.street}</div>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="col-span-2">
                      <label className="block text-[11px] text-slate-500 mb-1">Full Recipient Name</label>
                      <input
                        type="text"
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900"
                        placeholder="e.g. Alex Morgan"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] text-slate-500 mb-1">Street Address</label>
                      <input
                        type="text"
                        value={addressForm.street}
                        onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900"
                        placeholder="Street, suite, floor"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">City</label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Postal Code</label>
                      <input
                        type="text"
                        value={addressForm.postalCode}
                        onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] text-slate-500 mb-1">Phone Number (For Courier SMS & Dispatch)</label>
                      <input
                        type="text"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Shipping Speed */}
                <div className="pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-mono">2</span>
                    <span>Delivery Tier</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => setShippingMethod('standard')}
                      className={`p-3 rounded border text-left transition-colors ${
                        shippingMethod === 'standard'
                          ? 'border-slate-950 bg-slate-50 ring-1 ring-slate-950'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-semibold text-slate-900">Standard Delivery</div>
                      <div className="text-slate-500 text-[11px]">3–4 Business Days</div>
                      <div className="font-mono text-emerald-700 font-semibold mt-1">
                        {subtotal >= 150 ? 'FREE' : '$15.00'}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShippingMethod('express')}
                      className={`p-3 rounded border text-left transition-colors ${
                        shippingMethod === 'express'
                          ? 'border-slate-950 bg-slate-50 ring-1 ring-slate-950'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-semibold text-slate-900">Priority Express</div>
                      <div className="text-slate-500 text-[11px]">Guaranteed 24-48h</div>
                      <div className="font-mono text-slate-900 font-semibold mt-1">$15.00</div>
                    </button>
                  </div>
                </div>

                {/* 3. Payment Method */}
                <div className="pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-mono">3</span>
                    <span>Payment Selection</span>
                  </h4>

                  {/* Payment Tabs */}
                  <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit_card')}
                      className={`p-2.5 rounded border text-center transition-all ${
                        paymentMethod === 'credit_card'
                          ? 'border-slate-950 bg-slate-900 text-white font-semibold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mx-auto mb-1" />
                      <span>Credit Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-2.5 rounded border text-center transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-slate-950 bg-slate-900 text-white font-semibold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Truck className="w-4 h-4 mx-auto mb-1" />
                      <span>Cash on Delivery</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('digital_wallet')}
                      className={`p-2.5 rounded border text-center transition-all ${
                        paymentMethod === 'digital_wallet'
                          ? 'border-slate-950 bg-slate-900 text-white font-semibold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 mx-auto mb-1" />
                      <span>Digital Wallet</span>
                    </button>
                  </div>

                  {/* Method Details */}
                  {paymentMethod === 'credit_card' && (
                    <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-3 text-xs">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[11px] text-slate-600 font-medium">Card Number</label>
                          <span className="text-[10px] font-mono text-slate-500 font-semibold">{detectBrand(cardNumber)}</span>
                        </div>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4242 4242 4242 4242"
                          className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 font-mono text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-600 mb-1">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-600 mb-1">Security CVV</label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.slice(0, 4))}
                            placeholder="•••"
                            maxLength={4}
                            className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-600 mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="Name on card"
                          className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-3 text-xs">
                      <div className="text-slate-700 leading-relaxed">
                        Pay in cash upon doorstep delivery. To prevent automated spoof orders, please verify your mobile number.
                      </div>
                      
                      {!codVerified ? (
                        <div className="space-y-2 pt-1">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={codOtp}
                              onChange={(e) => setCodOtp(e.target.value)}
                              placeholder="Enter 6-digit OTP"
                              maxLength={6}
                              className="flex-1 bg-white border border-slate-200 rounded px-3 py-1.5 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setCodOtpSent(true);
                                setCodOtp('849201');
                              }}
                              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-medium text-xs whitespace-nowrap"
                            >
                              {codOtpSent ? 'Resend (849201)' : 'Send SMS OTP'}
                            </button>
                          </div>
                          {codOtpSent && (
                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                              <span>Simulated SMS sent: code is <strong className="font-mono text-slate-900">849201</strong></span>
                              <button
                                type="button"
                                onClick={() => setCodVerified(true)}
                                className="text-emerald-700 font-semibold underline"
                              >
                                Auto-Verify
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Phone number verified for Cash on Delivery dispatch!</span>
                        </div>
                      )}
                    </div>
                  )}

                  {paymentMethod === 'digital_wallet' && (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center space-y-3 text-xs">
                      <p className="text-slate-600">
                        Authorize instantly with Apple Pay, Google Pay, or JazzCash / PayPal wallet.
                      </p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-medium rounded shadow-xs">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Biometric / Fast Wallet Ready</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Order Summary (5 cols) */}
              <div className="md:col-span-5 bg-slate-50/70 p-4 rounded-lg border border-slate-200 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-200">
                    Order Summary ({items.length} items)
                  </h4>
                  <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto pr-1 my-2">
                    {items.map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between text-xs">
                        <div className="truncate pr-2">
                          <div className="font-medium text-slate-900 truncate">{item.product.name}</div>
                          <div className="text-slate-500 text-[10px]">Qty: {item.quantity} · {item.selectedColor || 'Standard'}</div>
                        </div>
                        <span className="font-mono font-medium text-slate-900 shrink-0">
                          ${(item.product.price * item.quantity).toFixed(0)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Calculations */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-200 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span className="font-mono tabular-nums text-slate-900">${subtotal.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Discount ({appliedPromo})</span>
                        <span className="font-mono tabular-nums">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-600">
                      <span>Shipping ({shippingMethod})</span>
                      <span className="font-mono tabular-nums text-slate-900">
                        {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Estimated Tax (8%)</span>
                      <span className="font-mono tabular-nums text-slate-900">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-extrabold text-slate-950 pt-2 border-t border-slate-200">
                      <span>Total Amount</span>
                      <span className="font-mono tabular-nums">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleExecutePayment}
                    className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold rounded-md shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Authorize & Place Order (${total.toFixed(2)})</span>
                  </button>

                  <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Guaranteed Safe Checkout · Cancel Anytime Before Dispatch</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
