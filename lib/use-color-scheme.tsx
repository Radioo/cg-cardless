import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

export function useColorScheme() {
    const systemScheme = useRNColorScheme();
    const { colorScheme, setColorScheme, toggleColorScheme } = useNativewindColorScheme();

    useEffect(() => {
        if (systemScheme) {
            setColorScheme(systemScheme);
        }
    }, [systemScheme, setColorScheme]);

    return {
        colorScheme: colorScheme ?? 'light',
        isDarkColorScheme: colorScheme === 'dark',
        setColorScheme,
        toggleColorScheme,
    };
}
