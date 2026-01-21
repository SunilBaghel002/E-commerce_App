// Search Bar component
import React from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Fonts, BorderRadius, Spacing } from '../../constants/fonts';

interface SearchBarProps {
    value?: string;
    onChangeText?: (text: string) => void;
    onSubmit?: () => void;
    placeholder?: string;
    autoFocus?: boolean;
    editable?: boolean;
    onPress?: () => void;
    showFilter?: boolean;
    onFilterPress?: () => void;
    style?: ViewStyle;
}

const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChangeText,
    onSubmit,
    placeholder = 'Search products...',
    autoFocus = false,
    editable = true,
    onPress,
    showFilter = false,
    onFilterPress,
    style,
}) => {
    const { colors } = useTheme();
    const router = useRouter();

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else if (!editable) {
            router.push('/search');
        }
    };

    const containerContent = (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.surfaceSecondary,
                    borderColor: colors.border,
                },
                style,
            ]}
        >
            <Ionicons
                name="search-outline"
                size={20}
                color={colors.textTertiary}
                style={styles.searchIcon}
            />
            <TextInput
                value={value}
                onChangeText={onChangeText}
                onSubmitEditing={onSubmit}
                placeholder={placeholder}
                placeholderTextColor={colors.textTertiary}
                autoFocus={autoFocus}
                editable={editable && !onPress}
                returnKeyType="search"
                style={[styles.input, { color: colors.text }]}
                pointerEvents={!editable || onPress ? 'none' : 'auto'}
            />
            {value && value.length > 0 && (
                <TouchableOpacity
                    onPress={() => onChangeText?.('')}
                    style={styles.clearButton}
                >
                    <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
                </TouchableOpacity>
            )}
            {showFilter && (
                <TouchableOpacity onPress={onFilterPress} style={styles.filterButton}>
                    <Ionicons name="options-outline" size={22} color={colors.primary} />
                </TouchableOpacity>
            )}
        </View>
    );

    if (!editable || onPress) {
        return (
            <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
                {containerContent}
            </TouchableOpacity>
        );
    }

    return containerContent;
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        borderRadius: BorderRadius.xl,
        borderWidth: 1,
        paddingHorizontal: Spacing.md,
    },
    searchIcon: {
        marginRight: Spacing.sm,
    },
    input: {
        flex: 1,
        fontSize: Fonts.sizes.md,
        paddingVertical: Spacing.sm,
    },
    clearButton: {
        padding: Spacing.xs,
    },
    filterButton: {
        marginLeft: Spacing.sm,
        padding: Spacing.xs,
        borderLeftWidth: 1,
        borderLeftColor: '#E2E8F0',
        paddingLeft: Spacing.md,
    },
});

export default SearchBar;
