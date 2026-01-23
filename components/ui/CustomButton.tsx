// Custom Button component with premium animations and gradient support
import React, { useRef } from 'react';
import {
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    View,
    Animated,
    Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { Fonts, BorderRadius, Spacing, Shadows, Animations } from '../../constants/fonts';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
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
    gradientColors?: string[];
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
    gradientColors,
}) => {
    const { colors } = useTheme();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: Animations.scale.pressed,
            ...Animations.spring.snappy,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            ...Animations.spring.bouncy,
            useNativeDriver: true,
        }).start();
    };

    const getSizeStyles = (): ViewStyle => {
        const sizeStyles: Record<ButtonSize, ViewStyle> = {
            sm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, minHeight: 36 },
            md: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, minHeight: 48 },
            lg: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing['2xl'], minHeight: 56 },
        };
        return sizeStyles[size];
    };

    const getButtonStyles = (): ViewStyle => {
        const baseStyle: ViewStyle = {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: BorderRadius.xl,
            ...getSizeStyles(),
        };

        if (variant === 'gradient') {
            return {
                ...baseStyle,
                overflow: 'hidden',
                ...(fullWidth && { width: '100%' }),
            };
        }

        const variantStyles: Record<ButtonVariant, ViewStyle> = {
            primary: {
                backgroundColor: disabled ? colors.textTertiary : colors.primary,
                ...Shadows.md,
            },
            secondary: {
                backgroundColor: disabled ? colors.surfaceSecondary : colors.secondary,
                ...Shadows.md,
            },
            outline: {
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderColor: disabled ? colors.textTertiary : colors.primary,
            },
            ghost: {
                backgroundColor: 'transparent',
            },
            gradient: {},
        };

        return {
            ...baseStyle,
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
            primary: { color: '#FFFFFF' },
            secondary: { color: '#FFFFFF' },
            outline: { color: colors.primary },
            ghost: { color: colors.primary },
            gradient: { color: '#FFFFFF' },
        };

        return {
            fontWeight: Fonts.weights.bold,
            letterSpacing: 0.3,
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
            primary: '#FFFFFF',
            secondary: '#FFFFFF',
            outline: colors.primary,
            ghost: colors.primary,
            gradient: '#FFFFFF',
        };
        return variantColors[variant];
    };

    const ButtonContent = () => (
        <View style={styles.content}>
            {loading ? (
                <ActivityIndicator
                    color={variant === 'outline' || variant === 'ghost' ? colors.primary : '#FFFFFF'}
                    size="small"
                />
            ) : (
                <>
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
                </>
            )}
        </View>
    );

    // Gradient variant
    if (variant === 'gradient') {
        return (
            <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, fullWidth && { width: '100%' }]}>
                <Pressable
                    onPress={onPress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    disabled={disabled || loading}
                    style={[
                        {
                            borderRadius: BorderRadius.xl,
                            overflow: 'hidden',
                            opacity: disabled ? 0.6 : 1,
                        },
                        Shadows.lg,
                        style,
                    ]}
                >
                    <LinearGradient
                        colors={(gradientColors || colors.gradientPrimary) as string[]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[
                            {
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            },
                            getSizeStyles(),
                        ]}
                    >
                        <ButtonContent />
                    </LinearGradient>
                </Pressable>
            </Animated.View>
        );
    }

    return (
        <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, fullWidth && { width: '100%' }]}>
            <Pressable
                style={[getButtonStyles(), style]}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled || loading}
            >
                <ButtonContent />
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconLeft: {
        marginRight: Spacing.sm,
    },
    iconRight: {
        marginLeft: Spacing.sm,
    },
});

export default CustomButton;
