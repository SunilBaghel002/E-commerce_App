// Checkout Screen
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAppSelector } from '../store';
import { selectCartItems, selectCartSubtotal, selectCartTotal } from '../store/slices/cartSlice';
import { Address } from '../types';
import { Header, CustomButton, CustomInput } from '../components/ui';
import { Fonts, Spacing, BorderRadius, Shadows } from '../constants/fonts';

const mockAddresses: Address[] = [
    {
        id: '1',
        userId: '1',
        fullName: 'John Doe',
        phone: '+1 234 567 890',
        addressLine1: '123 Main Street',
        addressLine2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        isDefault: true,
        type: 'home',
    },
];

const CheckoutScreen = () => {
    const { colors } = useTheme();
    const router = useRouter();

    const items = useAppSelector(selectCartItems);
    const subtotal = useAppSelector(selectCartSubtotal);
    const total = useAppSelector(selectCartTotal);

    const [selectedAddress, setSelectedAddress] = useState<Address | null>(mockAddresses[0]);
    const [paymentMethod, setPaymentMethod] = useState<string>('card');

    const shippingCost = 0; // Free shipping
    const grandTotal = total + shippingCost;

    const handlePlaceOrder = () => {
        router.push('/payment');
    };

    const formatPrice = (price: number) => `$${price.toFixed(2)}`;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Checkout" showBack />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Delivery Address */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Delivery Address
                        </Text>
                        <TouchableOpacity>
                            <Text style={[styles.changeText, { color: colors.primary }]}>Change</Text>
                        </TouchableOpacity>
                    </View>

                    {selectedAddress ? (
                        <View style={[styles.addressCard, { backgroundColor: colors.surface }, Shadows.sm]}>
                            <View style={styles.addressHeader}>
                                <View style={[styles.addressBadge, { backgroundColor: colors.primaryLight + '30' }]}>
                                    <Ionicons name="home" size={16} color={colors.primary} />
                                    <Text style={[styles.addressType, { color: colors.primary }]}>
                                        {selectedAddress.type.toUpperCase()}
                                    </Text>
                                </View>
                                {selectedAddress.isDefault && (
                                    <View style={[styles.defaultBadge, { backgroundColor: colors.successLight }]}>
                                        <Text style={[styles.defaultText, { color: colors.success }]}>Default</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={[styles.addressName, { color: colors.text }]}>
                                {selectedAddress.fullName}
                            </Text>
                            <Text style={[styles.addressDetail, { color: colors.textSecondary }]}>
                                {selectedAddress.addressLine1}
                                {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
                            </Text>
                            <Text style={[styles.addressDetail, { color: colors.textSecondary }]}>
                                {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}
                            </Text>
                            <Text style={[styles.addressPhone, { color: colors.textSecondary }]}>
                                {selectedAddress.phone}
                            </Text>
                        </View>
                    ) : (
                        <CustomButton
                            title="Add Delivery Address"
                            onPress={() => router.push('/addresses')}
                            variant="outline"
                            icon="add"
                            fullWidth
                        />
                    )}
                </View>

                {/* Payment Method */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Payment Method
                        </Text>
                    </View>

                    <View style={styles.paymentOptions}>
                        {[
                            { id: 'card', icon: 'card-outline' as const, label: 'Credit/Debit Card' },
                            { id: 'apple', icon: 'logo-apple' as const, label: 'Apple Pay' },
                            { id: 'google', icon: 'logo-google' as const, label: 'Google Pay' },
                            { id: 'cod', icon: 'cash-outline' as const, label: 'Cash on Delivery' },
                        ].map((method) => (
                            <TouchableOpacity
                                key={method.id}
                                onPress={() => setPaymentMethod(method.id)}
                                style={[
                                    styles.paymentOption,
                                    {
                                        backgroundColor: colors.surface,
                                        borderColor: paymentMethod === method.id ? colors.primary : colors.border,
                                    },
                                ]}
                            >
                                <View style={[
                                    styles.radioOuter,
                                    { borderColor: paymentMethod === method.id ? colors.primary : colors.border },
                                ]}>
                                    {paymentMethod === method.id && (
                                        <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                                    )}
                                </View>
                                <Ionicons name={method.icon} size={24} color={colors.text} style={styles.paymentIcon} />
                                <Text style={[styles.paymentLabel, { color: colors.text }]}>
                                    {method.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Order Summary */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Order Summary
                    </Text>

                    <View style={[styles.summaryCard, { backgroundColor: colors.surface }, Shadows.sm]}>
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                                Items ({items.length})
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
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                                Tax
                            </Text>
                            <Text style={[styles.summaryValue, { color: colors.text }]}>
                                Included
                            </Text>
                        </View>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <View style={styles.summaryRow}>
                            <Text style={[styles.totalLabel, { color: colors.text }]}>
                                Total
                            </Text>
                            <Text style={[styles.totalValue, { color: colors.primary }]}>
                                {formatPrice(grandTotal)}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Place Order Button */}
            <View style={[styles.footer, { backgroundColor: colors.surface }, Shadows.lg]}>
                <View style={styles.footerTotal}>
                    <Text style={[styles.footerLabel, { color: colors.textSecondary }]}>
                        Total
                    </Text>
                    <Text style={[styles.footerValue, { color: colors.primary }]}>
                        {formatPrice(grandTotal)}
                    </Text>
                </View>
                <CustomButton
                    title="Place Order"
                    onPress={handlePlaceOrder}
                    size="lg"
                    icon="arrow-forward"
                    iconPosition="right"
                    style={{ flex: 1, marginLeft: Spacing.lg }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: Spacing.lg,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        fontSize: Fonts.sizes.lg,
        fontWeight: Fonts.weights.semibold,
    },
    changeText: {
        fontSize: Fonts.sizes.sm,
        fontWeight: Fonts.weights.medium,
    },
    addressCard: {
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
    },
    addressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
        gap: Spacing.sm,
    },
    addressBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: BorderRadius.sm,
        gap: 4,
    },
    addressType: {
        fontSize: Fonts.sizes.xs,
        fontWeight: Fonts.weights.semibold,
    },
    defaultBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: BorderRadius.sm,
    },
    defaultText: {
        fontSize: Fonts.sizes.xs,
        fontWeight: Fonts.weights.medium,
    },
    addressName: {
        fontSize: Fonts.sizes.md,
        fontWeight: Fonts.weights.semibold,
        marginBottom: 4,
    },
    addressDetail: {
        fontSize: Fonts.sizes.sm,
        lineHeight: 20,
    },
    addressPhone: {
        fontSize: Fonts.sizes.sm,
        marginTop: Spacing.sm,
    },
    paymentOptions: {
        gap: Spacing.sm,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        borderWidth: 1.5,
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    paymentIcon: {
        marginHorizontal: Spacing.md,
    },
    paymentLabel: {
        fontSize: Fonts.sizes.md,
        fontWeight: Fonts.weights.medium,
    },
    summaryCard: {
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
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
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.lg,
        paddingBottom: Spacing.xl,
        borderTopLeftRadius: BorderRadius['2xl'],
        borderTopRightRadius: BorderRadius['2xl'],
    },
    footerTotal: {},
    footerLabel: {
        fontSize: Fonts.sizes.sm,
    },
    footerValue: {
        fontSize: Fonts.sizes.xl,
        fontWeight: Fonts.weights.bold,
    },
});

export default CheckoutScreen;
