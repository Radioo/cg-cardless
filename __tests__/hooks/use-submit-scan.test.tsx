import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useSubmitScan } from '@/hooks/use-submit-scan';
import { createWrapper } from '../helpers';

const TEST_URL = 'https://example.com/api';
const TEST_CARD_ID = 'ABC123';

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
            () => useSubmitScan(),
            { wrapper: createWrapper() },
        );

        act(() => {
            result.current.mutate({ url: TEST_URL, cardId: TEST_CARD_ID });
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(global.fetch).toHaveBeenCalledWith(`${TEST_URL}/${TEST_CARD_ID}`);
    });

    it('does not fetch until mutate is called', () => {
        const { result } = renderHook(
            () => useSubmitScan(),
            { wrapper: createWrapper() },
        );

        expect(result.current.isIdle).toBe(true);
        expect(result.current.isError).toBe(false);
        expect(global.fetch).not.toHaveBeenCalled();
    });

    it('reports errors from failed requests', async () => {
        (global.fetch as jest.Mock).mockImplementation(() =>
            Promise.resolve({
                ok: false,
                status: 500,
                json: () => Promise.resolve({}),
            }),
        );

        const { result } = renderHook(
            () => useSubmitScan(),
            { wrapper: createWrapper() },
        );

        act(() => {
            result.current.mutate({ url: TEST_URL, cardId: TEST_CARD_ID });
        });

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error?.message).toMatch(/500/);
    });
});
