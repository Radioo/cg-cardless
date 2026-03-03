export class ScanError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ScanError';
    }
}

export async function submitScan(url: string, cardId: string) {
    const endpoint = url.endsWith('/') ? `${url}${cardId}` : `${url}/${cardId}`;
    const res = await fetch(endpoint);

    let json: { error?: string; success?: boolean };
    try {
        json = await res.json();
    } catch {
        throw new ScanError('Server returned invalid response');
    }

    if (json.error) {
        throw new ScanError(json.error);
    }

    if (!json.success) {
        throw new ScanError('Unexpected response');
    }

    return json;
}
