// Product Detail Screen - Simplified without Reanimated
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Share,
    Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch, useAppSelector } from '../../store';
import { addToCart } from '../../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist, selectIsInWishlist } from '../../store/slices/wishlistSlice';
import { productService } from '../../services';
import { Product, ProductVariant } from '../../types';
import { Header, CustomButton, LoadingSpinner, RatingStars, PriceTag } from '../../components/ui';
import { ImageCarousel } from '../../components/product';
import { Fonts, Spacing, BorderRadius, Shadows } from '../../constants/fonts';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { colors } = useTheme();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<ProductVariant | undefined>();
    const [selectedColor, setSelectedColor] = useState<ProductVariant | undefined>();
    const [quantity, setQuantity] = useState(1);

    const isInWishlist = useAppSelector(selectIsInWishlist(id || ''));

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        if (!id) return;

        try {
            const data = await productService.getProductById(id);
            setProduct(data);

            // Set default selections
            if (data?.variants?.sizes?.length) {
                setSelectedSize(data.variants.sizes[0]);
            }
            if (data?.variants?.colors?.length) {
                setSelectedColor(data.variants.colors[0]);
            }
        } catch (error) {
            console.error('Error loading product:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleWishlistToggle = () => {
        if (!product) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (isInWishlist) {
            dispatch(removeFromWishlist(product.id));
        } else {
            dispatch(addToWishlist(product));
        }
    };

    const handleShare = async () => {
        if (!product) return;
        try {
            await Share.share({
                title: product.name,
                message: `Check out ${product.name} - $${product.price}`,
            });
        } catch (error) {
            console.log('Share error:', error);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        dispatch(addToCart({
            product,
            quantity,
            selectedSize,
            selectedColor,
        }));
        router.push('/(tabs)/cart');
    };

    const handleBuyNow = () => {
        if (!product) return;
        dispatch(addToCart({
            product,
            quantity,
            selectedSize,
            selectedColor,
        }));
        router.push('/checkout');
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header showBack transparent />
                <LoadingSpinner fullScreen />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header showBack title="Product Not Found" />
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, { color: colors.textSecondary }]}>
                        The product you're looking for doesn't exist
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <Header
                showBack
                transparent
                actions={[
                    { icon: 'share-outline', onPress: handleShare },
                    {
                        icon: isInWishlist ? 'heart' : 'heart-outline',
                        onPress: handleWishlistToggle,
                    },
                ]}
            />

            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                {/* Image Carousel */}
                <ImageCarousel
                    images={product.images}
                    height={width}
                    showThumbnails
                />

                {/* Product Info */}
                <View style={[styles.infoContainer, { backgroundColor: colors.background }]}>
                    {/* Brand & Title */}
                    {product.brand && (
                        <Text style={[styles.brand, { color: colors.primary }]}>
                            {product.brand}
                        </Text>
                    )}
                    <Text style={[styles.title, { color: colors.text }]}>
                        {product.name}
                    </Text>

                    {/* Rating */}
                    <View style={styles.ratingRow}>
                        <RatingStars rating={product.rating} showCount count={product.reviewCount} />
                        <TouchableOpacity style={styles.reviewsLink}>
                            <Text style={[styles.reviewsLinkText, { color: colors.primary }]}>
                                See all reviews
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Price */}
                    <View style={styles.priceRow}>
                        <PriceTag
                            price={product.price}
                            compareAtPrice={product.compareAtPrice}
                            size="lg"
                        />
                        {product.isInStock ? (
                            <View style={[styles.stockBadge, { backgroundColor: colors.successLight }]}>
                                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                                <Text style={[styles.stockText, { color: colors.success }]}>In Stock</Text>
                            </View>
                        ) : (
                            <View style={[styles.stockBadge, { backgroundColor: colors.errorLight }]}>
                                <Ionicons name="close-circle" size={16} color={colors.error} />
                                <Text style={[styles.stockText, { color: colors.error }]}>Out of Stock</Text>
                            </View>
                        )}
                    </View>

                    {/* Size Selection */}
                    {product.variants?.sizes && product.variants.sizes.length > 0 && (
                        <View style={styles.variantSection}>
                            <Text style={[styles.variantLabel, { color: colors.text }]}>
                                Size: <Text style={{ fontWeight: '600' }}>{selectedSize?.value}</Text>
                            </Text>
                            <View style={styles.variantOptions}>
                                {product.variants.sizes.map((size) => (
                                    <TouchableOpacity
                                        key={size.id}
                                        onPress={() => setSelectedSize(size)}
                                        style={[
                                            styles.variantOption,
                                            {
                                                borderColor: selectedSize?.id === size.id ? colors.primary : colors.border,
                                                backgroundColor: selectedSize?.id === size.id ? colors.primaryLight + '20' : 'transparent',
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.variantText,
                                                { color: selectedSize?.id === size.id ? colors.primary : colors.text },
                                            ]}
                                        >
                                            {size.value}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Color Selection */}
                    {product.variants?.colors && product.variants.colors.length > 0 && (
                        <View style={styles.variantSection}>
                            <Text style={[styles.variantLabel, { color: colors.text }]}>
                                Color: <Text style={{ fontWeight: '600' }}>{selectedColor?.value}</Text>
                            </Text>
                            <View style={styles.variantOptions}>
                                {product.variants.colors.map((color) => (
                                    <TouchableOpacity
                                        key={color.id}
                                        onPress={() => setSelectedColor(color)}
                                        style={[
                                            styles.colorOption,
                                            {
                                                borderColor: selectedColor?.id === color.id ? colors.primary : colors.border,
                                                borderWidth: selectedColor?.id === color.id ? 2 : 1,
                                            },
                                        ]}
                                    >
                                        <Text style={[styles.colorText, { color: colors.text }]}>
                                            {color.value}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Description */}
                    <View style={styles.descriptionSection}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Description
                        </Text>
                        <Text style={[styles.description, { color: colors.textSecondary }]}>
                            {product.description}
                        </Text>
                    </View>

                    <View style={{ height: 120 }} />
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={[styles.actionBar, { backgroundColor: colors.surface }, Shadows.lg]}>
                <CustomButton
                    title="Add to Cart"
                    onPress={handleAddToCart}
                    variant="outline"
                    icon="cart-outline"
                    style={{ flex: 1 }}
                    disabled={!product.isInStock}
                />
                <CustomButton
                    title="Buy Now"
                    onPress={handleBuyNow}
                    icon="flash"
                    style={{ flex: 1 }}
                    disabled={!product.isInStock}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        fontSize: Fonts.sizes.md,
    },
    infoContainer: {
        padding: Spacing.lg,
        borderTopLeftRadius: BorderRadius['2xl'],
        borderTopRightRadius: BorderRadius['2xl'],
        marginTop: -Spacing.xl,
    },
    brand: {
        fontSize: Fonts.sizes.sm,
        fontWeight: Fonts.weights.semibold,
        textTransform: 'uppercase',
        marginBottom: Spacing.xs,
    },
    title: {
        fontSize: Fonts.sizes['2xl'],
        fontWeight: Fonts.weights.bold,
        marginBottom: Spacing.md,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.lg,
    },
    reviewsLink: {
        padding: Spacing.xs,
    },
    reviewsLinkText: {
        fontSize: Fonts.sizes.sm,
        fontWeight: Fonts.weights.medium,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.xl,
    },
    stockBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
        gap: 4,
    },
    stockText: {
        fontSize: Fonts.sizes.sm,
        fontWeight: Fonts.weights.medium,
    },
    variantSection: {
        marginBottom: Spacing.xl,
    },
    variantLabel: {
        fontSize: Fonts.sizes.md,
        marginBottom: Spacing.md,
    },
    variantOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    variantOption: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 1.5,
        minWidth: 50,
        alignItems: 'center',
    },
    variantText: {
        fontSize: Fonts.sizes.sm,
        fontWeight: Fonts.weights.medium,
    },
    colorOption: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        minWidth: 80,
        alignItems: 'center',
    },
    colorText: {
        fontSize: Fonts.sizes.sm,
        fontWeight: Fonts.weights.medium,
    },
    descriptionSection: {
        marginTop: Spacing.md,
    },
    sectionTitle: {
        fontSize: Fonts.sizes.lg,
        fontWeight: Fonts.weights.semibold,
        marginBottom: Spacing.md,
    },
    description: {
        fontSize: Fonts.sizes.md,
        lineHeight: 24,
    },
    actionBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.lg,
        paddingBottom: Spacing.xl,
        gap: Spacing.md,
        borderTopLeftRadius: BorderRadius['2xl'],
        borderTopRightRadius: BorderRadius['2xl'],
    },
});
