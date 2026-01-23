// Product Card component with premium animations
import React, { useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Animated,
    Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch, useAppSelector } from '../../store';
import { addToCart } from '../../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist, selectIsInWishlist } from '../../store/slices/wishlistSlice';
import { Product } from '../../types';
import { RatingStars, PriceTag } from '../ui';
import { Fonts, BorderRadius, Spacing, Shadows, Animations } from '../../constants/fonts';

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

    // Animation values
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const wishlistAnim = useRef(new Animated.Value(isInWishlist ? 1 : 0)).current;
    const quickAddAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: Animations.scale.pressed,
            ...Animations.spring.snappy,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            ...Animations.spring.bouncy,
            useNativeDriver: true,
        }).start();
    };

    const handlePress = () => {
        router.push(`/product/${product.id}`);
    };

    const handleWishlistToggle = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // Animate heart
        Animated.sequence([
            Animated.spring(wishlistAnim, {
                toValue: isInWishlist ? 0 : 1.3,
                ...Animations.spring.bouncy,
                useNativeDriver: true,
            }),
            Animated.spring(wishlistAnim, {
                toValue: isInWishlist ? 0 : 1,
                ...Animations.spring.gentle,
                useNativeDriver: true,
            }),
        ]).start();

        if (isInWishlist) {
            dispatch(removeFromWishlist(product.id));
        } else {
            dispatch(addToWishlist(product));
        }
    };

    const handleQuickAdd = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Animate button
        Animated.sequence([
            Animated.spring(quickAddAnim, {
                toValue: 0.8,
                ...Animations.spring.snappy,
                useNativeDriver: true,
            }),
            Animated.spring(quickAddAnim, {
                toValue: 1,
                ...Animations.spring.bouncy,
                useNativeDriver: true,
            }),
        ]).start();

        dispatch(addToCart({ product, quantity: 1 }));
    };

    const discountPercent = product.compareAtPrice
        ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
        : 0;

    const heartScale = wishlistAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1],
    });

    if (layout === 'list') {
        return (
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Pressable
                    onPress={handlePress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={[
                        styles.listContainer,
                        { backgroundColor: colors.surface },
                        Shadows.md
                    ]}
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
                            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                                <Ionicons
                                    name={isInWishlist ? 'heart' : 'heart-outline'}
                                    size={22}
                                    color={isInWishlist ? colors.error : colors.textTertiary}
                                />
                            </Animated.View>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Animated.View>
        );
    }

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[
                    styles.gridContainer,
                    {
                        backgroundColor: colors.surface,
                        width: CARD_WIDTH,
                        borderWidth: 1,
                        borderColor: colors.border,
                    },
                    Shadows.lg
                ]}
            >
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: product.images[0]?.url }}
                        style={styles.gridImage}
                        contentFit="cover"
                        transition={200}
                    />

                    {/* Premium gradient overlay */}
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.03)']}
                        style={styles.imageOverlay}
                    />

                    {/* Discount badge with gradient */}
                    {discountPercent > 0 && (
                        <LinearGradient
                            colors={colors.gradientRose as unknown as string[]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.discountBadge}
                        >
                            <Text style={styles.discountText}>-{discountPercent}%</Text>
                        </LinearGradient>
                    )}

                    {/* New badge with gradient */}
                    {product.isNew && !discountPercent && (
                        <LinearGradient
                            colors={colors.gradientPrimary as unknown as string[]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.newBadge}
                        >
                            <Text style={styles.newText}>NEW</Text>
                        </LinearGradient>
                    )}

                    {/* Wishlist button with glass effect */}
                    <TouchableOpacity
                        onPress={handleWishlistToggle}
                        style={[
                            styles.wishlistButton,
                            {
                                backgroundColor: colors.glass,
                                borderWidth: 1,
                                borderColor: colors.glassBorder,
                            }
                        ]}
                    >
                        <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                            <Ionicons
                                name={isInWishlist ? 'heart' : 'heart-outline'}
                                size={18}
                                color={isInWishlist ? colors.error : colors.textTertiary}
                            />
                        </Animated.View>
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

                {/* Quick add button with gradient */}
                <Animated.View
                    style={[
                        styles.quickAddWrapper,
                        { transform: [{ scale: quickAddAnim }] }
                    ]}
                >
                    <TouchableOpacity onPress={handleQuickAdd}>
                        <LinearGradient
                            colors={colors.gradientPrimary as unknown as string[]}
                            style={styles.quickAddButton}
                        >
                            <Ionicons name="add" size={20} color="#FFFFFF" />
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    gridContainer: {
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        marginBottom: Spacing.md,
    },
    imageContainer: {
        position: 'relative',
    },
    gridImage: {
        width: '100%',
        height: 170,
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    discountBadge: {
        position: 'absolute',
        top: Spacing.sm,
        left: Spacing.sm,
        paddingHorizontal: Spacing.md,
        paddingVertical: 4,
        borderRadius: BorderRadius.full,
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
        paddingHorizontal: Spacing.md,
        paddingVertical: 4,
        borderRadius: BorderRadius.full,
    },
    newText: {
        color: '#FFFFFF',
        fontSize: Fonts.sizes.xs,
        fontWeight: Fonts.weights.bold,
        letterSpacing: 0.5,
    },
    wishlistButton: {
        position: 'absolute',
        top: Spacing.sm,
        right: Spacing.sm,
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gridContent: {
        padding: Spacing.md,
        paddingTop: Spacing.sm,
    },
    brand: {
        fontSize: Fonts.sizes.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    title: {
        fontSize: Fonts.sizes.sm,
        fontWeight: Fonts.weights.semibold,
        marginBottom: Spacing.xs,
        lineHeight: 18,
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
    quickAddWrapper: {
        position: 'absolute',
        bottom: Spacing.md,
        right: Spacing.md,
    },
    quickAddButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // List layout styles
    listContainer: {
        flexDirection: 'row',
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        marginBottom: Spacing.md,
    },
    listImage: {
        width: 120,
        height: 130,
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
