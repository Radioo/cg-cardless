import { renderHook } from '@testing-library/react-native';
import { Platform } from 'react-native';
import { useWebHistoryLock } from '@/hooks/use-web-history-lock';

const originalPlatformOS = Platform.OS;

afterEach(() => {
    Platform.OS = originalPlatformOS;
});

describe('useWebHistoryLock', () => {
    it('does nothing on non-web platforms', () => {
        Platform.OS = 'android' as typeof Platform.OS;

        const { unmount } = renderHook(() => useWebHistoryLock());
        expect(() => unmount()).not.toThrow();
    });

    it('patches pushState and replaceState to always use / on web', () => {
        Platform.OS = 'web' as typeof Platform.OS;

        const calls: { method: string; url: string | URL | null | undefined }[] = [];
        const mockPush = jest.fn((_state: unknown, _title: string, url?: string | URL | null) => {
            calls.push({ method: 'push', url });
        });
        const mockReplace = jest.fn((_state: unknown, _title: string, url?: string | URL | null) => {
            calls.push({ method: 'replace', url });
        });

        const origHistory = window.history;
        Object.defineProperty(window, 'history', {
            writable: true,
            configurable: true,
            value: { pushState: mockPush, replaceState: mockReplace },
        });

        const { unmount } = renderHook(() => useWebHistoryLock());

        // Patched pushState should redirect URLs to /
        window.history.pushState(null, '', '/some/path');
        expect(calls).toEqual([{ method: 'push', url: '/' }]);

        window.history.replaceState(null, '', '/other');
        expect(calls).toEqual([
            { method: 'push', url: '/' },
            { method: 'replace', url: '/' },
        ]);

        // Unmount should restore so calls go through unmodified
        unmount();
        calls.length = 0;
        window.history.pushState(null, '', '/after-unmount');
        expect(calls).toEqual([{ method: 'push', url: '/after-unmount' }]);

        Object.defineProperty(window, 'history', {
            writable: true,
            configurable: true,
            value: origHistory,
        });
    });
});
