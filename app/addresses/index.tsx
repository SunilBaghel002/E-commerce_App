// Addresses Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Address } from '../../types';
import { Header, CustomButton } from '../../components/ui';
import { Fonts, Spacing, BorderRadius, Shadows } from '../../constants/fonts';

const mockAddresses: Address[] = [
    { id: '1', userId: '1', fullName: 'John Doe', phone: '+1 234 567 890', addressLine1: '123 Main Street', addressLine2: 'Apt 4B', city: 'New York', state: 'NY', postalCode: '10001', country: 'USA', isDefault: true, type: 'home' },
    { id: '2', userId: '1', fullName: 'John Doe', phone: '+1 234 567 890', addressLine1: '456 Business Ave', addressLine2: 'Floor 12', city: 'New York', state: 'NY', postalCode: '10002', country: 'USA', isDefault: false, type: 'work' },
];

const AddressesScreen = () => {
    const { colors } = useTheme();
    const [addresses, setAddresses] = useState(mockAddresses);

    const handleSetDefault = (id: string) => {
        setAddresses(prev =>
            prev.map(addr => ({ ...addr, isDefault: addr.id === id }))
        );
    };

    const handleDelete = (id: string) => {
        setAddresses(prev => prev.filter(addr => addr.id !== id));
    };

    const renderAddress = ({ item }: { item: Address }) => (
        <View style={[styles.addressCard, { backgroundColor: colors.surface }, Shadows.sm]}>
            <View style={styles.addressHeader}>
                <View style={[styles.typeBadge, { backgroundColor: colors.primaryLight + '30' }]}>
                    <Ionicons name={item.type === 'home' ? 'home' : 'business'} size={14} color={colors.primary} />
                    <Text style={[styles.typeText, { color: colors.primary }]}>{item.type.toUpperCase()}</Text>
                </View>
                {item.isDefault && (
                    <View style={[styles.defaultBadge, { backgroundColor: colors.successLight }]}>
                        <Text style={[styles.defaultText, { color: colors.success }]}>Default</Text>
                    </View>
                )}
            </View>

            <Text style={[styles.name, { color: colors.text }]}>{item.fullName}</Text>
            <Text style={[styles.addressLine, { color: colors.textSecondary }]}>{item.addressLine1}</Text>
            {item.addressLine2 && <Text style={[styles.addressLine, { color: colors.textSecondary }]}>{item.addressLine2}</Text>}
            <Text style={[styles.addressLine, { color: colors.textSecondary }]}>{item.city}, {item.state} {item.postalCode}</Text>
            <Text style={[styles.phone, { color: colors.textSecondary }]}>{item.phone}</Text>

            <View style={styles.actions}>
                {!item.isDefault && (
                    <TouchableOpacity onPress={() => handleSetDefault(item.id)} style={styles.actionBtn}>
                        <Ionicons name="checkmark-circle-outline" size={18} color={colors.primary} />
                        <Text style={[styles.actionText, { color: colors.primary }]}>Set Default</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.actionBtn}>
                    <Ionicons name="pencil-outline" size={18} color={colors.text} />
                    <Text style={[styles.actionText, { color: colors.text }]}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
                    <Ionicons name="trash-outline" size={18} color={colors.error} />
                    <Text style={[styles.actionText, { color: colors.error }]}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Address Book" showBack />
            <FlatList
                data={addresses}
                renderItem={renderAddress}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <CustomButton title="Add New Address" onPress={() => { }} variant="outline" icon="add" fullWidth style={{ marginTop: Spacing.md }} />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    list: { padding: Spacing.lg },
    addressCard: { borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.md },
    addressHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md, gap: Spacing.sm },
    typeBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.sm, gap: 4 },
    typeText: { fontSize: Fonts.sizes.xs, fontWeight: Fonts.weights.semibold },
    defaultBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.sm },
    defaultText: { fontSize: Fonts.sizes.xs, fontWeight: Fonts.weights.medium },
    name: { fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.semibold, marginBottom: 4 },
    addressLine: { fontSize: Fonts.sizes.sm, lineHeight: 20 },
    phone: { fontSize: Fonts.sizes.sm, marginTop: Spacing.sm },
    actions: { flexDirection: 'row', marginTop: Spacing.lg, gap: Spacing.lg },
    actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    actionText: { fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.medium },
});

export default AddressesScreen;
