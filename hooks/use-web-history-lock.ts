import { useEffect } from 'react';
import { Platform } from 'react-native';

export function useWebHistoryLock() {
    useEffect(() => {
        if (Platform.OS !== 'web') {
            return;
        }
        const origPush = window.history.pushState.bind(window.history);
        const origReplace = window.history.replaceState.bind(window.history);
        window.history.pushState = (state: unknown, title: string, _url?: string | URL | null) => origPush(state, title, '/');
        window.history.replaceState = (state: unknown, title: string, _url?: string | URL | null) => origReplace(state, title, '/');
        return () => {
            window.history.pushState = origPush;
            window.history.replaceState = origReplace;
        };
    }, []);
}
