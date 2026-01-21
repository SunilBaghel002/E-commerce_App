// Categories Screen
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { productService } from '../../services';
import { Category } from '../../types';
import { Header, LoadingSpinner } from '../../components/ui';
import { CategoryCard } from '../../components/product';
import { Spacing } from '../../constants/fonts';

const CategoriesScreen = () => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadCategories = async () => {
        try {
            const data = await productService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        loadCategories();
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header title="Categories" showCart showSearch />
                <LoadingSpinner fullScreen />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Categories" showCart showSearch />

            <FlatList
                data={categories}
                renderItem={({ item }) => (
                    <View style={styles.categoryItem}>
                        <CategoryCard category={item} variant="featured" />
                    </View>
                )}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor={colors.primary}
                    />
                }
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
        marginBottom: Spacing.md,
    },
    categoryItem: {
        flex: 1,
        marginHorizontal: Spacing.xs,
    },
});

export default CategoriesScreen;
