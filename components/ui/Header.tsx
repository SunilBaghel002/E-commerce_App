// Header component with back button and actions
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useAppSelector } from '../../store';
import { selectCartItemCount } from '../../store/slices/cartSlice';
import { Fonts, Spacing } from '../../constants/fonts';

interface HeaderAction {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    badge?: number;
}

interface HeaderProps {
    title?: string;
    showBack?: boolean;
    showCart?: boolean;
    showSearch?: boolean;
    transparent?: boolean;
    actions?: HeaderAction[];
    onBackPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
    title,
    showBack = false,
    showCart = false,
    showSearch = false,
    transparent = false,
    actions = [],
    onBackPress,
}) => {
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const cartCount = useAppSelector(selectCartItemCount);

    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            router.back();
        }
    };

    const headerActions: HeaderAction[] = [
        ...(showSearch
            ? [{ icon: 'search-outline' as const, onPress: () => router.push('/search') }]
            : []),
        ...(showCart
            ? [{ icon: 'cart-outline' as const, onPress: () => router.push('/(tabs)/cart'), badge: cartCount }]
            : []),
        ...actions,
    ];

    return (
        <>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={transparent ? 'transparent' : colors.background}
                translucent={transparent}
            />
            <View
                style={[
                    styles.container,
                    {
                        paddingTop: insets.top + Spacing.sm,
                        backgroundColor: transparent ? 'transparent' : colors.background,
                        borderBottomColor: transparent ? 'transparent' : colors.border,
                        borderBottomWidth: transparent ? 0 : StyleSheet.hairlineWidth,
                    },
                ]}
            >
                <View style={styles.leftSection}>
                    {showBack && (
                        <TouchableOpacity
                            onPress={handleBackPress}
                            style={styles.iconButton}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name="chevron-back" size={24} color={colors.text} />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.centerSection}>
                    {title && (
                        <Text
                            style={[styles.title, { color: colors.text }]}
                            numberOfLines={1}
                        >
                            {title}
                        </Text>
                    )}
                </View>

                <View style={styles.rightSection}>
                    {headerActions.map((action, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={action.onPress}
                            style={styles.iconButton}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name={action.icon} size={24} color={colors.text} />
                            {action.badge !== undefined && action.badge > 0 && (
                                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                                    <Text style={styles.badgeText}>
                                        {action.badge > 99 ? '99+' : action.badge}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.md,
        minHeight: 56,
    },
    leftSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    centerSection: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: Spacing.sm,
    },
    title: {
        fontSize: Fonts.sizes.lg,
        fontWeight: Fonts.weights.semibold,
    },
    iconButton: {
        padding: Spacing.xs,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -2,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
    },
});

export default Header;
