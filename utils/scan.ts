export const QR_PATTERN = /^https:\/\/.+\/sppass\/[a-zA-Z0-9]{64}$/;

export class ScanError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = 'ScanError';
    }
}

export async function submitScan(url: string, cardId: string): Promise<void> {
    const endpoint = url.endsWith('/') ? `${url}${cardId}` : `${url}/${cardId}`;
    const res = await fetch(endpoint);

    if (!res.ok) {
        throw new ScanError(`Server returned ${res.status}`);
    }

    let json: { error?: string; success?: boolean };
    try {
        json = await res.json();
    } catch (e) {
        throw new ScanError('Server returned invalid response', { cause: e });
    }

    if (json.error) {
        throw new ScanError(json.error);
    }

    if (!json.success) {
        throw new ScanError('Unexpected response');
    }
}
