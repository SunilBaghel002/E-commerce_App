// Cart Item component with premium styling
import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch } from '../../store';
import { removeFromCart, updateQuantity } from '../../store/slices/cartSlice';
import { addToWishlist } from '../../store/slices/wishlistSlice';
import { CartItem as CartItemType } from '../../types';
import { QuantitySelector, PriceTag } from '../ui';
import { Fonts, BorderRadius, Spacing, Shadows, Animations } from '../../constants/fonts';

interface CartItemProps {
    item: CartItemType;
    showActions?: boolean;
}

const CartItem: React.FC<CartItemProps> = ({ item, showActions = true }) => {
    const { colors } = useTheme();
    const dispatch = useAppDispatch();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.98,
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

    const handleQuantityIncrease = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }));
    };

    const handleQuantityDecrease = () => {
        if (item.quantity > 1) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }));
        }
    };

    const handleRemove = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        dispatch(removeFromCart(item.id));
    };

    const handleSaveForLater = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        dispatch(addToWishlist(item.product));
        dispatch(removeFromCart(item.id));
    };

    const itemTotal = item.product.price * item.quantity;

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[
                    styles.container,
                    {
                        backgroundColor: colors.surface,
                        borderWidth: 1,
                        borderColor: colors.border,
                    },
                    Shadows.md
                ]}
            >
                <Image
                    source={{ uri: item.product.images[0]?.url }}
                    style={styles.image}
                    contentFit="cover"
                    transition={200}
                />

                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.titleContainer}>
                            {item.product.brand && (
                                <Text style={[styles.brand, { color: colors.textTertiary }]}>
                                    {item.product.brand}
                                </Text>
                            )}
                            <Text
                                style={[styles.title, { color: colors.text }]}
                                numberOfLines={2}
                            >
                                {item.product.name}
                            </Text>
                        </View>
                        {showActions && (
                            <TouchableOpacity
                                onPress={handleRemove}
                                style={[
                                    styles.removeButton,
                                    { backgroundColor: colors.errorLight }
                                ]}
                            >
                                <Ionicons name="trash-outline" size={16} color={colors.error} />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Variants */}
                    {(item.selectedSize || item.selectedColor) && (
                        <View style={styles.variantsRow}>
                            {item.selectedSize && (
                                <View style={[styles.variantBadge, { backgroundColor: colors.surfaceSecondary }]}>
                                    <Text style={[styles.variantText, { color: colors.textSecondary }]}>
                                        Size: {item.selectedSize.value}
                                    </Text>
                                </View>
                            )}
                            {item.selectedColor && (
                                <View style={[styles.variantBadge, { backgroundColor: colors.surfaceSecondary }]}>
                                    <Text style={[styles.variantText, { color: colors.textSecondary }]}>
                                        {item.selectedColor.value}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}

                    <View style={styles.footer}>
                        <QuantitySelector
                            quantity={item.quantity}
                            onIncrease={handleQuantityIncrease}
                            onDecrease={handleQuantityDecrease}
                            size="sm"
                        />
                        <PriceTag
                            price={itemTotal}
                            compareAtPrice={
                                item.product.compareAtPrice
                                    ? item.product.compareAtPrice * item.quantity
                                    : undefined
                            }
                            size="md"
                        />
                    </View>

                    {showActions && (
                        <TouchableOpacity
                            onPress={handleSaveForLater}
                            style={[styles.saveButton, { borderTopColor: colors.border }]}
                        >
                            <Ionicons name="heart-outline" size={16} color={colors.primary} />
                            <Text style={[styles.saveText, { color: colors.primary }]}>
                                Save for Later
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: BorderRadius.xl,
        marginBottom: Spacing.md,
        overflow: 'hidden',
    },
    image: {
        width: 110,
        height: 140,
    },
    content: {
        flex: 1,
        padding: Spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    titleContainer: {
        flex: 1,
        marginRight: Spacing.sm,
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
        lineHeight: 18,
    },
    removeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    variantsRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginTop: Spacing.sm,
    },
    variantBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: BorderRadius.md,
    },
    variantText: {
        fontSize: Fonts.sizes.xs,
        fontWeight: Fonts.weights.medium,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: Spacing.md,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.md,
        paddingTop: Spacing.md,
        borderTopWidth: 1,
        gap: Spacing.xs,
    },
    saveText: {
        fontSize: Fonts.sizes.sm,
        fontWeight: Fonts.weights.semibold,
    },
});

export default CartItem;
