// Product Card component
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch, useAppSelector } from '../../store';
import { addToCart } from '../../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist, selectIsInWishlist } from '../../store/slices/wishlistSlice';
import { Product } from '../../types';
import { RatingStars, PriceTag } from '../ui';
import { Fonts, BorderRadius, Spacing, Shadows } from '../../constants/fonts';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.lg * 3) / 2;

interface ProductCardProps {
    product: Product;
    layout?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid' }) => {
    const { colors } = useTheme();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const isInWishlist = useAppSelector(selectIsInWishlist(product.id));

    const handlePress = () => {
        router.push(`/product/${product.id}`);
    };

    const handleWishlistToggle = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (isInWishlist) {
            dispatch(removeFromWishlist(product.id));
        } else {
            dispatch(addToWishlist(product));
        }
    };

    const handleQuickAdd = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        dispatch(addToCart({ product, quantity: 1 }));
    };

    const discountPercent = product.compareAtPrice
        ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
        : 0;

    if (layout === 'list') {
        return (
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.9}
                style={[styles.listContainer, { backgroundColor: colors.surface }, Shadows.md]}
            >
                <Image
                    source={{ uri: product.images[0]?.url }}
                    style={styles.listImage}
                    contentFit="cover"
                    transition={200}
                />
                <View style={styles.listContent}>
                    <Text
                        style={[styles.brand, { color: colors.textSecondary }]}
                        numberOfLines={1}
                    >
                        {product.brand}
                    </Text>
                    <Text
                        style={[styles.title, { color: colors.text }]}
                        numberOfLines={2}
                    >
                        {product.name}
                    </Text>
                    <RatingStars rating={product.rating} showCount count={product.reviewCount} size={14} />
                    <PriceTag
                        price={product.price}
                        compareAtPrice={product.compareAtPrice}
                        size="md"
                    />
                </View>
                <View style={styles.listActions}>
                    <TouchableOpacity onPress={handleWishlistToggle} style={styles.actionButton}>
                        <Ionicons
                            name={isInWishlist ? 'heart' : 'heart-outline'}
                            size={22}
                            color={isInWishlist ? colors.error : colors.textTertiary}
                        />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.9}
            style={[styles.gridContainer, { backgroundColor: colors.surface, width: CARD_WIDTH }, Shadows.md]}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: product.images[0]?.url }}
                    style={styles.gridImage}
                    contentFit="cover"
                    transition={200}
                />

                {/* Discount badge */}
                {discountPercent > 0 && (
                    <View style={[styles.discountBadge, { backgroundColor: colors.error }]}>
                        <Text style={styles.discountText}>-{discountPercent}%</Text>
                    </View>
                )}

                {/* New badge */}
                {product.isNew && !discountPercent && (
                    <View style={[styles.newBadge, { backgroundColor: colors.primary }]}>
                        <Text style={styles.newText}>NEW</Text>
                    </View>
                )}

                {/* Wishlist button */}
                <TouchableOpacity
                    onPress={handleWishlistToggle}
                    style={[styles.wishlistButton, { backgroundColor: colors.surface }]}
                >
                    <Ionicons
                        name={isInWishlist ? 'heart' : 'heart-outline'}
                        size={18}
                        color={isInWishlist ? colors.error : colors.textTertiary}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.gridContent}>
                {product.brand && (
                    <Text
                        style={[styles.brand, { color: colors.textTertiary }]}
                        numberOfLines={1}
                    >
                        {product.brand}
                    </Text>
                )}
                <Text
                    style={[styles.title, { color: colors.text }]}
                    numberOfLines={2}
                >
                    {product.name}
                </Text>
                <View style={styles.ratingRow}>
                    <RatingStars rating={product.rating} size={12} />
                    <Text style={[styles.reviewCount, { color: colors.textTertiary }]}>
                        ({product.reviewCount})
                    </Text>
                </View>
                <View style={styles.priceRow}>
                    <PriceTag
                        price={product.price}
                        compareAtPrice={product.compareAtPrice}
                        size="sm"
                        showDiscount={false}
                    />
                </View>
            </View>

            {/* Quick add button */}
            <TouchableOpacity
                onPress={handleQuickAdd}
                style={[styles.quickAddButton, { backgroundColor: colors.primary }]}
            >
                <Ionicons name="add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    gridContainer: {
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        marginBottom: Spacing.md,
    },
    imageContainer: {
        position: 'relative',
    },
    gridImage: {
        width: '100%',
        height: 160,
    },
    discountBadge: {
        position: 'absolute',
        top: Spacing.sm,
        left: Spacing.sm,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: 4,
    },
    discountText: {
        color: '#FFFFFF',
        fontSize: Fonts.sizes.xs,
        fontWeight: Fonts.weights.bold,
    },
    newBadge: {
        position: 'absolute',
        top: Spacing.sm,
        left: Spacing.sm,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: 4,
    },
    newText: {
        color: '#FFFFFF',
        fontSize: Fonts.sizes.xs,
        fontWeight: Fonts.weights.bold,
    },
    wishlistButton: {
        position: 'absolute',
        top: Spacing.sm,
        right: Spacing.sm,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    gridContent: {
        padding: Spacing.md,
    },
    brand: {
        fontSize: Fonts.sizes.xs,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    title: {
        fontSize: Fonts.sizes.sm,
        fontWeight: Fonts.weights.medium,
        marginBottom: Spacing.xs,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    reviewCount: {
        fontSize: Fonts.sizes.xs,
        marginLeft: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    quickAddButton: {
        position: 'absolute',
        bottom: Spacing.md,
        right: Spacing.md,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // List layout styles
    listContainer: {
        flexDirection: 'row',
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        marginBottom: Spacing.md,
    },
    listImage: {
        width: 120,
        height: 120,
    },
    listContent: {
        flex: 1,
        padding: Spacing.md,
        justifyContent: 'center',
        gap: 4,
    },
    listActions: {
        justifyContent: 'center',
        paddingRight: Spacing.md,
    },
    actionButton: {
        padding: Spacing.sm,
    },
});

export default ProductCard;
