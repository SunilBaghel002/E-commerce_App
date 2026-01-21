// Root layout for Expo Router
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
                    animation: 'slide_from_right',
                }}
            >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)/login" options={{ presentation: 'modal' }} />
                <Stack.Screen name="(auth)/register" options={{ presentation: 'modal' }} />
                <Stack.Screen name="(auth)/forgot-password" options={{ presentation: 'modal' }} />
                <Stack.Screen name="product/[id]" />
                <Stack.Screen name="search" />
                <Stack.Screen name="checkout" />
                <Stack.Screen name="payment" />
                <Stack.Screen name="order-success" options={{ gestureEnabled: false }} />
                <Stack.Screen name="orders/index" />
                <Stack.Screen name="orders/[id]" />
                <Stack.Screen name="addresses/index" />
                <Stack.Screen name="settings" />
                <Stack.Screen name="notifications" />
            </Stack>
        </>
    );
}

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <Provider store={store}>
                    <ThemeProvider>
                        <RootLayoutNav />
                    </ThemeProvider>
                </Provider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
