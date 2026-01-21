// Home Screen
import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    FlatList,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { productService } from '../../services';
import { Product, Category, Banner } from '../../types';
import {
    SearchBar,
    LoadingSpinner,
    ProductCardSkeleton,
    BannerSkeleton,
    CategoryCardSkeleton,
} from '../../components/ui';
import { ProductCard, CategoryCard, ImageCarousel } from '../../components/product';
import { Fonts, Spacing, BorderRadius } from '../../constants/fonts';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.lg * 3) / 2;

interface SectionHeaderProps {
    title: string;
    onSeeAll?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onSeeAll }) => {
    const { colors } = useTheme();

    return (
        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
            {onSeeAll && (
                <TouchableOpacity onPress={onSeeAll}>
                    <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const HomeScreen = () => {
    const { colors } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [newArrivals, setNewArrivals] = useState<Product[]>([]);

    const loadData = async () => {
        try {
            const [bannersData, categoriesData, featuredData, newData] = await Promise.all([
                productService.getBanners(),
                productService.getCategories(),
                productService.getFeaturedProducts(),
                productService.getNewArrivals(),
            ]);

            setBanners(bannersData);
            setCategories(categoriesData);
            setFeaturedProducts(featuredData);
            setNewArrivals(newData);
        } catch (error) {
            console.error('Error loading home data:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        loadData();
    }, []);

    const handleBannerPress = (banner: Banner) => {
        if (banner.linkType === 'product' && banner.linkId) {
            router.push(`/product/${banner.linkId}`);
        } else if (banner.linkType === 'category' && banner.linkId) {
            router.push({ pathname: '/search', params: { category: banner.linkId } });
        }
    };

    const renderBanners = () => {
        if (isLoading) {
            return <BannerSkeleton />;
        }

        const bannerImages = banners.map(b => ({ id: b.id, url: b.image }));

        return (
            <View style={styles.bannerContainer}>
                <ImageCarousel
                    images={bannerImages}
                    height={180}
                    autoPlay
                    autoPlayInterval={5000}
                    onImagePress={(index) => handleBannerPress(banners[index])}
                />
            </View>
        );
    };

    const renderCategories = () => {
        if (isLoading) {
            return (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryList}>
                    {[...Array(5)].map((_, i) => (
                        <CategoryCardSkeleton key={i} />
                    ))}
                </ScrollView>
            );
        }

        return (
            <FlatList
                data={categories}
                renderItem={({ item }) => <CategoryCard category={item} variant="compact" />}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryList}
            />
        );
    };

    const renderProductGrid = (products: Product[], loading: boolean) => {
        if (loading) {
            return (
                <View style={styles.productGrid}>
                    {[...Array(4)].map((_, i) => (
                        <View key={i} style={{ width: CARD_WIDTH }}>
                            <ProductCardSkeleton />
                        </View>
                    ))}
                </View>
            );
        }

        return (
            <View style={styles.productGrid}>
                {products.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} layout="grid" />
                ))}
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={[styles.greeting, { color: colors.textSecondary }]}>
                            Welcome back 👋
                        </Text>
                        <Text style={[styles.appName, { color: colors.text }]}>ShopEase</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/notifications')}
                        style={[styles.notificationBtn, { backgroundColor: colors.surfaceSecondary }]}
                    >
                        <View style={styles.notificationDot} />
                    </TouchableOpacity>
                </View>
                <SearchBar
                    editable={false}
                    onPress={() => router.push('/search')}
                    style={{ marginTop: Spacing.md }}
                />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor={colors.primary}
                    />
                }
            >
                {/* Banners */}
                <View style={styles.section}>{renderBanners()}</View>

                {/* Categories */}
                <View style={styles.section}>
                    <SectionHeader
                        title="Categories"
                        onSeeAll={() => router.push('/(tabs)/categories')}
                    />
                    {renderCategories()}
                </View>

                {/* Featured Products */}
                <View style={styles.section}>
                    <SectionHeader
                        title="Featured Products"
                        onSeeAll={() => router.push({ pathname: '/search', params: { featured: 'true' } })}
                    />
                    {renderProductGrid(featuredProducts, isLoading)}
                </View>

                {/* New Arrivals */}
                <View style={styles.section}>
                    <SectionHeader
                        title="New Arrivals"
                        onSeeAll={() => router.push({ pathname: '/search', params: { new: 'true' } })}
                    />
                    {renderProductGrid(newArrivals, isLoading)}
                </View>

                {/* Promo Banner */}
                <View style={[styles.section, { paddingHorizontal: Spacing.lg }]}>
                    <TouchableOpacity style={styles.promoBanner} activeOpacity={0.9}>
                        <LinearGradient
                            colors={[colors.primary, colors.primaryDark]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.promoGradient}
                        >
                            <View style={styles.promoContent}>
                                <Text style={styles.promoTitle}>Get 20% Off!</Text>
                                <Text style={styles.promoSubtitle}>
                                    Use code SHOP20 on your first order
                                </Text>
                                <View style={styles.promoButton}>
                                    <Text style={styles.promoButtonText}>Shop Now</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={{ height: Spacing['3xl'] }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.md,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        fontSize: Fonts.sizes.sm,
    },
    appName: {
        fontSize: Fonts.sizes['2xl'],
        fontWeight: Fonts.weights.bold,
    },
    notificationBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
        position: 'absolute',
        top: 12,
        right: 12,
    },
    section: {
        marginTop: Spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        fontSize: Fonts.sizes.lg,
        fontWeight: Fonts.weights.bold,
    },
    seeAllText: {
        fontSize: Fonts.sizes.sm,
        fontWeight: Fonts.weights.medium,
    },
    bannerContainer: {
        paddingHorizontal: Spacing.lg,
    },
    categoryList: {
        paddingHorizontal: Spacing.lg,
    },
    productGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: Spacing.lg,
        gap: Spacing.md,
    },
    promoBanner: {
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
    },
    promoGradient: {
        padding: Spacing.xl,
    },
    promoContent: {
        alignItems: 'flex-start',
    },
    promoTitle: {
        fontSize: Fonts.sizes['3xl'],
        fontWeight: Fonts.weights.bold,
        color: '#FFFFFF',
        marginBottom: Spacing.xs,
    },
    promoSubtitle: {
        fontSize: Fonts.sizes.md,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: Spacing.lg,
    },
    promoButton: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.full,
    },
    promoButtonText: {
        fontSize: Fonts.sizes.sm,
        fontWeight: Fonts.weights.bold,
        color: '#6366F1',
    },
});

export default HomeScreen;
