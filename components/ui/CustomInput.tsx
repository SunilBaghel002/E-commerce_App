// Custom Input component with validation
import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInputProps,
    ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Fonts, BorderRadius, Spacing } from '../../constants/fonts';

interface CustomInputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: keyof typeof Ionicons.glyphMap;
    rightIcon?: keyof typeof Ionicons.glyphMap;
    onRightIconPress?: () => void;
    containerStyle?: ViewStyle;
    isPassword?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
    label,
    error,
    leftIcon,
    rightIcon,
    onRightIconPress,
    containerStyle,
    isPassword = false,
    style,
    ...props
}) => {
    const { colors } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const getBorderColor = (): string => {
        if (error) return colors.error;
        if (isFocused) return colors.primary;
        return colors.border;
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
            )}
            <View
                style={[
                    styles.inputContainer,
                    {
                        borderColor: getBorderColor(),
                        backgroundColor: colors.surface,
                    },
                    isFocused && styles.inputFocused,
                    error && styles.inputError,
                ]}
            >
                {leftIcon && (
                    <Ionicons
                        name={leftIcon}
                        size={20}
                        color={isFocused ? colors.primary : colors.textTertiary}
                        style={styles.leftIcon}
                    />
                )}
                <TextInput
                    style={[
                        styles.input,
                        { color: colors.text },
                        leftIcon && styles.inputWithLeftIcon,
                        (rightIcon || isPassword) && styles.inputWithRightIcon,
                        style,
                    ]}
                    placeholderTextColor={colors.textTertiary}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={isPassword && !showPassword}
                    {...props}
                />
                {isPassword && (
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.rightIconBtn}
                    >
                        <Ionicons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color={colors.textTertiary}
                        />
                    </TouchableOpacity>
                )}
                {rightIcon && !isPassword && (
                    <TouchableOpacity
                        onPress={onRightIconPress}
                        style={styles.rightIconBtn}
                        disabled={!onRightIconPress}
                    >
                        <Ionicons name={rightIcon} size={20} color={colors.textTertiary} />
                    </TouchableOpacity>
                )}
            </View>
            {error && (
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={14} color={colors.error} />
                    <Text style={[styles.errorText, { color: colors.error }]}>
                        {error}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.lg,
    },
    label: {
        fontSize: Fonts.sizes.sm,
        fontWeight: Fonts.weights.medium,
        marginBottom: Spacing.sm,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: BorderRadius.lg,
        minHeight: 52,
    },
    inputFocused: {
        borderWidth: 2,
    },
    inputError: {
        borderWidth: 1.5,
    },
    input: {
        flex: 1,
        fontSize: Fonts.sizes.md,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
    },
    inputWithLeftIcon: {
        paddingLeft: 0,
    },
    inputWithRightIcon: {
        paddingRight: 0,
    },
    leftIcon: {
        marginLeft: Spacing.lg,
        marginRight: Spacing.sm,
    },
    rightIconBtn: {
        padding: Spacing.md,
        marginRight: Spacing.xs,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.xs,
    },
    errorText: {
        fontSize: Fonts.sizes.sm,
        marginLeft: Spacing.xs,
    },
});

export default CustomInput;
