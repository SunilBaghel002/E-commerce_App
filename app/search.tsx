// Search Screen
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { productService } from '../services';
import { Product, Category, ProductFilters } from '../types';
import { Header, SearchBar, LoadingSpinner, ProductCardSkeleton } from '../components/ui';
import { ProductCard, FilterModal } from '../components/product';
import { Fonts, Spacing } from '../constants/fonts';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.lg * 3) / 2;

const SearchScreen = () => {
    const params = useLocalSearchParams<{ query?: string; category?: string }>();
    const { colors } = useTheme();

    const [searchQuery, setSearchQuery] = useState(params.query || '');
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState<ProductFilters>({
        categories: params.category ? [params.category] : [],
    });
    const [showFilters, setShowFilters] = useState(false);
    const [layout, setLayout] = useState<'grid' | 'list'>('grid');

    const loadProducts = async (pageNum: number = 1, newFilters?: ProductFilters) => {
        try {
            const currentFilters = newFilters || filters;
            const response = searchQuery
                ? await productService.searchProducts(searchQuery, pageNum)
                : await productService.getProducts(pageNum, 20, currentFilters);

            if (pageNum === 1) {
                setProducts(response.data);
            } else {
                setProducts((prev) => [...prev, ...response.data]);
            }
            setHasMore(response.pagination.hasMore);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    };

    const loadCategories = async () => {
        try {
            const data = await productService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    useEffect(() => {
        loadCategories();
        loadProducts();
    }, []);

    const handleSearch = useCallback(() => {
        setIsLoading(true);
        setPage(1);
        loadProducts(1);
    }, [searchQuery, filters]);

    const handleLoadMore = () => {
        if (!isLoadingMore && hasMore) {
            setIsLoadingMore(true);
            const nextPage = page + 1;
            setPage(nextPage);
            loadProducts(nextPage);
        }
    };

    const handleApplyFilters = (newFilters: ProductFilters) => {
        setFilters(newFilters);
        setIsLoading(true);
        setPage(1);
        loadProducts(1, newFilters);
    };

    const renderHeader = () => (
        <View style={styles.listHeader}>
            <View style={styles.resultsRow}>
                <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
                    {products.length} products found
                </Text>
                <View style={styles.layoutToggle}>
                    <TouchableOpacity
                        onPress={() => setLayout('grid')}
                        style={[
                            styles.layoutButton,
                            layout === 'grid' && { backgroundColor: colors.primary },
                        ]}
                    >
                        <Ionicons
                            name="grid-outline"
                            size={18}
                            color={layout === 'grid' ? '#FFFFFF' : colors.textTertiary}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setLayout('list')}
                        style={[
                            styles.layoutButton,
                            layout === 'list' && { backgroundColor: colors.primary },
                        ]}
                    >
                        <Ionicons
                            name="list-outline"
                            size={18}
                            color={layout === 'list' ? '#FFFFFF' : colors.textTertiary}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderProduct = ({ item }: { item: Product }) => (
        <View style={layout === 'grid' ? { width: CARD_WIDTH } : { flex: 1 }}>
            <ProductCard product={item} layout={layout} />
        </View>
    );

    const renderFooter = () => {
        if (!isLoadingMore) return null;
        return (
            <View style={styles.footer}>
                <LoadingSpinner size="small" />
            </View>
        );
    };

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color={colors.textTertiary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No products found
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Try adjusting your search or filters
            </Text>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Search" showBack showCart />

            <View style={styles.searchContainer}>
                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmit={handleSearch}
                    showFilter
                    onFilterPress={() => setShowFilters(true)}
                    autoFocus={!params.query}
                />
            </View>

            {isLoading ? (
                <View style={styles.loadingGrid}>
                    {[...Array(6)].map((_, i) => (
                        <View key={i} style={{ width: CARD_WIDTH }}>
                            <ProductCardSkeleton />
                        </View>
                    ))}
                </View>
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.id}
                    numColumns={layout === 'grid' ? 2 : 1}
                    key={layout}
                    columnWrapperStyle={layout === 'grid' ? styles.row : undefined}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={renderHeader}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={renderEmpty}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                />
            )}

            <FilterModal
                visible={showFilters}
                onClose={() => setShowFilters(false)}
                onApply={handleApplyFilters}
                filters={filters}
                categories={categories}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.md,
    },
    listHeader: {
        marginBottom: Spacing.md,
    },
    resultsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    resultsText: {
        fontSize: Fonts.sizes.sm,
    },
    layoutToggle: {
        flexDirection: 'row',
        gap: Spacing.xs,
    },
    layoutButton: {
        padding: Spacing.sm,
        borderRadius: 8,
    },
    list: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.xl,
    },
    row: {
        justifyContent: 'space-between',
    },
    loadingGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: Spacing.lg,
        gap: Spacing.md,
    },
    footer: {
        paddingVertical: Spacing.lg,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingTop: Spacing['4xl'],
    },
    emptyTitle: {
        fontSize: Fonts.sizes.lg,
        fontWeight: Fonts.weights.semibold,
        marginTop: Spacing.lg,
        marginBottom: Spacing.sm,
    },
    emptySubtitle: {
        fontSize: Fonts.sizes.md,
    },
});

export default SearchScreen;
