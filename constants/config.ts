// App configuration constants

export const Config = {
  // API Configuration
  API_BASE_URL: 'https://api.example.com/v1',
  API_TIMEOUT: 30000,
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  PRODUCTS_PER_ROW: 2,
  
  // Cache
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  
  // Storage Keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
    CART: 'cart',
    WISHLIST: 'wishlist',
    RECENTLY_VIEWED: 'recently_viewed',
    THEME: 'theme',
    ONBOARDING_COMPLETE: 'onboarding_complete',
  },
  
  // Feature Flags
  FEATURES: {
    SOCIAL_LOGIN: true,
    APPLE_PAY: true,
    GOOGLE_PAY: true,
    PUSH_NOTIFICATIONS: true,
    WISHLIST: true,
    REVIEWS: true,
    SHARE_PRODUCTS: true,
  },
  
  // App Info
  APP_NAME: 'ShopEase',
  APP_VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@shopease.com',
  
  // Limits
  MAX_CART_ITEMS: 50,
  MAX_QUANTITY_PER_ITEM: 10,
  MAX_ADDRESSES: 10,
  MAX_RECENTLY_VIEWED: 20,
  
  // Animation
  ANIMATION_DURATION: 300,
  STAGGER_DELAY: 50,
};

export const Endpoints = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  SOCIAL_LOGIN: '/auth/social',
  
  // User
  USER_PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  CHANGE_PASSWORD: '/user/change-password',
  ADDRESSES: '/user/addresses',
  
  // Products
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CATEGORIES: '/categories',
  SEARCH: '/products/search',
  FEATURED: '/products/featured',
  NEW_ARRIVALS: '/products/new',
  
  // Cart
  CART: '/cart',
  ADD_TO_CART: '/cart/add',
  UPDATE_CART_ITEM: '/cart/update',
  REMOVE_FROM_CART: '/cart/remove',
  APPLY_COUPON: '/cart/coupon',
  
  // Wishlist
  WISHLIST: '/wishlist',
  ADD_TO_WISHLIST: '/wishlist/add',
  REMOVE_FROM_WISHLIST: '/wishlist/remove',
  
  // Orders
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  CREATE_ORDER: '/orders/create',
  CANCEL_ORDER: '/orders/:id/cancel',
  TRACK_ORDER: '/orders/:id/track',
  
  // Reviews
  PRODUCT_REVIEWS: '/products/:id/reviews',
  ADD_REVIEW: '/products/:id/reviews',
  
  // Misc
  BANNERS: '/banners',
  NOTIFICATIONS: '/notifications',
};
