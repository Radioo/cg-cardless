import { renderHook } from '@testing-library/react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors } from '@/constants/theme';

jest.mock('@/hooks/use-color-scheme', () => ({
    useColorScheme: jest.fn(() => 'light'),
}));

describe('useThemeColor', () => {
    it('returns theme color for light mode', () => {
        const { result } = renderHook(() => useThemeColor('text'));
        expect(result.current).toBe(Colors.light.text);
    });

    it('returns dark mode color when scheme is dark', () => {
        const { useColorScheme } = require('@/hooks/use-color-scheme');
        useColorScheme.mockReturnValue('dark');

        const { result } = renderHook(() => useThemeColor('text'));
        expect(result.current).toBe(Colors.dark.text);

        useColorScheme.mockReturnValue('light');
    });
});
