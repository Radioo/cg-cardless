import { renderHook, act } from '@testing-library/react-native';
import * as Clipboard from 'expo-clipboard';
import { useCopyFeedback } from '@/hooks/use-copy-feedback';

jest.useFakeTimers();

describe('useCopyFeedback', () => {
    it('sets copiedKey after copy and resets after timeout', async () => {
        const { result } = renderHook(() => useCopyFeedback());
        expect(result.current.copiedKey).toBeNull();

        await act(async () => {
            await result.current.copy('hello');
        });

        expect(Clipboard.setStringAsync).toHaveBeenCalledWith('hello');
        expect(result.current.copiedKey).toBe(true);

        act(() => {
            jest.advanceTimersByTime(2000);
        });

        expect(result.current.copiedKey).toBeNull();
    });

    it('tracks keyed copy feedback', async () => {
        const { result } = renderHook(() => useCopyFeedback<'a' | 'b'>(1000));

        await act(async () => {
            await result.current.copy('text-a', 'a');
        });

        expect(result.current.copiedKey).toBe('a');

        await act(async () => {
            await result.current.copy('text-b', 'b');
        });

        expect(result.current.copiedKey).toBe('b');

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(result.current.copiedKey).toBeNull();
    });
});
