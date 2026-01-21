// Product service with mock data
import api from './api';
import { Endpoints } from '../constants';
import { Product, Category, Banner, ProductFilters, PaginatedResponse, ApiResponse, Review } from '../types';

// Mock data for development
const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', icon: 'laptop', productCount: 150, order: 1 },
  { id: '2', name: 'Fashion', slug: 'fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', icon: 'shirt', productCount: 320, order: 2 },
  { id: '3', name: 'Home & Living', slug: 'home-living', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400', icon: 'home', productCount: 180, order: 3 },
  { id: '4', name: 'Sports', slug: 'sports', image: 'https://images.unsplash.com/photo-1461896836934- voices?w=400', icon: 'basketball', productCount: 95, order: 4 },
  { id: '5', name: 'Beauty', slug: 'beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', icon: 'sparkles', productCount: 210, order: 5 },
  { id: '6', name: 'Books', slug: 'books', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400', icon: 'book', productCount: 450, order: 6 },
];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    slug: 'premium-wireless-headphones',
    description: 'Experience crystal-clear audio with our premium wireless headphones. Features active noise cancellation, 30-hour battery life, and premium comfort padding.',
    shortDescription: 'Crystal-clear audio with ANC',
    price: 299.99,
    compareAtPrice: 399.99,
    currency: 'USD',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', isPrimary: true },
      { id: '2', url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600', isPrimary: false },
    ],
    category: mockCategories[0],
    brand: 'SoundMax',
    sku: 'SMX-WH-001',
    stock: 50,
    isInStock: true,
    rating: 4.8,
    reviewCount: 245,
    variants: {
      colors: [
        { id: 'c1', name: 'Color', value: 'Black', stock: 25 },
        { id: 'c2', name: 'Color', value: 'White', stock: 15 },
        { id: 'c3', name: 'Color', value: 'Navy', stock: 10 },
      ],
    },
    tags: ['wireless', 'bluetooth', 'noise-cancelling'],
    isFeatured: true,
    isNew: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Smart Watch Pro',
    slug: 'smart-watch-pro',
    description: 'Track your fitness goals with our advanced smartwatch. Features heart rate monitoring, GPS, water resistance, and 7-day battery life.',
    shortDescription: 'Advanced fitness tracking',
    price: 449.99,
    compareAtPrice: 499.99,
    currency: 'USD',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', isPrimary: true },
    ],
    category: mockCategories[0],
    brand: 'TechFit',
    sku: 'TF-SW-002',
    stock: 30,
    isInStock: true,
    rating: 4.6,
    reviewCount: 189,
    variants: {
      sizes: [
        { id: 's1', name: 'Size', value: '40mm', stock: 15 },
        { id: 's2', name: 'Size', value: '44mm', stock: 15 },
      ],
      colors: [
        { id: 'c1', name: 'Color', value: 'Black', stock: 20 },
        { id: 'c2', name: 'Color', value: 'Silver', stock: 10 },
      ],
    },
    isFeatured: true,
    isNew: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Classic Leather Jacket',
    slug: 'classic-leather-jacket',
    description: 'Timeless style meets modern comfort. Genuine leather jacket with premium stitching and comfortable fit.',
    shortDescription: 'Timeless genuine leather',
    price: 199.99,
    compareAtPrice: 299.99,
    currency: 'USD',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600', isPrimary: true },
    ],
    category: mockCategories[1],
    brand: 'UrbanStyle',
    sku: 'US-LJ-003',
    stock: 25,
    isInStock: true,
    rating: 4.7,
    reviewCount: 92,
    variants: {
      sizes: [
        { id: 's1', name: 'Size', value: 'S', stock: 5 },
        { id: 's2', name: 'Size', value: 'M', stock: 10 },
        { id: 's3', name: 'Size', value: 'L', stock: 7 },
        { id: 's4', name: 'Size', value: 'XL', stock: 3 },
      ],
      colors: [
        { id: 'c1', name: 'Color', value: 'Brown', stock: 15 },
        { id: 'c2', name: 'Color', value: 'Black', stock: 10 },
      ],
    },
    isFeatured: true,
    isNew: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Minimalist Desk Lamp',
    slug: 'minimalist-desk-lamp',
    description: 'Modern LED desk lamp with adjustable brightness and color temperature. Perfect for work or reading.',
    shortDescription: 'Modern LED with adjustable settings',
    price: 79.99,
    currency: 'USD',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600', isPrimary: true },
    ],
    category: mockCategories[2],
    brand: 'HomeLux',
    sku: 'HL-DL-004',
    stock: 100,
    isInStock: true,
    rating: 4.5,
    reviewCount: 67,
    isFeatured: false,
    isNew: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Running Shoes Ultra',
    slug: 'running-shoes-ultra',
    description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper for maximum performance.',
    shortDescription: 'Lightweight & responsive',
    price: 159.99,
    compareAtPrice: 189.99,
    currency: 'USD',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', isPrimary: true },
    ],
    category: mockCategories[3],
    brand: 'SprintX',
    sku: 'SX-RS-005',
    stock: 60,
    isInStock: true,
    rating: 4.9,
    reviewCount: 312,
    variants: {
      sizes: [
        { id: 's1', name: 'Size', value: '8', stock: 10 },
        { id: 's2', name: 'Size', value: '9', stock: 15 },
        { id: 's3', name: 'Size', value: '10', stock: 20 },
        { id: 's4', name: 'Size', value: '11', stock: 10 },
        { id: 's5', name: 'Size', value: '12', stock: 5 },
      ],
      colors: [
        { id: 'c1', name: 'Color', value: 'Red/Black', stock: 30 },
        { id: 'c2', name: 'Color', value: 'Blue/White', stock: 30 },
      ],
    },
    isFeatured: true,
    isNew: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Luxury Skincare Set',
    slug: 'luxury-skincare-set',
    description: 'Complete skincare routine with cleanser, toner, serum, and moisturizer. Made with natural ingredients.',
    shortDescription: 'Complete natural skincare',
    price: 129.99,
    compareAtPrice: 179.99,
    currency: 'USD',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600', isPrimary: true },
    ],
    category: mockCategories[4],
    brand: 'GlowNature',
    sku: 'GN-SS-006',
    stock: 40,
    isInStock: true,
    rating: 4.8,
    reviewCount: 156,
    isFeatured: true,
    isNew: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockBanners: Banner[] = [
  {
    id: '1',
    title: 'Summer Sale',
    subtitle: 'Up to 50% Off',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
    linkType: 'category',
    linkId: '1',
    order: 1,
    isActive: true,
  },
  {
    id: '2',
    title: 'New Arrivals',
    subtitle: 'Discover Latest Trends',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    linkType: 'category',
    linkId: '2',
    order: 2,
    isActive: true,
  },
  {
    id: '3',
    title: 'Free Shipping',
    subtitle: 'On Orders Over $50',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    order: 3,
    isActive: true,
  },
];

