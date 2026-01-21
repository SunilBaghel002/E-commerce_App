// Filter Modal component for product filtering
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { ProductFilters, Category } from '../../types';
import { CustomButton, RatingStars } from '../ui';
import { Fonts, BorderRadius, Spacing } from '../../constants/fonts';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: ProductFilters) => void;
    filters: ProductFilters;
    categories: Category[];
}

type SortOption = ProductFilters['sortBy'];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'popular', label: 'Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
];

const PRICE_RANGES = [
    { min: 0, max: 50, label: 'Under $50' },
    { min: 50, max: 100, label: '$50 - $100' },
    { min: 100, max: 200, label: '$100 - $200' },
    { min: 200, max: 500, label: '$200 - $500' },
    { min: 500, max: undefined, label: 'Over $500' },
];

const FilterModal: React.FC<FilterModalProps> = ({
    visible,
    onClose,
    onApply,
    filters: initialFilters,
    categories,
}) => {
    const { colors } = useTheme();
    const [filters, setFilters] = useState<ProductFilters>(initialFilters);

    const handleSortChange = (sortBy: SortOption) => {
        setFilters({ ...filters, sortBy });
    };

    const handleCategoryToggle = (categoryId: string) => {
        const currentCategories = filters.categories || [];
        const newCategories = currentCategories.includes(categoryId)
            ? currentCategories.filter((id) => id !== categoryId)
            : [...currentCategories, categoryId];
        setFilters({ ...filters, categories: newCategories });
    };

    const handlePriceRangeSelect = (min: number, max: number | undefined) => {
        setFilters({ ...filters, priceMin: min, priceMax: max });
    };

    const handleRatingChange = (rating: number) => {
        setFilters({ ...filters, rating: filters.rating === rating ? undefined : rating });
    };

    const handleReset = () => {
        setFilters({});
    };

    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    const isPriceRangeSelected = (min: number, max: number | undefined) => {
        return filters.priceMin === min && filters.priceMax === max;
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
                <View style={[styles.container, { backgroundColor: colors.background }]}>
                    {/* Header */}
                    <View style={[styles.header, { borderBottomColor: colors.border }]}>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={[styles.headerTitle, { color: colors.text }]}>Filters</Text>
                        <TouchableOpacity onPress={handleReset}>
                            <Text style={[styles.resetText, { color: colors.primary }]}>Reset</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
                        {/* Sort By */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Sort By</Text>
                            <View style={styles.optionsRow}>
                                {SORT_OPTIONS.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        onPress={() => handleSortChange(option.value)}
                                        style={[
                                            styles.chip,
                                            {
                                                backgroundColor: filters.sortBy === option.value
                                                    ? colors.primary
                                                    : colors.surfaceSecondary,
                                                borderColor: filters.sortBy === option.value
                                                    ? colors.primary
                                                    : colors.border,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.chipText,
                                                {
                                                    color: filters.sortBy === option.value
                                                        ? colors.textInverse
                                                        : colors.text,
                                                },
                                            ]}
                                        >
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Categories */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
                            <View style={styles.optionsRow}>
                                {categories.map((category) => (
                                    <TouchableOpacity
                                        key={category.id}
                                        onPress={() => handleCategoryToggle(category.id)}
                                        style={[
                                            styles.chip,
                                            {
                                                backgroundColor: filters.categories?.includes(category.id)
                                                    ? colors.primary
                                                    : colors.surfaceSecondary,
                                                borderColor: filters.categories?.includes(category.id)
                                                    ? colors.primary
                                                    : colors.border,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.chipText,
                                                {
                                                    color: filters.categories?.includes(category.id)
                                                        ? colors.textInverse
                                                        : colors.text,
                                                },
                                            ]}
                                        >
                                            {category.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Price Range */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Price Range</Text>
                            <View style={styles.optionsRow}>
                                {PRICE_RANGES.map((range) => (
                                    <TouchableOpacity
                                        key={range.label}
                                        onPress={() => handlePriceRangeSelect(range.min, range.max)}
                                        style={[
                                            styles.chip,
                                            {
                                                backgroundColor: isPriceRangeSelected(range.min, range.max)
                                                    ? colors.primary
                                                    : colors.surfaceSecondary,
                                                borderColor: isPriceRangeSelected(range.min, range.max)
                                                    ? colors.primary
                                                    : colors.border,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.chipText,
                                                {
                                                    color: isPriceRangeSelected(range.min, range.max)
                                                        ? colors.textInverse
                                                        : colors.text,
                                                },
                                            ]}
                                        >
                                            {range.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Rating */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Minimum Rating</Text>
                            <View style={styles.ratingOptions}>
                                {[4, 3, 2, 1].map((rating) => (
                                    <TouchableOpacity
                                        key={rating}
                                        onPress={() => handleRatingChange(rating)}
                                        style={[
                                            styles.ratingOption,
                                            {
                                                backgroundColor: filters.rating === rating
                                                    ? colors.primaryLight + '30'
                                                    : 'transparent',
                                                borderColor: filters.rating === rating
                                                    ? colors.primary
                                                    : colors.border,
                                            },
                                        ]}
                                    >
                                        <RatingStars rating={rating} size={16} />
                                        <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
                                            & Up
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Other Options */}
                        <View style={styles.section}>
                            <TouchableOpacity
                                onPress={() => setFilters({ ...filters, inStock: !filters.inStock })}
                                style={[styles.checkboxRow, { borderColor: colors.border }]}
                            >
                                <Ionicons
                                    name={filters.inStock ? 'checkbox' : 'square-outline'}
                                    size={24}
                                    color={filters.inStock ? colors.primary : colors.textTertiary}
                                />
                                <Text style={[styles.checkboxLabel, { color: colors.text }]}>
                                    In Stock Only
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setFilters({ ...filters, onSale: !filters.onSale })}
                                style={[styles.checkboxRow, { borderColor: colors.border }]}
                            >
                                <Ionicons
                                    name={filters.onSale ? 'checkbox' : 'square-outline'}
                                    size={24}
                                    color={filters.onSale ? colors.primary : colors.textTertiary}
                                />
                                <Text style={[styles.checkboxLabel, { color: colors.text }]}>
                                    On Sale
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View style={[styles.footer, { borderTopColor: colors.border }]}>
                        <CustomButton
                            title="Apply Filters"
                            onPress={handleApply}
                            fullWidth
                            size="lg"
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    container: {
        maxHeight: SCREEN_HEIGHT * 0.85,
        borderTopLeftRadius: BorderRadius['2xl'],
        borderTopRightRadius: BorderRadius['2xl'],
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.lg,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: Fonts.sizes.lg,
        fontWeight: Fonts.weights.semibold,
    },
    resetText: {
        fontSize: Fonts.sizes.md,
        fontWeight: Fonts.weights.medium,
    },
    content: {
        paddingHorizontal: Spacing.lg,
    },
    section: {
        paddingVertical: Spacing.lg,
    },
    sectionTitle: {
        fontSize: Fonts.sizes.md,
        fontWeight: Fonts.weights.semibold,
        marginBottom: Spacing.md,
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    chip: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
    },
    chipText: {
        fontSize: Fonts.sizes.sm,
        fontWeight: Fonts.weights.medium,
    },
    ratingOptions: {
        gap: Spacing.sm,
    },
    ratingOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        gap: Spacing.sm,
    },
    ratingText: {
        fontSize: Fonts.sizes.sm,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        gap: Spacing.md,
    },
    checkboxLabel: {
        fontSize: Fonts.sizes.md,
    },
    footer: {
        padding: Spacing.lg,
        borderTopWidth: 1,
    },
});

export default FilterModal;
