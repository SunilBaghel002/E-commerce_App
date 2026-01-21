// Forgot Password Screen
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { authService } from '../../services';
import { CustomButton, CustomInput } from '../../components/ui';
import { Fonts, Spacing, BorderRadius } from '../../constants/fonts';

const ForgotPasswordScreen = () => {
    const { colors } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await authService.forgotPassword(email);
            setIsSent(true);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSent) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.content, { paddingTop: insets.top + Spacing.lg }]}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={[styles.closeButton, { backgroundColor: colors.surfaceSecondary }]}
                    >
                        <Ionicons name="close" size={24} color={colors.text} />
                    </TouchableOpacity>

                    <View style={styles.successContainer}>
                        <View style={[styles.successIcon, { backgroundColor: colors.successLight }]}>
                            <Ionicons name="mail" size={48} color={colors.success} />
                        </View>
                        <Text style={[styles.successTitle, { color: colors.text }]}>
                            Check your email
                        </Text>
                        <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
                            We've sent password reset instructions to {email}
                        </Text>
                        <CustomButton
                            title="Back to Login"
                            onPress={() => router.replace('/(auth)/login')}
                            fullWidth
                            style={{ marginTop: Spacing.xl }}
                        />
                    </View>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={[styles.content, { paddingTop: insets.top + Spacing.lg }]}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.closeButton, { backgroundColor: colors.surfaceSecondary }]}
                >
                    <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>Reset Password</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Enter your email address and we'll send you instructions to reset your password
                    </Text>
                </View>

                {error && (
                    <View style={[styles.errorContainer, { backgroundColor: colors.errorLight }]}>
                        <Ionicons name="alert-circle" size={20} color={colors.error} />
                        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
                    </View>
                )}

                <CustomInput
                    label="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    leftIcon="mail-outline"
                />

                <CustomButton
                    title="Send Reset Link"
                    onPress={handleSubmit}
                    loading={isLoading}
                    fullWidth
                    size="lg"
                    icon="send"
                    iconPosition="right"
                />
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: Spacing.lg,
    },
    closeButton: {
        alignSelf: 'flex-start',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        marginTop: Spacing['2xl'],
        marginBottom: Spacing.xl,
    },
    title: {
        fontSize: Fonts.sizes['4xl'],
        fontWeight: Fonts.weights.bold,
        marginBottom: Spacing.md,
    },
    subtitle: {
        fontSize: Fonts.sizes.md,
        lineHeight: 22,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.lg,
        gap: Spacing.sm,
    },
    errorText: {
        flex: 1,
        fontSize: Fonts.sizes.sm,
    },
    successContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100,
    },
    successIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.xl,
    },
    successTitle: {
        fontSize: Fonts.sizes['2xl'],
        fontWeight: Fonts.weights.bold,
        marginBottom: Spacing.sm,
    },
    successSubtitle: {
        fontSize: Fonts.sizes.md,
        textAlign: 'center',
        paddingHorizontal: Spacing.xl,
    },
});

export default ForgotPasswordScreen;
