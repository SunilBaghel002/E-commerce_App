// Custom Button component with variants
import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Fonts, BorderRadius, Spacing } from '../../constants/fonts';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: keyof typeof Ionicons.glyphMap;
    iconPosition?: 'left' | 'right';
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'left',
    loading = false,
    disabled = false,
    fullWidth = false,
    style,
    textStyle,
}) => {
    const { colors } = useTheme();

    const getButtonStyles = (): ViewStyle => {
        const baseStyle: ViewStyle = {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: BorderRadius.lg,
        };

        // Size styles
        const sizeStyles: Record<ButtonSize, ViewStyle> = {
            sm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, minHeight: 36 },
            md: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, minHeight: 48 },
            lg: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing['2xl'], minHeight: 56 },
        };

        // Variant styles
        const variantStyles: Record<ButtonVariant, ViewStyle> = {
            primary: {
                backgroundColor: disabled ? colors.textTertiary : colors.primary,
            },
            secondary: {
                backgroundColor: disabled ? colors.surfaceSecondary : colors.secondary,
            },
            outline: {
                backgroundColor: 'transparent',
                borderWidth: 1.5,
                borderColor: disabled ? colors.textTertiary : colors.primary,
            },
            ghost: {
                backgroundColor: 'transparent',
            },
        };

        return {
            ...baseStyle,
            ...sizeStyles[size],
            ...variantStyles[variant],
            ...(fullWidth && { width: '100%' }),
            opacity: disabled ? 0.6 : 1,
        };
    };

    const getTextStyles = (): TextStyle => {
        const sizeStyles: Record<ButtonSize, TextStyle> = {
            sm: { fontSize: Fonts.sizes.sm },
            md: { fontSize: Fonts.sizes.md },
            lg: { fontSize: Fonts.sizes.lg },
        };

        const variantStyles: Record<ButtonVariant, TextStyle> = {
            primary: { color: colors.textInverse },
            secondary: { color: colors.textInverse },
            outline: { color: colors.primary },
            ghost: { color: colors.primary },
        };

        return {
            fontWeight: Fonts.weights.semibold,
            ...sizeStyles[size],
            ...variantStyles[variant],
        };
    };

    const getIconSize = (): number => {
        const sizes: Record<ButtonSize, number> = { sm: 16, md: 20, lg: 24 };
        return sizes[size];
    };

    const getIconColor = (): string => {
        const variantColors: Record<ButtonVariant, string> = {
            primary: colors.textInverse,
            secondary: colors.textInverse,
            outline: colors.primary,
            ghost: colors.primary,
        };
        return variantColors[variant];
    };

    return (
        <TouchableOpacity
            style={[getButtonStyles(), style]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'primary' || variant === 'secondary'
                        ? colors.textInverse
                        : colors.primary}
                    size="small"
                />
            ) : (
                <View style={styles.content}>
                    {icon && iconPosition === 'left' && (
                        <Ionicons
                            name={icon}
                            size={getIconSize()}
                            color={getIconColor()}
                            style={styles.iconLeft}
                        />
                    )}
                    <Text style={[getTextStyles(), textStyle]}>{title}</Text>
                    {icon && iconPosition === 'right' && (
                        <Ionicons
                            name={icon}
                            size={getIconSize()}
                            color={getIconColor()}
                            style={styles.iconRight}
                        />
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconLeft: {
        marginRight: Spacing.sm,
    },
    iconRight: {
        marginLeft: Spacing.sm,
    },
});

export default CustomButton;
