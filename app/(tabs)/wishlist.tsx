// Wishlist Screen
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAppSelector, useAppDispatch } from '../../store';
import { selectWishlistItems, clearWishlist } from '../../store/slices/wishlistSlice';
import { Header, CustomButton } from '../../components/ui';
import { ProductCard } from '../../components/product';
import { Fonts, Spacing } from '../../constants/fonts';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.lg * 3) / 2;

const WishlistScreen = () => {
    const { colors } = useTheme();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const items = useAppSelector(selectWishlistItems);

    const handleClearWishlist = () => {
        dispatch(clearWishlist());
    };

    if (items.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header title="Wishlist" />
                <View style={styles.emptyContainer}>
                    <View style={[styles.emptyIconContainer, { backgroundColor: colors.surfaceSecondary }]}>
                        <Ionicons name="heart-outline" size={64} color={colors.textTertiary} />
                    </View>
                    <Text style={[styles.emptyTitle, { color: colors.text }]}>
                        Your wishlist is empty
                    </Text>
                    <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                        Save items you love by tapping the heart icon
                    </Text>
                    <CustomButton
                        title="Explore Products"
                        onPress={() => router.replace('/(tabs)')}
                        icon="search-outline"
                        style={{ marginTop: Spacing.xl }}
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header
                title={`Wishlist (${items.length})`}
                actions={[
                    { icon: 'trash-outline', onPress: handleClearWishlist },
                ]}
            />

            <FlatList
                data={items}
                renderItem={({ item }) => (
                    <ProductCard product={item.product} layout="grid" />
                )}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        padding: Spacing.lg,
    },
    row: {
        justifyContent: 'space-between',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.xl,
    },
    emptyTitle: {
        fontSize: Fonts.sizes.xl,
        fontWeight: Fonts.weights.bold,
        marginBottom: Spacing.sm,
    },
    emptySubtitle: {
        fontSize: Fonts.sizes.md,
        textAlign: 'center',
    },
});

export default WishlistScreen;
