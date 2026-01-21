// Profile Screen
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAppSelector, useAppDispatch } from '../../store';
import { selectUser, selectIsAuthenticated, logoutUser } from '../../store/slices/authSlice';
import { Header, CustomButton } from '../../components/ui';
import { Fonts, Spacing, BorderRadius, Shadows } from '../../constants/fonts';

interface MenuItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showBadge?: boolean;
    badgeCount?: number;
}

const MenuItem: React.FC<MenuItemProps> = ({
    icon,
    title,
    subtitle,
    onPress,
    showBadge,
    badgeCount,
}) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.menuItem, { backgroundColor: colors.surface }]}
            activeOpacity={0.7}
        >
            <View style={[styles.menuIconContainer, { backgroundColor: colors.primaryLight + '20' }]}>
                <Ionicons name={icon} size={22} color={colors.primary} />
            </View>
            <View style={styles.menuContent}>
                <Text style={[styles.menuTitle, { color: colors.text }]}>{title}</Text>
                {subtitle && (
                    <Text style={[styles.menuSubtitle, { color: colors.textSecondary }]}>
                        {subtitle}
                    </Text>
                )}
            </View>
            <View style={styles.menuRight}>
                {showBadge && badgeCount !== undefined && badgeCount > 0 && (
                    <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                        <Text style={styles.badgeText}>{badgeCount}</Text>
                    </View>
                )}
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </View>
        </TouchableOpacity>
    );
};

const ProfileScreen = () => {
    const { colors } = useTheme();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    const menuSections = [
        {
            title: 'My Orders',
            items: [
                { icon: 'receipt-outline' as const, title: 'Order History', subtitle: 'View your past orders', onPress: () => router.push('/orders') },
                { icon: 'location-outline' as const, title: 'Track Orders', subtitle: 'Track your active orders', onPress: () => router.push('/orders') },
            ],
        },
        {
            title: 'Account Settings',
            items: [
                { icon: 'person-outline' as const, title: 'Edit Profile', subtitle: 'Update your information', onPress: () => { } },
                { icon: 'home-outline' as const, title: 'Addresses', subtitle: 'Manage delivery addresses', onPress: () => router.push('/addresses') },
                { icon: 'card-outline' as const, title: 'Payment Methods', subtitle: 'Manage your cards', onPress: () => { } },
            ],
        },
        {
            title: 'Preferences',
            items: [
                { icon: 'notifications-outline' as const, title: 'Notifications', subtitle: 'Manage notifications', onPress: () => router.push('/notifications'), showBadge: true, badgeCount: 3 },
                { icon: 'settings-outline' as const, title: 'Settings', subtitle: 'App settings & preferences', onPress: () => router.push('/settings') },
                { icon: 'help-circle-outline' as const, title: 'Help & Support', subtitle: 'Get help or contact us', onPress: () => { } },
            ],
        },
    ];

    if (!isAuthenticated) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header title="Profile" />
                <View style={styles.authContainer}>
                    <View style={[styles.authIconContainer, { backgroundColor: colors.surfaceSecondary }]}>
                        <Ionicons name="person-outline" size={64} color={colors.textTertiary} />
                    </View>
                    <Text style={[styles.authTitle, { color: colors.text }]}>
                        Sign in to your account
                    </Text>
                    <Text style={[styles.authSubtitle, { color: colors.textSecondary }]}>
                        Track orders, save favorites, and access exclusive deals
                    </Text>
                    <CustomButton
                        title="Sign In"
                        onPress={() => router.push('/(auth)/login')}
                        fullWidth
                        style={{ marginTop: Spacing.xl }}
                    />
                    <CustomButton
                        title="Create Account"
                        onPress={() => router.push('/(auth)/register')}
                        variant="outline"
                        fullWidth
                        style={{ marginTop: Spacing.md }}
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Profile" />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* User Info */}
                <View style={[styles.userCard, { backgroundColor: colors.surface }, Shadows.md]}>
                    <Image
                        source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200' }}
                        style={styles.avatar}
                        contentFit="cover"
                    />
                    <View style={styles.userInfo}>
                        <Text style={[styles.userName, { color: colors.text }]}>
                            {user?.firstName} {user?.lastName}
                        </Text>
                        <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                            {user?.email}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.editButton, { borderColor: colors.primary }]}
                    >
                        <Ionicons name="pencil" size={18} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                {/* Quick Stats */}
                <View style={styles.statsContainer}>
                    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.statNumber, { color: colors.primary }]}>12</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Orders</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.statNumber, { color: colors.secondary }]}>5</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Wishlist</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.statNumber, { color: colors.success }]}>$250</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Saved</Text>
                    </View>
                </View>

                {/* Menu Sections */}
                {menuSections.map((section, sectionIndex) => (
                    <View key={sectionIndex} style={styles.menuSection}>
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                            {section.title}
                        </Text>
                        {section.items.map((item, itemIndex) => (
                            <MenuItem key={itemIndex} {...item} />
                        ))}
                    </View>
                ))}

                {/* Logout */}
                <TouchableOpacity
                    onPress={handleLogout}
                    style={[styles.logoutButton, { borderColor: colors.error }]}
                >
                    <Ionicons name="log-out-outline" size={22} color={colors.error} />
                    <Text style={[styles.logoutText, { color: colors.error }]}>
                        Log Out
                    </Text>
                </TouchableOpacity>

                <View style={{ height: Spacing['3xl'] }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    authContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    authIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.xl,
    },
    authTitle: {
        fontSize: Fonts.sizes.xl,
        fontWeight: Fonts.weights.bold,
        marginBottom: Spacing.sm,
    },
    authSubtitle: {
        fontSize: Fonts.sizes.md,
        textAlign: 'center',
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: Spacing.lg,
        padding: Spacing.lg,
        borderRadius: BorderRadius.xl,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
    },
    userInfo: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    userName: {
        fontSize: Fonts.sizes.lg,
        fontWeight: Fonts.weights.bold,
    },
    userEmail: {
        fontSize: Fonts.sizes.sm,
        marginTop: 2,
    },
    editButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.lg,
        gap: Spacing.md,
        marginBottom: Spacing.lg,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: Spacing.lg,
        borderRadius: BorderRadius.lg,
    },
    statNumber: {
        fontSize: Fonts.sizes.xl,
        fontWeight: Fonts.weights.bold,
    },
    statLabel: {
        fontSize: Fonts.sizes.xs,
        marginTop: 4,
    },
    menuSection: {
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        fontSize: Fonts.sizes.sm,
        fontWeight: Fonts.weights.semibold,
        textTransform: 'uppercase',
        marginBottom: Spacing.sm,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.sm,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuContent: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    menuTitle: {
        fontSize: Fonts.sizes.md,
        fontWeight: Fonts.weights.medium,
    },
    menuSubtitle: {
        fontSize: Fonts.sizes.sm,
        marginTop: 2,
    },
    menuRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    badge: {
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.md,
        paddingVertical: Spacing.lg,
        borderRadius: BorderRadius.lg,
        borderWidth: 1.5,
        gap: Spacing.sm,
    },
    logoutText: {
        fontSize: Fonts.sizes.md,
        fontWeight: Fonts.weights.semibold,
    },
});

export default ProfileScreen;
