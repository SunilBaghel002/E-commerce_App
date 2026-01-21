// Cart Item component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch } from '../../store';
import { removeFromCart, updateQuantity } from '../../store/slices/cartSlice';
import { addToWishlist } from '../../store/slices/wishlistSlice';
import { CartItem as CartItemType } from '../../types';
import { QuantitySelector, PriceTag } from '../ui';
import { Fonts, BorderRadius, Spacing, Shadows } from '../../constants/fonts';

interface CartItemProps {
    item: CartItemType;
    showActions?: boolean;
}

const CartItem: React.FC<CartItemProps> = ({ item, showActions = true }) => {
    const { colors } = useTheme();
    const dispatch = useAppDispatch();

    const handleQuantityIncrease = () => {
        dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }));
    };

    const handleQuantityDecrease = () => {
        if (item.quantity > 1) {
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
        <View style={[styles.container, { backgroundColor: colors.surface }, Shadows.sm]}>
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
                        <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
                            <Ionicons name="trash-outline" size={20} color={colors.error} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Variants */}
                {(item.selectedSize || item.selectedColor) && (
                    <View style={styles.variantsRow}>
                        {item.selectedSize && (
                            <Text style={[styles.variant, { color: colors.textSecondary }]}>
                                Size: {item.selectedSize.value}
                            </Text>
                        )}
                        {item.selectedColor && (
                            <Text style={[styles.variant, { color: colors.textSecondary }]}>
                                Color: {item.selectedColor.value}
                            </Text>
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
                        style={styles.saveButton}
                    >
                        <Ionicons name="heart-outline" size={16} color={colors.primary} />
                        <Text style={[styles.saveText, { color: colors.primary }]}>
                            Save for Later
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.md,
        overflow: 'hidden',
    },
    image: {
        width: 100,
        height: 120,
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
        marginBottom: 2,
    },
    title: {
        fontSize: Fonts.sizes.sm,
        fontWeight: Fonts.weights.medium,
    },
    removeButton: {
        padding: Spacing.xs,
    },
    variantsRow: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginTop: Spacing.xs,
    },
    variant: {
        fontSize: Fonts.sizes.xs,
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
        gap: Spacing.xs,
    },
    saveText: {
        fontSize: Fonts.sizes.sm,
        fontWeight: Fonts.weights.medium,
    },
});

export default CartItem;
