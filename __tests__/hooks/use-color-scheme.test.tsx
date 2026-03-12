import { renderHook } from '@testing-library/react-native';
import { useColorScheme as useNativewindColorScheme } from 'nativewind';

// The global mock in jest.setup.js already mocks both nativewind and @/hooks/use-color-scheme.
// We use requireActual to get the real hook and test its behavior against the mocked dependencies.

const mockSetColorScheme = jest.fn();
const mockToggleColorScheme = jest.fn();

// Override the nativewind mock for this test file
(useNativewindColorScheme as jest.Mock).mockReturnValue({
    colorScheme: 'light',
    setColorScheme: mockSetColorScheme,
    toggleColorScheme: mockToggleColorScheme,
});

// Get the real hook (bypass the global mock)
const { useColorScheme } = jest.requireActual<typeof import('@/hooks/use-color-scheme')>(
    '@/hooks/use-color-scheme'
);

beforeEach(() => {
    jest.clearAllMocks();
    (useNativewindColorScheme as jest.Mock).mockReturnValue({
        colorScheme: 'light',
        setColorScheme: mockSetColorScheme,
        toggleColorScheme: mockToggleColorScheme,
    });
});

describe('useColorScheme', () => {
    it('returns light when nativewind reports light', () => {
        const { result } = renderHook(() => useColorScheme());

        expect(result.current.colorScheme).toBe('light');
        expect(result.current.isDarkColorScheme).toBe(false);
    });

    it('returns dark when nativewind reports dark', () => {
        (useNativewindColorScheme as jest.Mock).mockReturnValue({
            colorScheme: 'dark',
            setColorScheme: mockSetColorScheme,
            toggleColorScheme: mockToggleColorScheme,
        });

        const { result } = renderHook(() => useColorScheme());

        expect(result.current.colorScheme).toBe('dark');
        expect(result.current.isDarkColorScheme).toBe(true);
    });

    it('defaults to light when nativewind colorScheme is undefined', () => {
        (useNativewindColorScheme as jest.Mock).mockReturnValue({
            colorScheme: undefined,
            setColorScheme: mockSetColorScheme,
            toggleColorScheme: mockToggleColorScheme,
        });

        const { result } = renderHook(() => useColorScheme());

        expect(result.current.colorScheme).toBe('light');
        expect(result.current.isDarkColorScheme).toBe(false);
    });

    it('exposes setColorScheme from nativewind', () => {
        const { result } = renderHook(() => useColorScheme());

        expect(result.current.setColorScheme).toBe(mockSetColorScheme);
    });

    it('exposes toggleColorScheme from nativewind', () => {
        const { result } = renderHook(() => useColorScheme());

        expect(result.current.toggleColorScheme).toBe(mockToggleColorScheme);
    });
});
