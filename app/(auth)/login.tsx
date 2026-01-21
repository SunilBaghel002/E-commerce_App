// Login Screen
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginUser, selectAuthLoading, selectAuthError, clearError } from '../../store/slices/authSlice';
import { CustomButton, CustomInput } from '../../components/ui';
import { Fonts, Spacing, BorderRadius } from '../../constants/fonts';

const LoginScreen = () => {
    const { colors } = useTheme();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();

    const isLoading = useAppSelector(selectAuthLoading);
    const error = useAppSelector(selectAuthError);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        dispatch(clearError());
        const result = await dispatch(loginUser({ email, password }));
        if (loginUser.fulfilled.match(result)) {
            router.replace('/(tabs)');
        }
    };

    const handleSocialLogin = (provider: 'google' | 'apple') => {
        console.log(`Login with ${provider}`);
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + Spacing.lg }]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Close Button */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.closeButton, { backgroundColor: colors.surfaceSecondary }]}
                >
                    <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Sign in to continue shopping
                    </Text>
                </View>

                {/* Error Message */}
                {error && (
                    <View style={[styles.errorContainer, { backgroundColor: colors.errorLight }]}>
                        <Ionicons name="alert-circle" size={20} color={colors.error} />
                        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
                    </View>
                )}

                {/* Form */}
                <View style={styles.form}>
                    <CustomInput
                        label="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        leftIcon="mail-outline"
                    />
                    <CustomInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter your password"
                        isPassword
                        leftIcon="lock-closed-outline"
                    />

                    <TouchableOpacity
                        onPress={() => router.push('/(auth)/forgot-password')}
                        style={styles.forgotButton}
                    >
                        <Text style={[styles.forgotText, { color: colors.primary }]}>
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>

                    <CustomButton
                        title="Sign In"
                        onPress={handleLogin}
                        loading={isLoading}
                        fullWidth
                        size="lg"
                        style={{ marginTop: Spacing.md }}
                    />
                </View>

                {/* Divider */}
                <View style={styles.dividerContainer}>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <Text style={[styles.dividerText, { color: colors.textTertiary }]}>
                        or continue with
                    </Text>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                </View>

                {/* Social Login */}
                <View style={styles.socialContainer}>
                    <TouchableOpacity
                        onPress={() => handleSocialLogin('google')}
                        style={[styles.socialButton, { borderColor: colors.border }]}
                    >
                        <Ionicons name="logo-google" size={24} color="#DB4437" />
                        <Text style={[styles.socialText, { color: colors.text }]}>Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleSocialLogin('apple')}
                        style={[styles.socialButton, { borderColor: colors.border }]}
                    >
                        <Ionicons name="logo-apple" size={24} color={colors.text} />
                        <Text style={[styles.socialText, { color: colors.text }]}>Apple</Text>
                    </TouchableOpacity>
                </View>

                {/* Register Link */}
                <View style={styles.registerContainer}>
                    <Text style={[styles.registerText, { color: colors.textSecondary }]}>
                        Don't have an account?{' '}
                    </Text>
                    <TouchableOpacity onPress={() => router.replace('/(auth)/register')}>
                        <Text style={[styles.registerLink, { color: colors.primary }]}>
                            Sign Up
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Demo Account Info */}
                <View style={[styles.demoContainer, { backgroundColor: colors.infoLight }]}>
                    <Ionicons name="information-circle" size={20} color={colors.info} />
                    <Text style={[styles.demoText, { color: colors.info }]}>
                        Demo: demo@example.com / password
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
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
        marginBottom: Spacing.sm,
    },
    subtitle: {
        fontSize: Fonts.sizes.md,
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
    form: {
        marginBottom: Spacing.xl,
    },
    forgotButton: {
        alignSelf: 'flex-end',
        marginTop: -Spacing.sm,
    },
    forgotText: {
        fontSize: Fonts.sizes.sm,
        fontWeight: Fonts.weights.medium,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    divider: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        marginHorizontal: Spacing.md,
        fontSize: Fonts.sizes.sm,
    },
    socialContainer: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginBottom: Spacing.xl,
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.lg,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        gap: Spacing.sm,
    },
    socialText: {
        fontSize: Fonts.sizes.md,
        fontWeight: Fonts.weights.medium,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: Spacing.lg,
    },
    registerText: {
        fontSize: Fonts.sizes.md,
    },
    registerLink: {
        fontSize: Fonts.sizes.md,
        fontWeight: Fonts.weights.semibold,
    },
    demoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        gap: Spacing.sm,
    },
    demoText: {
        flex: 1,
        fontSize: Fonts.sizes.sm,
    },
});

export default LoginScreen;
