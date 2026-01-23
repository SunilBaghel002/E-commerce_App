// Home Screen with premium UI
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
    Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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
import { Fonts, Spacing, BorderRadius, Shadows } from '../../constants/fonts';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.lg * 3) / 2;

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    onSeeAll?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, onSeeAll }) => {
    const { colors } = useTheme();

    return (
        <View style={styles.sectionHeader}>
            <View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
                {subtitle && (
                    <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                        {subtitle}
                    </Text>
                )}
            </View>
            {onSeeAll && (
                <TouchableOpacity
                    onPress={onSeeAll}
                    style={[styles.seeAllButton, { backgroundColor: colors.surfaceSecondary }]}
                >
                    <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
                    <Ionicons name="chevron-forward" size={14} color={colors.primary} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const HomeScreen = () => {
    const { colors, isDark } = useTheme();
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
                    height={190}
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
            {/* Premium Header with Gradient */}
            <LinearGradient
                colors={isDark
                    ? ['#1E293B', colors.background]
                    : [colors.cardHighlight, colors.background]
                }
                style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}
            >
                <View style={styles.headerTop}>
                    <View>
                        <Text style={[styles.greeting, { color: colors.textSecondary }]}>
                            Welcome back 👋
                        </Text>
                        <Text style={[styles.appName, { color: colors.text }]}>ShopEase</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/notifications')}
                        style={[
                            styles.notificationBtn,
                            {
                                backgroundColor: colors.surface,
                                borderWidth: 1,
                                borderColor: colors.border,
                            },
                            Shadows.sm
                        ]}
                    >
                        <Ionicons name="notifications-outline" size={22} color={colors.text} />
                        <View style={[styles.notificationDot, { backgroundColor: colors.error }]} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() => router.push('/search')}
                    activeOpacity={0.9}
                    style={[
                        styles.searchContainer,
                        {
                            backgroundColor: colors.surface,
                            borderWidth: 1,
                            borderColor: colors.border,
                        },
                        Shadows.sm
                    ]}
                >
                    <Ionicons name="search" size={20} color={colors.textTertiary} />
                    <Text style={[styles.searchPlaceholder, { color: colors.textTertiary }]}>
                        Search products...
                    </Text>
                    <View style={[styles.searchDivider, { backgroundColor: colors.border }]} />
                    <Ionicons name="options-outline" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
            </LinearGradient>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor={colors.primary}
                    />
                }
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Banners */}
                <View style={styles.section}>{renderBanners()}</View>

                {/* Quick Actions */}
                <View style={[styles.section, { paddingHorizontal: Spacing.lg }]}>
                    <View style={styles.quickActions}>
                        {[
                            { icon: 'flash', label: 'Flash Sale', color: colors.gradientSunset },
                            { icon: 'gift', label: 'Rewards', color: colors.gradientSecondary },
                            { icon: 'ticket', label: 'Coupons', color: colors.gradientSuccess },
                            { icon: 'star', label: 'Top Rated', color: colors.gradientGold },
                        ].map((action, index) => (
                            <TouchableOpacity key={index} style={styles.quickActionItem}>
                                <LinearGradient
                                    colors={action.color as unknown as string[]}
                                    style={styles.quickActionIcon}
                                >
                                    <Ionicons name={action.icon as any} size={22} color="#FFFFFF" />
                                </LinearGradient>
                                <Text style={[styles.quickActionLabel, { color: colors.text }]}>
                                    {action.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Categories */}
                <View style={styles.section}>
                    <SectionHeader
                        title="Categories"
                        subtitle="Browse by category"
                        onSeeAll={() => router.push('/(tabs)/categories')}
                    />
                    {renderCategories()}
                </View>

                {/* Featured Products */}
                <View style={styles.section}>
                    <SectionHeader
                        title="Featured Products"
                        subtitle="Handpicked for you"
                        onSeeAll={() => router.push({ pathname: '/search', params: { featured: 'true' } })}
                    />
                    {renderProductGrid(featuredProducts, isLoading)}
                </View>

                {/* New Arrivals */}
                <View style={styles.section}>
                    <SectionHeader
                        title="New Arrivals"
                        subtitle="Fresh drops this week"
                        onSeeAll={() => router.push({ pathname: '/search', params: { new: 'true' } })}
                    />
                    {renderProductGrid(newArrivals, isLoading)}
                </View>

                {/* Promo Banner */}
                <View style={[styles.section, { paddingHorizontal: Spacing.lg }]}>
                    <TouchableOpacity style={styles.promoBanner} activeOpacity={0.9}>
                        <LinearGradient
                            colors={colors.gradientPrimary as unknown as string[]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.promoGradient}
                        >
                            <View style={styles.promoContent}>
                                <View style={styles.promoTextContainer}>
                                    <Text style={styles.promoLabel}>Limited Time</Text>
                                    <Text style={styles.promoTitle}>Get 20% Off!</Text>
                                    <Text style={styles.promoSubtitle}>
                                        Use code SHOP20 on your first order
                                    </Text>
                                </View>
                                <View style={styles.promoButton}>
                                    <Text style={[styles.promoButtonText, { color: colors.primary }]}>
                                        Shop Now
                                    </Text>
                                    <Ionicons name="arrow-forward" size={16} color={colors.primary} />
                                </View>
                            </View>
                            <View style={styles.promoDecoration}>
                                <View style={[styles.promoCircle, styles.promoCircle1]} />
                                <View style={[styles.promoCircle, styles.promoCircle2]} />
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
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
        paddingBottom: Spacing.lg,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        fontSize: Fonts.sizes.sm,
        marginBottom: 2,
    },
    appName: {
        fontSize: Fonts.sizes['3xl'],
        fontWeight: Fonts.weights.bold,
        letterSpacing: -0.5,
    },
    notificationBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        position: 'absolute',
        top: 10,
        right: 10,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.xl,
        marginTop: Spacing.lg,
        gap: Spacing.md,
    },
    searchPlaceholder: {
        flex: 1,
        fontSize: Fonts.sizes.md,
    },
    searchDivider: {
        width: 1,
        height: 24,
    },
    section: {
        marginTop: Spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        fontSize: Fonts.sizes.xl,
        fontWeight: Fonts.weights.bold,
        letterSpacing: -0.3,
    },
    sectionSubtitle: {
        fontSize: Fonts.sizes.sm,
        marginTop: 2,
    },
    seeAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        gap: 2,
    },
    seeAllText: {
        fontSize: Fonts.sizes.sm,
        fontWeight: Fonts.weights.semibold,
    },
    bannerContainer: {
        paddingHorizontal: Spacing.lg,
    },
    categoryList: {
        paddingHorizontal: Spacing.lg,
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    quickActionItem: {
        alignItems: 'center',
        gap: Spacing.sm,
    },
    quickActionIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quickActionLabel: {
        fontSize: Fonts.sizes.xs,
        fontWeight: Fonts.weights.medium,
    },
    productGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: Spacing.lg,
        gap: Spacing.md,
    },
    promoBanner: {
        borderRadius: BorderRadius['2xl'],
        overflow: 'hidden',
    },
    promoGradient: {
        padding: Spacing.xl,
        position: 'relative',
        overflow: 'hidden',
    },
    promoContent: {
        zIndex: 1,
    },
    promoTextContainer: {
        marginBottom: Spacing.lg,
    },
    promoLabel: {
        fontSize: Fonts.sizes.xs,
        color: 'rgba(255,255,255,0.8)',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: Spacing.xs,
    },
    promoTitle: {
        fontSize: Fonts.sizes['4xl'],
        fontWeight: Fonts.weights.bold,
        color: '#FFFFFF',
        marginBottom: Spacing.xs,
    },
    promoSubtitle: {
        fontSize: Fonts.sizes.md,
        color: 'rgba(255,255,255,0.9)',
    },
    promoButton: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.full,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: Spacing.sm,
    },
    promoButtonText: {
        fontSize: Fonts.sizes.sm,
        fontWeight: Fonts.weights.bold,
    },
    promoDecoration: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '50%',
    },
    promoCircle: {
        position: 'absolute',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 999,
    },
    promoCircle1: {
        width: 150,
        height: 150,
        top: -30,
        right: -30,
    },
    promoCircle2: {
        width: 100,
        height: 100,
        bottom: -20,
        right: 40,
    },
});

export default HomeScreen;
