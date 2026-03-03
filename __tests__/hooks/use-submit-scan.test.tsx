import { renderHook, waitFor } from '@testing-library/react-native';
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
            () => useSubmitScan(TEST_URL, TEST_CARD_ID),
            { wrapper: createWrapper() },
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(global.fetch).toHaveBeenCalledWith(`${TEST_URL}/${TEST_CARD_ID}`);
    });

    it('returns error when params are missing', async () => {
        const { result } = renderHook(
            () => useSubmitScan(undefined, undefined),
            { wrapper: createWrapper() },
        );

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error?.message).toBe('Missing scan parameters');
    });
});
