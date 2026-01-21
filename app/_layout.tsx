// Root layout for Expo Router
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { store } from '../store';

function RootLayoutNav() {
    const { isDark, colors } = useTheme();

    return (
        <>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: colors.background },
                }}
            />
        </>
    );
}

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <Provider store={store}>
                <ThemeProvider>
                    <RootLayoutNav />
                </ThemeProvider>
            </Provider>
        </SafeAreaProvider>
    );
}
