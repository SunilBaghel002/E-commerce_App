// Cart Screen
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
                    <View style={[styles.emptyIconContainer, { backgroundColor: colors.surfaceSecondary }]}>
                        <Ionicons name="cart-outline" size={64} color={colors.textTertiary} />
                    </View>
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
                        <CustomInput
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChangeText={setCouponCode}
                            leftIcon="pricetag-outline"
                            rightIcon="arrow-forward"
                            onRightIconPress={() => console.log('Apply coupon')}
                            containerStyle={{ marginBottom: 0 }}
                        />
                    </View>
                }
            />

            {/* Summary */}
            <View style={[styles.summaryContainer, { backgroundColor: colors.surface }, Shadows.lg]}>
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
                    <Text style={[styles.summaryValue, { color: colors.success }]}>
                        FREE
                    </Text>
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
                <CustomButton
                    title="Proceed to Checkout"
                    onPress={handleCheckout}
                    fullWidth
                    size="lg"
                    icon="arrow-forward"
                    iconPosition="right"
                    style={{ marginTop: Spacing.md }}
                />
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
        paddingBottom: 280,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.xl,
    },
    emptyTitle: {
        fontSize: Fonts.sizes.xl,
        fontWeight: Fonts.weights.bold,
        marginBottom: Spacing.sm,
    },
    emptySubtitle: {
        fontSize: Fonts.sizes.md,
        textAlign: 'center',
    },
    couponContainer: {
        marginTop: Spacing.md,
    },
    summaryContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: Spacing.lg,
        borderTopLeftRadius: BorderRadius['2xl'],
        borderTopRightRadius: BorderRadius['2xl'],
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
        fontWeight: Fonts.weights.medium,
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
        fontSize: Fonts.sizes.xl,
        fontWeight: Fonts.weights.bold,
    },
});

export default CartScreen;
