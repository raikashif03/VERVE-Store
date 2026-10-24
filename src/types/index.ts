export type ProductCategory = 
  | 'All'
  | 'Audio & Acoustics'
  | 'Horology & Watches'
  | 'Home & Coffee'
  | 'Everyday Carry'
  | 'Apparel & Footwear';

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  isNew?: boolean;
  freeShipping: boolean;
  image: string;
  gallery: string[];
  description: string;
  features: string[];
  specs: Record<string, string>;
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  reviews: ProductReview[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export type OrderStatus = 
  | 'confirmed'
  | 'packed'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface TrackingStep {
  status: OrderStatus;
  title: string;
  location: string;
  timestamp: string;
  completed: boolean;
  detail: string;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export type PaymentMethodType = 'credit_card' | 'cod' | 'digital_wallet';

export interface Order {
  id: string;
  trackingNumber: string;
  createdAt: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  shippingMethod: 'standard' | 'express';
  paymentMethod: PaymentMethodType;
  paymentDetails: {
    cardBrand?: string;
    last4?: string;
    isPaid: boolean;
    provider?: string;
  };
  courier: {
    name: string;
    trackingUrl: string;
    driverName: string;
    driverPhone: string;
    vehiclePlate: string;
    estimatedDelivery: string;
    currentCoords: {
      lat: number;
      lng: number;
      progressPct: number;
    };
  };
  trackingHistory: TrackingStep[];
}

export interface SavedAddress {
  id: string;
  isDefault: boolean;
  label: 'Home' | 'Office' | 'Studio';
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface SavedPaymentMethod {
  id: string;
  brand: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expMonth: string;
  expYear: string;
  holderName: string;
  isDefault: boolean;
}

export interface FilterState {
  searchQuery: string;
  category: ProductCategory;
  brand: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  freeShippingOnly: boolean;
  sortBy: 'featured' | 'price_low' | 'price_high' | 'rating' | 'newest';
}
