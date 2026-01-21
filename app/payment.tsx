// Payment Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Header, CustomButton, CustomInput } from '../components/ui';
import { Fonts, Spacing, BorderRadius, Shadows } from '../constants/fonts';

const PaymentScreen = () => {
    const { colors } = useTheme();
    const router = useRouter();

    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [name, setName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const formatCardNumber = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
        return formatted.slice(0, 19);
    };

    const formatExpiry = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
        }
        return cleaned;
    };

    const handlePay = async () => {
        setIsProcessing(true);
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsProcessing(false);

        const orderId = 'ORD-' + Date.now().toString().slice(-8);
        router.replace({ pathname: '/order-success', params: { orderId } });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Payment" showBack />

            <View style={styles.content}>
                {/* Card Preview */}
                <View style={[styles.cardPreview, { backgroundColor: colors.primary }]}>
                    <View style={styles.cardTop}>
                        <Ionicons name="card" size={32} color="#FFFFFF" />
                        <Text style={styles.cardType}>VISA</Text>
                    </View>
                    <Text style={styles.cardNumber}>
                        {cardNumber || '•••• •••• •••• ••••'}
                    </Text>
                    <View style={styles.cardBottom}>
                        <View>
                            <Text style={styles.cardLabel}>Card Holder</Text>
                            <Text style={styles.cardValue}>{name || 'YOUR NAME'}</Text>
                        </View>
                        <View>
                            <Text style={styles.cardLabel}>Expires</Text>
                            <Text style={styles.cardValue}>{expiry || 'MM/YY'}</Text>
                        </View>
                    </View>
                </View>

                {/* Card Form */}
                <View style={styles.form}>
                    <CustomInput
                        label="Card Number"
                        value={cardNumber}
                        onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                        placeholder="1234 5678 9012 3456"
                        keyboardType="number-pad"
                        maxLength={19}
                        leftIcon="card-outline"
                    />

                    <CustomInput
                        label="Cardholder Name"
                        value={name}
                        onChangeText={setName}
                        placeholder="John Doe"
                        autoCapitalize="words"
                        leftIcon="person-outline"
                    />

                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <CustomInput
                                label="Expiry Date"
                                value={expiry}
                                onChangeText={(text) => setExpiry(formatExpiry(text))}
                                placeholder="MM/YY"
                                keyboardType="number-pad"
                                maxLength={5}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <CustomInput
                                label="CVV"
                                value={cvv}
                                onChangeText={setCvv}
                                placeholder="123"
                                keyboardType="number-pad"
                                maxLength={4}
                                secureTextEntry
                            />
                        </View>
                    </View>
                </View>

                {/* Security Note */}
                <View style={styles.securityNote}>
                    <Ionicons name="lock-closed" size={16} color={colors.success} />
                    <Text style={[styles.securityText, { color: colors.textSecondary }]}>
                        Your payment information is encrypted and secure
                    </Text>
                </View>
            </View>

            {/* Pay Button */}
            <View style={[styles.footer, { backgroundColor: colors.surface }, Shadows.lg]}>
                <CustomButton
                    title={isProcessing ? 'Processing...' : 'Pay Now'}
                    onPress={handlePay}
                    loading={isProcessing}
                    fullWidth
                    size="lg"
                    icon="lock-closed"
                />
            </View>
        </View>
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
    cardPreview: {
        padding: Spacing.xl,
        borderRadius: BorderRadius.xl,
        marginBottom: Spacing.xl,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    cardType: {
        color: '#FFFFFF',
        fontSize: Fonts.sizes.xl,
        fontWeight: Fonts.weights.bold,
        fontStyle: 'italic',
    },
    cardNumber: {
        color: '#FFFFFF',
        fontSize: Fonts.sizes['2xl'],
        fontWeight: Fonts.weights.medium,
        letterSpacing: 2,
        marginBottom: Spacing.xl,
    },
    cardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: Fonts.sizes.xs,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    cardValue: {
        color: '#FFFFFF',
        fontSize: Fonts.sizes.md,
        fontWeight: Fonts.weights.medium,
    },
    form: {
        marginBottom: Spacing.lg,
    },
    row: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    securityNote: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
    },
    securityText: {
        fontSize: Fonts.sizes.sm,
    },
    footer: {
        padding: Spacing.lg,
        paddingBottom: Spacing.xl,
        borderTopLeftRadius: BorderRadius['2xl'],
        borderTopRightRadius: BorderRadius['2xl'],
    },
});

export default PaymentScreen;