const USE_MOCK = true;

export const productService = {
  // Get all categories
  async getCategories(): Promise<Category[]> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockCategories;
    }

    const response = await api.get<ApiResponse<Category[]>>(Endpoints.CATEGORIES);
    return response.data.data;
  },

  // Get products with filters and pagination
  async getProducts(
    page: number = 1,
    limit: number = 20,
    filters?: ProductFilters
  ): Promise<PaginatedResponse<Product>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filtered = [...mockProducts];
      
      if (filters?.categories?.length) {
        filtered = filtered.filter(p => filters.categories!.includes(p.category.id));
      }
      if (filters?.priceMin !== undefined) {
        filtered = filtered.filter(p => p.price >= filters.priceMin!);
      }
      if (filters?.priceMax !== undefined) {
        filtered = filtered.filter(p => p.price <= filters.priceMax!);
      }
      if (filters?.rating) {
        filtered = filtered.filter(p => p.rating >= filters.rating!);
      }
      if (filters?.inStock) {
        filtered = filtered.filter(p => p.isInStock);
      }
      if (filters?.onSale) {
        filtered = filtered.filter(p => p.compareAtPrice !== undefined);
      }
      
      // Sort
      if (filters?.sortBy) {
        switch (filters.sortBy) {
          case 'price_asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
          case 'price_desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
          case 'newest':
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
        }
      }
      
      const start = (page - 1) * limit;
      const paginated = filtered.slice(start, start + limit);
      
      return {
        success: true,
        data: paginated,
        pagination: {
          page,
          limit,
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / limit),
          hasMore: start + limit < filtered.length,
        },
      };
    }

    const response = await api.get<PaginatedResponse<Product>>(Endpoints.PRODUCTS, {
      params: { page, limit, ...filters },
    });
    return response.data;
  },

  // Get product by ID
  async getProductById(id: string): Promise<Product | null> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockProducts.find(p => p.id === id) || null;
    }

    const response = await api.get<ApiResponse<Product>>(
      Endpoints.PRODUCT_DETAIL.replace(':id', id)
    );
    return response.data.data;
  },

  // Get featured products
  async getFeaturedProducts(): Promise<Product[]> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockProducts.filter(p => p.isFeatured);
    }

    const response = await api.get<ApiResponse<Product[]>>(Endpoints.FEATURED);
    return response.data.data;
  },

  // Get new arrivals
  async getNewArrivals(): Promise<Product[]> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockProducts.filter(p => p.isNew);
    }

    const response = await api.get<ApiResponse<Product[]>>(Endpoints.NEW_ARRIVALS);
    return response.data.data;
  },

  // Search products
  async searchProducts(query: string, page: number = 1): Promise<PaginatedResponse<Product>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const filtered = mockProducts.filter(
        p => p.name.toLowerCase().includes(query.toLowerCase()) ||
             p.description.toLowerCase().includes(query.toLowerCase())
      );
      
      return {
        success: true,
        data: filtered,
        pagination: {
          page,
          limit: 20,
          total: filtered.length,
          totalPages: 1,
          hasMore: false,
        },
      };
    }

    const response = await api.get<PaginatedResponse<Product>>(Endpoints.SEARCH, {
      params: { q: query, page },
    });
    return response.data;
  },

  // Get banners
  async getBanners(): Promise<Banner[]> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockBanners;
    }

    const response = await api.get<ApiResponse<Banner[]>>(Endpoints.BANNERS);
    return response.data.data;
  },

  // Get product reviews
  async getProductReviews(productId: string, page: number = 1): Promise<PaginatedResponse<Review>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockReviews: Review[] = [
        {
          id: '1',
          userId: '101',
          userName: 'Sarah M.',
          userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
          productId,
          rating: 5,
          title: 'Absolutely love it!',
          content: 'This product exceeded my expectations. The quality is amazing and it arrived quickly. Highly recommend!',
          isVerifiedPurchase: true,
          helpfulCount: 24,
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: '2',
          userId: '102',
          userName: 'Mike R.',
          productId,
          rating: 4,
          title: 'Great value for money',
          content: 'Very happy with my purchase. Works exactly as described. Minor issue with packaging but product is perfect.',
          isVerifiedPurchase: true,
          helpfulCount: 12,
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        },
      ];
      
      return {
        success: true,
        data: mockReviews,
        pagination: {
          page,
          limit: 10,
          total: 2,
          totalPages: 1,
          hasMore: false,
        },
      };
    }

    const response = await api.get<PaginatedResponse<Review>>(
      Endpoints.PRODUCT_REVIEWS.replace(':id', productId),
      { params: { page } }
    );
    return response.data;
  },
};

export default productService;
