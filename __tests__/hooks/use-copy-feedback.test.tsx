import { renderHook, act } from '@testing-library/react-native';
import * as Clipboard from 'expo-clipboard';
import { useCopyFeedback } from '@/hooks/use-copy-feedback';

jest.useFakeTimers();

describe('useCopyFeedback', () => {
    it('sets copiedKey after copy and resets after timeout', async () => {
        const { result } = await renderHook(() => useCopyFeedback());
        expect(result.current.copiedKey).toBeNull();

        await act(async () => {
            await result.current.copy('hello');
        });

        expect(Clipboard.setStringAsync).toHaveBeenCalledWith('hello');
        expect(result.current.copiedKey).toBe(true);

        await act(() => {
            jest.advanceTimersByTime(2000);
        });

        expect(result.current.copiedKey).toBeNull();
    });

    it('tracks keyed copy feedback', async () => {
        const { result } = await renderHook(() => useCopyFeedback<'a' | 'b'>(1000));

        await act(async () => {
            await result.current.copy('text-a', 'a');
        });

        expect(result.current.copiedKey).toBe('a');

        await act(async () => {
            await result.current.copy('text-b', 'b');
        });

        expect(result.current.copiedKey).toBe('b');

        await act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(result.current.copiedKey).toBeNull();
    });

    it('clears the pending reset timer on unmount', async () => {
        const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
        const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
        const { result, unmount } = await renderHook(() => useCopyFeedback());

        await act(async () => {
            await result.current.copy('hello');
        });
        const resetTimerIndex = setTimeoutSpy.mock.calls.findIndex(([, delay]) => delay === 2000);
        const resetTimer = setTimeoutSpy.mock.results[resetTimerIndex].value;

        await unmount();

        expect(clearTimeoutSpy).toHaveBeenCalledWith(resetTimer);
        setTimeoutSpy.mockRestore();
        clearTimeoutSpy.mockRestore();
    });
});
