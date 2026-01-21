// Skeleton Loader component for loading states
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { BorderRadius, Spacing } from '../../constants/fonts';

interface SkeletonLoaderProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    style?: ViewStyle;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    width = '100%',
    height = 20,
    borderRadius = BorderRadius.md,
    style,
}) => {
    const { colors } = useTheme();
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, []);

    const opacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <Animated.View
            style={[
                styles.skeleton,
                {
                    width: width as any,
                    height,
                    borderRadius,
                    backgroundColor: colors.surfaceSecondary,
                    opacity,
                },
                style,
            ]}
        />
    );
};

// Pre-made skeleton components
export const ProductCardSkeleton: React.FC = () => {
    const { colors } = useTheme();

    return (
        <View style={[styles.productCard, { backgroundColor: colors.surface }]}>
            <SkeletonLoader height={160} borderRadius={BorderRadius.lg} />
            <View style={styles.productCardContent}>
                <SkeletonLoader height={16} width="80%" style={styles.marginBottom} />
                <SkeletonLoader height={14} width="60%" style={styles.marginBottom} />
                <SkeletonLoader height={20} width="40%" />
            </View>
        </View>
    );
};

export const CategoryCardSkeleton: React.FC = () => {
    const { colors } = useTheme();

    return (
        <View style={[styles.categoryCard, { backgroundColor: colors.surface }]}>
            <SkeletonLoader width={60} height={60} borderRadius={30} />
            <SkeletonLoader height={14} width={60} style={{ marginTop: Spacing.sm }} />
        </View>
    );
};

export const BannerSkeleton: React.FC = () => {
    return <SkeletonLoader height={180} borderRadius={BorderRadius.xl} />;
};

const styles = StyleSheet.create({
    skeleton: {},
    productCard: {
        flex: 1,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        marginBottom: Spacing.md,
    },
    productCardContent: {
        padding: Spacing.md,
    },
    marginBottom: {
        marginBottom: Spacing.sm,
    },
    categoryCard: {
        alignItems: 'center',
        padding: Spacing.md,
        marginRight: Spacing.md,
    },
});

export default SkeletonLoader;
