// Order Tracking Screen
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Header } from '../../components/ui';
import { Fonts, Spacing, BorderRadius, Shadows } from '../../constants/fonts';

const mockOrderDetails = {
    id: '1',
    orderNumber: 'ORD-12345678',
    status: 'shipped',
    total: 299.99,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    estimatedDelivery: new Date(Date.now() + 86400000 * 2).toISOString(),
    items: [
        { id: '1', name: 'Premium Wireless Headphones', quantity: 1, price: 299.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200' },
    ],
    tracking: [
        { status: 'Order Placed', timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), completed: true },
        { status: 'Payment Confirmed', timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), completed: true },
        { status: 'Processing', timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), completed: true },
        { status: 'Shipped', timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), completed: true },
        { status: 'Out for Delivery', timestamp: null, completed: false },
        { status: 'Delivered', timestamp: null, completed: false },
    ],
    address: {
        name: 'John Doe',
        line1: '123 Main Street, Apt 4B',
        line2: 'New York, NY 10001',
    },
};

const OrderTrackingScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { colors } = useTheme();

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Order Details" showBack />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Order Info */}
                <View style={[styles.card, { backgroundColor: colors.surface }, Shadows.sm]}>
                    <Text style={[styles.orderNumber, { color: colors.text }]}>
                        {mockOrderDetails.orderNumber}
                    </Text>
                    <Text style={[styles.orderDate, { color: colors.textSecondary }]}>
                        Placed on {formatDate(mockOrderDetails.createdAt)}
                    </Text>
                    <View style={[styles.deliveryInfo, { backgroundColor: colors.infoLight }]}>
                        <Ionicons name="time-outline" size={18} color={colors.info} />
                        <Text style={[styles.deliveryText, { color: colors.info }]}>
                            Estimated delivery: {formatDate(mockOrderDetails.estimatedDelivery)}
                        </Text>
                    </View>
                </View>

                {/* Tracking Timeline */}
                <View style={[styles.card, { backgroundColor: colors.surface }, Shadows.sm]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Order Tracking
                    </Text>
                    <View style={styles.timeline}>
                        {mockOrderDetails.tracking.map((step, index) => (
                            <View key={index} style={styles.timelineItem}>
                                <View style={styles.timelineLeft}>
                                    <View
                                        style={[
                                            styles.dot,
                                            {
                                                backgroundColor: step.completed ? colors.success : colors.border,
                                                borderColor: step.completed ? colors.success : colors.border,
                                            },
                                        ]}
                                    >
                                        {step.completed && (
                                            <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                                        )}
                                    </View>
                                    {index < mockOrderDetails.tracking.length - 1 && (
                                        <View
                                            style={[
                                                styles.line,
                                                { backgroundColor: step.completed ? colors.success : colors.border },
                                            ]}
                                        />
                                    )}
                                </View>
                                <View style={styles.timelineContent}>
                                    <Text
                                        style={[
                                            styles.stepTitle,
                                            { color: step.completed ? colors.text : colors.textTertiary },
                                        ]}
                                    >
                                        {step.status}
                                    </Text>
                                    {step.timestamp && (
                                        <Text style={[styles.stepTime, { color: colors.textSecondary }]}>
                                            {formatDate(step.timestamp)}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Delivery Address */}
                <View style={[styles.card, { backgroundColor: colors.surface }, Shadows.sm]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Delivery Address
                    </Text>
                    <Text style={[styles.addressName, { color: colors.text }]}>
                        {mockOrderDetails.address.name}
                    </Text>
                    <Text style={[styles.addressLine, { color: colors.textSecondary }]}>
                        {mockOrderDetails.address.line1}
                    </Text>
                    <Text style={[styles.addressLine, { color: colors.textSecondary }]}>
                        {mockOrderDetails.address.line2}
                    </Text>
                </View>

                {/* Order Total */}
                <View style={[styles.card, { backgroundColor: colors.surface }, Shadows.sm]}>
                    <View style={styles.totalRow}>
                        <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
                        <Text style={[styles.totalValue, { color: colors.primary }]}>
                            ${mockOrderDetails.total.toFixed(2)}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: Spacing.lg },
    card: { borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.md },
    orderNumber: { fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.bold, marginBottom: 4 },
    orderDate: { fontSize: Fonts.sizes.sm, marginBottom: Spacing.md },
    deliveryInfo: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderRadius: BorderRadius.md, gap: Spacing.sm },
    deliveryText: { fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.medium },
    sectionTitle: { fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.semibold, marginBottom: Spacing.lg },
    timeline: { paddingLeft: Spacing.xs },
    timelineItem: { flexDirection: 'row', minHeight: 60 },
    timelineLeft: { alignItems: 'center', width: 24 },
    dot: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
    line: { width: 2, flex: 1, marginVertical: 4 },
    timelineContent: { marginLeft: Spacing.md, flex: 1, paddingBottom: Spacing.md },
    stepTitle: { fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.medium },
    stepTime: { fontSize: Fonts.sizes.sm, marginTop: 2 },
    addressName: { fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.semibold, marginBottom: 4 },
    addressLine: { fontSize: Fonts.sizes.sm, lineHeight: 20 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    totalLabel: { fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.semibold },
    totalValue: { fontSize: Fonts.sizes.xl, fontWeight: Fonts.weights.bold },
});

export default OrderTrackingScreen;
