// Notifications Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Notification } from '../types';
import { Header } from '../components/ui';
import { Fonts, Spacing, BorderRadius, Shadows } from '../constants/fonts';

const mockNotifications: Notification[] = [
    { id: '1', userId: '1', title: 'Order Shipped! 🚚', message: 'Your order #ORD-12345678 has been shipped and is on its way.', type: 'order', isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: '2', userId: '1', title: 'Flash Sale Alert! ⚡', message: 'Don\'t miss out! Up to 50% off on electronics. Limited time only.', type: 'promotion', isRead: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
    { id: '3', userId: '1', title: 'Price Drop 📉', message: 'Great news! An item in your wishlist is now on sale.', type: 'price_drop', isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: '4', userId: '1', title: 'Order Delivered ✅', message: 'Your order #ORD-87654321 has been delivered. Enjoy!', type: 'order', isRead: true, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
];

const notificationIcons: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
    order: { icon: 'cube-outline', color: '#6366F1' },
    promotion: { icon: 'pricetag-outline', color: '#EC4899' },
    price_drop: { icon: 'trending-down-outline', color: '#22C55E' },
    system: { icon: 'information-circle-outline', color: '#3B82F6' },
};

const NotificationsScreen = () => {
    const { colors } = useTheme();
    const [notifications, setNotifications] = useState(mockNotifications);

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        if (days === 1) return 'Yesterday';
        return `${days}d ago`;
    };

    const renderNotification = ({ item }: { item: Notification }) => {
        const iconConfig = notificationIcons[item.type] || notificationIcons.system;

        return (
            <TouchableOpacity
                onPress={() => markAsRead(item.id)}
                style={[
                    styles.notificationCard,
                    { backgroundColor: item.isRead ? colors.surface : colors.primaryLight + '10' },
                    Shadows.sm,
                ]}
                activeOpacity={0.7}
            >
                <View style={[styles.iconContainer, { backgroundColor: iconConfig.color + '20' }]}>
                    <Ionicons name={iconConfig.icon} size={24} color={iconConfig.color} />
                </View>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                            {item.title}
                        </Text>
                        {!item.isRead && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
                    </View>
                    <Text style={[styles.message, { color: colors.textSecondary }]} numberOfLines={2}>
                        {item.message}
                    </Text>
                    <Text style={[styles.time, { color: colors.textTertiary }]}>
                        {formatTime(item.createdAt)}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header
                title="Notifications"
                showBack
                actions={unreadCount > 0 ? [{ icon: 'checkmark-done-outline', onPress: markAllAsRead }] : []}
            />
            <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="notifications-off-outline" size={64} color={colors.textTertiary} />
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>No notifications</Text>
                        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>You're all caught up!</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    list: { padding: Spacing.lg },
    notificationCard: { flexDirection: 'row', borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm },
    iconContainer: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
    content: { flex: 1, marginLeft: Spacing.md },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    title: { fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.semibold, flex: 1 },
    unreadDot: { width: 8, height: 8, borderRadius: 4, marginLeft: Spacing.sm },
    message: { fontSize: Fonts.sizes.sm, lineHeight: 20, marginBottom: 4 },
    time: { fontSize: Fonts.sizes.xs },
    emptyContainer: { alignItems: 'center', paddingTop: Spacing['4xl'] },
    emptyTitle: { fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.semibold, marginTop: Spacing.lg, marginBottom: Spacing.sm },
    emptySubtitle: { fontSize: Fonts.sizes.md },
});

export default NotificationsScreen;
