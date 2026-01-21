// Register Screen
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
import { registerUser, selectAuthLoading, selectAuthError, clearError } from '../../store/slices/authSlice';
import { CustomButton, CustomInput } from '../../components/ui';
import { Fonts, Spacing, BorderRadius } from '../../constants/fonts';

const RegisterScreen = () => {
    const { colors } = useTheme();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();

    const isLoading = useAppSelector(selectAuthLoading);
    const error = useAppSelector(selectAuthError);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!firstName.trim()) newErrors.firstName = 'First name is required';
        if (!lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!acceptTerms) newErrors.terms = 'Please accept terms and conditions';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validate()) return;

        dispatch(clearError());
        const result = await dispatch(registerUser({ firstName, lastName, email, password }));
        if (registerUser.fulfilled.match(result)) {
            router.replace('/(tabs)');
        }
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
                    <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Join us and start shopping today
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
                    <View style={styles.nameRow}>
                        <View style={styles.nameInput}>
                            <CustomInput
                                label="First Name"
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholder="John"
                                error={errors.firstName}
                            />
                        </View>
                        <View style={styles.nameInput}>
                            <CustomInput
                                label="Last Name"
                                value={lastName}
                                onChangeText={setLastName}
                                placeholder="Doe"
                                error={errors.lastName}
                            />
                        </View>
                    </View>

                    <CustomInput
                        label="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="john@example.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        leftIcon="mail-outline"
                        error={errors.email}
                    />

                    <CustomInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Create a password"
                        isPassword
                        leftIcon="lock-closed-outline"
                        error={errors.password}
                    />

                    <CustomInput
                        label="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm your password"
                        isPassword
                        leftIcon="lock-closed-outline"
                        error={errors.confirmPassword}
                    />

                    {/* Terms Checkbox */}
                    <TouchableOpacity
                        onPress={() => setAcceptTerms(!acceptTerms)}
                        style={styles.termsRow}
                    >
                        <Ionicons
                            name={acceptTerms ? 'checkbox' : 'square-outline'}
                            size={24}
                            color={acceptTerms ? colors.primary : colors.textTertiary}
                        />
                        <Text style={[styles.termsText, { color: colors.textSecondary }]}>
                            I agree to the{' '}
                            <Text style={{ color: colors.primary }}>Terms of Service</Text>
                            {' '}and{' '}
                            <Text style={{ color: colors.primary }}>Privacy Policy</Text>
                        </Text>
                    </TouchableOpacity>
                    {errors.terms && (
                        <Text style={[styles.termsError, { color: colors.error }]}>
                            {errors.terms}
                        </Text>
                    )}

                    <CustomButton
                        title="Create Account"
                        onPress={handleRegister}
                        loading={isLoading}
                        fullWidth
                        size="lg"
                        style={{ marginTop: Spacing.lg }}
                    />
                </View>

                {/* Login Link */}
                <View style={styles.loginContainer}>
                    <Text style={[styles.loginText, { color: colors.textSecondary }]}>
                        Already have an account?{' '}
                    </Text>
                    <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                        <Text style={[styles.loginLink, { color: colors.primary }]}>
                            Sign In
                        </Text>
                    </TouchableOpacity>
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
        marginTop: Spacing.xl,
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
    nameRow: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    nameInput: {
        flex: 1,
    },
    termsRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: Spacing.sm,
        marginTop: Spacing.sm,
    },
    termsText: {
        flex: 1,
        fontSize: Fonts.sizes.sm,
        lineHeight: 20,
    },
    termsError: {
        fontSize: Fonts.sizes.sm,
        marginTop: Spacing.xs,
        marginLeft: 32,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    loginText: {
        fontSize: Fonts.sizes.md,
    },
    loginLink: {
        fontSize: Fonts.sizes.md,
        fontWeight: Fonts.weights.semibold,
    },
});

export default RegisterScreen;
