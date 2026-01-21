// Loading Spinner component
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Fonts, Spacing } from '../../constants/fonts';

interface LoadingSpinnerProps {
    size?: 'small' | 'large';
    color?: string;
    text?: string;
    fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'large',
    color,
    text,
    fullScreen = false,
}) => {
    const { colors } = useTheme();

    const spinner = (
        <View style={[styles.container, fullScreen && styles.fullScreen]}>
            <ActivityIndicator size={size} color={color || colors.primary} />
            {text && (
                <Text style={[styles.text, { color: colors.textSecondary }]}>{text}</Text>
            )}
        </View>
    );

    if (fullScreen) {
        return (
            <View style={[styles.overlay, { backgroundColor: colors.background }]}>
                {spinner}
            </View>
        );
    }

    return spinner;
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    fullScreen: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
    },
    text: {
        marginTop: Spacing.md,
        fontSize: Fonts.sizes.sm,
    },
});

export default LoadingSpinner;
