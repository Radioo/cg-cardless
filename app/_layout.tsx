import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { Platform } from 'react-native';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

const lightTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: Colors.light.background, card: Colors.light.background },
};

const darkTheme = {
    ...DarkTheme,
    colors: { ...DarkTheme.colors, background: Colors.dark.background, card: Colors.dark.background },
};

export default function RootLayout() {
    const [queryClient] = useState(() => new QueryClient());
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

    useEffect(() => {
        SystemUI.setBackgroundColorAsync(theme.colors.background);
    }, [theme.colors.background]);

    useEffect(() => {
        if (Platform.OS === 'web') {
            const origPush = window.history.pushState.bind(window.history);
            const origReplace = window.history.replaceState.bind(window.history);
            window.history.pushState = (state: unknown, title: string, _url?: string | URL | null) => origPush(state, title, '/');
            window.history.replaceState = (state: unknown, title: string, _url?: string | URL | null) => origReplace(state, title, '/');
            return () => {
                window.history.pushState = origPush;
                window.history.replaceState = origReplace;
            };
        }
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider value={theme}>
                <Stack screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: theme.colors.background },
                    animation: 'fade',
                }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="scan-result" />
                    <Stack.Screen name="settings" />
                    <Stack.Screen name="closed" />
                </Stack>
                <StatusBar style="auto" />
            </ThemeProvider>
        </QueryClientProvider>
    );
}
