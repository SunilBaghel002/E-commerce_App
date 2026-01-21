// Settings Screen
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Header } from '../components/ui';
import { Config } from '../constants/config';
import { Fonts, Spacing, BorderRadius } from '../constants/fonts';

interface SettingItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({
    icon,
    title,
    subtitle,
    onPress,
    rightElement,
}) => {
    const { colors } = useTheme();

    const content = (
        <View style={[styles.settingItem, { backgroundColor: colors.surface }]}>
            <View style={[styles.iconContainer, { backgroundColor: colors.surfaceSecondary }]}>
                <Ionicons name={icon} size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
                {subtitle && (
                    <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                        {subtitle}
                    </Text>
                )}
            </View>
            {rightElement || (
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            )}
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                {content}
            </TouchableOpacity>
        );
    }

    return content;
};

const SettingsScreen = () => {
    const { colors, isDark, toggleTheme } = useTheme();
    const [pushEnabled, setPushEnabled] = React.useState(true);
    const [emailEnabled, setEmailEnabled] = React.useState(true);

    const handleRateApp = () => {
        // Open app store
        Linking.openURL('https://apps.apple.com');
    };

    const handleContactSupport = () => {
        Linking.openURL(`mailto:${Config.SUPPORT_EMAIL}`);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Settings" showBack />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Appearance */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                        APPEARANCE
                    </Text>
                    <SettingItem
                        icon="moon-outline"
                        title="Dark Mode"
                        subtitle={isDark ? 'On' : 'Off'}
                        rightElement={
                            <Switch
                                value={isDark}
                                onValueChange={toggleTheme}
                                trackColor={{ false: colors.border, true: colors.primary }}
                                thumbColor="#FFFFFF"
                            />
                        }
                    />
                </View>

                {/* Notifications */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                        NOTIFICATIONS
                    </Text>
                    <SettingItem
                        icon="notifications-outline"
                        title="Push Notifications"
                        subtitle="Receive push notifications"
                        rightElement={
                            <Switch
                                value={pushEnabled}
                                onValueChange={setPushEnabled}
                                trackColor={{ false: colors.border, true: colors.primary }}
                                thumbColor="#FFFFFF"
                            />
                        }
                    />
                    <SettingItem
                        icon="mail-outline"
                        title="Email Notifications"
                        subtitle="Receive promotional emails"
                        rightElement={
                            <Switch
                                value={emailEnabled}
                                onValueChange={setEmailEnabled}
                                trackColor={{ false: colors.border, true: colors.primary }}
                                thumbColor="#FFFFFF"
                            />
                        }
                    />
                </View>

                {/* Support */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                        SUPPORT
                    </Text>
                    <SettingItem
                        icon="help-circle-outline"
                        title="Help Center"
                        onPress={() => { }}
                    />
                    <SettingItem
                        icon="chatbubble-outline"
                        title="Contact Support"
                        subtitle={Config.SUPPORT_EMAIL}
                        onPress={handleContactSupport}
                    />
                    <SettingItem
                        icon="document-text-outline"
                        title="Terms of Service"
                        onPress={() => { }}
                    />
                    <SettingItem
                        icon="shield-outline"
                        title="Privacy Policy"
                        onPress={() => { }}
                    />
                </View>

                {/* About */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                        ABOUT
                    </Text>
                    <SettingItem
                        icon="star-outline"
                        title="Rate the App"
                        onPress={handleRateApp}
                    />
                    <SettingItem
                        icon="information-circle-outline"
                        title="App Version"
                        subtitle={Config.APP_VERSION}
                    />
                </View>

                <View style={{ height: Spacing['3xl'] }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: Spacing.lg,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        fontSize: Fonts.sizes.sm,
        fontWeight: Fonts.weights.semibold,
        marginBottom: Spacing.md,
        marginLeft: Spacing.xs,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.sm,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingContent: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    settingTitle: {
        fontSize: Fonts.sizes.md,
        fontWeight: Fonts.weights.medium,
    },
    settingSubtitle: {
        fontSize: Fonts.sizes.sm,
        marginTop: 2,
    },
});

export default SettingsScreen;
