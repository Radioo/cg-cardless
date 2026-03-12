import { QR_PATTERN, ScanError, submitScan } from '@/utils/scan';

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

describe('submitScan', () => {
    it('resolves on success', async () => {
        await submitScan(TEST_URL, TEST_CARD_ID);
        expect(global.fetch).toHaveBeenCalledWith(`${TEST_URL}/${TEST_CARD_ID}`);
    });

    it('appends cardId without double slash', async () => {
        await submitScan(`${TEST_URL}/`, TEST_CARD_ID);
        expect(global.fetch).toHaveBeenCalledWith(`${TEST_URL}/${TEST_CARD_ID}`);
    });

    it('throws ScanError on HTTP failure', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 500 });
        await expect(submitScan(TEST_URL, 'X')).rejects.toThrow(ScanError);
    });

    it('throws ScanError on invalid JSON', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.reject(new SyntaxError('bad json')),
        });
        await expect(submitScan(TEST_URL, 'X')).rejects.toThrow('Server returned invalid response');
    });

    it('throws ScanError on server error field', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ error: 'Server error' }),
        });
        await expect(submitScan(TEST_URL, 'X')).rejects.toThrow('Server error');
    });

    it('throws ScanError on unexpected response', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ something: 'else' }),
        });
        await expect(submitScan(TEST_URL, 'X')).rejects.toThrow('Unexpected response');
    });
});

describe('QR_PATTERN', () => {
    it('matches valid QR URLs', () => {
        const valid = 'https://example.com/sppass/' + 'a'.repeat(64);
        expect(QR_PATTERN.test(valid)).toBe(true);
    });

    it('rejects invalid URLs', () => {
        expect(QR_PATTERN.test('https://example.com/other')).toBe(false);
        expect(QR_PATTERN.test('not-a-url')).toBe(false);
    });
});

describe('ScanError', () => {
    it('is an instance of Error', () => {
        const err = new ScanError('test');
        expect(err).toBeInstanceOf(Error);
        expect(err).toBeInstanceOf(ScanError);
        expect(err.name).toBe('ScanError');
    });
});
