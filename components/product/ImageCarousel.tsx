// Image Carousel component for product images and banners
import React, { useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    FlatList,
    TouchableOpacity,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../../context/ThemeContext';
import { BorderRadius, Spacing } from '../../constants/fonts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ImageCarouselProps {
    images: Array<{ id: string; url: string; alt?: string }>;
    height?: number;
    autoPlay?: boolean;
    autoPlayInterval?: number;
    showPagination?: boolean;
    showThumbnails?: boolean;
    onImagePress?: (index: number) => void;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
    images,
    height = 300,
    autoPlay = false,
    autoPlayInterval = 4000,
    showPagination = true,
    showThumbnails = false,
    onImagePress,
}) => {
    const { colors } = useTheme();
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Auto play functionality
    React.useEffect(() => {
        if (autoPlay && images.length > 1) {
            timerRef.current = setInterval(() => {
                const nextIndex = (activeIndex + 1) % images.length;
                flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
            }, autoPlayInterval);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [autoPlay, activeIndex, images.length, autoPlayInterval]);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const slideWidth = event.nativeEvent.layoutMeasurement.width;
        const offset = event.nativeEvent.contentOffset.x;
        const index = Math.round(offset / slideWidth);

        if (index !== activeIndex) {
            setActiveIndex(index);
        }
    };

    const handleThumbnailPress = (index: number) => {
        flatListRef.current?.scrollToIndex({ index, animated: true });
        setActiveIndex(index);
    };

    const renderImage = ({ item, index }: { item: { id: string; url: string }; index: number }) => (
        <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => onImagePress?.(index)}
            disabled={!onImagePress}
        >
            <Image
                source={{ uri: item.url }}
                style={[styles.image, { height }]}
                contentFit="cover"
                transition={200}
            />
        </TouchableOpacity>
    );

    const renderPagination = () => (
        <View style={styles.paginationContainer}>
            {images.map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.paginationDot,
                        {
                            backgroundColor: index === activeIndex ? colors.primary : colors.textTertiary,
                            width: index === activeIndex ? 24 : 8,
                        },
                    ]}
                />
            ))}
        </View>
    );

    const renderThumbnails = () => (
        <View style={styles.thumbnailContainer}>
            {images.map((image, index) => (
                <TouchableOpacity
                    key={image.id}
                    onPress={() => handleThumbnailPress(index)}
                    style={[
                        styles.thumbnail,
                        {
                            borderColor: index === activeIndex ? colors.primary : 'transparent',
                        },
                    ]}
                >
                    <Image
                        source={{ uri: image.url }}
                        style={styles.thumbnailImage}
                        contentFit="cover"
                    />
                </TouchableOpacity>
            ))}
        </View>
    );

    if (images.length === 0) {
        return (
            <View style={[styles.placeholder, { height, backgroundColor: colors.surfaceSecondary }]} />
        );
    }

    return (
        <View>
            <FlatList
                ref={flatListRef}
                data={images}
                renderItem={renderImage}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                bounces={false}
                getItemLayout={(_, index) => ({
                    length: SCREEN_WIDTH,
                    offset: SCREEN_WIDTH * index,
                    index,
                })}
            />
            {showPagination && images.length > 1 && renderPagination()}
            {showThumbnails && images.length > 1 && renderThumbnails()}
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: SCREEN_WIDTH,
    },
    placeholder: {
        width: SCREEN_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
    },
    paginationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: Spacing.lg,
        left: 0,
        right: 0,
        gap: 6,
    },
    paginationDot: {
        height: 8,
        borderRadius: 4,
    },
    thumbnailContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: Spacing.md,
        gap: Spacing.sm,
    },
    thumbnail: {
        width: 60,
        height: 60,
        borderRadius: BorderRadius.md,
        borderWidth: 2,
        overflow: 'hidden',
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
    },
});

export default ImageCarousel;
