// TypeScript interfaces for the e-commerce app

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

// Address types
export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

// Product types
export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price?: number;
  stock: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: ProductImage[];
  category: Category;
  subcategory?: Category;
  brand?: string;
  sku: string;
  stock: number;
  isInStock: boolean;
  rating: number;
  reviewCount: number;
  variants?: {
    sizes?: ProductVariant[];
    colors?: ProductVariant[];
  };
  tags?: string[];
  isFeatured: boolean;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  parentId?: string;
  productCount: number;
  order: number;
}

// Cart types
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedSize?: ProductVariant;
  selectedColor?: ProductVariant;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode?: string;
  couponDiscount?: number;
}

// Wishlist types
export interface WishlistItem {
  id: string;
  product: Product;
  addedAt: string;
}

// Order types
export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  selectedSize?: ProductVariant;
  selectedColor?: ProductVariant;
}

export interface OrderTracking {
  status: OrderStatus;
  timestamp: string;
  description: string;
  location?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  tracking?: OrderTracking[];
  estimatedDelivery?: string;
  deliveredAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Review types
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  productId: string;
  rating: number;
  title?: string;
  content: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

// Banner types
export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  linkType?: 'product' | 'category' | 'url';
  linkId?: string;
  order: number;
  isActive: boolean;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'promotion' | 'system' | 'price_drop';
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Filter types
export interface ProductFilters {
  categories?: string[];
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  brands?: string[];
  inStock?: boolean;
  onSale?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular';
}

// Search types
export interface SearchResult {
  products: Product[];
  categories: Category[];
  suggestions: string[];
}

// Navigation types
export type RootStackParamList = {
  '(tabs)': undefined;
  '(auth)/login': undefined;
  '(auth)/register': undefined;
  '(auth)/forgot-password': undefined;
  'product/[id]': { id: string };
  'search': { query?: string; category?: string };
  'checkout': undefined;
  'payment': { orderId?: string };
  'order-success': { orderId: string };
  'orders': undefined;
  'orders/[id]': { id: string };
  'addresses': undefined;
  'settings': undefined;
  'notifications': undefined;
};
