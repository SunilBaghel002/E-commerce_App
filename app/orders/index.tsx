// Orders List Screen
import React, { useState } from 'react';
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
import { Order, OrderStatus } from '../../types';
import { Header, CustomButton } from '../../components/ui';
import { Fonts, Spacing, BorderRadius, Shadows } from '../../constants/fonts';

const mockOrders: Order[] = [
    {
        id: '1',
        orderNumber: 'ORD-12345678',
        userId: '1',
        items: [],
        shippingAddress: {} as any,
        status: 'delivered',
        subtotal: 299.99,
        discount: 0,
        shipping: 0,
        tax: 0,
        total: 299.99,
        paymentMethod: 'card',
        paymentStatus: 'paid',
        deliveredAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        orderNumber: 'ORD-87654321',
        userId: '1',
        items: [],
        shippingAddress: {} as any,
        status: 'shipped',
        subtotal: 149.99,
        discount: 20,
        shipping: 0,
        tax: 0,
        total: 129.99,
        paymentMethod: 'card',
        paymentStatus: 'paid',
        estimatedDelivery: new Date(Date.now() + 86400000 * 2).toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '3',
        orderNumber: 'ORD-11112222',
        userId: '1',
        items: [],
        shippingAddress: {} as any,
        status: 'processing',
        subtotal: 599.99,
        discount: 0,
        shipping: 0,
        tax: 0,
        total: 599.99,
        paymentMethod: 'apple',
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

const statusConfig: Record<OrderStatus, { color: string; icon: keyof typeof Ionicons.glyphMap; label: string }> = {
    pending: { color: '#F59E0B', icon: 'time-outline', label: 'Pending' },
    confirmed: { color: '#3B82F6', icon: 'checkmark-circle-outline', label: 'Confirmed' },
    processing: { color: '#6366F1', icon: 'cube-outline', label: 'Processing' },
    shipped: { color: '#8B5CF6', icon: 'airplane-outline', label: 'Shipped' },
    out_for_delivery: { color: '#10B981', icon: 'bicycle-outline', label: 'Out for Delivery' },
    delivered: { color: '#22C55E', icon: 'checkmark-done', label: 'Delivered' },
    cancelled: { color: '#EF4444', icon: 'close-circle-outline', label: 'Cancelled' },
    refunded: { color: '#6B7280', icon: 'refresh-outline', label: 'Refunded' },
};

const OrdersScreen = () => {
    const { colors } = useTheme();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

    const filteredOrders = mockOrders.filter(order => {
        if (activeTab === 'active') {
            return ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery'].includes(order.status);
        }
        if (activeTab === 'completed') {
            return ['delivered', 'cancelled', 'refunded'].includes(order.status);
        }
        return true;
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const renderOrder = ({ item }: { item: Order }) => {
        const status = statusConfig[item.status];

        return (
            <TouchableOpacity
                onPress={() => router.push(`/orders/${item.id}`)}
                style={[styles.orderCard, { backgroundColor: colors.surface }, Shadows.sm]}
                activeOpacity={0.7}
            >
                <View style={styles.orderHeader}>
                    <Text style={[styles.orderNumber, { color: colors.text }]}>
                        {item.orderNumber}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
                        <Ionicons name={status.icon} size={14} color={status.color} />
                        <Text style={[styles.statusText, { color: status.color }]}>
                            {status.label}
                        </Text>
                    </View>
                </View>

                <View style={styles.orderDetails}>
                    <Text style={[styles.orderDate, { color: colors.textSecondary }]}>
                        Ordered on {formatDate(item.createdAt)}
                    </Text>
                    <Text style={[styles.orderTotal, { color: colors.text }]}>
                        ${item.total.toFixed(2)}
                    </Text>
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                <View style={styles.orderFooter}>
                    <Text style={[styles.deliveryText, { color: colors.textSecondary }]}>
                        {item.status === 'delivered'
                            ? `Delivered on ${formatDate(item.deliveredAt!)}`
                            : item.estimatedDelivery
                                ? `Expected by ${formatDate(item.estimatedDelivery)}`
                                : 'Processing your order'}
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color={colors.textTertiary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No orders yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Your orders will appear here
            </Text>
            <CustomButton
                title="Start Shopping"
                onPress={() => router.replace('/(tabs)')}
                style={{ marginTop: Spacing.xl }}
            />
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="My Orders" showBack />

            {/* Tabs */}
            <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
                {(['all', 'active', 'completed'] as const).map(tab => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => setActiveTab(tab)}
                        style={[
                            styles.tab,
                            activeTab === tab && { borderBottomColor: colors.primary, borderBottomWidth: 2 },
                        ]}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                { color: activeTab === tab ? colors.primary : colors.textSecondary },
                            ]}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={filteredOrders}
                renderItem={renderOrder}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmpty}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    tabs: { flexDirection: 'row', borderBottomWidth: 1 },
    tab: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center' },
    tabText: { fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.medium },
    list: { padding: Spacing.lg },
    orderCard: { borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.md },
    orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
    orderNumber: { fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.semibold },
    statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.full, gap: 4 },
    statusText: { fontSize: Fonts.sizes.xs, fontWeight: Fonts.weights.semibold },
    orderDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    orderDate: { fontSize: Fonts.sizes.sm },
    orderTotal: { fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.bold },
    divider: { height: 1, marginVertical: Spacing.md },
    orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    deliveryText: { fontSize: Fonts.sizes.sm, flex: 1 },
    emptyContainer: { alignItems: 'center', paddingTop: Spacing['4xl'] },
    emptyTitle: { fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.semibold, marginTop: Spacing.lg, marginBottom: Spacing.sm },
    emptySubtitle: { fontSize: Fonts.sizes.md },
});

export default OrdersScreen;
