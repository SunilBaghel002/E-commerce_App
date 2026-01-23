// Tab navigation layout with premium floating design
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../context/ThemeContext';
import { useAppSelector } from '../../store';
import { selectCartItemCount } from '../../store/slices/cartSlice';
import { selectWishlistCount } from '../../store/slices/wishlistSlice';
import { Fonts, Spacing, BorderRadius, Shadows } from '../../constants/fonts';

const TabLayout = () => {
    const { colors, isDark } = useTheme();
    const cartCount = useAppSelector(selectCartItemCount);
    const wishlistCount = useAppSelector(selectWishlistCount);

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textTertiary,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: Platform.OS === 'ios' ? 24 : 16,
                    left: 16,
                    right: 16,
                    height: 70,
                    borderRadius: BorderRadius['2xl'],
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    borderTopWidth: 0,
                    paddingBottom: Platform.OS === 'ios' ? 0 : 8,
                    paddingTop: 8,
                    borderWidth: 1,
                    borderColor: colors.glassBorder,
                    ...Shadows.xl,
                },
                tabBarBackground: () => (
                    Platform.OS === 'ios' ? (
                        <BlurView
                            intensity={80}
                            tint={isDark ? 'dark' : 'light'}
                            style={StyleSheet.absoluteFill}
                        />
                    ) : null
                ),
                tabBarLabelStyle: {
                    fontSize: Fonts.sizes.xs,
                    fontWeight: '600',
                    marginTop: 2,
                },
                tabBarItemStyle: {
                    paddingVertical: 4,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={focused ? styles.activeIconContainer : undefined}>
                            <Ionicons
                                name={focused ? 'home' : 'home-outline'}
                                size={24}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="categories"
                options={{
                    title: 'Categories',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={focused ? styles.activeIconContainer : undefined}>
                            <Ionicons
                                name={focused ? 'grid' : 'grid-outline'}
                                size={24}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: 'Cart',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={focused ? styles.activeIconContainer : undefined}>
                            <Ionicons
                                name={focused ? 'cart' : 'cart-outline'}
                                size={26}
                                color={color}
                            />
                        </View>
                    ),
                    tabBarBadge: cartCount > 0 ? cartCount : undefined,
                    tabBarBadgeStyle: {
                        backgroundColor: colors.primary,
                        color: '#FFFFFF',
                        fontSize: 10,
                        fontWeight: '700',
                        minWidth: 20,
                        height: 20,
                        borderRadius: 10,
                        top: -4,
                        right: -4,
                    },
                }}
            />
            <Tabs.Screen
                name="wishlist"
                options={{
                    title: 'Wishlist',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={focused ? styles.activeIconContainer : undefined}>
                            <Ionicons
                                name={focused ? 'heart' : 'heart-outline'}
                                size={24}
                                color={color}
                            />
                        </View>
                    ),
                    tabBarBadge: wishlistCount > 0 ? wishlistCount : undefined,
                    tabBarBadgeStyle: {
                        backgroundColor: colors.secondary,
                        color: '#FFFFFF',
                        fontSize: 10,
                        fontWeight: '700',
                        minWidth: 20,
                        height: 20,
                        borderRadius: 10,
                        top: -4,
                        right: -4,
                    },
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={focused ? styles.activeIconContainer : undefined}>
                            <Ionicons
                                name={focused ? 'person' : 'person-outline'}
                                size={24}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
};

const styles = StyleSheet.create({
    activeIconContainer: {
        padding: 4,
    },
});

export default TabLayout;
