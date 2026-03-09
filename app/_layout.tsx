import '@/global.css';

import { Theme, ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { Platform } from 'react-native';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { GlobalErrorBoundary } from '@/components/global-error-boundary';
import { NAV_THEME } from '@/lib/theme';
import { useColorScheme } from '@/lib/use-color-scheme';

const LIGHT_THEME: Theme = {
    dark: false,
    fonts: {
        regular: { fontFamily: 'System', fontWeight: '400' },
        medium: { fontFamily: 'System', fontWeight: '500' },
        bold: { fontFamily: 'System', fontWeight: '700' },
        heavy: { fontFamily: 'System', fontWeight: '900' },
    },
    colors: NAV_THEME.light,
};

const DARK_THEME: Theme = {
    dark: true,
    fonts: {
        regular: { fontFamily: 'System', fontWeight: '400' },
        medium: { fontFamily: 'System', fontWeight: '500' },
        bold: { fontFamily: 'System', fontWeight: '700' },
        heavy: { fontFamily: 'System', fontWeight: '900' },
    },
    colors: NAV_THEME.dark,
};

export default function RootLayout() {
    const [queryClient] = useState(() => new QueryClient());
    const { isDarkColorScheme } = useColorScheme();
    const theme = isDarkColorScheme ? DARK_THEME : LIGHT_THEME;

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
        <GlobalErrorBoundary>
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
                    <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
                    <PortalHost />
                </ThemeProvider>
            </QueryClientProvider>
        </GlobalErrorBoundary>
    );
}
