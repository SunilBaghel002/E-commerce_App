// Rating Stars component
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Fonts, Spacing } from '../../constants/fonts';

interface RatingStarsProps {
    rating: number;
    maxRating?: number;
    size?: number;
    showCount?: boolean;
    count?: number;
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
}

const RatingStars: React.FC<RatingStarsProps> = ({
    rating,
    maxRating = 5,
    size = 16,
    showCount = false,
    count,
    interactive = false,
    onRatingChange,
}) => {
    const { colors } = useTheme();

    const handlePress = (index: number) => {
        if (interactive && onRatingChange) {
            onRatingChange(index + 1);
        }
    };

    const renderStar = (index: number) => {
        const filled = index < Math.floor(rating);
        const halfFilled = index === Math.floor(rating) && rating % 1 >= 0.5;

        let iconName: keyof typeof Ionicons.glyphMap = 'star-outline';
        if (filled) {
            iconName = 'star';
        } else if (halfFilled) {
            iconName = 'star-half';
        }

        const star = (
            <Ionicons
                name={iconName}
                size={size}
                color={filled || halfFilled ? colors.rating : colors.textTertiary}
            />
        );

        if (interactive) {
            return (
                <TouchableOpacity
                    key={index}
                    onPress={() => handlePress(index)}
                    style={styles.starButton}
                >
                    {star}
                </TouchableOpacity>
            );
        }

        return (
            <View key={index} style={styles.starButton}>
                {star}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.starsContainer}>
                {Array.from({ length: maxRating }, (_, index) => renderStar(index))}
            </View>
            {showCount && count !== undefined && (
                <Text style={[styles.countText, { color: colors.textSecondary }]}>
                    ({count})
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starsContainer: {
        flexDirection: 'row',
    },
    starButton: {
        marginRight: 2,
    },
    countText: {
        marginLeft: Spacing.xs,
        fontSize: Fonts.sizes.sm,
    },
});

export default RatingStars;
