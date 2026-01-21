// Price Tag component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Fonts, Spacing } from '../../constants/fonts';

interface PriceTagProps {
    price: number;
    compareAtPrice?: number;
    currency?: string;
    size?: 'sm' | 'md' | 'lg';
    showDiscount?: boolean;
}

const PriceTag: React.FC<PriceTagProps> = ({
    price,
    compareAtPrice,
    currency = '$',
    size = 'md',
    showDiscount = true,
}) => {
    const { colors } = useTheme();

    const hasDiscount = compareAtPrice && compareAtPrice > price;
    const discountPercent = hasDiscount
        ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
        : 0;

    const getSizeStyles = () => {
        const sizes = {
            sm: { price: Fonts.sizes.md, compare: Fonts.sizes.sm, badge: Fonts.sizes.xs },
            md: { price: Fonts.sizes.xl, compare: Fonts.sizes.sm, badge: Fonts.sizes.sm },
            lg: { price: Fonts.sizes['2xl'], compare: Fonts.sizes.md, badge: Fonts.sizes.sm },
        };
        return sizes[size];
    };

    const sizeStyles = getSizeStyles();

    const formatPrice = (value: number) => {
        return `${currency}${value.toFixed(2)}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.priceRow}>
                <Text
                    style={[
                        styles.price,
                        {
                            color: hasDiscount ? colors.discount : colors.text,
                            fontSize: sizeStyles.price,
                        },
                    ]}
                >
                    {formatPrice(price)}
                </Text>
                {hasDiscount && (
                    <Text
                        style={[
                            styles.comparePrice,
                            {
                                color: colors.textTertiary,
                                fontSize: sizeStyles.compare,
                            },
                        ]}
                    >
                        {formatPrice(compareAtPrice)}
                    </Text>
                )}
            </View>
            {hasDiscount && showDiscount && (
                <View style={[styles.discountBadge, { backgroundColor: colors.errorLight }]}>
                    <Text
                        style={[
                            styles.discountText,
                            { color: colors.error, fontSize: sizeStyles.badge },
                        ]}
                    >
                        -{discountPercent}%
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: Spacing.sm,
    },
    price: {
        fontWeight: Fonts.weights.bold,
    },
    comparePrice: {
        textDecorationLine: 'line-through',
    },
    discountBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: 4,
    },
    discountText: {
        fontWeight: Fonts.weights.semibold,
    },
});

export default PriceTag;
