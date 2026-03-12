import '@/global.css';

import { Theme, ThemeProvider } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { PortalHost } from '@rn-primitives/portal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { GlobalErrorBoundary } from '@/components/global-error-boundary';
import { useWebHistoryLock } from '@/hooks/use-web-history-lock';
import { NAV_THEME } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const SYSTEM_FONTS: Theme['fonts'] = {
    regular: { fontFamily: 'System', fontWeight: '400' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: '700' },
    heavy: { fontFamily: 'System', fontWeight: '900' },
};

const LIGHT_THEME: Theme = {
    dark: false,
    fonts: SYSTEM_FONTS,
    colors: NAV_THEME.light,
};

const DARK_THEME: Theme = {
    dark: true,
    fonts: SYSTEM_FONTS,
    colors: NAV_THEME.dark,
};

export default function RootLayout() {
    const [fontsLoaded] = useFonts(Ionicons.font);
    const [queryClient] = useState(() => new QueryClient());
    const { isDarkColorScheme } = useColorScheme();
    const theme = isDarkColorScheme ? DARK_THEME : LIGHT_THEME;

    useEffect(() => {
        SystemUI.setBackgroundColorAsync(theme.colors.background);
    }, [theme.colors.background]);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.getElementById('__loader')?.remove();
        }
    }, []);

    useWebHistoryLock();

    if (!fontsLoaded) {
        return null;
    }

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
