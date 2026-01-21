// Order Success Screen - Simplified without Reanimated
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAppDispatch } from '../store';
import { clearCart } from '../store/slices/cartSlice';
import { CustomButton } from '../components/ui';
import { Fonts, Spacing, BorderRadius } from '../constants/fonts';

export default function OrderSuccessScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const { orderId } = useLocalSearchParams<{ orderId: string }>();
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Clear cart on order success
        dispatch(clearCart());
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: colors.successLight }]}>
                    <Ionicons name="checkmark" size={64} color={colors.success} />
                </View>

                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        Order Placed Successfully!
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Thank you for your purchase. Your order has been confirmed and will be shipped soon.
                    </Text>

                    <View style={[styles.orderInfo, { backgroundColor: colors.surfaceSecondary }]}>
                        <Text style={[styles.orderLabel, { color: colors.textSecondary }]}>
                            Order Number
                        </Text>
                        <Text style={[styles.orderNumber, { color: colors.text }]}>
                            {orderId || '#ORD-' + Date.now().toString().slice(-8)}
                        </Text>
                    </View>

                    <Text style={[styles.emailNote, { color: colors.textSecondary }]}>
                        A confirmation email has been sent to your registered email address.
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <CustomButton
                    title="Track Order"
                    onPress={() => router.push('/orders')}
                    variant="outline"
                    icon="navigate-outline"
                    fullWidth
                    style={{ marginBottom: Spacing.md }}
                />
                <CustomButton
                    title="Continue Shopping"
                    onPress={() => router.replace('/(tabs)')}
                    icon="bag-handle-outline"
                    fullWidth
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.xl,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing['2xl'],
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: Fonts.sizes['2xl'],
        fontWeight: Fonts.weights.bold,
        marginBottom: Spacing.md,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: Fonts.sizes.md,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: Spacing.xl,
    },
    orderInfo: {
        alignItems: 'center',
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing['3xl'],
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.xl,
    },
    orderLabel: {
        fontSize: Fonts.sizes.sm,
        marginBottom: Spacing.xs,
    },
    orderNumber: {
        fontSize: Fonts.sizes.xl,
        fontWeight: Fonts.weights.bold,
    },
    emailNote: {
        fontSize: Fonts.sizes.sm,
        textAlign: 'center',
    },
    footer: {
        padding: Spacing.lg,
        paddingBottom: Spacing['2xl'],
    },
});
