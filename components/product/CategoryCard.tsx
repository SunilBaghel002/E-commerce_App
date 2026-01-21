// Category Card component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Category } from '../../types';
import { Fonts, BorderRadius, Spacing, Shadows } from '../../constants/fonts';

interface CategoryCardProps {
    category: Category;
    variant?: 'default' | 'compact' | 'featured';
}

const CategoryCard: React.FC<CategoryCardProps> = ({
    category,
    variant = 'default',
}) => {
    const { colors } = useTheme();
    const router = useRouter();

    const handlePress = () => {
        router.push({
            pathname: '/search',
            params: { category: category.id },
        });
    };

    const getIconName = (): keyof typeof Ionicons.glyphMap => {
        const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            laptop: 'laptop-outline',
            shirt: 'shirt-outline',
            home: 'home-outline',
            basketball: 'basketball-outline',
            sparkles: 'sparkles-outline',
            book: 'book-outline',
        };
        return iconMap[category.icon || ''] || 'grid-outline';
    };

    if (variant === 'compact') {
        return (
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.7}
                style={[styles.compactContainer, { backgroundColor: colors.surface }]}
            >
                <View style={[styles.compactIconContainer, { backgroundColor: colors.primaryLight + '30' }]}>
                    <Ionicons name={getIconName()} size={24} color={colors.primary} />
                </View>
                <Text
                    style={[styles.compactName, { color: colors.text }]}
                    numberOfLines={2}
                >
                    {category.name}
                </Text>
            </TouchableOpacity>
        );
    }

    if (variant === 'featured') {
        return (
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.8}
                style={[styles.featuredContainer, Shadows.md]}
            >
                <Image
                    source={{ uri: category.image }}
                    style={styles.featuredImage}
                    contentFit="cover"
                    transition={200}
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.gradient}
                >
                    <Text style={styles.featuredName}>{category.name}</Text>
                    <Text style={styles.featuredCount}>
                        {category.productCount} products
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    // Default variant
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.8}
            style={[styles.defaultContainer, Shadows.sm]}
        >
            <Image
                source={{ uri: category.image }}
                style={styles.defaultImage}
                contentFit="cover"
                transition={200}
            />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.6)']}
                style={styles.smallGradient}
            >
                <Ionicons name={getIconName()} size={28} color="#FFFFFF" />
                <Text style={styles.defaultName} numberOfLines={1}>
                    {category.name}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    // Compact variant
    compactContainer: {
        alignItems: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.sm,
        marginRight: Spacing.md,
        width: 80,
    },
    compactIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.sm,
    },
    compactName: {
        fontSize: Fonts.sizes.xs,
        fontWeight: Fonts.weights.medium,
        textAlign: 'center',
    },

    // Featured variant
    featuredContainer: {
        width: 200,
        height: 140,
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        marginRight: Spacing.md,
    },
    featuredImage: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        padding: Spacing.md,
    },
    featuredName: {
        color: '#FFFFFF',
        fontSize: Fonts.sizes.lg,
        fontWeight: Fonts.weights.bold,
    },
    featuredCount: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: Fonts.sizes.sm,
        marginTop: 2,
    },

    // Default variant
    defaultContainer: {
        width: 100,
        height: 100,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        marginRight: Spacing.md,
    },
    defaultImage: {
        width: '100%',
        height: '100%',
    },
    smallGradient: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: Spacing.sm,
    },
    defaultName: {
        color: '#FFFFFF',
        fontSize: Fonts.sizes.xs,
        fontWeight: Fonts.weights.semibold,
        marginTop: 4,
    },
});

export default CategoryCard;
