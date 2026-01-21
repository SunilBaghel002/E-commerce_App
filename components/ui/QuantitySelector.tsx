// Quantity Selector component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import { Fonts, BorderRadius, Spacing } from '../../constants/fonts';

interface QuantitySelectorProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    min?: number;
    max?: number;
    size?: 'sm' | 'md' | 'lg';
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
    quantity,
    onIncrease,
    onDecrease,
    min = 1,
    max = 10,
    size = 'md',
}) => {
    const { colors } = useTheme();

    const handleIncrease = () => {
        if (quantity < max) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onIncrease();
        }
    };

    const handleDecrease = () => {
        if (quantity > min) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onDecrease();
        }
    };

    const getSizeStyles = () => {
        const sizes = {
            sm: { button: 28, text: Fonts.sizes.sm, iconSize: 16 },
            md: { button: 36, text: Fonts.sizes.md, iconSize: 20 },
            lg: { button: 44, text: Fonts.sizes.lg, iconSize: 24 },
        };
        return sizes[size];
    };

    const sizeStyles = getSizeStyles();

    return (
        <View
            style={[
                styles.container,
                {
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                },
            ]}
        >
            <TouchableOpacity
                onPress={handleDecrease}
                disabled={quantity <= min}
                style={[
                    styles.button,
                    {
                        width: sizeStyles.button,
                        height: sizeStyles.button,
                        opacity: quantity <= min ? 0.4 : 1,
                    },
                ]}
            >
                <Ionicons
                    name="remove"
                    size={sizeStyles.iconSize}
                    color={quantity <= min ? colors.textTertiary : colors.text}
                />
            </TouchableOpacity>

            <View style={styles.quantityContainer}>
                <Text
                    style={[
                        styles.quantity,
                        { color: colors.text, fontSize: sizeStyles.text },
                    ]}
                >
                    {quantity}
                </Text>
            </View>

            <TouchableOpacity
                onPress={handleIncrease}
                disabled={quantity >= max}
                style={[
                    styles.button,
                    {
                        width: sizeStyles.button,
                        height: sizeStyles.button,
                        opacity: quantity >= max ? 0.4 : 1,
                    },
                ]}
            >
                <Ionicons
                    name="add"
                    size={sizeStyles.iconSize}
                    color={quantity >= max ? colors.textTertiary : colors.text}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: BorderRadius.md,
        overflow: 'hidden',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityContainer: {
        minWidth: 36,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.sm,
    },
    quantity: {
        fontWeight: Fonts.weights.semibold,
    },
});

export default QuantitySelector;
