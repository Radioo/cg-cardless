import { renderHook, waitFor } from '@testing-library/react-native';
import { useSubmitScan } from '@/hooks/use-submit-scan';
import { createWrapper } from '../helpers';

beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true }),
        }),
    ) as jest.Mock;
});

describe('useSubmitScan', () => {
    it('submits scan and returns success', async () => {
        const { result } = renderHook(
            () => useSubmitScan('https://example.com/api', 'ABC123'),
            { wrapper: createWrapper() },
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(global.fetch).toHaveBeenCalledWith('https://example.com/api/ABC123');
    });

    it('returns error when params are missing', async () => {
        const { result } = renderHook(
            () => useSubmitScan(undefined, undefined),
            { wrapper: createWrapper() },
        );

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error?.message).toBe('Missing scan parameters');
    });

    it('returns error on HTTP failure', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 500 });

        const { result } = renderHook(
            () => useSubmitScan('https://example.com', 'X'),
            { wrapper: createWrapper() },
        );

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error?.message).toMatch(/Request failed: 500/);
    });
});
