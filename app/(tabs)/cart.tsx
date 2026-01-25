// Cart Screen with premium UI
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useAppSelector, useAppDispatch } from '../../store';
import {
    selectCartItems,
    selectCartSubtotal,
    selectCartTotal,
    clearCart,
} from '../../store/slices/cartSlice';
import { Header, CustomButton, CustomInput } from '../../components/ui';
import { CartItem } from '../../components/cart';
import { Fonts, Spacing, BorderRadius, Shadows } from '../../constants/fonts';

const CartScreen = () => {
    const { colors } = useTheme();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const items = useAppSelector(selectCartItems);
    const subtotal = useAppSelector(selectCartSubtotal);
    const total = useAppSelector(selectCartTotal);

    const [couponCode, setCouponCode] = React.useState('');

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const handleCheckout = () => {
        router.push('/checkout');
    };

    const formatPrice = (price: number) => `$${price.toFixed(2)}`;

    if (items.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header title="Shopping Cart" />
                <View style={styles.emptyContainer}>
                    <LinearGradient
                        colors={colors.gradientPrimary as unknown as string[]}
                        style={styles.emptyIconContainer}
                    >
                        <Ionicons name="cart-outline" size={64} color="#FFFFFF" />
                    </LinearGradient>
                    <Text style={[styles.emptyTitle, { color: colors.text }]}>
                        Your cart is empty
                    </Text>
                    <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                        Looks like you haven't added anything to your cart yet
                    </Text>
                    <CustomButton
                        title="Start Shopping"
                        onPress={() => router.replace('/(tabs)')}
                        icon="bag-outline"
                        variant="gradient"
                        style={{ marginTop: Spacing.xl }}
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header
                title="Shopping Cart"
                actions={[
                    { icon: 'trash-outline', onPress: handleClearCart },
                ]}
            />

            <FlatList
                data={items}
                renderItem={({ item }) => <CartItem item={item} />}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <View style={styles.couponContainer}>
                        <View style={[
                            styles.couponInputContainer,
                            {
                                backgroundColor: colors.surface,
                                borderWidth: 1,
                                borderColor: colors.border,
                            }
                        ]}>
                            <Ionicons name="pricetag-outline" size={20} color={colors.textTertiary} />
                            <View style={styles.couponInput}>
                                <Text style={[styles.couponPlaceholder, { color: colors.textTertiary }]}>
                                    Enter coupon code
                                </Text>
                            </View>
                            <TouchableOpacity style={[styles.applyButton, { backgroundColor: colors.primary }]}>
                                <Text style={styles.applyButtonText}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            />

            {/* Summary Card */}
            <View style={[
                styles.summaryContainer,
                {
                    backgroundColor: colors.surface,
                    borderTopWidth: 1,
                    borderColor: colors.border,
                },
                Shadows.xl
            ]}>
                <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                        Subtotal ({items.length} items)
                    </Text>
                    <Text style={[styles.summaryValue, { color: colors.text }]}>
                        {formatPrice(subtotal)}
                    </Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                        Shipping
                    </Text>
                    <View style={[styles.freeShippingBadge, { backgroundColor: colors.successLight }]}>
                        <Text style={[styles.freeShippingText, { color: colors.success }]}>FREE</Text>
                    </View>
                </View>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <View style={styles.summaryRow}>
                    <Text style={[styles.totalLabel, { color: colors.text }]}>
                        Total
                    </Text>
                    <Text style={[styles.totalValue, { color: colors.primary }]}>
                        {formatPrice(total)}
                    </Text>
                </View>

                {/* Gradient Checkout Button */}
                <TouchableOpacity
                    onPress={handleCheckout}
                    activeOpacity={0.9}
                    style={[styles.checkoutButtonWrapper, Shadows.lg]}
                >
                    <LinearGradient
                        colors={colors.gradientPrimary as unknown as string[]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.checkoutButton}
                    >
                        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                        <View style={styles.checkoutArrow}>
                            <Ionicons name="arrow-forward" size={18} color={colors.primary} />
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        padding: Spacing.lg,
        paddingBottom: 300,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    emptyIconContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.xl,
    },
    emptyTitle: {
        fontSize: Fonts.sizes['2xl'],
        fontWeight: Fonts.weights.bold,
        marginBottom: Spacing.sm,
    },
    emptySubtitle: {
        fontSize: Fonts.sizes.md,
        textAlign: 'center',
        maxWidth: 280,
    },
    couponContainer: {
        marginTop: Spacing.lg,
    },
    couponInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: Spacing.lg,
        paddingRight: Spacing.xs,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.xl,
        gap: Spacing.md,
    },
    couponInput: {
        flex: 1,
        paddingVertical: Spacing.md,
    },
    couponPlaceholder: {
        fontSize: Fonts.sizes.md,
    },
    applyButton: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
    },
    applyButtonText: {
        color: '#FFFFFF',
        fontSize: Fonts.sizes.sm,
        fontWeight: Fonts.weights.bold,
    },
    summaryContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: Spacing.lg,
        paddingBottom: Spacing.xl,
        borderTopLeftRadius: BorderRadius['3xl'],
        borderTopRightRadius: BorderRadius['3xl'],
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    summaryLabel: {
        fontSize: Fonts.sizes.md,
    },
    summaryValue: {
        fontSize: Fonts.sizes.md,
        fontWeight: Fonts.weights.semibold,
    },
    freeShippingBadge: {
        paddingHorizontal: Spacing.md,
        paddingVertical: 4,
        borderRadius: BorderRadius.full,
    },
    freeShippingText: {
        fontSize: Fonts.sizes.xs,
        fontWeight: Fonts.weights.bold,
    },
    divider: {
        height: 1,
        marginVertical: Spacing.md,
    },
    totalLabel: {
        fontSize: Fonts.sizes.lg,
        fontWeight: Fonts.weights.semibold,
    },
    totalValue: {
        fontSize: Fonts.sizes['2xl'],
        fontWeight: Fonts.weights.bold,
    },
    checkoutButtonWrapper: {
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        marginTop: Spacing.lg,
    },
    checkoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.lg,
        gap: Spacing.md,
    },
    checkoutButtonText: {
        color: '#FFFFFF',
        fontSize: Fonts.sizes.lg,
        fontWeight: Fonts.weights.bold,
    },
    checkoutArrow: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default CartScreen;
